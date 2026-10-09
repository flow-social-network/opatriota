import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  firestoreDelete, firestoreGet, firestoreList, firestoreWrite,
  json, newId, readBody, validEmail, verifyFirebaseIdToken
} from './_lib/billing';

type Req = IncomingMessage & { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type Res = ServerResponse & { statusCode: number; setHeader(name: string, value: string): void; end(body?: string): void };

const STAFF = new Set(['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador']);
const EDITORS = new Set(['editor', 'editor_chefe', 'administrador']);
const ADMINS = new Set(['administrador']);

function routeName(url: string): string {
  const pathname = new URL(url, 'https://api.local').pathname;
  return pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
}
function cleanObject(value: unknown): Record<string, any> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};
}
async function getIdentity(req: Req): Promise<{ uid: string; email: string; role: string } | null> {
  const raw = req.headers.authorization;
  const header = Array.isArray(raw) ? raw[0] : raw || '';
  if (!header.startsWith('Bearer ')) return null;
  const user = await verifyFirebaseIdToken(header.slice(7));
  const uid = String(user.localId || user.uid || '');
  if (!uid) return null;
  const roleRecord = await firestoreGet('userRoles', uid);
  return { uid, email: String(user.email || ''), role: String(roleRecord?.role || 'leitor_gratuito') };
}
function requireRole(identity: { role: string } | null, allowed: Set<string>, res: Res): boolean {
  if (!identity) { json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta para continuar.' }); return false; }
  if (!allowed.has(identity.role)) { json(res, 403, { error: 'FORBIDDEN', message: 'Sua conta não tem permissão para esta operação.' }); return false; }
  return true;
}
function publicRecords(collection: string, records: any[]): any[] {
  if (collection === 'articles') return records.filter(item => item.editorialStatus === 'PUBLICADA' && item.status !== 'rascunho');
  if (collection === 'pages') return records.filter(item => item.status === 'publicado' || item.status === 'publicada' || item.published === true);
  if (collection === 'categories' || collection === 'authors') return records.filter(item => item.active !== false);
  return records;
}
function collectionFor(path: string): { collection: string; id?: string } | null {
  const match = path.match(/^(articles|categories|authors|pages|fact-checks|editorial\/sources|editorial\/queue)\/([^/]+)$/);
  if (match) return { collection: match[1] === 'fact-checks' ? 'factChecks' : match[1].replace('editorial/sources', 'editorialSources').replace('editorial/queue', 'editorialQueue'), id: decodeURIComponent(match[2]) };
  const root: Record<string, string> = {
    articles: 'articles', categories: 'categories', authors: 'authors', pages: 'pages',
    'fact-checks': 'factChecks', 'editorial/sources': 'editorialSources', 'editorial/queue': 'editorialQueue'
  };
  return root[path] ? { collection: root[path] } : null;
}

export default async function handler(req: Req, res: Res) {
  const method = req.method || 'GET';
  const path = routeName(req.url || '/');
  try {
    if (path === 'health' && method === 'GET') return json(res, 200, { status: 'ok', service: 'o-patriota-api', timestamp: new Date().toISOString() });
    if (path === 'plans' && method === 'GET') return json(res, 200, [
      { id: 'gratuito', name: 'Acesso Livre', description: 'Acesso às notícias abertas.', monthlyPrice: 0, annualPrice: 0, currency: 'BRL', accessLevel: 'aberto', features: [], active: true },
      { id: 'digital', name: 'Digital Mensal Completa', description: 'Acesso a conteúdos exclusivos para assinantes.', monthlyPrice: 6.5, annualPrice: 78, currency: 'BRL', accessLevel: 'assinante', features: [], active: true },
      { id: 'premium', name: 'CP Digital Anual Econômico', description: 'Acesso premium.', monthlyPrice: 5.24, annualPrice: 62.9, currency: 'BRL', accessLevel: 'premium', features: [], active: true }
    ]);

    const identity = await getIdentity(req).catch(error => {
      if (String(error?.message || '').includes('not configured')) throw error;
      throw new Error('Invalid Firebase ID token');
    });

    if (path === 'me' && method === 'GET') {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      const profile = await firestoreGet('userProfiles', identity.uid);
      return json(res, 200, { id: identity.uid, email: identity.email, role: identity.role, ...(profile || {}) });
    }
    if (path === 'me/bookmarks' && (method === 'GET' || method === 'PUT')) {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      if (method === 'GET') {
        const record = await firestoreGet('userBookmarks', identity.uid);
        return json(res, 200, record || { bookmarks: [] });
      }
      const body = cleanObject(req.body || await readBody(req));
      const bookmarks = Array.isArray(body.bookmarks) ? [...new Set(body.bookmarks.filter((id: unknown) => typeof id === 'string').slice(0, 2000))] : [];
      await firestoreWrite('userBookmarks', identity.uid, { bookmarks, updatedAt: new Date().toISOString() });
      return json(res, 200, { bookmarks });
    }
    if (path === 'me/subscription' && method === 'GET') {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      const profile = await firestoreGet('userSubscriptions', identity.uid);
      return json(res, 200, profile || { plan: 'gratuito', status: 'inativo', autoRenew: false });
    }
    if (path === 'editorial/ai-review' && method === 'POST') {
      if (!requireRole(identity, STAFF, res)) return;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return json(res, 503, { error: 'AI_NOT_CONFIGURED', message: 'O assistente editorial não está configurado no servidor.' });
      const body = cleanObject(await readBody(req));
      const title = String(body.title || '').slice(0, 500);
      const subtitle = String(body.subtitle || '').slice(0, 1000);
      const content = String(body.content || '').slice(0, 24000);
      if (!title.trim() && !content.trim()) return json(res, 400, { error: 'EDITORIAL_CONTENT_REQUIRED', message: 'Informe título ou conteúdo para análise.' });
      const prompt = [
        'Você é um assistente editorial. Analise o material sem inventar fatos, fontes ou citações.',
        'Devolva somente JSON válido com as chaves titles (3 sugestões), clarityScore (texto qualitativo, sem nota numérica inventada), clarityFeedback, missingSources (lista de lacunas a verificar), suggestedTags (lista) e summary.',
        'Se faltar evidência, diga explicitamente que precisa de confirmação. Não afirme que verificou fontes externas.',
        'Título: ' + title, 'Subtítulo: ' + subtitle, 'Conteúdo: ' + content,
        'Fontes informadas pelo jornalista: ' + JSON.stringify(Array.isArray(body.sources) ? body.sources.slice(0, 30) : [])
      ].join('\n\n');
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } })
      });
      const payload: any = await response.json();
      if (!response.ok) {
        console.error('Gemini editorial review failed:', response.status);
        return json(res, 502, { error: 'AI_PROVIDER_FAILED', message: 'O provedor de IA não conseguiu analisar o conteúdo.' });
      }
      const raw = payload.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('').trim();
      if (!raw) return json(res, 502, { error: 'AI_EMPTY_RESPONSE', message: 'O assistente não devolveu uma análise utilizável.' });
      let result: any;
      try { result = JSON.parse(raw); } catch { return json(res, 502, { error: 'AI_INVALID_RESPONSE', message: 'A resposta do assistente não passou na validação.' }); }
      return json(res, 200, {
        titles: Array.isArray(result.titles) ? result.titles.slice(0, 3).map((v: unknown) => String(v).slice(0, 300)) : [],
        clarityScore: String(result.clarityScore || 'Não avaliado'),
        clarityFeedback: String(result.clarityFeedback || ''),
        missingSources: Array.isArray(result.missingSources) ? result.missingSources.slice(0, 20).map((v: unknown) => String(v).slice(0, 500)) : [],
        suggestedTags: Array.isArray(result.suggestedTags) ? result.suggestedTags.slice(0, 15).map((v: unknown) => String(v).slice(0, 80)) : [],
        summary: String(result.summary || '').slice(0, 1500)
      });
    }
    if (path === 'newsletter/subscriptions' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const email = String(body.email || '').trim().toLowerCase();
      if (!validEmail(email) || body.consent !== true) return json(res, 400, { error: 'INVALID_NEWSLETTER_SUBSCRIPTION', message: 'Informe um e-mail válido e confirme o consentimento.' });
      const existing = (await firestoreList('newsletterSubscriptions')).find(row => String(row.email).toLowerCase() === email);
      const id = existing?.id || newId();
      await firestoreWrite('newsletterSubscriptions', id, { id, email, consent: true, status: 'active', updatedAt: new Date().toISOString(), createdAt: existing?.createdAt || new Date().toISOString() });
      return json(res, existing ? 200 : 201, { id, status: 'active' });
    }
    if (path === 'site-settings/menu' || path === 'site-settings') {
      const key = path.endsWith('/menu') ? 'menu' : 'portal';
      if (method === 'GET') {
        const record = await firestoreGet('siteSettings', key);
        return json(res, 200, record?.value || (key === 'menu' ? { mainNav: [], topBar: [], footerCol1: [], footerCol2: [], footerCol3: [] } : {}));
      }
      if (method === 'PATCH' || method === 'PUT') {
        if (!requireRole(identity, ADMINS, res)) return;
        const value = cleanObject(await readBody(req));
        await firestoreWrite('siteSettings', key, { value, updatedAt: new Date().toISOString(), updatedBy: identity!.uid });
        return json(res, 200, value);
      }
      res.setHeader('Allow', 'GET, PATCH, PUT');
      return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    }

    const resource = collectionFor(path);
    if (!resource) return json(res, 404, { error: 'NOT_FOUND', message: 'Rota da API não encontrada.' });
    const isEditorial = resource.collection.startsWith('editorial');
    const required = isEditorial ? STAFF : resource.collection === 'articles' ? STAFF : resource.collection === 'pages' || resource.collection === 'categories' ? EDITORS : ADMINS;

    if (method === 'GET' && !resource.id) {
      if (isEditorial && !requireRole(identity, STAFF, res)) return;
      let records = await firestoreList(resource.collection);
      if (!isEditorial) records = publicRecords(resource.collection, records);
      return json(res, 200, records);
    }
    if (method === 'GET' && resource.id) {
      const record = await firestoreGet(resource.collection, resource.id);
      if (!record) return json(res, 404, { error: 'NOT_FOUND', message: 'Registro não encontrado.' });
      if (resource.collection === 'articles' && record.editorialStatus !== 'PUBLICADA' && !requireRole(identity, STAFF, res)) return;
      return json(res, 200, record);
    }
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      if (!requireRole(identity, required, res)) return;
      if (method === 'DELETE') {
        if (!resource.id) return json(res, 400, { error: 'RESOURCE_ID_REQUIRED', message: 'Informe o identificador do registro.' });
        await firestoreDelete(resource.collection, resource.id);
        return json(res, 204, null);
      }
      const body = cleanObject(await readBody(req));
      if (resource.collection === 'articles' && method === 'POST' && (!String(body.title || '').trim() || !String(body.content || '').trim())) return json(res, 400, { error: 'INVALID_ARTICLE', message: 'Título e conteúdo são obrigatórios.' });
      const id = resource.id || String(body.id || newId());
      const record = { ...body, id, updatedAt: new Date().toISOString(), ...(method === 'POST' ? { createdAt: new Date().toISOString() } : {}) };
      if (method === 'POST' && await firestoreGet(resource.collection, id)) return json(res, 409, { error: 'RESOURCE_CONFLICT', message: 'Já existe um registro com este identificador.' });
      await firestoreWrite(resource.collection, id, record, method !== 'POST');
      return json(res, method === 'POST' ? 201 : 200, record);
    }
    res.setHeader('Allow', 'GET, POST, PATCH, PUT, DELETE');
    return json(res, 405, { error: 'METHOD_NOT_ALLOWED', message: 'Método não permitido.' });
  } catch (error) {
    const message = String((error as Error)?.message || '');
    if (message.includes('Invalid Firebase ID token')) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Sua sessão expirou. Entre novamente.' });
    if (message.includes('not configured')) return json(res, 503, { error: 'BACKEND_NOT_CONFIGURED', message: 'A API precisa de configuração no ambiente.' });
    console.error('api request failed:', path, message);
    return json(res, 500, { error: 'INTERNAL_ERROR', message: 'Não foi possível concluir a operação.' });
  }
}
