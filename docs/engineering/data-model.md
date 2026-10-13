# Modelo de dados

## Entidades contratuais
- `Article`: título, subtítulo, conteúdo, categoria, autor, status, publicação, SEO, imagem e auditoria.
- `EditorialUser`/sessão: identidade, papel, permissões e expiração.
- `CheckoutOrder`, `PaymentRecord`, `SubscriptionPlan`, `WebhookEvent`.
- Documentos administrativos: anúncios, integrações, páginas, fontes, eventos e notificações.

## Persistência
A persistência operacional é encapsulada por `api/_lib/storage.ts` e helpers específicos. O schema real deve ser consultado antes de migrations; nenhuma migration destrutiva foi executada.

## Integridade
- IDs devem ser estáveis.
- Mutação editorial deve registrar autor, timestamp e status anterior/novo.
- Webhooks precisam ser idempotentes por `eventId`.
- Conteúdo publicado precisa preservar versão aprovada.
- Binários devem ficar em storage, metadados no banco/document store.
