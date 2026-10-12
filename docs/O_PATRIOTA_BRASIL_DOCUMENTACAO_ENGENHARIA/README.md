# O Patriota Brasil — documentação de engenharia
Data: 10/10/2026. Repositório: `flow-social-network/opatriota`.
Referência acessível: `main`, árvore Git commit `6f163f645fba855825b1ac8a6405390fc32c6bcf`.
A branch solicitada anteriormente `feature/efi-assinaturas` retornou 404 ao buscar conteúdo nesta sessão. Portanto, esta documentação não deve ser tratada como auditoria exaustiva daquela branch.

## Documentos
- `AUDIT_REPORT.md`: resumo, limites e estado.
- `ARCHITECTURE.md`: arquitetura e diagramas.
- `FEATURE_API_INVENTORY.md`: funcionalidades e endpoints identificados.
- `SECURITY_AUTH.md`: autenticação e segurança.
- `DATABASE_INTEGRATIONS.md`: persistência e integrações.
- `DEPLOYMENT_TESTING.md`: deploy, testes e erro 404.
- `REMEDIATION_RUNBOOK.md`: prioridades e procedimentos.
- `TRACEABILITY.md`: evidências e pendências.
- `AI_HANDOFF.md`: instruções de execução para uma IA, critérios de pronto e relatório obrigatório.
- `API_CONTRACTS.md`: inventário de handlers, regras de contrato e matriz de testes.
- `OPERATIONS_CHECKLIST.md`: checklists de merge, produção, pós-deploy e incidentes.

**Escopo:** documentação de engenharia baseada na árvore acessível e nas evidências registradas. A documentação não substitui execução de build, testes, deploy, migrações ou validação em provedores externos. O estado de cada item deve ser atualizado somente com evidência verificável.

**Roteiro recomendado para uma IA:** começar por `AI_HANDOFF.md`, conferir `AUDIT_REPORT.md`, completar os contratos em `API_CONTRACTS.md`, executar o `OPERATIONS_CHECKLIST.md` e atualizar `TRACEABILITY.md` com comandos, commit, ambiente e resultados.

**Regra de segurança:** esta documentação não autoriza acesso a produção, migrações destrutivas, publicação de conteúdo ou alteração de pagamentos.
