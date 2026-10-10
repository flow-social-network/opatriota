# Migração de WordPress para Next.js e Express

## Estado atual
A aplicação executável existente é React/Vite em src/main.tsx e src/App.tsx, com API Express em backend/, Prisma/PostgreSQL e núcleo em nucleo-operacional/. Não havia Next.js configurado. Esta alteração cria a aplicação Next App Router em paralelo, sem mudar os comandos `dev`/`build` atuais que continuam a preservar o site Vite até paridade funcional.

Os arquivos `wp-content/` foram preservados em `legacy/wordpress/` (tema e assets) e `backend/legacy/wordpress-plugin/` (plugin PHP antigo, só arquivo). Não são runtime de Next nem código executável pelo Express.

## Rotas Next criadas
- `/`: página inicial com notícias publicadas consultadas à API Express.
- `/noticias` e `/arquivo`: listagens consultadas à API.
- `/categoria/[slug]`: listagem filtrada por categoria.
- `/artigo/[slug]`: matéria com atribuição de fonte e metadados/crédito da imagem.
- `/buscar`: procura no máximo 50 notícias devolvidas pela API atual; precisa de endpoint próprio para pesquisa escalável.
- `/autor/[slug]`, `/contato`, `/institucional`, `/planos`, `/minha-conta`, `/redacao`, `/checagem`, `/checagem/enviar` e `/lgpd`: estrutura inicial de rota; paridade de interações ainda pendente.

## Mapa de templates WordPress
- `front-page.html` -> `src/app/page.tsx`
- `single.html` -> `src/app/artigo/[slug]/page.tsx`
- `archive.html` -> `src/app/noticias/page.tsx`
- `category.html` -> `src/app/categoria/[slug]/page.tsx`
- `author.html` -> `src/app/autor/[slug]/page.tsx`
- `search.html` -> `src/app/buscar/page.tsx`
- `page-contato.html` -> `src/app/contato/page.tsx`
- `page-institucional.html` -> `src/app/institucional/page.tsx`
- `page-planos.html` -> `src/app/planos/page.tsx`
- `page-minha-conta.html` -> `src/app/minha-conta/page.tsx`
- `page-redacao.html` -> `src/app/redacao/page.tsx`
- `404.html` -> `src/app/not-found.tsx`

Os templates são templates FSE com marcadores Gutenberg, não documentos HTML estáticos. A conversão visual exata e toda a interatividade continuam como trabalho de migração, não podem ser consideradas finalizadas.

## Plugin PHP: destino no backend
O plugin foi preservado em `backend/legacy/wordpress-plugin/o-patriota-editorial/`. Não copiar classes PHP para `backend/src` como se fossem TypeScript; dependem de hooks WordPress, capabilities, WP-Cron, WP REST, `$wpdb` e tabelas próprias. A portagem deve ser por função, usando módulos existentes:
- RSS, fontes e deduplicação: `Source`, `IngestionItem` e `nucleo-operacional`.
- Artigos, workflow, revisões e histórico: `Article`, `ArticleReview`, `AuditEvent` e `backend/src/routes/articles.ts`.
- Categorias: `Category` e `backend/src/routes/categories.ts`.
- Fact-check: `FactCheck` e `FactCheckEvidence`; auditar endpoints que faltam.
- Paywall/assinaturas: `SubscriptionPlan`, `Subscription`, `Payment`; validar entitlement no servidor.
- Weather: serviço TS só se permanecer necessário e com provedor real.
- Admin e páginas: mapear para permissões e persistência reais, sem manter o painel WordPress.
- WP-Cron: worker persistente do núcleo, sem depender de sessão ou navegador.

## Corte para Next
Não alterar a configuração da Vercel para Next antes de testar as páginas, login Google, painel, contacto, checkout, fontes, revisão editorial e publicação. Os scripts atuais permanecem Vite; Next usa `next:dev`, `next:build`, `next:start` e `next:check`. Configurar `OPATRIOTA_API_URL` no ambiente do Next. Fazer E2E e preview antes de migrar tráfego.
