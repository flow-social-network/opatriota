<?php
/**
 * Normalizador de URLs para deduplicação canônica
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Url_Normalizer {

	/**
	 * Normaliza a URL removendo parâmetros de rastreamento e padronizando formato
	 */
	public static function normalize( $url ) {
		$url = trim( $url );
		$parsed = wp_parse_url( $url );

		if ( empty( $parsed['host'] ) ) {
			return $url;
		}

		$scheme = ! empty( $parsed['scheme'] ) ? strtolower( $parsed['scheme'] ) : 'https';
		$host = strtolower( $parsed['host'] );
		// Remover 'www.' para fins de comparação canônica
		if ( strpos( $host, 'www.' ) === 0 ) {
			$host = substr( $host, 4 );
		}

		$path = ! empty( $parsed['path'] ) ? $parsed['path'] : '/';
		// Remover barra final duplicada
		$path = rtrim( $path, '/' );
		if ( empty( $path ) ) {
			$path = '/';
		}

		$normalized = $scheme . '://' . $host . $path;

		// Limpar parâmetros de rastreamento do query string
		if ( ! empty( $parsed['query'] ) ) {
			parse_str( $parsed['query'], $query_params );
			$strip_params = array(
				'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
				'fbclid', 'gclid', 'ref', 'source', 'campaign', 'mc_cid', 'mc_eid'
			);

			foreach ( $strip_params as $param ) {
				unset( $query_params[ $param ] );
			}

			if ( ! empty( $query_params ) ) {
				ksort( $query_params );
				$normalized .= '?' . http_build_query( $query_params );
			}
		}

		return $normalized;
	}
}
