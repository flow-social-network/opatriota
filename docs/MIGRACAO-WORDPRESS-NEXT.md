# Migração definitiva: WordPress para Next.js + backend próprio

## Objetivo

O Patriota Brasil deixa de depender de WordPress. O site público e as áreas autenticadas serão páginas Next.js em `src/app/`, reutilizando componentes React existentes em `src/components/` quando compatíveis. A API e os processos de negócio ficam em `backend/`, com Express/TypeScript, Prisma e PostgreSQL. O núcleo operacional permanece um worker separado da API HTTP.

**Esta migração deve ser feita por etapas e comprovada por testes.** Não apagar o legado nem trocar o comando de produção antes de equivalência funcional, build e smoke tests. Não alterar ou aplicar migrações de produção sem autorização.

## Arquitetura final desejada

```text
src/
  app/
    layout.tsx
    page.tsx
    not-found.tsx
    noticias/[slug]/page.tsx
    categoria/[slug]/page.tsx
    autor/[slug]/page.tsx
    busca/page.tsx
    contato/page.tsx
    institucional/page.tsx
    planos/page.tsx
    minha-conta/page.tsx
    redacao/page.tsx
    checagem/page.tsx
    admin/...
  components/              # componentes React reutilizáveis já existentes
  services/                # clientes de API do browser; sem segredos
  lib/                     # utilitários exclusivamente de interface
backend/
  src/
    routes/                # endpoints HTTP
    services/              # regras de negócio portadas do antigo plugin PHP
    repositories/          # acesso a dados via Prisma
    integrations/           # RSS, weather provider, pagamentos, email/push
    middleware/
    jobs/                  # tarefas auxiliares disparadas pela fila persistente
nucleo-operacional/
  src/                     # worker e agentes editoriais
prisma/
  schema.prisma
  migrations/
legacy/
  wordpress/
    themes/o-patriota/     # cópia de referência temporária, não executada
    plugins/o-patriota-editorial/ # cópia de referência temporária, não executada
docs/
  MIGRACAO-WORDPRESS-NEXT.md
```

A pasta `legacy/wordpress` é temporária e apenas de referência. A meta é que nenhum PHP seja necessário para executar o produto. Após paridade e aprovação, o legado pode ser removido num commit separado.

## Rotas do tema que precisam virar páginas Next

| Template WordPress | Destino Next.js | Fonte de dados |
|---|---|---|
| `templates/front-page.html` | `src/app/page.tsx` | artigos publicados, destaques e categorias via API |
| `templates/single.html` | `src/app/noticias/[slug]/page.tsx` | API de artigos por slug, fonte e crédito de imagem |
| `templates/archive.html` | `src/app/noticias/page.tsx` ou arquivo parametrizado | API paginada |
| `templates/category.html` | `src/app/categoria/[slug]/page.tsx` | API de categoria e artigos |
| `templates/author.html` | `src/app/autor/[slug]/page.tsx` | API de autor/artigos |
| `templates/search.html` | `src/app/busca/page.tsx` | endpoint de pesquisa real |
| `templates/page.html` | rota de página institucional dinâmica | conteúdo persistido e publicado |
| `templates/page-contato.html` | `src/app/contato/page.tsx` | endpoint real de contacto |
| `templates/page-institucional.html` | `src/app/institucional/page.tsx` | conteúdo institucional |
| `templates/page-planos.html` | `src/app/planos/page.tsx` | planos reais e checkout do backend |
| `templates/page-minha-conta.html` | `src/app/minha-conta/page.tsx` | sessão/login e assinaturas reais |
| `templates/page-redacao.html` | `src/app/redacao/page.tsx` | API protegida por sessão e RBAC |
| `templates/404.html` | `src/app/not-found.tsx` | página de erro Next |
| Partes `header/footer/breadcrumbs/breaking-news/sidebar` | componentes de layout React | menu, notícias e configurações da API |

Os ficheiros de tema usam comentários de blocos WordPress (`wp:post-title`, `wp:post-content`, `wp:template-part`, `wp:pattern`). Não são páginas HTML independentes. Cada bloco deve ser substituído por JSX/React e dados vindos da API; remover os comentários não produz uma página funcional.

## Portabilidade dos plugins PHP

O backend Node/Express **não executa PHP** nem fornece `ABSPATH`, `$wpdb`, `wp_safe_remote_get`, `add_action` ou as tabelas WordPress. Por isso, os plugins devem ser portados, não simplesmente copiados para uma pasta backend.

