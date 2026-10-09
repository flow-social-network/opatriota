import { 
  BRAZIL_CAPITALS_WEATHER, 
  fetchLiveCapitalWeather, 
  WEATHER_METADATA_INFO,
  getSyncStateMeta,
  CapitalWeather 
} from '../src/data/weatherData';

async function runComprehensiveWeatherAudit() {
  console.log('=================================================================');
  console.log('AUDITORIA TÉCNICA E TESTES DO MÓDULO METEOROLÓGICO — O PATRIOTA');
  console.log('=================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, desc: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${desc}`);
      process.exitCode = 1;
    }
  }

  // 1. TESTE DAS 27 CAPITAIS
  console.log('1. TESTE DE COBERTURA DAS 27 CAPITAIS FEDERATIVAS:');
  assert(BRAZIL_CAPITALS_WEATHER.length === 27, 'Total exato de 27 capitais federativas registradas');

  const regionCounts: Record<string, number> = {
    'Centro-Oeste': 0,
    'Sudeste': 0,
    'Sul': 0,
    'Nordeste': 0,
    'Norte': 0
  };

  const uniqueIds = new Set<string>();
  const uniqueUfs = new Set<string>();

  BRAZIL_CAPITALS_WEATHER.forEach(c => {
    uniqueIds.add(c.id);
    uniqueUfs.add(c.uf);
    if (c.region in regionCounts) {
      regionCounts[c.region]++;
    }
  });

  assert(uniqueIds.size === 27, 'Todos os 27 IDs são únicos e normalizados');
  assert(uniqueUfs.size === 27, 'Todas as 27 UFs estão presentes sem repetições');
  assert(regionCounts['Centro-Oeste'] === 4, 'Centro-Oeste possui 4 capitais (DF, GO, MT, MS)');
  assert(regionCounts['Sudeste'] === 4, 'Sudeste possui 4 capitais (SP, RJ, MG, ES)');
  assert(regionCounts['Sul'] === 3, 'Sul possui 3 capitais (RS, PR, SC)');
  assert(regionCounts['Nordeste'] === 9, 'Nordeste possui 9 capitais (BA, PE, CE, RN, PB, AL, SE, PI, MA)');
  assert(regionCounts['Norte'] === 7, 'Norte possui 7 capitais (AM, PA, RO, AC, AP, RR, TO)');

  // 2. TESTE DE CONSISTÊNCIA DOS CAMPOS METEOROLÓGICOS E ESTAÇÕES INMET
  console.log('\n2. TESTE DE INTEGRIDADE DOS CAMPOS E CÓDIGOS DE ESTAÇÃO INMET:');
  let validStations = true;
  let validForecasts = true;
  let validSensors = true;

  BRAZIL_CAPITALS_WEATHER.forEach(c => {
    if (!c.inmetStationCode || !c.inmetStation || !c.timezone) validStations = false;
    if (!Array.isArray(c.forecast) || c.forecast.length !== 4) validForecasts = false;
    if (
      typeof c.temp !== 'number' ||
      typeof c.feelsLike !== 'number' ||
      typeof c.humidity !== 'number' ||
      typeof c.pressure !== 'number' ||
      typeof c.windSpeed !== 'number' ||
      typeof c.uvIndex !== 'number' ||
      !c.windDirection ||
      !c.condition
    ) {
      validSensors = false;
    }
  });

  assert(validStations, 'Todas as 27 capitais possuem estação INMET oficial, código e fuso horário');
  assert(validForecasts, 'Todas as 27 capitais possuem projeção diária de 4 dias');
  assert(validSensors, 'Todas as medições meteorológicas (temp, sensação, umidade, vento, pressão, UV) são válidas');

  // 3. TESTE DE IDENTIFICAÇÃO DE FONTES E TRANSPARÊNCIA
  console.log('\n3. TESTE DE TRANSPARÊNCIA E ATRIBUIÇÃO DE FONTES:');
  assert(WEATHER_METADATA_INFO.liveProvider.includes('Open-Meteo'), 'Open-Meteo identificado como provedor do modelo dinâmico');
  assert(WEATHER_METADATA_INFO.institutionalReference.includes('INMET'), 'INMET identificado como referência cadastral e de estações');
  assert(WEATHER_METADATA_INFO.fieldsDocumentation.length >= 8, 'Dicionário com 8+ variáveis meteorológicas documentadas');

  // 4. TESTE DE ESTADOS EXPLÍCITOS DE SINCRONIZAÇÃO
  console.log('\n4. TESTE DOS 6 ESTADOS EXPLÍCITOS DE SINCRONIZAÇÃO:');
  const states = ['live', 'cached', 'loading', 'source_unavailable', 'data_unavailable', 'error'] as const;
  states.forEach(s => {
    const meta = getSyncStateMeta(s);
    assert(!!meta.label && !!meta.indicatorColor && !!meta.description, `Estado explícito '${s}' configurado: ${meta.label}`);
  });

  // 5. TESTE DE CONSULTA EM TEMPO REAL (OPEN-METEO API)
  console.log('\n5. TESTE DE REQUISIÇÃO REAL À OPEN-METEO API:');
  const sampleCapital = BRAZIL_CAPITALS_WEATHER[0]; // Brasília
  const liveResult = await fetchLiveCapitalWeather(sampleCapital);

  assert(liveResult.isSuccess === true, 'Consulta dinâmica bem-sucedida para Brasília');
  assert(liveResult.state === 'live', "Estado retornado é 'live'");
  assert(liveResult.dataSource.includes('Open-Meteo'), "Fonte identificada como 'Open-Meteo API'");
  assert(typeof liveResult.updatedCapital?.temp === 'number', 'Temperatura em tempo real retornada com sucesso');
  assert(liveResult.updatedCapital?.forecast.length === 4, 'Previsão de 4 dias atualizada com datas e dias da semana');

  // 6. TESTE DE REGRA CRÍTICA: NUNCA ATUALIZAR TIMESTAMP NA FALHA
  console.log('\n6. TESTE DA REGRA CRÍTICA (NÃO ATUALIZAÇÃO DE TIMESTAMP EM FALHAS):');
  const originalTimestamp = '2026-10-09T07:00:00.000Z';
  const mockFailingCapital: CapitalWeather = {
    ...sampleCapital,
    lat: 999.0, // Coordenada inválida forçando erro na API externa
    lon: 999.0,
    lastSuccessfulSync: originalTimestamp
  };

  const failResult = await fetchLiveCapitalWeather(mockFailingCapital);
  assert(failResult.isSuccess === false, 'Requisição com falha detectada corretamente');
  assert(failResult.state === 'data_unavailable' || failResult.state === 'error', 'Estado reflete erro ou dados indisponíveis');
  assert(
    failResult.updatedCapital?.lastSuccessfulSync === originalTimestamp,
    'Horário da última consulta bem-sucedida preservado estritamente inalterado em caso de falha'
  );

  console.log('\n=================================================================');
  console.log(`RESULTADO DA AUDITORIA: ${passedTests}/${totalTests} testes aprovados.`);
  console.log('=================================================================\n');
}

runComprehensiveWeatherAudit();
