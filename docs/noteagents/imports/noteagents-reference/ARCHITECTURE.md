# NoteAgents Architecture

## Overview

NoteAgents is an autonomous engineering agent runtime that orchestrates specialized agents for code review, error fixing, and testing. The system is designed to be provider-agnostic, cache-aware, and concurrency-safe.

## Package Structure

### Packages

| Package | Description |
|---------|-------------|
| `@noteagents/types` | Core type definitions (interfaces, Result pattern, AgentDefinition, AuditFinding, EvidenceRecord, ReadinessScore, OrchestratorConfig) |
| `@noteagents/providers` | LLM provider implementations (NvidiaProvider with native fetch, OpenAI-compatible endpoints) |
| `@noteagents/agents` | Agent definition loader and validator (reads agents/*.json, validates with Zod, returns Result) |
| `@noteagents/orchestration` | Agent runtime (planner/executor, cache, locking, retry, evidence recording) |
| `@noteagents/audit` | Code auditing (secret scanning, TODO/FIXME analysis, file size checks, pnpm audit) |
| `@noteagents/audit` | Code auditing (secret scanning, TODO/FIXME analysis, file size checks, pnpm audit) |

### Apps

| App | Description |
|-----|-------------|
| `noteagents-cli` | Command-line interface for project initialization, audit, status, and agent management |

## Flow

1. **CLI Entry Point** (`noteagents-cli`): User commands (init, audit, status, agents list/run, evidence, test, build, fix)
2. **Agent Loading**: `loadAgents()` reads `agents/*.json`, validates with Zod schema, returns Result
3. **Planner/Executor**: Receives `{ agent, task, dryRun }`, validates agent permissions, checks cache, calls LLM provider
4. **LLM Provider**: NvidiaProvider uses native `fetch` with AbortController timeout, retry on 429/5xx only
5. **Output Validation**: Parses JSON output contract (`status`, `changes`, `tests`, `remaining_errors`)
6. **Cache**: SHA-256 hash of (agent, task, context) → `.noteagents/cache/<hash>.json` with TTL
7. **Locking**: Atomic file creation (`fs.open wx`) for concurrency safety, stale lock detection
8. **Evidence Recording**: `EvidenceRecord` stored in `.noteagents/evidences/`, never stores API keys
9. **Audit**: `executeAudit()` runs secret scanning, TODO/FIXME analysis, file size checks, pnpm audit

## State Management

- **Cache**: `.noteagents/cache/<hash>.json` with configurable TTL
- **Failures**: `.noteagents/failures/<hash>.json` for failed executions
- **Locks**: `.noteagents/locks/<name>.lock` with PID and timestamp, stale detection
- **Evidence**: `.noteagents/evidences/<id>.json` per execution

## Concurrency

- File-based locks via `fs.open(path, 'wx')` (fail if exists)
- Stale lock detection: lock older than configurable timeout is removed
- Atomic file writes: temp file + `rename` (rename is atomic on POSIX)
- No concurrent modification of audit.json, evidences, or cache

## Provider Agnosticism

- `registerProvider(name, provider)` / `getProvider(name)` pattern
- Currently supports: NvidiaProvider (primary)
- Model configuration via `NOTEAGENTS_MODEL` environment variable (no default)
- `listModels()` validates model exists before use

## Error Handling

- All layers return `Result<T, ProviderError>` or `Result<T, AuditError>`
- No exceptions thrown outside of production code
- Timeout via `AbortController`
- Retry only on 429 and 5xx status codes
- No retry on 4xx (including 401, 404, 410)
- Errors mapped: `auth`, `rate_limit`, `model_gone`, `timeout`, `network`, `invalid_response`

## Quick Start

1. `git clone https://github.com/deevo-solucoes-finaceiras/NoteAgents.git`
2. `pnpm install`
3. `pnpm --filter noteagents-cli build`
4. Set `NVIDIA_API_KEY` and `NOTEAGENTS_MODEL` environment variables
5. `node apps/cli/dist/main.js --help`