<?php
/**
 * Classe principal do plugin O Patriota Editorial
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Plugin {

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		// Construtor privado (Singleton)
	}

	public function run() {
		// Inicializar administração
		if ( is_admin() ) {
			O_Patriota_Admin::init();
		}

		// Inicializar controle de acesso & paywall no servidor
		O_Patriota_Content_Restriction::init();

		// Inicializar rotas da Área do Assinante (/minha-conta/*)
		O_Patriota_Subscriber_Portal::init();

		// Inicializar rotas e esteira da Área da Redação (/redacao)
		O_Patriota_Newsroom_Workflow::init();

		// Inicializar gestor de páginas institucionais e formulários
		O_Patriota_Pages_Manager::init();

		// Inicializar gestor automático de editorias e categorias
		O_Patriota_Category_Manager::init();

		// Inicializar API REST e módulo meteorológico dinâmico
		O_Patriota_Weather_Api::init();

		// Agendador de sincronização
		add_action( 'o_patriota_cron_poll_sources', array( $this, 'execute_scheduled_poll' ) );

		// Schema ClaimReview no frontend
		add_action( 'wp_head', array( $this, 'output_frontend_schema' ) );
	}

	public function execute_scheduled_poll() {
		$sources = O_Patriota_Source_Manager::get_active_sources();
		foreach ( $sources as $src ) {
			O_Patriota_Rss_Ingestion::ingest_source( $src );
		}
	}

	public function output_frontend_schema() {
		if ( is_single() ) {
			$post_id = get_the_ID();
			$is_factcheck = get_post_meta( $post_id, '_patriota_is_factcheck', true );
			if ( $is_factcheck ) {
				O_Patriota_Fact_Check::render_claim_review_schema( $post_id );
			}
		}
	}
}
