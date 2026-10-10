# Matriz de rastreabilidade e evidências

| Requisito | Evidência | Testado nesta sessão? | Estado |
|---|---|---|---|
| Build | `package.json` | Não | Comando conhecido, resultado pendente |
| Checkout | `api/checkout.ts` | Não | Código presente |
| Billing | `api/_lib/billing.ts` | Não | Código presente |
| Planos | `api/plans.ts` | Não | Código presente |
| Doações | `api/donation.ts` | Não | Código presente |
| Webhook | `api/webhooks/mercadopago.ts` | Não | Segurança a confirmar |
| Privacidade | `api/privacy-requests.ts` | Não | Fluxo LGPD a confirmar |
| Push | `public/firebase-messaging-sw.js`, `public/sw.js` | Não | Entrega real pendente |
| Fontes | `scripts/test-sources-policy-audit.ts` | Não | Script presente |
| Meteorologia | `scripts/test-meteorology-audit.ts` | Não | Script presente |
| Web push | `scripts/test-web-push-audit.ts` | Não | Script presente |
| CI | `.github/workflows/validate.yml` | Não | Resultado não consultado |
| Banco | Configuração/runtime | Não | Não confirmado |
| Autorização admin | todos os handlers/middlewares | Não | Não confirmada integralmente |
| Deploy | URL Vercel reportada | Não | 404 relatado, causa desconhecida |

## Evidências consultadas
- GitHub: `flow-social-network/opatriota`
- Árvore Git: `6f163f645fba855825b1ac8a6405390fc32c6bcf`
- README e `package.json` da branch padrão `main`.
- Árvore recursiva mostrando `api/`, `docs/`, `public/`, `scripts/`, `src/`.
- Mensagem do usuário relatando 404.

## Limitações
Não foi lida a branch `feature/efi-assinaturas` (404 ao buscar arquivos por ref), não houve acesso ao painel Vercel, banco de produção, credenciais, execução de testes nem auditoria completa de cada handler.
