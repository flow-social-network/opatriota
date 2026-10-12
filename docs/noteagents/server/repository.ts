import { randomUUID } from 'node:crypto'
import type { AgentRun, Project } from './contracts'
import { ensureSchema, query } from './postgres'

export async function getOrCreateLocalProject(): Promise<Project> {
  await ensureSchema()
  const existing = await query<{ id: string; name: string; workspace_path: string; owner_id: string; created_at: string }>('select id, name, workspace_path, owner_id, created_at::text from projects where owner_id = $1 order by created_at asc limit 1', ['local-owner'])
  const row = existing.rows[0]
  if (row) return { id: row.id, name: row.name, root: row.workspace_path, ownerId: row.owner_id, createdAt: row.created_at }
  const project = { id: randomUUID(), name: 'NoteAgents Workspace', root: process.cwd(), ownerId: 'local-owner', createdAt: new Date().toISOString() }
  await query('insert into projects (id, name, workspace_path, owner_id) values ($1, $2, $3, $4)', [project.id, project.name, project.root, project.ownerId])
  return project
}

export async function saveRun(run: AgentRun) {
  await ensureSchema()
  await query('insert into agent_runs (id, project_id, agent_name, status, prompt, error, started_at, finished_at) values ($1, $2, $3, $4, $5, $6, $7, $8) on conflict (id) do update set status = excluded.status, error = excluded.error, started_at = excluded.started_at, finished_at = excluded.finished_at', [run.id, run.projectId, run.agent, run.status, run.prompt, run.error ?? null, run.createdAt, run.updatedAt])
  return run
}

export async function saveMessage(projectId: string, role: 'user' | 'assistant' | 'system' | 'tool', content: string, model: string, attachments: unknown[] = []) {
  await ensureSchema()
  const conversation = await query<{ id: string }>('insert into conversations (project_id, model) values ($1, $2) returning id', [projectId, model])
  await query('insert into messages (conversation_id, role, content, attachments) values ($1, $2, $3, $4::jsonb)', [conversation.rows[0].id, role, content, JSON.stringify(attachments)])
}

export async function listProjects(ownerId = 'local-owner') {
  await ensureSchema()
  const result = await query('select id, name, workspace_path, owner_id, created_at::text, updated_at::text from projects where owner_id = $1 order by updated_at desc', [ownerId])
  return result.rows
}
