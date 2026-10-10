<?php
/**
 * Motor de Deduplicação em 5 Camadas
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Deduplication {

	/**
	 * Gera hash normalizado do título
	 */
	public static function generate_title_hash( $title ) {
		$clean = mb_strtolower( trim( $title ), 'UTF-8' );
		// Remover acentos e caracteres especiais para comparação fonética básica
		$clean = preg_replace( '/[^\p{L}\p{N}\s]/u', '', $clean );
		$clean = preg_replace( '/\s+/', ' ', $clean );
		return hash( 'sha256', $clean );
	}

	/**
	 * Avalia um novo item contra a base de dados
	 */
	public static function evaluate( $canonical_url, $guid, $title, $source_id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'patriota_raw_items';
		$title_hash = self::generate_title_hash( $title );

		// CAMADA 1: URL Canônica Exata
		$match_url = $wpdb->get_row( $wpdb->prepare(
			"SELECT id, original_url, editorial_status FROM {$table} WHERE canonical_url = %s LIMIT 1",
			$canonical_url
		) );
		if ( $match_url ) {
			return array(
				'status' => 'DUPLICADO CONFIRMADO',
				'reason' => 'Camada 1: URL Canônica Idêntica ao item #' . $match_url->id,
				'matched_id' => $match_url->id
			);
		}

		// CAMADA 2: GUID Original do Feed
		$match_guid = $wpdb->get_row( $wpdb->prepare(
			"SELECT id FROM {$table} WHERE original_guid = %s AND source_id = %d LIMIT 1",
			$guid, $source_id
		) );
		if ( $match_guid ) {
			return array(
				'status' => 'DUPLICADO CONFIRMADO',
				'reason' => 'Camada 2: GUID RSS duplicado para a mesma fonte #' . $match_guid->id,
				'matched_id' => $match_guid->id
			);
		}

		// CAMADA 3: Hash do Título Normalizado
		$match_hash = $wpdb->get_row( $wpdb->prepare(
			"SELECT id, title FROM {$table} WHERE title_hash = %s LIMIT 1",
			$title_hash
		) );
		if ( $match_hash ) {
			return array(
				'status' => 'POSSÍVEL DUPLICADO',
				'reason' => 'Camada 3: Título com hash idêntico ao item #' . $match_hash->id,
				'matched_id' => $match_hash->id
			);
		}

		// CAMADA 4: Similaridade de Título nas últimas 72 horas
		$recent_items = $wpdb->get_results(
			"SELECT id, title FROM {$table} WHERE captured_at >= DATE_SUB(NOW(), INTERVAL 72 HOUR) ORDER BY id DESC LIMIT 100"
		);

		foreach ( $recent_items as $item ) {
			similar_text( mb_strtolower( $title ), mb_strtolower( $item->title ), $percent );
			if ( $percent >= 82 ) {
				return array(
					'status' => 'REVISÃO MANUAL',
					'reason' => sprintf( 'Camada 4: Similaridade textual de %.1f%% com o item #%d ("%s")', $percent, $item->id, wp_trim_words( $item->title, 6 ) ),
					'matched_id' => $item->id
				);
			}
		}

		// CAMADA 5: Item inédito
		return array(
			'status' => 'NOVO',
			'reason' => 'Camada 5: Nenhuma correspondência detectada nas camadas 1 a 4.',
			'matched_id' => null
		);
	}
}
