<?php
/**
 * Enqueue de scripts e estilos
 *
 * @package OPatriota
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function o_patriota_enqueue_assets() {
	// Folha de estilos principal
	wp_enqueue_style(
		'o-patriota-style',
		get_stylesheet_uri(),
		array(),
		O_PATRIOTA_VERSION
	);

	// Estilos complementares de componentes editoriais
	if ( file_exists( get_template_directory() . '/assets/css/editorial.css' ) ) {
		wp_enqueue_style(
			'o-patriota-editorial',
			get_template_directory_uri() . '/assets/css/editorial.css',
			array( 'o-patriota-style' ),
			O_PATRIOTA_VERSION
		);
	}

	// Script de interatividade do portal (ticker, acessibilidade, compartilhamento)
	if ( file_exists( get_template_directory() . '/assets/js/portal.js' ) ) {
		wp_enqueue_script(
			'o-patriota-portal',
			get_template_directory_uri() . '/assets/js/portal.js',
			array(),
			O_PATRIOTA_VERSION,
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'o_patriota_enqueue_assets' );

function o_patriota_editor_assets() {
	add_editor_style( 'style.css' );
}
add_action( 'admin_init', 'o_patriota_editor_assets' );
