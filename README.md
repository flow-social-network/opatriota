# O PATRIOTA BRASIL

Portal jornalístico digital para notícias, análise, opinião, checagem de fatos e fontes públicas.

## Estado do repositório

O repositório contém um frontend React/Vite e uma API Node.js/Express em `backend/`, com Prisma e PostgreSQL. A infraestrutura AWS documentada é uma arquitetura-alvo; não significa que recursos AWS tenham sido criados ou que a aplicação esteja implantada em produção.

## Estrutura principal

```text
/
├── src/                    # Frontend React/Vite
├── public/                 # Arquivos públicos
├── backend/
│   ├── src/
│   │   ├── config/         # Configuração da API
│   │   ├── db/             # Cliente Prisma
│   │   ├── lib/            # Utilitários HTTP
│   │   ├── middleware/     # Autenticação/autorização
│   │   ├── routes/         # Auth, artigos e categorias
│   │   ├── app.ts
│   │   └── index.ts
│   └── tsconfig.json
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── setup-backend.sh
├── docs/
└── package.json
```

## Requisitos

- Node.js 22 LTS ou superior
- pnpm 10+
- PostgreSQL compatível com Prisma
- Variáveis locais em `.env`; nunca versionar credenciais

## Instalação local

```bash
pnpm backend:setup
```

O script instala dependências, sincroniza o lockfile, valida/genera o cliente Prisma e verifica os tipos do backend. Ele cria apenas um arquivo `.env` de exemplo se não existir; não provisiona PostgreSQL ou AWS e não aplica migrations automaticamente.

Configure `DATABASE_URL` em `.env`. Em ambiente de desenvolvimento:

```bash
pnpm exec prisma migrate dev --name init
pnpm api:dev
```

Em outro terminal, execute o frontend:

```bash
pnpm dev
```

## Endpoints implementados na base atual

- `GET /health/live` — liveness
- `GET /health/ready` — verifica PostgreSQL
- `POST /api/auth/register` — cadastro de leitor
- `POST /api/auth/login` — inicia sessão HTTP-only
- `GET /api/auth/me` — sessão atual
- `POST /api/auth/logout` — encerra sessão
- `GET /api/articles` e `GET /api/articles/:slug` — leitura pública de artigos publicados
- `POST /api/articles` e `PATCH /api/articles/:id` — operações editoriais autenticadas
- `GET /api/categories` — categorias com conteúdo publicado

## Segurança e prontidão

Esta é uma implementação inicial, não uma declaração de prontidão para produção. Antes de produção, validar schema e migrations, testar todos os fluxos, acrescentar rate limiting e proteção contra CSRF conforme o deployment, implementar autorização de assinaturas antes de habilitar conteúdo pago, concluir integração Efí com webhooks idempotentes, adicionar testes de integração, revisar logging/privacidade, configurar backups, monitorização, secrets, IAM e CI/CD.

A integração Efí existente em `server/` permanece legado não conectado às rotas atuais. Não processe pagamentos reais por esse código até a integração ser reimplementada e auditada.
