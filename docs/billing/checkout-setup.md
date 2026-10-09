# O PATRIOTA — Configuração do checkout

## Arquitetura implementada
- Interface de checkout: `src/components/pages/CheckoutWizard.tsx`
- Endpoint de criação de pedido: `api/checkout.ts`
- Webhook de pagamento: `api/webhooks/mercadopago.ts`
- Helpers de segurança e Firestore: `api/_lib/billing.ts`
- Pedidos: coleção Firestore `checkoutOrders`
- Assinaturas confirmadas: coleção Firestore `subscriptions`

## Configurar secrets na Vercel
Adicionar no projeto Vercel (sem colocar valores no GitHub):
- `MERCADOPAGO_ACCESS_TOKEN`: access token da conta Mercado Pago.
- `MERCADOPAGO_WEBHOOK_SECRET`: segredo configurado para assinar os webhooks.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: JSON da conta de serviço Firebase Admin, armazenado como secret de servidor.
- `FIREBASE_WEB_API_KEY`: chave Web do Firebase para validar tokens ID via Identity Toolkit.
- `PUBLIC_SITE_URL`: URL HTTPS canônica da implantação.

Também é necessário configurar as variáveis `VITE_FIREBASE_*` usadas pelo frontend. Nunca colocar access token do Mercado Pago nem chave privada Firebase em variáveis `VITE_*`.

## Mercado Pago
1. Começar com credenciais de teste.
2. Configurar o webhook de pagamentos para `https://SEU-DOMINIO/api/webhooks/mercadopago`.
3. Copiar o segredo fornecido pelo painel do Mercado Pago para `MERCADOPAGO_WEBHOOK_SECRET`.
4. Confirmar o formato de assinatura e eventos habilitados no painel atual da conta.
5. Testar pagamentos pendentes, aprovados, recusados, cancelados, reembolsados e notificações repetidas antes de liberar produção.

O backend calcula os preços usando seu catálogo de servidor, e não confia no valor enviado pelo navegador. O cartão é processado pelo checkout hospedado do Mercado Pago.

## Firebase / Firestore
Ative Firestore no projeto e conceda à conta de serviço apenas as permissões necessárias. As coleções de cobrança devem ter regras que impeçam clientes de criar ou alterar pedidos e assinaturas diretamente. O estado financeiro só deve ser alterado no backend depois de consultar a API do provedor e validar a notificação.

## Catálogo e preço
O catálogo do backend em `api/_lib/billing.ts` precisa permanecer alinhado com `src/data/mockData.ts`. Antes de publicar mudança de preço, confira mensalidade, anualidade, descontos, fidelidade e condições comerciais exibidas ao leitor.

## Limitações/pendências para lançamento
- A implantação só fica operacional depois de configurar todos os secrets acima.
- Visitantes sem sessão podem criar pedido com nome/e-mail, mas a assinatura automática só é vinculada a UID Firebase autenticado. Para evitar apropriação de conta, o fluxo de convidados precisa de verificação segura de e-mail/identidade antes de vincular benefícios.
- O plano gratuito não deve passar pelo gateway; precisa de fluxo de cadastro e consentimento separado.
- Verifique a política de reembolso, cancelamento e renovação automática e publique os termos correspondentes.
- Antes de cobrar clientes reais, valide o webhook com eventos reais de teste, permissões Firestore, logs, alertas, limites de requisição e fluxo de suporte.
