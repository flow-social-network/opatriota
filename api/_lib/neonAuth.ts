import { Pool } from 'pg';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

function resolveConnectionString() {
  const configuredUrl = process.env.opatriota_DATABASE_URL
    || process.env.opatriota_POSTGRES_URL
    || process.env.DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.POSTGRES_PRISMA_URL
    || process.env.POSTGRES_URL_NON_POOLING
    || process.env.DATABASE_URL_UNPOOLED;
  if (configuredUrl) return configuredUrl;

  const host = process.env.PGHOST || process.env.POSTGRES_HOST;
  const user = process.env.PGUSER || process.env.POSTGRES_USER;
  const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
  const database = process.env.PGDATABASE || process.env.POSTGRES_DATABASE;
  if (!host || !user || !password || !database) return undefined;

  const url = new URL('postgresql://localhost');
  url.hostname = host;
  url.username = user;
  url.password = password;
  url.pathname = `/${database}`;
  url.port = process.env.PGPORT || '5432';
  url.searchParams.set('sslmode', 'require');
  return url.toString();
}

function getConnectionLabel() {
  if (process.env.opatriota_DATABASE_URL || process.env.opatriota_POSTGRES_URL) return 'Neon';
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL) return 'Postgres';
  return 'nenhum';
}
let pool: Pool | undefined;

function getPool() {
  const configuredConnectionString = resolveConnectionString();
  if (!configuredConnectionString) throw new Error(`Editorial auth database is not configured (provider: ${getConnectionLabel()})`);
  const connectionUrl = new URL(configuredConnectionString);
  for (const parameter of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) connectionUrl.searchParams.delete(parameter);
  pool ??= new Pool({ connectionString: connectionUrl.toString(), ssl: { rejectUnauthorized: false }, max: 5 });
  return pool;
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, encoded: string) {
  const [, salt, expected] = encoded.split(':');
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export async function ensureAuthSchema() {
  const db = getPool();
  await db.query(`CREATE TABLE IF NOT EXISTS editorial_users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'jornalista',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await db.query(`CREATE TABLE IF NOT EXISTS editorial_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES editorial_users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
}

export async function authenticateEditorialUser(email: string, password: string) {
  await ensureAuthSchema();
  const result = await getPool().query('SELECT id, email, name, password_hash, role FROM editorial_users WHERE lower(email) = lower($1) AND active = TRUE LIMIT 1', [email.trim()]);
  const user = result.rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  const rawToken = randomBytes(32).toString('base64url');
  const tokenHash = scryptSync(rawToken, 'opatriota-session', 32).toString('hex');
  await getPool().query('INSERT INTO editorial_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'12 hours\')', [tokenHash, user.id]);
  return { token: rawToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export async function revokeEditorialSession(token: string) {
  if (!token) return;
  const tokenHash = scryptSync(token, 'opatriota-session', 32).toString('hex');
  await getPool().query('DELETE FROM editorial_sessions WHERE token_hash = $1', [tokenHash]);
}

export async function getEditorialIdentity(token: string) {
  if (!token) return null;
  const tokenHash = scryptSync(token, 'opatriota-session', 32).toString('hex');
  const result = await getPool().query(`SELECT u.id, u.email, u.name, u.role FROM editorial_sessions s JOIN editorial_users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > NOW() AND u.active = TRUE LIMIT 1`, [tokenHash]);
  return result.rows[0] || null;
}

export function passwordHashForProvisioning(password: string) {
  return hashPassword(password);
}

export async function provisionEditorialAdmin(password: string) {
  await ensureAuthSchema();
  const hash = hashPassword(password);
  await getPool().query(`INSERT INTO editorial_users (id, email, name, password_hash, role) VALUES ('admin-master', 'redacao@opatriota.sbs', 'Admin Master', $1, 'administrador') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name, role = EXCLUDED.role, active = TRUE`, [hash]);
}

export function sessionCookie(token: string) {
  return `opatriota_editorial_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=43200`;
}

export function readSessionCookie(cookieHeader: string | undefined) {
  const match = cookieHeader?.match(/(?:^|;\s*)opatriota_editorial_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function editorialUserToSession(user: { id: string; email: string; name: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, subscription: { plan: 'premium' as const, status: 'ativo' as const, autoRenew: true }, bookmarks: [], notificationPrefs: { breakingNews: true, dailyBrief: true, factChecks: true, weeklyDigest: true }, createdAt: new Date().toISOString() };
}
