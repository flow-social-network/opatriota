# Arquitetura completa

## 1. Componentes

```text
Browser
  ├─ Chat e histórico
  ├─ Editor/diff
  ├─ Preview responsivo
  └─ Console de testes
        │ SSE/WebSocket
        ▼
API Gateway
  ├─ Auth/RBAC
  ├─ Project Service
  ├─ Agent Orchestrator
  ├─ Tool Broker
  ├─ Preview Service
  ├─ Git Service
  ├─ Deploy Service
  └─ Integration Service
        │
        ├─ PostgreSQL: usuários, projetos, mensagens, runs, auditoria
        ├─ Object Storage: anexos, logs grandes, snapshots
        ├─ Queue: tarefas e retries
        ├─ Sandbox Runner: processos isolados
        └─ Model Gateway: modelos NVIDIA
```

## 2. Entidades principais

- `users`: identidade e status.
- `memberships`: usuário, projeto, papel e permissões.
- `projects`: nome, repositório, branch e configuração.
- `threads`: conversas por projeto.
- `messages`: prompt, resposta, anexos e referências.
- `agent_runs`: agente, status, modelo, custo, duração e resultado.
- `tool_calls`: ferramenta, argumentos mascarados, aprovação e saída.
- `workspace_snapshots`: commit, arquivos e checksum.
- `previews`: porta, URL, status e expiração.
- `integrations`: provedor, escopos e referência ao segredo.
- `deployments`: ambiente, commit, URL, status e logs.
- `audit_events`: ator, ação, alvo, IP, data e resultado.

## 3. Ciclo de uma solicitação

1. Receber mensagem e anexos.
2. Classificar intenção, risco e escopo.
3. Carregar regras do projeto e contexto mínimo.
4. Criar plano para tarefas que envolvam múltiplos sistemas.
5. Consultar o workspace com ferramentas somente leitura.
6. Gerar patch pequeno e explicável.
7. Pedir aprovação se a política exigir.
8. Aplicar patch com lock otimista.
9. Reiniciar ou atualizar preview.
10. Executar testes estreitos e depois amplos.
11. Abrir navegador automatizado quando houver UI.
12. Corrigir erros novos, sem repetir tentativa improdutiva.
13. Entregar diff, evidências e bloqueios.

## 4. Orquestração

O `Agent Orchestrator` mantém uma máquina de estados: `queued`, `planning`, `executing`, `awaiting_approval`, `validating`, `completed`, `failed` e `cancelled`. Cada run possui timeout, limite de ferramentas, orçamento de tokens e cancelamento.

Agentes especializados:

- `planner`: requisitos, dependências e plano.
- `repository`: leitura, busca e arquitetura existente.
- `frontend`: componentes, responsividade e acessibilidade.
- `backend`: rotas, validação e contratos.
- `database`: schema, queries, migrações e índices.
- `qa`: testes, navegador, regressões e acessibilidade.
- `security`: segredos, SSRF, XSS, CSRF, autorização e dependências.
- `release`: branch, commit, PR, deploy e rollback.

O agente principal delega, mas permanece responsável pelo resultado final.

## 5. Contrato de ferramenta

Toda ferramenta tipada declara `name`, `description`, `inputSchema`, `outputSchema`, `risk`, `requiredApproval`, `timeoutMs` e `allowedScopes`. A saída inclui `status`, `stdout`/resultado sanitizado, `artifacts`, `durationMs` e `auditId`.

Nunca enviar ao modelo conteúdo de segredo, token bruto, cookie ou senha. Limitar tamanho de arquivos e truncar logs com referência recuperável.

## 6. Eventos realtime

Usar SSE para progresso do run e WebSocket quando houver terminal interativo. Eventos: `run.created`, `step.started`, `tool.started`, `tool.output`, `approval.required`, `preview.ready`, `validation.failed`, `run.completed` e `run.failed`. Todos devem ser idempotentes e ter `eventId`.

## 7. Observabilidade

Métricas: tempo até primeiro token, duração do run, falhas por ferramenta, custo por projeto, compilação, preview, deploy, sandbox e taxa de rollback. Logs estruturados não devem conter segredos. Traces devem carregar `projectId`, `threadId`, `runId` e `auditId`.
