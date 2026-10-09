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

## Limite de segurança importante

`VITE_ADMIN_EMAILS` é uma allowlist da interface React; **não é uma regra de autorização do backend**. Qualquer variável `VITE_*` pode ser lida no navegador. A autorização real para operações administrativas precisa ser aplicada nas rotas do backend.

O código atual do serviço Firebase atribui `leitor_gratuito` a todo usuário autenticado. O backend atual usa sessão própria com cookie e papéis PostgreSQL/Prisma. Portanto, permitir o e-mail na interface não concede automaticamente o papel `ADMIN` no banco e não faz o backend aceitar tokens Firebase. Não conceda privilégios apenas com base no e-mail enviado pelo navegador.

Antes de conceder acesso administrativo em produção:
1. Crie/valide a conta no Firebase Authentication e confirme que o e-mail autenticado é exatamente `deevoholding@gmail.com`.
2. Promova a conta interna a `ADMIN` por um procedimento administrativo seguro e auditado.
3. Integre a verificação de ID token Firebase no backend, se o login Google/Firebase for o mecanismo de identidade pretendido para as APIs administrativas; ou mantenha o login de sessão existente e configure-o separadamente, sem misturar os dois mecanismos.
4. Teste que um usuário comum recebe `403` nas rotas administrativas.
5. Não publique credenciais privadas nem use regras Firestore/Storage permissivas como `allow read, write: if true`.

## Estado desta configuração

Este documento e `.env.example` registram o projeto e o e-mail pretendidos. Eles **não alteram diretamente** as configurações do Firebase Console nem as variáveis da Vercel. A configuração externa só fica aplicada após salvar os valores nos respectivos painéis e fazer novo deployment.