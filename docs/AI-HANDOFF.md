# Handoff para continuação — O Patriota Brasil

## Estado do Git

- Repositório: `flow-social-network/opatriota` (`origin` configurado para GitHub).
- Branch atual deste worktree: `feature/arquitetura-react-backend`.
- Base: commit `a62387e7ec0117110772ebfa784be538b1f02bba` da `feature/efi-assinaturas`.
- A branch é local, sem upstream e não foi publicada; não há commit novo.
- `main` não foi editada nesta tarefa. O worktree `/workspaces/opatriota` conserva alterações locais anteriores em API/MySQL, Web Push e documentação, além de arquivos locais/documentação ZIP.
- `/workspaces/opatriota-feature` segue na `feature/efi-assinaturas`; o stash `preservar auditoria local antes de sincronizar feature` permanece guardado e **não deve ser aplicado automaticamente** sobre esta branch.

## Arquitetura escolhida

- Frontend principal: React + TypeScript + Vite na raiz. Mantido o comando `build` Vite e o root atual da Vercel.
- Backend: Express + TypeScript em `backend/`, Prisma/PostgreSQL/Neon.
- Worker contínuo: `nucleo-operacional/`, processo separado da API HTTP.
- `backend/` e `nucleo-operacional/` foram formalizados como workspaces pnpm. A aplicação web continua na raiz porque a Vercel de produção está configurada com root `.` e preset Vite; mover para `apps/web` agora quebraria esse contrato. Não foram criadas pastas vazias.
- Go não foi adotado: duplicaria rotas, sessão, RBAC, Prisma e worker sem métrica de carga que justifique nova stack.
- `src/app/` Next permanece scaffold secundário e não é runtime principal. Não foi removido para preservar recursos até a portagem React/Vite ter paridade.
- Projeto Vercel `opatriota`: CLI confirmou root na raiz e framework Vite. A branch de produção não foi exposta pela inspeção CLI e permanece **não confirmada**. Não foi alterado preset, root, domínio, variáveis ou deploy.

## Implementado nesta branch

- `pnpm-workspace.yaml`, manifests da API/worker e scripts root com comandos `pnpm --filter`.
- CI inclui a branch de arquitetura, instala por lockfile frozen e executa teste de segurança do backend e teste do worker.
- Busca pública por título/resumo no Prisma, preservando apenas artigos publicados, filtro por categoria e paginação; `/buscar` envia termo/página à API em vez de filtrar apenas os primeiros 50 registros em memória.
- Worker RSS usa conexão HTTPS com resolução IPv4 pública pinada, revalida redirects, limita redirect count, bytes e tempo. Fontes IPv6-only ficam bloqueadas explicitamente até uma implementação/teste IPv6 seguro.
- Firebase Google no Vite troca o ID token por `/api/auth/firebase`. Firebase Admin verifica assinatura, projeto, revogação, provedor Google e e-mail verificado. Prisma cria usuário novo como `READER`, mantém role existente, bloqueia usuário desativado, grava `RefreshSession` hash-only e `AuditEvent`, e emite cookie HttpOnly. O cliente reutiliza sessão correspondente e logout chama o endpoint de revogação.
- `.env.example` só contém placeholders; opções Mongo/Turso/Blob/Mem0 estão vazias e marcadas como não integradas.
- Matriz de arquitetura, migração WordPress, partição de dados, segurança e critérios de corte: `docs/ARCHITECTURE-DECISION.md`.
- Regras permanentes para outros agentes: `AGENTS.md`.

## Validações executadas

