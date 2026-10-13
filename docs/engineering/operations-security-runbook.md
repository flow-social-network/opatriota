# Operações, segurança e publicação

## Variáveis

Segredos ficam somente no ambiente do projeto. Nunca usar prefixo `VITE_` para segredo. Variáveis principais: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, credenciais do provedor de autenticação, `BLOB_READ_WRITE_TOKEN` e credenciais de gateways/integrations.

## Deploy

1. Rodar `pnpm lint`.
2. Rodar `pnpm build`.
3. Rodar `pnpm test`.
4. Executar testes de contrato e integração contra banco de teste.
5. Revisar migrações e variáveis do ambiente de destino.
6. Publicar branch/PR; nunca publicar diretamente em produção sem aprovação.
7. Verificar `/api/health`, login, leitura pública e uma operação editorial não destrutiva.

## Segurança

- Sessões HttpOnly, Secure em HTTPS, SameSite adequado e origem confiável.
- Autorização server-side por papel e, quando necessário, por recurso.
- Rate limit para login, ingestão, upload, newsletter e webhooks.
- Sanitização de HTML, validação de URL e limites de payload.
- Upload permite somente tipos, dimensões e tamanhos aprovados; conteúdo privado nunca usa URL pública.
- Webhooks validam assinatura HMAC e idempotência.
- Logs não devem conter senha, token, cookie, cartão ou payload integral de pagamento.

## Incidentes

1. Identificar rota, horário, usuário técnico e correlation ID.
2. Preservar logs e estado sem alterar produção manualmente.
3. Verificar saúde do banco, autenticação, storage e gateway.
4. Suspender publicação automática se houver risco editorial.
5. Corrigir por PR, testar e registrar causa raiz.
6. Fazer rollback somente com autorização e plano de recuperação.

## Definição de pronto

Uma funcionalidade CMS está pronta somente após persistir, autorizar, atualizar, recarregar, listar novamente, registrar auditoria e possuir tratamento de erro verificável.
