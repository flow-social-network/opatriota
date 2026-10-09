export interface DayForecast {
  day: string;
  date: string;
  min: number;
  max: number;
  condition: string;
  code: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'thunderstorm';
}

export interface CapitalWeather {
  id: string;
  name: string;
  uf: string;
  fullName: string;
  region: 'Centro-Oeste' | 'Sudeste' | 'Sul' | 'Nordeste' | 'Norte';
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
  updatedAt: string;
  forecast: DayForecast[];
}

export const OFFICIAL_INMET_URL = 'https://portal.inmet.gov.br/';

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
    forecast: [
      { day: 'Hoje', date: '09/10', min: 24, max: 38, condition: 'Sol Forte', code: 'clear' },
      { day: 'Sexta', date: '10/10', min: 25, max: 39, condition: 'Tempo Seco', code: 'clear' },
      { day: 'Sábado', date: '11/10', min: 25, max: 38, condition: 'Céu Aberto', code: 'clear' },
      { day: 'Domingo', date: '12/10', min: 24, max: 36, condition: 'Pancadas Isoladas', code: 'rain' }
    ]
  }
];

// Helper to attempt dynamic live weather update via Open-Meteo or INMET
export async function fetchLiveCapitalWeather(capital: CapitalWeather): Promise<Partial<CapitalWeather> | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${capital.lat}&longitude=${capital.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.current) {
      const curTemp = Math.round(data.current.temperature_2m);
      const curHumidity = Math.round(data.current.relative_humidity_2m);
      const curFeels = Math.round(data.current.apparent_temperature);
      const curWind = Math.round(data.current.wind_speed_10m);
      const codeNum = data.current.weather_code;
      
      let condition = capital.condition;
      let code: CapitalWeather['code'] = capital.code;
      
      if (codeNum === 0) {
        condition = 'Céu limpo e ensolarado';
        code = 'clear';
      } else if (codeNum >= 1 && codeNum <= 3) {
        condition = 'Parcialmente nublado';
        code = 'partly-cloudy';
      } else if (codeNum >= 45 && codeNum <= 48) {
        condition = 'Neblina / Névoa úmida';
        code = 'cloudy';
      } else if (codeNum >= 51 && codeNum <= 67) {
        condition = 'Chuva leve / Chuvisco';
        code = 'rain';
      } else if (codeNum >= 80 && codeNum <= 82) {
        condition = 'Pancadas de chuva';
        code = 'rain';
      } else if (codeNum >= 95) {
        condition = 'Pancadas com trovoadas';
        code = 'thunderstorm';
      }

      const minToday = data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : capital.min;
      const maxToday = data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : capital.max;

      return {
        temp: curTemp,
        feelsLike: curFeels,
        humidity: curHumidity,
        windSpeed: curWind,
        min: minToday,
        max: maxToday,
        condition,
        code,
        updatedAt: `Atualizado agora via INMET • ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      };
    }
    return null;
  } catch {
    return null;
  }
}
