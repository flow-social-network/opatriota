import { documentDelete, documentGet, documentList, documentWrite } from '../_lib/storage';
import {
  ApiRequest, ApiResponse, EDITOR_ROLES, STAFF_ROLES, hasPaidAccess, paidAccessLevel,
  identityFromRequest, isOpenArticle, isPublicArticle, readRequestBody, sendJson,
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
    if (!id) return sendJson(res, 400, { error: 'ARTICLE_ID_REQUIRED' });

    const identity = await identityFromRequest(req);
    const direct = await documentGet('articles', id);
    const article = direct || (await documentList('articles')).find((item) => String(item.slug || '') === id);
    if (!article) return sendJson(res, 404, { error: 'NOT_FOUND', message: 'Matéria não encontrada.' });
    const recordId = String(article.id || id);
    const staff = Boolean(identity && STAFF_ROLES.has(identity.role));
    const editor = Boolean(identity && EDITOR_ROLES.has(identity.role));

    if (method === 'GET') {
      if (!staff && !isPublicArticle(article)) return sendJson(res, 404, { error: 'NOT_FOUND' });
      const paidLevel = await paidAccessLevel(identity);
      if (!staff && !isOpenArticle(article) && !hasPaidAccess(article.accessLevel, paidLevel)) {
        const { content: _content, body: _body, htmlContent: _htmlContent, fullText: _fullText, ...teaser } = article;
        return sendJson(res, 403, { error: 'SUBSCRIPTION_REQUIRED', message: 'Esta matéria exige uma assinatura ativa.', article: teaser });
      }
      return sendJson(res, 200, article);
    }

    if (!identity || !staff) return sendJson(res, identity ? 403 : 401, { error: identity ? 'FORBIDDEN' : 'UNAUTHENTICATED' });
    const owner = [article.createdBy, article.authorUid, article.authorId].some((value) => String(value || '') === identity.uid);
    if (!editor && !owner) return sendJson(res, 403, { error: 'ARTICLE_NOT_OWNED', message: 'Jornalistas só podem alterar as próprias matérias.' });
    if (method === 'DELETE') {
      if (!editor) return sendJson(res, 403, { error: 'EDITOR_REQUIRED', message: 'Somente editores podem excluir matérias.' });
      await documentDelete('articles', recordId);
      return sendJson(res, 204, null);
    }

    const body = await readRequestBody(req);
    const next = { ...article, ...body, id: recordId, updatedAt: new Date().toISOString() };
    if (!editor) {
      next.editorialStatus = 'EM REVISÃO';
      next.status = 'rascunho';
      next.createdBy = article.createdBy || identity.uid;
      next.authorId = article.authorId || identity.uid;
    }
    if (typeof next.title !== 'string' || !next.title.trim() || typeof next.content !== 'string' || !next.content.trim()) {
      return sendJson(res, 400, { error: 'INVALID_ARTICLE', message: 'Título e conteúdo são obrigatórios.' });
    }
    if (!['aberto', 'assinante', 'premium'].includes(String(next.accessLevel || 'aberto'))) {
      return sendJson(res, 400, { error: 'INVALID_ACCESS_LEVEL' });
    }
    await documentWrite('articles', recordId, next);
    return sendJson(res, 200, next);
  } catch (error) {
    console.error('article detail failed:', String((error as Error)?.message || error));
    return sendJson(res, 500, { error: 'ARTICLE_REQUEST_FAILED' });
  }
}
