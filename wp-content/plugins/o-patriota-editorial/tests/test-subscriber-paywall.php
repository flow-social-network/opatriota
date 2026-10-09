<?php
/**
 * Testes Unitários de Controle de Acesso e Paywall no Servidor
 *
 * @package OPatriotaEditorial
 */

class Test_O_Patriota_Subscriber_Paywall extends WP_UnitTestCase {

	public function test_free_article_is_never_blocked() {
		$post_id = $this->factory->post->create( array(
			'post_content' => '<p>Parágrafo 1 de notícias públicas.</p><p>Parágrafo 2 completo.</p>',
		) );
		update_post_meta( $post_id, '_patriota_access_level', 'aberto' );

		// Simular consulta pública não logada
		$filtered = O_Patriota_Content_Restriction::filter_restricted_content( '<p>Parágrafo 1 de notícias públicas.</p><p>Parágrafo 2 completo.</p>' );

		$this->assertStringContainsString( 'Parágrafo 2 completo', $filtered );
		$this->assertStringNotContainsString( 'CONTEÚDO EXCLUSIVO PARA ASSINANTES', $filtered );
	}

	public function test_exclusive_article_is_truncated_for_non_subscribers() {
		$post_id = $this->factory->post->create( array(
			'post_content' => '<p>Lead aberto da reportagem.</p><p>Conteúdo confidencial para assinantes.</p>',
		) );
		update_post_meta( $post_id, '_patriota_access_level', 'assinante' );

		// Simular acesso não logado
		wp_set_current_user( 0 );

		// Filtro nativo do servidor
		$GLOBALS['post'] = get_post( $post_id );
		$filtered = O_Patriota_Content_Restriction::filter_restricted_content( '<p>Lead aberto da reportagem.</p><p>Conteúdo confidencial para assinantes.</p>' );

		// Deve conter o primeiro parágrafo
		$this->assertStringContainsString( 'Lead aberto da reportagem', $filtered );
		// NUNCA deve conter o parágrafo restrito
		$this->assertStringNotContainsString( 'Conteúdo confidencial para assinantes', $filtered );
		// DEVE conter a barreira oficial de paywall
		$this->assertStringContainsString( 'CONTEÚDO EXCLUSIVO PARA ASSINANTES', $filtered );
	}
}
