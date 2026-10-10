import test from 'node:test';
import assert from 'node:assert/strict';
import { hasPaidAccess, isOpenArticle, isPublicArticle, isPublicPage } from '../api/_lib/editorial-access';
import { sanitizeHtml } from '../src/utils/sanitizeHtml';

test('only editorially published articles are public', () => {
  assert.equal(isPublicArticle({ editorialStatus: 'PUBLICADA' }), true);
  assert.equal(isPublicArticle({ editorialStatus: 'EM REDAÇÃO' }), false);
  assert.equal(isPublicArticle({ editorialStatus: 'PUBLICADA', status: 'rascunho' }), false);
  assert.equal(isPublicArticle({ editorialStatus: 'PUBLICADA', status: 'despublicada' }), false);
});

test('legacy articles without accessLevel remain open, paid levels are locked', () => {
  assert.equal(isOpenArticle({}), true);
  assert.equal(isOpenArticle({ accessLevel: 'aberto' }), true);
  assert.equal(isOpenArticle({ accessLevel: 'assinante' }), false);
  assert.equal(isOpenArticle({ accessLevel: 'premium' }), false);
  assert.equal(isOpenArticle({ accessLevel: 'open' }), true);
});

test('only published institutional pages are public', () => {
  assert.equal(isPublicPage({ status: 'publicada' }), true);
  assert.equal(isPublicPage({ status: 'publicado' }), true);
  assert.equal(isPublicPage({ published: true }), true);
  assert.equal(isPublicPage({ status: 'rascunho', published: true }), false);
  assert.equal(isPublicPage({ status: 'despublicada', published: true }), false);
  assert.equal(isPublicPage({ status: 'rascunho' }), false);
  assert.equal(isPublicPage({ status: 'despublicada' }), false);
});

test('digital subscriptions do not unlock premium-only articles', () => {
  assert.equal(hasPaidAccess('assinante', 'assinante'), true);
  assert.equal(hasPaidAccess('premium', 'assinante'), false);
  assert.equal(hasPaidAccess('premium', 'premium'), true);
  assert.equal(hasPaidAccess('aberto', 'none'), true);
  assert.equal(hasPaidAccess('premium', 'none'), false);
});

test('server-side sanitizer escapes HTML when no DOM parser is available', () => {
  assert.equal(
    sanitizeHtml('<img src=x onerror=alert(1)>'),
    '&lt;img src=x onerror=alert(1)&gt;'
  );
});
