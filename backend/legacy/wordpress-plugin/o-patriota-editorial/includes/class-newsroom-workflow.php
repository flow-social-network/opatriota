<?php
/**
 * Fluxo da Área da Redação (/redacao) e Controle Editorial
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Newsroom_Workflow {

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_newsroom_rewrites' ) );
		add_filter( 'query_vars', array( __CLASS__, 'register_newsroom_query_vars' ) );
		add_action( 'template_redirect', array( __CLASS__, 'handle_newsroom_access' ) );
	}

	public static function register_newsroom_rewrites() {
		add_rewrite_rule(
			'^redacao/?$',
			'index.php?patriota_newsroom=1',
			'top'
		);
	}

	public static function register_newsroom_query_vars( $vars ) {
		$vars[] = 'patriota_newsroom';
		return $vars;
	}

	public static function handle_newsroom_access() {
		if ( get_query_var( 'patriota_newsroom' ) ) {
			if ( ! is_user_logged_in() ) {
				wp_safe_redirect( home_url( '/minha-conta/entrar/?redirect_to=' . urlencode( '/redacao' ) ) );
				exit;
			}

			// Validar se o usuário possui cargo na redação
			if ( ! current_user_can( 'create_patriota_news' ) && 
			     ! current_user_can( 'review_patriota_news' ) && 
			     ! current_user_can( 'approve_patriota_news' ) && 
			     ! current_user_can( 'manage_options' ) ) {
				wp_die(
					__( 'Acesso restrito: Você não possui credenciais de membro da redação de O Patriota.', 'o-patriota-editorial' ),
					__( 'Acesso Negado', 'o-patriota-editorial' ),
					array( 'response' => 403 )
				);
			}
		}
	}

	/**
	 * Aprovação editorial com validação estrita de auto-aprovação
	 */
	public static function approve_article( $post_id, $user_id ) {
		$post = get_post( $post_id );
		if ( ! $post ) {
			return new WP_Error( 'post_not_found', 'Matéria não encontrada.' );
		}

		// REGRA CRÍTICA: O jornalista NÃO PODE aprovar a própria matéria
		if ( (int) $post->post_author === (int) $user_id && ! user_can( $user_id, 'manage_options' ) ) {
			return new WP_Error(
				'self_approval_forbidden',
				__( 'Violação de política editorial: Um repórter não pode aprovar a sua própria matéria. A revisão deve ser feita por um editor independente.', 'o-patriota-editorial' )
			);
		}

		if ( ! user_can( $user_id, 'approve_patriota_news' ) && ! user_can( $user_id, 'manage_options' ) ) {
			return new WP_Error(
				'permission_denied',
				__( 'Você não possui permissão de Editor para aprovar matérias.', 'o-patriota-editorial' )
			);
		}

		update_post_meta( $post_id, '_patriota_editorial_status', 'APROVADA' );
		update_post_meta( $post_id, '_patriota_approved_by', $user_id );
		update_post_meta( $post_id, '_patriota_approved_at', current_time( 'mysql' ) );

		// Registrar auditoria
		O_Patriota_Editorial_History::log_action( array(
			'post_id'         => $post_id,
			'user_id'         => $user_id,
			'action_name'     => 'APROVAÇÃO EDITORIAL',
			'previous_status' => 'EM REVISÃO',
			'new_status'      => 'APROVADA',
			'editorial_notes' => 'Aprovado para agendamento/publicação.',
		) );

		return true;
	}

	/**
	 * Devolver para correções com nota explicativa obrigatória
	 */
	public static function request_corrections( $post_id, $user_id, $notes ) {
		if ( empty( trim( $notes ) ) ) {
			return new WP_Error( 'notes_required', __( 'É obrigatório informar as orientações de correção para o repórter.', 'o-patriota-editorial' ) );
		}

		update_post_meta( $post_id, '_patriota_editorial_status', 'CORREÇÕES' );
		update_post_meta( $post_id, '_patriota_review_notes', sanitize_textarea_field( $notes ) );

		O_Patriota_Editorial_History::log_action( array(
			'post_id'         => $post_id,
			'user_id'         => $user_id,
			'action_name'     => 'SOLICITAÇÃO DE CORREÇÕES',
			'previous_status' => 'EM REVISÃO',
			'new_status'      => 'CORREÇÕES',
			'editorial_notes' => sanitize_textarea_field( $notes ),
		) );

		return true;
	}
}
