# 🔍 RELATÓRIO DE AUDITORIA COMPLETA — O PATRIOTA

**Data:** 10/10/2026  
**Commit:** `6f163f6` (branch `main`, com alterações não commitadas em andamento)  
**Escopo:** Todos os arquivos de código relevantes inspecionados; typecheck executado de fato (`npx tsc --noEmit`).

---

## 1. VISÃO GERAL DO PROJETO

**O que é:** Portal jornalístico brasileiro "O Patriota" com duas frentes no mesmo repositório:

| Frente | Stack | Status |
|---|---|---|
| **Aplicação principal (deploy Vercel)** | SPA React 19 + Vite 8 + TypeScript 7 (nativo) + Tailwind CSS 4, Auth Firebase, API serverless em `api/*.ts` (Vercel Functions), persistência Firestore **ou** MySQL (document store genérico), pagamentos Mercado Pago, IA Gemini, Web Push via FCM | Ativa, em evolução (30 commits recentes) |
| **Legado WordPress** | Tema FSE `wp-content/themes/o-patriota` + plugin editorial `o-patriota-editorial` (PHP 8, $wpdb preparado, REST API própria) | Código completo e bem estruturado, mas **sem vínculo com o deploy atual** |
| **Código morto legado** | `src/server.ts` (Express + "Firebase Admin" + Prisma), `test/`, `src/data/mockData.ts`, `src/data/pagesData.ts` | Quebrado/ órfão |

**Estrutura:** 188 arquivos trackeados; ~30k linhas de código; dependências via pnpm; CI GitHub Actions (typecheck + build); documentação extensa em `docs/` (11 arquivos + subpasta de engenharia).

**Arquitetura de dados:** camada `api/_lib/storage.ts` abstrai Firestore (REST via service account) e MySQL (`opatriota_documents`, JSON por documento) — alternável por `DATABASE_PROVIDER`.

---

## 2. PROBLEMAS CRÍTICOS

### C1. Credenciais de produção em texto plano no disco do projeto

**`.vercel/.env.production.local`** contém:

- `POSTGRES_PASSWORD` (linhas 10–13, em 4 connection strings completas do Supabase)
- `SUPABASE_SERVICE_ROLE_KEY` (linha 19 — chave de service role, acesso total ao banco)
- `SUPABASE_JWT_SECRET` (linha 16)
- `SUPABASE_SECRET_KEY` (linha 18)

✅ Não está no git (`.vercel` está no `.gitignore`, sem histórico).  
❌ Está no workspace — se o repositório for copiado/compartilhado/zipado, há vazamento total. Além disso, **o Supabase nem é mais usado** pelo código (sobra da arquitetura anterior).

**Ação:** rotacionar/revogar todas as chaves Supabase + senha Postgres imediatamente; apagar o arquivo.

---

### C2. O typecheck (`pnpm lint`) está QUEBRADO — CI vermelha

`pnpm lint` = `tsc --noEmit` (package.json:11) e o workflow `.github/workflows/validate.yml:27` o executa em todo push/PR. Execução real: **32 linhas de erro TS**, incluindo:

- `src/App.tsx:734` — prop `onSyncResult` inexistente em `AdminDashboardProps`
- `src/components/AdminDashboard.tsx:55` — destrutura prop não declarada
- `src/components/admin/PushNotificationManager.tsx:117-118` — `sentCount`/`failedCount` inexistentes em `PushNotificationCampaign` (types.ts)
- `src/components/pages/CheckoutWizard.tsx:45` — `setPlanId(string)` em estado `union` tipado
- `src/server.ts` (9 erros) e `test/auth.test.ts` (16 erros) — código morto quebrado contaminando o typecheck

**Resultado:** o `main` atual não passa no próprio CI.

---

### C3. Newsletter está 100% quebrada — regex invalidamente escapada

`src/services/siteConfigService.ts:268`:

```ts
if (!cleanEmail || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanEmail))
```

Em literal de regex, `\\s` = barra-invertida + `s`, e `\\.` = barra-invertida + qualquer caractere. Testado: `joao@example.com` → **false**; `a@b.c` → **false**. **Nenhum e-mail válido passa.**

