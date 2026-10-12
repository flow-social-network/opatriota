# Changelog

All notable changes to NoteAgents will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-05

### Added
- **ETAPA 0**: Base repository setup (LICENSE, .env.example, SECURITY.md, CONTRIBUTING.md, CI workflow, CLI with init/doctor/status/audit commands)
- **ETAPA 1**: Contratos únicos - transformed `packages/types` into `@noteagents/types` workspace package with unified type definitions (Result, ProjectAnalysis, AgentDefinition, AuditFinding, EvidenceRecord, ReadinessScore, OrchestratorConfig, StateManagerState); CLI now consumes `@noteagents/types` via `workspace:*`
- **ETAPA 2**: Provider de LLM - implemented `NvidiaProvider` with native `fetch`, OpenAI-compatible endpoint (`https://integrate.api.nvidia.com/v1/chat/completions`), environment variables `NVIDIA_API_KEY` and `NOTEAGENTS_MODEL` (mandatory, no fixed default), mandatory error handling with `AbortController` timeout, exponential backoff retry only for 429 and 5xx, no retry for 4xx (including 401, 404, 410), `ProviderError` type (`auth`, `rate_limit`, `model_gone`, `timeout`, `network`, `invalid_response`), `listModels()` for model validation, provider registry (`registerProvider`, `getProvider`)
- **ETAPA 3**: Definições de agentes - created `agents/` folder with 3 initial agents (reviewer, error-fixer, testing), each with `agent.json` (following `AgentDefinition` contract) and `system.md` (system prompt); `packages/agents` with `loadAgents()` that validates with Zod, returns `Result`, error messages cite file and invalid field; output contract parser with `{ status, changes, tests, remaining_errors }`
- **ETAPA 4**: Agent Runtime - `packages/orchestration` with `AgentRuntime` class (planner/executor pattern with `{agent, task, dryRun}`, permission checking against `forbidden_tasks`/`allowed_tasks`, cache with SHA-256 keys and TTL, file-based locking via `fs.open wx` with stale detection, atomic file writes, `EvidenceRecord` recording, `maxAttempts` and `timeoutMs` from `OrchestratorConfig`); retry limited by config; final failure writes to `.noteagents/failures/`; cache hit avoids new LLM call; concurrency safety for simultaneous processes
- **ETAPA 5**: Comandos da CLI - added `noteagents agents list`, `noteagents agents run <nome> --task "<texto>" [--apply] [--no-cache]`, `noteagents evidence [--id <id>]`, `noteagents test` and `noteagents build` (record EvidenceRecord type test/build), `noteagents fix` (activates error-fixer agent with last registered failure, dry-run by default); each command has tests; `--help` lists all commands; `agents list` shows 3 agents; test/build record real evidence in example project
- **ETAPA 6**: Auditoria v2 - new audit rules: secret scanning by regex (API keys, tokens, private keys) ignoring `.env.example` and test fixtures; file size limits; TODO/FIXME excess analysis; `pnpm audit --json` when available (network failure = "not evaluated", never "no issues"); new categories in readiness only gain rules that evaluate them; honest report prints how many rules ran and which were skipped; each new rule has positive and negative tests; secrets scan ignores `.env.example` and test fixtures; running audit on project fixture with false secret generates finding; no false positives in own repository
- **ETAPA 7**: Documentação e roadmap honestos - created `ARCHITECTURE.md` (packages, flow, state/cache/evidence locations, concurrency model, provider agnosticism, error handling); created `CHANGELOG.md`; synchronized `README`: roadmap `[x]` only where code and test exist; `[~]` for partial; Quick Start executable step-by-step (clone, install, build, run); each Quick Start command verified in clean clone; removed unverified claims from `docs/hackathon/hackathon-prep.md` and integration docs; updated CI to run typecheck, build and tests of all packages with code
- **ETAPA 8**: Pacote de submissão - created `docs/submission/README.md` with problema, solução, diferencial (evidência + auditoria + readiness acima de ferramentas existentes), o que funciona hoje e o que é roadmap, como rodar; honest comparison table with OpenHands (MIT; sandbox, estado com replay, políticas de confirmação, sub-agentes, 100+ LLMs) and Stoneforge (MIT; orquestração paralela, git worktrees, fila de merge); demo roteiro (3-5 min) with real commands and outputs; known risks list and submission phase chronology; no Solana/Circle as functionality (no code/test)

### Fixed
- Fixed TypeScript config to use `main.ts/**/*` instead of `src/**/*`
- Fixed CLI build to produce `dist/main.js` executable
- Fixed `.env.example` with `NVIDIA_API_KEY` and `NOTEAGENTS_MODEL`
- Fixed `.gitignore` to liberate `.env.example`
- Fixed provider error mapping (410 → `model_gone`, 429 → `rate_limit` with retry, 4xx no retry)
- Fixed concurrency lock mechanism with stale detection
- Fixed cache mechanism (never cache failure responses)

### Changed
- Updated `tsconfig.json` module settings for CommonJS output
- Updated package imports and workspace dependencies
- Improved error messages with file/field context

### Deprecated
- Relative imports without `.js` extension (AGENTS.md mandates `.js` extension for NodeNext ESM)

### Security
- Never log `NVIDIA_API_KEY` or `NOTEAGENTS_MODEL`
- `.env*` ignored by git, `.env.example` committed as template
- Secret scanning detects and reports hardcoded credentials

## Unreleased
- Future enhancements planned for subsequent phases