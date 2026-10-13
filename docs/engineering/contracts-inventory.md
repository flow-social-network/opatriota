# Inventário de contratos

## Contratos compartilhados

| ID | Arquivo | Domínio | Estado real |
|---|---|---|---|
| AUTH-001 | `packages/contracts/src/auth/index.ts` | sessão, usuários, papéis | Implementado, não verificado ponta a ponta |
| ART-001 | `packages/contracts/src/articles/index.ts` | artigo, SEO, status editorial | Implementado, parcialmente verificado |
| FIN-001 | `packages/contracts/src/finance/index.ts` | checkout, plano, pagamento, webhook | Implementado, não verificado em sandbox |
| SYS-001 | `packages/contracts/src/index.ts` | push, newsletter, health | Parcialmente implementado |

## Domínios identificados
- Auth: login, registro, `auth/me`, logout e recuperação.
- Conteúdo: artigo, lista, detalhe, status editorial, auditoria e SEO.
- Financeiro: checkout, planos, pagamentos e webhook.
- Administrativo: anúncios, integrações, usuários, páginas, exportação e configurações em `api/[...path].ts`.
- Editorial: fontes, fila, mídia e workflow em `api/[...path].ts` e `DataContext`.

## Regra de classificação
Um contrato só será “implementado e verificado” quando houver resposta de API e efeito persistente confirmado. Tipos TypeScript isolados são “implementados, não verificados”.

## Lacunas
Não há atualmente uma especificação OpenAPI única. Os handlers condicionais de `api/[...path].ts` são a fonte operacional atual e precisam ser extraídos para documentação/validação automatizada.
