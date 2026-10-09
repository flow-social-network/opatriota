# O PATRIOTA — Arquitetura de dados e administração

## Decisão de arquitetura

O PATRIOTA usará uma API de backend independente da interface React/Vite, com:

- **Neon PostgreSQL como banco transacional principal**: usuários, permissões, artigos, editorias, pautas, revisão, assinaturas, cobranças Efí, eventos idempotentes e auditoria.
- **MongoDB como armazenamento complementar opcional**: documentos semiestruturados de ingestão de fontes, payloads normalizados, resultados de extração e dados flexíveis que não sejam fonte de verdade financeira/editorial. Guardar apenas payloads necessários, sanitizados e com política de retenção.
- **Administração de banco**: Neon Console ou pgAdmin para PostgreSQL; MongoDB Atlas UI ou MongoDB Compass para MongoDB. Adminer pode ser usado para PostgreSQL e outros bancos SQL, conforme a versão. **phpMyAdmin administra MySQL/MariaDB; não administra PostgreSQL nem MongoDB.**
- **PHP**: pode ser usado para um painel administrativo independente, se necessário, consumindo a API autenticada. Não usar PHP para conectar diretamente do navegador ao banco. Se o sistema for WordPress, o banco nativo do WordPress continua sendo MySQL/MariaDB; Neon PostgreSQL não é um substituto direto para o banco do WordPress.

## Fonte de verdade

PostgreSQL é a fonte de verdade para contas, perfis e papéis; artigos, estados editoriais e histórico; planos, pedidos, cobranças Efí, concessões de assinatura, eventos processados e auditoria.

MongoDB não pode ser fonte de verdade para pagamentos nem para estado de acesso. Se MongoDB estiver indisponível, pagamentos, concessões e publicação devem continuar coerentes no PostgreSQL.

## Contratos de integração

- A API valida a identidade e a permissão do usuário antes de ler ou alterar dados.
- O frontend nunca recebe credenciais de banco.
- A API usa conexões TLS, pool de conexões PostgreSQL e variáveis de ambiente secretas.
- Operações financeiras usam transações SQL, chaves únicas e idempotência.
- Eventos Efí são confirmados consultando a API oficial; nunca se concede acesso apenas por retorno do checkout.
- O estorno confirmado revoga somente a concessão ligada à cobrança estornada, mantendo o histórico e recalculando o acesso efetivo.
- A sincronização PostgreSQL–MongoDB, se necessária, será assíncrona e recuperável; nunca fingir uma transação distribuída.

## Variáveis de ambiente

```dotenv
DATABASE_URL=
MONGODB_URI=
MONGODB_DATABASE=opatriota
EFI_CLIENT_ID=
EFI_CLIENT_SECRET=
EFI_SANDBOX=true
EFI_NOTIFICATION_URL=
APP_BASE_URL=
```

Nunca comitar valores reais. Usar `.env.example` apenas com campos vazios ou valores demonstrativos.

## Modelo PostgreSQL mínimo

- `users`, `roles`, `user_roles`
- `articles`, `categories`, `article_revisions`
- `assignments`, `editorial_reviews`
- `sources`, `source_runs`, `imported_items`, `duplicate_candidates`
- `fact_checks`, `fact_check_evidence`
- `plans`, `payment_orders`, `provider_events`, `subscription_entitlements`
- `newsletter_subscribers`, `audit_events`

Cada tabela deve ter chaves primárias, relações, índices e timestamps. Valores monetários devem ser armazenados em centavos inteiros ou NUMERIC apropriado, nunca float.

## Painéis de administração

1. **Painel editorial**: usar API e permissões do jornal para artigos, fontes, pauta, revisão e assinatura.
2. **Neon Console/pgAdmin**: administração técnica de PostgreSQL, restrita a operadores autorizados.
3. **MongoDB Atlas UI/Compass**: inspeção técnica dos documentos, com acesso restrito.
4. **PHP Admin opcional**: interface administrativa que consome a API; não expor credenciais nem liberar SQL arbitrário a usuários editoriais.

## Critérios para produção

- Migrations versionadas e executadas em pipeline controlado.
- Backups e teste de restauração.
- Testes de contrato e integração.
- Segregação entre desenvolvimento, homologação e produção.
- Privilégios mínimos para cada credencial.
- Auditoria de alterações administrativas.
- Política de retenção e LGPD.
- Testes de pagamento aprovado, pendente, falha, webhook duplicado e estorno.
