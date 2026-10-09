<?php
/**
 * Padrões de blocos e categorias do Gutenberg
 *
 * @package OPatriota
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function o_patriota_register_pattern_categories() {
	register_block_pattern_category(
		'o-patriota-editorial',
		array(
			'label' => __( 'O Patriota — Seções Editoriais', 'o-patriota' ),
		)
	);

	register_block_pattern_category(
		'o-patriota-headers',
		array(
			'label' => __( 'O Patriota — Cabeçalhos e Tickers', 'o-patriota' ),
		)
	);

	register_block_pattern_category(
		'o-patriota-factcheck',
		array(
			'label' => __( 'O Patriota — Checagem de Fatos', 'o-patriota' ),
		)
	);
}
add_action( 'init', 'o_patriota_register_pattern_categories' );
