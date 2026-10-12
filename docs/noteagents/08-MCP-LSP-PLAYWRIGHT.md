# MCP, LSP e Playwright

O NoteAgents usa três camadas locais:

- **MCP**: expõe tools, resources e prompts para clientes MCP via STDIO.
- **Playwright**: abre previews, lê a página, clica, preenche campos e captura screenshots.
- **LSP**: fornece diagnósticos básicos e executa `tsc --noEmit` no workspace.

## Instalação

```bash
pnpm install
pnpm noteagents:install-browser
```

## Executar o servidor MCP

```bash
NOTEAGENTS_WORKSPACE=/caminho/do/projeto pnpm noteagents:mcp
```

A configuração pronta está em `mcp/config.json`. O cliente MCP deve iniciar o comando usando STDIO.

## Segurança

O resource de workspace bloqueia path traversal. Ações de edição, terminal, Git e deploy devem continuar passando pela política de aprovação do runtime. URLs do Playwright devem ser fornecidas explicitamente; não existe navegação arbitrária para rede interna por padrão.

## Ferramentas expostas

- `workspace_list`
- `browser_open`
- `browser_screenshot`

O prompt `implement` orienta o agente a inspecionar, alterar minimamente e validar com LSP, testes e Playwright.
