# Relatório de auditoria

## Referência e limitações
- Repositório: `flow-social-network/opatriota`
- Branch acessível: `main`
- Commit da árvore consultada: `6f163f645fba855825b1ac8a6405390fc32c6bcf`
- A branch `feature/efi-assinaturas` não pôde ser lida por ref (404 nesta consulta).
- O README descreve portal jornalístico com WordPress FSE/plugin editorial e aplicação React. A árvore consultada contém também APIs serverless em `api/`.

## Evidências localizadas
- `package.json`: React, React DOM, Vite, TypeScript, Express e Firebase como dependências; scripts `dev`, `build`, `preview`, `lint`.
- API: `api/[...path].ts`, `api/checkout.ts`, `api/plans.ts`, `api/donation.ts`, `api/contact-submissions.ts`, `api/privacy-requests.ts`, `api/webhooks/mercadopago.ts`, `api/_lib/billing.ts`.
- CI: `.github/workflows/validate.yml`.
- Push: `public/firebase-messaging-sw.js`, `public/sw.js`.
- Scripts: `scripts/test-meteorology-audit.ts`, `scripts/test-sources-policy-audit.ts`, `scripts/test-web-push-audit.ts`.
- Documentação pré-existente: `docs/ARCHITECTURE.md`, `DEPLOYMENT.md`, `EDITORIAL-WORKFLOW.md`, `FRONTEND-BACKEND-CONTRACT.md`, `INSTALLATION.md`, `SECURITY.md`, `SOURCES.md`, entre outras.

## Estado por domínio
| Domínio | Estado |
|---|---|
| React/Vite frontend | Código presente; build não executado |
| API serverless | Handlers presentes; testes end-to-end não executados |
| Checkout / doações / planos | Código presente; operação real não verificada |
| Webhook Mercado Pago | Arquivo presente; assinatura/idempotência precisam ser verificadas |
| Firebase/FCM | Arquivos presentes; credenciais e entrega real não testadas |
| RSS/fontes | Documentação e scripts presentes; execução não testada |
| Meteorologia | Documentação/script presentes; serviço externo não testado |
| WordPress | Descrito no README; instalação operacional não confirmada |
| Neon/PostgreSQL | Conexão ativa/schema não confirmados |
| Meta/Facebook | Publicação real não comprovada nesta consulta |
| NotebookLM | Integração oficial operacional não comprovada |
| Autorização de admin | Não confirmada integralmente em todos os endpoints |
| Vercel | Painel/logs não acessados |

## Testes
Nenhum build, lint, teste automatizado ou integração foi executado nesta sessão. Workflow presente não significa CI aprovada.

## Conclusão
É uma documentação inicial baseada em evidências acessíveis, não uma declaração de prontidão para produção. Para concluir a auditoria, é necessário acessar a branch correta, percorrer todos os handlers, executar testes seguros e validar Vercel, banco e provedores em seus ambientes próprios.
