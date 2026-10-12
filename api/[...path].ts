import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHash } from 'node:crypto';
import {
  json, newId, readBody, validEmail, verifyFirebaseIdToken
} from './_lib/billing';
import { documentDelete, documentGet, documentList, documentWrite } from './_lib/storage';
import { handleCors } from './_lib/cors';
import { authenticateEditorialUser, editorialUserToSession, getEditorialIdentity, readSessionCookie, revokeEditorialSession, sessionCookie } from './_lib/neonAuth';

type Req = IncomingMessage & { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type Res = ServerResponse & { statusCode: number; setHeader(name: string, value: string): void; end(body?: string): void };

const STAFF = new Set(['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador']);
const EDITORS = new Set(['editor', 'editor_chefe', 'administrador']);
const ADMINS = new Set(['administrador']);

export type PaidAccessLevel = 'none' | 'assinante' | 'premium';

export function isPublicArticle(article: Record<string, any>): boolean {
  const status = String(article.status || '').trim().toLowerCase();
  return String(article.editorialStatus || '').trim().toUpperCase() === 'PUBLICADA' &&
    !['rascunho', 'draft', 'despublicada', 'unpublished', 'rejeitada', 'arquivada'].includes(status);
}

export function isPublicPage(page: Record<string, any>): boolean {
  const status = String(page.status || '').trim().toLowerCase();
  if (['rascunho', 'draft', 'revisao', 'review', 'despublicada', 'unpublished'].includes(status)) return false;
  return ['publicado', 'publicada', 'published'].includes(status) || page.published === true;
}

export function subscriptionExpiry(startValue: unknown, cycle: unknown): number | null {
  const date = new Date(String(startValue || ''));
  if (!Number.isFinite(date.getTime())) return null;
  if (cycle === 'annual') {
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCFullYear(date.getUTCFullYear() + 1);
    date.setUTCMonth(month);
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), month + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
  } else {
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + 1);
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
  }
  return date.getTime();
}

export async function paidAccessLevel(
  identity: { uid: string; role: string } | null,
): Promise<PaidAccessLevel> {
  if (!identity) return 'none';
  if (STAFF.has(identity.role)) return 'premium';

  const subscription = await documentGet('subscriptions', identity.uid);
  if (!subscription || subscription.status !== 'active') return 'none';
  const expiry = subscription.validUntil
    ? Date.parse(String(subscription.validUntil))
    : subscriptionExpiry(subscription.activatedAt, subscription.billingCycle);
  if (expiry === null || !Number.isFinite(expiry) || expiry <= Date.now()) return 'none';

  return String(subscription.planId || '').toLowerCase().includes('premium')
    ? 'premium'
    : 'assinante';
}

export function hasArticleAccess(article: Record<string, any>, paidLevel: PaidAccessLevel): boolean {
  const required = String(article.accessLevel || 'aberto').trim().toLowerCase();
  if (['aberto', 'open', 'free'].includes(required)) return true;
  if (required === 'premium') return paidLevel === 'premium';
  if (required === 'assinante' || required === 'subscriber') return paidLevel === 'assinante' || paidLevel === 'premium';
  return false;
}

export function lockedArticle(article: Record<string, any>): Record<string, any> {
  const {
    content: _content,
    body: _body,
    htmlContent: _htmlContent,
    fullText: _fullText,
    videoIframeHtml: _videoIframeHtml,
    ...teaser
  } = article;
  return { ...teaser, premiumLocked: true };
}

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
  const cookie = Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie;
  const sessionToken = header.startsWith('Bearer ') ? header.slice(7).trim() : readSessionCookie(cookie);
  if (!header.startsWith('Bearer ') && sessionToken) {
    const user = await getEditorialIdentity(sessionToken);
    return user ? { uid: user.id, email: user.email, role: user.role } : null;
  }
  if (!header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  try {
    const user = await verifyFirebaseIdToken(token);
    const uid = String(user.localId || user.uid || '');
    if (!uid) return null;
    const roleRecord = await documentGet('userRoles', uid);
    return { uid, email: String(user.email || ''), role: String(roleRecord?.role || 'leitor_gratuito') };
  } catch {
    return null;
  }
}
function requireRole(identity: { role: string } | null, allowed: Set<string>, res: Res): boolean {
  if (!identity) { json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta para continuar.' }); return false; }
  if (!allowed.has(identity.role)) { json(res, 403, { error: 'FORBIDDEN', message: 'Sua conta não tem permissão para esta operação.' }); return false; }
  return true;
}
function canonicalizeUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|mc_|ref$|source$)/i.test(key)) url.searchParams.delete(key);
    }
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.toString();
  } catch {
    return value.trim();
  }
}