Usado por `FactCheckRibbon.tsx:28` (newsletter da home). O servidor tem validação correta (`billing.ts:16`), mas o cliente rejeita antes.

---

### C4. Fluxo de pagamento pós-checkout quebrado ponta a ponta

1. Webhook grava assinatura na coleção **`subscriptions`** (`api/webhooks/mercadopago.ts:44`)
2. `GET /me/subscription` lê **`userSubscriptions`** (`api/[...path].ts:122`) → nunca encontra
3. O `/me` (`firebaseAuthService.ts:117`) lê `profile.subscription` de `userProfiles`, que o webhook também nunca escreve
4. As `back_urls` do Mercado Pago redirecionam para `/?checkout=success&order=...` (`api/checkout.ts:31`), mas **nenhum código do frontend lê `location.search`** — usuário cai na home sem confirmação, sem refresh de assinatura

**Resultado: assinante paga e nunca recebe acesso.**

---

### C5. XSS armazenado via HTML do CMS sem sanitização

- `src/components/pages/InstitutionalPageView.tsx:267` — `dangerouslySetInnerHTML={{ __html: page.content }}`
- `src/components/pages/CustomPageView.tsx:73` — idem

`page.content` vem da API, gravada por qualquer perfil `editor`/`editor_chefe`/`administrador` via `PATCH /pages` (`[…path].ts:339-352`, que não filtra campos). Um editor comprometido (ou conta roubada) injeta `<script>` exibido a todos os leitores. Não há DOMPurify nem política CSP no deploy Vercel (o CSP existe só no `server.ts` morto).

---

### C6. Paywall 100% client-side — conteúdo premium vazado pela API

`api/[...path].ts:333-337`: `GET /articles/{id}` exige staff **apenas** para não publicados. Artigos publicados com `accessLevel: 'assinante'|'premium'` retornam `content` completo para qualquer anônimo. O bloqueio existe só no React (`ArticleView.tsx:66-85`). Qualquer pessoa com `curl` lê o conteúdo exclusivo.

---

### C7. Rascunhos de páginas expostos

Mesmo bloco: a checagem de publicação vale só para `articles`. `GET /pages/{id}` devolve páginas com `status: 'rascunho'` para qualquer um que saiba o ID (a filtragem por status existe apenas na listagem, linha 39).

---

### C8. Qualquer jornalista pode apagar/editar conteúdo de terceiros

`api/[...path].ts:339-352`: `POST/PATCH/PUT/DELETE` em `articles` aceitam **qualquer** papel em `STAFF` (inclui `jornalista`). Não há verificação de autoria/ownership nem trava de "autor não pode aprovar/excluir o próprio material" — a promessa do `docs/EDITORIAL-WORKFLOW.md` não está implementada na API atual.

---

### C9. Endpoints públicos sem rate limiting (spam/DoS)

Sem qualquer limite em:

- `POST /push-subscriptions` (anônimo, grava token de até 4 KB por request, `[…path].ts:125-146`)
- `POST /newsletter/subscriptions` (faz `documentList` completo a cada inscrição, linha 301)
- `POST /contact-submissions`
- `POST /privacy-requests`
- `POST /checkout`
- `POST /donation`

O webhook MP tem assinatura HMAC ✅, mas não há proteção contra esgotamento de cotas do Firestore/MySQL.

---

### C10. Código morto quebrado poluindo o projeto e o typecheck

- **`src/server.ts` (844 linhas):** Express + `require()` em módulo ESM (`"type": "module"`) + SDK **client** do Firebase usado como "admin" + `prisma` indefinido (linha 166) + `isDevelopment` indefinido (780, 817). Ninguém o importa; nenhum script o roda; é a origem de 9 erros TS.
- **`test/auth.test.ts`:** importa `vitest`, `supertest`, `@prisma/client` — **nenhuma está no package.json**. `test/README.md` descreve 6 arquivos de teste; só 1 existe, e esse não roda.
- **`src/data/mockData.ts` (1524 linhas) + `src/data/pagesData.ts` (1001 linhas):** ~2.500 linhas nunca importadas (grep confirmou zero usos dos exports `INITIAL_*`).

