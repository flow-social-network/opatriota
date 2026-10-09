#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log() { printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"; }
fail() { printf '\nERRO: %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null 2>&1 || fail "Node.js não encontrado. Instale Node.js 22 LTS."
NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
(( NODE_MAJOR >= 22 )) || fail "Node.js 22+ é necessário. Encontrado: $(node --version)"

if ! command -v pnpm >/dev/null 2>&1; then
  command -v corepack >/dev/null 2>&1 || fail "Instale pnpm 10+ ou disponibilize Corepack."
  log "Ativando pnpm via Corepack"
  corepack enable
  corepack prepare pnpm@10 --activate
fi

log "Node: $(node --version) | pnpm: $(pnpm --version)"
if [[ ! -f .env ]]; then
  cp .env.example .env
  log "Criado .env a partir de .env.example. Configure DATABASE_URL antes de usar a API."
else
  log "Arquivo .env existente preservado."
fi

log "Instalando dependências e sincronizando pnpm-lock.yaml"
pnpm install --no-frozen-lockfile

if ! grep -q '^DATABASE_URL=' .env || grep -q '^DATABASE_URL=postgresql://USER:PASSWORD@HOST' .env; then
  export DATABASE_URL='postgresql://placeholder:placeholder@localhost:5432/opatriota?schema=public'
  log "DATABASE_URL é placeholder: validaremos o schema sem conectar ao banco."
else
  DATABASE_URL_VALUE="$(grep -m1 '^DATABASE_URL=' .env | cut -d= -f2-)"
  DATABASE_URL_VALUE="${DATABASE_URL_VALUE%\"}"
  DATABASE_URL_VALUE="${DATABASE_URL_VALUE#\"}"
  export DATABASE_URL="$DATABASE_URL_VALUE"
fi

pnpm exec prisma validate --schema prisma/schema.prisma
pnpm exec prisma generate --schema prisma/schema.prisma
pnpm backend:check

log "Configuração local concluída"
cat <<'EOF'

Próximos passos:
  1. Configure DATABASE_URL real em .env (PostgreSQL/Neon com TLS).
  2. Em desenvolvimento, crie a migration: pnpm exec prisma migrate dev --name init
  3. Terminal 1: pnpm api:dev
  4. Terminal 2: pnpm dev
  5. Teste a API: curl http://localhost:8080/health/live

O script não cria banco remoto, recursos AWS, usuários ou credenciais.
Não use migrate dev em produção; use migrations revisadas e migrate deploy.
EOF
