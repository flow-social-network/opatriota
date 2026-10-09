<?php
/**
 * Ingestão Segura de Feeds RSS
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Rss_Ingestion {

	/**
	 * Processa uma fonte individual com proteção XXE e SSRF
	 */
	public static function ingest_source( $source ) {
		global $wpdb;
		$table_sources = $wpdb->prefix . 'patriota_sources';
		$table_items = $wpdb->prefix . 'patriota_raw_items';

		if ( ! O_Patriota_Source_Manager::is_safe_url( $source->rss_url ) ) {
			$wpdb->update(
				$table_sources,
				array( 'last_error' => 'URL rejeitada por SSRF/segurança.', 'last_polled' => current_time( 'mysql' ) ),
				array( 'id' => $source->id )
			);
			return 0;
		}

		$response = wp_safe_remote_get( $source->rss_url, array(
			'timeout'     => 15,
			'redirection' => 2,
			'user-agent'  => 'OPatriotaBot/1.0 (+https://opatriota.com.br/expediente)',
		) );

		if ( is_wp_error( $response ) ) {
			$wpdb->update(
				$table_sources,
				array(
					'last_error'  => $response->get_error_message(),
					'last_polled' => current_time( 'mysql' ),
				),
				array( 'id' => $source->id )
			);
			return 0;
		}

		$body = wp_remote_retrieve_body( $response );
		if ( empty( $body ) ) {
			return 0;
		}

		// Prevenção contra XXE (XML External Entity)
		$prev_entity_loader = false;
		if ( function_exists( 'libxml_disable_entity_loader' ) && PHP_VERSION_ID < 80000 ) {
			$prev_entity_loader = libxml_disable_entity_loader( true );
		}

		libxml_use_internal_errors( true );
		$xml = simplexml_load_string( $body, 'SimpleXMLElement', LIBXML_NONET );

		if ( function_exists( 'libxml_disable_entity_loader' ) && PHP_VERSION_ID < 80000 ) {
			libxml_disable_entity_loader( $prev_entity_loader );
		}

		if ( ! $xml ) {
			$wpdb->update(
				$table_sources,
				array( 'last_error' => 'XML inválido ou corrompido.', 'last_polled' => current_time( 'mysql' ) ),
				array( 'id' => $source->id )
			);
			return 0;
		}

		$items_found = 0;
		$items = array();

		if ( isset( $xml->channel->item ) ) {
			$items = $xml->channel->item;
		} elseif ( isset( $xml->entry ) ) {
			$items = $xml->entry; // Formato Atom
		}

		foreach ( $items as $entry ) {
			$title = sanitize_text_field( (string) $entry->title );
			$link  = esc_url_raw( (string) ( isset( $entry->link['href'] ) ? $entry->link['href'] : $entry->link ) );
			$guid  = ! empty( $entry->guid ) ? sanitize_text_field( (string) $entry->guid ) : md5( $link );
			$desc  = wp_strip_all_tags( (string) ( isset( $entry->description ) ? $entry->description : ( isset( $entry->summary ) ? $entry->summary : '' ) ) );
			$pub   = ! empty( $entry->pubDate ) ? date( 'Y-m-d H:i:s', strtotime( (string) $entry->pubDate ) ) : current_time( 'mysql' );

			if ( empty( $title ) || empty( $link ) ) {
				continue;
			}

			$canonical_url = O_Patriota_Url_Normalizer::normalize( $link );
			$title_hash    = O_Patriota_Deduplication::generate_title_hash( $title );

			// Avaliar deduplicação nas 5 camadas
			$eval = O_Patriota_Deduplication::evaluate( $canonical_url, $guid, $title, $source->id );

			// Inserir item na fila de triagem (nunca publica automaticamente)
			$insert = $wpdb->insert(
				$table_items,
				array(
					'source_id'             => $source->id,
					'original_guid'         => $guid,
					'original_url'          => $link,
					'canonical_url'         => $canonical_url,
					'title'                 => $title,
					'title_hash'            => $title_hash,
					'summary'               => $desc,
					'original_published_at' => $pub,
					'category_suggested'    => $source->category_slug,
					'dedup_status'          => $eval['status'],
					'dedup_reason'          => $eval['reason'],
					'editorial_status'      => 'RECEBIDA',
				)
			);

			if ( $insert ) {
				$items_found++;
			}
		}

		// Atualizar registro da fonte com sucesso
		$wpdb->query( $wpdb->prepare(
			"UPDATE {$table_sources} SET 
				last_polled = NOW(),
				last_success = NOW(),
				last_error = NULL,
				total_items_received = total_items_received + %d 
			WHERE id = %d",
			$items_found, $source->id
		) );

		return $items_found;
	}
}
