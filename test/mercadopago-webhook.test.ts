import test from 'node:test';
import assert from 'node:assert/strict';
import webhookHandler, { matchesApprovedBRLPayment } from '../api/webhooks/mercadopago';

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

test('Mercado Pago webhook rejects invalid signatures before fetching payment data', async () => {
  const previousSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  try {
    process.env.MERCADOPAGO_WEBHOOK_SECRET = 'test-webhook-secret';
    const req = {
      method: 'POST',
      url: '/api/webhooks/mercadopago?data.id=payment-123',
      headers: { 'x-signature': 'ts=12345,v1=00', 'x-request-id': 'request-test' },
      body: { data: { id: 'payment-123' } },
    };
    const res = responseRecorder();

    await webhookHandler(req as any, res as any);

    assert.equal(res.statusCode, 401);
    assert.match(res.body, /INVALID_SIGNATURE/);
  } finally {
    if (previousSecret === undefined) delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
    else process.env.MERCADOPAGO_WEBHOOK_SECRET = previousSecret;
  }
});

test('Mercado Pago webhook fails closed when no signing secret is configured', async () => {
  const previousSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  try {
    delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const req = { method: 'POST', url: '/api/webhooks/mercadopago', headers: {}, body: {} };
    const res = responseRecorder();

    await webhookHandler(req as any, res as any);

    assert.equal(res.statusCode, 503);
    assert.match(res.body, /WEBHOOK_NOT_CONFIGURED/);
  } finally {
    if (previousSecret === undefined) delete process.env.MERCADOPAGO_WEBHOOK_SECRET;
    else process.env.MERCADOPAGO_WEBHOOK_SECRET = previousSecret;
  }
});

test('approved payments must match the expected BRL amount before marking an order paid', () => {
  assert.equal(matchesApprovedBRLPayment({ status: 'approved', transaction_amount: 19.9, currency_id: 'BRL' }, 19.9), true);
  assert.equal(matchesApprovedBRLPayment({ status: 'approved', transaction_amount: 9.9, currency_id: 'BRL' }, 19.9), false);
  assert.equal(matchesApprovedBRLPayment({ status: 'approved', transaction_amount: 19.9, currency_id: 'USD' }, 19.9), false);
  assert.equal(matchesApprovedBRLPayment({ status: 'pending', transaction_amount: 19.9, currency_id: 'BRL' }, 19.9), false);
});
