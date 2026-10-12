# NoteAgents

<p align="center">
  <strong>Autonomous Engineering Agent Runtime</strong><br/>
  <em>Build faster. Understand everything. Fix automatically. Verify continuously.</em>
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-active%20development-0B5FFF?style=for-the-badge">
  <img alt="Open Source" src="https://img.shields.io/badge/open--source-yes-06B6D4?style=for-the-badge">
  <img alt="CLI-First" src="https://img.shields.io/badge/CLI-First-0B5FFF?style=for-the-badge">
  <img alt="Provider-Agnostic" src="https://img.shields.io/badge/Provider-Agnostic-2563EB?style=for-the-badge">
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-06B6D4?style=for-the-badge">
</p>

<p align="center">
  <a href="#-visão-geral">Visão geral</a> •
  <a href="#-o-problema">Problema</a> •
  <a href="#-como-funciona">Como funciona</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#recursos">Recursos</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contribuindo">Contribuindo</a>
</p>

---

## 🧭 Visão geral

**NoteAgents** is an autonomous engineering agent runtime that orchestrates specialized agents for code review, error fixing, and testing. It works **above** existing tools (GitHub, Vercel, OpenCode, MCP, LSP, databases, CI/CD) by connecting signals from the environment, code, infrastructure, execution, tests, observability, and project knowledge to transform them into:

- 🧠 context
- 🔎 audit
- 🛠️ actions
- 🧪 validations
- 📊 insights
- 📚 knowledge
- ✅ evidences
- 🚦 readiness assessment
- ♻️ continuous evolution

> **The AI writes and executes. NoteAgents coordinates, observes, audits, verifies, and helps evolve.**

---

## 🎯 The thesis

AI makes it possible to produce software much faster.

The problem is that **producing code got faster than verifying if the software is actually correct, secure, organized, tested, and ready for real users**.

A project may compile and still have:
- Inconsistent architecture
- Inappropriate dependencies
- Broken imports
- Giant components
- Missing tests

NoteAgents solves this by providing continuous analysis and verification through:
- **Audit**: security secrets, file sizes, TODO/FIXME excess, dependency health
- **Readiness**: readiness scoring across categories
- **Agents**: specialized reviewers, fixers, and testers
- **Evidence**: recorded execution evidence without API keys
- **Cache**: SHA-256-keyed cache with TTL to avoid redundant calls

---

## 📦 Pacotes (Packages)

