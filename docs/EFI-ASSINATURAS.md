# O PATRIOTA — Integração Efí e liberação de assinatura

A especificação de implementação está em [server/EFI-PAYMENTS.md](../server/EFI-PAYMENTS.md) e o módulo inicial em [server/efi-payment.ts](../server/efi-payment.ts).

A Efí envia um token de notificação e o integrador deve consultar a API para obter o histórico de estados. Por isso, a página de retorno do checkout nunca ativa o acesso sozinha.

Fontes oficiais:
- [Efí API Cobranças — Link de pagamento](https://dev.efipay.com.br/docs/api-cobrancas/link-de-pagamento/)
- [Efí API Cobranças — Notificações](https://dev.efipay.com.br/docs/api-cobrancas/notificacoes/)
- [Efí API Cobranças — Assinatura recorrente](https://dev.efipay.com.br/docs/api-cobrancas/assinatura/)

Este módulo ainda exige a implementação do adaptador de persistência de produção, a ligação ao middleware de autenticação real, a instalação das rotas no servidor Express e os testes de homologação. Não habilitar produção antes de concluir esses itens.
