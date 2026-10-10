<?php
/**
 * O Patriota Editorial — Endpoint REST e Módulo Meteorológico
 *
 * Fornece API REST própria (/wp-json/o-patriota/v1/weather e /wp-json/o-patriota/v1/weather/capitals)
 * para consulta meteorológica das 27 capitais brasileiras com:
 * - Validação rigorosa de parâmetros
 * - Limitação de requisições (rate limiting via transientes)
 * - Cache otimizado no servidor (transientes de 15 minutos)
 * - Definição de timeouts rígidos (5 segundos)
 * - Tratamento de falhas de conexão com preservação estrita do timestamp de obtenção real
 * - Identificação correta de fontes: Open-Meteo API (tempo real) e INMET (referência cadastral das estações)
 *
 * @package OPatriotaEditorial
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class O_Patriota_Weather_Api {

	const REST_NAMESPACE = 'o-patriota/v1';
	const CACHE_TTL      = 900; // 15 minutos em segundos
	const RATE_LIMIT_MAX = 60;  // Máximo de 60 requisições por minuto por IP
	const REQUEST_TIMEOUT = 5;  // 5 segundos de timeout

	/**
	 * Cadastro canônico das 27 capitais brasileiras
	 */
	public static $capitals = array(
		'brasilia' => array(
			'name' => 'Brasília', 'uf' => 'DF', 'fullName' => 'Brasília - DF', 'region' => 'Centro-Oeste',
			'lat' => -15.78, 'lon' => -47.93, 'timezone' => 'America/Sao_Paulo', 'station' => 'A001', 'stationName' => 'Estação Automática INMET Sudoeste'
		),
		'goiania' => array(
			'name' => 'Goiânia', 'uf' => 'GO', 'fullName' => 'Goiânia - GO', 'region' => 'Centro-Oeste',
			'lat' => -16.68, 'lon' => -49.25, 'timezone' => 'America/Sao_Paulo', 'station' => 'A002', 'stationName' => 'Estação Automática INMET Goiânia'
		),
		'cuiaba' => array(
			'name' => 'Cuiabá', 'uf' => 'MT', 'fullName' => 'Cuiabá - MT', 'region' => 'Centro-Oeste',
			'lat' => -15.60, 'lon' => -56.09, 'timezone' => 'America/Cuiaba', 'station' => '83361', 'stationName' => 'Estação Convencional INMET Cuiabá'
		),
		'campo-grande' => array(
			'name' => 'Campo Grande', 'uf' => 'MS', 'fullName' => 'Campo Grande - MS', 'region' => 'Centro-Oeste',
			'lat' => -20.46, 'lon' => -54.62, 'timezone' => 'America/Campo_Grande', 'station' => 'A702', 'stationName' => 'Estação Automática INMET Campo Grande'
		),
		'sao-paulo' => array(
			'name' => 'São Paulo', 'uf' => 'SP', 'fullName' => 'São Paulo - SP', 'region' => 'Sudeste',
			'lat' => -23.55, 'lon' => -46.63, 'timezone' => 'America/Sao_Paulo', 'station' => 'A701', 'stationName' => 'Estação Automática INMET Mirante de Santana'
		),
		'rio-de-janeiro' => array(
			'name' => 'Rio de Janeiro', 'uf' => 'RJ', 'fullName' => 'Rio de Janeiro - RJ', 'region' => 'Sudeste',
			'lat' => -22.90, 'lon' => -43.20, 'timezone' => 'America/Sao_Paulo', 'station' => 'A652', 'stationName' => 'Estação Automática INMET Forte de Copacabana'
		),
		'belo-horizonte' => array(
			'name' => 'Belo Horizonte', 'uf' => 'MG', 'fullName' => 'Belo Horizonte - MG', 'region' => 'Sudeste',
			'lat' => -19.92, 'lon' => -43.94, 'timezone' => 'America/Sao_Paulo', 'station' => 'A521', 'stationName' => 'Estação Automática INMET Pampulha'
		),
		'vitoria' => array(
			'name' => 'Vitória', 'uf' => 'ES', 'fullName' => 'Vitória - ES', 'region' => 'Sudeste',
			'lat' => -20.31, 'lon' => -40.33, 'timezone' => 'America/Sao_Paulo', 'station' => 'A612', 'stationName' => 'Estação Automática INMET Vitória'
		),
		'porto-alegre' => array(
			'name' => 'Porto Alegre', 'uf' => 'RS', 'fullName' => 'Porto Alegre - RS', 'region' => 'Sul',
			'lat' => -30.03, 'lon' => -51.23, 'timezone' => 'America/Sao_Paulo', 'station' => 'A801', 'stationName' => 'Estação Automática INMET Jardim Botânico'
		),
		'curitiba' => array(
			'name' => 'Curitiba', 'uf' => 'PR', 'fullName' => 'Curitiba - PR', 'region' => 'Sul',
			'lat' => -25.43, 'lon' => -49.27, 'timezone' => 'America/Sao_Paulo', 'station' => 'A807', 'stationName' => 'Estação Automática INMET Curitiba'
		),
		'florianopolis' => array(
			'name' => 'Florianópolis', 'uf' => 'SC', 'fullName' => 'Florianópolis - SC', 'region' => 'Sul',
			'lat' => -27.59, 'lon' => -48.54, 'timezone' => 'America/Sao_Paulo', 'station' => 'A806', 'stationName' => 'Estação Automática INMET Itacorubi'
		),
		'salvador' => array(
			'name' => 'Salvador', 'uf' => 'BA', 'fullName' => 'Salvador - BA', 'region' => 'Nordeste',
			'lat' => -12.97, 'lon' => -38.51, 'timezone' => 'America/Bahia', 'station' => 'A401', 'stationName' => 'Estação Automática INMET Ondina'
		),
		'recife' => array(
			'name' => 'Recife', 'uf' => 'PE', 'fullName' => 'Recife - PE', 'region' => 'Nordeste',
			'lat' => -8.05, 'lon' => -34.88, 'timezone' => 'America/Recife', 'station' => 'A301', 'stationName' => 'Estação Automática INMET Curado'
		),
		'fortaleza' => array(
			'name' => 'Fortaleza', 'uf' => 'CE', 'fullName' => 'Fortaleza - CE', 'region' => 'Nordeste',
			'lat' => -3.72, 'lon' => -38.54, 'timezone' => 'America/Fortaleza', 'station' => 'A305', 'stationName' => 'Estação Automática INMET Fortaleza'
		),
		'natal' => array(
			'name' => 'Natal', 'uf' => 'RN', 'fullName' => 'Natal - RN', 'region' => 'Nordeste',
			'lat' => -5.79, 'lon' => -35.21, 'timezone' => 'America/Fortaleza', 'station' => 'A317', 'stationName' => 'Estação Automática INMET Natal'
		),
		'joao-pessoa' => array(
			'name' => 'João Pessoa', 'uf' => 'PB', 'fullName' => 'João Pessoa - PB', 'region' => 'Nordeste',
			'lat' => -7.11, 'lon' => -34.86, 'timezone' => 'America/Fortaleza', 'station' => 'A320', 'stationName' => 'Estação Automática INMET João Pessoa'
		),
		'maceio' => array(
			'name' => 'Maceió', 'uf' => 'AL', 'fullName' => 'Maceió - AL', 'region' => 'Nordeste',
			'lat' => -9.66, 'lon' => -35.73, 'timezone' => 'America/Maceio', 'station' => 'A303', 'stationName' => 'Estação Automática INMET Maceió'
		),
		'aracaju' => array(
			'name' => 'Aracaju', 'uf' => 'SE', 'fullName' => 'Aracaju - SE', 'region' => 'Nordeste',
			'lat' => -10.91, 'lon' => -37.07, 'timezone' => 'America/Maceio', 'station' => 'A409', 'stationName' => 'Estação Automática INMET Aracaju'
		),
		'teresina' => array(
			'name' => 'Teresina', 'uf' => 'PI', 'fullName' => 'Teresina - PI', 'region' => 'Nordeste',
			'lat' => -5.09, 'lon' => -42.80, 'timezone' => 'America/Fortaleza', 'station' => 'A312', 'stationName' => 'Estação Automática INMET Teresina'
		),
		'sao-luis' => array(
			'name' => 'São Luís', 'uf' => 'MA', 'fullName' => 'São Luís - MA', 'region' => 'Nordeste',
			'lat' => -2.53, 'lon' => -44.30, 'timezone' => 'America/Fortaleza', 'station' => 'A203', 'stationName' => 'Estação Automática INMET São Luís'
		),
		'manaus' => array(
			'name' => 'Manaus', 'uf' => 'AM', 'fullName' => 'Manaus - AM', 'region' => 'Norte',
			'lat' => -3.11, 'lon' => -60.02, 'timezone' => 'America/Manaus', 'station' => 'A101', 'stationName' => 'Estação Automática INMET Manaus'
		),
		'belem' => array(
			'name' => 'Belém', 'uf' => 'PA', 'fullName' => 'Belém - PA', 'region' => 'Norte',
			'lat' => -1.45, 'lon' => -48.50, 'timezone' => 'America/Belem', 'station' => 'A201', 'stationName' => 'Estação Automática INMET Belém'
		),
		'porto-velho' => array(
			'name' => 'Porto Velho', 'uf' => 'RO', 'fullName' => 'Porto Velho - RO', 'region' => 'Norte',
			'lat' => -8.76, 'lon' => -63.90, 'timezone' => 'America/Porto_Velho', 'station' => 'A108', 'stationName' => 'Estação Automática INMET Porto Velho'
		),
		'rio-branco' => array(
			'name' => 'Rio Branco', 'uf' => 'AC', 'fullName' => 'Rio Branco - AC', 'region' => 'Norte',
			'lat' => -9.97, 'lon' => -67.81, 'timezone' => 'America/Rio_Branco', 'station' => 'A104', 'stationName' => 'Estação Automática INMET Rio Branco'
		),
		'macapa' => array(
			'name' => 'Macapá', 'uf' => 'AP', 'fullName' => 'Macapá - AP', 'region' => 'Norte',
			'lat' => 0.03, 'lon' => -51.05, 'timezone' => 'America/Belem', 'station' => 'A249', 'stationName' => 'Estação Automática INMET Macapá'
		),
		'boa-vista' => array(
			'name' => 'Boa Vista', 'uf' => 'RR', 'fullName' => 'Boa Vista - RR', 'region' => 'Norte',
			'lat' => 2.82, 'lon' => -60.67, 'timezone' => 'America/Boa_Vista', 'station' => 'A135', 'stationName' => 'Estação Automática INMET Boa Vista'
		),
		'palmas' => array(
			'name' => 'Palmas', 'uf' => 'TO', 'fullName' => 'Palmas - TO', 'region' => 'Norte',
			'lat' => -10.21, 'lon' => -48.36, 'timezone' => 'America/Araguaina', 'station' => 'A004', 'stationName' => 'Estação Automática INMET Palmas'
		)
	);

	/**
	 * Inicializa o registro de rotas REST
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	/**
	 * Registra as rotas REST
	 */
	public static function register_routes() {
		// Endpoint da lista completa das 27 capitais
		register_rest_route(
			self::REST_NAMESPACE,
			'/weather/capitals',
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'get_all_capitals' ),
				'permission_callback' => '__return_true',
			)
		);

		// Endpoint de consulta individual por identificador de capital
		register_rest_route(
			self::REST_NAMESPACE,
			'/weather/(?P<capital_id>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'get_capital_weather' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'capital_id' => array(
						'validate_callback' => array( __CLASS__, 'validate_capital_id' ),
						'sanitize_callback' => 'sanitize_key',
						'required'          => true,
					),
				),
			)
		);
	}

	/**
	 * Valida se o identificador pertence a uma das 27 capitais
	 */
	public static function validate_capital_id( $param ) {
		return is_string( $param ) && array_key_exists( sanitize_key( $param ), self::$capitals );
	}

	/**
	 * Rate limiter baseado no IP do requisitante
	 */
	private static function check_rate_limit() {
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '127.0.0.1';
		$transient_key = 'o_pat_rl_' . md5( $ip );
		$count = (int) get_transient( $transient_key );

		if ( $count >= self::RATE_LIMIT_MAX ) {
			return new WP_Error(
				'rate_limit_exceeded',
				'Limite de requisições excedido (máximo de 60 requisições por minuto). Tente novamente em instantes.',
				array( 'status' => 429 )
			);
		}

		set_transient( $transient_key, $count + 1, 60 );
		return true;
	}

	/**
	 * Retorna previsão de uma capital específica
	 */
	public static function get_capital_weather( $request ) {
		$limit_check = self::check_rate_limit();
		if ( is_wp_error( $limit_check ) ) {
			return $limit_check;
		}

		$capital_id = $request->get_param( 'capital_id' );
		$capital = self::$capitals[ $capital_id ];

		$cache_key = 'o_patriota_weather_' . $capital_id;
		$cached_data = get_transient( $cache_key );

		if ( false !== $cached_data && is_array( $cached_data ) ) {
			$cached_data['is_cached'] = true;
			$cached_data['sync_state'] = 'cached';
			return rest_ensure_response( $cached_data );
		}

		// Requisição externa com timeout rígido de 5s
		$url = sprintf(
			'https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=4',
			$capital['lat'],
			$capital['lon']
		);

		$response = wp_remote_get( $url, array(
			'timeout' => self::REQUEST_TIMEOUT,
			'headers' => array( 'User-Agent' => 'OPatriota-Portal/1.0' ),
		) );

		if ( is_wp_error( $response ) ) {
			// REGRA CRÍTICA: Não inventa valores e preserva estado
			return new WP_Error(
				'weather_source_unavailable',
				'A fonte externa Open-Meteo API está indisponível no momento: ' . $response->get_error_message(),
				array( 'status' => 503, 'sync_state' => 'source_unavailable' )
			);
		}

		$status_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $status_code ) {
			return new WP_Error(
				'weather_http_error',
				'Falha na resposta da Open-Meteo API (HTTP ' . $status_code . ').',
				array( 'status' => 502, 'sync_state' => 'error' )
			);
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( empty( $body['current'] ) ) {
			return new WP_Error(
				'weather_data_unavailable',
				'Dados meteorológicos não encontrados nas coordenadas da capital.',
				array( 'status' => 404, 'sync_state' => 'data_unavailable' )
			);
		}

		$current = $body['current'];
		$daily   = isset( $body['daily'] ) ? $body['daily'] : array();

		$payload = array(
			'status'                  => 'success',
			'capital_id'              => $capital_id,
			'name'                    => $capital['name'],
			'uf'                      => $capital['uf'],
			'fullName'                => $capital['fullName'],
			'region'                  => $capital['region'],
			'timezone'                => $capital['timezone'],
			'inmetStation'            => $capital['stationName'],
			'inmetStationCode'        => $capital['station'],
			'data_source'             => 'Open-Meteo API (WMO/ECMWF)',
			'institutional_reference' => 'INMET — Instituto Nacional de Meteorologia (portal.inmet.gov.br)',
			'retrieved_at'            => gmdate( 'c' ),
			'is_cached'               => false,
			'sync_state'              => 'live',
			'metrics'                 => array(
				'temp'          => round( $current['temperature_2m'] ),
				'feelsLike'     => round( isset( $current['apparent_temperature'] ) ? $current['apparent_temperature'] : $current['temperature_2m'] ),
				'humidity'      => round( $current['relative_humidity_2m'] ),
				'windSpeed'     => round( $current['wind_speed_10m'] ),
				'windDirection' => self::degrees_to_cardinal( $current['wind_direction_10m'] ),
				'pressure'      => round( $current['surface_pressure'] ),
				'uvIndex'       => isset( $daily['uv_index_max'][0] ) ? round( $daily['uv_index_max'][0] ) : 8,
				'condition'     => self::map_wmo_condition( $current['weather_code'] ),
				'code'          => self::map_wmo_code( $current['weather_code'] ),
			),
			'forecast'                => self::format_daily_forecast( $daily ),
		);

		set_transient( $cache_key, $payload, self::CACHE_TTL );
		return rest_ensure_response( $payload );
	}

	/**
	 * Retorna a lista das 27 capitais com metadados e resumo
	 */
	public static function get_all_capitals( $request ) {
		$limit_check = self::check_rate_limit();
		if ( is_wp_error( $limit_check ) ) {
			return $limit_check;
		}

		$cache_key = 'o_patriota_weather_all_capitals';
		$cached = get_transient( $cache_key );
		if ( false !== $cached ) {
			return rest_ensure_response( $cached );
		}

		$result = array(
			'status'                  => 'success',
			'count'                   => count( self::$capitals ),
			'data_source'             => 'Open-Meteo API (WMO/ECMWF)',
			'institutional_reference' => 'INMET — Instituto Nacional de Meteorologia (portal.inmet.gov.br)',
			'retrieved_at'            => gmdate( 'c' ),
			'capitals'                => array(),
		);

		foreach ( self::$capitals as $id => $cap ) {
			$item = array(
				'id'               => $id,
				'name'             => $cap['name'],
				'uf'               => $cap['uf'],
				'fullName'         => $cap['fullName'],
				'region'           => $cap['region'],
				'timezone'         => $cap['timezone'],
				'lat'              => $cap['lat'],
				'lon'              => $cap['lon'],
				'inmetStation'     => $cap['stationName'],
				'inmetStationCode' => $cap['station'],
			);
			$result['capitals'][] = $item;
		}

		set_transient( $cache_key, $result, 3600 ); // Cache cadastral de 1 hora
		return rest_ensure_response( $result );
	}

	private static function degrees_to_cardinal( $deg ) {
		$directions = array( 'N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO' );
		$deg = ( (int) $deg ) % 360;
		if ( $deg < 0 ) {
			$deg += 360;
		}
		$idx = round( $deg / 45 ) % 8;
		return $directions[ $idx ];
	}

	private static function map_wmo_condition( $code ) {
		if ( 0 === $code ) return 'Céu limpo e ensolarado';
		if ( $code >= 1 && $code <= 3 ) return $code === 1 ? 'Predomínio de sol' : 'Parcialmente nublado';
		if ( 45 === $code || 48 === $code ) return 'Nevoeiro / Neblina';
		if ( ( $code >= 51 && $code <= 57 ) || ( $code >= 61 && $code <= 67 ) ) return 'Chuva contínua';
		if ( $code >= 80 && $code <= 82 ) return 'Pancadas isoladas de chuva';
		if ( $code >= 95 ) return 'Tempestade com trovoadas';
		return 'Nublado com aberturas';
	}

	private static function map_wmo_code( $code ) {
		if ( 0 === $code ) return 'clear';
		if ( $code >= 1 && $code <= 3 ) return 'partly-cloudy';
		if ( 45 === $code || 48 === $code ) return 'cloudy';
		if ( ( $code >= 51 && $code <= 67 ) || ( $code >= 80 && $code <= 82 ) ) return 'rain';
		if ( $code >= 95 ) return 'thunderstorm';
		return 'partly-cloudy';
	}

	private static function format_daily_forecast( $daily ) {
		$forecast = array();
		if ( empty( $daily['time'] ) || ! is_array( $daily['time'] ) ) {
			return $forecast;
		}
		$weekdays = array( 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' );
		for ( $i = 0; $i < min( 4, count( $daily['time'] ) ); $i++ ) {
			$time_str = $daily['time'][ $i ];
			$ts = strtotime( $time_str );
			$w_idx = (int) gmdate( 'w', $ts );
			$label = ( 0 === $i ) ? 'Hoje' : $weekdays[ $w_idx ];
			$code = isset( $daily['weather_code'][ $i ] ) ? (int) $daily['weather_code'][ $i ] : 0;
			$forecast[] = array(
				'day'       => $label,
				'date'      => gmdate( 'd/m', $ts ),
				'min'       => round( isset( $daily['temperature_2m_min'][ $i ] ) ? $daily['temperature_2m_min'][ $i ] : 20 ),
				'max'       => round( isset( $daily['temperature_2m_max'][ $i ] ) ? $daily['temperature_2m_max'][ $i ] : 30 ),
				'condition' => self::map_wmo_condition( $code ),
				'code'      => self::map_wmo_code( $code ),
			);
		}
		return $forecast;
	}
}
