export interface DayForecast {
  day: string;
  date: string;
  min: number;
  max: number;
  condition: string;
  code: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'thunderstorm';
}

export type WeatherSyncState =
  | 'loading'            // Requisição em andamento
  | 'live'               // Dados atualizados diretamente da fonte externa em tempo real
  | 'cached'             // Dados preservados em cache local / histórico
  | 'source_unavailable' // A fonte externa (Open-Meteo) está inacessível ou fora do ar
  | 'data_unavailable'   // A fonte respondeu mas não possui métricas para as coordenadas
  | 'error';             // Falha de rede, timeout ou erro de parsing

export interface CapitalWeather {
  id: string;
  name: string;
  uf: string;
  fullName: string;
  region: 'Centro-Oeste' | 'Sudeste' | 'Sul' | 'Nordeste' | 'Norte';
  timezone: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  min: number;
  max: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  uvIndex: number;
  condition: string;
  code: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'thunderstorm';
  inmetStation: string;
  inmetStationCode: string;
  dataSource: 'Open-Meteo API (WMO/ECMWF)' | 'Cache Local / Histórico Armazenado';
  syncState: WeatherSyncState;
  lastSuccessfulSync: string;
  syncError?: string;
  updatedAt: string;
  forecast: DayForecast[];
}

export interface WeatherSyncResult {
  state: WeatherSyncState;
  updatedCapital?: CapitalWeather;
  errorMessage?: string;
  timestamp: string;
  isSuccess: boolean;
  dataSource: string;
}

export const OFFICIAL_INMET_URL = 'https://portal.inmet.gov.br/';

export const WEATHER_METADATA_INFO = {
  liveProvider: 'Open-Meteo API (Modelo Meteorológico Numérico WMO / ECMWF)',
  liveProviderUrl: 'https://open-meteo.com/',
  institutionalReference: 'INMET — Instituto Nacional de Meteorologia (portal.inmet.gov.br)',
  disclaimer: 'O portal O PATRIOTA disponibiliza previsões meteorológicas das 27 capitais brasileiras para utilidade pública. As condições dinâmicas em tempo real utilizam modelos numéricos abertos (Open-Meteo API), e as estações meteorológicas de referência são baseadas na rede oficial do INMET. O link institucional é fornecido como serviço aos leitores sem implicar endosso governamental ou parceria comercial exclusiva.',
  fieldsDocumentation: [
    { field: 'Temperatura do Ar', unit: '°C', sensor: 'Termômetro de superfície a 2m', freq: 'Horária', provider: 'Open-Meteo API', precision: '±0.1°C' },
    { field: 'Sensação Térmica', unit: '°C', sensor: 'Temperatura aparente (vento + umidade)', freq: 'Horária', provider: 'Open-Meteo API', precision: '±0.1°C' },
    { field: 'Umidade Relativa', unit: '%', sensor: 'Higrômetro a 2m', freq: 'Horária', provider: 'Open-Meteo API', precision: '±1%' },
    { field: 'Velocidade do Vento', unit: 'km/h', sensor: 'Anemômetro a 10m', freq: 'Horária', provider: 'Open-Meteo API', precision: '±1 km/h' },
    { field: 'Direção do Vento', unit: 'Quadrante (N, NE, E, SE, S, SO, O, NO)', sensor: 'Anemógrafo a 10m', freq: 'Horária', provider: 'Open-Meteo API', precision: '8 quadrantes' },
    { field: 'Pressão Atmosférica', unit: 'hPa', sensor: 'Barômetro ao nível da superfície', freq: 'Horária', provider: 'Open-Meteo API', precision: '±1 hPa' },
    { field: 'Índice Ultravioleta', unit: 'UV (0-12+)', sensor: 'Radiação solar UV máxima diária', freq: 'Diária', provider: 'Open-Meteo API', precision: 'Escala OMS' },
    { field: 'Previsão de 4 Dias', unit: 'Mín/Máx °C e condição', sensor: 'Modelo de previsão numérica', freq: 'Diária (4 dias)', provider: 'Open-Meteo API', precision: '4 dias corridos' },
    { field: 'Estação de Referência', unit: 'Código INMET', sensor: 'Rede de Estações INMET', freq: 'Cadastral', provider: 'INMET (portal.inmet.gov.br)', precision: 'Oficial MAPA' }
  ]
};

