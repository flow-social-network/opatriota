# Camadas de desenvolvimento

## 1. Sandbox de terminal
`TerminalSandbox` executa comandos no workspace com diretório confinado, limite de saída e timeout. Execução pela API exige aprovação (`NOTEAGENTS_AUTO_APPROVE=true` apenas em ambiente local controlado).

## 2. Editor com diff
- `POST /api/editor/read`
- `POST /api/editor/diff`
- `POST /api/editor/apply`

A aplicação exige `expectedContent` quando o cliente quer proteção contra conflito e a escrita exige aprovação.

## 3. Preview hot reload
- `POST /api/preview/start`
- `GET /api/preview/status`
- `POST /api/preview/stop`

O processo recebe `PORT` e roda em processo filho local. Para isolamento forte, use container/VM antes de expor a usuários não confiáveis.

## 4. GitHub OAuth
- `GET /api/github/oauth/start`
- `GET /api/github/oauth/callback`

Configure `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` e `GITHUB_REDIRECT_URI`. O token nunca é devolvido ao navegador; deve ser armazenado em cofre/secret store em produção.

## 5. Deploy Vercel
O `VercelDeployAdapter` usa a API oficial e exige token configurado no servidor. Deploy de produção deve passar por aprovação explícita. A validação real exige credenciais Vercel e um projeto conectado; sem isso não há declaração de deploy concluído.
