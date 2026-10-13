# Relatório de QA — O PATRIOTA

## Commit testado

`64693fc43a465d1b02dec9443827bedd6530ddee` — painel administrativo/editorial com cabeçalho e menu fixos.

## Comandos executados

- `pnpm test` — **PASSED**: contrato do cabeçalho desktop/mobile, faixa financeira e offset.
- `pnpm test:qa:navigation` — **BLOCKED**: Playwright instalado, mas o Chromium do ambiente não inicia por dependência nativa ausente (`libnspr4.so`). Não foi marcado como aprovado.
- `pnpm exec playwright install chromium` — **PASSED**: navegador baixado; execução continua bloqueada pela biblioteca do sistema.
- `tsc --noEmit`, `vite build`, `git diff --check` — **PASSED** na validação anterior do shell.
- Verificação HTTP com `curl` — **PASSED** para as rotas listadas abaixo, todas retornando `200` do servidor Vite. Isso comprova entrega do documento HTML, não autenticação nem persistência.

## Rotas encontradas no código

- Login administrativo: `/auth/login/admin`; atalho `/admin/login`.
- Login da redação: `/auth/login/redacao`; atalho `/redacao/login`.
- Login do leitor: `/auth/login`; atalho `/login`.
- Cadastro de leitores: `/auth/cadastro`; atalho `/cadastro`.
- Recuperação de senha leitor: `/auth/esqueci-a-senha`.
- Recuperação de senha redação: `/auth/esqueci-a-senha/redacao`.
- Recuperação de senha admin: `/auth/esqueci-a-senha/admin`.
- Dashboard administrativo: `/admin` e `/admin/:section`.
- Dashboard editorial: `/redacao` e `/redacao/:section`.
- Editor de matérias: funcionalidade dentro do painel da redação; não há rota independente declarada em `routes.tsx`.
- Jornal Digital: não há rota independente declarada em `routes.tsx`; aparece como seção de painel.
- Financeiro: seção administrativa em `/admin/financeiro`.
- Assinaturas: `/leitor/assinatura` e seção administrativa `/admin/financeiro`.
- Doações: fluxo público no checkout e seção administrativa `/admin/financeiro`.
- Configurações: `/admin/configuracoes`.

## Matriz de evidências

| Área | Teste | Estado | Evidência / observação |
|---|---|---|---|
| Auth | Carregar logins e cadastro | PASSED | HTTP 200 nas rotas públicas de autenticação |
| Auth | Login real | BLOCKED | Requer conta de teste; Playwright bloqueado por dependência nativa |
| Admin | Acesso sem sessão | BLOCKED | Requer navegador para confirmar redirect visual; HTTP 200 não prova guarda |
| Redação | Acesso sem sessão | BLOCKED | Mesmo motivo |
| Leitor | Cadastro/login/logout | BLOCKED | Requer conta de teste e navegador executável |
| Menus | Submenus e ações | BLOCKED | Requer navegador executável |
| Editorial | Criar/editar/revisar/aprovar/publicar | BLOCKED | Requer conta, backend persistente e navegador |
| Jornal Digital | Criar edição/páginas/sumário/publicar | BLOCKED | Não há evidência de fluxo persistente completo |
| Admin | Usuários/permissões/configurações/logs | BLOCKED | Requer conta administrativa e confirmação backend |
| Financeiro | Validação de planos/estados/idempotência | BLOCKED | Nenhum adaptador sandbox confirmado nesta execução |
| Pagamento | Confirmação de provedor | SKIPPED | Não executado; sem pagamento real e sem confirmação inventada |
| Segurança | APIs, papéis, sessão expirada e rate limit | BLOCKED | Requer ambiente executável e casos autenticados |
| Build | TypeScript, build e diff | PASSED | Validações concluídas sem erro |

## Contas de teste

Não foi criado bootstrap de contas neste turno porque a implementação de autenticação existente precisa ser auditada antes de inserir usuários ou alterar banco. Não há credenciais gravadas no código nem expostas nos logs.

## Bloqueio externo preciso

O teste E2E não iniciou porque o Chromium headless encontrou `libnspr4.so` ausente no ambiente Linux. A instalação do navegador foi concluída. Para reproduzir quando a dependência estiver disponível: `pnpm test:qa:navigation`.

Nenhum pagamento real, migração destrutiva, publicação editorial ou operação de produção foi executado.
