# Inventário de funcionalidades e API

“Arquivo presente” não equivale a “funcionalidade operacional”.

| Área | Evidência | Estado nesta auditoria |
|---|---|---|
| Portal/React | `src/App.tsx`, `src/components/` | Presente, não testado |
| Dashboard admin | `src/components/AdminDashboard.tsx` na árvore | UI presente; autorização real não comprovada |
| Checkout | `api/checkout.ts` | Código presente; não testado |
| Planos | `api/plans.ts` | Código presente; não testado |
| Doações | `api/donation.ts` | Código presente; não testado |
| Billing | `api/_lib/billing.ts` | Código presente; não testado |
| Webhook pagamento | `api/webhooks/mercadopago.ts` | Código presente; autenticidade e idempotência a verificar |
| Contato | `api/contact-submissions.ts` | Código presente; persistência e anti-spam a verificar |
| Privacidade | `api/privacy-requests.ts` | Código presente; fluxo LGPD a verificar |
| Catch-all | `api/[...path].ts` | Código presente; rotas internas a inventariar |
| Push | `public/firebase-messaging-sw.js`, `public/sw.js` | Arquivos presentes; entrega não testada |
| RSS/fontes | `docs/SOURCES.md`, script de auditoria | Documentado; execução não testada |
| Meteorologia | script de auditoria e README | Documentado; chamada externa não testada |
| WordPress | descrito no README | Instalação não confirmada |
| Meta | evidência operacional insuficiente | Não confirmado |
| Neon | conexão/schema não testados | Não confirmado |
| NotebookLM | integração oficial não comprovada | Não confirmado |

## Para completar a referência endpoint a endpoint
Para cada rota, registrar método, caminho, autenticação, autorização, parâmetros, body, response, status, erros, validações, persistência, integrações, riscos e testes. Não inventar contratos sem inspecionar cada handler.