---

## 3. PROBLEMAS IMPORTANTES

### I1. Catálogo de planos triplicado (risco de divergência de preços)

- `api/_lib/billing.ts:5-9` (CATALOG)
- `api/[...path].ts:58-62` (lista inline com os mesmos preços escritos à mão)
- `api/plans.ts:9-19` (usa CATALOG — correto)

Duas implementações de `GET /plans` coexistem (`/api/plans` e `/api/plans` via catch-all). Se um preço mudar, o checkout (que usa CATALOG) e a listagem (inline) divergem silenciosamente.

---

### I2. Lógica de token de serviço duplicada

O fluxo JWT do service account está implementado **duas vezes**: `billing.ts:24-35` (escopos datastore+messaging) e `[...path].ts:166-177` (só messaging, no meio do handler de push). Manutenção em dois lugares.

---

### I3. Sync RSS dentro de um request serverless sequencial

`api/[...path].ts:193-257`: faz fetch de **todas** as fontes em loop sequencial (timeout 10 s cada) dentro de uma única invocação da função. Sem `vercel.json` definindo `maxDuration`, isso estoura o timeout padrão da Vercel com poucas fontes. A proteção SSRF (linhas 208-210) é por hostname regex — **não resolve DNS**, então não cobre DNS rebinding; e há `host.startsWith('fc')`/`'fe80:'` sem justificativa clara.

---

### I4. Paywall/assinatura sem sincronização no cliente

`App.tsx` nunca recarrega `currentUser.subscription` após retorno do checkout; `SubscriberPortal` não expõe refresh pós-pagamento. Mesmo corrigido C4, o estado ficaria defasado até novo login.

---

### I5. Web Push com restos de simulação

`src/services/webPushService.ts:194-241`: `getPushCampaigns()` ainda devolve **campanhas fictícias semeadas** ("URGENTE: Nova votação… 1420 destinatários") e `recordPushCampaign` grava só em localStorage. O `PushNotificationManager` migrou para a API (linha 64), mas o service mantém o caminho mock. Sem endpoint de **unsubscribe** (violação prática da LGPD para tokens push).

---

### I6. Service Worker do Firebase com SDK antigo e config hardcoded

`public/firebase-messaging-sw.js:2-14`: importa `firebasejs/10.12.0` via `importScripts` enquanto o app usa `firebase ^13.0.0`, e tem a config do app hardcoded (duplicando `.env`). Risco de incompatibilidade e de config desatualizada após rotação.

---

### I7. `fetch('/api/...')` hardcoded ignorando `VITE_API_BASE_URL`

`CheckoutWizard.tsx:93` e `PixDonationCard.tsx:14` chamam `/api/checkout` e `/api/donation` diretamente, em vez do cliente central `apiClient.ts` (que existe justamente para isso, `apiClient.ts:39-127`). Quebra se a API for hospedada em domínio separado (cenário previsto no `.env.example:2`).

---

### I8. Checagem de e-mail duplicada e divergente

`PixDonationCard.tsx:14` tem outra regex de e-mail (correta desta vez) inline, em vez de reutilizar `validEmail` do backend ou um utilitário único.

---

### I9. Falta de `strict` no TypeScript

`tsconfig.json` não define `"strict": true` (nem `noImplicitAny`, `strictNullChecks`). Todos os handlers da API usam `any` livremente (`billing.ts:10-15`, `[…path].ts:19-20`). Os 5 erros implícitos-`any` que sobraram no typecheck seriam pegos por regras mínimas.

---

### I10. SEO estruturalmente inviável na SPA

Sem react-router, sem SSR: toda a navegação é estado interno (`App.tsx:54-72`). Consequências:

- URLs não compartilháveis (um artigo não tem URL própria)
- `index.html` é o único documento — matérias, categorias e páginas não têm title/description/canonical próprios
- Open Graph sem `og:image` (index.html:17-20) apesar de `twitter:card=summary_large_image` (linha 21 — card grande sem imagem é inválido)
- Sem `sitemap.xml`, `robots.txt`, JSON-LD `NewsArticle` no deploy React (o plugin WordPress faz isso, mas está fora de ar)

