# Portagem das capacidades do plugin WordPress

O plugin legado está em `backend/legacy/wordpress-plugin/o-patriota-editorial/` só como referência. Não executar PHP dentro de Express, não duplicar tabelas e não remover o arquivo até validar paridade.

| Classe PHP | Capacidade | Destino/estado Node |
|---|---|---|
| class-rss-ingestion.php | RSS e ingestão | `nucleo-operacional/src/core.ts`; validar testes |
| class-source-manager.php | Fontes | Modelo `Source`; auditar rotas de gestão |
| class-deduplication.php | Deduplicação | `IngestionItem.sourceId_contentHash` + fila |
| class-editorial-queue.php | Fila editorial | `OperationalTask` e `AgentExecution` |
| class-newsroom-workflow.php | Workflow editorial | `ArticleStatus`, `ArticleReview` e rotas articles |
| class-editorial-history.php | Auditoria | `ArticleReview` e `AuditEvent` |
| class-fact-check.php | Checagem | `FactCheck` e `FactCheckEvidence`; validar API |
| class-category-manager.php | Categorias | `Category` e routes/categories |
| class-content-restriction.php | Paywall | modelos de assinatura/pagamento; validar middleware entitlement |
| class-subscriber-portal.php | Portal assinante | sessão backend + assinaturas; verificar endpoints |
| class-pages-manager.php | Páginas | rotas Next e conteúdo persistido a definir |
| class-weather-api.php | Meteorologia | serviço TS apenas se a função continuar necessária |
| class-capabilities.php | Permissões | `UserRole` e `requireAuth`/`requireRole` |
| class-admin.php | Administração | APIs e painéis atuais; validar paridade funcional |
| class-activator.php / class-deactivator.php | Hooks WP | sem equivalente literal; portar apenas lógica necessária |

Critério de migração: contrato, autenticação, autorização, persistência, teste positivo/negativo e audit trail. Não marcar uma função como migrada sem evidência.
