# Redação — configuração operacional e publicação social

Este documento separa o que existe no repositório da configuração que depende dos consoles externos. Os valores secretos não devem ser enviados por chat nem gravados no Git.

## Regras do produto

- O login da redação é feito exclusivamente com Google via Firebase Authentication. Facebook é uma conexão de publicação, nunca um provedor de login.
- O banco principal é Neon PostgreSQL; o backend acessa-o por Prisma. O navegador nunca recebe a URL do banco.
- Toda matéria começa como rascunho. O autor envia para revisão; um revisor/editor autorizado decide; somente uma matéria explicitamente aprovada pode ser publicada.
- Depois da aprovação, a publicação no portal e a publicação social são operações distintas e auditáveis.
- A prévia social inclui título, resumo fiel, imagem, marca d'água/identidade “O Patriota Brasil” e URL canónica da matéria completa. A matéria completa permanece aberta no portal.
- O autor/colunista pode conectar uma Página ou identidade Meta permitida pela aplicação, mas não pode contornar a fila de aprovação editorial.
- Tokens sociais são guardados apenas no backend, cifrados; nunca são devolvidos ao frontend, registados em logs ou colocados em variáveis `VITE_*`.
- Falhas/expiração de tokens não podem fazer a matéria perder a aprovação nem criar publicações duplicadas. A operação social deve ter idempotência e estado visível.

## 1. Firebase — login Google

1. Abra Firebase Console e selecione o projeto correto.
2. Em Authentication → Sign-in method, habilite Google. Não habilite Facebook como método de autenticação do site.
3. Em Authentication → Settings → Authorized domains, adicione os domínios reais do frontend e os domínios locais usados no desenvolvimento.
4. Em Project settings → General, copie os dados da aplicação Web para as variáveis públicas `VITE_FIREBASE_*` listadas em `.env.example`.
5. Configure Firebase Admin SDK no backend usando a identidade de serviço do ambiente de hospedagem ou os segredos de servidor `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY`. Nunca commite a chave privada.
6. O backend precisa validar o Firebase ID token e mapear o UID para um utilizador no PostgreSQL. A função editorial não pode vir do browser: contas novas começam sem privilégio editorial e um administrador autorizado atribui o papel.
7. Teste: login Google bem-sucedido, token inválido/expirado recebe 401, conta sem papel editorial não entra na redação e utilizador desativado perde acesso.

**Importante:** a aplicação atual tem login Google no frontend, mas o middleware de rotas editoriais usa uma sessão HTTP-only própria. A integração de ponta a ponta Firebase → backend e o mapeamento UID/roles ainda precisam ser concluídos e testados antes de declarar o login operacional para a redação.

## 2. Neon — PostgreSQL

1. Confirme o projeto e crie uma branch de teste no Neon. Não use produção para ensaiar migrações.
2. Copie a connection string pooled para `DATABASE_URL`; para migrations, configure `DIRECT_DATABASE_URL` com conexão direta se a versão de Prisma usada exigir.
3. Mantenha `sslmode=require`. Não use as URLs no frontend.
4. Execute `pnpm db:validate`, `pnpm db:generate` e aplique as migrations somente na branch de teste.
5. Teste login/roles, criar rascunho, enviar para revisão, solicitar alterações, aprovar, publicar e garantir que endpoints públicos só retornem `PUBLISHED` com `publishedAt` válido.
6. Antes de produção: backup, janela de mudança aprovada, `prisma migrate deploy`, smoke tests e plano de rollback. Nenhuma migration deve ser aplicada automaticamente pelo frontend.

## 3. Meta/Facebook — vincular conta para publicação

1. Em Meta for Developers, crie/seleciona a aplicação e configure Facebook Login for Business/OAuth conforme o tipo de conta e a experiência de conexão que a aplicação usar.
2. Configure a URI de callback HTTPS exatamente igual a `META_OAUTH_REDIRECT_URI`; fixe a versão Graph API em `META_GRAPH_API_VERSION`.
3. Use permissões mínimas necessárias. Para publicar numa Página, confirme no painel Meta e na versão fixada os requisitos atuais de `pages_show_list`, `pages_read_engagement` e `pages_manage_posts`.
4. Configure `META_APP_ID`, `META_APP_SECRET`, `META_OAUTH_REDIRECT_URI`, `META_GRAPH_API_VERSION`, `META_TOKEN_ENCRYPTION_KEY` e `PUBLIC_APP_URL` apenas nos segredos do backend.
5. O callback precisa validar `state`, o redirect URI e o utilizador autenticado. Guarde Page ID, nome da Página e tokens cifrados no servidor. A UI mostra apenas nome, estado, permissões, expiração/erro e botão para desconectar.
6. Teste primeiro com utilizadores de função Administrador/Desenvolvedor/Testador da app. Para publicar para público externo, conclua App Review e quaisquer verificações empresariais que a Meta exigir.
7. A ligação de um colunista deve ficar associada ao seu utilizador e à Página autorizada. O backend verifica a propriedade/permissão antes de publicar. Não aceitar Page ID ou token arbitrário vindo do browser.

Não confundir “login com Facebook” com “conectar Facebook para publicar”: o primeiro fica desativado no portal; o segundo é uma integração OAuth separada, dentro de Configurações → Redes Sociais.

## 4. Prévia social com marca do jornal

A prévia deve ser construída a partir da versão aprovada e publicada, não de texto livre enviado pelo cliente.

- Título: título editorial aprovado.
- Descrição: resumo/excerto aprovado e fiel ao conteúdo.
- Imagem: imagem destacada licenciada e aprovada, com marca d'água discreta “O Patriota Brasil” aplicada numa cópia de distribuição; preservar o ficheiro original na biblioteca.
- Link: URL canónica pública da matéria completa, sem paywall forçado ou página intermediária de anúncios.
- Metadados: Open Graph `og:title`, `og:description`, `og:image`, `og:url`, `og:type=article`; imagem acessível por HTTPS.
- Auditoria: artigo, versão aprovada, destino social, utilizador que iniciou a publicação, data, estado, remote post ID e erro sanitizado.
- Idempotência: uma chave única por artigo + versão + destino evita duplicados. Em erro transitório, retry limitado; em token revogado, pedir reconexão.
- Aprovação: conteúdo editado após aprovação volta para rascunho e exige nova revisão. Não publicar automaticamente a versão alterada.
- Métricas: buscar somente métricas disponibilizadas pelas permissões Meta concedidas; mostrar fonte, data da última sincronização e indisponibilidade sem inventar números.

## Estado de implementação verificado no repositório

- Já existe schema Prisma para matérias, funções, revisões, auditoria e notificações editoriais, e rotas de aprovação/publicação humana.
- As rotas públicas de artigos filtram por estado publicado e data de publicação.
- A API de notificações está registada.
- O exemplo de ambiente já lista variáveis de Firebase, Neon e Meta como placeholders.
- **Ainda não declarar pronto para produção:** o backend Firebase Admin/ID token e sincronização de identidade precisam de implementação; as rotas OAuth Meta, persistência cifrada de conexões, worker de publicação social, geração real da imagem com marca d'água, métricas Meta e UI de configuração/ligação precisam ser implementados e testados. O acesso real ao Neon/Firebase/Meta exige credenciais configuradas nos respetivos consoles.
- Não foi feita migração no Neon nem publicação em produção por este documento.
