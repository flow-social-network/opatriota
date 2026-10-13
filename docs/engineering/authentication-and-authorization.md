# Autenticação e autorização

A autenticação editorial/admin é baseada em sessão server-side e cookie HttpOnly. O frontend consulta `auth/me`; o backend resolve a identidade pelo cookie e aplica `requireRole` antes das mutações administrativas.

## Rotas canônicas
- `/auth/admin/login`
- `/auth/login/redacao` e alias `/auth/redacao/login`
- `/auth/leitor/login`

## Regras
- 401 somente para sessão ausente/inválida.
- 403 para usuário autenticado sem permissão.
- Jornalistas não recebem acesso financeiro apenas por estarem autenticados.
- A sessão precisa ser restaurada antes de mutações.
- Não registrar tokens, cookies ou senhas.

## Evidência
A correção do cookie editorial foi commitada em `206dc37`. Teste E2E autenticado continua dependente de conta autorizada e navegador funcional.
