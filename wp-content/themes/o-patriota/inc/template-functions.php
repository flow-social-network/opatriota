<?php
/**
 * Funções auxiliares de template
 *
 * @package OPatriota
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Retorna tempo estimado de leitura em minutos
 */
function o_patriota_get_reading_time( $post_id = null ) {
	$post = get_post( $post_id );
	if ( ! $post ) {
		return 1;
	}
	$word_count = str_word_count( wp_strip_all_tags( $post->post_content ) );
	$minutes = ceil( $word_count / 200 );
	return max( 1, (int) $minutes );
}

/**
 * Formata data em português por extenso
 */
function o_patriota_get_formatted_date( $timestamp = null ) {
	if ( null === $timestamp ) {
		$timestamp = current_time( 'timestamp' );
	}
	return wp_date( 'l, j \d\e F \d\e Y', $timestamp );
}

/**
 * Retorna a categoria principal de um post
 */
function o_patriota_get_primary_category( $post_id = null ) {
	$categories = get_the_category( $post_id );
	if ( ! empty( $categories ) ) {
		return $categories[0];
	}
	return null;
}

/**
 * Registra os modelos de página customizados do tema O Patriota
 */
function o_patriota_register_page_templates( $templates ) {
	$templates['page-institucional.html'] = __( 'Modelo Institucional (O Patriota)', 'o-patriota' );
	$templates['page-contato.html']       = __( 'Modelo Contato & Redação', 'o-patriota' );
	$templates['page-planos.html']        = __( 'Modelo Planos & Assinatura', 'o-patriota' );
	$templates['page-minha-conta.html']   = __( 'Modelo Área do Assinante', 'o-patriota' );
	$templates['page-redacao.html']       = __( 'Modelo Redação & Esteira', 'o-patriota' );
	return $templates;
}
add_filter( 'theme_page_templates', 'o_patriota_register_page_templates' );

/**
 * Imprime dados estruturados Schema.org (JSON-LD) para SEO
 */
function o_patriota_output_schema_jsonld() {
	if ( is_single() ) {
		global $post;
		$category = o_patriota_get_primary_category( $post->ID );
		$schema = array(
			'@context'         => 'https://schema.org',
			'@type'            => 'NewsArticle',
			'headline'         => get_the_title(),
			'description'      => get_the_excerpt(),
			'datePublished'    => get_the_date( 'c' ),
			'dateModified'     => get_the_modified_date( 'c' ),
			'mainEntityOfPage' => get_permalink(),
			'author'           => array(
				'@type' => 'Person',
				'name'  => get_the_author(),
			),
			'publisher'        => array(
				'@type' => 'NewsMediaOrganization',
				'name'  => 'O Patriota',
				'url'   => home_url(),
				'logo'  => array(
					'@type' => 'ImageObject',
					'url'   => get_template_directory_uri() . '/assets/images/logo.png',
				),
			),
		);
		if ( has_post_thumbnail() ) {
			$schema['image'] = get_the_post_thumbnail_url( $post, 'large' );
		}
		echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
	} elseif ( is_front_page() || is_home() ) {
		$schema = array(
			'@context' => 'https://schema.org',
			'@type'    => 'NewsMediaOrganization',
			'name'     => 'O Patriota',
			'slogan'   => 'Informação com liberdade por um Brasil mais forte',
			'url'      => home_url(),
			'logo'     => get_template_directory_uri() . '/assets/images/logo.png',
			'sameAs'   => array(
				'https://twitter.com/opatriota',
				'https://facebook.com/opatriota',
				'https://instagram.com/opatriota',
			),
		);
		echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
	}
}
add_action( 'wp_head', 'o_patriota_output_schema_jsonld' );
