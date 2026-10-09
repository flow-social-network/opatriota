import { EditorialPolicyStatus, FactualClassification, RssSource } from '../types';

/**
 * ADENDO AO MANUAL EDITORIAL — POLÍTICA DE FONTES
 * Diretrizes para integridade editorial, restrição a veículos da Rede Globo
 * e tratamento criterioso de alegações especulativas.
 */

export const GLOBO_DOMAINS = [
  'globo.com',
  'g1.globo.com',
  'oglobo.globo.com',
  'valor.globo.com',
  'ge.globo.com',
  'gshow.globo.com',
  'globoplay.globo.com',
  'cbn.globoradio.globo.com',
  'editoraglobo.globo.com',
  'epocanegocios.globo.com',
  'revistaepoca.globo.com',
  'globorural.globo.com',
  'revistacrescer.globo.com',
  'revistagalileu.globo.com',
  'autoesporte.globo.com',
  'casaejardim.globo.com',
  'quem.globo.com'
];

export const GLOBO_IDENTIFIERS = [
  'globo',
  'g1',
  'o globo',
  'globonews',
  'rede globo',
  'tv globo',
  'valor econômico',
  'valor economico',
  'rádio cbn',
  'radio cbn',
  'cbn',
  'jornal nacional',
  'fantástico',
  'revista época',
  'epoca negocios'
];

/**
 * Verifica se uma URL ou nome pertence ao Grupo Globo
 */
export function isGloboSource(input: string | Partial<RssSource>): boolean {
  if (!input) return false;

  let textToCheck = '';
  if (typeof input === 'string') {
    textToCheck = input.toLowerCase();
  } else {
    textToCheck = [
      input.name || '',
      input.officialUrl || '',
      input.rssUrl || '',
      input.newsUrl || '',
      input.notes || ''
    ].join(' ').toLowerCase();
  }

  // Verificar domínios
  for (const domain of GLOBO_DOMAINS) {
    if (textToCheck.includes(domain)) {
      return true;
    }
  }

  // Verificar identificadores em palavras inteiras
  for (const id of GLOBO_IDENTIFIERS) {
    const regex = new RegExp(`\\b${id}\\b`, 'i');
    if (regex.test(textToCheck)) {
      return true;
    }
  }

  return false;
}

/**
 * Metadados explicativos para cada status de política editorial
 */
export interface PolicyMeta {
  label: string;
  shortLabel: string;
  badgeClass: string;
  bgLight: string;
  borderClass: string;
  description: string;
  isAllowedDirectCitation: boolean;
  requiresIndependentCheck: boolean;
}

export const EDITORIAL_POLICY_CONFIG: Record<EditorialPolicyStatus, PolicyMeta> = {
  APROVADA_CONSULTA_CITACAO: {
    label: 'Aprovada para consulta e citação',
    shortLabel: 'Aprovada',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgLight: 'bg-emerald-50',
    borderClass: 'border-emerald-500',
    description: 'Fonte cadastrada e autorizada para fundamentar diretamente matérias factuais de O PATRIOTA.',
    isAllowedDirectCitation: true,
    requiresIndependentCheck: false
  },
  CONSULTA_EXIGE_CONFIRMACAO: {
    label: 'Consulta permitida, mas exige confirmação independente',
    shortLabel: 'Exige Confirmação',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    bgLight: 'bg-amber-50',
    borderClass: 'border-amber-500',
    description: 'Informação útil para alerta de pauta, porém não pode sustentar matéria isoladamente sem validação oficial primária.',
    isAllowedDirectCitation: false,
    requiresIndependentCheck: true
  },
  OPINIAO_ANALISE: {
    label: 'Opinião ou análise, não equivalente a fonte factual primária',
    shortLabel: 'Opinião / Análise',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    bgLight: 'bg-blue-50',
    borderClass: 'border-blue-500',
    description: 'Artigo de opinião, editorial ou análise de comentarista. Deve ser citada estritamente como ponto de vista atribuído.',
    isAllowedDirectCitation: false,
    requiresIndependentCheck: true
  },
  EXCLUIDA_POLITICA_EDITORIAL: {
    label: 'Excluída por política editorial (Restrição Grupo Globo / Diretrizes)',
    shortLabel: 'Excluída Editorialmente',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    bgLight: 'bg-rose-50',
    borderClass: 'border-rose-500',
    description: 'Veículo vedado como sustentação editorial conforme diretriz do jornal. Notícias devem ser checadas em fontes primárias.',
    isAllowedDirectCitation: false,
    requiresIndependentCheck: true
  },
  DESATIVADA_OPERACIONAL: {
    label: 'Desativada por indisponibilidade ou razão operacional',
    shortLabel: 'Desativada',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-300',
    bgLight: 'bg-gray-50',
    borderClass: 'border-gray-400',
    description: 'Feed inoperante, erro persistente de timeout ou descontinuidade de publicação.',
    isAllowedDirectCitation: false,
    requiresIndependentCheck: true
  }
};

