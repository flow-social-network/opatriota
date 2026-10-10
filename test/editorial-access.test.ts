import test from 'node:test';
import assert from 'node:assert/strict';
import { isOpenArticle, isPublicArticle, isPublicPage } from '../api/_lib/editorial-access.ts';

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
  assert.equal(isPublicPage({ status: 'rascunho' }), false);
  assert.equal(isPublicPage({ status: 'despublicada' }), false);
});
