import { newId } from '../_lib/billing';
import { documentGet, documentList, documentWrite } from '../_lib/storage';
import {
  type ApiRequest, type ApiResponse, EDITOR_ROLES, identityFromRequest,
  isPublicPage, readRequestBody, sendJson,
} from '../_lib/editorial-access';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const identity = await identityFromRequest(req);
    if (req.method === 'GET') {
      const pages = (await documentList('pages')).filter((page) =>
        isPublicPage(page) || Boolean(identity && EDITOR_ROLES.has(identity.role))
      );
      return sendJson(res, 200, pages);
    }
    if (!identity || !EDITOR_ROLES.has(identity.role)) {
      return sendJson(res, identity ? 403 : 401, { error: identity ? 'FORBIDDEN' : 'UNAUTHENTICATED' });
    }
    const body = await readRequestBody(req);
    const title = String(body.title || '').trim().slice(0, 300);
    const slug = String(body.slug || '').trim().replace(/^\/+|\/+$/g, '').slice(0, 180);
    if (!title || !slug) return sendJson(res, 400, { error: 'INVALID_PAGE', message: 'Título e slug são obrigatórios.' });
    const id = String(body.id || newId()).slice(0, 160);
    if (await documentGet('pages', id)) return sendJson(res, 409, { error: 'RESOURCE_CONFLICT' });
    const page = {
      ...body,
      id,
      title,
      slug,
      status: ['publicado', 'publicada', 'rascunho', 'revisao', 'despublicada'].includes(String(body.status))
        ? String(body.status)
        : 'rascunho',
      published: ['publicado', 'publicada'].includes(String(body.status)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: identity.uid,
    };
    await documentWrite('pages', id, page, false);
    return sendJson(res, 201, page);
  } catch (error) {
    console.error('pages index failed:', String((error as Error)?.message || error));
    return sendJson(res, 500, { error: 'PAGES_REQUEST_FAILED' });
  }
}
