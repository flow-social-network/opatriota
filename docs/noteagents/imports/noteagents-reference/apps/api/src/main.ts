import express from 'express';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createProjectSchema, failure, success, type Project } from '@noteagents/contracts';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, max: 5, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined }) : null;

app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => { const requestId = req.header('x-request-id') ?? randomUUID(); res.locals.requestId = requestId; res.setHeader('x-request-id', requestId); next(); });

async function ensureSchema() {
  if (!pool) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS projects (id uuid PRIMARY KEY, name text NOT NULL, repository text, status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`);
}

app.get('/health', async (_req, res) => {
  try { if (pool) await pool.query('SELECT 1'); res.json(success({ status: 'ok', persistence: Boolean(pool) }, res.locals.requestId)); }
  catch { res.status(503).json(failure('DATABASE_UNAVAILABLE', 'Banco de dados indisponível', res.locals.requestId)); }
});

app.get('/projects', async (_req, res) => {
  try {
    if (!pool) return res.json(success([], res.locals.requestId));
    const { rows } = await pool.query('SELECT id, name, repository, status, created_at AS "createdAt", updated_at AS "updatedAt" FROM projects WHERE status = $1 ORDER BY created_at DESC', ['active']);
    return res.json(success(rows as Project[], res.locals.requestId));
  } catch { return res.status(500).json(failure('PROJECTS_READ_FAILED', 'Não foi possível carregar projetos', res.locals.requestId)); }
});

app.post('/projects', async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(failure('VALIDATION_ERROR', parsed.error.issues.map((issue) => issue.message).join(', '), res.locals.requestId));
  if (!pool) return res.status(503).json(failure('PERSISTENCE_NOT_CONFIGURED', 'Persistência não configurada', res.locals.requestId));
  try {
    const id = randomUUID();
    const { rows } = await pool.query('INSERT INTO projects (id, name, repository) VALUES ($1, $2, $3) RETURNING id, name, repository, status, created_at AS "createdAt", updated_at AS "updatedAt"', [id, parsed.data.name, parsed.data.repository ?? null]);
    return res.status(201).json(success(rows[0] as Project, res.locals.requestId));
  } catch { return res.status(500).json(failure('PROJECT_CREATE_FAILED', 'Não foi possível criar projeto', res.locals.requestId)); }
});

app.use((_req, res) => res.status(404).json(failure('NOT_FOUND', 'Rota não encontrada', res.locals.requestId)));

ensureSchema().then(() => app.listen(port, () => console.log(`[api] listening on ${port}`))).catch((error) => { console.error('[api] schema initialization failed', error); process.exit(1); });
