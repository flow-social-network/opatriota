<?php
/**
 * Desativação do plugin O Patriota Editorial
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Deactivator {

	public static function deactivate() {
		// Remover agendamentos wp-cron para não consumir recursos indevidamente
		$timestamp = wp_next_scheduled( 'o_patriota_cron_poll_sources' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'o_patriota_cron_poll_sources' );
		}
	}
}
