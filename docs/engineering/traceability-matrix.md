# Matriz de rastreabilidade inicial

| Funcionalidade | Interface | Contrato/API | Persistência | Autorização | Estado |
|---|---|---|---|---|---|
| Login editorial | `NewsroomLoginPage` | `POST /api/auth/login`, `GET /api/auth/me` | sessão editorial | usuário editorial | Implementado, não verificado E2E |
| Dashboard admin | `AdminDashboard` | endpoints admin | documentos administrativos | `ADMINS` | Parcial |
| Artigos | `NewsroomArticlesTab`, editor | contratos `Article` | storage/document store | papel editorial | Parcial: leitura editorial autenticada e CRUD dispatcher corrigidos; E2E/reload ainda BLOCKED |
| Mídia | `NewsroomMediaTab` | contrato a consolidar | Blob + metadados | editorial/admin | Lacuna |
| Páginas institucionais | `PagesManager`, views públicas | contrato a consolidar | documentos | admin/editorial conforme operação | Parcial |
| Jornal digital | componentes admin/leitor | contrato a consolidar | edição/páginas/versões | editorial/admin | Lacuna |
| Pagamentos | checkout/subscriber | `FIN-001` | pedidos/webhooks | usuário/admin | Parcial, sandbox não verificado |
| Relatórios | módulos admin | endpoints admin | eventos agregados | admin | Parcial |

Esta matriz será expandida à medida que os handlers forem extraídos e testados.
