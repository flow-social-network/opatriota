# Referência de API

A API normaliza `/api/...` removendo o prefixo e despacha em `api/[...path].ts`.

## Autenticação
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

A sessão editorial usa cookie HttpOnly `opatriota_editorial_session`; o cookie é host-only para funcionar em preview e produção.

## Administrativo
- `GET/POST /api/admin/integrations`
- `POST /api/admin/integrations/:id/test`
- `GET/POST/PATCH/DELETE /api/admin/advertising/ads`
- `POST /api/admin/advertising/upload`
- `GET /api/admin/advertising/metrics`

## Conteúdo e editorial
Os handlers de artigos, fontes, fila, páginas e mídia estão no dispatcher agregado. A documentação definitiva de cada rota deve ser extraída dos condicionais atuais antes de declarar cobertura completa.

## Erros
- `401`: sessão ausente ou inválida.
- `403`: sessão válida sem papel/permissão.
- `400/422`: entrada inválida.
- `404`: recurso inexistente.
- `409`: conflito/idempotência quando suportado.
- `5xx`: falha interna/dependência.

Nunca converter todo erro em “Entre na sua conta”; o cliente deve preservar status e código.