Para um **portal de notícias**, isso é um problema de negócio, não só cosmético.

---

### I11. Performance: listagens completas por request

- `/me/payments` (`[…path].ts:107-118`): `documentList('checkoutOrders')` (full scan de todos os pedidos, todos os usuários) filtrado em memória
- `/newsletter/subscriptions` (linha 301): idem full scan para achar e-mail

Sem índice/paginação — degradação linear com o crescimento.

---

### I12. Dependências mortas/suspeitas no package.json

- `@google/genai` — zero imports no código
- `motion` — zero imports
- `express`, `dotenv` — usados só pelo `server.ts` morto
- `autoprefixer` — desnecessário no Tailwind 4
- Nome do pacote ainda é **`"react-example"`** (package.json:2) — resíduo do template
- `pnpm-lock.yaml` está no `.gitignore` (linha 3) **mas continua trackeado** — o ignore não se aplica a arquivos já versionados; e o CI usa `--no-frozen-lockfile` (validate.yml:25), destruindo a reprodutibilidade

---

### I13. Plugin de tipografia ausente

`InstitutionalPageView`, `CustomPageView` e `ArticleView` usam dezenas de classes `prose:*`, mas `@tailwindcss/typography` **não está instalado**. A formatação rica do conteúdo HTML do CMS silenciosamente não aplica.

---

### I14. README desatualizado e com credenciais de demo

`README.md` descreve o WordPress como plataforma principal (linhas 6-37) sem mencionar a stack Vercel/React/Firebase que é o deploy real; lista e-mails de contas de demonstração (linhas 79-86). A documentação `docs/` (11 arquivos + engenharia) é boa mas parcialmente desconectada da realidade do código (ex.: `test/README.md` promete 6 suites de teste inexistentes; `docs/SECURITY.md` descreve nonces WP que não protegem a API Vercel).

---

### I15. Componentes monolíticos

- `NewsroomDashboard.tsx`: **1413 linhas**, 32 `useState`
- `SubscriberPortal.tsx`: 1109 linhas, 27 states
- `OfficialSourcesHub.tsx`: 963
- `AdminDashboard.tsx`: 903
- `types.ts`: 532

Acima de qualquer limite razoável de manutenção; misturam UI, persistência e regras de negócio.

---

### I16. Guarda do painel admin apenas no botão

`App.tsx:726` renderiza `AdminDashboard` sem checagem de papel (diferente de `newsroom`, linha 702, que checa). Hoje a rota é estado interno (sem URL), mas o componente inteiro — incluindo markup sensível — carrega para qualquer um se o estado mudar; a API protege os dados, a UI não.

---

### I17. Falta de idempotência/higienização no webhook

`api/webhooks/mercadopago.ts` não marca eventos já processados (reprocessamento idempotente por acaso — funciona, mas grava `updatedAt`/`activatedAt` novos a cada retry). Não há validação de que o `payment.amount` bate com o plano atual do catálogo (só com o valor congelado no pedido — correto —, mas também não valida `payment.status_detail`).

---

### I18. Cache localStorage de settings sem invalidação

`siteConfigService.ts:241` grava settings em localStorage mas `loadPortalSettings` **nunca lê o cache** (só grava; o catch retorna defaults). O cache é write-only — código morto disfarçado. `SUPABASE_SETTINGS_ID` (linha 224) é constante órfã.

---

## 4. PROBLEMAS MENORES

