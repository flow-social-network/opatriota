<?php
/**
 * Gerenciador da Central de Fontes Oficiais
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Source_Manager {

	/**
	 * Valida URL contra SSRF e esquemas proibidos
	 */
	public static function is_safe_url( $url ) {
		$parsed = wp_parse_url( $url );
		if ( ! $parsed || empty( $parsed['scheme'] ) || empty( $parsed['host'] ) ) {
			return false;
		}

		if ( ! in_array( strtolower( $parsed['scheme'] ), array( 'http', 'https' ), true ) ) {
			return false;
		}

		$host = strtolower( $parsed['host'] );

		// Bloquear localhost e IPs privados/reservados
		if ( in_array( $host, array( 'localhost', '127.0.0.1', '::1' ), true ) ) {
			return false;
		}

		$ip = gethostbyname( $host );
		if ( filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) === false ) {
			return false;
		}

		return true;
	}

	/**
	 * Retorna lista de fontes ativas
	 */
	public static function get_active_sources() {
		global $wpdb;
		$table = $wpdb->prefix . 'patriota_sources';
		return $wpdb->get_results( "SELECT * FROM {$table} WHERE is_active = 1 ORDER BY name ASC" );
	}

	/**
	 * Adiciona ou atualiza fonte oficial
	 */
	public static function save_source( $data ) {
		global $wpdb;
		$table = $wpdb->prefix . 'patriota_sources';

		if ( ! empty( $data['rss_url'] ) && ! self::is_safe_url( $data['rss_url'] ) ) {
			return new WP_Error( 'unsafe_url', __( 'A URL do feed RSS foi rejeitada por critérios de segurança.', 'o-patriota-editorial' ) );
		}

		$fields = array(
			'name'               => sanitize_text_field( $data['name'] ),
			'source_category'    => sanitize_text_field( ! empty( $data['source_category'] ) ? $data['source_category'] : 'Congresso Nacional' ),
			'uf'                 => sanitize_text_field( ! empty( $data['uf'] ) ? $data['uf'] : 'BR' ),
			'official_url'       => esc_url_raw( $data['official_url'] ),
			'news_url'           => ! empty( $data['news_url'] ) ? esc_url_raw( $data['news_url'] ) : '',
			'rss_url'            => ! empty( $data['rss_url'] ) ? esc_url_raw( $data['rss_url'] ) : '',
			'source_type'        => sanitize_key( ! empty( $data['source_type'] ) ? $data['source_type'] : 'governo' ),
			'category_slug'      => sanitize_key( ! empty( $data['category_slug'] ) ? $data['category_slug'] : 'brasil' ),
			'integration_type'   => sanitize_text_field( ! empty( $data['integration_type'] ) ? $data['integration_type'] : 'Monitoramento Editorial' ),
			'validation_status'  => sanitize_text_field( ! empty( $data['validation_status'] ) ? $data['validation_status'] : 'VALIDADO' ),
			'is_active'          => ! empty( $data['is_active'] ) ? 1 : 0,
			'poll_frequency_min' => max( 15, (int) ( ! empty( $data['poll_frequency_min'] ) ? $data['poll_frequency_min'] : 60 ) ),
			'notes'              => ! empty( $data['notes'] ) ? sanitize_textarea_field( $data['notes'] ) : '',
		);

		if ( ! empty( $data['id'] ) ) {
			$wpdb->update( $table, $fields, array( 'id' => (int) $data['id'] ) );
			return (int) $data['id'];
		} else {
			$wpdb->insert( $table, $fields );
			return $wpdb->insert_id;
		}
	}
}
