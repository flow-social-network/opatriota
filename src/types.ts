export type CategorySlug = 
  | 'todos'
  | 'politica'
  | 'brasil'
  | 'economia'
  | 'seguranca'
  | 'saude'
  | 'cultura'
  | 'esportes'
  | 'tecnologia'
  | 'mundo'
  | 'opiniao'
  | 'checagem';

export type FactVerdict = 
  | 'VERDADEIRO'
  | 'FALSO'
  | 'ENGANOSO'
  | 'FORA DE CONTEXTO'
  | 'NÃO COMPROVADO';

export type EditorialStatus = 
  | 'RECEBIDA'
  | 'EM TRIAGEM'
  | 'EM APURAÇÃO'
  | 'EM REDAÇÃO'
  | 'EM REVISÃO'
  | 'CORREÇÕES'
  | 'APROVADA'
  | 'AGENDADA'
  | 'PUBLICADA'
  | 'REJEITADA'
  | 'ARQUIVADA';

export type DedupStatus = 
  | 'NOVO'
  | 'POSSÍVEL DUPLICADO'
  | 'DUPLICADO CONFIRMADO'
  | 'ATUALIZAÇÃO'
  | 'REVISÃO MANUAL';

export type ContentAccessLevel = 'aberto' | 'assinante' | 'premium';

export type UserRole = 
  | 'leitor_gratuito' 
  | 'assinante_digital' 
  | 'assinante_premium' 
  | 'jornalista' 
  | 'revisor' 
  | 'editor' 
  | 'editor_chefe' 
  | 'administrador';

export interface AuditAction {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  notes?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface ArticleSEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeywords?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  kicker: string;
  category: CategorySlug;
  tags?: string[];
  content: string;
  author: string;
  authorId?: string;
  authorRole: string;
  publishedAt: string;
  updatedAt?: string;
  scheduledFor?: string;
  readTimeMinutes: number;
  imageUrl: string;
  imageCaption: string;
  imageCredits?: string;
  sourceName: string;
  sourceUrl?: string;
  sourcesConsulted?: string[];
  accessLevel: ContentAccessLevel;
  editorialStatus: EditorialStatus;
  reviewNotes?: string;
  auditLog?: AuditAction[];
  seo?: ArticleSEO;
  isFactCheck?: boolean;
  factVerdict?: FactVerdict;
  factClaim?: string;
  factDocuments?: string[];
  priority?: 'alta' | 'media' | 'normal';
}

export interface FactCheckItem {
  id: string;
  slug: string;
  title: string;
  claim: string;
  claimant: string;
  verdict: FactVerdict;
  imageUrl: string;
  context: string;
  conclusion: string;
  documents: { title: string; url: string }[];
  factChecker: string;
  date: string;
}

export type OfficialSourceCategory =
  | 'Partidos políticos'
  | 'Presidência da República'
  | 'Governo Federal'
  | 'Ministérios'
  | 'Banco Central'
  | 'Congresso Nacional'
  | 'Poder Judiciário'
  | 'Tribunais eleitorais'
  | 'Tribunais de contas'
  | 'Polícia Federal'
  | 'Polícia Rodoviária Federal'
  | 'Polícias estaduais'
  | 'Governos estaduais'
  | 'Secretarias de Segurança Pública'
  | 'Defesa Civil'
  | 'Ministério Público'
  | 'Economia e finanças'
  | 'Transparência pública'
  | 'Municípios'
  | 'Outras fontes oficiais';

export type SourceIntegrationType = 
  | 'RSS Feed' 
  | 'Monitoramento Editorial' 
  | 'API Pública' 
  | 'Scraping Autorizado';

export type SourceValidationStatus = 
  | 'VALIDADO' 
  | 'EM VERIFICAÇÃO' 
  | 'SEM RSS (MONITORAMENTO MANUAL)' 
  | 'PENDENTE';

/**
 * Adendo ao Manual Editorial — Política de Fontes
 * Classificação mandatória para integridade editorial de O PATRIOTA
 */
export type EditorialPolicyStatus = 
  | 'APROVADA_CONSULTA_CITACAO'       // Aprovada para consulta e citação
  | 'CONSULTA_EXIGE_CONFIRMACAO'      // Consulta permitida, mas exige confirmação independente
  | 'OPINIAO_ANALISE'                 // Opinião ou análise, não equivalente a fonte factual primária
  | 'EXCLUIDA_POLITICA_EDITORIAL'     // Excluída por política editorial (ex.: Rede Globo / restrições estatutárias)
  | 'DESATIVADA_OPERACIONAL';         // Desativada por indisponibilidade ou outra razão operacional

/**
 * Classificação factual de alegações e manchetes
 * Distingue fato documentado de especulações e hipóteses
 */