/**
 * Avalia se uma fonte é permitida para seleção automática e citação direta
 */
export function isSourceAllowedForCitation(source: RssSource): boolean {
  // Se for veículo do Grupo Globo, bloqueia automaticamente
  if (isGloboSource(source)) {
    return false;
  }

  // Se tiver status explícito de exclusão ou exigência de checagem
  if (source.editorialPolicy === 'EXCLUIDA_POLITICA_EDITORIAL') {
    return false;
  }
  if (source.editorialPolicy === 'DESATIVADA_OPERACIONAL') {
    return false;
  }
  if (source.editorialPolicy === 'CONSULTA_EXIGE_CONFIRMACAO') {
    return false;
  }
  if (source.editorialPolicy === 'OPINIAO_ANALISE') {
    return false;
  }

  return source.isActive;
}

/**
 * Classifica a natureza factual de uma manchete ou pauta
 * Evita transformar especulações e hipóteses em fatos consolidados
 */
export function classifyLeadFactualStatus(
  title: string,
  summary: string = '',
  sourceName: string = ''
): {
  classification: FactualClassification;
  label: string;
  badgeClass: string;
  isSpeculative: boolean;
  recommendation: string;
} {
  const combined = `${title} ${summary}`.toLowerCase();

  // Padrões de especulação e rumor
  const speculationPatterns = [
    /\bpode ser\b/,
    /\bpode anunciar\b/,
    /\bpoderá\b/,
    /\bcogita\b/,
    /\bsinaliza\b/,
    /\bteria dito\b/,
    /\bteria sido\b/,
    /\baponta rumor\b/,
    /\brumores indicam\b/,
    /\bespecula-se\b/,
    /\bfontes em reserva\b/,
    /\binterlocutores avaliam\b/,
    /\bprovável\b/,
    /\bem estudo\b/,
    /\bavalia proposta\b/,
    /\bprojeção indica\b/
  ];

  // Padrões de opinião e análise
  const opinionPatterns = [
    /\bcolunista\b/,
    /\banálise:\b/,
    /\banalise:\b/,
    /\bopinião:\b/,
    /\bopiniao:\b/,
    /\bartigo:\b/,
    /\beditorial:\b/,
    /\bcomentarista\b/,
    /\bavalia que\b/,
    /\bcritica\b/,
    /\belogia\b/
  ];

  // Padrões de fato confirmado documentado
  const confirmedFactPatterns = [
    /\bdiário oficial\b/,
    /\bdecreto nº\b/,
    /\bdecreto n°\b/,
    /\blei nº\b/,
    /\bpromulga\b/,
    /\bsanciona\b/,
    /\bcomunicado oficial\b/,
    /\bportaria nº\b/,
    /\bresolução nº\b/,
    /\bacórdão\b/,
    /\bsúmula vinculante\b/,
    /\brelatório do banco central\b/,
    /\bdados consolidados do ibge\b/
  ];

  for (const pat of confirmedFactPatterns) {
    if (pat.test(combined)) {
      return {
        classification: 'fato_confirmado',
        label: 'Fato Confirmado por Documento Oficial',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        isSpeculative: false,
        recommendation: 'Informação respaldada por ato público, norma ou registro documental oficial.'
      };
    }
  }

  for (const pat of speculationPatterns) {
    if (pat.test(combined)) {
      return {
        classification: 'especulacao_hipotese',
        label: 'Alegação Especulativa / Hipótese',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
        isSpeculative: true,
        recommendation: 'Manchete expressa hipótese ou rumor político. Não trate como fato estabelecido; busque comprovação primária.'
      };
    }
  }

  for (const pat of opinionPatterns) {
    if (pat.test(combined)) {
      return {
        classification: 'analise_opiniao',
        label: 'Análise / Opinião de Comentarista',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
        isSpeculative: false,
        recommendation: 'Ponto de vista valorativo. Tratar estritamente como declaração ou interpretação de autor identificado.'
      };
    }
  }

  // Se menciona fontes atribuídas
  if (/\bsegundo\b|\bafirma\b|\bdeclarou\b|\bdisse\b|\bconforme\b/.test(combined)) {
    return {
      classification: 'informacao_atribuida',
      label: 'Informação Atribuída a Fonte Declarada',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      isSpeculative: false,
      recommendation: 'Atribua expressamente a declaração ao interlocutor e evite generalizações categóricas.'
    };
  }

  return {
    classification: 'inconclusivo',
    label: 'Informação a Verificar',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    isSpeculative: false,
    recommendation: 'Requer conferência de contexto e checagem cruzada antes do fechamento editorial.'
  };
}
