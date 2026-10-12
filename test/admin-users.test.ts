import test from 'node:test';
import assert from 'node:assert/strict';
import apiHandler from '../api/[...path]';

function responseRecorder() {
  const headers = new Map<string, string>();
  return {
    statusCode: 200,
    body: '',
    headers,
    setHeader(name: string, value: string) { headers.set(name.toLowerCase(), value); },
    end(value?: string) { this.body = value || ''; },
  };
}

test('user-role listing requires an authenticated administrator', async () => {
  const req = { method: 'GET', url: '/api/admin/users', headers: {} };
  const res = responseRecorder();

  await apiHandler(req as any, res as any);

  assert.equal(res.statusCode, 401);
  assert.match(res.body, /UNAUTHENTICATED/);
});

test('user-role changes cannot be submitted without administrator identity', async () => {
  const req = {
    method: 'PATCH',
    url: '/api/admin/users/target-user',
    headers: {},
    body: { role: 'administrador' },
  };
  const res = responseRecorder();

  await apiHandler(req as any, res as any);

  assert.equal(res.statusCode, 401);
  assert.match(res.body, /UNAUTHENTICATED/);
});
