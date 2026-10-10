# Configuração de autenticação — O Patriota Brasil

Projeto Firebase: `o-patriota-5db52`
E-mail administrativo autorizado para a interface: `deevoholding@gmail.com`
Provedor de login: Google. Facebook não é provedor de login.

## Configuração necessária no Firebase Console

Abra https://console.firebase.google.com/u/3/project/o-patriota-5db52/overview

1. Em **Authentication → Sign-in method**, habilite **Google** e selecione o e-mail de suporte exigido pelo Firebase.
2. Em **Authentication → Settings → Authorized domains**, confirme que o domínio de produção atual e os domínios de preview necessários estão autorizados. Não adicione domínios que não controla.
3. Em **Project settings → General → Your apps**, copie a configuração do aplicativo Web. Não deduza `apiKey`, `appId`, `messagingSenderId` ou o domínio a partir do project ID.

## Variáveis de ambiente do frontend na Vercel

No projeto Vercel que realmente serve o site, configure as variáveis abaixo para **Production** e, se necessário, para Preview:

- `VITE_FIREBASE_API_KEY` — valor da configuração do app Web no Firebase
- `VITE_FIREBASE_AUTH_DOMAIN` — valor da configuração do app Web no Firebase
- `VITE_FIREBASE_PROJECT_ID=o-patriota-5db52`
- `VITE_FIREBASE_STORAGE_BUCKET` — valor da configuração do app Web no Firebase
- `VITE_FIREBASE_MESSAGING_SENDER_ID` — valor da configuração do app Web no Firebase
- `VITE_FIREBASE_APP_ID` — valor da configuração do app Web no Firebase
- `VITE_ADMIN_EMAILS=deevoholding@gmail.com`

Depois de salvar as variáveis, faça um novo deployment para que o build Vite as incorpore. O endereço `opatriota-one.vercel.app` retornou 404 anteriormente; confirme no painel Vercel qual projeto e domínio estão vinculados ao repositório antes de configurar ou divulgar um endereço.

## Variáveis de ambiente do backend (API Express na Vercel)

O backend (`api/[...path].ts` → Express) valida ID tokens com o Firebase Admin SDK em `POST /api/auth/sync`:

- `DATABASE_URL` — connection string do Neon (o backend aceita `POSTGRES_URL` como fallback automático)
- `FIREBASE_PROJECT_ID=o-patriota-5db52`
- `FIREBASE_SERVICE_ACCOUNT_JSON` — JSON completo da service account (alternativa: `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`, com `\n` escapados)
- `FIREBASE_WEB_API_KEY` — usado apenas para troca server-side de tokens (testes/ferramentas)
- `FIREBASE_CHECK_REVOKED=true` — verifica revogação/assinatura do token
- `CORS_ORIGINS` — origens permitidas (em produção não use localhost)

Regras do endpoint `POST /api/auth/sync`: apenas provedor `google.com`; e-mail verificado obrigatório; papel inicial `READER` atribuído somente pelo servidor (o payload do cliente nunca é consultado); link com conta existente só quando o backend já verificou o e-mail (anti-takeover); contas desativadas recebem `403`; a rota também estabelece a mesma sessão por cookie usada pelo login por senha. Promoção a `ADMIN` exclusivamente via `pnpm admin:promote -- --email=... --reason="..."` (auditado).

## Limite de segurança importante

`VITE_ADMIN_EMAILS` é uma allowlist da interface React; **não é uma regra de autorização do backend**. Qualquer variável `VITE_*` pode ser lida no navegador. A autorização real para operações administrativas é aplicada nas rotas do backend (`requireRole`), com auditoria em `audit_events`.

O login por senha do backend usa sessão própria com cookie `opatriota_session` e papéis PostgreSQL/Prisma. `POST /api/auth/sync` integra o token Firebase a esse mesmo modelo de sessão. Permitir o e-mail na interface não concede automaticamente o papel `ADMIN` no banco. Não conceda privilégios apenas com base no e-mail enviado pelo navegador.

Antes de conceder acesso administrativo em produção:
1. Crie/valide a conta no Firebase Authentication e confirme que o e-mail autenticado é exatamente o pretendido.
2. Promova a conta interna a `ADMIN` com `pnpm admin:promote -- --email=... --reason="..."` (grava `USER_ROLE_CHANGED` em `audit_events`).
3. A verificação de ID token Firebase no backend está implementada; configure as variáveis do backend acima.
4. Teste que um usuário comum recebe `403` nas rotas administrativas.

## Estado desta configuração

Este documento e `.env.example` registram o projeto e o e-mail pretendidos. Eles **não alteram diretamente** as configurações do Firebase Console nem as variáveis da Vercel. A configuração externa só fica aplicada após salvar os valores nos respectivos painéis e fazer novo deployment.