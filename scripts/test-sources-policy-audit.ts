import { 
  isGloboSource, 
  isSourceAllowedForCitation, 
  classifyLeadFactualStatus, 
  EDITORIAL_POLICY_CONFIG,
  GLOBO_DOMAINS 
} from '../src/utils/editorialPolicy';
import { INITIAL_RSS_SOURCES, INITIAL_EDITORIAL_QUEUE } from '../src/data/mockData';
import { RssSource } from '../src/types';

function runSourcesPolicyAudit() {
  console.log('========================================================================');
  console.log('AUDITORIA DA POLÍTICA DE FONTES & RESTRIÇÃO EDITORIAL — O PATRIOTA BRASIL');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, desc: string) {
    total++;
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      process.exitCode = 1;
    }
  }

  // 1. TESTE DE DETECÇÃO DE DOMÍNIOS E VEÍCULOS DA REDE GLOBO
  console.log('1. TESTE DE IDENTIFICAÇÃO E DETECÇÃO DO GRUPO GLOBO:');
  const testGloboUrls = [
    'https://g1.globo.com/politica/noticia/2026/10/exemplo.ghtml',
    'https://oglobo.globo.com/economia/artigo-exemplo',
    'https://valor.globo.com/financas/noticia-exemplo',
    'https://cbn.globoradio.globo.com/noticias/exemplo',
    'https://globonews.globo.com/aovivo'
  ];

  testGloboUrls.forEach(url => {
    assert(isGloboSource(url), `Domínio Globo detectado corretamente: ${url}`);
  });

  const testGloboNames = ['G1', 'O Globo', 'GloboNews', 'Rede Globo', 'TV Globo', 'Valor Econômico', 'Rádio CBN'];
  testGloboNames.forEach(name => {
    assert(isGloboSource(name), `Identificador do Grupo Globo detectado: ${name}`);
  });

  // Teste de fontes oficiais válidas não marcadas falsamente como Globo
  const testLegitSources = [
    'https://www.camara.leg.br/',
    'https://www12.senado.leg.br/',
    'https://www.gov.br/planalto/',
    'https://estado.rs.gov.br/',
    'https://portal.inmet.gov.br/'
  ];
  testLegitSources.forEach(url => {
    assert(!isGloboSource(url), `Fonte legítima não confundida com Globo: ${url}`);
  });

  // 2. TESTE DE BLOQUEIO DE SELEÇÃO AUTOMÁTICA DE FONTES EXCLUÍDAS
  console.log('\n2. TESTE DE BLOQUEIO PARA SUSTENTAÇÃO EDITORIAL AUTOMÁTICA:');
  const mockGloboSource: RssSource = {
    id: 999,
    name: 'G1 Política',
    officialUrl: 'https://g1.globo.com/',
    rssUrl: 'https://g1.globo.com/rss',
    sourceType: 'veículo',
    category: 'politica',
    isActive: true,
    pollFrequencyMin: 60,
    lastPolled: '',
    lastSuccess: '',
    lastError: null,
    itemsReceived: 0,
    editorialPolicy: 'EXCLUIDA_POLITICA_EDITORIAL'
  };

  assert(
    isSourceAllowedForCitation(mockGloboSource) === false,
    'Fonte com editorialPolicy EXCLUIDA_POLITICA_EDITORIAL é bloqueada para sustentação direta'
  );

  const mockOfficialSource: RssSource = {
    id: 1000,
    name: 'Agência Senado',
    officialUrl: 'https://senado.leg.br',
    rssUrl: 'https://senado.leg.br/rss',
    sourceType: 'órgão público',
    category: 'politica',
    isActive: true,
    pollFrequencyMin: 60,
    lastPolled: '',
    lastSuccess: '',
    lastError: null,
    itemsReceived: 10,
    editorialPolicy: 'APROVADA_CONSULTA_CITACAO'
  };

  assert(
    isSourceAllowedForCitation(mockOfficialSource) === true,
    'Fonte oficial aprovada é autorizada para sustentação direta'
  );

  // 3. TESTE DE CLASSIFICAÇÃO DE MANCHETES ESPECULATIVAS VS FATOS DOCUMENTADOS
  console.log('\n3. TESTE DE DISTINÇÃO FACTUAL (ALEGAÇÕES ESPECULATIVAS VS FATOS):');
  
  const speculativeHeadline = 'Governo pode anunciar nova reformulação fiscal em novembro, cogitam interlocutores';
  const specResult = classifyLeadFactualStatus(speculativeHeadline);
  assert(
    specResult.classification === 'especulacao_hipotese',
    `Manchete com rumor ("pode anunciar", "cogitam") classificada como 'especulacao_hipotese': "${specResult.label}"`
  );
  assert(
    specResult.isSpeculative === true,
    'Flag isSpeculative ativada para impedir que hipótese vire fato consolidado'
  );

  const confirmedHeadline = 'Presidente promulga Lei nº 15.240 publicada no Diário Oficial da União';
  const confResult = classifyLeadFactualStatus(confirmedHeadline);
  assert(
    confResult.classification === 'fato_confirmado',
    `Manchete com ato oficial/DOU classificada como 'fato_confirmado': "${confResult.label}"`
  );

  const opinionHeadline = 'Análise: Comentarista avalia desdobramentos eleitorais no Congresso';
  const opResult = classifyLeadFactualStatus(opinionHeadline);
  assert(
    opResult.classification === 'analise_opiniao',
    `Manchete de comentário classificada como 'analise_opiniao': "${opResult.label}"`
  );

  const attributedHeadline = 'Ministro da Fazenda afirma que meta fiscal será mantida em 2027';
  const attrResult = classifyLeadFactualStatus(attributedHeadline);
  assert(
    attrResult.classification === 'informacao_atribuida',
    `Manchete atribuída declarada classificada como 'informacao_atribuida': "${attrResult.label}"`
  );

  // 4. TESTE DOS 5 ESTADOS DE POLÍTICA EDITORIAL
  console.log('\n4. TESTE DA ESTRUTURA DOS 5 ESTADOS DA POLÍTICA EDITORIAL:');
  const policyKeys = [
    'APROVADA_CONSULTA_CITACAO',
    'CONSULTA_EXIGE_CONFIRMACAO',
    'OPINIAO_ANALISE',
    'EXCLUIDA_POLITICA_EDITORIAL',
    'DESATIVADA_OPERACIONAL'
  ] as const;

  policyKeys.forEach(p => {
    const config = EDITORIAL_POLICY_CONFIG[p];
    assert(
      !!config && !!config.label && !!config.shortLabel && !!config.badgeClass,
      `Status editorial '${p}' configurado: ${config?.label}`
    );
  });

  // 5. TESTE DA BASE INICIAL DE FONTES E FILA
  console.log('\n5. TESTE DA BASE INICIAL E PRESERVAÇÃO DE REGISTROS HISTÓRICOS:');
  const globoCatalogued = INITIAL_RSS_SOURCES.find(s => s.id === 99 || isGloboSource(s));
  assert(
    !!globoCatalogued,
    'Registro do Grupo Globo catalogado na base para histórico'
  );
  assert(
    globoCatalogued?.editorialPolicy === 'EXCLUIDA_POLITICA_EDITORIAL',
    'Registro do Grupo Globo marcado como EXCLUIDA_POLITICA_EDITORIAL'
  );
  assert(
    globoCatalogued?.isActive === false,
    'Registro do Grupo Globo desativado para ingestão e sustentação automatizada'
  );

  const speculativeQueueItem = INITIAL_EDITORIAL_QUEUE.find(q => q.id === 105);
  assert(
    !!speculativeQueueItem,
    'Item de teste na fila editorial com fonte com restrição e manchete especulativa presente'
  );
  assert(
    speculativeQueueItem?.independentConfirmationRequired === true,
    'Item especulativo exige confirmação independente obrigatória'
  );

  console.log('\n========================================================================');
  console.log(`RESULTADO DA AUDITORIA DE FONTES: ${passed}/${total} testes aprovados.`);
  console.log('========================================================================\n');
}

runSourcesPolicyAudit();