| # | Onde | Issue |
|---|---|---|
| M1 | `App.tsx:551` | Comentário com encoding quebrado: `MODELO 5  PÁGINA` |
| M2 | `App.tsx:308-311` | `handleOpenFactCheck(item)` ignora `item` — só muda de view |
| M3 | `HeroSection.tsx:73` | Badge "BRASIL" hardcoded, ignora `article.category` |
| M4 | `BreakingNewsTicker.tsx` | Nome enganoso: é ticker de **mercado**; valores default sempre "indisponível" |
| M5 | `package.json:10` | Script `clean` usa `rm -rf` (não Windows-safe) |
| M6 | `metadata.json` | Artefato do ambiente AI Studio, não do produto |
| M7 | `webPushService.ts:38` | `catch (err)` com variável não usada |
| M8 | `webPushService.ts` | `import` de tipos (linha 17) no meio do arquivo, após lógica |
| M9 | `api/[...path].ts:210` | Filtro `host.startsWith('fc')` parece bug (talvez fosse `fc00::`/ULA IPv6) |
| M10 | `api/donation.ts` | Indentação inconsistente (linhas 21-36 coladas à direita) |
| M11 | `docs/O_PATRIOTA_BRASIL_DOCUMENTACAO_ENGENHARIA/` | Auditoria anterior gerada por agente, ainda untracked — decidir se versiona |
| M12 | `.env` vs `.env.example` | `.env.example` documenta `DATABASE_PROVIDER`, `.env` real não o define (funciona por default, mas gera ambiguidade) |
| M13 | `.gitignore:8-10` | Entradas Prisma (`.prisma/`, `schema.prisma`) — Prisma não existe mais no projeto |
| M14 | `wp-content/.../class-source-manager.php:74` | Lista de "identificadores Globo" inclui `'g1'` com `\b` — pode bloquear falsos positivos |
| M15 | Sem `.nvmrc`/`engines` | Node 22 só implicitamente no CI |

---

## 5. PONTOS FORTES

1. **Boa arquitetura de API serverless**: handlers pequenos, helpers centralizados em `_lib/`, erros padronizados em português, `Cache-Control: no-store` em respostas de dados (`billing.ts:10`).
2. **Verificação de token Firebase correta** via `accounts:lookup` com API key (`billing.ts:61-68`) + RBAC por papéis no servidor (`[…path].ts:11-13, 32-36`) — a autorização real é server-side, não só UI.
3. **Webhook Mercado Pago com assinatura HMAC validada em tempo constante** (`mercadopago.ts:15-20` + `billing.ts:74-76` `timingSafeEqual`) e checagem de valor/moeda do pagamento contra o pedido (linhas 31, 39) — padrão correto contra spoofing e troca de valor.
4. **Validação de entrada disciplinada** nos endpoints públicos: assunto/tipo em allowlist (`contact-submissions.ts:15`, `privacy-requests.ts:15`), limites de tamanho em todos os campos, e-mail validado, documento LGPD sanitizado só com dígitos (`privacy-requests.ts:23`).
5. **Camada de storage abstrata com prepared statements no MySQL** (`storage.ts:55-58, 84-89, 96-98, 110-112`) — sem SQL injection; limites de tamanho de coleção/ID.
6. **Cliente HTTP frontend maduro** (`apiClient.ts`): timeout com AbortController, mapeamento de erros tipados, token injetável — melhor que fetch solto (mesmo que 2 arquivos ainda escapem disso).
7. **Proteções WordPress bem-feitas**: `ABSPATH` guard em 100% dos PHP, `$wpdb->prepare` nas queries dinâmicas, `wp_safe_remote_get` + `LIBXML_NONET` + `libxml_disable_entity_loader` contra XXE (`class-rss-ingestion.php:54-65`), validação SSRF com resolução de DNS (`class-source-manager.php:34-37`), nonces e `current_user_can` nos fluxos administrativos.
8. **Service Worker PWA cuidadoso** (`public/sw.js`): cacheia só assets estáticos, exclui explicitamente `/api/`, `/minha-conta`, `/redacao` — não serve conteúdo privado stale.
9. **Documentação técnica acima da média**: `docs/` cobre arquitetura, deployment, workflow editorial, contrato frontend-backend, segurança e SEO; pasta de engenharia com traceability e runbook.
10. **CI existente** (typecheck + build) e `.env.example` comentado com a regra "NUNCA prefixe segredos com VITE_" — a intenção de segurança está clara.
11. **Bom uso de acessibilidade** em componentes novos (`aria-live`, `role="status"`, `prefers-reduced-motion` no ticker, focus-visible no CSS).
12. **Git limpo de segredos**: `.env`, `.env.local`, `.vercel/` fora do versionamento e sem histórico de commit com segredos (verificado `-S` no histórico inteiro: 229 commits, nenhum vazamento).

