# Importações do NoteAgents

Os diretórios desta pasta são referências e módulos selecionados, não dependências cegamente executadas.

## Fontes

- `everything-claude-code`: agentes, skills, comandos, regras, hooks e scripts.
- `claude-settings`: configurações e capacidades compatíveis, sem chaves.
- `awesome-claude-skills`: catálogo de skills.
- `agentsys`: metadados de orquestração.
- `notebooklm-mcp`: fonte do conector MCP do NotebookLM.
- `obsidian-mind`: padrões de memória e vault.
- `awesome-claude-code`: catálogo e utilitários de auditoria/curadoria.
- `noteagents-reference`: referência de runtime, agentes, CLI, auditoria, cache, locks e evidências.

## Integração

O runtime principal usa `../registry.ts` para descobrir capacidades. O registro apenas lista arquivos e exige aprovação para comandos, MCPs e operações de risco. Nenhum arquivo importado recebe acesso automático a segredos, produção ou fora do workspace.

Use `GET /api/capabilities` para conferir o inventário. Consulte `../07-UTILITARIOS-INTEGRADOS.md` para os padrões adotados.

## Segurança e manutenção

- Não copie `.env`, tokens, `node_modules` ou diretórios de build.
- Mantenha licenças e avisos dos projetos de origem.
- Atualize referências manualmente após revisar mudanças.
- Execute auditoria, type-check e testes antes de ativar uma capacidade.