function publicRecords(collection: string, records: any[]): any[] {
  if (collection === 'articles') return records.filter(isPublicArticle);
  if (collection === 'pages') return records.filter(isPublicPage);
  if (collection === 'categories' || collection === 'authors' || collection === 'columnists') return records.filter(item => item.active !== false);
  return records;
}
function collectionFor(path: string): { collection: string; id?: string } | null {
  const match = path.match(/^(articles|categories|authors|pages|fact-checks|columnists|media|comments|activities|notifications|editorial\/sources|editorial\/queue|editorial\/agenda|editorial\/pautas|editorial\/ideias|editorial\/contatos)\/([^/]+)$/);
  if (match) {
    const collName = match[1]
      .replace('fact-checks', 'factChecks')
      .replace('editorial/sources', 'editorialSources')
      .replace('editorial/queue', 'editorialQueue')
      .replace('editorial/agenda', 'editorialAgenda')
      .replace('editorial/pautas', 'editorialPautas')
      .replace('editorial/ideias', 'editorialIdeas')
      .replace('editorial/contatos', 'editorialContacts');
    return { collection: collName, id: decodeURIComponent(match[2]) };
  }
  const root: Record<string, string> = {
    articles: 'articles', categories: 'categories', authors: 'authors', pages: 'pages',
    'fact-checks': 'factChecks', columnists: 'columnists', media: 'media', comments: 'editorialComments',
    activities: 'activities', notifications: 'notifications',
    'editorial/sources': 'editorialSources', 'editorial/queue': 'editorialQueue',
    'editorial/agenda': 'editorialAgenda', 'editorial/pautas': 'editorialPautas',
    'editorial/ideias': 'editorialIdeas', 'editorial/contatos': 'editorialContacts'
  };
  return root[path] ? { collection: root[path] } : null;
}

