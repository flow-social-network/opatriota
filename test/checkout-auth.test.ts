import test from 'node:test';
import assert from 'node:assert/strict';
import checkoutHandler from '../api/checkout';

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

test('subscription checkout refuses guest purchases before creating an order', async () => {
  const req = {
    method: 'POST',
    headers: {},
    body: { planId: 'digital', cycle: 'monthly', paymentMethod: 'pix', name: 'Visitante', email: 'visitor@example.com' },
  };
  const res = responseRecorder();

  await checkoutHandler(req as any, res as any);

  assert.equal(res.statusCode, 401);
  assert.match(res.body, /UNAUTHENTICATED/);
});