- `pnpm install --frozen-lockfile --ignore-scripts --offline`: passou no pnpm local 12.3.4. CI usa pnpm 10; validar esse binário antes de publicar a branch.
- `pnpm --filter @opatriota/api test`: 1 teste passou; token vazio e Firebase Admin sem configuração falham fechados.
- `pnpm core:test`: 3 testes passaram; IPs especiais, URLs HTTP/credenciais e IP privado literal são bloqueados sem rede.
- `pnpm backend:check`, `pnpm core:check`, `pnpm lint`, `pnpm next:check`: passaram.
- `DATABASE_URL` fictícia + `pnpm db:validate`: schema válido. `pnpm db:generate` executado localmente. Nenhuma conexão/migration foi executada.
- `pnpm build` (Vite): passou; há avisos preexistentes de configuração nativa Vite e bundle acima de 500 kB.
- `pnpm next:build`: passou uma vez como verificação do scaffold não selecionado. Next pode reescrever `next-env.d.ts`; restaurar apenas imports/cache gerados antes de preparar um diff final.
- Não houve login Google real, teste contra PostgreSQL, teste RSS com servidor HTTPS controlado, checkout Efí, upload Blob, envio de e-mail, chamada Mem0/Mongo/Turso, criação de projeto Vercel, deploy, commit ou push.

## Credenciais e segurança

Credenciais Atlas/Turso/Blob/Mem0, banco e tokens foram colados em conversas e estão comprometidos. Revogar/rotacionar em cada console antes de qualquer uso. Não pedir nem receber novos valores pelo chat; configurar valores rotacionados diretamente no secret manager/ambiente privado do serviço. Não copiar segredos para `.env.example`, frontend ou documentação.

O `VITE_ADMIN_EMAILS` continua sendo somente controle visual; a autorização real é role Prisma no backend. Novos Google users recebem `READER`; nenhum privilégio administrativo é concedido pelo e-mail ou navegador.

## Continuação recomendada

1. Configurar credenciais Firebase Admin rotacionadas, Google provider/domínios autorizados e PostgreSQL de homologação; então testar login, sessão expirada, revogação, conta desativada, logout e 401/403.
2. Confirmar CORS, hostname API e política cookie HTTPS/SameSite. Definir `VITE_API_BASE_URL` como origem Express.
3. Integrar primeiro a homepage, artigo, busca, categorias e autores do Vite às rotas reais; a busca Prisma foi iniciada, mas o formulário Vite e outras páginas ainda usam estado/dados locais.
4. Portar formulários/contacto/LGPD/newsletter com modelos, rotas, consentimento, idempotência, rate limiting e e-mail real antes de mostrar confirmação.
5. Implementar catálogo/checkout/webhook Efí transacional em sandbox; não usar os exemplos de plano/valores existentes como catálogo de produção.
6. Ligar workflow editorial Vite às rotas já existentes e completar APIs de fontes, páginas, fact-check e administração; preservar aprovação humana.
7. Escolher um preview Vercel isolado. A branch não foi publicada; solicitar autorização antes de criar/vincular projeto ou mudar settings. Não alterar produção.
8. Só integrar Mongo/Turso/Blob/Mem0 após definir dados proprietários, consistência, ACL, retenção, custo e teste de recuperação. PostgreSQL continua a única fonte de verdade financeira/editorial.
9. Revalidar migrations num banco descartável. O histórico contém migrations incrementais sem baseline comprovada; não executar em produção.

## Limites conhecidos

- O workspace web continua na raiz (não em `apps/web`) por compatibilidade com Vercel. `apps/api` e `apps/worker` também não foram movidos: a organização atual `backend/` e `nucleo-operacional/` foi formalizada como workspace para evitar mudanças de caminho desnecessárias.
- O WordPress permanece em `legacy/wordpress` e `backend/legacy/wordpress-plugin`; nenhum PHP foi removido.
- Páginas de autor/institucional, contacto/LGPD, planos/assinaturas, redação, administração e checagem não têm paridade completa no React/Vite; os stubs Next não são prova de funcionalidade.
- Newsletter, Meta, imagens/blob e Mem0 não têm integração funcional detectada. Mongo e Turso não têm consumidores. Integração oficial programática NotebookLM não foi encontrada.
- Worker não tem garantia de uptime até estar implantado num serviço de processo contínuo com restart policy, readiness/heartbeat monitorados e credenciais. Vercel Functions não substituem esse runtime.