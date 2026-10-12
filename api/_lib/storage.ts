import type { Pool as MysqlPool } from 'mysql2/promise';
import type { Pool as PostgresPool } from 'pg';
import { firestoreDelete, firestoreGet, firestoreList, firestoreWrite } from './billing';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getInitialSeedData } from './seedData';

export type DatabaseProvider = 'firestore' | 'postgres' | 'mysql' | 'local_disk';

let mysqlPool: Promise<MysqlPool> | undefined;
let postgresPool: Promise<PostgresPool> | undefined;

const DATA_DIR = join(process.cwd(), '.data');
const DATA_FILE = join(DATA_DIR, 'store.json');

function getLocalStore(): Record<string, Record<string, any>> {
  if (!existsSync(DATA_DIR)) {
    try { mkdirSync(DATA_DIR, { recursive: true }); } catch { /* ignore */ }
  }
  if (!existsSync(DATA_FILE)) {
    const initial = getInitialSeedData();
    try { writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8'); } catch { /* ignore */ }
    return initial;
  }
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return getInitialSeedData();
  }
}

function saveLocalStore(store: Record<string, Record<string, any>>): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to local store file:', err);
  }
}

export function getDatabaseProvider(): DatabaseProvider {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return 'firestore';
  const databaseUrl = process.env.DATABASE_URL || '';
  if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) return 'postgres';
  if (databaseUrl.startsWith('mysql://') || databaseUrl.startsWith('mysql2://')) return 'mysql';
  return 'local_disk';
}

async function getMysqlPool(): Promise<MysqlPool> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required when DATABASE_PROVIDER=mysql');

  if (!mysqlPool) {
    mysqlPool = (async () => {
      const url = new URL(connectionString);
      if (url.protocol !== 'mysql:' && url.protocol !== 'mysql2:') {
        throw new Error('DATABASE_URL must use the mysql:// scheme');
      }
      const { createPool } = await import('mysql2/promise');
      return createPool({
        host: url.hostname,
        port: Number(url.port || 3306),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: decodeURIComponent(url.pathname.slice(1)),
        waitForConnections: true,
        connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 5),
        ssl: url.searchParams.get('ssl') === 'true' ? { rejectUnauthorized: true } : undefined,
      });
    })().catch((error) => {
      mysqlPool = undefined;
      throw error;
    });
  }

  return mysqlPool;
}

function getPostgresConnectionUrls(): string[] {
  return [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  ].filter((value, index, urls): value is string => Boolean(value) && urls.indexOf(value) === index);
}

async function getPostgresPool(): Promise<PostgresPool> {
  const connectionUrls = getPostgresConnectionUrls();
  if (!connectionUrls.length) throw new Error('DATABASE_URL or POSTGRES_URL is required when DATABASE_PROVIDER=postgres');
  if (!postgresPool) {
    postgresPool = (async () => {
      const { Pool } = await import('pg');
      let lastError: unknown;

      for (const connectionString of connectionUrls) {
        const candidate = new Pool({ connectionString, max: Number(process.env.POSTGRES_POOL_MAX || 10) });
        try {
          const client = await candidate.connect();
          client.release();
          return candidate;
        } catch (error) {
          lastError = error;
          await candidate.end().catch(() => undefined);
        }
      }

      throw lastError instanceof Error ? lastError : new Error('Nenhuma conexão PostgreSQL disponível');
    })().catch((error) => {
      postgresPool = undefined;
      throw error;
    });
  }
  return postgresPool;
}

function decodeJsonObject(value: unknown): Record<string, any> {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as Record<string, any>)
    : {};
}

async function postgresGet(collection: string, documentId: string) {
  const pool = await getPostgresPool();
  const result = await pool.query('SELECT document_id, data FROM public.opatriota_documents WHERE collection_name = $1 AND document_id = $2', [collection, documentId]);
  const row = result.rows[0];
  return row ? { id: row.document_id, ...decodeJsonObject(row.data) } : null;
}

async function postgresWrite(collection: string, documentId: string, fields: Record<string, unknown>, merge: boolean) {
  const pool = await getPostgresPool();
  await pool.query(
    `INSERT INTO public.opatriota_documents (collection_name, document_id, data)
     VALUES ($1, $2, $3::jsonb)
     ON CONFLICT (collection_name, document_id) DO UPDATE
     SET data = ${merge ? 'public.opatriota_documents.data || EXCLUDED.data' : 'EXCLUDED.data'}, updated_at = CURRENT_TIMESTAMP`,
    [collection, documentId, JSON.stringify(fields)],
  );
}

