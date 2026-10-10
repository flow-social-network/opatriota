import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyFirebaseIdToken } from './billing';
import { documentGet } from './storage';

export type ApiRequest = IncomingMessage & {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  url?: string;
};
export type ApiResponse = ServerResponse & {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};
export type Identity = { uid: string; email: string; role: string };

export const STAFF_ROLES = new Set([
  'jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador',
]);
export const EDITOR_ROLES = new Set(['editor', 'editor_chefe', 'administrador']);
export const ADMIN_ROLES = new Set(['administrador']);

export function sendJson(res: ApiResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(status === 204 ? undefined : JSON.stringify(value));
}

export async function identityFromRequest(req: ApiRequest): Promise<Identity | null> {
  const raw = req.headers.authorization;
  const header = Array.isArray(raw) ? raw[0] : raw || '';
  if (!header.startsWith('Bearer ')) return null;
  try {
    const user = await verifyFirebaseIdToken(header.slice(7));
    const uid = String(user.localId || user.uid || '');
    if (!uid) return null;
    const role = await documentGet('userRoles', uid);
    return { uid, email: String(user.email || ''), role: String(role?.role || 'leitor_gratuito') };
  } catch {
    return null;
  }
}

export async function canReadPaidContent(identity: Identity | null): Promise<boolean> {
  if (!identity) return false;
  if (STAFF_ROLES.has(identity.role)) return true;
  const subscription = await documentGet('subscriptions', identity.uid);
  if (!subscription || subscription.status !== 'active') return false;
  if (subscription.validUntil) {
    const expires = Date.parse(String(subscription.validUntil));
    if (Number.isFinite(expires) && expires < Date.now()) return false;
  }
  return true;
}

export function isPublicArticle(article: Record<string, any>): boolean {
  return article.editorialStatus === 'PUBLICADA' &&
    article.status !== 'rascunho' &&
    article.status !== 'despublicada';
}

export function isOpenArticle(article: Record<string, any>): boolean {
  const level = String(article.accessLevel || 'aberto').toLowerCase();
  return level === 'aberto' || level === 'open' || level === 'free';
}

export function isPublicPage(page: Record<string, any>): boolean {
  return page.status === 'publicado' || page.status === 'publicada' || page.published === true;
}

export async function readRequestBody(req: ApiRequest): Promise<Record<string, any>> {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) return req.body as Record<string, any>;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    if (Buffer.concat(chunks).length > 1_000_000) throw new Error('REQUEST_BODY_TOO_LARGE');
  }
  if (!chunks.length) return {};
  const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

export async function roleRecord(identity: Identity | null) {
  return identity ? documentGet('userRoles', identity.uid) : null;
}