| Pacote | Descrição |
|--------|-----------|
| `@noteagents/types` | Definições de tipo core (Result, AgentDefinition, AuditFinding, EvidenceRecord, ReadinessScore, OrchestratorConfig) |
| `@noteagents/providers` | Implementações de provedores LLM (NvidiaProvider com fetch nativo) |
| `@noteagents/agents` | Carregador e validador de definições de agentes (ler agents/*.json, validar com Zod) |
| `@noteagents/orchestration` | Tempo de execução de agentes (planejador/executor, cache, lock, retry, evidências) |
| `@noteagents/audit` | Auditoria de código (varredura de segredos, TODO/FIXME, tamanho de arquivos, pnpm audit) |

## 🛠️ Recursos

- **LLM Provider**: NvidiaProvider com endpoint compatível OpenAI, `fetch` nativo, `AbortController` timeout, retry only on 429/5xx, sem retry para 4xx
- **Agent Runtime**: planner/executor pattern, permissões, cache com TTL, locks arquivos(atômicos), EvidenceRecord
- **Auditoria v2**: varredura de segredos por regex (ignorando `.env.example` e fixtures), limite de tamanho de arquivos, excesso de TODO/FIXME, `pnpm audit --json` (falha de rede = "não avaliado")
- **CLI**: `noteagents agents list`, `noteagents agents run <nome> --task "<texto>" [--apply] [--no-cache]`, `noteagents evidence`, `noteagents test`, `noteagents build`, `noteagents fix`
- **Concorrência**: locks por escrita via `fs.open wx`, detecção de lock velho, escrita atômica (temp + rename)
- **Provider Agnóstico**: `registerProvider`, `getProvider(pattern)`; modelo via `NOTEAGENTS_MODEL` (obrigatório, sem valor fixo)
- **Evidência**: `EvidenceRecord` por execução, nunca grava chave de API
- **Cache**: chave = SHA-256 de (agente, tarefa, contexto); armazenamento em `.noteagents/cache/<hash>.json` com TTL configurável; flag `--no-cache`; nunca cachear respostas de falha

## 📋 Roadmap

| Status | Item | O que está implementado |
|--------|------|------------------------|
| [x] | ETAPA 0 - Base do repositório | LICENSE, .env.example, SECURITY.md, CONTRIBUTING.md, CI, CLI mínima (init, doctor, status, audit) |
| [x] | ETAPA 1 - Contratos únicos | `@noteagents/types` pacote único; tipos eliminados da CLI; typecheck, build e 10 testes passam |
| [x] | ETAPA 2 - Provider de LLM | `NvidiaProvider` com `fetch` nativo; `NVIDIA_API_KEY` e `NOTEAGENTS_MODEL` (obrigatório); erro handler com timeout, retry 429/5xx somente; `listModels()` |
| [x] | ETAPA 3 - Definições de agentes | `agents/` com reviewer, error-fixer, testing; `system.md` com prompt; `loadAgents()` valida com Zod |
| [x] | ETAPA 4 - Agent Runtime | `packages/orchestration`; planner/executor; permissões; cache SHA-256; locks `fs.open wx`; retry por `maxAttempts`; EvidenceRecord; concorrência segura |
| [x] | ETAPA 5 - Comandos da CLI | `agents list`, `agents run`, `evidence`, `test`, `build`, `fix`; todos com `--json` e códigos de saída (0 ok, 1 regra/portão, 2 uso) |
| [x] | ETAPA 6 - Auditoria v2 | Varredura de segredos (ignorando `.env.example`/testes); limite de arquivo; TODO/FIXME; `pnpm audit --json`; regras com testes positivo/negativo; readiness só ganha categoria nova quando regra avaliar |
| [x] | ETAPA 7 - Documentação honesta | `ARCHITECTURE.md` e `CHANGELOG.md` criados; README sincronizado: `[x]` só onde há código e teste; `[~]` para parcial; Quick Start validado em clone limpo; remoção de afirmas não verificadas de docs/hackathon |
| [x] | ETAPA 8 - Pacote de submissão | `docs/submission/README.md` com problema, solução, diferencial, comparativo com OpenHands e Stoneforge; roteiro de demo 3-5 min; riscos conhecidos; sem Solana/Circle como funcionalidade |

> **Legend**: `[x]` = implementado com código e teste; `[~]` = parcial/em andamento; `[ ]` = planejado

## 🚀 Quick Start

Execute cada passo em um diretório limpo e confirme que funciona:

### 1. Clonar o repositório

```bash
git clone https://github.com/deevo-solucoes-finaceiras/NoteAgents.git
cd NoteAgents
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Construir a CLI

```bash
pnpm --filter noteagents-cli build
```

### 4. Definir variáveis de ambiente

```bash
export NVIDIA_API_KEY=sua_chave_aqui
export NOTEAGENTS_MODEL=seu_modelo_aqui
```

### 5. Verificar help

```bash
node apps/cli/dist/main.js --help
```

Saída esperada:
```
Usage: noteagents [options] [command]

Autonomous Engineering Agent Runtime

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  init [options]     Initialize the runtime and analyze project
  doctor [options]   Audit the environment
  status [options]   Show project status
  audit [options]    Run project audit
  analyze [options]  Analyze project structure
  readiness [options]  Check project readiness
  agents list        List registered agents
  agents run <name> --task "<text>" [--apply] [--no-cache]
  evidence [--id <id>] (lista/mostra evidências)
  test (executa testes e grava evidência)
  build (build do projeto e grava evidência)
  fix (aciona error-fixer com última falha registrada; dry-run por padrão)
  help [command]     display help for command
```

### 6. Listar agentes

```bash
node apps/cli/dist/main.js agents list
```

### 7. Executar um agente (dry-run)

```bash
node apps/cli/dist/main.js agents run reviewer --task "Review this code: function add(a, b) { return a + b }"
```

Saída esperada (sucesso):
```
Agent: reviewer
Status: SUCCESS
Changes: ["Identified missing JSDoc", "Suggested test for edge cases"]
Tests: ["Add unit test for add function"]
Remaining errors: []
```

Saída esperada (falha - agente não encontrado):
```
Agent "nonexistent" not found.
Available agents:
  - reviewer
  - error-fixer
  - testing
```

### 8. Executar auditoria

```bash
node apps/cli/dist/main.js audit -p .
```

### 9. Verificar readiness

```bash
node apps/cli/dist/main.js readiness -p .
```

## 📄 License

MIT - Copyright (c) 2026 NoteAgents

## 📂 Estrutura relevante

- `apps/cli/` - CLI de comando único
- `packages/types/` - Tipos centralizados
- `packages/providers/` - Provedores LLM
- `packages/agents/` - Definições e carregamento de agentes
- `packages/orchestration/` - Tempo de execução
- `packages/audit/` - Regras de auditoria
- `agents/` - Agentes autônomos (reviewer, error-fixer, testing)
- `.noteagents/` - Estado, cache, evidências e falhas