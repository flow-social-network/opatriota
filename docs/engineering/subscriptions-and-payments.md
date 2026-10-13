# Assinaturas e pagamentos

Contratos em `packages/contracts/src/finance/index.ts` cobrem planos, checkout, pagamentos e webhooks. Provedores declarados: Efi e Mercado Pago.

Regras: preço e quantidade devem ser recalculados server-side; checkout precisa de idempotência; status final depende de webhook/consulta server-side; sandbox é obrigatório para teste; jornalista não recebe acesso financeiro por autenticação comum.

Estado: adaptadores e endpoints existem parcialmente. Não há evidência suficiente para classificar checkout, webhook, reembolso e conciliação como verificados ponta a ponta.
