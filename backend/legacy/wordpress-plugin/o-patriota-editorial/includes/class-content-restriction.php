<?php
/**
 * Controle de Acesso e Paywall no Servidor (Conteúdo Exclusivo)
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Content_Restriction {

	public static function init() {
		add_filter( 'the_content', array( __CLASS__, 'filter_restricted_content' ), 20 );
		add_action( 'add_meta_boxes', array( __CLASS__, 'register_access_metabox' ) );
		add_action( 'save_post', array( __CLASS__, 'save_access_meta' ) );
	}

	/**
	 * Registra Metabox para definir se a matéria é Aberta, Assinante ou Premium
	 */
	public static function register_access_metabox() {
		add_meta_box(
			'patriota_access_control',
			__( 'Controle de Acesso & Paywall — O Patriota', 'o-patriota-editorial' ),
			array( __CLASS__, 'render_access_metabox' ),
			'post',
			'side',
			'high'
		);
	}

	public static function render_access_metabox( $post ) {
		wp_nonce_field( 'patriota_save_access_meta', 'patriota_access_nonce' );
		$level = get_post_meta( $post->ID, '_patriota_access_level', true );
		if ( empty( $level ) ) {
			$level = 'aberto';
		}
		?>
		<p>
			<label for="patriota_access_level"><strong><?php esc_html_e( 'Nível de Acesso:', 'o-patriota-editorial' ); ?></strong></label>
			<select name="patriota_access_level" id="patriota_access_level" class="widefat" style="margin-top:5px;">
				<option value="aberto" <?php selected( $level, 'aberto' ); ?>><?php esc_html_e( 'Aberto (Público Geral)', 'o-patriota-editorial' ); ?></option>
				<option value="assinante" <?php selected( $level, 'assinante' ); ?>><?php esc_html_e( 'Exclusivo para Assinantes (Digital/Premium)', 'o-patriota-editorial' ); ?></option>
				<option value="premium" <?php selected( $level, 'premium' ); ?>><?php esc_html_e( 'Premium (Apenas Assinantes Premium)', 'o-patriota-editorial' ); ?></option>
			</select>
		</p>
		<p class="description" style="font-size:11px; color:#666;">
			<?php esc_html_e( 'Conteúdos restritos são truncados no servidor para leitores não autorizados, exibindo a oferta de assinatura.', 'o-patriota-editorial' ); ?>
		</p>
		<?php
	}

	public static function save_access_meta( $post_id ) {
		if ( ! isset( $_POST['patriota_access_nonce'] ) || ! wp_verify_nonce( $_POST['patriota_access_nonce'], 'patriota_save_access_meta' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( isset( $_POST['patriota_access_level'] ) ) {
			$level = sanitize_key( $_POST['patriota_access_level'] );
			if ( in_array( $level, array( 'aberto', 'assinante', 'premium' ), true ) ) {
				update_post_meta( $post_id, '_patriota_access_level', $level );
			}
		}
	}

	/**
	 * Filtra o conteúdo no servidor: trunca o texto e insere a barreira de paywall
	 */
	public static function filter_restricted_content( $content ) {
		if ( ! is_single() || is_admin() ) {
			return $content;
		}

		$post_id = get_the_ID();
		$access_level = get_post_meta( $post_id, '_patriota_access_level', true );

		if ( empty( $access_level ) || 'aberto' === $access_level ) {
			return $content; // Conteúdo de livre acesso
		}

		// Usuários com capacidade administrativa ou editorial sempre visualizam o conteúdo completo
		if ( current_user_can( 'edit_post', $post_id ) ) {
			return $content;
		}

		// Validar se o usuário logado possui a assinatura necessária
		if ( is_user_logged_in() ) {
			$user_id = get_current_user_id();
			$user_plan = get_user_meta( $user_id, '_patriota_subscription_plan', true );

			if ( 'premium' === $access_level && 'premium' === $user_plan ) {
				return $content;
			}

			if ( 'assinante' === $access_level && in_array( $user_plan, array( 'digital', 'premium' ), true ) ) {
				return $content;
			}
		}

		// Se não autorizado: TRUNCAR O CONTEÚDO NO SERVIDOR
		$paragraphs = explode( '</p>', $content );
		$lead_paragraph = isset( $paragraphs[0] ) ? $paragraphs[0] . '</p>' : '';

		// Construir componente de Paywall no servidor
		$login_url = home_url( '/minha-conta/entrar/?redirect_to=' . urlencode( get_permalink() ) );
		$subscribe_url = home_url( '/minha-conta/assinatura/' );

		$paywall_html = '
		<div class="patriota-server-paywall" style="margin:2.5rem 0; padding:2rem; background:#0B2345; color:#ffffff; border-radius:6px; text-align:center; box-shadow:0 4px 12px rgba(11,35,69,0.15);">
			<div style="font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#FFCC29; margin-bottom:0.5rem;">
				CONTEÚDO EXCLUSIVO PARA ASSINANTES
			</div>
			<h3 style="font-family:Georgia, serif; font-size:1.6rem; font-weight:bold; margin-bottom:1rem; color:#ffffff;">
				Continue lendo esta reportagem com o jornalismo independente de O Patriota
			</h3>
			<p style="font-size:0.9rem; color:#D9DEE7; max-width:600px; margin:0 auto 1.5rem auto; line-height:1.6;">
				Assine agora e tenha acesso ilimitado a todas as análises de Brasília, investigações exclusivas, checagens de fatos e alertas em primeira mão.
			</p>
			<div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
				<a href="' . esc_url( $subscribe_url ) . '" style="background:#16803C; color:#ffffff; font-weight:bold; font-size:0.85rem; padding:0.75rem 1.5rem; border-radius:4px; text-decoration:none; display:inline-block;">
					CONHECER PLANOS DE ASSINATURA →
				</a>
				<a href="' . esc_url( $login_url ) . '" style="background:transparent; border:1px solid rgba(255,255,255,0.4); color:#ffffff; font-weight:bold; font-size:0.85rem; padding:0.75rem 1.5rem; border-radius:4px; text-decoration:none; display:inline-block;">
					JÁ É ASSINANTE? FAÇA LOGIN
				</a>
			</div>
		</div>';

		return $lead_paragraph . $paywall_html;
	}
}
