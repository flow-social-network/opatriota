import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHtml } from '../src/utils/sanitizeHtml';

test('server-side fallback escapes HTML instead of attempting regex sanitization', () => {
  const input = '<img src=x onerror=alert(1)><script>alert(2)</script>';
  const output = sanitizeHtml(input);

  assert.equal(output.includes('<img'), false);
  assert.equal(output.includes('<script'), false);
  assert.match(output, /&lt;img/);
  assert.match(output, /onerror=alert\(1\)/);
});

test('server-side fallback safely encodes markup delimiters and ampersands', () => {
  assert.equal(
    sanitizeHtml('A & B <strong>texto</strong>'),
    'A &amp; B &lt;strong&gt;texto&lt;/strong&gt;',
  );
});

test('empty HTML remains empty', () => {
  assert.equal(sanitizeHtml(''), '');
});
