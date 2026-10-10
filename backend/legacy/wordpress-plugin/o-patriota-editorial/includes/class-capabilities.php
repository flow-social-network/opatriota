<?php
/**
 * Gerenciamento de papéis e permissões da redação e assinantes
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Capabilities {

	public static function add_capabilities() {
		// 1. Papel: Assinante (Leitor com acesso a conteúdo exclusivo)
		add_role( 'assinante', __( 'Assinante O Patriota', 'o-patriota-editorial' ), array(
			'read'                      => true,
			'read_patriota_exclusive'   => true,
			'read_patriota_premium'     => true,
		) );

		// 2. Papel: Jornalista (Cria e edita matérias próprias, sem permissão de auto-aprovação)
		add_role( 'jornalista', __( 'Jornalista', 'o-patriota-editorial' ), array(
			'read'                      => true,
			'edit_posts'                => true,
			'delete_posts'              => true,
			'upload_files'              => true,
			'create_patriota_news'      => true,
			'submit_patriota_review'    => true,
			'read_patriota_sources'     => true,
		) );

		// 3. Papel: Revisor (Revisa textos, solicita correções, mas não publica)
		add_role( 'revisor', __( 'Revisor Editorial', 'o-patriota-editorial' ), array(
			'read'                      => true,
			'edit_posts'                => true,
			'edit_others_posts'         => true,
			'read_private_posts'        => true,
			'upload_files'              => true,
			'review_patriota_news'      => true,
			'request_patriota_changes'  => true,
			'read_patriota_sources'     => true,
		) );

		// 4. Papel: Editor (Revisa, aprova matérias de outros e solicita correções)
		add_role( 'editor_redacao', __( 'Editor de Redação', 'o-patriota-editorial' ), array(
			'read'                      => true,
			'edit_posts'                => true,
			'edit_others_posts'         => true,
			'publish_posts'             => true,
			'read_private_posts'        => true,
			'delete_posts'              => true,
			'delete_others_posts'       => true,
			'upload_files'              => true,
			'manage_categories'         => true,
			'approve_patriota_news'     => true,
			'publish_patriota_news'     => true,
			'manage_patriota_sources'   => true,
			'manage_patriota_factcheck' => true,
		) );

		// 5. Papel: Editor-Chefe (Supervisiona equipe, publica e gerencia esteira)
		add_role( 'editor_chefe', __( 'Editor-Chefe', 'o-patriota-editorial' ), array(
			'read'                          => true,
			'edit_posts'                    => true,
			'edit_others_posts'             => true,
			'publish_posts'                 => true,
			'read_private_posts'            => true,
			'delete_posts'                  => true,
			'delete_others_posts'           => true,
			'upload_files'                  => true,
			'manage_categories'             => true,
			'approve_patriota_news'         => true,
			'publish_patriota_news'         => true,
			'manage_patriota_sources'       => true,
			'manage_patriota_factcheck'     => true,
			'manage_patriota_team'          => true,
			'manage_patriota_editorial_queue' => true,
		) );

		// Atualizar permissões do Administrador
		$admin = get_role( 'administrator' );
		if ( $admin ) {
			$admin->add_cap( 'manage_patriota_sources' );
			$admin->add_cap( 'manage_patriota_editorial_queue' );
			$admin->add_cap( 'manage_patriota_factcheck' );
			$admin->add_cap( 'publish_patriota_news' );
			$admin->add_cap( 'approve_patriota_news' );
			$admin->add_cap( 'manage_patriota_team' );
			$admin->add_cap( 'read_patriota_exclusive' );
			$admin->add_cap( 'read_patriota_premium' );
			$admin->add_cap( 'manage_patriota_subscriptions' );
		}
	}
}
