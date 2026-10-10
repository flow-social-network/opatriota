import type { IncomingMessage, ServerResponse } from 'node:http';
import { newId } from '../_lib/billing';
import { documentGet, documentList, documentWrite } from '../_lib/storage';
import {
  ApiRequest, ApiResponse, EDITOR_ROLES, STAFF_ROLES, canReadPaidContent,
  identityFromRequest, isOpenArticle, isPublicArticle, readRequestBody, sendJson,
} from '../_lib/editorial-access';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const identity = await identityFromRequest(req);
    if (req.method === 'GET') {
      const all = await documentList('articles');
      const paidAccess = await canReadPaidContent(identity);
      const staff = Boolean(identity && STAFF_ROLES.has(identity.role));
      const articles = all
        .filter((article) => staff || isPublicArticle(article))
        .map((article) => {
          if (staff || paidAccess || isOpenArticle(article)) return article;
          const { content: _content, body: _body, htmlContent: _htmlContent, fullText: _fullText, ...teaser } = article;
          return { ...teaser, premiumLocked: true };
        })
        .sort((a, b) => {
          const dateA = Date.parse(String(a.publishedAt || a.updatedAt || a.createdAt || ''));
          const dateB = Date.parse(String(b.publishedAt || b.updatedAt || b.createdAt || ''));
          return (Number.isFinite(dateB) ? dateB : 0) - (Number.isFinite(dateA) ? dateA : 0);
        });
      return sendJson(res, 200, articles);
    }

    if (!identity || !STAFF_ROLES.has(identity.role)) {
      return sendJson(res, identity ? 403 : 401, { error: identity ? 'FORBIDDEN' : 'UNAUTHENTICATED' });
    }
    const body = await readRequestBody(req);
    const title = String(body.title || '').trim().slice(0, 300);
    const articleContent = String(body.content || '').trim();
    if (!title || !articleContent) return sendJson(res, 400, { error: 'INVALID_ARTICLE', message: 'Título e conteúdo são obrigatórios.' });

    const id = String(body.id || newId()).slice(0, 160);
    if (await documentGet('articles', id)) return sendJson(res, 409, { error: 'RESOURCE_CONFLICT' });
    const canPublish = EDITOR_ROLES.has(identity.role);
    const article = {
      ...body,
      id,
      title,
      content: articleContent,
      authorId: identity.role === 'jornalista' ? identity.uid : String(body.authorId || identity.uid),
      createdBy: identity.uid,
      editorialStatus: canPublish && body.editorialStatus === 'PUBLICADA' ? 'PUBLICADA' : 'EM REDAÇÃO',
      status: canPublish ? String(body.status || 'rascunho') : 'rascunho',
      accessLevel: ['aberto', 'assinante', 'premium'].includes(String(body.accessLevel)) ? String(body.accessLevel) : 'aberto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await documentWrite('articles', id, article, false);
    return sendJson(res, 201, article);
  } catch (error) {
    console.error('articles index failed:', String((error as Error)?.message || error));
    return sendJson(res, 500, { error: 'ARTICLE_REQUEST_FAILED' });
  }
}