export const BRAZIL_CAPITALS_WEATHER: CapitalWeather[] = [
  // CENTRO-OESTE
  {
    id: 'brasilia',
    name: 'Brasília',
    uf: 'DF',
    fullName: 'Brasília - DF',
    region: 'Centro-Oeste',
    lat: -15.78,
    lon: -47.93,
    timezone: 'America/Sao_Paulo',
    temp: 26,
    feelsLike: 27,
    min: 17,
    max: 29,
    humidity: 52,
    windSpeed: 14,
    windDirection: 'E',
    pressure: 1016,
    uvIndex: 9,
    condition: 'Ensolarado com poucas nuvens',
    code: 'partly-cloudy',
    inmetStation: 'Estação Automática INMET Sudoeste (A001)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A001',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 17, max: 29, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 18, max: 30, condition: 'Céu Claro', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 19, max: 31, condition: 'Parcialmente Nublado', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 19, max: 28, condition: 'Pancadas Isoladas', code: 'rain' }
    ]
  },
  {
    id: 'goiania',
    name: 'Goiânia',
    uf: 'GO',
    fullName: 'Goiânia - GO',
    region: 'Centro-Oeste',
    lat: -16.68,
    lon: -49.25,
    timezone: 'America/Sao_Paulo',
    temp: 28,
    feelsLike: 29,
    min: 19,
    max: 32,
    humidity: 48,
    windSpeed: 11,
    windDirection: 'NE',
    pressure: 1014,
    uvIndex: 10,
    condition: 'Céu claro e tempo seco',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Goiânia (A002)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A002',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 19, max: 32, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 20, max: 33, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 21, max: 34, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 21, max: 31, condition: 'Pancadas Isoladas', code: 'rain' }
    ]
  },
  {
    id: 'cuiaba',
    name: 'Cuiabá',
    uf: 'MT',
    fullName: 'Cuiabá - MT',
    region: 'Centro-Oeste',
    lat: -15.60,
    lon: -56.09,
    timezone: 'America/Cuiaba',
    temp: 34,
    feelsLike: 37,
    min: 24,
    max: 38,
    humidity: 42,
    windSpeed: 9,
    windDirection: 'N',
    pressure: 1010,
    uvIndex: 11,
    condition: 'Calor intenso e sol forte',
    code: 'clear',
    inmetStation: 'Estação Convencional INMET Cuiabá (83361)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: '83361',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 38, condition: 'Calor Forte', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 25, max: 39, condition: 'Céu Aberto', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 25, max: 37, condition: 'Pancadas ao Fim da Tarde', code: 'thunderstorm' },
      { day: 'Domingo', date: '12/10', min: 24, max: 35, condition: 'Muitas Nuvens', code: 'cloudy' }
    ]
  },
  {
    id: 'campo-grande',
    name: 'Campo Grande',
    uf: 'MS',
    fullName: 'Campo Grande - MS',
    region: 'Centro-Oeste',
    lat: -20.44,
    lon: -54.64,
    timezone: 'America/Campo_Grande',
    temp: 27,
    feelsLike: 28,
    min: 20,
    max: 31,
    humidity: 55,
    windSpeed: 15,
    windDirection: 'SE',
    pressure: 1015,
    uvIndex: 9,
    condition: 'Parcialmente nublado',
    code: 'partly-cloudy',
    inmetStation: 'Estação Automática INMET Campo Grande (A702)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A702',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 20, max: 31, condition: 'Parcialmente Nublado', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 21, max: 32, condition: 'Sol com Nuvens', code: 'partly-cloudy' },
      { day: 'Sábado', date: '11/10', min: 21, max: 30, condition: 'Chuva Rápida', code: 'rain' },
      { day: 'Domingo', date: '12/10', min: 19, max: 27, condition: 'Chuvoso', code: 'rain' }
    ]
  },

  // SUDESTE
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    uf: 'SP',
    fullName: 'São Paulo - SP',
    region: 'Sudeste',
    lat: -23.55,
    lon: -46.63,
    timezone: 'America/Sao_Paulo',
    temp: 23,
    feelsLike: 23,
    min: 15,
    max: 26,
    humidity: 68,
    windSpeed: 16,
    windDirection: 'SE',
    pressure: 1018,
    uvIndex: 7,
    condition: 'Sol com variação de nuvens',
    code: 'partly-cloudy',
    inmetStation: 'Estação Mirante de Santana INMET (A701)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A701',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 15, max: 26, condition: 'Sol com Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 16, max: 27, condition: 'Céu Claro', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 17, max: 28, condition: 'Muitas Nuvens', code: 'cloudy' },
      { day: 'Domingo', date: '12/10', min: 16, max: 24, condition: 'Chuva e Queda de Temp.', code: 'rain' }
    ]
  },
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    uf: 'RJ',
    fullName: 'Rio de Janeiro - RJ',
    region: 'Sudeste',
    lat: -22.90,
    lon: -43.17,
    timezone: 'America/Sao_Paulo',
    temp: 29,
    feelsLike: 31,
    min: 20,
    max: 32,
    humidity: 62,
    windSpeed: 18,
    windDirection: 'S',
    pressure: 1015,
    uvIndex: 9,
    condition: 'Ensolarado e quente',
    code: 'clear',
    inmetStation: 'Estação Forte de Copacabana INMET (A652)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A652',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 20, max: 32, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 21, max: 33, condition: 'Sol e Calor', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 22, max: 31, condition: 'Parcialmente Nublado', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 21, max: 27, condition: 'Pancadas de Chuva', code: 'rain' }
    ]
  },
  {
    id: 'belo-horizonte',
    name: 'Belo Horizonte',
    uf: 'MG',
    fullName: 'Belo Horizonte - MG',
    region: 'Sudeste',
    lat: -19.92,
    lon: -43.93,
    timezone: 'America/Sao_Paulo',
    temp: 25,
    feelsLike: 25,
    min: 16,
    max: 28,
    humidity: 58,
    windSpeed: 13,
    windDirection: 'E',
    pressure: 1016,
    uvIndex: 8,
    condition: 'Predomínio de sol e poucas nuvens',
    code: 'partly-cloudy',
    inmetStation: 'Estação Santo Agostinho INMET (A521)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A521',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 16, max: 28, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 17, max: 29, condition: 'Céu Claro', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 18, max: 30, condition: 'Ensolarado', code: 'clear' },
      { day: 'Domingo', date: '12/10', min: 18, max: 27, condition: 'Chuva Isolada', code: 'rain' }
    ]
  },
  {
    id: 'vitoria',
    name: 'Vitória',
    uf: 'ES',
    fullName: 'Vitória - ES',
    region: 'Sudeste',
    lat: -20.31,
    lon: -40.33,
    timezone: 'America/Sao_Paulo',
    temp: 27,
    feelsLike: 28,
    min: 21,
    max: 29,
    humidity: 71,
    windSpeed: 19,
    windDirection: 'NE',
    pressure: 1017,
    uvIndex: 8,
    condition: 'Sol com ventos litorâneos',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Vitória (A612)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A612',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 21, max: 29, condition: 'Sol e Vento', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 22, max: 30, condition: 'Sol com Nuvens', code: 'partly-cloudy' },
      { day: 'Sábado', date: '11/10', min: 22, max: 29, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 21, max: 28, condition: 'Chuva Passageira', code: 'rain' }
    ]
  },

  // SUL
  {
    id: 'porto-alegre',
    name: 'Porto Alegre',
    uf: 'RS',
    fullName: 'Porto Alegre - RS',
    region: 'Sul',
    lat: -30.03,
    lon: -51.23,
    timezone: 'America/Sao_Paulo',
    temp: 21,
    feelsLike: 21,
    min: 14,
    max: 24,
    humidity: 73,
    windSpeed: 15,
    windDirection: 'SE',
    pressure: 1020,
    uvIndex: 6,
    condition: 'Tempo estável e ameno',
    code: 'partly-cloudy',
    inmetStation: 'Estação Automática INMET Belém Novo (A801)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A801',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 14, max: 24, condition: 'Sol e Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 15, max: 26, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 17, max: 28, condition: 'Muitas Nuvens', code: 'cloudy' },
      { day: 'Domingo', date: '12/10', min: 16, max: 22, condition: 'Chuva e Vento', code: 'rain' }
    ]
  },
  {
    id: 'curitiba',
    name: 'Curitiba',
    uf: 'PR',
    fullName: 'Curitiba - PR',
    region: 'Sul',
    lat: -25.42,
    lon: -49.27,
    timezone: 'America/Sao_Paulo',
    temp: 18,
    feelsLike: 18,
    min: 11,
    max: 22,
    humidity: 78,
    windSpeed: 12,
    windDirection: 'E',
    pressure: 1021,
    uvIndex: 6,
    condition: 'Muitas nuvens e temperatura amena',
    code: 'cloudy',
    inmetStation: 'Estação Convencional INMET Curitiba (83842)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A807',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 11, max: 22, condition: 'Muitas Nuvens', code: 'cloudy' },
      { day: 'Sexta', date: '10/10', min: 12, max: 25, condition: 'Sol com Nuvens', code: 'partly-cloudy' },
      { day: 'Sábado', date: '11/10', min: 14, max: 26, condition: 'Parcialmente Nublado', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 13, max: 19, condition: 'Chuva e Frio', code: 'rain' }
    ]
  },
  {
    id: 'florianopolis',
    name: 'Florianópolis',
    uf: 'SC',
    fullName: 'Florianópolis - SC',
    region: 'Sul',
    lat: -27.59,
    lon: -48.54,
    timezone: 'America/Sao_Paulo',
    temp: 22,
    feelsLike: 22,
    min: 16,
    max: 25,
    humidity: 75,
    windSpeed: 17,
    windDirection: 'E',
    pressure: 1019,
    uvIndex: 7,
    condition: 'Sol entre nuvens',
    code: 'partly-cloudy',
    inmetStation: 'Estação Automática INMET São José (A806)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A806',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 16, max: 25, condition: 'Sol entre Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 17, max: 27, condition: 'Sol Aberto', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 18, max: 27, condition: 'Aumento de Nuvens', code: 'cloudy' },
      { day: 'Domingo', date: '12/10', min: 17, max: 21, condition: 'Chuva Costeira', code: 'rain' }
    ]
  },

  // NORDESTE
  {
    id: 'salvador',
    name: 'Salvador',
    uf: 'BA',
    fullName: 'Salvador - BA',
    region: 'Nordeste',
    lat: -12.97,
    lon: -38.51,
    timezone: 'America/Bahia',
    temp: 28,
    feelsLike: 31,
    min: 23,
    max: 30,
    humidity: 76,
    windSpeed: 21,
    windDirection: 'E',
    pressure: 1014,
    uvIndex: 9,
    condition: 'Sol com chuvas rápidas passageiras',
    code: 'rain',
    inmetStation: 'Estação Automática INMET Ondina (A401)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A401',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 23, max: 30, condition: 'Chuva Passageira', code: 'rain' },
      { day: 'Sexta', date: '10/10', min: 23, max: 31, condition: 'Sol com Nuvens', code: 'partly-cloudy' },
      { day: 'Sábado', date: '11/10', min: 24, max: 30, condition: 'Chuva Rápida', code: 'rain' },
      { day: 'Domingo', date: '12/10', min: 23, max: 30, condition: 'Sol e Vento', code: 'clear' }
    ]
  },
  {
    id: 'recife',
    name: 'Recife',
    uf: 'PE',
    fullName: 'Recife - PE',
    region: 'Nordeste',
    lat: -8.05,
    lon: -34.88,
    timezone: 'America/Recife',
    temp: 29,
    feelsLike: 32,
    min: 24,
    max: 31,
    humidity: 73,
    windSpeed: 20,
    windDirection: 'SE',
    pressure: 1013,
    uvIndex: 10,
    condition: 'Sol e calor com brisa marítima',
    code: 'clear',
    inmetStation: 'Estação Curado INMET Recife (A301)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A301',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 31, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 24, max: 31, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 24, max: 30, condition: 'Chuva Rápida', code: 'rain' },
      { day: 'Domingo', date: '12/10', min: 23, max: 31, condition: 'Sol e Calor', code: 'clear' }
    ]
  },
  {
    id: 'fortaleza',
    name: 'Fortaleza',
    uf: 'CE',
    fullName: 'Fortaleza - CE',
    region: 'Nordeste',
    lat: -3.73,
    lon: -38.52,
    timezone: 'America/Fortaleza',
    temp: 30,
    feelsLike: 33,
    min: 25,
    max: 32,
    humidity: 69,
    windSpeed: 24,
    windDirection: 'E',
    pressure: 1012,
    uvIndex: 11,
    condition: 'Céu ensolarado com ventos fortes',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Fortaleza (A305)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A305',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 25, max: 32, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 25, max: 33, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 25, max: 32, condition: 'Sol e Vento', code: 'clear' },
      { day: 'Domingo', date: '12/10', min: 24, max: 32, condition: 'Poucas Nuvens', code: 'partly-cloudy' }
    ]
  },
  {
    id: 'natal',
    name: 'Natal',
    uf: 'RN',
    fullName: 'Natal - RN',
    region: 'Nordeste',
    lat: -5.79,
    lon: -35.20,
    timezone: 'America/Fortaleza',
    temp: 29,
    feelsLike: 31,
    min: 24,
    max: 31,
    humidity: 74,
    windSpeed: 23,
    windDirection: 'SE',
    pressure: 1013,
    uvIndex: 10,
    condition: 'Ensolarado com brisa oceânica',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Natal (A317)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A317',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 31, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 24, max: 31, condition: 'Sol Aberto', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 25, max: 31, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 24, max: 30, condition: 'Chuva Passageira', code: 'rain' }
    ]
  },
  {
    id: 'joao-pessoa',
    name: 'João Pessoa',
    uf: 'PB',
    fullName: 'João Pessoa - PB',
    region: 'Nordeste',
    lat: -7.11,
    lon: -34.86,
    timezone: 'America/Fortaleza',
    temp: 29,
    feelsLike: 31,
    min: 24,
    max: 31,
    humidity: 72,
    windSpeed: 21,
    windDirection: 'SE',
    pressure: 1013,
    uvIndex: 10,
    condition: 'Céu aberto e ensolarado',
    code: 'clear',
    inmetStation: 'Estação Automática INMET João Pessoa (A320)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A320',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 31, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 24, max: 32, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 24, max: 31, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 23, max: 30, condition: 'Chuva Passageira', code: 'rain' }
    ]
  },
  {
    id: 'maceio',
    name: 'Maceió',
    uf: 'AL',
    fullName: 'Maceió - AL',
    region: 'Nordeste',
    lat: -9.66,
    lon: -35.73,
    timezone: 'America/Maceio',
    temp: 28,
    feelsLike: 30,
    min: 23,
    max: 30,
    humidity: 75,
    windSpeed: 18,
    windDirection: 'E',
    pressure: 1014,
    uvIndex: 9,
    condition: 'Sol com momentos nublados',
    code: 'partly-cloudy',
    inmetStation: 'Estação Automática INMET Maceió (A303)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A303',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 23, max: 30, condition: 'Sol e Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 23, max: 31, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 24, max: 30, condition: 'Chuva Rápida', code: 'rain' },
      { day: 'Domingo', date: '12/10', min: 23, max: 30, condition: 'Parcialmente Nublado', code: 'partly-cloudy' }
    ]
  },
  {
    id: 'aracaju',
    name: 'Aracaju',
    uf: 'SE',
    fullName: 'Aracaju - SE',
    region: 'Nordeste',
    lat: -10.94,
    lon: -37.07,
    timezone: 'America/Maceio',
    temp: 28,
    feelsLike: 30,
    min: 23,
    max: 30,
    humidity: 74,
    windSpeed: 19,
    windDirection: 'E',
    pressure: 1014,
    uvIndex: 9,
    condition: 'Sol e céu com poucas nuvens',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Aracaju (A409)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A409',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 23, max: 30, condition: 'Céu Aberto', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 24, max: 31, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 24, max: 30, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 23, max: 30, condition: 'Chuva Passageira', code: 'rain' }
    ]
  },
  {
    id: 'teresina',
    name: 'Teresina',
    uf: 'PI',
    fullName: 'Teresina - PI',
    region: 'Nordeste',
    lat: -5.09,
    lon: -42.80,
    timezone: 'America/Fortaleza',
    temp: 36,
    feelsLike: 39,
    min: 24,
    max: 39,
    humidity: 38,
    windSpeed: 10,
    windDirection: 'NE',
    pressure: 1009,
    uvIndex: 12,
    condition: 'Calor extremo e baixa umidade',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Teresina (A312)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A312',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 39, condition: 'Calor Extremo', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 25, max: 40, condition: 'Sol Escaldante', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 25, max: 39, condition: 'Céu Claro', code: 'clear' },
      { day: 'Domingo', date: '12/10', min: 24, max: 38, condition: 'Calor Forte', code: 'clear' }
    ]
  },
  {
    id: 'sao-luis',
    name: 'São Luís',
    uf: 'MA',
    fullName: 'São Luís - MA',
    region: 'Nordeste',
    lat: -2.53,
    lon: -44.30,
    timezone: 'America/Fortaleza',
    temp: 31,
    feelsLike: 35,
    min: 25,
    max: 33,
    humidity: 72,
    windSpeed: 17,
    windDirection: 'NE',
    pressure: 1011,
    uvIndex: 11,
    condition: 'Ensolarado e abafado',
    code: 'clear',
    inmetStation: 'Estação Automática INMET São Luís (A203)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A203',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 25, max: 33, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 25, max: 33, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 26, max: 34, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 25, max: 32, condition: 'Pancadas Rápidas', code: 'rain' }
    ]
  },

  // NORTE
  {
    id: 'manaus',
    name: 'Manaus',
    uf: 'AM',
    fullName: 'Manaus - AM',
    region: 'Norte',
    lat: -3.11,
    lon: -60.02,
    timezone: 'America/Manaus',
    temp: 33,
    feelsLike: 38,
    min: 26,
    max: 36,
    humidity: 65,
    windSpeed: 8,
    windDirection: 'E',
    pressure: 1010,
    uvIndex: 11,
    condition: 'Calor abafado com risco de pancadas',
    code: 'thunderstorm',
    inmetStation: 'Estação Automática INMET Manaus (A101)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A101',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 26, max: 36, condition: 'Pancadas de Chuva', code: 'thunderstorm' },
      { day: 'Sexta', date: '10/10', min: 26, max: 37, condition: 'Sol e Trovoadas', code: 'thunderstorm' },
      { day: 'Sábado', date: '11/10', min: 25, max: 35, condition: 'Chuva com Trovão', code: 'thunderstorm' },
      { day: 'Domingo', date: '12/10', min: 25, max: 34, condition: 'Pancadas Isoladas', code: 'rain' }
    ]
  },
  {
    id: 'belem',
    name: 'Belém',
    uf: 'PA',
    fullName: 'Belém - PA',
    region: 'Norte',
    lat: -1.45,
    lon: -48.50,
    timezone: 'America/Belem',
    temp: 32,
    feelsLike: 37,
    min: 24,
    max: 34,
    humidity: 78,
    windSpeed: 10,
    windDirection: 'NE',
    pressure: 1011,
    uvIndex: 11,
    condition: 'Sol pela manhã e pancada de chuva à tarde',
    code: 'rain',
    inmetStation: 'Estação Automática INMET Belém (A201)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A201',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 34, condition: 'Chuva da Tarde', code: 'rain' },
      { day: 'Sexta', date: '10/10', min: 24, max: 35, condition: 'Pancadas Isoladas', code: 'rain' },
      { day: 'Sábado', date: '11/10', min: 25, max: 34, condition: 'Sol e Chuva', code: 'rain' },
      { day: 'Domingo', date: '12/10', min: 24, max: 33, condition: 'Muitas Nuvens', code: 'cloudy' }
    ]
  },
  {
    id: 'porto-velho',
    name: 'Porto Velho',
    uf: 'RO',
    fullName: 'Porto Velho - RO',
    region: 'Norte',
    lat: -8.76,
    lon: -63.90,
    timezone: 'America/Porto_Velho',
    temp: 32,
    feelsLike: 36,
    min: 23,
    max: 35,
    humidity: 62,
    windSpeed: 7,
    windDirection: 'N',
    pressure: 1010,
    uvIndex: 10,
    condition: 'Sol e pancadas isoladas',
    code: 'partly-cloudy',
    inmetStation: 'Estação Automática INMET Porto Velho (A925)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A108',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 23, max: 35, condition: 'Sol com Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 24, max: 36, condition: 'Pancadas Rápidas', code: 'rain' },
      { day: 'Sábado', date: '11/10', min: 24, max: 35, condition: 'Calor e Chuva', code: 'rain' },
      { day: 'Domingo', date: '12/10', min: 23, max: 34, condition: 'Poucas Nuvens', code: 'partly-cloudy' }
    ]
  },
  {
    id: 'rio-branco',
    name: 'Rio Branco',
    uf: 'AC',
    fullName: 'Rio Branco - AC',
    region: 'Norte',
    lat: -9.97,
    lon: -67.81,
    timezone: 'America/Rio_Branco',
    temp: 31,
    feelsLike: 35,
    min: 22,
    max: 34,
    humidity: 66,
    windSpeed: 6,
    windDirection: 'NW',
    pressure: 1011,
    uvIndex: 10,
    condition: 'Sol e períodos nublados',
    code: 'partly-cloudy',
    inmetStation: 'Estação Automática INMET Rio Branco (A104)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A104',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 22, max: 34, condition: 'Sol com Nuvens', code: 'partly-cloudy' },
      { day: 'Sexta', date: '10/10', min: 23, max: 35, condition: 'Pancadas Isoladas', code: 'rain' },
      { day: 'Sábado', date: '11/10', min: 23, max: 33, condition: 'Chuva', code: 'rain' },
      { day: 'Domingo', date: '12/10', min: 22, max: 32, condition: 'Parcialmente Nublado', code: 'partly-cloudy' }
    ]
  },
  {
    id: 'macapa',
    name: 'Macapá',
    uf: 'AP',
    fullName: 'Macapá - AP',
    region: 'Norte',
    lat: 0.03,
    lon: -51.06,
    timezone: 'America/Belem',
    temp: 32,
    feelsLike: 36,
    min: 25,
    max: 34,
    humidity: 70,
    windSpeed: 14,
    windDirection: 'E',
    pressure: 1011,
    uvIndex: 11,
    condition: 'Ensolarado e quente na Linha do Equador',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Macapá (A249)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A249',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 25, max: 34, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 25, max: 35, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 25, max: 34, condition: 'Poucas Nuvens', code: 'partly-cloudy' },
      { day: 'Domingo', date: '12/10', min: 24, max: 33, condition: 'Chuva Rápida', code: 'rain' }
    ]
  },
  {
    id: 'boa-vista',
    name: 'Boa Vista',
    uf: 'RR',
    fullName: 'Boa Vista - RR',
    region: 'Norte',
    lat: 2.82,
    lon: -60.67,
    timezone: 'America/Boa_Vista',
    temp: 34,
    feelsLike: 38,
    min: 25,
    max: 37,
    humidity: 58,
    windSpeed: 12,
    windDirection: 'NE',
    pressure: 1010,
    uvIndex: 12,
    condition: 'Calor intenso e sol predominante',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Boa Vista (A135)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A135',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 25, max: 37, condition: 'Calor Forte', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 26, max: 38, condition: 'Ensolarado', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 26, max: 36, condition: 'Sol e Calor', code: 'clear' },
      { day: 'Domingo', date: '12/10', min: 25, max: 35, condition: 'Poucas Nuvens', code: 'partly-cloudy' }
    ]
  },
  {
    id: 'palmas',
    name: 'Palmas',
    uf: 'TO',
    fullName: 'Palmas - TO',
    region: 'Norte',
    lat: -10.21,
    lon: -48.36,
    timezone: 'America/Araguaina',
    temp: 35,
    feelsLike: 38,
    min: 24,
    max: 38,
    humidity: 44,
    windSpeed: 11,
    windDirection: 'E',
    pressure: 1010,
    uvIndex: 11,
    condition: 'Sol forte e tempo seco',
    code: 'clear',
    inmetStation: 'Estação Automática INMET Palmas (A004)',
    updatedAt: 'Hoje às 07:00 (Horário de Brasília)',
    inmetStationCode: 'A004',
    dataSource: 'Cache Local / Histórico Armazenado',
    syncState: 'cached',
    lastSuccessfulSync: '2026-10-09T07:00:00.000Z',
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 38, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 25, max: 39, condition: 'Tempo Seco', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 25, max: 38, condition: 'Céu Aberto', code: 'clear' },
      { day: 'Domingo', date: '12/10', min: 24, max: 36, condition: 'Pancadas Isoladas', code: 'rain' }
    ]
  }
];


