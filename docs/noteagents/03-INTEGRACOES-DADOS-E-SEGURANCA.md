# Integrações, dados e segurança

## Autenticação

Usar Better Auth ou provedor equivalente com email/senha por padrão. Sessões em cookies `HttpOnly`, `Secure`, `SameSite` adequado ao ambiente e rotação. OAuth só após solicitação. Toda rota protegida valida a sessão no servidor.

Papéis mínimos: `owner`, `admin`, `developer`, `editor`, `viewer`. Permissões são por projeto e não podem ser inferidas apenas da interface.

## Banco

PostgreSQL/Neon é o banco recomendado. Antes de escrever SQL, consultar schema real. Queries são parametrizadas. Toda tabela de dados de usuário tem `userId` ou `projectId` e toda consulta aplica escopo correspondente.

Migrações:

1. inspecionar schema;
2. gerar plano não destrutivo;
3. estimar impacto;
4. criar backup/snapshot;
5. pedir aprovação quando necessário;
6. aplicar uma mudança por vez;
7. validar índices, constraints e rollback.

Não guardar tokens, senhas ou conteúdo de arquivos `.env` em tabelas comuns.

## Integrações externas

### Git

OAuth com escopos mínimos. Tokens criptografados no cofre. Operações usam branch de trabalho, diff e auditoria. Webhooks validam assinatura, timestamp e replay.

### Vercel

Token com escopo mínimo, projeto escolhido explicitamente, ambientes separados e logs sem variáveis secretas. Deploy de produção exige aprovação. Salvar deployment ID e URL para rollback.

### NVIDIA

O servidor chama o gateway de modelos com chave somente no backend. O usuário configura modelo permitido, limite de custo e timeout. Registrar metadados de uso, nunca prompt com segredos nem chave.

### Storage

Arquivos de projeto são privados por padrão. URLs assinadas expiram. Validar tamanho, MIME real, extensão, malware e path traversal. Imagens recebidas do usuário têm alt text e tratamento de CORS.

## Segurança web

- validar e normalizar toda entrada;
- aplicar CSRF em mutações baseadas em cookie;
- configurar CORS por allowlist;
- usar CSP, HSTS, `nosniff` e `Referrer-Policy`;
- limitar upload, requisições e custo de IA;
- proteger SSRF com bloqueio de IP privado e allowlist;
- sanitizar Markdown/HTML;
- impedir path traversal e command injection;
- aplicar rate limit por usuário, IP e projeto;
- não refletir erro interno ao usuário;
- atualizar dependências e gerar SBOM.

## Auditoria e privacidade

Auditar login, conexão, leitura de segredo, execução de comando, alteração, migração, push e deploy. Permitir exportação e exclusão de dados de acordo com a política de retenção. Logs de auditoria são append-only e têm retenção definida.

## Recuperação

Backups criptografados, restore testado, RPO/RTO documentados, snapshots antes de migração e rollback de aplicação por deployment imutável. Um incidente deve gerar timeline, impacto, causa, correção e ação preventiva.
