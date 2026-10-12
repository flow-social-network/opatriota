# NoteAgents no computador local

## Preparação

```bash
cp docs/noteagents/.env.example docs/noteagents/.env.local
# preencha NVIDIA_API_KEY no arquivo local
pnpm install
```

A chave é lida apenas pelo servidor. Ela nunca é enviada para o navegador.

## Executar

Em dois terminais:

```bash
pnpm noteagents:server
pnpm noteagents:web
```

Abra `http://127.0.0.1:8790`. O servidor de agentes fica em `127.0.0.1:8787` e o Vite encaminha `/api` para ele.

## Serviços externos

O instalador prepara Node, pnpm, diretórios de workspace e configuração, mas não instala Docker, navegador, GitHub OAuth ou credenciais automaticamente. Esses serviços precisam de permissões do sistema e contas do usuário. Os adaptadores ficam em `adapters/` e falham de forma explícita quando uma variável não está configurada.

## NVIDIA

O catálogo inicial contém modelos NVIDIA NIM compatíveis e gratuitos conforme disponibilidade do endpoint. A disponibilidade, limite e preço podem mudar; o servidor usa o modelo selecionado no chat e retorna erro sem vazar a chave quando a API não estiver configurada.
