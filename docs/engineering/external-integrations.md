# Integrações externas

- Neon/SQL: autenticação e persistência configuradas por variáveis do projeto.
- Blob: armazenamento de mídia/binários.
- Efi/Mercado Pago: pagamentos e webhooks.
- Firebase: serviços legados/auxiliares identificados no código; não deve haver mistura silenciosa de identidade.
- IA: somente executar quando provedor/modelo estiver configurado; sem resposta simulada.
- E-mail, analytics, social e media aparecem como categorias administrativas de integração.

Cada integração precisa de health check seguro, configuração mascarada, teste real e mensagem de dependência ausente. Credenciais nunca devem aparecer em logs ou documentação.