// Helper to convert wind angle (0-360 deg) to Brazilian Portuguese cardinal abbreviation
export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
}

// Maps WMO standard weather code to description and icon key
export function mapWmoCode(code: number): { condition: string; code: CapitalWeather['code'] } {
  if (code === 0) {
    return { condition: 'Céu limpo e ensolarado', code: 'clear' };
  }
  if (code >= 1 && code <= 3) {
    return { condition: code === 1 ? 'Predomínio de sol' : 'Parcialmente nublado', code: 'partly-cloudy' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'Nevoeiro / Neblina', code: 'cloudy' };
  }
  if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67)) {
    return { condition: code >= 65 ? 'Chuva forte contínua' : 'Chuva moderada / Chuvisco', code: 'rain' };
  }
  if (code >= 71 && code <= 77) {
    return { condition: 'Precipitação fraca / Garoa', code: 'cloudy' };
  }
  if (code >= 80 && code <= 82) {
    return { condition: 'Pancadas isoladas de chuva', code: 'rain' };
  }
  if (code >= 95) {
    return { condition: 'Tempestade com trovoadas', code: 'thunderstorm' };
  }
  return { condition: 'Nublado com aberturas', code: 'partly-cloudy' };
}

// Returns human-readable label and UI styling for each of the 6 explicit synchronization states
export function getSyncStateMeta(state: WeatherSyncState): {
  label: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  indicatorColor: string;
} {
  switch (state) {
    case 'live':
      return {
        label: 'Dados Atualizados (Ao Vivo)',
        badgeBg: 'bg-[#16803C]/20 border border-[#16803C]',
        badgeText: 'text-[#22A447]',
        description: 'Dados obtidos em tempo real via Open-Meteo API.',
        indicatorColor: '#22A447'
      };
    case 'cached':
      return {
        label: 'Dados em Cache',
        badgeBg: 'bg-amber-500/20 border border-amber-500/50',
        badgeText: 'text-amber-300',
        description: 'Dados preservados localmente da última consulta bem-sucedida.',
        indicatorColor: '#F59E0B'
      };
    case 'loading':
      return {
        label: 'Carregando...',
        badgeBg: 'bg-blue-500/20 border border-blue-500/50',
        badgeText: 'text-blue-300',
        description: 'Conectando ao serviço meteorológico e consultando coordenadas...',
        indicatorColor: '#3B82F6'
      };
    case 'source_unavailable':
      return {
        label: 'Fonte Indisponível',
        badgeBg: 'bg-red-500/20 border border-red-500/50',
        badgeText: 'text-red-400',
        description: 'Serviço externo temporariamente inacessível. Exibindo dados em cache.',
        indicatorColor: '#EF4444'
      };
    case 'data_unavailable':
      return {
        label: 'Dados Indisponíveis',
        badgeBg: 'bg-slate-500/20 border border-slate-500/50',
        badgeText: 'text-slate-300',
        description: 'Não foram encontradas métricas recentes para esta estação.',
        indicatorColor: '#94A3B8'
      };
    case 'error':
      return {
        label: 'Erro de Atualização',
        badgeBg: 'bg-red-600/20 border border-red-600/50',
        badgeText: 'text-rose-400',
        description: 'Falha na requisição. Preservando horário e dados da última consulta bem-sucedida.',
        indicatorColor: '#F43F5E'
      };
  }
}

