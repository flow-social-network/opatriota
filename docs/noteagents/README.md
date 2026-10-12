# NoteAgents

Especificação de engenharia para uma plataforma de desenvolvimento assistido por IA, inspirada nas capacidades públicas de ferramentas como v0.app, mas com implementação própria.

## Objetivo

Permitir que uma pessoa descreva uma aplicação em linguagem natural, envie imagens ou um repositório, veja um preview vivo, converse com agentes especializados, revise diffs, execute testes, conecte serviços externos e publique na Vercel.

## Documentos

- [Arquitetura](./01-ARQUITETURA.md)
- [Agentes, ferramentas e sandbox](./02-AGENTES-E-SANDBOX.md)
- [Integrações, dados e segurança](./03-INTEGRACOES-DADOS-E-SEGURANCA.md)
- [Produto, preview, Git e deploy](./04-PRODUTO-PREVIEW-GIT-E-DEPLOY.md)
- [Plano de implementação](./05-PLANO-DE-IMPLEMENTACAO.md)
- [PostgreSQL local](./06-BANCO-POSTGRESQL-LOCAL.md)
- [Prompt do instalador de banco](./PROMPT-INSTALADOR-BANCO.md)
- [Schema PostgreSQL](./database/schema.sql)
- [Utilitários integrados](./07-UTILITARIOS-INTEGRADOS.md)
- [Registro de importações](./imports/README.md)
- [MCP, LSP e Playwright](./08-MCP-LSP-PLAYWRIGHT.md)
- [Catálogo de ferramentas](./09-CATALOGO-FERRAMENTAS.md)

## Princípios

1. O agente nunca finge ter uma ferramenta ou integração que não está disponível.
2. Toda alteração de código tem diff, origem, autor e possibilidade de rollback.
3. Toda ação destrutiva, migração, push ou deploy de produção exige aprovação explícita.
4. Segredos nunca aparecem em prompts, logs, diffs ou respostas.
5. O backend é a autoridade para autorização, persistência e execução.
6. O preview é evidência de comportamento, não apenas uma compilação.

## Limites

Esta especificação descreve um produto equivalente em capacidades, não uma cópia de código, marca, infraestrutura privada ou implementação interna de qualquer plataforma proprietária.

## Stack de referência

- Frontend: Next.js ou React + TypeScript.
- API: Node.js + TypeScript, REST/SSE/WebSocket.
- Banco: PostgreSQL/Neon.
- Jobs: fila persistente; Redis somente para estado efêmero, cache ou rate limit.
- Execução: containers ou microVMs isoladas.
- Arquivos: object storage privado.
- IA: endpoint NVIDIA configurável por projeto.
- Deploy: Git provider + Vercel API.

## Critério de pronto

Uma feature só está pronta quando possui fluxo de erro, estados de carregamento, acessibilidade, testes automatizados, validação no preview e documentação operacional.

## Variáveis mínimas

`DATABASE_URL`, `BETTER_AUTH_SECRET`, `NVIDIA_API_KEY`, `VERCEL_TOKEN` e credenciais OAuth dos provedores Git, armazenadas no cofre de segredos. Os nomes são referências; valores nunca devem ser commitados.
