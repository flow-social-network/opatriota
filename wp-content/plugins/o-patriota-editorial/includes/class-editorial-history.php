<?php
/**
 * Trilha de Auditoria e Histórico Editorial
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Editorial_History {

	/**
	 * Registra uma ação editorial no banco de dados
	 */
	public static function log_action( $entry ) {
		global $wpdb;
		$table = $wpdb->prefix . 'patriota_editorial_history';

		$wpdb->insert(
			$table,
			array(
				'item_id'         => ! empty( $entry['item_id'] ) ? (int) $entry['item_id'] : null,
				'post_id'         => ! empty( $entry['post_id'] ) ? (int) $entry['post_id'] : null,
				'user_id'         => (int) $entry['user_id'],
				'action_name'     => sanitize_text_field( $entry['action_name'] ),
				'previous_status' => ! empty( $entry['previous_status'] ) ? sanitize_text_field( $entry['previous_status'] ) : null,
				'new_status'      => sanitize_text_field( $entry['new_status'] ),
				'editorial_notes' => ! empty( $entry['editorial_notes'] ) ? sanitize_textarea_field( $entry['editorial_notes'] ) : null,
			)
		);
	}

	/**
	 * Recupera histórico recente de auditoria
	 */
	public static function get_recent_logs( $limit = 50 ) {
		global $wpdb;
		$table = $wpdb->prefix . 'patriota_editorial_history';
		return $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$table} ORDER BY id DESC LIMIT %d", (int) $limit ) );
	}
}
