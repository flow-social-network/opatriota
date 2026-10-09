# Efí Pay — contratos de pagamento e assinaturas

## Objetivo
O backend cria uma cobrança hospedada pela Efí e concede a assinatura somente depois de consultar a notificação na API oficial. O redirecionamento de sucesso do checkout não é prova de pagamento.

## Rotas do módulo
- `POST /api/v1/payments/checkout` — autenticado; body `{ "planId": "mensal" | "anual" }`; devolve `orderId`, `paymentUrl` e estado `pending`.
- `POST /api/v1/payments/webhook` — recebe o token `notification` da Efí, consulta a API e aplica eventos de forma idempotente.
- `GET /api/v1/subscriptions/me` — deverá devolver o estado atual da assinatura do utilizador autenticado.
- `POST /api/v1/subscriptions/cancel` — deverá cancelar a renovação, quando existir recorrência ativa.
- `POST /api/v1/admin/payments/:chargeId/reconcile` — operação administrativa auditada para reconciliar o estado consultando a Efí.

## Regras de negócio
1. Criar pedido pendente antes de chamar a Efí.
2. Guardar `charge_id`, URL de pagamento, plano, utilizador, valor esperado e moeda.
3. Confirmar o valor, a cobrança e o estado consultado no fornecedor antes de conceder acesso.
4. Evento `paid`: ativar/estender a assinatura de acordo com o plano e a política de renovação.
5. Evento de estorno confirmado: revogar a concessão associada à cobrança estornada e recalcular o acesso. Não apagar o histórico.
6. Notificações repetidas não podem estender o prazo nem executar a revogação duas vezes.
7. `waiting`, `new`, `link` e `unpaid` nunca liberam acesso.
8. Um estorno de uma cobrança anterior não deve cancelar automaticamente uma nova cobrança válida. A concessão de acesso deve estar vinculada à cobrança que a originou.
9. Falha ou timeout do fornecedor deixa o pedido pendente e permite reconciliação posterior.

## Persistência exigida
Criar tabelas com índices únicos:
- `payment_orders`: order_id, user_id, plan_id, charge_id único, valor em centavos, moeda, estado, datas.
- `provider_events`: event_key único, charge_id, status, payload sanitizado, data de processamento.
- `subscription_entitlements`: user_id, order_id, starts_at, ends_at, status.
- `subscriptions`: estado consolidado e referência à assinatura Efí, se for usada cobrança recorrente.

A implementação de `SubscriptionStore` deve usar transações de banco para persistir o evento e alterar a concessão atomicamente. Não usar memória local ou arquivo JSON como banco de produção.

## Configuração
- `EFI_CLIENT_ID`
- `EFI_CLIENT_SECRET`
- `EFI_SANDBOX=true` para homologação; `false` apenas após testes e habilitação na conta Efí
- `EFI_NOTIFICATION_URL=https://seu-dominio/api/v1/payments/webhook`
- `DATABASE_URL`
- `APP_BASE_URL`

Credenciais nunca devem ser enviadas ao frontend ou commitadas no Git.

## Importante sobre estorno
O módulo recebe eventos confirmados pela consulta da notificação Efí. Antes de produção, confirmar com a API/SDK Efí os estados específicos de estorno e contestação habilitados para a modalidade de cobrança da conta, e implementar a reconciliação de pagamentos. Para iniciar um estorno financeiro, deve existir uma operação administrativa separada que chame o endpoint de estorno da modalidade usada; revogar acesso não estorna dinheiro por si só.

## Homologação obrigatória
- checkout aprovado, recusado, aguardando e expirado;
- webhook duplicado e fora de ordem;
- token inválido;
- cobrança com valor divergente;
- estorno da cobrança ativa;
- estorno de cobrança antiga após nova renovação;
- indisponibilidade da Efí e repetição de notificação;
- autorização: utilizador A não consegue consultar ou alterar a assinatura do utilizador B.
