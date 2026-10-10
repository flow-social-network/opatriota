# Decisão de arquitetura e migração controlada

## Estado auditado

- Repositório: `flow-social-network/opatriota`.
- Branch de trabalho: `feature/arquitetura-react-backend`, baseada em `feature/efi-assinaturas` no commit `a62387e`.
- A branch foi criada num worktree próprio; não tem upstream remoto e não foi publicada.
- `main` está em worktree separado, com alterações locais preexistentes preservadas.
- Produção Vercel: projeto `opatriota`, root configurado como raiz, framework preset Vite. A inspeção CLI não expôs a branch de produção; portanto, ela permanece **não confirmada**. Não há `vercel.json` no commit auditado.
- Nenhuma configuração Vercel, domínio, banco ou migration de produção foi alterada.

## Decisão técnica

Adotar **React + TypeScript + Vite** como frontend principal, **Express + TypeScript** como API, **Prisma + PostgreSQL/Neon** como persistência e **`nucleo-operacional`** como worker separado. Não migrar para Go nesta fase. Esta decisão segue a arquitetura solicitada e a aplicação React/Vite existente, que é o preset/root atualmente configurado na Vercel.

| Critério | Express/TypeScript existente | Go |
|---|---|---|
| Código reaproveitável | Rotas Express, middleware, Prisma, schema, tarefas operacionais e validação existentes | Exigiria reimplementar contratos, sessão, RBAC, transações e worker |
| PostgreSQL | Prisma já tipa modelos e migrations, usado pelo backend e worker | Exigiria escolher driver/query layer e manter sincronismo com Prisma/schema |
| Firebase | `firebase-admin`/SDK Node tem integração direta; autenticação de sessão já implementada | SDK Firebase Admin Go é viável, mas adiciona implementação e operação paralela |
| Concorrência/desempenho | Node atende o volume atual; worker limita batch e usa claim/idempotency no banco | Go pode reduzir memória/latência sob carga demonstrada, não necessária como pressuposto |
| Manutenção e observabilidade | Um runtime TypeScript para API e worker, tipos partilhados pelo frontend | Mais linguagem, pipeline, deploy e contratos duplicados |
| Recomendação | **Manter e fortalecer** | Reavaliar com métricas de CPU, memória, throughput ou limites reais |

Não criar uma API Go paralela. A API Express está em `backend/src`, base `/api`; o frontend Vite deve consumir essa API através de um cliente tipado e nunca acessar Prisma/Neon diretamente. `nucleo-operacional` partilha o schema Prisma e executa fora das funções HTTP. A raiz continua como app Vite nesta etapa para não invalidar o root e o preset atuais da Vercel.

Foi formalizado um workspace pnpm com três projetos existentes: aplicação Vite na raiz, `@opatriota/api` em `backend/` e `@opatriota/worker` em `nucleo-operacional/`. Não foram criadas pastas vazias nem movidos diretórios usados pelo deploy. Contratos/UI/config compartilhados entram em `packages/` somente quando houver pelo menos dois consumidores reais; `admin-cli` continua desnecessário/não implementado.

## Inventário WordPress

O legado está em `legacy/wordpress/` e `backend/legacy/wordpress-plugin/`, preservado como referência e não carregado pelo runtime Next/Express.

| Recurso WordPress | Conteúdo encontrado | Destino/Classificação |
|---|---|---|
| Tema FSE | 13 templates (`front-page`, `single`, arquivo, categoria, autor, busca, institucionais, contato, planos, conta, redação, 404), 5 partes, 5 patterns, `theme.json`, CSS, PHP de setup/acessibilidade/SEO, JavaScript de clima e imagens | **A/B:** templates com comentários Gutenberg precisam ser reconstruídos em JSX; não são HTML autônomo. CSS/imagens e metadados são referências, não runtime |
| `class-rss-ingestion.php` | Cron horário, `wp_remote_get`, ingestão RSS | **C:** worker persistente Node existente; validar SSRF, parser, atribuição, duplicação e retry antes de substituir |
| `class-source-manager.php` | gestão e validação de fontes | **C:** `Source` Prisma existe; gestão completa e interface ainda precisam de paridade |
| `class-deduplication.php` / `class-url-normalizer.php` | URL, GUID/hash e regras de deduplicação | **C:** chave única `sourceId/contentHash` e canonical URL existem; portar/testar regras completas |
| `class-editorial-queue.php` | fila e status | **A parcial:** `OperationalTask` persistente e worker existem; cobertura, concorrência e observabilidade precisam de teste de banco |
| `class-newsroom-workflow.php` / `class-editorial-history.php` | submissão, revisão, publicação e histórico | **B/C:** rotas article, `ArticleReview`, `AuditEvent` e aprovação humana existem; completar UI/API e testes transacionais |
| `class-fact-check.php` | fact-check e evidências | **C:** Prisma tem `FactCheck`/`FactCheckEvidence`; API/UX e persistência da execução IA não têm paridade demonstrada |
| `class-category-manager.php` / `class-pages-manager.php` | categorias, páginas, contato e LGPD | **C/E:** categoria pública existe; CRUD de páginas e pedidos privados ainda precisam de modelo/rotas |
| `class-content-restriction.php` / `class-subscriber-portal.php` | paywall, autenticação, planos e assinatura | **C/F:** modelos estão no Prisma; adapter Efí declara contrato mas não está montado nem configurado |
| `class-weather-api.php` | endpoints REST clima e cache | **E/C:** há scripts/consumidores históricos; confirmar fornecedor/licença e endpoint antes da portagem |
| `class-capabilities.php` / `class-admin.php` | capabilities e painel | **C:** `UserRole`, `requireAuth` e `requireRole` existem; painel Next e APIs administrativas ainda são incompletos |
| activator/deactivator/plugin bootstrap | tabelas `$wpdb`, hooks e cron | **F:** não executar PHP no Node; converter somente schema/regras validadas em migrations e serviços |

