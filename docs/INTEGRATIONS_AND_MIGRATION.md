# O Patriota Brasil — contratos de integração e plano de migração

**Estado:** preparação versionada. Não significa que serviços externos estejam configurados nem que a produção esteja implantada.

## Arquitetura e fontes de verdade
- Frontend: React/Vite + Firebase Client SDK para login.
- Backend: Node.js/Express/TypeScript; toda autorização e regra de negócio no servidor.
- Banco principal: Neon PostgreSQL via Prisma. Frontend nunca acessa o banco diretamente.
- Firebase Authentication é a identidade; perfil, papel, matérias, workflow, auditoria, assinaturas, pagamentos e integrações sociais ficam no PostgreSQL.
- Meta Graph API é acessada somente pelo backend. App Secret e tokens nunca vão para VITE_*, bundles, logs ou Git.
- Não introduzir Supabase, MongoDB ou Firestore como segundo banco por suposição. O repositório documenta Neon/PostgreSQL + Prisma. O outro provedor referido precisa ser nomeado antes de ser adotado.
- O artigo completo permanece gratuito; a publicação social gera uma prévia fiel e não substitui a matéria.

## Firebase Authentication
1. No Firebase Console, habilitar Google em Authentication > Sign-in method e cadastrar domínios de dev/produção em Authorized domains.
2. Preencher VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID e VITE_FIREBASE_APP_ID no ambiente do frontend.
3. Configurar Firebase Admin SDK no backend com identidade de serviço segura; nunca versionar JSON de service account.
4. Frontend obtém o ID token por getIdToken() e envia Authorization: Bearer <idToken> via HTTPS.
5. Backend valida o token com Firebase Admin SDK, verifica UID e sincroniza o utilizador por firebaseUid.
6. Novo login recebe sempre READER. ADMIN, CHIEF_EDITOR, EDITOR, REVIEWER e JOURNALIST só são atribuídos por fluxo administrativo autenticado e auditado. Nunca aceitar role vindo do navegador.
7. Verificar utilizador desativado no banco a cada operação protegida. A UI não substitui autorização no backend.
8. A base atual tem cookie/session própria e login Firebase no frontend: a convergência para Firebase bearer token precisa ser implementada e testada explicitamente, não misturada implicitamente.

Fontes oficiais: https://firebase.google.com/docs/auth/admin/verify-id-tokens e https://firebase.google.com/docs/auth/admin/custom-claims

## Neon + Prisma
- Criar branch Neon isolada para desenvolvimento/teste; não aplicar migrations no banco real durante a preparação.
- DATABASE_URL: conexão da aplicação, preferencialmente pooled quando apropriado.
- DIRECT_DATABASE_URL: conexão direta opcional para migrations, conforme versão/configuração Prisma.
- Exigir TLS; segredos só em .env ignorado pelo Git ou secret manager.
- Versionar prisma/schema.prisma e prisma/migrations. Validar schema e ensaiar migrations numa branch descartável antes de qualquer migração manual.
- Produção: backup/export, janela aprovada, prisma migrate deploy, smoke tests e rollback documentado. Não usar prisma db push como rotina de produção.
- Rever schema atual para firebaseUid único, enum de papéis coerente, auditoria de atribuição de papéis, conexões sociais cifradas, publicações agendadas e idempotência.
- O health check deve testar conexão sem revelar hostname, usuário, URL ou credenciais.

Documentação: https://github.com/neondatabase/website/blob/main/content/docs/get-started/connect-neon.md e https://neon.com/blog/prisma-dx-improvements

## Facebook / Meta Graph API
1. Criar o app no Meta for Developers; manter App ID/App Secret somente no backend.
2. Configurar produto/permissões para Facebook Pages e a Página que será administrada.
3. Implementar OAuth no backend com state aleatório, proteção CSRF, callback HTTPS e redirect URI validado.
4. Para publicação em Página, avaliar pages_show_list, pages_read_engagement e pages_manage_posts; confirmar requisitos na versão Graph API fixada e no painel Meta.
5. Guardar Page ID e Page Access Token cifrados no backend. Nunca devolver token em endpoints nem escrever em logs.
6. Testar primeiro com administradores/testadores. Para uso externo, preparar App Review, verificação empresarial se exigida, política de privacidade, URL de exclusão de dados e gravação demonstrando cada permissão.
7. Fixar META_GRAPH_API_VERSION. Tratar tokens expirados/revogados, rate limits, permissões removidas e falhas transitórias.
8. Instagram é uma integração distinta: exige conta profissional e permissões/configuração próprias. Não presumir que o token do Facebook publica no Instagram.
9. Só publicar matérias aprovadas. Usar worker, chave idempotente, retries limitados, persistência de remotePostId, pause switch e auditoria.

