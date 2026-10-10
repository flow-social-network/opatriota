// ─── Artigos e Conteúdo ───

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

export type ContentAccessLevel = 'aberto' | 'assinante' | 'premium';

export type FactVerdict =
  | 'VERDADEIRO'
  | 'FALSO'
  | 'ENGANOSO'
  | 'FORA DE CONTEXTO'
  | 'NÃO COMPROVADO';

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

// ─── API Contracts ───

export interface ArticleListResponse {
  items: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ArticleDetailResponse {
  article: Article;
  related?: Article[];
}

export interface CreateArticleRequest {
  title: string;
  subtitle?: string;
  kicker?: string;
  category: CategorySlug;
  content: string;
  accessLevel?: ContentAccessLevel;
  tags?: string[];
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  editorialStatus?: EditorialStatus;
  reviewNotes?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

// ─── Editorial ───

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

export interface AuditAction {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  notes?: string;
  previousStatus?: string;
  newStatus?: string;
}