| Plugin PHP atual | Destino funcional no backend | Estado observado |
|---|---|---|
| `class-rss-ingestion.php` | `nucleo-operacional/src` + serviço de ingestão | Existe ingestão RSS TypeScript; comparar proteção SSRF, parsing e deduplicação |
| `class-source-manager.php` | `backend/src/services/sources` + rotas autenticadas | Modelo `Source` existe; comparar gestão, validação de URL e regras editoriais |
| `class-deduplication.php` | serviço de ingestão / restrições únicas Prisma | Deduplicação parcial já existe; testar URLs e hashes |
| `class-editorial-queue.php` | `OperationalTask` + worker | Fila persistente já existe |
| `class-newsroom-workflow.php` | rotas de artigos + autorização RBAC | Workflow TypeScript já existe; comparar todas as transições |
| `class-editorial-history.php` | `ArticleReview` + `AuditEvent` | Modelos existem; validar cobertura e trilha imutável |
| `class-fact-check.php` | `FactCheck` + `FactCheckEvidence` e endpoints dedicados | Modelos existem; endpoints e UX devem ser verificados |
| `class-category-manager.php` | rotas de categorias e serviços | Rota de leitura existe; CRUD administrativo deve ser auditado |
| `class-pages-manager.php` | modelo de páginas e CRUD no backend | Não presumir que exista apenas porque há interface |
| `class-content-restriction.php` | autorização de conteúdo no backend, antes de devolver artigo | Deve ser server-side; não basta ocultar conteúdo no frontend |
| `class-subscriber-portal.php` | subscrições, pagamentos e entitlement service | Modelos de assinatura/pagamento existem; validar integração Efi real |
| `class-weather-api.php` | integração backend com fornecedor meteorológico | Verificar endpoint, cache e credenciais antes de migrar |
| `class-capabilities.php` | middleware RBAC e política de autorização | `requireAuth` e `requireRole` existem |
| `class-admin.php` | endpoints de administração protegidos | Mapear cada operação da interface e garantir autorização |
| `class-activator.php` / `class-deactivator.php` | migrations Prisma + lifecycle de serviços | Não executar SQL WordPress; migrações devem ser explícitas |
| `class-url-normalizer.php` | utilitário TypeScript partilhado no backend | Portar regras e testes |
| `class-plugin.php` | removido após migração | Bootstrap exclusivo WordPress, sem papel no runtime novo |

Os ficheiros PHP originais devem ser preservados como referência até cada linha funcional estar portada e testada. Não podem ser carregados como se fossem módulos Node.

## Regras obrigatórias

1. **Uma única fonte de verdade:** PostgreSQL/Prisma para utilizadores, permissões, artigos, fontes, páginas, assinaturas, pagamentos, filas, auditoria e configurações operacionais.
2. **Next.js não liga diretamente à base de dados no browser.** Leitura/escrita sensível passa pelo backend autenticado; segredos nunca recebem prefixo `NEXT_PUBLIC_`.
3. **Não há mocks no produto:** remover dependências de `src/data/mockData.ts` das rotas que afirmam exibir dados vivos. Cada ação deve ter endpoint real, estados de erro e testes.
4. **Autorização no servidor:** sessão válida e papel consultado na base de dados; nunca confiar em role enviada pelo browser.
5. **Editorial:** IA pode recolher, sintetizar e propor; não aprova nem publica. Guardião sinaliza risco, guarda evidências e notifica revisores humanos.
6. **Proveniência:** artigo deve manter URL canónica, fonte, data e URL/crédito de imagem quando fornecido. Imagens remotas não devem ser copiadas sem autorização.
7. **Pagamentos:** checkout, webhooks, idempotência e estado de assinatura devem ser validados no backend; o frontend nunca declara pagamento concluído por conta própria.
8. **Migração sem perda:** preservar conteúdo, imagens, CSS e funcionalidades; comparar visual e comportamento antes de remover o tema WordPress.
9. **Deploy:** manter build atual até o Next passar CI e smoke tests; não alterar domínio/produção nem executar migrations de produção sem autorização explícita.

## Sequência de execução

### Fase 1 — inventário e linha de base
- Catalogar páginas, componentes, formulários, plugins, hooks, shortcodes, APIs e dependências de tabelas WordPress.
- Confirmar o que já existe em Express/Prisma e o que é apenas interface.
- Guardar screenshots e testes de comportamento atuais; marcar mocks e rotas sem endpoint.
- Confirmar branch e estado Git antes de qualquer remoção.

### Fase 2 — Next.js em paralelo
- Adicionar dependências/configuração Next e criar `src/app/layout.tsx`, páginas e layouts.
- Portar o header/footer/partes do tema para componentes React.
- Migrar uma rota por vez para dados reais da API, começando pela página inicial e artigo individual.
- Corrigir Firebase/Auth para variáveis `NEXT_PUBLIC_*` seguras e preservar o contrato do backend.
- Manter Vite como fallback até o Next completar os testes e build.

### Fase 3 — portabilidade do backend
- Implementar serviços TypeScript equivalentes para cada plugin, com validação, autorização, auditoria e testes.
- Completar endpoints em falta para fontes, páginas, pesquisa, fact-check, planos, assinaturas, contacto, newsletter e configurações.
- Eliminar acesso a tabelas WordPress e funções PHP.
- Validar que cada painel usa a mesma API e PostgreSQL.

### Fase 4 — verificação funcional
- `pnpm install`, validação Prisma, geração do client, typecheck backend, typecheck núcleo, testes e build Next.
- Testar login/logout/expiração de sessão, permissões, páginas, RSS, deduplicação, imagem/crédito, pesquisa, contacto, newsletter, alertas, checkout e webhooks.
- Verificar logs e healthcheck; executar teste sem mocks e com banco de teste.
- Fazer smoke test da pré-visualização Vercel e corrigir erros 404/redirects.

### Fase 5 — corte controlado
- Mudar o build/deploy para Next apenas depois de paridade e aprovação.
- Manter um commit de rollback documentado.
- Remover `wp-content` ativo só após cópia de referência validada e todas as funcionalidades passarem os testes.
- Confirmar que o worker continua a funcionar independentemente de acessos ao site.

## Critério de conclusão

A migração só é concluída quando o site corre em Next.js, todas as páginas e painéis usam a API real, as capacidades dos plugins foram portadas para TypeScript/Prisma, nenhum runtime depende de WordPress/PHP, CI passa, os fluxos críticos têm testes e a versão de produção foi explicitamente autorizada.
