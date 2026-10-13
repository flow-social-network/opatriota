# Arquitetura real

- Frontend: React 19, Vite, React Router, TypeScript.
- Backend: Vercel Functions em `api/`; rota agregadora principal `api/[...path].ts`.
- Cliente HTTP: `src/services/apiClient.ts`.
- Estado compartilhado: `AuthContext` e `DataContext`.
- Contratos: `packages/contracts`.
- Persistência: helpers em `api/_lib/storage.ts`, Neon/SQL em módulos de autenticação e Blob para binários onde configurado.
- Pagamentos: `api/_lib/payments/efi.ts`, billing e webhook Mercado Pago.
- Layouts: público, administrativo e redação separados em router/pages/components.

## Limites
O frontend não deve escrever diretamente em banco ou Blob. Toda mutação precisa passar por API autenticada, validação e autorização server-side.

## Risco arquitetural atual
Há fontes estáticas antigas em `src/data`. Elas podem servir catálogo visual/legado, mas não podem ser usadas como fonte principal de matérias, usuários, pagamentos ou configurações do CMS.
