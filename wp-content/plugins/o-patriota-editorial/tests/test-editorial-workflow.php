<?php
/**
 * Testes Unitários de Fluxo Editorial e Bloqueio de Auto-Aprovação
 *
 * @package OPatriotaEditorial
 */

class Test_O_Patriota_Editorial_Workflow extends WP_UnitTestCase {

	public function test_journalist_cannot_approve_own_story() {
		$journalist_id = $this->factory->user->create( array( 'role' => 'jornalista' ) );
		$post_id = $this->factory->post->create( array(
			'post_author' => $journalist_id,
			'post_title'  => 'Matéria Teste de Emprego',
			'post_status' => 'draft',
		) );

		// O jornalista tenta aprovar a própria matéria
		$result = O_Patriota_Newsroom_Workflow::approve_article( $post_id, $journalist_id );

		$this->assertWPError( $result );
		$this->assertEquals( 'self_approval_forbidden', $result->get_error_code() );
	}

	public function test_editor_can_approve_story() {
		$journalist_id = $this->factory->user->create( array( 'role' => 'jornalista' ) );
		$editor_id = $this->factory->user->create( array( 'role' => 'editor_redacao' ) );

		$post_id = $this->factory->post->create( array(
			'post_author' => $journalist_id,
			'post_title'  => 'Matéria sobre Infraestrutura',
			'post_status' => 'draft',
		) );

		// O editor aprova a matéria do jornalista
		$result = O_Patriota_Newsroom_Workflow::approve_article( $post_id, $editor_id );

		$this->assertTrue( $result );
		$this->assertEquals( 'APROVADA', get_post_meta( $post_id, '_patriota_editorial_status', true ) );
	}

	public function test_corrections_require_notes() {
		$editor_id = $this->factory->user->create( array( 'role' => 'editor_redacao' ) );
		$post_id = $this->factory->post->create();

		// Tentativa de devolução sem notas
		$result = O_Patriota_Newsroom_Workflow::request_corrections( $post_id, $editor_id, '' );

		$this->assertWPError( $result );
		$this->assertEquals( 'notes_required', $result->get_error_code() );
	}
}