---

## 6. RECOMENDAÇÕES PRIORIZADAS

### 🔴 Prioridade 0 — esta semana (segurança / receita)

1. **Rotacionar todas as credenciais Supabase/Postgres** do `.vercel/.env.production.local` e apagar o arquivo (C1).
2. **Corrigir a regex da newsletter** (`siteConfigService.ts:268`) — trocar por `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` ou reutilizar um utilitário único (C3).
3. **Unificar a coleção de assinaturas** (`subscriptions` vs `userSubscriptions`) e tratar `?checkout=success` no frontend com reload de `/me` (C4).
4. **Sanitizar HTML do CMS** com DOMPurify antes de `dangerouslySetInnerHTML` (C5).
5. **Fazer o typecheck passar**: apagar `src/server.ts` e `test/` (ou movê-los para `attic/` fora do `include` do tsconfig), corrigir `AdminDashboardProps`, `PushNotificationCampaign` e `CheckoutWizard` (C2, C10).

### 🟠 Prioridade 1 — próximas 2-3 semanas (modelo de negócio)

6. Retornar conteúdo de artigos premium truncado na API para anônimos (server-side paywall) e checar `status` publicado em `GET /pages/{id}` (C6, C7).
7. Implementar ownership/workflow real de artigos na API (quem pode editar/excluir o quê) (C8).
8. Rate limiting por IP/token nos endpoints públicos (Vercel KV ou upstash) + endpoint de unsubscribe/delete de push subscription (C9, I5).
9. Remover dependências mortas (`@google/genai`, `motion`, `express`, `dotenv`), renomear o pacote, travar `pnpm-lock.yaml` (remover do index e usar `--frozen-lockfile` no CI) (I12).

### 🟡 Prioridade 2 — 1-2 meses (qualidade / escala)

10. Adotar router (React Router / TanStack Router) + SSR ou prerender por rota (Next/Astro ou Vercel rewrites) para viabilizar SEO de notícias; adicionar og:image, canonical, JSON-LD, sitemap (I10).
11. `tsconfig` com `strict: true` e ESLint real (hoje "lint" só roda tsc) (I9).
12. Extrair catálogo de planos para fonte única; unificar JWT helper; mover sync RSS para fila/cron com `maxDuration` e resolução DNS na SSRF check (I1, I2, I3).
13. Instalar `@tailwindcss/typography` (I13) e extrair paginação/índices para `/me/payments` e newsletter (I11).
14. Quebrar `NewsroomDashboard`/`SubscriberPortal` em módulos ≤300 linhas; apagar `mockData.ts`/`pagesData.ts` (~2,5k linhas mortas) (I15, C10).
15. Reescrever README refletindo a stack real e alinhar `docs/` e `test/README.md` ao que existe de fato (I14).

### 🟢 Prioridade 3 — contínuo

16. Testes de verdade: Vitest + testes de contrato da API (auth, RBAC, webhook com fixtures MP), cobrindo os fluxos críticos hoje sem nenhum teste executável.
17. Observabilidade: logging estruturado, alertas de falha de webhook/FCM, painel de custo Firestore (os full scans atuais vão gerar conta).
18. Definir política de retenção LGPD para `contactSubmissions`, `privacyRequests`, `pushSubscriptions` e `checkoutOrders`.

---

## Resumo executivo

O projeto tem ambição e arquitetura sólida (RBAC server-side, webhook assinado, storage abstrato, documentação rica), mas está com:

- **A CI quebrada**
- **O fluxo de receita (assinatura) não funcional ponta a ponta**
- **A newsletter inoperante**
- **Credenciais de produção soltas no disco**
- **Paywall só de fachada**
- **XSS potencial no CMS**

Os problemas são majoritariamente de integração entre partes migradas em etapas (Firestore→MySQL, mock→API, WP→Vercel) sem fechar os ciclos — todos com correção bem delimitada e sem necessidade de reescrita grande.
