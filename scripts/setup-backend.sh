#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log() { printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"; }
fail() { printf '\nERRO: %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null 2>&1 || fail "Node.js não encontrado. Instale Node.js 22 LTS e execute novamente."
NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
(( NODE_MAJOR >= 22 )) || fail "Node.js 22 ou superior é necessário. Versão encontrada: $(node --version)"

if ! command -v pnpm >/dev/null 2>&1; then
  command -v corepack >/dev/null 2>&1 || fail "pnpm/Corepack não encontrado. Instale pnpm 10+ e execute novamente."
  log "Ativando pnpm via Corepack"
  corepack enable
  corepack prepare pnpm@10 --activate
fi

log "Versões instaladas"
node --version
pnpm --version

if [[ ! -f .env ]]; then
  if [[ -f server/.env.backend.example ]]; then
    cp server/.env.backend.example .env
    log "Criado .env a partir do modelo. Configure DATABASE_URL antes de conectar ao banco."
  else
    fail "Modelo server/.env.backend.example não encontrado."
  fi
else
  log "Arquivo .env existente preservado."
fi

log "Instalando dependências do projeto"
pnpm install

log "Validando variáveis e schema Prisma"
if ! grep -q '^DATABASE_URL=' .env || grep -q '^DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB' .env; then
  export DATABASE_URL='postgresql://placeholder:placeholder@localhost:5432/opatriota?schema=public'
  log "DATABASE_URL ainda é um placeholder; validação do schema não conecta a um banco real."
else
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

pnpm exec prisma validate --schema prisma/schema.prisma
pnpm exec prisma generate --schema prisma/schema.prisma

log "Configuração-base concluída"
cat <<'EOF'

Próximos passos:
  1. Edite .env e informe DATABASE_URL real (Neon/PostgreSQL com TLS).
  2. Valide novamente: pnpm exec prisma validate
  3. Crie a migration em ambiente de desenvolvimento: pnpm exec prisma migrate dev --name init
  4. Inicie o frontend: pnpm dev
  5. Inicie a API: pnpm api:dev

Segurança:
  - O script NÃO cria recursos AWS, NÃO cria banco remoto e NÃO aplica migrations automaticamente.
  - Nunca coloque segredos no Git. Em produção use AWS Secrets Manager.
EOF
