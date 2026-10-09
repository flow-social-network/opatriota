<?php
/**
 * Ações de ativação do plugin O Patriota Editorial
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Activator {

	public static function activate() {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset_collate = $wpdb->get_charset_collate();

		// Tabela 1: Fontes Oficiais e Feeds RSS
		$table_sources = $wpdb->prefix . 'patriota_sources';
		$sql_sources = "CREATE TABLE $table_sources (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			name varchar(255) NOT NULL,
			source_category varchar(100) NOT NULL DEFAULT 'Congresso Nacional',
			uf varchar(10) NOT NULL DEFAULT 'BR',
			official_url varchar(500) NOT NULL,
			news_url varchar(500) NULL,
			rss_url varchar(500) NOT NULL,
			source_type varchar(50) NOT NULL DEFAULT 'governo',
			category_slug varchar(100) NOT NULL DEFAULT 'brasil',
			integration_type varchar(50) NOT NULL DEFAULT 'Monitoramento Editorial',
			validation_status varchar(50) NOT NULL DEFAULT 'VALIDADO',
			is_active tinyint(1) NOT NULL DEFAULT 1,
			poll_frequency_min int(11) NOT NULL DEFAULT 60,
			last_polled datetime NULL,
			last_success datetime NULL,
			last_verified datetime NULL,
			last_imported datetime NULL,
			last_error text NULL,
			total_items_received int(11) NOT NULL DEFAULT 0,
			notes text NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			PRIMARY KEY  (id),
			KEY is_active (is_active),
			KEY source_category_idx (source_category),
			KEY uf_idx (uf)
		) $charset_collate;";
		dbDelta( $sql_sources );

		// Tabela 2: Itens Brutos Recebidos e Triagem
		$table_raw_items = $wpdb->prefix . 'patriota_raw_items';
		$sql_raw_items = "CREATE TABLE $table_raw_items (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			source_id bigint(20) NOT NULL,
			original_guid varchar(255) NOT NULL,
			original_url varchar(500) NOT NULL,
			canonical_url varchar(500) NOT NULL,
			title varchar(500) NOT NULL,
			title_hash varchar(64) NOT NULL,
			summary text NULL,
			author_name varchar(255) NULL,
			original_published_at datetime NULL,
			captured_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			category_suggested varchar(100) DEFAULT 'geral',
			dedup_status varchar(50) NOT NULL DEFAULT 'NOVO',
			dedup_reason text NULL,
			editorial_status varchar(50) NOT NULL DEFAULT 'RECEBIDA',
			assigned_to_user_id bigint(20) NULL,
			converted_post_id bigint(20) NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY canonical_url_idx (canonical_url(191)),
			KEY title_hash_idx (title_hash),
			KEY editorial_status_idx (editorial_status),
			KEY source_id_idx (source_id)
		) $charset_collate;";
		dbDelta( $sql_raw_items );

		// Tabela 3: Histórico e Auditoria Editorial
		$table_history = $wpdb->prefix . 'patriota_editorial_history';
		$sql_history = "CREATE TABLE $table_history (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			item_id bigint(20) NULL,
			post_id bigint(20) NULL,
			user_id bigint(20) NOT NULL,
			action_name varchar(100) NOT NULL,
			previous_status varchar(50) NULL,
			new_status varchar(50) NOT NULL,
			editorial_notes text NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			PRIMARY KEY  (id),
			KEY item_id_idx (item_id),
			KEY post_id_idx (post_id)
		) $charset_collate;";
		dbDelta( $sql_history );

		// Agendar cron periódico para consulta de fontes RSS
		if ( ! wp_next_scheduled( 'o_patriota_cron_poll_sources' ) ) {
			wp_schedule_event( time(), 'hourly', 'o_patriota_cron_poll_sources' );
		}

		// Adicionar permissões personalizadas
		O_Patriota_Capabilities::add_capabilities();
	}
}
