# Catálogo de ferramentas do NoteAgents

O NoteAgents usa ferramentas locais e conectores remotos por adaptadores MCP. A prioridade não concede acesso automático: cada operação passa pela política de permissões.

## Essenciais

- Filesystem: leitura e escrita confinadas ao workspace.
- Git: status, diff, histórico e operações de escrita com aprovação.
- Playwright: abrir preview, snapshot, interação e screenshot.
- LSP/TypeScript: diagnósticos, símbolos e typecheck.
- Servidor MCP próprio: expõe recursos, tools e prompts por STDIO ou HTTP.

## Alta prioridade

Fetch, Memory/Knowledge Vault, PostgreSQL, scanners de segurança, GitHub e deploy. Serviços remotos devem usar credenciais mínimas e nunca receber segredos no prompt.

## Execução local recomendada

```bash
pnpm install
pnpm noteagents:install-browser
pnpm noteagents:mcp
# ou
pnpm noteagents:mcp:http
```

O transporte HTTP escuta apenas em `127.0.0.1`. Para produção, adicione autenticação, TLS e uma store de sessões antes de expor o endpoint.

## Ciclo de validação

1. Inspecionar arquivos via Filesystem/LSP.
2. Planejar com o orquestrador.
3. Alterar somente após aprovação quando houver escrita.
4. Executar typecheck, testes e scanners.
5. Validar a UI com Playwright.
6. Criar diff/evidência e solicitar aprovação para Git/deploy.
