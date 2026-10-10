# Banco de dados e integrações

## Persistência
Nesta sessão não foi possível confirmar banco ativo, schema remoto, migrações aplicadas, backup ou conexão de produção. Não afirmar que Neon/PostgreSQL está operacional sem teste e evidência.

Auditar dependências de banco, cliente, modelos, índices, restrições, transações, migrações, retenção, backups e restauração. Não conectar nem migrar produção sem autorização.

## Integrações identificadas
| Serviço | Evidência | Estado |
|---|---|---|
| Mercado Pago | `api/webhooks/mercadopago.ts`, `api/checkout.ts`, `api/_lib/billing.ts` | Código presente; credenciais e webhook não testados |
| Firebase/FCM | `.env.example`, `public/firebase-messaging-sw.js` | Arquivos/configuração presentes; envio real não verificado |
| RSS/fontes | `docs/SOURCES.md`, script de auditoria | Teste operacional pendente |
| Open-Meteo/INMET | descritos no README | Serviço externo não testado |
| Vercel | URL informada pelo usuário e API serverless no repo | Deployment não verificado |
| WordPress | descrito no README | Ambiente operacional não confirmado |
| Neon | nenhuma conexão ativa comprovada nesta auditoria | Não confirmado |
| Meta/Facebook | publicação real não comprovada | Não confirmado |
| NotebookLM | integração oficial não comprovada | Não confirmado |

## Regra
Uma dependência instalada ou variável presente não prova integração conectada. Para cada serviço, documentar autenticação, escopos, timeout, retries, idempotência, dados transmitidos, tratamento de falhas, ambiente de teste e evidência de operação.
