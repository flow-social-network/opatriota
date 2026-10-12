import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '~/src/lib/db-schema'

const databaseUrl = process.env.NEON_POSTGRES_URL || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
export const pool = new Pool({ connectionString: databaseUrl })
export const db = drizzle(pool, { schema })
