# API — referência completa

Base: `/api`. A função principal está em `api/[...path].ts` e usa cookies de sessão. Todos os endpoints devem responder JSON, validar entrada e retornar códigos HTTP consistentes.

## Saúde

- `GET /health` — público; retorna status do serviço e timestamp.

## Autenticação pública

- `POST /auth/register` — cria conta pública após validar nome, e-mail, senha e consentimento.
- `POST /auth/login` — autentica usuário público e grava cookie de sessão.
- `GET /auth/me` — retorna identidade da sessão pública.
- `POST /auth/logout` — invalida sessão pública.

## Autenticação editorial

- `POST /editorial/auth/login` — autentica jornalista/editor/administrador.
- `GET /editorial/auth/me` — retorna identidade editorial.
- `POST /editorial/auth/logout` — encerra sessão editorial.

## Conteúdo

- `GET /articles` — público recebe somente publicados; equipe autenticada recebe a base editorial.
- `POST /articles` — cria matéria; requer papel editorial.
- `GET /articles/:id` — consulta matéria com autorização conforme status.
- `PATCH /articles/:id` — atualiza matéria e registra `updatedBy`.
- `DELETE /articles/:id` — arquiva/remove conforme política de retenção.
- `GET|POST|PATCH|DELETE /pages` — páginas institucionais e editoriais.
- `GET|POST|PATCH|DELETE /editions` — edições do jornal digital.
- `GET|POST|PATCH|DELETE /media` — metadados de mídia; o binário deve ser servido pelo storage autorizado.

## Redação

- `GET /editorial/sources` — fontes configuradas.
- `GET /editorial/queue` — fila de triagem.
- `POST /editorial/queue/ingest` — ingere fontes configuradas e deduplica por URL canônica.
- `GET /editorial/stats` — indicadores editoriais.
- `GET /editorial/health` — saúde operacional, sem afirmar integração não verificada.

## Administração

- `GET|POST /admin/integrations` — configura integrações autorizadas.
- `POST /admin/integrations/:id/test` — testa uma integração sem expor segredo.
- `GET|POST|PATCH|DELETE /admin/advertising/ads` — anúncios.
- `GET /admin/advertising/metrics` — métricas de anúncios.
- `GET /admin/analytics/summary` — resumo de audiência para administradores.
- `GET /admin/push/campaigns` — campanhas de notificações.

## Assinaturas e pagamentos

- `GET /plans` — planos ativos.
- `GET /orders` — pedidos do usuário autenticado.
- Webhooks de pagamento devem validar assinatura HMAC antes de alterar `subscriptions` ou `checkoutOrders`.

## Regras de resposta

| Situação | Código | Corpo mínimo |
|---|---:|---|
| sucesso de leitura | 200 | recurso ou lista |
| criação | 201 | recurso criado |
| atualização | 200 | recurso atualizado |
| remoção | 204 | sem corpo |
| entrada inválida | 400 | `error`, `message`, `fields` |
| não autenticado | 401 | `UNAUTHENTICATED` |
| sem permissão | 403 | `FORBIDDEN` |
| não encontrado | 404 | código específico |
| falha de integração | 502/503 | erro operacional sem segredo |

## Regras de implementação

- Não usar dados mock como fallback silencioso de API.
- Não aceitar `role`, `uid`, `approvedBy` ou `status=published` vindos do cliente sem política server-side.
- Validar payload com schema compartilhado antes da persistência.
- Sanitizar HTML editorial antes de renderizar.
- Paginar listas potencialmente grandes.
- Registrar correlação de requisição e auditoria sem dados sensíveis.
