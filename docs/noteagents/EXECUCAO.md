# Executar o núcleo NoteAgents

O diretório contém um núcleo executável independente, sem depender do frontend do O Patriota.

```bash
pnpm exec tsx docs/noteagents/server/http-server.ts
```

Endpoints locais:

- `GET /health`
- `GET /api/agents`
- `GET /api/runs`
- `POST /api/runs` com `{ "agent": "frontend", "prompt": "..." }`

O núcleo inclui runtime de agentes, catálogo de especialistas, barramento de eventos, fila de jobs, ferramentas de filesystem com confinamento ao workspace, políticas de aprovação e servidor HTTP mínimo.

## Limites importantes

Este é o núcleo de referência executável e seguro para evolução. Preview real com containers, deploy Vercel, GitHub OAuth, banco remoto, NVIDIA e navegador automatizado precisam de adaptadores de produção; não são falsificados por este pacote. Substitua cada adaptador por credenciais e serviços reais antes de expor o servidor à internet.

Nunca execute o servidor sem autenticação em rede pública. Adicione autenticação, rate limiting, isolamento por projeto, logs de auditoria e secrets manager no próximo estágio.