Dependências de tema: templates FSE usam `wp:template-part`, `wp:pattern`, `wp:post-title` e `wp:post-content`; `functions.php` carrega hooks, `inc/` registra acessibilidade, CSS/editor e JSON-LD, e `assets/js/weather.js` é comportamento de browser. O plugin cria três tabelas próprias no ativador e agenda polling horário. Não remover o arquivo legado até concluir paridade e teste de regressão.

## Mapa WordPress → React/Vite

| Template/fluxo | Implementação React/Vite existente | Estado observado |
|---|---|---|
| Home/front-page | `App` → view `home`, `HeroSection`, `EditorialGrid`, `LiveSourceNews` | React/Vite existe; feed Agência Brasil usa `/api/news`; dados editoriais devem ser ligados às rotas Express |
| Single article | view `article`, `ArticleView` | Componente existe; integração real e paywall server-side são critérios de validação |
| Archive/category/author/search | `ArchivePageView`, `CategoryPageView`, `AuthorPageView`, `SearchPageView` | Páginas React existem; `/api/articles` agora filtra categoria e busca paginada por título/resumo; autores ainda sem API |
| Institutional/custom pages | `InstitutionalPageView`, `CustomPageView` | Interface existe; conteúdo dinâmico e persistência ainda não têm paridade |
| Contact/LGPD | `ContactPageView`, `LgpdPageView` | Formulários React existem; ausência de modelo/rotas Prisma permanece bloqueio |
| Plans/account | `PlansPageView`, `SubscriberPortal` | Interface existe; simulações antigas precisam ser removidas após integração Efí/Firebase real |
| Newsroom/admin | `NewsroomDashboard`, `AdminDashboard` | Componentes React existentes; ações locais/mocks precisam ser trocados por APIs RBAC |
| Fact check | `FactCheckHub`, `FactCheckSubmissionPage` | Interface existente; rotas/persistência e serviço IA precisam de paridade |
| 404 | `NotFoundPageView` | Implementado na app React |

O App Router `src/app/` do commit remoto permanece como scaffold secundário sob avaliação: algumas páginas públicas já consultam Express e a busca foi integrada, mas a maioria ainda é placeholder. Não será runtime principal enquanto React/Vite continuar a decisão arquitetural; ele não deve ser tratado como paridade concluída nem removido nesta fase.

## Dados e serviços

PostgreSQL/Neon via Prisma é a fonte pretendida de verdade para identidade, sessão, conteúdo editorial, fontes/ingestão, pagamentos, notificações e auditoria. Modelos existentes incluem `User`, `RefreshSession`, `Article`, `ArticleReview`, `Source`, `IngestionItem`, `ArticleSource`, `FactCheck`, `Subscription`, `Payment`, `PaymentEvent`, `PushSubscription`, `AuditEvent`, `NewsletterSubscriber`, `Notification`, `OperationalTask`, `AgentExecution` e `OperationalHeartbeat`.

A cadeia de migrations não foi comprovada completa: há migrations incrementais, mas não uma baseline visível que recrie todas as tabelas para banco vazio. Validar apenas `prisma validate` não prova que um banco novo ou existente está migrado. Nenhuma migration foi aplicada.

Firebase Auth do browser agora troca o ID token por `POST /api/auth/firebase`; Firebase Admin valida assinatura, projeto, revogação, provedor Google e e-mail verificado. O backend cria conta nova como `READER`, preserva roles existentes, bloqueia `disabledAt`, grava sessão opaca hash-only e auditoria; o browser recebe somente cookie HttpOnly. O teste local cobre token vazio e configuração Admin ausente, mas login Google real ainda depende de secrets rotacionados, domínio autorizado, CORS e PostgreSQL de homologação. `VITE_ADMIN_EMAILS` continua sendo somente apresentação e não concede role.

### Particionamento de armazenamento