export default async function handler(req: Req, res: Res) {
  if (handleCors(req, res)) return;
  const method = req.method || 'GET';
  const path = routeName(req.url || '/');
  try {
    if (path === 'health' && method === 'GET') return json(res, 200, { status: 'ok', service: 'o-patriota-api', timestamp: new Date().toISOString() });
    if (path === 'editorial/auth/login' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const email = String(body.email || '').trim();
      const password = String(body.password || '');
      if (!validEmail(email) || password.length < 8) return json(res, 400, { error: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas.' });
      const result = await authenticateEditorialUser(email, password);
      if (!result) return json(res, 401, { error: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas.' });
      res.setHeader('Set-Cookie', sessionCookie(result.token));
      return json(res, 200, { user: editorialUserToSession(result.user) });
    }
    if (path === 'editorial/auth/logout' && method === 'POST') {
      const raw = req.headers.authorization;
      const header = Array.isArray(raw) ? raw[0] : raw || '';
      const cookie = Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie;
      const token = header.startsWith('Bearer ') ? header.slice(7).trim() : readSessionCookie(cookie);
      if (token) await revokeEditorialSession(token);
      res.setHeader('Set-Cookie', 'opatriota_editorial_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0');
      return json(res, 200, { success: true });
    }
    if (path === 'plans' && method === 'GET') return json(res, 200, [
      { id: 'gratuito', name: 'Acesso Livre', description: 'Acesso às notícias abertas.', monthlyPrice: 0, annualPrice: 0, currency: 'BRL', accessLevel: 'aberto', features: [], active: true },
      { id: 'digital', name: 'Digital Mensal Completa', description: 'Acesso a conteúdos exclusivos para assinantes.', monthlyPrice: 6.5, annualPrice: 78, currency: 'BRL', accessLevel: 'assinante', features: [], active: true },
      { id: 'premium', name: 'CP Digital Anual Econômico', description: 'Acesso premium.', monthlyPrice: 5.24, annualPrice: 62.9, currency: 'BRL', accessLevel: 'premium', features: [], active: true }
    ]);

    const identity = await getIdentity(req).catch(error => {
      if (String(error?.message || '').includes('not configured')) throw error;
      throw new Error('Invalid Firebase ID token');
    });

    if (path === 'admin/users' && method === 'GET') {
      if (!requireRole(identity, ADMINS, res)) return;
      const [profiles, roleRecords] = await Promise.all([
        documentList('userProfiles'),
        documentList('userRoles'),
      ]);
      const profileById = new Map(profiles.map((profile) => [String(profile.id || ''), profile]));
      const roleById = new Map(roleRecords.map((record) => [String(record.id || ''), record]));
      const ids = new Set([...profileById.keys(), ...roleById.keys()].filter(Boolean));
      const users = [...ids].map((uid) => {
        const profile = profileById.get(uid) || {};
        const roleRecord = roleById.get(uid) || {};
        return {
          id: uid,
          name: String(profile.name || ''),
          email: String(profile.email || ''),
          role: String(roleRecord.role || 'leitor_gratuito'),
          createdAt: profile.createdAt || roleRecord.createdAt || null,
          updatedAt: profile.updatedAt || roleRecord.updatedAt || null,
        };
      }).sort((a, b) => a.email.localeCompare(b.email));
      return json(res, 200, users);
    }

    const adminUserMatch = path.match(/^admin\/users\/([^/]+)$/);
    if (adminUserMatch && method === 'PATCH') {
      if (!requireRole(identity, ADMINS, res)) return;
      const uid = decodeURIComponent(adminUserMatch[1]);
      const body = cleanObject(await readBody(req));
      const allowedRoles = new Set([
        'leitor_gratuito', 'assinante_digital', 'assinante_premium',
        'jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador',
      ]);
      const nextRole = String(body.role || '');
      if (!allowedRoles.has(nextRole)) return json(res, 400, { error: 'INVALID_ROLE' });
      if (uid === identity!.uid && nextRole !== 'administrador') {
        return json(res, 409, { error: 'SELF_DEMOTION_BLOCKED', message: 'Não é permitido remover a própria função administrativa.' });
      }
      const [profile, currentRole] = await Promise.all([
        documentGet('userProfiles', uid),
        documentGet('userRoles', uid),
      ]);
      if (!profile && !currentRole) return json(res, 404, { error: 'USER_NOT_FOUND', message: 'Usuário não encontrado no cadastro do portal.' });
      const updatedAt = new Date().toISOString();
      const auditId = newId();
      await documentWrite('auditLogs', auditId, {
        id: auditId,
        action: 'USER_ROLE_CHANGE_REQUESTED',
        actorUid: identity!.uid,
        targetUid: uid,
        previousRole: String(currentRole?.role || 'leitor_gratuito'),
        nextRole,
        status: 'requested',
        createdAt: updatedAt,
      }, false);
      await documentWrite('userRoles', uid, {
        role: nextRole,
        updatedAt,
        updatedBy: identity!.uid,
      });
      await documentWrite('auditLogs', auditId, {
        status: 'applied',
        completedAt: new Date().toISOString(),
      });
      return json(res, 200, {
        id: uid,
        name: String(profile?.name || ''),
        email: String(profile?.email || ''),
        role: nextRole,
        updatedAt,
      });
    }
    if (adminUserMatch && method !== 'PATCH') {
      res.setHeader('Allow', 'PATCH');
      return json(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    }

    if (path === 'me' && method === 'PATCH') {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      const body = cleanObject(await readBody(req));
      const current = await documentGet('userProfiles', identity.uid) || {};
      const next: Record<string, unknown> = { ...current, id: identity.uid, email: identity.email, updatedAt: new Date().toISOString() };
      if (body.name !== undefined) {
        const name = String(body.name).trim().slice(0, 120);
        if (name.length < 2) return json(res, 400, { error: 'INVALID_PROFILE_NAME', message: 'Informe um nome válido.' });
        next.name = name;
      }
      if (body.phone !== undefined) next.phone = String(body.phone).trim().slice(0, 40);
      if (body.bio !== undefined) next.bio = String(body.bio).trim().slice(0, 1000);
      if (body.notificationPrefs && typeof body.notificationPrefs === 'object') {
        const prefs = cleanObject(body.notificationPrefs);
        next.notificationPrefs = {
          breakingNews: Boolean(prefs.breakingNews), dailyBrief: Boolean(prefs.dailyBrief),
          factChecks: Boolean(prefs.factChecks), weeklyDigest: Boolean(prefs.weeklyDigest)
        };
      }
      await documentWrite('userProfiles', identity.uid, next);
      return json(res, 200, { ...next, role: identity.role });
    }
    if (path === 'me' && method === 'GET') {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      const profile = await documentGet('userProfiles', identity.uid);
      return json(res, 200, { id: identity.uid, email: identity.email, role: identity.role, ...(profile || {}) });
    }
    if (path === 'me/bookmarks' && (method === 'GET' || method === 'PUT')) {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      if (method === 'GET') {
        const record = await documentGet('userBookmarks', identity.uid);
        return json(res, 200, record || { bookmarks: [] });
      }
      const body = cleanObject(req.body || await readBody(req));
      const bookmarks = Array.isArray(body.bookmarks) ? [...new Set(body.bookmarks.filter((id: unknown) => typeof id === 'string').slice(0, 2000))] : [];
      await documentWrite('userBookmarks', identity.uid, { bookmarks, updatedAt: new Date().toISOString() });
      return json(res, 200, { bookmarks });
    }
    if (path === 'me/payments' && method === 'GET') {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      const orders = await documentList('checkoutOrders');
      const payments = orders.filter(order => order.uid === identity!.uid).map(order => ({
        id: String(order.orderId || order.id),
        date: String(order.createdAt || ''),
        amount: Number(order.amount || 0),
        planName: String(order.planName || order.planId || 'Assinatura'),
        status: ['approved', 'paid'].includes(String(order.status)) ? 'concluido' : ['refunded', 'cancelled'].includes(String(order.status)) ? 'reembolsado' : 'processando',
        invoiceNumber: String(order.orderId || order.id)
      }));
      return json(res, 200, payments);
    }
    if (path === 'me/subscription' && method === 'GET') {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      const sub = await documentGet('subscriptions', identity.uid);
      if (sub && sub.status === 'active') {
        const expiry = sub.validUntil
          ? Date.parse(String(sub.validUntil))
          : subscriptionExpiry(sub.activatedAt, sub.billingCycle);
        if (expiry !== null && Number.isFinite(expiry) && expiry > Date.now()) {
          return json(res, 200, {
            plan: sub.planId || 'gratuito',
            status: 'ativo',
            validUntil: new Date(expiry).toISOString(),
            autoRenew: sub.autoRenew !== false,
            provider: sub.provider,
            amount: sub.amount,
            billingCycle: sub.billingCycle,
          });
        }
      }
      return json(res, 200, { plan: 'gratuito', status: 'inativo', autoRenew: false });
    }
    if (path === 'push-subscriptions' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const token = String(body.token || '');
      if (token.length < 20 || token.length > 4096) {
        return json(res, 400, { error: 'INVALID_PUSH_TOKEN', message: 'A inscrição de notificações é inválida.' });
      }
      const id = createHash('sha256').update(token).digest('hex');
      const existing = await documentGet('pushSubscriptions', id);
      const now = new Date().toISOString();
      await documentWrite('pushSubscriptions', id, {
        id,
        token,
        subscribedAt: String(body.subscribedAt || now).slice(0, 40),
        userAgent: String(body.userAgent || '').slice(0, 150),
        deviceType: ['desktop', 'mobile', 'tablet'].includes(body.deviceType) ? body.deviceType : 'desktop',
        vapidPublicKey: String(body.vapidPublicKey || '').slice(0, 300),
        active: true,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      }, false);
      return json(res, existing ? 200 : 201, { success: true });
    }
    if (path === 'admin/push-campaigns' && method === 'GET') {
      if (!requireRole(identity, ADMINS, res)) return;
      const campaigns = await documentList('pushCampaigns');
      campaigns.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
      return json(res, 200, campaigns.slice(0, 100));
    }
    if (path === 'admin/push-campaigns' && method === 'POST') {
      if (!requireRole(identity, ADMINS, res)) return;
      const body = cleanObject(await readBody(req));
      const title = String(body.title || '').trim().slice(0, 120);
      const message = String(body.body || '').trim().slice(0, 1000);
      let targetUrl = String(body.url || '/').trim();
      if (!title || !message) return json(res, 400, { error: 'INVALID_PUSH_CAMPAIGN', message: 'Título e mensagem são obrigatórios.' });
      if (!targetUrl.startsWith('/') && !/^https:\/\//i.test(targetUrl)) return json(res, 400, { error: 'INVALID_PUSH_URL', message: 'O destino deve ser uma rota local ou URL HTTPS.' });
      const account = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
      if (!account.project_id) return json(res, 503, { error: 'PUSH_NOT_CONFIGURED', message: 'O Firebase Admin precisa ser configurado no servidor.' });
      const subscriptions = await documentList('pushSubscriptions');
      const tokens = [...new Set(subscriptions.filter(item => item.active !== false && typeof item.token === 'string' && item.token.length > 20).map(item => item.token))];
      if (!tokens.length) return json(res, 409, { error: 'NO_PUSH_SUBSCRIBERS', message: 'Não existem dispositivos inscritos e persistidos para receber notificações.' });
      const accessToken = await (async () => {
        const now = Math.floor(Date.now() / 1000);
        const enc = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url');
        const unsigned = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
        const { createSign } = await import('node:crypto');
        const signer = createSign('RSA-SHA256'); signer.update(unsigned); signer.end();
        const assertion = unsigned + '.' + signer.sign(account.private_key).toString('base64url');
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
        const tokenData: any = await tokenResponse.json();
        if (!tokenResponse.ok || !tokenData.access_token) throw new Error('FCM access token unavailable');
        return String(tokenData.access_token);
      })();
      const results = await Promise.all(tokens.map(async token => {
        const response = await fetch('https://fcm.googleapis.com/v1/projects/' + encodeURIComponent(account.project_id) + '/messages:send', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: { token, notification: { title, body: message }, data: { url: targetUrl } } })
        });
        return { ok: response.ok, status: response.status };
      }));
      const sentCount = results.filter(item => item.ok).length;
      const failedCount = results.length - sentCount;
      const id = newId();
      const campaign = { id, title, body: message, url: targetUrl, recipientCount: tokens.length, sentCount, failedCount, status: failedCount ? 'partial' : 'sent', createdAt: new Date().toISOString(), createdBy: identity!.uid };
      await documentWrite('pushCampaigns', id, campaign, false);
      return json(res, failedCount ? 207 : 201, campaign);
    }
    if (path === 'editorial/sources/sync' && method === 'POST') {
      if (!requireRole(identity, STAFF, res)) return;
      const sources = await documentList('editorialSources');
      const existingQueue = await documentList('editorialQueue');
      const seen = new Set(existingQueue
        .map(item => canonicalizeUrl(String(item.canonicalUrl || item.originalUrl || '')))
        .filter(Boolean));
      const updatedSources: any[] = [];
      const newItems: any[] = [];
      for (const source of sources.filter(item => item.isActive !== false && item.rssUrl)) {
        const rssUrl = String(source.rssUrl);
        let parsedUrl: URL;
        try { parsedUrl = new URL(rssUrl); } catch {
          updatedSources.push({ ...source, lastError: 'URL de feed inválida', lastPolled: new Date().toISOString() });
          continue;
        }
        const host = parsedUrl.hostname.toLowerCase();
        if (parsedUrl.protocol !== 'https:' || host === 'localhost' || host.endsWith('.local') ||
            /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) ||
            host === '::1' || host.startsWith('fc') || host.startsWith('fe80:')) {
          updatedSources.push({ ...source, lastError: 'Feed bloqueado por política de segurança; use uma URL HTTPS pública.', lastPolled: new Date().toISOString() });
          continue;
        }
        try {
          const response = await fetch(parsedUrl, { headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' }, signal: AbortSignal.timeout(10000) });
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const xml = (await response.text()).slice(0, 2_000_000);
          const entries = [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)].slice(0, 50);
          let imported = 0;
          const decodeXml = (value: string) => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, ' ').trim();
          for (const entry of entries) {
            const block = entry[2];
            const titleMatch = block.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);
            const linkMatch = block.match(/<link(?:\s[^>]*href=["']([^"']+)["'][^>]*)?\s*\/?>/i) || block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i) || block.match(/<guid(?:\s[^>]*)?>([\s\S]*?)<\/guid>/i);
            const descMatch = block.match(/<(description|summary|content:encoded)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/i);
            const dateMatch = block.match(/<(pubDate|published|updated|dc:date)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/i);
            const title = decodeXml(titleMatch?.[1] || '');
            let link = decodeXml(linkMatch?.[1] || linkMatch?.[2] || '');
            if (!title || !link) continue;
            try { const normalized = new URL(link, parsedUrl); if (normalized.protocol !== 'https:') continue; link = canonicalizeUrl(normalized.toString()); } catch { continue; }
            if (seen.has(link)) continue;
            seen.add(link);
            const id = Date.now() + newItems.length;
            const record = {
              id, title: title.slice(0, 500),
              summary: decodeXml(descMatch?.[2] || '').slice(0, 2000),
              originalUrl: link, canonicalUrl: link,
              originalPublishedAt: (() => {
                const raw = decodeXml(dateMatch?.[2] || '');
                const parsed = raw ? Date.parse(raw) : Number.NaN;
                return Number.isNaN(parsed) ? undefined : new Date(parsed).toISOString();
              })(),
              sourceName: String(source.name || parsedUrl.hostname).slice(0, 200),
              category: String(source.category || 'brasil'),
              capturedAt: new Date().toISOString(),
              dedupStatus: 'NOVO', dedupReason: 'Importado de feed RSS/Atom; revisão editorial pendente.',
              editorialStatus: 'RECEBIDA'
            };
            await documentWrite('editorialQueue', String(id), record, false);
            newItems.push(record);
            imported++;
          }
          const updated = { ...source, lastPolled: new Date().toISOString(), lastSuccess: new Date().toISOString(), lastError: null, itemsReceived: Number(source.itemsReceived || 0) + imported };
          await documentWrite('editorialSources', String(source.id), updated);
          updatedSources.push(updated);
        } catch (error) {
          const updated = { ...source, lastPolled: new Date().toISOString(), lastError: String((error as Error)?.message || 'Falha ao consultar feed').slice(0, 300) };
          await documentWrite('editorialSources', String(source.id), updated);
          updatedSources.push(updated);
        }
      }
      return json(res, 200, { sources: updatedSources, queueItems: newItems, importedCount: newItems.length, checkedSources: updatedSources.length });
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

    if (path === 'editorial/stats' && method === 'GET') {
      if (!requireRole(identity, STAFF, res)) return;
      const allArticles = await documentList('articles');
      const monthStart = new Date();
      monthStart.setUTCDate(1);
      monthStart.setUTCHours(0, 0, 0, 0);
      const inProduction = allArticles.filter(a => a.editorialStatus === 'EM REDAÇÃO' || a.editorialStatus === 'EM APURAÇÃO' || a.status === 'em_producao').length;
      const inReview = allArticles.filter(a => a.editorialStatus === 'EM REVISÃO' || a.status === 'em_revisao').length;
      const awaitingApproval = allArticles.filter(a => a.editorialStatus === 'RECEBIDA' || a.editorialStatus === 'EM TRIAGEM' || a.status === 'aguardando_aprovacao').length;
      const scheduled = allArticles.filter(a => a.editorialStatus === 'AGENDADA' || a.status === 'agendada').length;
      const publishedMonth = allArticles.filter(a => {
        const publishedAt = Date.parse(String(a.publishedAt || ''));
        return (a.editorialStatus === 'PUBLICADA' || a.status === 'publicada') &&
          Number.isFinite(publishedAt) && publishedAt >= monthStart.getTime();
      }).length;
      const drafts = allArticles.filter(a => a.status === 'rascunho' || a.editorialStatus === 'RASCUNHO').length;
      return json(res, 200, {
        inProduction, inReview, awaitingApproval, scheduled, publishedMonth, drafts,
        totalArticles: allArticles.length,
      });
    }

    if (path === 'system/status' && method === 'GET') {
      if (!requireRole(identity, ADMINS, res)) return;
      const rawStatus = await documentGet('systemStatus', 'current');
      if (rawStatus && rawStatus.verification === 'live-probe' && rawStatus.lastCheck &&
          Number.isFinite(Date.parse(String(rawStatus.lastCheck))) &&
          Date.now() - Date.parse(String(rawStatus.lastCheck)) < 5 * 60 * 1000) {
        return json(res, 200, rawStatus);
      }
      const services = [
        {
          name: 'Banco de dados',
          configured: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.DATABASE_URL),
          status: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.DATABASE_URL
            ? 'Configurado; conexão não verificada'
            : 'Não configurado',
          healthy: null,
        },
        {
          name: 'Autenticação Firebase',
          configured: Boolean(process.env.FIREBASE_WEB_API_KEY),
          status: process.env.FIREBASE_WEB_API_KEY ? 'Chave configurada; login não verificado' : 'Não configurado',
          healthy: null,
        },
        {
          name: 'Mercado Pago',
          configured: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_WEBHOOK_SECRET),
          status: process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_WEBHOOK_SECRET
            ? 'Credenciais configuradas; transação não verificada'
            : 'Não configurado',
          healthy: null,
        },
        {
          name: 'IA editorial',
          configured: Boolean(process.env.GEMINI_API_KEY),
          status: process.env.GEMINI_API_KEY ? 'Chave configurada; chamada não verificada' : 'Não configurado',
          healthy: null,
        },
      ];
      return json(res, 200, {
        allOperational: false,
        verification: 'configuration-only',
        lastCheck: new Date().toISOString(),
        services,
      });
    }

    if (path === 'editorial/ai-text' && method === 'POST') {
      if (!requireRole(identity, STAFF, res)) return;
      const body = cleanObject(await readBody(req));
      const type = String(body.type || 'texto');
      const prompt = String(body.prompt || '').trim();
      const tone = String(body.tone || 'Jornalístico');
      const length = String(body.length || 'Médio');
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && prompt) {
        try {
          const sysPrompt = `Você é um jornalista sênior de O Patriota Brasil. Tom: ${tone}. Tamanho: ${length}. Tipo solicitado: ${type}. Prompt do usuário: "${prompt}". Escreva um conteúdo com precisão factual, clareza, sem sensacionalismo.`;
          const aiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: sysPrompt }] }] })
          });
          if (aiRes.ok) {
            const aiData: any = await aiRes.json();
            const textResult = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (textResult) {
              const generatedAt = new Date().toISOString();
              return json(res, 200, {
                generatedText: textResult,
                results: [{
                  id: newId(),
                  title: `Texto gerado — ${prompt.slice(0, 60)}`,
                  generatedAt,
                  content: textResult,
                }],
              });
            }
          }
        } catch { /* fallback */ }
      }

      return json(res, 503, {
        error: apiKey ? 'AI_GENERATION_FAILED' : 'AI_NOT_CONFIGURED',
        message: apiKey
          ? 'O serviço de IA não devolveu um resultado válido. Tente novamente.'
          : 'A geração de conteúdo depende da configuração do serviço de IA no servidor.'
      });
    }

    if (path === 'editorial/ai-image' && method === 'POST') {
      if (!requireRole(identity, STAFF, res)) return;
      const body = cleanObject(await readBody(req));
      const prompt = String(body.prompt || '').trim().slice(0, 2000);
      const style = String(body.style || 'Realista').trim().slice(0, 120);
      if (!prompt) return json(res, 400, { error: 'INVALID_IMAGE_PROMPT', message: 'Informe uma descrição para gerar a imagem.' });
      return json(res, 503, {
        error: 'AI_IMAGE_NOT_CONFIGURED',
        message: 'A geração de imagens depende de uma integração de imagens configurada no servidor.',
        prompt,
        style
      });
    }

    if (path === 'editorial/ai-risk' && method === 'POST') {
      if (!requireRole(identity, STAFF, res)) return;
      return json(res, 503, {
        error: process.env.GEMINI_API_KEY ? 'AI_RISK_NOT_IMPLEMENTED' : 'AI_NOT_CONFIGURED',
        message: process.env.GEMINI_API_KEY
          ? 'A análise de risco ainda não possui um avaliador validado conectado. Nenhuma pontuação fictícia foi gerada.'
          : 'A análise de risco depende de um serviço de IA configurado no servidor.',
      });
    }

    if (path === 'editorial/chat' && method === 'POST') {
      if (!requireRole(identity, STAFF, res)) return;
      const body = cleanObject(await readBody(req));
      const message = String(body.message || '').trim();
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && message) {
        try {
          const aiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(apiKey), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `Você é o assistente de IA da Redação de O Patriota Brasil. Ajude o jornalista com apuração, checagem, estilo ou sugestões editoriais. Mensagem do jornalista: ${message}` }] }]
            })
          });
          if (aiRes.ok) {
            const data: any = await aiRes.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) return json(res, 200, { reply });
          }
        } catch { /* fallback */ }
      }
      return json(res, 503, {
        error: 'AI_NOT_CONFIGURED',
        message: 'O serviço de IA não está disponível ou configurado neste ambiente.'
      });
    }
    if (path === 'newsletter/subscriptions' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const email = String(body.email || '').trim().toLowerCase();
      if (!validEmail(email) || body.consent !== true) return json(res, 400, { error: 'INVALID_NEWSLETTER_SUBSCRIPTION', message: 'Informe um e-mail válido e confirme o consentimento.' });
      const existing = (await documentList('newsletterSubscriptions')).find(row => String(row.email).toLowerCase() === email);
      const id = existing?.id || newId();
      await documentWrite('newsletterSubscriptions', id, { id, email, consent: true, status: 'active', updatedAt: new Date().toISOString(), createdAt: existing?.createdAt || new Date().toISOString() });
      return json(res, existing ? 200 : 201, { id, status: 'active' });
    }
    if (path === 'site-settings/menu' || path === 'site-settings') {
      const key = path.endsWith('/menu') ? 'menu' : 'portal';
      if (method === 'GET') {
        const record = await documentGet('siteSettings', key);
        return json(res, 200, record?.value || (key === 'menu' ? { mainNav: [], topBar: [], footerCol1: [], footerCol2: [], footerCol3: [] } : {}));
      }
      if (method === 'PATCH' || method === 'PUT') {
        if (!requireRole(identity, ADMINS, res)) return;
        const value = cleanObject(await readBody(req));
        await documentWrite('siteSettings', key, { value, updatedAt: new Date().toISOString(), updatedBy: identity!.uid });
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
      let records = await documentList(resource.collection);
      const staff = Boolean(identity && STAFF.has(identity.role));
      const editor = Boolean(identity && EDITORS.has(identity.role));

      if (!isEditorial) {
        const canSeeEditorialRecords =
          (resource.collection === 'articles' && staff) ||
          (resource.collection === 'pages' && editor);
        if (!canSeeEditorialRecords) records = publicRecords(resource.collection, records);
      }

      if (resource.collection === 'articles' && !staff) {
        const access = await paidAccessLevel(identity);
        records = records.map((article) =>
          hasArticleAccess(article, access) ? article : lockedArticle(article)
        );
      }
      return json(res, 200, records);
    }
    if (method === 'GET' && resource.id) {
      const record = await documentGet(resource.collection, resource.id);
      if (!record) return json(res, 404, { error: 'NOT_FOUND', message: 'Registro não encontrado.' });

      if (resource.collection === 'articles') {
        const staff = Boolean(identity && STAFF.has(identity.role));
        if (!staff && !isPublicArticle(record)) {
          return json(res, 404, { error: 'NOT_FOUND', message: 'Matéria não encontrada.' });
        }
        if (!staff && !hasArticleAccess(record, await paidAccessLevel(identity))) {
          return json(res, 403, {
            error: 'SUBSCRIPTION_REQUIRED',
            message: 'Esta matéria exige uma assinatura ativa.',
            article: lockedArticle(record),
          });
        }
      }

      if (resource.collection === 'pages' && !isPublicPage(record) &&
          !Boolean(identity && EDITORS.has(identity.role))) {
        return json(res, 404, { error: 'NOT_FOUND', message: 'Página não encontrada.' });
      }
      if (['categories', 'authors', 'columnists'].includes(resource.collection) &&
          record.active === false && !Boolean(identity && STAFF.has(identity.role))) {
        return json(res, 404, { error: 'NOT_FOUND', message: 'Registro não encontrado.' });
      }
      return json(res, 200, record);
    }
    if (resource.collection === 'articles' && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      if (!requireRole(identity, STAFF, res)) return;
      const user = identity!;
      const isEditor = EDITORS.has(user.role);
      const isReviewer = user.role === 'revisor';

      if (method === 'DELETE') {
        if (!isEditor) return json(res, 403, { error: 'EDITOR_REQUIRED', message: 'Somente editores podem excluir matérias.' });
        if (!resource.id) return json(res, 400, { error: 'RESOURCE_ID_REQUIRED', message: 'Informe o identificador da matéria.' });
        const existing = await documentGet('articles', resource.id);
        if (!existing) return json(res, 404, { error: 'NOT_FOUND', message: 'Matéria não encontrada.' });
        await documentDelete('articles', resource.id);
        return json(res, 204, null);
      }

      const body = cleanObject(req.body || await readBody(req));
      const authorFields = new Set([
        'title', 'subtitle', 'kicker', 'category', 'subcategory', 'tags', 'content',
        'imageUrl', 'imageCaption', 'imageCredits', 'sourceName', 'sourceUrl',
        'sourcesConsulted', 'seo', 'videoEmbedUrl', 'isFactCheck', 'factVerdict',
        'factClaim', 'factDocuments', 'originalUrl', 'originalPublishedAt',
        'sourceUpdatedAt', 'imageLicense', 'imageSourceUrl', 'readTimeMinutes',
      ]);
      const editorFields = new Set([
        ...authorFields, 'author', 'authorId', 'authorRole', 'accessLevel',
        'priority', 'publishedAt', 'scheduledFor', 'editorialStatus', 'status',
      ]);
      const allowedFields = isEditor ? editorFields : authorFields;
      const editable = Object.fromEntries(Object.entries(body).filter(([key]) => allowedFields.has(key)));

      if (method === 'POST') {
        const title = String(editable.title || '').trim().slice(0, 300);
        const articleContent = String(editable.content || '').trim();
        if (!title || !articleContent) return json(res, 400, { error: 'INVALID_ARTICLE', message: 'Título e conteúdo são obrigatórios.' });
        const id = String(body.id || newId()).trim().slice(0, 160);
        if (!id) return json(res, 400, { error: 'INVALID_ARTICLE_ID' });
        if (await documentGet('articles', id)) return json(res, 409, { error: 'RESOURCE_CONFLICT', message: 'Já existe uma matéria com este identificador.' });
        const requestedPublication = isEditor && String(editable.editorialStatus || '').toUpperCase() === 'PUBLICADA';
        const requestedAccess = String(editable.accessLevel || 'aberto');
        const record = {
          ...editable,
          id,
          title,
          content: articleContent,
          createdBy: user.uid,
          authorId: isEditor ? String(editable.authorId || user.uid) : user.uid,
          authorRole: isEditor ? String(editable.authorRole || user.role) : user.role,
          editorialStatus: requestedPublication ? 'PUBLICADA' : 'EM REDAÇÃO',
          status: requestedPublication ? String(editable.status || 'publicada') : 'rascunho',
          accessLevel: ['aberto', 'assinante', 'premium'].includes(requestedAccess) ? requestedAccess : 'aberto',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await documentWrite('articles', id, record, false);
        return json(res, 201, record);
      }

      if (!resource.id) return json(res, 400, { error: 'RESOURCE_ID_REQUIRED', message: 'Informe o identificador da matéria.' });
      const existing = await documentGet('articles', resource.id);
      if (!existing) return json(res, 404, { error: 'NOT_FOUND', message: 'Matéria não encontrada.' });
      const owner = [existing.createdBy, existing.authorUid, existing.authorId]
        .some((value) => String(value || '') === user.uid);
      if (!isEditor && !isReviewer && !owner) {
        return json(res, 403, { error: 'ARTICLE_NOT_OWNED', message: 'Jornalistas só podem alterar as próprias matérias.' });
      }
      const next = {
        ...existing,
        ...editable,
        id: String(existing.id || resource.id),
        createdBy: String(existing.createdBy || user.uid),
        updatedAt: new Date().toISOString(),
      };
      if (!isEditor) {
        next.editorialStatus = 'EM REVISÃO';
        next.status = 'rascunho';
        next.authorId = String(existing.authorId || user.uid);
      }
      if (typeof next.title !== 'string' || !next.title.trim() || typeof next.content !== 'string' || !next.content.trim()) {
        return json(res, 400, { error: 'INVALID_ARTICLE', message: 'Título e conteúdo são obrigatórios.' });
      }
      const nextAccess = String(next.accessLevel || 'aberto');
      if (!['aberto', 'assinante', 'premium'].includes(nextAccess)) {
        return json(res, 400, { error: 'INVALID_ACCESS_LEVEL' });
      }
      await documentWrite('articles', String(existing.id || resource.id), next);
      return json(res, 200, next);
    }

    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      if (!requireRole(identity, required, res)) return;
      if (method === 'DELETE') {
        if (!resource.id) return json(res, 400, { error: 'RESOURCE_ID_REQUIRED', message: 'Informe o identificador do registro.' });
        await documentDelete(resource.collection, resource.id);
        return json(res, 204, null);
      }
      const body = cleanObject(await readBody(req));
      if (resource.collection === 'articles' && method === 'POST' && (!String(body.title || '').trim() || !String(body.content || '').trim())) return json(res, 400, { error: 'INVALID_ARTICLE', message: 'Título e conteúdo são obrigatórios.' });
      const id = resource.id || String(body.id || newId());
      const record = { ...body, id, updatedAt: new Date().toISOString(), ...(method === 'POST' ? { createdAt: new Date().toISOString() } : {}) };
      if (method === 'POST' && await documentGet(resource.collection, id)) return json(res, 409, { error: 'RESOURCE_CONFLICT', message: 'Já existe um registro com este identificador.' });
      await documentWrite(resource.collection, id, record, method !== 'POST');
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
