# Auditoria de persistência dos painéis

Data: 12/10/2026  
Branch: `v0/auditoria-fluxos-auth`  
Commit base desta etapa: `1b2df56`
Escopo: site público, Painel Administrativo (`/admin`) e Redação (`/redacao`)

## Regra de conclusão

Uma ação só é marcada como aprovada quando há confirmação HTTP do backend. TypeScript, lint e build não comprovam persistência no Neon.

## Matriz de evidências

| Módulo | Funcionalidade | Resultado esperado | Evidência/teste | Situação |
|---|---|---|---|---|
| Admin | Criar usuário | `POST /authors`, autorização admin, retorno persistido no contexto | Implementado nesta etapa; tsc/lint/build ainda pendentes | CORRIGIDO |
| Admin | Listar usuários | `GET /authors`, dados reais do backend | Rota existente no DataContext; leitura Neon não exercitada | BLOQUEADO |
| Admin | Alterar papel | Permitir somente admin e persistir | Endpoint genérico exige ADMINS; UI de edição ainda não implementada | NÃO TESTADO |
| Admin | Páginas/editorias/menus | Gravar somente após resposta API | Callbacks aguardados e erros propagados | CORRIGIDO |
| Admin | Identidade/redes/publicidade | `PATCH /site-settings`, sem localStorage como autoridade | Serviço usa servidor; teste de sessão admin não executado | PARCIAL |
| Admin | Fontes/RSS | Sincronizar e persistir fontes/fila | Callbacks aguardados; RSS externo depende de rede/configuração | PARCIAL |
| Redação | Rascunho/revisão/aprovação/publicação | Estados confirmados pelo backend, aprovação humana | Callbacks editoriais aguardados; navegador autenticado não disponível | PARCIAL |
| Público | Categorias e páginas institucionais | Links existentes e conteúdo/estado vazio correto | Rotas públicas compiladas e navegação básica verificada | PARCIAL |
| Público | Cabeçalho/rodapé | Cabeçalho fixo e links preservados | Alteração visual aplicada; cobertura integral de links pendente | PARCIAL |

## Endpoints de escrita identificados

- `POST /authors`, `PATCH /authors/:id`
- `POST/PATCH/DELETE /articles/:id`
- `POST/PATCH/DELETE /pages/:id`
- `POST/PATCH/DELETE /categories/:id`
- `PATCH /site-settings` e `PATCH /site-settings/menu`
- `POST /editorial/sources/sync`
- `PATCH /editorial/queue/:id`
- `POST /admin/push-campaigns`
- `POST /contact-submissions`, `/privacy-requests` e `/newsletter/subscriptions`

Todos devem validar sessão e papel no backend. Não foi executada migração destrutiva nem deploy.

## Correções desta etapa

- Adicionado `saveAuthor` ao `DataContext`, com `POST/PATCH /authors`, atualização do estado somente após resposta e propagação de falhas.
- Substituído o botão decorativo “Adicionar Novo Usuário” por formulário real com validação mínima, seleção de papel e estado de gravação.
- Preservado o bloqueio de administração para não administradores.
- Mantida a aprovação/publicação humana e separada.

## Verificações

- Estado inicial confirmado: branch `v0/auditoria-fluxos-auth`, commit `1b2df56`.
- Auditoria textual de componentes, contexto, endpoints e documentação executada.
- Teste automatizado configurado no projeto: inexistente; `pnpm test` apenas retorna “No tests configured yet”, portanto não é evidência de cobertura.
- Persistência real no Neon: BLOQUEADO nesta etapa por ausência de credencial/conta de teste autorizada para criar e limpar registros com segurança.

## Analytics técnico de audiência

- Criadas no Neon as tabelas `public.portal_events` e `public.portal_event_dedup`, com índices por data, tipo, página e sessão.
- Adicionado `POST /analytics/events` com validação de evento, hash de user-agent/IP, deduplicação e resposta `202` sem bloquear a navegação pública.
- Adicionado `GET /analytics/summary`, protegido para administradores, com totais de 30 dias e páginas mais acessadas.
- O `PublicLayout` registra `page_view` real por rota; falha de analytics não interrompe o portal.
- Evidência executada: POST retornou `202 accepted`; repetição retornou `deduplicated: true`; leitura explícita no Neon confirmou os documentos em `portalEvents` e `portalEventDedup`.
- Corrigido o provider: quando `DATABASE_URL` PostgreSQL existe, Neon/Postgres é priorizado antes do fallback Firebase.

## Pendências

1. Executar teste de integração isolado: criar, reler, atualizar, reler após reload e testar falha de autorização.
2. Implementar edição/desativação de usuário e trilha de auditoria antes de marcar usuários como aprovado.
3. Auditar individualmente publicidade, redes sociais, integrações, segurança, newsletter e push.
4. Percorrer navegador autenticado com contas de teste de cada papel.
5. Criar cobertura Playwright/E2E para rotas e mutações críticas.

Nenhum item bloqueado foi contabilizado como aprovado. Não houve deploy.
