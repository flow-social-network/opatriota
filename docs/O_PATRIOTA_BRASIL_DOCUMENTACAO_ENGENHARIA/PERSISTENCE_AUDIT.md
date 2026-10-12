# Auditoria de persistência dos painéis

Data: 12/10/2026  
Branch: `v0/auditoria-fluxos-auth`  
Escopo: Painel Administrativo (`/admin`) e Redação (`/redacao`)

## Regra de conclusão

Uma ação só pode ser exibida como concluída depois de uma resposta bem-sucedida da API. O frontend não deve tratar estado local, `localStorage` ou um callback não aguardado como persistência.

## Matriz de evidências

| Módulo | Página | Operação | Componente | Endpoint | Persistência | Estado anterior | Correção/estado atual | Teste | Resultado | Pendência |
|---|---|---|---|---|---|---|---|---|---|---|
| Administração | `/admin` | Adicionar fonte RSS | `AdminDashboard.handleAddSource` | `POST /editorial/sources` via diff de coleção | Neon/document store | Parcial: callback não aguardado | Aguarda `onUpdateSource`; erro mantém estado confirmado | TypeScript, lint, build | Aprovado em contrato | Testar gravação e leitura em ambiente Neon |
| Administração | `/admin` | Alterar status da fila | `AdminDashboard.handleStatusChange` | `PATCH /editorial/queue/:id` | Neon/document store | Parcial: falha podia parecer concluída | Aguarda persistência; contexto propaga erro | TypeScript, lint, build | Aprovado em contrato | Testar cada transição com sessão admin |
| Administração | `/admin` | Sincronizar fontes | `AdminDashboard.handleSyncAll` | `POST /editorial/sources/sync` + persistência da resposta | Neon/document store | Parcial: atualizações derivadas não aguardadas | Fontes e fila agora são aguardadas antes da mensagem de sucesso | TypeScript, lint, build | Aprovado em contrato | Teste externo RSS/SSRF e leitura posterior |
| Administração | `/admin` | Salvar páginas | `DataContext.savePage` | `POST/PATCH /pages` | Neon/document store | Implementação real; erro era absorvido | Atualiza contexto apenas após resposta confirmada e relança erro | TypeScript, lint, build | Aprovado em contrato | CRUD completo de UI e teste de leitura posterior |
| Administração | `/admin` | Excluir páginas | `DataContext.deletePage` | `DELETE /pages/:id` | Neon/document store | Implementação real | Estado local muda somente após HTTP 2xx | Código revisado | Aprovado em contrato | Teste de autorização e inexistente |
| Administração | `/admin` | Salvar editorias | `DataContext.saveCategory` | `POST/PATCH /categories` | Neon/document store | Implementação real; erro era absorvido | Erro é propagado ao chamador | TypeScript, lint, build | Aprovado em contrato | Teste de slug duplicado |
| Administração | `/admin` | Salvar menus | `DataContext.saveMenuConfigHandler` | `PATCH /site-settings/menu` | Neon/document store | Implementação real | Atualiza após resposta confirmada | Código revisado | Aprovado em contrato | Exercitar UI e recarregar |
| Administração | `/admin` | Identidade, redes e publicidade | Configuração do portal | `PATCH /site-settings` | Neon/document store | Havia cache `localStorage` que podia mascarar falha | Removido cache local como fonte de verdade; API é autoridade | TypeScript, lint, build | Corrigido | Testar por seção com sessão admin |
| Redação | `/redacao` | Criar/editar matéria | `NewsroomDashboard` | `/articles` | Neon/document store | Bloqueado para modo técnico | Apenas administrador pode alterar; backend exige autorização | TypeScript, lint, build | Regra aplicada | Implementar/exercitar editor administrativo completo |
| Redação | `/redacao` | Aprovar/publicar | `NewsroomDashboard` | `/articles/:id` | Neon/document store | Bloqueado para modo técnico | Ações exclusivas do administrador; aprovação humana preservada | TypeScript, lint, build | Regra aplicada | Teste de tentativa direta por jornalista |
| Redação | `/redacao` | IA/pesquisa | componentes editoriais | `/editorial/ai-*`, `/editorial/sources/sync` | Serviços externos + Neon quando importado | Algumas funções dependem de configuração externa | Erros de configuração são retornados, sem sucesso simulado | Endpoint review | Parcial | Validar chaves e limites de fornecedor |

## Contratos backend verificados

- `POST /editorial/auth/login`
- `GET /editorial/auth/me`
- `POST /editorial/auth/logout`
- `POST /editorial/sources/sync`
- `POST /editorial/ai-review`
- `POST /editorial/ai-text`
- `POST /editorial/ai-image`
- `POST /editorial/ai-risk`
- `POST /editorial/chat`
- `GET/POST/PATCH/PUT/DELETE /articles`
- `GET/POST/PATCH/PUT/DELETE /pages`
- `GET/POST/PATCH/PUT/DELETE /categories`
- `GET/POST/PATCH/PUT/DELETE /authors`
- `GET/PATCH /site-settings` e `PATCH /site-settings/menu`

Todos os endpoints de escrita devem passar por sessão validada e autorização no backend. A confirmação de persistência no banco Neon ainda precisa ser demonstrada em ambiente conectado para cada mutação; build e lint não são essa evidência.

## Pendências honestas

1. Exercitar cada mutação contra um banco Neon de teste e reler o registro após recarregar.
2. Adicionar testes de integração para autorização, validação, conflito e rollback visual.
3. Completar as telas de usuários, integrações, redes, publicidade, newsletter e segurança com ações reais quando ainda forem apenas navegação ou estado local.
4. Não declarar os painéis 100% funcionais até que essas operações tenham evidência HTTP + leitura posterior.
5. Nunca aprovar ou publicar automaticamente conteúdo editorial por IA.

## Verificações executadas nesta etapa

- `git status` e confirmação do commit base `f201f39`.
- Auditoria textual de callbacks, endpoints de escrita e persistência do `DataContext`.
- Alteração para aguardar mutações e propagar falhas.
- Remoção do `localStorage` como fonte de verdade para configurações do portal.

As verificações de `tsc`, lint, build e navegador devem ser executadas após as alterações desta etapa antes do commit final.
