# Importações do NoteAgents

Este diretório contém adaptadores e conhecimento importados dos seis arquivos fornecidos pelo usuário.

## Componentes
- `everything-claude-code`: agentes, skills, comandos, regras, hooks e scripts de workflow.
- `claude-settings`: agentes e skills complementares, sem segredos.
- `obsidian-mind`: memória baseada em vault, hooks e agentes de conhecimento.
- `notebooklm-mcp`: código-fonte de referência para um conector MCP local do NotebookLM.
- `agentsys`: metadados de agentes e skills de orquestração.
- `awesome-claude-skills`: catálogo de skills para descoberta.

O runtime do NoteAgents não executa esses arquivos automaticamente. O registro seguro em `../registry.ts` faz a descoberta, valida permissões e exige aprovação antes de executar scripts ou ferramentas importadas. Revise as licenças MIT e as advertências de cada projeto antes de redistribuir.
