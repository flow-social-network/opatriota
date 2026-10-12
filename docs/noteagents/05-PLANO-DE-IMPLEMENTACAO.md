# Plano de implementação

## Fase 1 — Fundação

- monorepo TypeScript;
- autenticação e RBAC;
- PostgreSQL com migrations;
- projetos, threads, mensagens e auditoria;
- cofre de segredos;
- API com SSE;
- UI de chat e lista de projetos.

## Fase 2 — Workspace

- clone Git;
- filesystem e diff;
- editor;
- snapshots;
- sandbox runner;
- terminal limitado;
- instalação de dependências;
- logs em tempo real.

## Fase 3 — Preview

- lifecycle de dev server;
- detecção de porta;
- proxy seguro;
- viewport responsivo;
- screenshot;
- console browser;
- envio de erros ao run.

## Fase 4 — Agentes

- planner;
- repository analyst;
- frontend/backend/database;
- tool broker tipado;
- contexto seletivo;
- aprovação humana;
- cancelamento, retry e orçamento.

## Fase 5 — Validação e release

- lint/typecheck/test/build;
- browser automation;
- Git branch/commit/PR;
- Vercel preview;
- smoke tests;
- produção aprovada;
- rollback.

## Fase 6 — Escala

- fila durável;
- workers horizontais;
- cache de dependências;
- limites por plano;
- observabilidade;
- backups e disaster recovery;
- marketplace de integrações.

## Definition of Done

Uma entrega deve ter implementação, tratamento de erro, autorização, testes, validação real, logs úteis, documentação, auditoria e rollback. Nenhuma tarefa fica concluída apenas porque o código compila.

## Ordem de decisão

Quando houver dúvida, priorizar: segurança, integridade dos dados, comportamento existente, acessibilidade, simplicidade operacional, custo e somente depois otimização.

## MVP recomendado

Comece com um único projeto por usuário, email/senha, chat com modelo NVIDIA, leitura/edição de arquivos, preview Vite/Next, testes, branch Git e deploy preview. Não comece com dezenas de integrações, execução privilegiada ou deploy automático de produção.
