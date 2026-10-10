<?php
/**
 * Configuração inicial do tema O Patriota
 *
 * @package OPatriota
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function o_patriota_setup() {
	// Suporte a traduções
	load_theme_textdomain( 'o-patriota', get_template_directory() . '/languages' );

	// Suporte a recursos essenciais do WordPress
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );

	// Dimensões de imagens editoriais
	set_post_thumbnail_size( 1200, 675, true ); // 16:9 Destaque
	add_image_size( 'o-patriota-hero', 1200, 675, true );
	add_image_size( 'o-patriota-card', 600, 400, true ); // 3:2 Cards editoriais
	add_image_size( 'o-patriota-thumb', 300, 200, true ); // Thumbnails de coluna

	// Registrar menus de navegação
	register_nav_menus( array(
		'primary'   => __( 'Menu Principal do Cabeçalho', 'o-patriota' ),
		'editorial' => __( 'Menu de Editorias', 'o-patriota' ),
		'footer'    => __( 'Menu do Rodapé', 'o-patriota' ),
		'legal'     => __( 'Menu Institucional e Legal', 'o-patriota' ),
	) );
}
add_action( 'after_setup_theme', 'o_patriota_setup' );
