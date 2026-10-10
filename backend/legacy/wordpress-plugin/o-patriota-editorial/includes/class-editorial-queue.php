<?php
/**
 * Fila Editorial e Ciclo de Vida da Redação
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Editorial_Queue {

	public static $allowed_statuses = array(
		'RECEBIDA'      => 'Recebida',
		'EM TRIAGEM'    => 'Em Triagem',
		'EM APURAÇÃO'   => 'Em Apuração',
		'EM REDAÇÃO'    => 'Em Redação',
		'EM REVISÃO'    => 'Em Revisão',
		'APROVADA'      => 'Aprovada',
		'AGENDADA'      => 'Agendada',
		'PUBLICADA'     => 'Publicada',
		'REJEITADA'     => 'Rejeitada',
		'ARQUIVADA'     => 'Arquivada',
	);

	/**
	 * Transição de estado com auditoria
	 */
	public static function transition_status( $item_id, $new_status, $user_id, $notes = '' ) {
		global $wpdb;
		$table_items = $wpdb->prefix . 'patriota_raw_items';

		if ( ! array_key_exists( $new_status, self::$allowed_statuses ) ) {
			return new WP_Error( 'invalid_status', 'Status editorial não reconhecido.' );
		}

		$current = $wpdb->get_row( $wpdb->prepare( "SELECT id, editorial_status FROM {$table_items} WHERE id = %d", $item_id ) );
		if ( ! $current ) {
			return new WP_Error( 'not_found', 'Item não encontrado.' );
		}

		$prev_status = $current->editorial_status;

		// Atualizar item
		$wpdb->update(
			$table_items,
			array( 'editorial_status' => $new_status ),
			array( 'id' => $item_id )
		);

		// Registrar na auditoria
		O_Patriota_Editorial_History::log_action( array(
			'item_id'         => $item_id,
			'user_id'         => $user_id,
			'action_name'     => 'TRANSIÇÃO DE STATUS',
			'previous_status' => $prev_status,
			'new_status'      => $new_status,
			'editorial_notes' => sanitize_textarea_field( $notes ),
		) );

		return true;
	}

	/**
	 * Converte item da fila em Rascunho de Post nativo do WordPress para o jornalista redigir
	 */
	public static function convert_to_draft( $item_id, $user_id ) {
		global $wpdb;
		$table_items = $wpdb->prefix . 'patriota_raw_items';

		$item = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table_items} WHERE id = %d", $item_id ) );
		if ( ! $item ) {
			return new WP_Error( 'not_found', 'Item não encontrado.' );
		}

		// Criar post em rascunho (DRAFT)
		$post_id = wp_insert_post( array(
			'post_title'   => $item->title,
			'post_content' => sprintf(
				"<!-- wp:paragraph -->\n<p>%s</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:paragraph -->\n<p><em>Fonte de apuração inicial: <a href=\"%s\" target=\"_blank\" rel=\"noopener\">%s</a> (Acessado em %s).</em></p>\n<!-- /wp:paragraph -->",
				esc_html( $item->summary ),
				esc_url( $item->original_url ),
				esc_html( $item->original_url ),
				date_i18n( 'd/m/Y' )
			),
			'post_status'  => 'draft',
			'post_author'  => $user_id,
			'post_type'    => 'post',
		) );

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		// Salvar metadados editoriais
		update_post_meta( $post_id, '_patriota_source_url', $item->original_url );
		update_post_meta( $post_id, '_patriota_raw_item_id', $item->id );
		update_post_meta( $post_id, '_patriota_editorial_status', 'EM REDAÇÃO' );

		// Atualizar item na fila
		$wpdb->update(
			$table_items,
			array(
				'editorial_status'   => 'EM REDAÇÃO',
				'converted_post_id'  => $post_id,
				'assigned_to_user_id' => $user_id,
			),
			array( 'id' => $item_id )
		);

		O_Patriota_Editorial_History::log_action( array(
			'item_id'         => $item_id,
			'post_id'         => $post_id,
			'user_id'         => $user_id,
			'action_name'     => 'CONVERSÃO PARA RASCUNHO WP',
			'previous_status' => $item->editorial_status,
			'new_status'      => 'EM REDAÇÃO',
			'editorial_notes' => 'Pauta convertida para post de redação #' . $post_id,
		) );

		return $post_id;
	}
}
