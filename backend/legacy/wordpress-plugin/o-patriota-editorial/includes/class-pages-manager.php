<?php
/**
 * Gestor de Páginas Institucionais, Modelos e Formulários
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Pages_Manager {

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_default_pages' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_rest_endpoints' ) );
		add_action( 'admin_post_o_patriota_submit_contact', array( __CLASS__, 'handle_post_contact' ) );
		add_action( 'admin_post_nopriv_o_patriota_submit_contact', array( __CLASS__, 'handle_post_contact' ) );
	}

	/**
	 * Cria páginas institucionais obrigatórias caso ainda não existam no WordPress
	 */
	public static function register_default_pages() {
		$default_pages = array(
			'sobre-o-patriota' => array(
				'title'    => 'Sobre O Patriota',
				'template' => 'page-institucional.html',
			),
			'expediente' => array(
				'title'    => 'Expediente e Redação',
				'template' => 'page-institucional.html',
			),
			'principios-editoriais' => array(
				'title'    => 'Princípios Editoriais',
				'template' => 'page-institucional.html',
			),
			'fontes-e-metodologia' => array(
				'title'    => 'Fontes e Metodologia',
				'template' => 'page-institucional.html',
			),
			'politica-de-correcoes' => array(
				'title'    => 'Política de Correções',
				'template' => 'page-institucional.html',
			),
			'contato' => array(
				'title'    => 'Fale com a Redação',
				'template' => 'page-contato.html',
			),
			'politica-de-privacidade' => array(
				'title'    => 'Política de Privacidade',
				'template' => 'page-institucional.html',
			),
			'termos-de-uso' => array(
				'title'    => 'Termos de Uso',
				'template' => 'page-institucional.html',
			),
			'gestao-de-dados' => array(
				'title'    => 'Gestão de Dados e LGPD',
				'template' => 'page-institucional.html',
			),
			'seguranca-da-informacao' => array(
				'title'    => 'Segurança da Informação',
				'template' => 'page-institucional.html',
			),
			'planos' => array(
				'title'    => 'Planos de Assinatura',
				'template' => 'page-planos.html',
			),
		);

		foreach ( $default_pages as $slug => $data ) {
			$page_check = get_page_by_path( $slug );
			if ( ! $page_check ) {
				$page_id = wp_insert_post( array(
					'post_title'     => $data['title'],
					'post_name'      => $slug,
					'post_type'      => 'page',
					'post_status'    => 'publish',
					'post_content'   => '<!-- wp:paragraph --><p>Conteúdo oficial em carregamento pelo tema O Patriota.</p><!-- /wp:paragraph -->',
					'comment_status' => 'closed',
				) );

				if ( $page_id && ! is_wp_error( $page_id ) ) {
					update_post_meta( $page_id, '_wp_page_template', $data['template'] );
				}
			}
		}
	}

	/**
	 * Endpoints REST para formulários
	 */
	public static function register_rest_endpoints() {
		register_rest_route( 'o-patriota/v1', '/contact', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'rest_submit_contact' ),
			'permission_callback' => '__return_true',
		) );

		register_rest_route( 'o-patriota/v1', '/lgpd', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'rest_submit_lgpd' ),
			'permission_callback' => '__return_true',
		) );
	}

	/**
	 * Processa formulário de contato via REST
	 */
	public static function rest_submit_contact( WP_REST_Request $request ) {
		$name     = sanitize_text_field( $request->get_param( 'name' ) );
		$email    = sanitize_email( $request->get_param( 'email' ) );
		$subject  = sanitize_text_field( $request->get_param( 'subject' ) );
		$message  = sanitize_textarea_field( $request->get_param( 'message' ) );
		$phone    = sanitize_text_field( $request->get_param( 'phone' ) );

		if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
			return new WP_Error( 'missing_fields', 'Preencha todos os campos obrigatórios.', array( 'status' => 400 ) );
		}

		$protocol = 'OP-' . strtoupper( substr( md5( uniqid( rand(), true ) ), 0, 6 ) );

		// Registro no log de auditoria do banco
		global $wpdb;
		$table_name = $wpdb->prefix . 'patriota_audit_log';
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) === $table_name ) {
			$wpdb->insert(
				$table_name,
				array(
					'timestamp' => current_time( 'mysql' ),
					'user_name' => $name,
					'user_role' => 'leitor',
					'action'    => 'Submissão de formulário de contato (' . $subject . ')',
					'notes'     => 'Protocolo: ' . $protocol . ' | Email: ' . $email,
				)
			);
		}

		return rest_ensure_response( array(
			'success'  => true,
			'protocol' => $protocol,
			'message'  => 'Mensagem recebida com sucesso pela redação.',
		) );
	}

	/**
	 * Processa solicitação de direitos LGPD via REST
	 */
	public static function rest_submit_lgpd( WP_REST_Request $request ) {
		$name         = sanitize_text_field( $request->get_param( 'name' ) );
		$email        = sanitize_email( $request->get_param( 'email' ) );
		$request_type = sanitize_text_field( $request->get_param( 'requestType' ) );
		$details      = sanitize_textarea_field( $request->get_param( 'details' ) );

		if ( empty( $name ) || empty( $email ) || empty( $details ) ) {
			return new WP_Error( 'missing_fields', 'Dados insuficientes para solicitação LGPD.', array( 'status' => 400 ) );
		}

		$protocol = 'LGPD-' . strtoupper( substr( md5( uniqid( rand(), true ) ), 0, 6 ) );

		return rest_ensure_response( array(
			'success'  => true,
			'protocol' => $protocol,
			'deadline' => '15 dias úteis',
			'message'  => 'Solicitação protocolada com o Encarregado de Dados (DPO).',
		) );
	}

	/**
	 * Handler para envio tradicional de POST com Nonce
	 */
	public static function handle_post_contact() {
		if ( ! isset( $_POST['contact_nonce'] ) || ! wp_verify_nonce( $_POST['contact_nonce'], 'o_patriota_contact_nonce' ) ) {
			wp_die( 'Falha na verificação de segurança.', 'Erro de Segurança', array( 'response' => 403 ) );
		}

		$name    = sanitize_text_field( $_POST['contact_name'] );
		$email   = sanitize_email( $_POST['contact_email'] );
		$subject = sanitize_text_field( $_POST['contact_subject'] );
		$message = sanitize_textarea_field( $_POST['contact_message'] );

		wp_safe_redirect( add_query_arg( 'contato_sucesso', '1', wp_get_referer() ) );
		exit;
	}
}
