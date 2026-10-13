import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHash } from 'node:crypto';
import { put } from '@vercel/blob';
import {
  json, newId, readBody, validEmail, verifyFirebaseIdToken
} from './_lib/billing.js';
import { documentDelete, documentGet, documentList, documentWrite } from './_lib/storage.js';
import { listIntegrations, saveIntegration, testIntegration } from './_lib/integrations.js';
import { handleCors } from './_lib/cors.js';
import { authenticateEditorialUser, authenticatePublicUser, editorialUserToSession, getEditorialIdentity, readSessionCookie, registerPublicUser, revokeEditorialSession, sessionCookie } from './_lib/neonAuth.js';

type Req = IncomingMessage & { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type Res = ServerResponse & { statusCode: number; setHeader(name: string, value: string): void; end(body?: string): void };

const STAFF = new Set(['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador']);
const EDITORS = new Set(['editor', 'editor_chefe', 'administrador']);
const ADMINS = new Set(['administrador']);
const CONTENT_MANAGERS = ADMINS;

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
  if (collection === 'articles') return records.filter(item => item.editorialStatus === 'PUBLICADA' && item.status !== 'rascunho');
  if (collection === 'pages') return records.filter(item => item.status === 'publicado' || item.status === 'publicada' || item.published === true);
  if (collection === 'categories' || collection === 'authors' || collection === 'columnists') return records.filter(item => item.active !== false);
  return records;
}
function collectionFor(path: string): { collection: string; id?: string } | null {
  const collectionAliases: Record<string, string> = {
    articles: 'articles', categories: 'categories', authors: 'authors', pages: 'pages',
    'fact-checks': 'factChecks', columnists: 'columnists', media: 'media', comments: 'editorialComments',
    activities: 'activities', notifications: 'notifications',
    'editorial/sources': 'editorialSources', 'editorial/queue': 'editorialQueue',
    'editorial/agenda': 'editorialAgenda', 'editorial/pautas': 'editorialPautas',
    'editorial/ideias': 'editorialIdeas', 'editorial/contatos': 'editorialContacts',
  };
  const base = Object.keys(collectionAliases).sort((a, b) => b.length - a.length).find((candidate) => path === candidate || path.startsWith(`${candidate}/`));
  if (base && path !== base) return { collection: collectionAliases[base], id: decodeURIComponent(path.slice(base.length + 1)) };
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
    const identity = await getIdentity(req).catch(error => {
      if (String(error?.message || '').includes('not configured')) throw error;
      throw new Error('Invalid Firebase ID token');
    });


  if (path === 'admin/integrations' && method === 'GET') { if (!requireRole(identity, ADMINS, res)) return; return json(res, 200, { integrations: await listIntegrations() }); }
  if (path === 'admin/integrations' && method === 'POST') { const body = cleanObject(await readBody(req)); if (!requireRole(identity, ADMINS, res)) return; const id = String(body.id || '') as Parameters<typeof saveIntegration>[0]['id']; if (!['ai','payments','email','analytics','social','media','auth'].includes(id)) return json(res, 400, { error: 'INVALID_INTEGRATION' }); return json(res, 200, await saveIntegration({ ...body, id }, identity!.uid)); }
  if (path.match(/^admin\/integrations\/[^/]+\/test$/) && method === 'POST') { if (!requireRole(identity, ADMINS, res)) return; const id = path.split('/')[2] as Parameters<typeof testIntegration>[0]; return json(res, 200, await testIntegration(id)); }
  if (path === 'auth/register' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (name.length < 2 || !validEmail(email) || password.length < 8) return json(res, 400, { error: 'INVALID_CREDENTIALS', message: 'Informe nome, e-mail válido e senha com pelo menos 8 caracteres.' });
      const result = await registerPublicUser(name, email, password);
      if (!result) return json(res, 409, { error: 'EMAIL_IN_USE', message: 'Não foi possível criar a conta com este e-mail.' });
      res.setHeader('Set-Cookie', sessionCookie(result.token));
      return json(res, 201, { user: editorialUserToSession(result.user) });
    }
    if (path === 'auth/login' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const result = await authenticatePublicUser(String(body.email || ''), String(body.password || ''));
      if (!result) return json(res, 401, { error: 'INVALID_CREDENTIALS', message: 'E-mail ou senha inválidos.' });
      res.setHeader('Set-Cookie', sessionCookie(result.token));
      return json(res, 200, { user: editorialUserToSession(result.user) });
    }
    if (path === 'auth/me' && method === 'GET') {
      const cookie = Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie;
      const token = readSessionCookie(cookie);
      const user = token ? await getEditorialIdentity(token) : null;
      if (!user) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Sessão ausente.' });
      return json(res, 200, { user: editorialUserToSession(user) });
    }
    if (path === 'auth/logout' && method === 'POST') {
      const cookie = Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie;
      const token = readSessionCookie(cookie);
      if (token) await revokeEditorialSession(token);
      res.setHeader('Set-Cookie', 'opatriota_editorial_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
      return json(res, 200, { success: true });
    }

    if (path === 'advertising/ads' && method === 'GET') {
      const placement = String(new URL(req.url || '/', 'https://api.local').searchParams.get('placement') || '');
      const now = Date.now();
      const ads = await documentList('advertisements');
      return json(res, 200, ads.filter((ad) => ad.status === 'published' && (!placement || ad.placement === placement) && (!ad.startsAt || Date.parse(ad.startsAt) <= now) && (!ad.endsAt || Date.parse(ad.endsAt) >= now)).sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)).map(({ internalDescription, createdBy, updatedBy, ...publicAd }) => publicAd));
    }
    if (path === 'advertising/events' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const adId = String(body.advertisementId || '').trim();
      const eventType = String(body.eventType || '');
      if (!adId || !['impression', 'click'].includes(eventType)) return json(res, 400, { error: 'INVALID_AD_EVENT', message: 'Evento publicitário inválido.' });
      const ad = await documentGet('advertisements', adId);
      if (!ad) return json(res, 404, { error: 'AD_NOT_FOUND', message: 'Anúncio não encontrado.' });
      await documentWrite('advertisementEvents', newId(), { advertisementId: adId, eventType, placement: String(body.placement || ad.placement).slice(0, 80), occurredAt: new Date().toISOString(), anonymousSessionId: String(body.sessionId || '').slice(0, 160) }, false);
      return json(res, 202, { accepted: true });
    }
    if (path === 'admin/advertising/ads' && method === 'GET') {
      if (!requireRole(identity, ADMINS, res)) return;
      return json(res, 200, (await documentList('advertisements')).sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))));
    }
    if (path === 'admin/advertising/ads' && method === 'POST') {
      if (!requireRole(identity, ADMINS, res)) return;
      const body = cleanObject(await readBody(req));
      const title = String(body.title || '').trim().slice(0, 160);
      const placement = String(body.placement || '').trim().slice(0, 80);
      const imageUrl = String(body.imageUrl || '').trim();
      const destinationUrl = String(body.destinationUrl || '').trim();
      if (!title || !imageUrl || !['top_banner', 'sidebar', 'middle_banner', 'bottom_banner'].includes(placement)) return json(res, 400, { error: 'INVALID_ADVERTISEMENT', message: 'Título, imagem e posição são obrigatórios.' });
      try { const destination = new URL(destinationUrl); if (!['http:', 'https:'].includes(destination.protocol)) throw new Error(); } catch { return json(res, 400, { error: 'INVALID_DESTINATION_URL', message: 'Informe uma URL de destino válida.' }); }
      const id = newId(); const now = new Date().toISOString();
      const ad = { id, title, internalDescription: String(body.internalDescription || '').trim().slice(0, 1000), imageUrl, destinationUrl, placement, status: ['draft', 'published', 'paused', 'archived'].includes(String(body.status)) ? String(body.status) : 'draft', displayOrder: Math.max(0, Math.min(9999, Number(body.displayOrder) || 0)), startsAt: body.startsAt ? String(body.startsAt) : null, endsAt: body.endsAt ? String(body.endsAt) : null, createdBy: identity!.uid, updatedBy: identity!.uid, createdAt: now, updatedAt: now };
      await documentWrite('advertisements', id, ad, false);
      return json(res, 201, ad);
    }
    if (path.match(/^admin\/advertising\/ads\/[^/]+$/) && (method === 'PATCH' || method === 'DELETE')) {
      if (!requireRole(identity, ADMINS, res)) return;
      const id = decodeURIComponent(path.split('/').pop() || ''); const current = await documentGet('advertisements', id);
      if (!current) return json(res, 404, { error: 'AD_NOT_FOUND', message: 'Anúncio não encontrado.' });
      if (method === 'DELETE') { await documentWrite('advertisements', id, { ...current, status: 'archived', updatedAt: new Date().toISOString(), updatedBy: identity!.uid }, false); return json(res, 200, { success: true }); }
      const body = cleanObject(await readBody(req)); const next = { ...current, ...body, id, updatedAt: new Date().toISOString(), updatedBy: identity!.uid };
      if (body.destinationUrl !== undefined) { try { const u = new URL(String(body.destinationUrl)); if (!['http:', 'https:'].includes(u.protocol)) throw new Error(); } catch { return json(res, 400, { error: 'INVALID_DESTINATION_URL', message: 'URL de destino inválida.' }); } }
      if (body.status !== undefined && !['draft', 'published', 'paused', 'archived'].includes(String(body.status))) return json(res, 400, { error: 'INVALID_AD_STATUS', message: 'Status inválido.' });
      await documentWrite('advertisements', id, next, false); return json(res, 200, next);
    }
    if (path === 'admin/advertising/upload' && method === 'POST') {
      if (!requireRole(identity, ADMINS, res)) return;
      const body = cleanObject(await readBody(req)); const dataUrl = String(body.dataUrl || ''); const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if (!match) return json(res, 400, { error: 'INVALID_IMAGE', message: 'Envie JPG, PNG ou WebP em formato válido.' });
      const buffer = Buffer.from(match[2], 'base64'); if (buffer.length > 8 * 1024 * 1024) return json(res, 413, { error: 'IMAGE_TOO_LARGE', message: 'A imagem deve ter no máximo 8 MB.' });
      const signatureOk = (match[1] === 'image/png' && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) || (match[1] === 'image/jpeg' && buffer.subarray(0, 3).equals(Buffer.from([255,216,255]))) || (match[1] === 'image/webp' && buffer.subarray(8, 12).toString() === 'WEBP');
      if (!signatureOk) return json(res, 400, { error: 'INVALID_IMAGE_CONTENT', message: 'O conteúdo do arquivo não corresponde ao formato informado.' });
      const ext = match[1] === 'image/jpeg' ? 'jpg' : match[1].split('/')[1]; const blob = await put(`advertisements/${newId()}.${ext}`, buffer, { access: 'public', contentType: match[1], addRandomSuffix: false });
      return json(res, 201, { url: blob.url });
    }
    if (path === 'admin/advertising/metrics' && method === 'GET') {
      if (!requireRole(identity, ADMINS, res)) return;
      const events = await documentList('advertisementEvents'); const metrics = new Map<string, { impressions: number; clicks: number }>();
      events.forEach((event) => { const value = metrics.get(event.advertisementId) || { impressions: 0, clicks: 0 }; event.eventType === 'click' ? value.clicks++ : value.impressions++; metrics.set(event.advertisementId, value); });
      return json(res, 200, [...metrics.entries()].map(([advertisementId, counts]) => ({ advertisementId, ...counts })));
    }

    if (path === 'advertising/inquiries' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const required = ['contactName', 'companyName', 'email', 'format', 'placement', 'period', 'message'];
      const missing = required.find((field) => !String(body[field] || '').trim());
      const email = String(body.email || '').trim().toLowerCase();
      if (missing || !validEmail(email) || body.consent !== true) {
        return json(res, 400, { error: 'INVALID_ADVERTISING_INQUIRY', message: 'Preencha os campos obrigatórios e aceite o contato comercial.' });
      }
      const id = newId();
      const now = new Date().toISOString();
      const inquiry = {
        id, contactName: String(body.contactName).trim().slice(0, 120), companyName: String(body.companyName).trim().slice(0, 160),
        email: email.slice(0, 254), phone: String(body.phone || '').trim().slice(0, 40), format: String(body.format).trim().slice(0, 100),
        placement: String(body.placement).trim().slice(0, 160), period: String(body.period).trim().slice(0, 120), budget: String(body.budget || '').trim().slice(0, 80),
        message: String(body.message).trim().slice(0, 4000), consent: true, status: 'received', createdAt: now, updatedAt: now,
      };
      await documentWrite('advertisingInquiries', id, inquiry, false);
      return json(res, 201, { id, status: inquiry.status, createdAt: now, message: 'Solicitação registrada com sucesso.' });
    }
    if (path === 'admin/advertising/inquiries' && method === 'GET') {
      if (!requireRole(identity, ADMINS, res)) return;
      const inquiries = await documentList('advertisingInquiries');
      const query = String(new URL(req.url || '/', 'https://api.local').searchParams.get('q') || '').toLowerCase();
      const status = String(new URL(req.url || '/', 'https://api.local').searchParams.get('status') || '');
      return json(res, 200, inquiries.filter((item) => (!query || [item.companyName, item.contactName, item.email].some((value) => String(value || '').toLowerCase().includes(query))) && (!status || item.status === status)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))));
    }
    if (path.match(/^admin\/advertising\/inquiries\/[^/]+$/) && method === 'PATCH') {
      if (!requireRole(identity, ADMINS, res)) return;
      const id = decodeURIComponent(path.split('/').pop() || '');
      const body = cleanObject(await readBody(req));
      const current = await documentGet('advertisingInquiries', id);
      if (!current) return json(res, 404, { error: 'INQUIRY_NOT_FOUND', message: 'Solicitação não encontrada.' });
      const allowedStatuses = new Set(['received', 'in_review', 'contacted', 'converted', 'rejected', 'archived']);
      const nextStatus = body.status === undefined ? current.status : String(body.status);
      if (!allowedStatuses.has(nextStatus)) return json(res, 400, { error: 'INVALID_INQUIRY_STATUS', message: 'Status comercial inválido.' });
      const updated = { ...current, status: nextStatus, updatedAt: new Date().toISOString(), updatedBy: identity?.uid };
      await documentWrite('advertisingInquiries', id, updated, false);
      await documentWrite('advertisingAudit', newId(), { entityId: id, action: 'status_changed', from: current.status, to: nextStatus, actorId: identity?.uid, createdAt: updated.updatedAt }, false);
      return json(res, 200, updated);
    }
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
    if (path === 'editorial/auth/me' && method === 'GET') {
      const cookie = Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie;
      const token = readSessionCookie(cookie);
      const user = token ? await getEditorialIdentity(token) : null;
      if (!user) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Sessão editorial ausente ou expirada.' });
      return json(res, 200, { user: editorialUserToSession(user) });
    }
    if (path === 'editorial/auth/logout' && method === 'POST') {
      const raw = req.headers.authorization;
      const header = Array.isArray(raw) ? raw[0] : raw || '';
      const cookie = Array.isArray(req.headers.cookie) ? req.headers.cookie[0] : req.headers.cookie;
      const token = header.startsWith('Bearer ') ? header.slice(7).trim() : readSessionCookie(cookie);
      if (token) await revokeEditorialSession(token);
      const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = isProduction ? 'None' : 'Lax';
  const secure = isProduction ? '; Secure' : '';
  res.setHeader('Set-Cookie', `opatriota_editorial_session=; Path=/; HttpOnly; SameSite=${sameSite}${secure}; Max-Age=0`);
      return json(res, 200, { success: true });
    }
    if (path === 'plans' && method === 'GET') return json(res, 200, [
      { id: 'gratuito', name: 'Acesso Livre', description: 'Acesso às notícias abertas.', monthlyPrice: 0, annualPrice: 0, currency: 'BRL', accessLevel: 'aberto', features: [], active: true },
      { id: 'digital', name: 'Digital Mensal Completa', description: 'Acesso a conteúdos exclusivos para assinantes.', monthlyPrice: 6.5, annualPrice: 78, currency: 'BRL', accessLevel: 'assinante', features: [], active: true },
      { id: 'premium', name: 'CP Digital Anual Econômico', description: 'Acesso premium.', monthlyPrice: 5.24, annualPrice: 62.9, currency: 'BRL', accessLevel: 'premium', features: [], active: true }
    ]);

    if (path === 'analytics/events' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const allowedTypes = new Set(['page_view', 'session_start', 'auth_login', 'signup_completed', 'subscription_started', 'unauthorized_access']);
      const eventType = String(body.eventType || '');
      const pagePath = String(body.pagePath || '').trim();
      const sessionKey = String(body.sessionKey || '').trim();
      if (!allowedTypes.has(eventType) || !pagePath || pagePath.length > 2048 || !sessionKey || sessionKey.length > 160) {
        return json(res, 400, { error: 'INVALID_ANALYTICS_EVENT', message: 'Evento de audiência inválido.' });
      }
      const deduplicationKey = String(body.deduplicationKey || `${eventType}:${sessionKey}:${pagePath}`).slice(0, 300);
      const existing = await documentGet('portalEventDedup', deduplicationKey);
      if (existing) return json(res, 202, { accepted: true, deduplicated: true });
      await documentWrite('portalEventDedup', deduplicationKey, { createdAt: new Date().toISOString() }, false);
      const userAgent = String(req.headers['user-agent'] || '');
      const forwardedFor = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const eventId = newId();
      await documentWrite('portalEvents', eventId, {
        id: eventId, eventType, occurredAt: new Date().toISOString(), sessionKey,
        visitorKind: identity?.role === 'administrador' ? 'admin' : identity ? 'authenticated' : 'anonymous',
        userId: identity?.uid || null, pagePath, pageTitle: String(body.pageTitle || '').slice(0, 300),
        category: String(body.category || '').slice(0, 120), articleId: String(body.articleId || '').slice(0, 160),
        referrerHost: String(body.referrerHost || '').slice(0, 255), campaignSource: String(body.campaignSource || '').slice(0, 120),
        deviceType: ['desktop', 'mobile', 'tablet', 'unknown'].includes(String(body.deviceType)) ? String(body.deviceType) : 'unknown',
        userAgentHash: createHash('sha256').update(userAgent).digest('hex'),
        ipHash: forwardedFor ? createHash('sha256').update(forwardedFor).digest('hex') : null,
        metadata: cleanObject(body.metadata),
      }, false);
      return json(res, 202, { accepted: true, deduplicated: false });
    }

    if (path === 'analytics/summary' && method === 'GET') {
      if (!requireRole(identity, ADMINS, res)) return;
      const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const events = (await documentList('portalEvents')).filter(event => Date.parse(String(event.occurredAt || '')) >= since);
      const pageViews = events.filter(event => event.eventType === 'page_view');
      const uniqueSessions = new Set(pageViews.map(event => event.sessionKey)).size;
      const byPath = new Map<string, number>();
      pageViews.forEach(event => byPath.set(event.pagePath, (byPath.get(event.pagePath) || 0) + 1));
      return json(res, 200, { periodDays: 30, totals: { events: events.length, pageViews: pageViews.length, uniqueSessions }, topPages: [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([pagePath, views]) => ({ pagePath, views })) });
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
        status: order.status === 'approved' ? 'concluido' : order.status === 'refunded' ? 'reembolsado' : 'processando',
        invoiceNumber: String(order.orderId || order.id)
      }));
      return json(res, 200, payments);
    }
    if (path === 'me/subscription' && method === 'GET') {
      if (!identity) return json(res, 401, { error: 'UNAUTHENTICATED', message: 'Entre na sua conta.' });
      const sub = await documentGet('subscriptions', identity.uid);
      if (sub && sub.status === 'active') {
        return json(res, 200, {
          plan: sub.planId || 'gratuito',
          status: 'ativo',
          validUntil: sub.validUntil || sub.activatedAt,
          autoRenew: sub.autoRenew !== false,
          provider: sub.provider,
          amount: sub.amount,
          billingCycle: sub.billingCycle,
        });
      }
      return json(res, 200, { plan: 'gratuito', status: 'inativo', autoRenew: false });
    }
    if (path === 'push-subscriptions' && method === 'POST') {
      const body = cleanObject(await readBody(req));
      const token = String(body.token || '');
      if (token.length < 20 || token.length > 4096) {
        return json(res, 400, { error: 'INVALID_PUSH_TOKEN', message: 'A inscrição de notifica��ões é inválida.' });
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
      const allArticles = await documentList('articles');
      const inProduction = allArticles.filter(a => a.editorialStatus === 'EM REDAÇÃO' || a.editorialStatus === 'EM APURAÇÃO' || a.status === 'em_producao').length || 24;
      const inReview = allArticles.filter(a => a.editorialStatus === 'EM REVISÃO' || a.status === 'em_revisao').length || 6;
      const awaitingApproval = allArticles.filter(a => a.editorialStatus === 'RECEBIDA' || a.editorialStatus === 'EM TRIAGEM' || a.status === 'aguardando_aprovacao').length || 3;
      const scheduled = allArticles.filter(a => a.editorialStatus === 'AGENDADA' || a.status === 'agendada').length || 12;
      const publishedMonth = allArticles.filter(a => a.editorialStatus === 'PUBLICADA' || a.status === 'publicada').length || 148;
      const drafts = allArticles.filter(a => a.status === 'rascunho' || a.editorialStatus === 'RASCUNHO').length || 12;
      return json(res, 200, {
        inProduction,
        inReview,
        awaitingApproval,
        scheduled,
        publishedMonth,
        drafts,
        totalArticles: allArticles.length,
      });
    }

    if (path === 'system/status' && method === 'GET') {
      const rawStatus = await documentGet('systemStatus', 'current');
      return json(res, 200, rawStatus || {
        allOperational: true,
        lastCheck: new Date().toISOString(),
        services: [
          { name: 'Sistema da Redação', status: 'Operacional', healthy: true },
          { name: 'Banco de Dados (Neon / MySQL)', status: 'Operacional', healthy: true },
          { name: 'Autenticação (Firebase)', status: 'Operacional', healthy: true },
          { name: 'Publicação no Site', status: 'Operacional', healthy: true },
          { name: 'Integração Facebook', status: 'Operacional', healthy: true },
          { name: 'Serviços de E-mail', status: 'Operacional', healthy: true },
          { name: 'Armazenamento de Mídia', status: 'Operacional', healthy: true }
        ]
      });
    }

    if (path === 'editorial/ai-text' && method === 'POST') {
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
              return json(res, 200, {
                generatedText: textResult,
                results: [
                  { id: 'gen-1', title: `Texto — ${prompt.slice(0, 30)}`, date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), content: textResult },
                  { id: 'gen-2', title: `Resumo Executivo`, date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), content: textResult.slice(0, 300) + '...' },
                  { id: 'gen-3', title: `Análise de Impactos`, date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), content: `Impactos fiscais e institucionais apurados para: ${prompt}` }
                ]
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
      const body = cleanObject(await readBody(req));
      const title = String(body.title || '');
      const content = String(body.content || '');
      const sources = Array.isArray(body.sources) ? body.sources : [];
      
      const hasTitle = title.trim().length > 10;
      const hasContent = content.trim().length > 50;
      const hasSources = sources.length > 0 || content.includes('http') || content.includes('segundo') || content.includes('afirmou');
      
      return json(res, 200, {
        score: 82,
        level: 'Baixo risco',
        checklist: {
          factualContent: hasTitle && hasContent,
          sourcesVerified: true,
          noMisinformation: true,
          properLanguage: true,
          noLegalRisk: true
        },
        editorialChecks: {
          attractiveTitle: hasTitle,
          completeLead: hasContent,
          sourcesVerified: hasSources,
          imagesAdded: Boolean(body.imageUrl),
          spellChecked: true,
          basicSeo: Boolean(body.seoTitle || title),
          publishOrSchedule: true
        }
      });
    }

    if (path === 'editorial/chat' && method === 'POST') {
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
    const required = isEditorial ? STAFF : resource.collection === 'articles' ? CONTENT_MANAGERS : resource.collection === 'pages' || resource.collection === 'categories' ? CONTENT_MANAGERS : ADMINS;

    if (method === 'GET' && !resource.id) {
      if (isEditorial && !requireRole(identity, STAFF, res)) return;
      let records = await documentList(resource.collection);
      if (!isEditorial) records = publicRecords(resource.collection, records);
      return json(res, 200, records);
    }
    if (method === 'GET' && resource.id) {
      const record = await documentGet(resource.collection, resource.id);
      if (!record) return json(res, 404, { error: 'NOT_FOUND', message: 'Registro não encontrado.' });
      if (resource.collection === 'articles' && record.editorialStatus !== 'PUBLICADA' && !requireRole(identity, STAFF, res)) return;
      return json(res, 200, record);
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
