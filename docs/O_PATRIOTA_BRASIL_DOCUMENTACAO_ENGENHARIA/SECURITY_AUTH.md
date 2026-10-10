# Segurança e autenticação

## Estado
A aplicação possui frontend e handlers de API. A autorização completa de cada endpoint não foi comprovada nesta leitura. Não se deve inferir segurança porque menus estão escondidos ou existe login.

## Verificações obrigatórias
- Como o token/sessão é verificado no servidor.
- Expiração, renovação, logout e revogação.
- Autorização server-side por função e por recurso.
- Proteção contra IDOR e escalada de privilégios.
- CORS restrito, CSRF quando aplicável, rate limiting e proteção contra brute force.
- Validação de entradas e limites de payload.
- XSS, injection, SSRF, path traversal e uploads.
- Webhook Mercado Pago: validação conforme documentação oficial, replay e idempotência.
- Não confiar em preço/status enviados pelo browser.
- Segredos fora do bundle e de logs; não usar `VITE_*` para chaves privadas.
- Respostas de erro sem stack traces em produção.

## Testes negativos
Token inválido deve falhar; usuário sem permissão deve receber acesso negado; usuário não deve ler/alterar recurso alheio; webhook adulterado deve ser rejeitado; evento duplicado não pode duplicar transação; conta desativada deve perder acesso.
