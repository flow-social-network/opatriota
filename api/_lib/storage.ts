import type { Pool } from 'mysql2/promise';
import { firestoreDelete, firestoreGet, firestoreList, firestoreWrite } from './billing';

export type DatabaseProvider = 'firestore' | 'mysql';

let mysqlPool: Promise<Pool> | undefined;

export function getDatabaseProvider(): DatabaseProvider {
  const provider = (process.env.DATABASE_PROVIDER || 'firestore').trim().toLowerCase();
  if (provider === 'firestore' || provider === 'mysql') return provider;
  throw new Error('DATABASE_PROVIDER must be either firestore or mysql');
}

async function getMysqlPool(): Promise<Pool> {
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

function decodeJsonObject(value: unknown): Record<string, any> {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed as Record<string, any>
    : {};
}

export async function documentGet(collection: string, documentId: string): Promise<any | null> {
  if (getDatabaseProvider() === 'firestore') return firestoreGet(collection, documentId);

  const pool = await getMysqlPool();
  const [rows] = await pool.execute(
    'SELECT document_id, data FROM opatriota_documents WHERE collection_name = ? AND document_id = ?',
    [collection, documentId],
  );
  const row = (rows as Array<{ document_id: string; data: unknown }>)[0];
  return row ? { id: row.document_id, ...decodeJsonObject(row.data) } : null;
}

export async function documentWrite(
  collection: string,
  documentId: string,
  fields: Record<string, unknown>,
  merge = true,
): Promise<void> {
  if (getDatabaseProvider() === 'firestore') return firestoreWrite(collection, documentId, fields, merge);

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
}

export async function documentList(collection: string): Promise<any[]> {
  if (getDatabaseProvider() === 'firestore') return firestoreList(collection);

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

export async function documentDelete(collection: string, documentId: string): Promise<void> {
  if (getDatabaseProvider() === 'firestore') return firestoreDelete(collection, documentId);

  const pool = await getMysqlPool();
  await pool.execute(
    'DELETE FROM opatriota_documents WHERE collection_name = ? AND document_id = ?',
    [collection, documentId],
  );
}