Usar vários provedores não é, por si só, balanceamento de carga. A decisão é atribuir um proprietário por domínio e evitar dual-write da mesma entidade:

| Provedor | Domínio permitido | Estado no código/decisão |
|---|---|---|
| PostgreSQL/Neon | Fonte de verdade para usuários, roles/sessões, artigos, workflow, fontes normalizadas, pagamentos, assinaturas, tarefas e auditoria | Integrado via Prisma; permanece autoritativo |
| MongoDB Atlas | Candidato a arquivo de payloads brutos de ingestão/documentos heterogêneos | Não há consumidor encontrado. `IngestionItem.payload` já guarda JSON no Postgres; só separar após medir volume/retention e implementar outbox, retry, reconciliação e TTL. Nunca mover finanças/roles |
| Turso/libSQL | Candidato futuro a read-model edge/cache público | Não há consumidor. Evitar espelhar writes transacionais; cache só com invalidação e tolerância explícita a dado stale |
| Vercel Blob | Objetos de imagem/documento, não registros de negócio | Não há consumidor. Persistir metadados/checksum/origem/licença no Postgres; mídia privada requer acesso controlado e token server-side; não usar `access: public` para documentos |
| Mem0 | Memória semântica auxiliar por agente/tarefa, nunca fonte de verdade | Não há consumidor nem contrato verificado. Validar SDK/API/plano; minimizar dados e PII, filtrar por agent/run/user autorizados, manter referência/auditoria no Postgres e política de exclusão |

As chaves de ambiente fornecidas em conversa foram expostas e devem ser revogadas/rotacionadas. Elas não foram copiadas, testadas nem configuradas. `.env.example` contém apenas nomes vazios. Nomes de variáveis com prefixos de projeto na Vercel não se tornam automaticamente `MONGODB_URI`, `TURSO_AUTH_TOKEN` ou outros aliases; configurar nomes canônicos no ambiente do processo depois da rotação.

## Vercel, produção e isolamento

- Preset atual: Vite, root da aplicação na raiz e build `npm run build`/`vite build`.
- Os scripts `next:check` e `next:build` existem, mas não são o build selecionado pela configuração atual.
- O frontend Vite usa o cliente de API existente; API e worker são processos separados. O helper Next experimental usa `OPATRIOTA_API_URL` server-only e falha em produção sem configuração; essa variável é mantida no exemplo apenas enquanto o scaffold for avaliado.
- Vercel serverless não substitui o processo contínuo do worker. Worker precisa de runtime de longa duração (container/VM/serviço com restart policy, health/heartbeat e shutdown); deployment atual não comprova execução 24/7.
- O CLI não mostrou `productionBranch` nem vínculo Git no resumo JSON. Confirmar isso no painel Vercel antes de vincular novo projeto; não inferir que seja `main`.
- Preview Next deve usar projeto Vercel separado ou ambiente preview explicitamente isolado e API/DB não produtivas. Criar/vincular novo projeto, mudar framework/root/domínio ou publicar exige autorização adicional; nada disso foi feito aqui.

## NotebookLM e agentes

Não foi localizada integração programática oficial do NotebookLM. O painel antigo contém rota de consulta não implementada; o core operacional usa um endpoint OpenAI-compatible configurado por segredo no worker. São soluções diferentes: não afirmar que o projeto usa NotebookLM. Uma futura camada própria RAG exige seleção de fontes autorizadas, armazenamento/indexação, ACL, citações, exclusão e retenção; depende de provedor e configuração, não deve assumir acesso universal. Writer e Guardian criam rascunho/sinalização; somente aprovador humano pode publicar.

## Critérios de corte

1. Completar baseline/migrations em banco descartável, validar backup/restauração e contratos; não tocar produção.
2. Implementar API/serviços ausentes (autor, busca paginada, páginas, contato/LGPD, newsletter, preferências/assinatura, checkout Efí) com RBAC, idempotência e testes.
3. Ligar os módulos React/Vite existentes às APIs reais e adicionar testes negativos; manter erros explícitos, sem mocks de produto.
4. O worker agora fixa o DNS em IPv4 global validado, bloqueia intervalos reservados, revalida até cinco redirects e limita tempo/tamanho; testes unitários cobrem os bloqueios. Segue pendente teste de integração com servidor HTTP/HTTPS de homologação e consideração de fontes IPv6-only (bloqueadas explicitamente).
5. Configurar secrets rotacionados, Firebase Google/domínios, Neon de homologação e credenciais Efí sandbox.
6. Validar `pnpm install --frozen-lockfile`, Prisma, backend/core/React typecheck, testes e build Vite. Manter Next build separado somente enquanto o scaffold for comparado; não selecioná-lo para produção.
7. Obter projeto/preview isolado e confirmar sua origem. Só trocar build Vercel depois de aprovação e paridade; não alterar projeto/domínio/branch de produção nesta fase.