export type FactualClassification = 
  | 'fato_confirmado'         // Fato confirmado por documentação ou evidências verificáveis
  | 'informacao_atribuida'    // Informação atribuída a uma fonte identificada
  | 'analise_opiniao'         // Análise ou opinião de comentarista
  | 'especulacao_hipotese'    // Especulação sem confirmação suficiente
  | 'inconclusivo';           // Informação inconclusiva

export interface RssSource {
  id: number;
  name: string;
  sourceCategory?: OfficialSourceCategory;
  uf?: string; // 'BR', 'RS', etc.
  officialUrl: string;
  newsUrl?: string;
  rssUrl: string;
  sourceType: 'órgão público' | 'governo' | 'congresso' | 'tribunal' | 'agência oficial' | 'veículo' | 'partido';
  category: CategorySlug;
  integrationType?: SourceIntegrationType;
  validationStatus?: SourceValidationStatus;
  editorialPolicy?: EditorialPolicyStatus;
  editorialPolicyReason?: string;
  isActive: boolean;
  pollFrequencyMin: number;
  lastPolled: string;
  lastSuccess: string;
  lastError: string | null;
  lastVerified?: string;
  lastImported?: string;
  itemsReceived: number;
  notes?: string;
}

export interface EditorialQueueItem {
  id: number;
  title: string;
  summary: string;
  originalUrl: string;
  canonicalUrl: string;
  sourceName: string;
  category: CategorySlug;
  capturedAt: string;
  dedupStatus: DedupStatus;
  dedupReason: string;
  editorialStatus: EditorialStatus;
  assignedTo?: string;
  editorialPolicy?: EditorialPolicyStatus;
  factualClassification?: FactualClassification;
  factualVerificationNotes?: string;
  independentConfirmationRequired?: boolean;
  confirmedSources?: string[];
  convertedPostId?: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  planName: string;
  status: 'concluido' | 'processando' | 'reembolsado';
  invoiceNumber: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  subscription: {
    plan: 'gratuito' | 'digital' | 'premium';
    status: 'ativo' | 'inativo' | 'cancelamento_pendente';
    validUntil?: string;
    autoRenew: boolean;
  };
  bookmarks: string[]; // Article IDs
  notificationPrefs: {
    breakingNews: boolean;
    dailyBrief: boolean;
    factChecks: boolean;
    weeklyDigest: boolean;
  };
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  fileType: string;
  sizeBytes: number;
  caption?: string;
  credits?: string;
}

export interface SubscriptionPlan {
  id: 'gratuito' | 'digital' | 'premium';
  name: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number;
  originalPriceMonthly?: number;
  originalPriceAnnual?: number;
  promoNotice?: string;
  loyaltyTerm?: string;
  description: string;
  benefits: string[];
  accessLevel: ContentAccessLevel;
  isPopular?: boolean;
  bestValue?: boolean;
}

export type PageModelType = 
  | 'institucional'
  | 'categoria'
  | 'noticia'
  | 'autor'
  | 'pesquisa'
  | 'arquivo'
  | 'contato'
  | 'exclusivo'
  | 'planos'
  | '404'
  | 'personalizada';

export type PageStatus = 'publicada' | 'rascunho' | 'revisao' | 'despublicada';

export interface TocItem {
  id: string;
  title: string;
}

export interface RelatedLink {
  label: string;
  url: string;
  description?: string;
}

export interface InstitutionalPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  badge: string;
  model: PageModelType;
  content: string;
  toc?: TocItem[];
  updatedAt: string;
  publishedAt: string;
  status: PageStatus;
  featuredImage?: string;
  menuLocations: ('header' | 'topbar' | 'footer_col2' | 'footer_col3' | 'nenhum')[];
  seo: ArticleSEO;
  author?: string;
  relatedLinks?: RelatedLink[];
  customBlocks?: any[];
}

export interface CategoryDetail {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  introText: string;
  bannerImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  active: boolean;
  order: number;
}

export interface AuthorDetail {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  credentials?: string;
  email?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ContactSubmission {
  id: string;
  date: string;
  name: string;
  email: string;
  phone?: string;
  subject: 'sugestao_pauta' | 'correcao_materia' | 'duvida_editorial' | 'comercial' | 'institucional';
  articleRef?: string;
  message: string;
  status: 'recebido' | 'em_analise' | 'respondido';
}

export interface LgpdRequest {
  id: string;
  date: string;
  name: string;
  email: string;
  documentId?: string;
  requestType: 'acesso' | 'correcao' | 'exclusao' | 'revogacao_consentimento';
  details: string;
  status: 'recebido' | 'em_processamento' | 'concluido';
}

export interface SiteMenuItem {
  id: string;
  label: string;
  url: string;
  type: 'pagina' | 'categoria' | 'custom';
  target?: string;
}

export interface SiteMenuConfig {
  mainNav: SiteMenuItem[];
  topBar: SiteMenuItem[];
  footerCol1: SiteMenuItem[];
  footerCol2: SiteMenuItem[];
  footerCol3: SiteMenuItem[];
}
