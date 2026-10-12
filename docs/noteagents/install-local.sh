#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
command -v node >/dev/null || { echo 'Node.js 20+ é obrigatório'; exit 1; }
command -v pnpm >/dev/null || { echo 'pnpm é obrigatório'; exit 1; }
pnpm install
mkdir -p .noteagents/uploads .noteagents/workspaces
if [ ! -f .env.local ]; then cp docs/noteagents/.env.example .env.local; fi
printf '\nNoteAgents preparado. Edite .env.local e preencha NVIDIA_API_KEY.\n'
printf 'Servidor: pnpm exec tsx docs/noteagents/server/http-server.ts\n'
printf 'Interface: configure o Vite para servir docs/noteagents/ui/index.html.\n'