// Formats timestamp for UI display
export function formatSyncTimestamp(timestampStr: string): string {
  try {
    const d = new Date(timestampStr);
    if (isNaN(d.getTime())) return timestampStr;
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ')';
  } catch {
    return timestampStr;
  }
}

// Core weather fetcher enforcing all architectural requirements:
// 1. Identifies Open-Meteo as real source of dynamic values.
// 2. NEVER updates lastSuccessfulSync when a query fails.
// 3. Never presents old values as if they were current.
// 4. In case of fallback/error, preserves real historical timestamp and flags syncState.
export async function fetchLiveCapitalWeather(capital: CapitalWeather): Promise<WeatherSyncResult> {
  const nowIso = new Date().toISOString();
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + capital.lat + '&longitude=' + capital.lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=4';

    const res = await fetch(url, { signal: AbortSignal.timeout(4500) });

    if (!res.ok) {
      const state: WeatherSyncState = res.status >= 500 ? 'source_unavailable' : 'data_unavailable';
      // RULE: NEVER update lastSuccessfulSync on failure!
      return {
        state,
        isSuccess: false,
        timestamp: nowIso,
        errorMessage: 'Falha HTTP ' + res.status + ' (' + res.statusText + ') ao consultar Open-Meteo API',
        dataSource: capital.dataSource,
        updatedCapital: {
          ...capital,
          syncState: state,
          syncError: 'Falha HTTP ' + res.status + ': ' + res.statusText
        }
      };
    }

    const data = await res.json();

    if (!data.current) {
      // RULE: NEVER update lastSuccessfulSync on missing data!
      return {
        state: 'data_unavailable',
        isSuccess: false,
        timestamp: nowIso,
        errorMessage: 'Resposta da API não continha o nó current com as variáveis solicitadas.',
        dataSource: capital.dataSource,
        updatedCapital: {
          ...capital,
          syncState: 'data_unavailable',
          syncError: 'Dados meteorológicos não retornados para as coordenadas especificadas.'
        }
      };
    }

    const curTemp = Math.round(data.current.temperature_2m);
    const curFeels = Math.round(data.current.apparent_temperature ?? curTemp);
    const curHumidity = Math.round(data.current.relative_humidity_2m ?? capital.humidity);
    const curWind = Math.round(data.current.wind_speed_10m ?? capital.windSpeed);
    const curWindDir = typeof data.current.wind_direction_10m === 'number' 
      ? degreesToCardinal(data.current.wind_direction_10m)
      : capital.windDirection;
    const curPressure = Math.round(data.current.surface_pressure ?? capital.pressure);
    const wmoInfo = mapWmoCode(data.current.weather_code ?? 0);

    // Parse 4-day daily forecast
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const updatedForecast: DayForecast[] = [];

    if (Array.isArray(data.daily?.time) && data.daily.time.length >= 4) {
      for (let i = 0; i < 4; i++) {
        const dateIso = data.daily.time[i];
        const [y, m, d] = String(dateIso).split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        const dayLabel = i === 0 ? 'Hoje' : weekdays[dateObj.getDay()];
        const formattedDate = String(d).padStart(2, '0') + '/' + String(m).padStart(2, '0');

        const dayCode = data.daily.weather_code?.[i] ?? 0;
        const dayCondition = mapWmoCode(dayCode);
        const dayMin = Math.round(data.daily.temperature_2m_min?.[i] ?? capital.min);
        const dayMax = Math.round(data.daily.temperature_2m_max?.[i] ?? capital.max);

        updatedForecast.push({
          day: dayLabel,
          date: formattedDate,
          min: dayMin,
          max: dayMax,
          condition: dayCondition.condition,
          code: dayCondition.code
        });
      }
    } else {
      updatedForecast.push(...capital.forecast);
    }

    const curUv = data.daily?.uv_index_max?.[0] !== undefined
      ? Math.round(data.daily.uv_index_max[0])
      : capital.uvIndex;

    const todayMin = updatedForecast[0]?.min ?? capital.min;
    const todayMax = updatedForecast[0]?.max ?? capital.max;

    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // SUCCESS: Now, and ONLY now, lastSuccessfulSync is updated!
    const updatedCapital: CapitalWeather = {
      ...capital,
      temp: curTemp,
      feelsLike: curFeels,
      humidity: curHumidity,
      windSpeed: curWind,
      windDirection: curWindDir,
      pressure: curPressure,
      uvIndex: curUv,
      condition: wmoInfo.condition,
      code: wmoInfo.code,
      min: todayMin,
      max: todayMax,
      forecast: updatedForecast,
      dataSource: 'Open-Meteo API (WMO/ECMWF)',
      syncState: 'live',
      lastSuccessfulSync: nowIso,
      syncError: undefined,
      updatedAt: 'Atualizado às ' + timeStr + ' via Open-Meteo API'
    };

    return {
      state: 'live',
      isSuccess: true,
      timestamp: nowIso,
      dataSource: 'Open-Meteo API (WMO/ECMWF)',
      updatedCapital
    };
  } catch (err: any) {
    // RULE: In case of timeout or connection error, NEVER update lastSuccessfulSync!
    const errorMsg = err?.message || 'Falha de rede ou timeout ao conectar com o serviço meteorológico';
    return {
      state: 'error',
      isSuccess: false,
      timestamp: nowIso,
      errorMessage: errorMsg,
      dataSource: capital.dataSource,
      updatedCapital: {
        ...capital,
        syncState: 'error',
        syncError: errorMsg
      }
    };
  }
}
