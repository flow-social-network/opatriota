import test from 'node:test';
import assert from 'node:assert/strict';
import { subscriptionExpiry } from '../api/[...path]';
import { addBillingCycle } from '../api/webhooks/mercadopago';

test('monthly expiry clamps the last day instead of overflowing into the next month', () => {
  assert.equal(subscriptionExpiry('2026-01-31T12:00:00.000Z', 'monthly'), Date.parse('2026-02-28T12:00:00.000Z'));
  assert.equal(subscriptionExpiry('2028-01-31T12:00:00.000Z', 'monthly'), Date.parse('2028-02-29T12:00:00.000Z'));
  assert.equal(addBillingCycle('2026-01-31T12:00:00.000Z', 'monthly'), '2026-02-28T12:00:00.000Z');
  assert.equal(addBillingCycle('2028-01-31T12:00:00.000Z', 'monthly'), '2028-02-29T12:00:00.000Z');
});

test('annual expiry handles leap-day activation consistently', () => {
  assert.equal(subscriptionExpiry('2024-02-29T12:00:00.000Z', 'annual'), Date.parse('2025-02-28T12:00:00.000Z'));
  assert.equal(addBillingCycle('2024-02-29T12:00:00.000Z', 'annual'), '2025-02-28T12:00:00.000Z');
});
