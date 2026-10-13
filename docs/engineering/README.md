# Engenharia — O Patriota

Documentação baseada no repositório atual. O sistema é um React/Vite com Vercel Functions em `api/`, contratos TypeScript em `packages/contracts` e persistência híbrida em Neon/document store/Blob conforme o módulo.

## Estado
- Autenticação editorial/admin: implementada no backend; teste E2E depende de conta autorizada e navegador funcional.
- Artigos: contratos e rotas existem; cobertura ponta a ponta ainda parcial.
- Financeiro: adaptadores Efi/Mercado Pago existem; sandbox e webhook precisam de evidência operacional.
- Mídia: Blob está configurado para alguns fluxos; biblioteca editorial completa ainda é lacuna.
- Conteúdo estático: `src/data/mockData.ts` e `src/data/pagesData.ts` são fontes demonstrativas/legado e não devem ser tratados como persistência de CMS.

## Documentos
- [Arquitetura](system-architecture.md)
- [Inventário de contratos](contracts-inventory.md)
- [API](api-reference.md)
- [Modelo de dados](data-model.md)
- [Autenticação](authentication-and-authorization.md)
- [Fluxo editorial](editorial-workflow.md)
- [Jornal digital](digital-newspaper.md)
- [Mídia](media-management.md)
- [Assinaturas e pagamentos](subscriptions-and-payments.md)
- [Integrações](external-integrations.md)
- [Auditoria de mocks](fallbacks-and-mocks-audit.md)
- [Lacunas](implementation-gaps.md)
- [Roadmap](implementation-roadmap.md)
- [Estratégia de testes](test-strategy.md)
- [Rastreabilidade](traceability-matrix.md)

Classificações são baseadas em código e testes executados, não somente na existência de componentes.