async function postgresList(collection: string) {
  const pool = await getPostgresPool();
  const result = await pool.query('SELECT document_id, data FROM public.opatriota_documents WHERE collection_name = $1 ORDER BY updated_at DESC', [collection]);
  return result.rows.map((row) => ({ id: row.document_id, ...decodeJsonObject(row.data) }));
}

async function postgresDelete(collection: string, documentId: string) {
  const pool = await getPostgresPool();
  await pool.query('DELETE FROM public.opatriota_documents WHERE collection_name = $1 AND document_id = $2', [collection, documentId]);
}

export async function documentGet(collection: string, documentId: string): Promise<any | null> {
  const provider = getDatabaseProvider();
  if (provider === 'firestore') return firestoreGet(collection, documentId);
  if (provider === 'postgres') return postgresGet(collection, documentId);

  if (provider === 'mysql') {
    const pool = await getMysqlPool();
    const [rows] = await pool.execute(
      'SELECT document_id, data FROM opatriota_documents WHERE collection_name = ? AND document_id = ?',
      [collection, documentId],
    );
    const row = (rows as Array<{ document_id: string; data: unknown }>)[0];
    return row ? { id: row.document_id, ...decodeJsonObject(row.data) } : null;
  }

  // local_disk provider
  const store = getLocalStore();
  const doc = store[collection]?.[documentId];
  return doc ? { id: documentId, ...doc } : null;
}

export async function documentWrite(
  collection: string,
  documentId: string,
  fields: Record<string, unknown>,
  merge = true,
): Promise<void> {
  const provider = getDatabaseProvider();
  if (provider === 'firestore') return firestoreWrite(collection, documentId, fields, merge);
  if (provider === 'postgres') return postgresWrite(collection, documentId, fields, merge);

  if (provider === 'mysql') {
    if (collection.length > 100 || documentId.length > 191) {
      throw new Error('Document collection or ID exceeds the MySQL storage limit');
    }

    const pool = await getMysqlPool();
    const entries = Object.entries(fields);
    const updateExpression = merge && entries.length
      ? `JSON_SET(data, ${entries.map(() => '?, CAST(? AS JSON)').join(', ')})`
      : 'VALUES(data)';
    const mergeValues = merge
      ? entries.flatMap(([key, value]) => ['$.' + JSON.stringify(key), JSON.stringify(value)])
      : [];

    await pool.execute(
      `INSERT INTO opatriota_documents (collection_name, document_id, data)
       VALUES (?, ?, CAST(? AS JSON))
       ON DUPLICATE KEY UPDATE data = ${updateExpression}, updated_at = CURRENT_TIMESTAMP`,
      [collection, documentId, JSON.stringify(fields), ...mergeValues],
    );
    return;
  }

  // local_disk provider
  const store = getLocalStore();
  if (!store[collection]) store[collection] = {};
  if (merge && store[collection][documentId]) {
    store[collection][documentId] = { ...store[collection][documentId], ...fields, id: documentId };
  } else {
    store[collection][documentId] = { ...fields, id: documentId };
  }
  saveLocalStore(store);
}

export async function documentList(collection: string): Promise<any[]> {
  const provider = getDatabaseProvider();
  if (provider === 'firestore') return firestoreList(collection);
  if (provider === 'postgres') return postgresList(collection);

  if (provider === 'mysql') {
    const pool = await getMysqlPool();
    const [rows] = await pool.execute(
      'SELECT document_id, data FROM opatriota_documents WHERE collection_name = ?',
      [collection],
    );
    return (rows as Array<{ document_id: string; data: unknown }>).map((row) => ({
      id: row.document_id,
      ...decodeJsonObject(row.data),
    }));
  }

  // local_disk provider
  const store = getLocalStore();
  const items = Object.values(store[collection] || {});
  return items.map((doc: any) => ({ ...doc, id: doc.id || String(doc.document_id) }));
}

export async function documentDelete(collection: string, documentId: string): Promise<void> {
  const provider = getDatabaseProvider();
  if (provider === 'firestore') return firestoreDelete(collection, documentId);
  if (provider === 'postgres') return postgresDelete(collection, documentId);

  if (provider === 'mysql') {
    const pool = await getMysqlPool();
    await pool.execute(
      'DELETE FROM opatriota_documents WHERE collection_name = ? AND document_id = ?',
      [collection, documentId],
    );
    return;
  }

  // local_disk provider
  const store = getLocalStore();
  if (store[collection] && store[collection][documentId]) {
    delete store[collection][documentId];
    saveLocalStore(store);
  }
}
