import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool, type QueryResultRow } from 'pg'

const here = dirname(fileURLToPath(import.meta.url))
const schemaPath = resolve(here, '../database/schema.sql')

let pool: Pool | undefined
let schemaReady: Promise<void> | undefined

export function getPool() {
  if (pool) return pool
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!connectionString) throw new Error('DATABASE_URL_REQUIRED')
  pool = new Pool({ connectionString, max: Number(process.env.NOTEAGENTS_DB_POOL_SIZE || 5), ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined })
  return pool
}

export function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  return getPool().query<T>(text, params)
}

export async function ensureSchema() {
  if (!schemaReady) schemaReady = readFile(schemaPath, 'utf8').then(sql => getPool().query(sql)).then(() => undefined)
  return schemaReady
}

export async function closeDatabase() {
  if (pool) await pool.end()
  pool = undefined
  schemaReady = undefined
}

export async function databaseHealth() {
  await ensureSchema()
  const result = await query<{ now: string }>('select now()::text as now')
  return { connected: true, serverTime: result.rows[0]?.now }
}
