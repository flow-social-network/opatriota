<?php
/**
 * Painel Administrativo de O Patriota
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Admin {

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_admin_menus' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_assets' ) );
	}

	public static function register_admin_menus() {
		// Menu Principal
		add_menu_page(
			__( 'O Patriota Editorial', 'o-patriota-editorial' ),
			__( 'O Patriota', 'o-patriota-editorial' ),
			'manage_patriota_editorial_queue',
			'o-patriota',
			array( __CLASS__, 'render_dashboard_page' ),
			'dashicons-flag',
			3
		);

		// Submenus
		add_submenu_page(
			'o-patriota',
			__( 'Painel Editorial', 'o-patriota-editorial' ),
			__( 'Painel Editorial', 'o-patriota-editorial' ),
			'manage_patriota_editorial_queue',
			'o-patriota',
			array( __CLASS__, 'render_dashboard_page' )
		);

		add_submenu_page(
			'o-patriota',
			__( 'Fila de Notícias', 'o-patriota-editorial' ),
			__( 'Fila de Notícias', 'o-patriota-editorial' ),
			'manage_patriota_editorial_queue',
			'o-patriota-fila',
			array( __CLASS__, 'render_queue_page' )
		);

		add_submenu_page(
			'o-patriota',
			__( 'Central de Fontes', 'o-patriota-editorial' ),
			__( 'Central de Fontes', 'o-patriota-editorial' ),
			'manage_patriota_sources',
			'o-patriota-fontes',
			array( __CLASS__, 'render_sources_page' )
		);

		add_submenu_page(
			'o-patriota',
			__( 'Deduplicação e Duplicados', 'o-patriota-editorial' ),
			__( 'Deduplicação', 'o-patriota-editorial' ),
			'manage_patriota_editorial_queue',
			'o-patriota-dedup',
			array( __CLASS__, 'render_dedup_page' )
		);

		add_submenu_page(
			'o-patriota',
			__( 'Checagem de Fatos', 'o-patriota-editorial' ),
			__( 'Checagem', 'o-patriota-editorial' ),
			'manage_patriota_factcheck',
			'o-patriota-checagem',
			array( __CLASS__, 'render_factcheck_page' )
		);

		add_submenu_page(
			'o-patriota',
			__( 'Configurações e Diagnóstico', 'o-patriota-editorial' ),
			__( 'Configurações', 'o-patriota-editorial' ),
			'manage_options',
			'o-patriota-config',
			array( __CLASS__, 'render_settings_page' )
		);
	}

	public static function enqueue_admin_assets() {
		// Estilos do painel editorial
		wp_enqueue_style(
			'o-patriota-admin-css',
			O_PATRIOTA_EDITORIAL_PLUGIN_URL . 'admin/css/admin.css',
			array(),
			O_PATRIOTA_EDITORIAL_VERSION
		);
	}

	public static function render_dashboard_page() {
		global $wpdb;
		$table_items = $wpdb->prefix . 'patriota_raw_items';
		$table_sources = $wpdb->prefix . 'patriota_sources';

		$total_received = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table_items}" );
		$total_pending  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table_items} WHERE editorial_status = 'RECEBIDA'" );
		$total_in_prog  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table_items} WHERE editorial_status IN ('EM APURAÇÃO', 'EM REDAÇÃO', 'EM REVISÃO')" );
		$total_dups     = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table_items} WHERE dedup_status IN ('DUPLICADO CONFIRMADO', 'POSSÍVEL DUPLICADO')" );
		$active_sources = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table_sources} WHERE is_active = 1" );

		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'O Patriota — Painel Editorial da Redação', 'o-patriota-editorial' ); ?></h1>
			<p class="description"><?php esc_html_e( 'Monitoramento em tempo real do fluxo de pautas, ingestão de fontes oficiais e esteira jornalística.', 'o-patriota-editorial' ); ?></p>
			
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;">
				<div style="background:#fff; border:1px solid #ccd0d4; padding:20px; border-left:4px solid #0B2345;">
					<div style="font-size:12px; font-weight:bold; color:#5D6673; text-transform:uppercase;">Pautas Recebidas</div>
					<div style="font-size:28px; font-weight:bold; color:#0B2345; margin-top:8px;"><?php echo esc_html( $total_received ); ?></div>
				</div>
				<div style="background:#fff; border:1px solid #ccd0d4; padding:20px; border-left:4px solid #0B5FFF;">
					<div style="font-size:12px; font-weight:bold; color:#5D6673; text-transform:uppercase;">Pautas Pendentes</div>
					<div style="font-size:28px; font-weight:bold; color:#0B5FFF; margin-top:8px;"><?php echo esc_html( $total_pending ); ?></div>
				</div>
				<div style="background:#fff; border:1px solid #ccd0d4; padding:20px; border-left:4px solid #16803C;">
					<div style="font-size:12px; font-weight:bold; color:#5D6673; text-transform:uppercase;">Em Apuração/Redação</div>
					<div style="font-size:28px; font-weight:bold; color:#16803C; margin-top:8px;"><?php echo esc_html( $total_in_prog ); ?></div>
				</div>
				<div style="background:#fff; border:1px solid #ccd0d4; padding:20px; border-left:4px solid #B42318;">
					<div style="font-size:12px; font-weight:bold; color:#5D6673; text-transform:uppercase;">Duplicados Bloqueados</div>
					<div style="font-size:28px; font-weight:bold; color:#B42318; margin-top:8px;"><?php echo esc_html( $total_dups ); ?></div>
				</div>
				<div style="background:#fff; border:1px solid #ccd0d4; padding:20px; border-left:4px solid #FFCC29;">
					<div style="font-size:12px; font-weight:bold; color:#5D6673; text-transform:uppercase;">Fontes Oficiais Ativas</div>
					<div style="font-size:28px; font-weight:bold; color:#17202A; margin-top:8px;"><?php echo esc_html( $active_sources ); ?></div>
				</div>
			</div>

			<h2><?php esc_html_e( 'Últimas Pautas na Esteira Editorial', 'o-patriota-editorial' ); ?></h2>
			<table class="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Título da Notícia', 'o-patriota-editorial' ); ?></th>
						<th><?php esc_html_e( 'Editoria', 'o-patriota-editorial' ); ?></th>
						<th><?php esc_html_e( 'Status Deduplicação', 'o-patriota-editorial' ); ?></th>
						<th><?php esc_html_e( 'Status Editorial', 'o-patriota-editorial' ); ?></th>
						<th><?php esc_html_e( 'Capturado em', 'o-patriota-editorial' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					$items = $wpdb->get_results( "SELECT * FROM {$table_items} ORDER BY id DESC LIMIT 10" );
					if ( empty( $items ) ) :
					?>
						<tr><td colspan="5"><?php esc_html_e( 'Nenhuma pauta na fila ainda. Execute a sincronização na Central de Fontes.', 'o-patriota-editorial' ); ?></td></tr>
					<?php else :
						foreach ( $items as $it ) : ?>
							<tr>
								<td><strong><?php echo esc_html( $it->title ); ?></strong></td>
								<td><?php echo esc_html( strtoupper( $it->category_suggested ) ); ?></td>
								<td><?php echo esc_html( $it->dedup_status ); ?></td>
								<td><code><?php echo esc_html( $it->editorial_status ); ?></code></td>
								<td><?php echo esc_html( $it->captured_at ); ?></td>
							</tr>
						<?php endforeach;
					endif; ?>
				</tbody>
			</table>
		</div>
		<?php
	}

	public static function render_queue_page() {
		echo '<div class="wrap"><h1>Fila Editorial</h1><p>Gestão e triagem de matérias recebidas.</p></div>';
	}

	public static function render_sources_page() {
		echo '<div class="wrap"><h1>Central de Fontes Oficiais</h1><p>Configuração e sincronização de feeds oficiais.</p></div>';
	}

	public static function render_dedup_page() {
		echo '<div class="wrap"><h1>Deduplicação</h1><p>Inspeção das 5 camadas de deduplicação.</p></div>';
	}

	public static function render_factcheck_page() {
		echo '<div class="wrap"><h1>Agência de Checagem</h1><p>Dossiês e auditoria de fatos.</p></div>';
	}

	public static function render_settings_page() {
		echo '<div class="wrap"><h1>Configurações do Portal</h1><p>Parâmetros gerais do sistema.</p></div>';
	}
}
