# Instruções para agentes — O Patriota Brasil

## Segurança do repositório

- Trabalhe somente em `feature/arquitetura-react-backend` neste worktree. Não altere, faça merge ou push para `main`.
- Não faça deploy, não altere projeto/domínio/settings da Vercel e não aplique migrations em produção.
- Preserve mudanças existentes; não use `git reset --hard`, `git clean -fd` ou force push.
- Não leia, copie, imprima ou registre valores de `.env`. Credenciais que foram coladas em conversa devem ser rotacionadas; use placeholders vazios nos exemplos.
- Arquivos de ambiente e tokens nunca podem entrar no Git, no browser, em logs ou em relatórios.

## Limites arquiteturais

- Frontend principal: React + TypeScript + Vite na raiz por compatibilidade com o projeto Vercel atual. Não trocar root/build/framework de produção sem autorização.
- API única: Express + TypeScript em `backend/`; persistência transacional PostgreSQL/Prisma. O worker `nucleo-operacional/` é processo separado.
- Next App Router é scaffold de avaliação, não runtime principal nem segunda API. Não criar telas/serviços duplicados sem decisão documentada.
- `backend/legacy/wordpress-plugin` e `legacy/wordpress` são cópias de referência. Não executar PHP no Node, remover ou mover legado antes de paridade comprovada.
- PostgreSQL permanece fonte de verdade para usuários, permissões, conteúdo, workflow, pagamentos, auditoria e tarefas. Mongo/Turso/Blob/Mem0 só entram com proprietário de dados, adapter, ACL, retenção e testes definidos; nunca fazer dual-write de pagamentos/roles.
- Não confiar em role, user ID ou autorização enviados pelo browser. O servidor valida sessão e consulta permissões persistidas.
- IA pode pesquisar e preparar rascunhos, mas nunca aprova/publica conteúdo editorial. Fails fechados não podem virar sucesso visual.

## Desenvolvimento e validação

- Use os workspaces existentes `@opatriota/api` e `@opatriota/worker`; o projeto raiz é o frontend Vite. Não crie diretórios/pacotes vazios.
- Antes de editar, verifique branch, status e arquivos atuais. Antes de concluir, execute os testes/typechecks/build pertinentes e relate dependências externas não testadas.
- Testes sem banco usam valores locais fictícios somente para validação de schema; não conecte banco de produção.
- Não declare login, pagamentos, envio, armazenamento ou execução contínua operacionais sem teste real autorizado.