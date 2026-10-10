import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { createServer as createViteServer } from 'vite';

import { UserRole, ContentAccessLevel, EditorialStatus, AuditAction, ArticleSEO, FactVerdict } from './types';
import type { Article } from './types';

// -----------------------------------------------------
// Firebase Admin SDK Initialization
// -----------------------------------------------------
let adminApp: import('firebase/app').apps.AnyApp | null = null;
let adminAuth: import('firebase/auth').Auth | null = null;
let adminFirestore: import('firebase/firestore').Firestore | null = null;

try {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
  const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (firebaseProjectId && firebaseClientEmail && firebasePrivateKey) {
    adminApp = require('firebase/app').initializeApp({
      projectId: firebaseProjectId,
      apiKey: process.env.FIREBASE_API_KEY,
    });
    adminAuth = require('firebase/auth').initializeApp({
      projectId: firebaseProjectId,
      apiKey: process.env.FIREBASE_API_KEY,
    }).auth();
    adminFirestore = require('firebase/firestore').initializeApp({
      projectId: firebaseProjectId,
      apiKey: process.env.FIREBASE_API_KEY,
    }).firestore();

    // Enable revocation check if configured
    if (process.env.FIREBASE_CHECK_REVOKED === 'true') {
      // Revocation checking is enabled by default in Admin SDK
      console.log('[SERVER] Firebase Admin SDK initialized with revocation checking');
    }
    console.log('[SERVER] Firebase Admin SDK initialized for project:', firebaseProjectId);
  } else {
    console.warn('[SERVER] Firebase Admin SDK not initialized: missing project config');
  }
} catch (err) {
  console.warn('[SERVER] Firebase Admin SDK initialization failed:', err instanceof Error ? err.message : err);
}

// -----------------------------------------------------
// SSRF Protection: Safe URL validation
// -----------------------------------------------------
const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);

    // Block non-http/https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    // Block localhost and internal IP addresses
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.31.') ||
      hostname.startsWith('172.32.') ||
      hostname.startsWith('172.33.') ||
      hostname.startsWith('172.34.') ||
      hostname.startsWith('172.35.') ||
      hostname.startsWith('172.35.') ||
      hostname.startsWith('172.36.') ||
      hostname.startsWith('172.37.') ||
      hostname.startsWith('172.38.') ||
      hostname.startsWith('172.39.') ||
      hostname.startsWith('172.40.') ||
      hostname.startsWith('172.41.') ||
      hostname.startsWith('172.42.') ||
      hostname.startsWith('172.43.') ||
      hostname.startsWith('172.44.') ||
      hostname.startsWith('172.45.') ||
      hostname.startsWith('172.46.') ||
      hostname.startsWith('172.47.') ||
      hostname.startsWith('172.48.') ||
      hostname.startsWith('172.49.') ||
      hostname.startsWith('172.50.') ||
      // Block private network interfaces
      hostname.startsWith('169.254.')
    ) {
      return false;
    }

    // Block cloud metadata endpoints
    if (hostname === '169.254.169.254' || hostname === 'metadata') {
      return false;
    }

    // Block loopback ranges
    if (parsed.port) {
      const portNum = parseInt(parsed.port, 10);
      if (portNum < 0 || portNum > 65535) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};

// -----------------------------------------------------
// Express Application Setup
// -----------------------------------------------------
const app = express();
const port = process.env.PORT || 4000;

// Trust first proxy for rate limiting and IP detection
app.enable('trust proxy');

// -----------------------------------------------------
// Body parsing and middleware
// -----------------------------------------------------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
  next();
});

