import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasArticleAccess,
  isPublicArticle,
  isPublicPage,
  lockedArticle,
} from '../api/[...path]';

test('draft, rejected, archived and unpublished articles are not public', () => {
  assert.equal(isPublicArticle({ editorialStatus: 'PUBLICADA', status: 'publicada' }), true);
  for (const status of ['rascunho', 'em revisão', 'em apuração', 'despublicada', 'unpublished', 'rejeitada', 'arquivada', 'unexpected']) {
    assert.equal(isPublicArticle({ editorialStatus: 'PUBLICADA', status }), false, status);
  }
  assert.equal(isPublicArticle({ editorialStatus: 'EM REVISÃO', status: 'publicada' }), false);
});

test('draft and review pages cannot become public through a stale published flag', () => {
  for (const status of ['rascunho', 'revisao', 'despublicada']) {
    assert.equal(isPublicPage({ status, published: true }), false, status);
  }
  assert.equal(isPublicPage({ status: 'publicada' }), true);
  assert.equal(isPublicPage({ status: 'published' }), true);
  assert.equal(isPublicPage({ published: true }), true);
});

test('article access levels fail closed for unknown values', () => {
  assert.equal(hasArticleAccess({ accessLevel: 'aberto' }, 'none'), true);
  assert.equal(hasArticleAccess({ accessLevel: 'assinante' }, 'assinante'), true);
  assert.equal(hasArticleAccess({ accessLevel: 'premium' }, 'assinante'), false);
  assert.equal(hasArticleAccess({ accessLevel: 'premium' }, 'premium'), true);
  assert.equal(hasArticleAccess({ accessLevel: 'unexpected' }, 'premium'), false);
});

test('locked article payload omits full content and embedded HTML', () => {
  const result = lockedArticle({
    id: 'article-1',
    title: 'Matéria premium',
    content: 'Texto integral secreto',
    htmlContent: '<script>alert(1)</script>',
    fullText: 'Texto completo',
    videoIframeHtml: '<iframe src="unsafe"></iframe>',
    subtitle: 'Chamada pública',
  });

  assert.equal(result.title, 'Matéria premium');
  assert.equal(result.subtitle, 'Chamada pública');
  assert.equal(result.premiumLocked, true);
  assert.equal('content' in result, false);
  assert.equal('htmlContent' in result, false);
  assert.equal('fullText' in result, false);
  assert.equal('videoIframeHtml' in result, false);
});
