import { newId } from '../_lib/billing';
import { documentDelete, documentGet, documentList, documentWrite } from '../_lib/storage';
import {
  ApiRequest, ApiResponse, EDITOR_ROLES, identityFromRequest,
  isPublicPage, readRequestBody, sendJson,
} from '../_lib/editorial-access';

export default async function handler(req: ApiRequest & { query?: Record<string, string | string[] | undefined> }, res: ApiResponse) {
  const method = req.method || 'GET';
  if (!['GET', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
    res.setHeader('Allow', 'GET, PATCH, PUT, DELETE');
    return sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const rawId = req.query?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return sendJson(res, 400, { error: 'PAGE_ID_REQUIRED' });

    const identity = await identityFromRequest(req);
    const direct = await documentGet('pages', id);
    const page = direct || (await documentList('pages')).find((item) => String(item.slug || '') === id);
    if (!page) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Página não encontrada.' });

    const editor = Boolean(identity && EDITOR_ROLES.has(identity.role));
    if (method === 'GET') {
      if (!isPublicPage(page) && !editor) return sendJson(res, 404, { error: 'NOT_FOUND' });
      return sendJson(res, 200, page);
    }
    if (!editor) return sendJson(res, identity ? 403 : 401, { error: identity ? 'FORBIDDEN' : 'UNAUTHENTICATED' });

    const recordId = String(page.id || id);
    if (method === 'DELETE') {
      await documentDelete('pages', recordId);
      return sendJson(res, 204, null);
    }
    const body = await readRequestBody(req);
    const next = { ...page, ...body, id: recordId, updatedAt: new Date().toISOString(), updatedBy: identity!.uid };
    if (typeof next.title !== 'string' || !next.title.trim() || typeof next.slug !== 'string' || !next.slug.trim()) {
      return sendJson(res, 400, { error: 'INVALID_PAGE', message: 'Título e slug são obrigatórios.' });
    }
    if (!['publicado', 'publicada', 'rascunho', 'revisao', 'despublicada'].includes(String(next.status || 'rascunho'))) {
      return sendJson(res, 400, { error: 'INVALID_PAGE_STATUS' });
    }
    await documentWrite('pages', recordId, next);
    return sendJson(res, 200, next);
  } catch (error) {
    console.error('page detail failed:', String((error as Error)?.message || error));
    return sendJson(res, 500, { error: 'PAGE_REQUEST_FAILED' });
  }
}