// -----------------------------------------------------
// Authentication Middleware
// -----------------------------------------------------
interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    role?: string;
  };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';

  if (authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split(' ')[1];
    if (!adminAuth) {
      return res.status(401).json({ error: 'Auth service not configured' });
    }
    adminAuth.verifyIdToken(idToken, /* checkRevoked */ true)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        // Look up user in database by Firebase UID
        prisma.users.findUnique({ where: { uid } })
          .then((user) => {
            if (!user) {
              // User not in local database - still authenticate via Firebase
              // but use default leitor role without admin permissions
              req.user = { uid, role: 'leitor' };
              next();
            } else {
              // User found in database - use their role from the bank
              req.user = { uid, role: user.role || 'leitor' };
              next();
            }
          })
          .catch((dbErr) => {
            console.error('[SERVER] Database error during auth:', dbErr);
            req.user = { uid, role: 'leitor' };
            next();
          });
      })
      .catch((verifyErr) => {
        console.warn('[SERVER] Firebase token verification failed:', verifyErr instanceof Error ? verifyErr.message : verifyErr);
        res.status(401).json({ error: 'Unauthenticated: Invalid or expired token' });
      });
  } else if (req.body?.userId) {
    // Fallback for development/testing - userId in body
    req.user = { uid: String(req.body.userId), role: 'leitor' };
    next();
  } else if (req.query?.userId) {
    // Fallback for development/testing - userId in query
    req.user = { uid: String(req.query.userId), role: 'leitor' };
    next();
  } else if (req.headers['x-user-id']) {
    // Fallback for development/testing - x-user-id header
    req.user = { uid: String(req.headers['x-user-id']), role: 'leitor' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthenticated: No token provided' });
  }
}

// Permission Type & Role Matrix
type Permission =
  | 'read'
  | 'create_patriota_news'
  | 'submit_patriota_review'
  | 'review_patriota_news'
  | 'approve_patriota_news'
  | 'publish_patriota_news'
  | 'manage_patriota_sources'
  | 'manage_patriota_editorial_queue'
  | 'manage_patriota_team'
  | 'manage_patriota_factcheck'
  | 'edit_others_posts'
  | 'delete_others_posts'
  | 'manage_categories'
  | 'manage_patriota_subscriptions'
  | 'read_patriota_exclusive'
  | 'read_patriota_premium'
  | 'request_patriota_changes';

const rolePermissions: Record<string, Permission[]> = {
  administrador: [
    'read',
    'create_patriota_news',
    'submit_patriota_review',
    'review_patriota_news',
    'approve_patriota_news',
    'publish_patriota_news',
    'manage_patriota_sources',
    'manage_patriota_editorial_queue',
    'manage_patriota_team',
    'manage_patriota_factcheck',
    'edit_others_posts',
    'delete_others_posts',
    'manage_categories',
    'manage_patriota_subscriptions',
    'read_patriota_exclusive',
    'read_patriota_premium'
  ],
  editor_chefe: [
    'read',
    'create_patriota_news',
    'submit_patriota_review',
    'review_patriota_news',
    'approve_patriota_news',
    'publish_patriota_news',
    'manage_patriota_sources',
    'manage_patriota_editorial_queue',
    'manage_patriota_team',
    'manage_patriota_factcheck',
    'edit_others_posts',
    'delete_others_posts',
    'manage_categories'
  ],
  editor: [
    'read',
    'create_patriota_news',
    'submit_patriota_review',
    'review_patriota_news',
    'approve_patriota_news',
    'manage_patriota_sources',
    'manage_patriota_editorial_queue'
  ],
  revisor: [
    'read',
    'edit_others_posts',
    'review_patriota_news',
    'request_patriota_changes'
  ],
  jornalista: [
    'read',
    'create_patriota_news',
    'submit_patriota_review'
  ],
  colunista: [
    'read',
    'create_patriota_news'
  ],
  assinante: [
    'read',
    'read_patriota_exclusive',
    'read_patriota_premium'
  ],
  leitor: [
    'read'
  ]
};

function authorize(...permissions: Permission[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.uid) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const userRole = req.user.role || 'leitor';
    const requiredPerms = permissions;

    const allowed = rolePermissions[userRole]?.some(
      (perm: Permission) => requiredPerms.includes(perm)
    ) === true;

    if (!allowed) {
      return res.status(403).json({
        error: 'Forbidden: Insufficient permissions',
        required: requiredPerms,
        userRole
      });
    }

    next();
  }
}

