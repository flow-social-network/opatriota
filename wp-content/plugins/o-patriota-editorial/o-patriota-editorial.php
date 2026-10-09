<?php
/**
 * Plugin Name: O Patriota Editorial
 * Plugin URI: https://opatriota.com.br
 * Description: Sistema editorial jornalístico avançado para O Patriota: central de fontes oficiais, ingestão segura de feeds RSS, deduplicação em 5 camadas, fila de triagem editorial, checagem de fatos e auditoria.
 * Version: 1.0.0
 * Author: Equipe de Engenharia O Patriota
 * Author URI: https://opatriota.com.br/expediente
 * License: GPL-2.0-or-later
 * Text Domain: o-patriota-editorial
 * Requires PHP: 8.0
 * Requires at least: 6.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'O_PATRIOTA_EDITORIAL_VERSION', '1.0.0' );
define( 'O_PATRIOTA_EDITORIAL_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'O_PATRIOTA_EDITORIAL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Autoloader modular de classes
spl_autoload_register( function ( $class_name ) {
	if ( strpos( $class_name, 'O_Patriota_' ) !== 0 ) {
		return;
	}

	$file_name = 'class-' . strtolower( str_replace( array( 'O_Patriota_', '_' ), array( '', '-' ), $class_name ) ) . '.php';
	$file_path = O_PATRIOTA_EDITORIAL_PLUGIN_DIR . 'includes/' . $file_name;

	if ( file_exists( $file_path ) ) {
		require_once $file_path;
	}
} );

// Ativação e Desativação
register_activation_hook( __FILE__, array( 'O_Patriota_Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'O_Patriota_Deactivator', 'deactivate' ) );

// Inicialização do Plugin
function run_o_patriota_editorial() {
	$plugin = O_Patriota_Plugin::get_instance();
	$plugin->run();
}
add_action( 'plugins_loaded', 'run_o_patriota_editorial' );