Variáveis de backend previstas: META_APP_ID, META_APP_SECRET, META_GRAPH_API_VERSION, META_OAUTH_REDIRECT_URI, META_TOKEN_ENCRYPTION_KEY e PUBLIC_APP_URL. Não colocar segredos reais neste documento.

Fontes: https://developers.facebook.com/docs/graph-api/ e https://www.postman.com/meta/instagram/folder/u4g5a2a/instagram-api-with-facebook-login

## Contrato de API-alvo
Todas as rotas privadas usam Firebase ID token validado no servidor; JSON; datas ISO-8601 UTC; validação runtime; paginação limitada. Formato de erro: { error: { code, message, requestId } }. Nunca expor tokens, hashes de senha ou stack traces.

| Método | Rota | Acesso | Contrato |
|---|---|---|---|
| GET | /health/live | público | processo vivo |
| GET | /health/ready | público | DB disponível sem detalhes secretos |
| GET | /api/auth/me | autenticado | perfil interno e permissões |
| POST | /api/auth/sync | Firebase autenticado | upsert de identidade; papel inicial READER |
| GET | /api/articles | público | matérias publicadas, filtros/paginação |
| GET | /api/articles/:slug | público | matéria publicada, fontes e metadados |
| POST | /api/articles | jornalista+ | criar rascunho |
| PATCH | /api/articles/:id | autor ou edição autorizada | alterar com propriedade e controle de versão |
| POST | /api/articles/:id/submit | autor+ | enviar à revisão |
| POST | /api/articles/:id/reviews | revisor+ | registrar decisão/notas |
| POST | /api/articles/:id/publish | editor+ | publicar somente se aprovada e auditar |
| GET/POST | /api/admin/users | admin | gerir papéis/estado com auditoria |
| GET/POST | /api/social/connections | admin/editor-chefe | estado da conexão; nunca retornar token |
| GET | /api/social/oauth/meta/start | admin | iniciar OAuth com state |
| GET | /api/social/oauth/meta/callback | callback validado | trocar code e guardar tokens cifrados |
| POST | /api/social/publications | editor+ | agendar matéria aprovada |
| GET | /api/social/publications/:id | editorial autorizado | estado sanitizado |
| POST | /api/admin/social/pause | admin/editor-chefe | pausar/retomar worker |
| POST | /api/webhooks/efi | provedor | autenticar e deduplicar evento de pagamento |

Esta tabela é contrato-alvo, não declaração de que as rotas já existam.

## Migração manual — checklist
- [ ] Confirmar projeto/branch Neon de destino, backup e ambiente de teste.
- [ ] Nomear qualquer segundo banco antes de o adotar; não criar/migrar para um provedor presumido.
- [ ] Fixar domínios frontend/API, CORS, papéis iniciais e administradores.
- [ ] Validar schema e gerar cliente Prisma.
- [ ] Aplicar migration em branch descartável; testar constraints, autorização e rollback.
- [ ] Exportar/mapear dados, IDs e regras de deduplicação; ensaiar sem dados de produção.
- [ ] Na janela aprovada, fazer backup, aplicar migration/importar dados e executar smoke tests.
- [ ] Comparar contagens/checksums e manter sistema antigo até aceite.
- [ ] Configurar app Meta, permissões, OAuth, tokens e testar publicação em Página de teste.
- [ ] Só declarar integração operacional após teste com credenciais reais.

## Critérios de aceite
- Token Firebase inválido/expirado recebe 401; utilizador novo recebe READER.
- Atribuição de papéis é administrativa e auditada.
- Backend verifica papel e propriedade em cada operação editorial.
- Conteúdo não aprovado não é publicado no site/redes.
- Repetir uma tarefa social não cria publicação duplicada.
- Segredos não aparecem no bundle, logs, respostas ou Git.
- Migrations reproduzíveis, backup recuperável e rollback documentado.