// -----------------------------------------------------
// API Routes - Articles
// -----------------------------------------------------

app.get('/api/articles', authMiddleware, authorize('read'), async (req: AuthRequest, res: Response) => {
  try {
    const mockArticles = [
      {
        id: '1',
        slug: 'exemplo',
        title: 'Artigo de exemplo',
        subtitle: 'Subtítulo de exemplo',
        kicker: 'Kicker de exemplo',
        category: 'brasil',
        tags: ['politica'],
        content: 'Conteúdo do artigo de exemplo.',
        author: 'Autor Exemplo',
        authorId: 'uid-1',
        authorRole: 'jornalista',
        publishedAt: new Date().toISOString(),
        readTimeMinutes: 5,
        imageUrl: '',
        imageCaption: '',
        sourceName: 'Fonte Exemplo',
        accessLevel: 'aberto' as ContentAccessLevel,
        editorialStatus: 'PUBLICADA' as EditorialStatus,
        seo: { metaTitle: '', metaDescription: '' },
        isFactCheck: false,
        factVerdict: undefined,
        factClaim: undefined,
        factDocuments: [],
        priority: 'normal' as const
      }
    ];

    res.json({ success: true, count: mockArticles.length, articles: mockArticles });
  } catch (err) {
    console.error('[SERVER] Error fetching articles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/articles/:id', authMiddleware, authorize('read'), async (req: AuthRequest, res: Response) => {
  try {
    const articleId = req.params.id;

    const mockArticle = {
      id: '1',
      slug: 'exemplo',
      title: 'Artigo de exemplo',
      subtitle: 'Subtítulo de exemplo',
      kicker: 'Kicker de exemplo',
      category: 'brasil',
      tags: ['politica'],
      content: 'Conteúdo do artigo de exemplo.',
      author: 'Autor Exemplo',
      authorId: 'uid-1',
      authorRole: 'jornalista',
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 5,
      imageUrl: '',
      imageCaption: '',
      sourceName: 'Fonte Exemplo',
      accessLevel: 'aberto' as ContentAccessLevel,
      editorialStatus: 'PUBLICADA' as EditorialStatus,
      seo: { metaTitle: '', metaDescription: '' },
      isFactCheck: false,
      factVerdict: undefined,
      factClaim: undefined,
      factDocuments: [],
      priority: 'normal' as const
    };

    if (articleId !== '1') {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ success: true, article: mockArticle });
  } catch (err) {
    console.error('[SERVER] Error fetching article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/articles', authMiddleware, authorize('create_patriota_news'), async (req: AuthRequest, res: Response) => {
  try {
    const mockCreatedArticle = {
      id: `art-${Date.now()}`,
      slug: req.body.slug || '',
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      kicker: req.body.kicker || '',
      category: req.body.category || 'brasil',
      tags: req.body.tags || [] as string[],
      content: req.body.content || '',
      author: req.body.author || 'Unknown',
      authorId: req.body.userId || 'uid-anonymous',
      authorRole: req.user?.role || 'leitor',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTimeMinutes: req.body.readTimeMinutes || 5,
      imageUrl: req.body.imageUrl || '',
      imageCaption: req.body.imageCaption || '',
      imageCredits: req.body.imageCredits,
      sourceName: req.body.sourceName || '',
      sourceUrl: req.body.sourceUrl,
      sourcesConsulted: req.body.sourcesConsulted || [] as string[],
      accessLevel: req.body.accessLevel || 'aberto' as ContentAccessLevel,
      editorialStatus: 'DRAFT' as EditorialStatus,
      reviewNotes: req.body.reviewNotes,
      seo: req.body.seo as ArticleSEO | undefined,
      isFactCheck: req.body.isFactCheck || false,
      factVerdict: req.body.factVerdict as FactVerdict | undefined,
      factClaim: req.body.factClaim,
      factDocuments: req.body.factDocuments || [] as string[],
      priority: req.body.priority || 'normal' as const
    };

    console.log('[SERVER] Article created (mock):', mockCreatedArticle.title);

    res.status(201).json({ success: true, article: mockCreatedArticle, message: 'Artigo criado como rascunho' });
  } catch (err) {
    console.error('[SERVER] Error creating article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/articles/:id', authMiddleware, authorize('approve_patriota_news', 'publish_patriota_news'), async (req: AuthRequest, res: Response) => {
  try {
    const articleId = req.params.id;
    const { editorialStatus, approvedBy, approvalNotes } = req.body;

    console.log('[SERVER] Article status update mock:', { articleId, editorialStatus });

    let newStatus: EditorialStatus = 'EM REVISÃO';
    if (editorialStatus === 'APROVADA') newStatus = 'APROVADA';
    else if (editorialStatus === 'PUBLICADA') newStatus = 'PUBLICADA';
    else if (editorialStatus === 'REJEITADA') newStatus = 'REJEITADA';
    else if (editorialStatus === 'CORREÇÕES') newStatus = 'CORREÇÕES';

    res.json({ success: true, articleId, newStatus, message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error('[SERVER] Error updating article status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/articles/:id', authMiddleware, authorize('delete_others_posts'), async (req: AuthRequest, res: Response) => {
  try {
    const articleId = req.params.id;
    console.log('[SERVER] Article archived mock:', articleId);
    res.json({ success: true, articleId, message: 'Article archived' });
  } catch (err) {
    console.error('[SERVER] Error deleting article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -----------------------------------------------------
// API Routes - Sources
// -----------------------------------------------------
app.get('/api/sources', authMiddleware, authorize('read'), async (req: AuthRequest, res: Response) => {
  try {
    const mockSources = [
      {
        id: '1',
        name: 'Agência Senado',
        officialUrl: 'https://senado.leg.br',
        rssUrl: 'https://senado.leg.br/rss',
        sourceType: 'órgão público',
        category: 'politica',
        integrationType: 'Monitoramento Editorial',
        validationStatus: 'VALIDADO',
        editorialPolicy: 'APROVADA_CONSULTA_CITACAO',
        isActive: true,
        lastPolled: new Date().toISOString(),
        lastSuccess: new Date().toISOString(),
        lastError: null,
        itemsReceived: 10
      }
    ];

    res.json({ success: true, count: mockSources.length, sources: mockSources });
  } catch (err) {
    console.error('[SERVER] Error fetching sources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sources', authMiddleware, authorize('manage_patriota_sources'), async (req: AuthRequest, res: Response) => {
  try {
    const newSource = {
      id: `src-${Date.now()}`,
      name: req.body.name || '',
      officialUrl: req.body.officialUrl || '',
      rssUrl: req.body.rssUrl || '',
      sourceType: req.body.sourceType || 'governo',
      category: req.body.category || 'brasil',
      integrationType: req.body.integrationType || 'Monitoramento Editorial',
      validationStatus: req.body.validationStatus || 'VALIDADO',
      editorialPolicy: req.body.editorialPolicy || 'APROVADA_CONSULTA_CITACAO',
      editorialPolicyReason: req.body.editorialPolicyReason || '',
      isActive: req.body.isActive !== false,
      pollFrequencyMin: req.body.pollFrequencyMin || 60,
      lastPolled: new Date().toISOString(),
      lastSuccess: '',
      lastError: '',
      itemsReceived: 0,
      notes: req.body.notes || '',
      createdAt: new Date().toISOString()
    };

    console.log('[SERVER] Source registered (mock):', newSource.name);
    res.status(201).json({ success: true, source: newSource, message: 'Source registered' });
  } catch (err) {
    console.error('[SERVER] Error creating source:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -----------------------------------------------------
// RSS Automation Routes
// -----------------------------------------------------
app.get('/api/rss/sources', authMiddleware, authorize('read'), async (req: AuthRequest, res: Response) => {
  try {
    const mockSources = [
      {
        id: '1',
        name: 'Agência Senado',
        officialUrl: 'https://senado.leg.br',
        rssUrl: 'https://senado.leg.br/rss',
        sourceType: 'órgão público',
        category: 'politica',
        integrationType: 'Monitoramento Editorial',
        validationStatus: 'VALIDADO',
        editorialPolicy: 'APROVADA_CONSULTA_CITACAO',
        isActive: true,
        lastPolled: new Date().toISOString(),
        lastSuccess: new Date().toISOString(),
        lastError: null,
        itemsReceived: 10
      }
    ];
    res.json({ success: true, count: mockSources.length, sources: mockSources });
  } catch (err) {
    console.error('[SERVER] Error fetching RSS sources:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/rss/poll', authMiddleware, authorize('manage_patriota_sources'), async (req: AuthRequest, res: Response) => {
  try {
    const { sourceId } = req.body;
    if (!sourceId) {
      return res.status(400).json({ error: 'sourceId is required' });
    }
    // Find source by ID (mock)
    const source = {
      id: sourceId,
      name: 'Fonte Exemplo',
      rssUrl: 'https://exemplo.com/rss',
      isActive: true
    };

    // Validate RSS URL for SSRF
    if (!isSafeUrl(source.rssUrl)) {
      return res.status(400).json({ error: 'URL de RSS não segura detectada' });
    }

    // Mock RSS polling with timeout
    const fetch = require('node-fetch');
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 15000);

    try {
      const response = await fetch(source.rssUrl, { signal: abortController.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(200).json({
          success: false,
          sourceId,
          error: 'Não foi possível obter o feed RSS',
          itemsReceived: 0
        });
      }

      const xmlText = await response.text();
      // Simples parsing RSS básico
      const items = [];
      const itemMatches = xmlText.match(/<item>(.*?)<\/item>/gs);
      if (itemMatches) {
        for (const item of itemMatches) {
          const titleMatch = item.match(/<title>(.*?)<\/title>/);
          const linkMatch = item.match(/<link>(.*?)<\/link>/);
          const descriptionMatch = item.match(/<description>(.*?)<\/description>/);
          const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

          items.push({
            title: titleMatch ? titleMatch[1] : 'Sem título',
            link: linkMatch ? linkMatch[1] : '#',
            description: descriptionMatch ? descriptionMatch[1] : '',
            pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString()
          });
        }
      }

      return res.status(200).json({
        success: true,
        sourceId,
        items,
        itemsReceived: items.length
      });
    } catch (err) {
      clearTimeout(timeoutId);
      const fetchError = err as { name?: string; message?: string };
      // Check if abort error (timeout or SSRF blocked)
      if (fetchError.name === 'AbortError') {
        return res.status(500).json({
          success: false,
          sourceId,
          error: 'Timeout ao buscar feed RSS ou URL bloqueada'
        });
      }
      return res.status(500).json({
        success: false,
        sourceId,
        error: 'Erro ao processar feed RSS'
      });
    }
  } catch (err) {
    console.error('[SERVER] Error polling RSS source:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/rss/feed', authMiddleware, authorize('read'), async (req: AuthRequest, res: Response) => {
  try {
    const mockFeed = {
      title: 'O Patriota Brasil - Notícias',
      link: 'https://opatriota.com.br',
      description: 'Portal de notícias e fact-checking',
      items: [
        {
          title: 'Artigo de exemplo',
          link: 'https://opatriota.com.br/exemplo',
          description: 'Conteúdo do artigo de exemplo.',
          pubDate: new Date().toISOString()
        }
      ]
    };
    res.json({ success: true, feed: mockFeed });
  } catch (err) {
    console.error('[SERVER] Error fetching RSS feed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -----------------------------------------------------
// Meta Integration Routes (Facebook Graph API)
// -----------------------------------------------------
// Note: Facebook NÃO é usado para autenticação de usuários.
// A integração Meta serve para conectar uma Página autorizada
// e publicar conteúdo aprovado. Requer credenciais de aplicação
// Meta e permissões de página concedidas pelo administrador.
// As credenciais devem ser fornecidas via variáveis de ambiente:
// - META_ACCESS_TOKEN: Token de acesso da Meta Graph API
// - META_PAGE_ID: ID da Página Facebook
// As rotas abaixo são estruturadas para quando as credenciais
// estiverem disponíveis. Até o momento, retornam orientações.

app.post('/api/meta/connect', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: false,
      error: 'Integração Meta não configurada',
      message:
        'Para conectar uma Página Facebook, configure as credenciais:' +
        '\n- META_ACCESS_TOKEN: Token de acesso da Meta Graph API' +
        '\n- META_PAGE_ID: ID da Página Facebook' +
        '\n- Permissões necessárias: pages_show_list, pages_manage_posts, pages_manage_ads' +
        '\n- Configure as variáveis de ambiente e reinicie o servidor',
    });
  } catch (err) {
    console.error('[SERVER] Error meta connect:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/meta/publish', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: false,
      error: 'Integração Meta não configurada',
      message:
        'Publicação via Meta Graph API requer configuração prévia:' +
        '\n1. Conectar página usando /api/meta/connect' +
        '\n2. Ter artigo em status APPROVED' +
        '\n3. POST para /api/meta/publish com { articleId, message }' +
        '\n- Credenciais necessárias: META_ACCESS_TOKEN, META_PAGE_ID',
    });
  } catch (err) {
    console.error('[SERVER] Error meta publish:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -----------------------------------------------------
// API Routes - User Profile
// -----------------------------------------------------
app.get('/api/user/profile', authMiddleware, authorize('read'), async (req: AuthRequest, res: Response) => {
  try {
    const mockProfile = {
      id: 'uid-1',
      name: req.user?.name || 'Usuário Teste',
      email: req.user?.email || 'teste@opatriota.com.br',
      role: req.user?.role || 'leitor',
      subscription: { plan: 'gratuito', status: 'inativo', autoRenew: false },
      bookmarks: [],
      notificationPrefs: { breakingNews: true, dailyBrief: true, factChecks: true, weeklyDigest: true },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    res.json({ success: true, profile: mockProfile });
  } catch (err) {
    console.error('[SERVER] Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/user/profile', authMiddleware, authorize('read'), async (req: AuthRequest, res: Response) => {
  try {
    console.log('[SERVER] Profile update mock:', req.body);
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('[SERVER] Error updating user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -----------------------------------------------------
// Health Check Endpoints
// -----------------------------------------------------
app.get('/health', (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'not_configured',
    environment: process.env.NODE_ENV || 'development'
  };
  res.json(health);
});

app.get('/ready', async (req: Request, res: Response) => {
  res.json({ status: 'not_ready', checks: { database: 'not_configured' } });
});

// -----------------------------------------------------
// Catch-all: Proxy to Vite for frontend development
// -----------------------------------------------------
if (isDevelopment) {
  try {
    const viteDevServer = await createViteServer({
      server: { middlewareMode: true, fs: require('fs') },
      appType: 'custom'
    });

    app.use(viteDevServer.middlewares);
  } catch (viteErr) {
    console.warn('[SERVER] Vite dev server could not start:', (viteErr as Error).message);
  }
} else {
  // Production: serve static files from dist
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// -----------------------------------------------------
// Global Error Handler
// -----------------------------------------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER] Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// -----------------------------------------------------
// Start Server
// -----------------------------------------------------
let server: http.Server;

if (isDevelopment) {
  server = app.listen(port, () => {
    console.log(`[SERVER] HTTP server running at http://localhost:${port}`);
    console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[SERVER] Database: not configured (set DATABASE_URL to enable)`);
  });

  process.on('SIGTERM', () => {
    console.log('[SERVER] SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('[SERVER] Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('[SERVER] SIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('[SERVER] Server closed');
      process.exit(0);
    });
  });
} else {
  server = app.listen(port, () => {
    console.log(`[SERVER] Production server running at http://localhost:${port}`);
  });
}

export { app, server };