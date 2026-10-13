# Banco de dados — referência completa

## Fonte de verdade

O backend seleciona o provedor por configuração. PostgreSQL/Neon é o caminho recomendado e a fonte de verdade quando `DATABASE_URL` está configurada. Firestore é compatibilidade para deployments explicitamente configurados; disco local não é persistência aceitável para produção.

## Coleções/tabelas de domínio

### Identidade e segurança

- `users`: identidade, e-mail normalizado, nome, status, papel e timestamps.
- `sessions`: sessão, expiração, revogação e dispositivo.
- `auditLogs`: ator, ação, entidade, entidade afetada, antes/depois resumido, IP e timestamp.
- `invitations`: convite, papel, validade, aceite e revogação.

### Editorial

- `articles`: título, slug, linha fina, corpo sanitizado, editoria, autor, status editorial, status público, SEO, mídia, versão e aprovação.
- `articleVersions`: snapshot imutável da matéria, autor da versão, motivo e timestamp.
- `editorialQueue`: item ingerido, URL canônica, fonte, hash, status de triagem e responsável.
- `editorialSources`: nome, URL, tipo, periodicidade, ativo, última sincronização e erro.
- `assignments`: pauta, responsável, editor, prioridade, prazo e estado.
- `corrections`: artigo, versão, motivo, texto da correção e aprovação.
- `comments`: comentário, autor, status de moderação e artigo.

### Publicação e mídia

- `media`: pathname do Blob, tipo MIME, tamanho, checksum, alt text, legenda, crédito, copyright, autor do upload e status.
- `pages`: páginas institucionais, blocos, slug, publicação e revisão.
- `editions`: edição, data, capa, status, páginas e fechamento.
- `editionPages`: edição, ordem, modelo, conteúdo e revisão.

### Comercial

- `subscriptions`: coleção única de assinaturas; usuário, plano, gateway, status, período, externalId e timestamps.
- `plans`: plano, preço, periodicidade, acesso e ativo.
- `checkoutOrders`: pedido, usuário, itens, valor recalculado no servidor, gateway e estado.
- `paymentEvents`: evento externo idempotente, assinatura validada, payload mínimo e processamento.
- `donations`: doador, valor, campanha, gateway e status.
- `refunds`: pedido, motivo, valor, operador, gateway e status.

### Portal e comunicação

- `newsletterSubscriptions`: e-mail, consentimento, status e origem.
- `portalEvents`: page view, sessão, login, assinatura e origem, sem dados pessoais desnecessários.
- `advertisements`, `advertisementEvents`, `advertisingInquiries`.
- `pushSubscriptions`, `pushCampaigns`.

## Índices obrigatórios

- `users(email_normalized)` unique.
- `articles(slug)` unique; `(status, publishedAt)`; `(editorialStatus, updatedAt)`.
- `editorialQueue(canonicalUrl)` unique; `(status, discoveredAt)`.
- `media(checksum)` unique quando disponível.
- `subscriptions(userId, status)`; `checkoutOrders(userId, createdAt)`.
- `auditLogs(entityType, entityId, createdAt)`.

## Integridade

- Valores monetários em centavos inteiros ou numeric com escala definida; nunca confiar no total enviado pelo navegador.
- Status são enums validados no servidor.
- Exclusão editorial preferencialmente é arquivamento; retenção de auditoria é obrigatória.
- Relações devem ser por IDs estáveis, nunca por título ou índice visual.
- Migrações devem ser aditivas, reversíveis quando possível e nunca destrutivas sem autorização.
