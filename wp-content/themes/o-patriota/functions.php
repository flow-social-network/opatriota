<?php
/**
 * O Patriota — Funções principais do tema
 *
 * @package OPatriota
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'O_PATRIOTA_VERSION', '1.0.0' );
define( 'O_PATRIOTA_DIR', get_template_directory() );
define( 'O_PATRIOTA_URI', get_template_directory_uri() );

// Carregar arquivos de configuração modular
require_once O_PATRIOTA_DIR . '/inc/setup.php';
require_once O_PATRIOTA_DIR . '/inc/assets.php';
require_once O_PATRIOTA_DIR . '/inc/editor.php';
require_once O_PATRIOTA_DIR . '/inc/template-functions.php';
require_once O_PATRIOTA_DIR . '/inc/accessibility.php';
