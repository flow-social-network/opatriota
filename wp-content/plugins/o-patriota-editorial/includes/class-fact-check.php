<?php
/**
 * Módulo de Checagem de Fatos e Schema.org ClaimReview
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Fact_Check {

	public static $verdicts = array(
		'VERDADEIRO'       => array( 'label' => 'Verdadeiro', 'color' => '#16803C' ),
		'FALSO'            => array( 'label' => 'Falso', 'color' => '#B42318' ),
		'ENGANOSO'         => array( 'label' => 'Enganoso', 'color' => '#D97706' ),
		'FORA DE CONTEXTO' => array( 'label' => 'Fora de Contexto', 'color' => '#2563EB' ),
		'NÃO COMPROVADO'   => array( 'label' => 'Não Comprovado', 'color' => '#5D6673' ),
	);

	/**
	 * Renderiza JSON-LD Schema.org ClaimReview para posts de checagem
	 */
	public static function render_claim_review_schema( $post_id ) {
		$verdict = get_post_meta( $post_id, '_patriota_factcheck_verdict', true );
		$claim   = get_post_meta( $post_id, '_patriota_factcheck_claim', true );
		$claimant = get_post_meta( $post_id, '_patriota_factcheck_claimant', true );

		if ( empty( $verdict ) || empty( $claim ) ) {
			return;
		}

		$schema = array(
			'@context'      => 'https://schema.org',
			'@type'         => 'ClaimReview',
			'url'           => get_permalink( $post_id ),
			'claimReviewed' => esc_html( $claim ),
			'itemReviewed'  => array(
				'@type'       => 'Claim',
				'author'      => array(
					'@type' => 'Person',
					'name'  => ! empty( $claimant ) ? esc_html( $claimant ) : 'Redes Sociais / Internet',
				),
				'datePublished' => get_the_date( 'Y-m-d', $post_id ),
			),
			'author'        => array(
				'@type' => 'NewsMediaOrganization',
				'name'  => 'O Patriota — Checagem de Fatos',
				'url'   => home_url(),
			),
			'reviewRating'  => array(
				'@type'         => 'Rating',
				'ratingValue'   => ( 'VERDADEIRO' === $verdict ) ? '5' : ( ( 'ENGANOSO' === $verdict ) ? '3' : '1' ),
				'bestRating'    => '5',
				'worstRating'   => '1',
				'alternateName' => esc_html( $verdict ),
			),
		);

		echo "\n<!-- Schema.org ClaimReview - O Patriota -->\n";
		echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "</script>\n";
	}
}
