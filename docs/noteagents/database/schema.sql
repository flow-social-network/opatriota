-- Schema inicial do NoteAgents para PostgreSQL.
-- Seguro para repetir: cria apenas objetos ausentes.

create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  workspace_path text not null,
  owner_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null default 'Nova conversa',
  model text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant', 'tool')),
  content text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  agent_name text not null,
  status text not null check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  prompt text not null,
  result jsonb,
  error text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  action text not null,
  risk text not null check (risk in ('low', 'medium', 'high', 'critical')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  requested_by text not null,
  decided_by text,
  reason text not null,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  source text not null,
  title text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_project_idx on conversations(project_id, updated_at desc);
create index if not exists messages_conversation_idx on messages(conversation_id, created_at);
create index if not exists agent_runs_project_idx on agent_runs(project_id, created_at desc);
create index if not exists approvals_pending_idx on approvals(project_id, status) where status = 'pending';
create index if not exists knowledge_documents_project_idx on knowledge_documents(project_id, updated_at desc);
