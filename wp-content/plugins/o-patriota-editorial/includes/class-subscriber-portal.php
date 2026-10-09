<?php
/**
 * Portal do Assinante e Gestão de Leitores (Rotas /minha-conta/*)
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Subscriber_Portal {

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_rewrite_rules' ) );
		add_filter( 'query_vars', array( __CLASS__, 'register_query_vars' ) );
		add_action( 'template_redirect', array( __CLASS__, 'handle_subscriber_routes' ) );
		add_action( 'wp_authenticate_user', array( __CLASS__, 'check_login_rate_limit' ), 10, 2 );
		add_action( 'wp_login_failed', array( __CLASS__, 'log_failed_login' ) );
	}

	public static function register_rewrite_rules() {
		add_rewrite_rule(
			'^minha-conta/([^/]+)/?$',
			'index.php?patriota_account_page=1&patriota_subpage=$matches[1]',
			'top'
		);
		add_rewrite_rule(
			'^minha-conta/?$',
			'index.php?patriota_account_page=1&patriota_subpage=dashboard',
			'top'
		);
	}

	public static function register_query_vars( $vars ) {
		$vars[] = 'patriota_account_page';
		$vars[] = 'patriota_subpage';
		return $vars;
	}

	public static function handle_subscriber_routes() {
		if ( get_query_var( 'patriota_account_page' ) ) {
			$subpage = get_query_var( 'patriota_subpage' );
			$public_subpages = array( 'entrar', 'cadastro', 'recuperar-senha' );

			// Se a subpágina for privada e o usuário não estiver logado, redirecionar para login
			if ( ! in_array( $subpage, $public_subpages, true ) && ! is_user_logged_in() ) {
				wp_safe_redirect( home_url( '/minha-conta/entrar/?redirect_to=' . urlencode( $_SERVER['REQUEST_URI'] ) ) );
				exit;
			}
		}
	}

	/**
	 * Prevenção de Ataques de Força Bruta no Login (Transients por IP)
	 */
	public static function check_login_rate_limit( $user, $password ) {
		$ip = sanitize_text_field( $_SERVER['REMOTE_ADDR'] ?? '' );
		$transient_key = 'patriota_login_attempts_' . md5( $ip );
		$attempts = (int) get_transient( $transient_key );

		if ( $attempts >= 5 ) {
			return new WP_Error(
				'too_many_attempts',
				__( 'Muitas tentativas incorretas de login. Por motivos de segurança, tente novamente em 15 minutos.', 'o-patriota-editorial' )
			);
		}

		return $user;
	}

	public static function log_failed_login( $username ) {
		$ip = sanitize_text_field( $_SERVER['REMOTE_ADDR'] ?? '' );
		$transient_key = 'patriota_login_attempts_' . md5( $ip );
		$attempts = (int) get_transient( $transient_key );
		set_transient( $transient_key, $attempts + 1, 15 * MINUTE_IN_SECONDS );
	}

	/**
	 * Gerenciamento de Notícias Favoritas / Salvas
	 */
	public static function toggle_bookmark( $user_id, $post_id ) {
		$bookmarks = (array) get_user_meta( $user_id, '_patriota_bookmarks', true );
		if ( in_array( $post_id, $bookmarks ) ) {
			$bookmarks = array_diff( $bookmarks, array( $post_id ) );
		} else {
			$bookmarks[] = (int) $post_id;
		}
		update_user_meta( $user_id, '_patriota_bookmarks', array_values( $bookmarks ) );
		return $bookmarks;
	}
}
