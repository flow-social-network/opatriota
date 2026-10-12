import test from 'node:test';
import assert from 'node:assert/strict';
import { getDatabaseProvider } from '../api/_lib/storage';

test('production does not silently fall back to the seeded local file store', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousFirebase = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  try {
    process.env.NODE_ENV = 'production';
    delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    delete process.env.DATABASE_URL;

    assert.throws(
      () => getDatabaseProvider(),
      /Database provider is not configured/,
    );
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousFirebase === undefined) delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    else process.env.FIREBASE_SERVICE_ACCOUNT_JSON = previousFirebase;
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
});

test('local development may use the seeded file store when no durable DB is configured', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousFirebase = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  try {
    process.env.NODE_ENV = 'development';
    delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    delete process.env.DATABASE_URL;
    assert.equal(getDatabaseProvider(), 'local_disk');
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousFirebase === undefined) delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    else process.env.FIREBASE_SERVICE_ACCOUNT_JSON = previousFirebase;
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previousDatabaseUrl;
  }
});
