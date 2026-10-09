<?php
/**
 * Melhorias de acessibilidade para O Patriota
 *
 * @package OPatriota
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Adiciona link de pular para o conteúdo principal
 */
function o_patriota_skip_link() {
	echo '<a class="skip-link screen-reader-text" href="#main-content">' . esc_html__( 'Pular para o conteúdo principal', 'o-patriota' ) . '</a>';
}
add_action( 'wp_body_open', 'o_patriota_skip_link', 5 );

/**
 * Adiciona atributos ARIA aos menus
 */
function o_patriota_nav_menu_link_attributes( $atts, $item, $args ) {
	if ( isset( $args->theme_location ) && 'primary' === $args->theme_location ) {
		$atts['role'] = 'menuitem';
	}
	return $atts;
}
add_filter( 'nav_menu_link_attributes', 'o_patriota_nav_menu_link_attributes', 10, 3 );
