<?php
/**
 * Gestor Automático de Categorias e Editorias
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Category_Manager {

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_default_categories' ) );
		add_action( 'init', array( __CLASS__, 'register_category_meta' ) );
	}

	/**
	 * Garante as 11 categorias jornalísticas oficiais no WordPress
	 */
	public static function register_default_categories() {
		$categories = array(
			'politica' => array(
				'name'        => 'Política Nacional',
				'description' => 'Cobertura dos bastidores do Congresso Nacional, do Poder Executivo, Judiciário e das decisões fundamentais da República.',
			),
			'brasil' => array(
				'name'        => 'Brasil e Estados',
				'description' => 'Notícias dos 26 estados e Distrito Federal, obras de integração regional, desenvolvimento metropolitano e federação.',
			),
			'economia' => array(
				'name'        => 'Economia e Mercado',
				'description' => 'Macroeconomia, agronegócio, comércio exterior, mercado de capitais, empreendedorismo e redução do Custo Brasil.',
			),
			'seguranca' => array(
				'name'        => 'Segurança Pública',
				'description' => 'Combate ao crime organizado, operações policiais, vigilância de fronteiras e modernização das forças de segurança.',
			),
			'saude' => array(
				'name'        => 'Saúde',
				'description' => 'Avanços na medicina, gestão hospitalar, Farmácia Popular, Sistema Único de Saúde (SUS) e bem-estar da família.',
			),
			'opiniao' => array(
				'name'        => 'Artigos e Opinião',
				'description' => 'Ensaios, colunas e reflexões cívicas de pensadores, juristas e economistas que debatem os rumos do Brasil.',
			),
			'checagem' => array(
				'name'        => 'Agência de Checagem',
				'description' => 'Auditoria de fatos virais, desmentido de boatos e verificação rigorosa de alegações com documentos públicos oficiais.',
			),
			'tecnologia' => array(
				'name'        => 'Tecnologia',
				'description' => 'Inovação aplicada, inteligência artificial soberana, ecossistema de startups, telecomunicações e segurança digital.',
			),
			'mundo' => array(
				'name'        => 'Mundo',
				'description' => 'Geopolítica internacional, relações bilaterais do Brasil, comércio exterior e acontecimentos globais de impacto.',
			),
			'cultura' => array(
				'name'        => 'Cultura',
				'description' => 'Patrimônio histórico nacional, literatura, artes, tradições regionais e valorização da identidade brasileira.',
			),
			'esportes' => array(
				'name'        => 'Esportes',
				'description' => 'Futebol nacional, atletas brasileiros em competições internacionais, modalidades olímpicas e formação esportiva de base.',
			),
		);

		foreach ( $categories as $slug => $cat ) {
			if ( ! term_exists( $slug, 'category' ) ) {
				wp_insert_term(
					$cat['name'],
					'category',
					array(
						'slug'        => $slug,
						'description' => $cat['description'],
					)
				);
			}
		}
	}

	/**
	 * Registra metadados adicionais para cada categoria
	 */
	public static function register_category_meta() {
		register_term_meta( 'category', '_intro_text', array(
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => true,
		) );

		register_term_meta( 'category', '_banner_image', array(
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => true,
		) );

		register_term_meta( 'category', '_seo_title', array(
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => true,
		) );

		register_term_meta( 'category', '_seo_description', array(
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => true,
		) );
	}
}
