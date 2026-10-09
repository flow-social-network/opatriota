# O PATRIOTA — Contrato Frontend/Backend

## Regra de integração

O frontend consome dados reais. Não usar utilizadores, notícias, pagamentos, subscrições, contactos ou resultados inventados como fallback. Se a API não estiver configurada ou falhar, mostrar erro/estado vazio e não apresentar a operação como concluída.

Base URL: `VITE_API_BASE_URL`. O cliente partilhado está em `src/services/apiClient.ts`. Por defeito envia token Firebase como Bearer quando o provider de token está configurado. O backend tem de validar o token e aplicar autorização em cada operação protegida.

## Formato recomendado

Sucesso: objeto JSON do recurso ou coleção; respostas sem corpo podem usar HTTP 204.

Erro:
```json
{ "error": "MACHINE_READABLE_CODE", "message": "Mensagem segura para apresentar ao utilizador" }
```

Usar HTTP 400 para validação, 401 para sessão ausente/expirada, 403 para falta de permissão, 404 para recurso inexistente, 409 para conflito, 429 para limite e 5xx para falhas internas. Nunca devolver segredos, tokens de fornecedor ou dados pessoais desnecessários.

## Endpoints que o backend deve implementar

| Área | Método e rota | Requer autenticação | Comportamento |
|---|---|---|---|
| Saúde | GET /health | Não | Estado da API e versão |
| Notícias públicas | GET /articles | Não | Apenas publicadas; filtros/paginação |
| Notícia | GET /articles/:idOrSlug | Não | Conteúdo público publicado |
| Criar/editar notícia | POST/PATCH /articles | Sim, redação | Validar função e auditar |
| Publicar notícia | POST /articles/:id/publish | Sim, editor | Transição de estado auditada |
| Categorias | GET /categories | Não | Categorias ativas |
| CRUD categorias | POST/PATCH/DELETE /categories/:id | Sim, editor | Persistência real |
| Autores | GET /authors | Não | Perfis públicos ativos |
| Páginas | GET /pages | Não | Apenas páginas publicadas |
| CRUD páginas | POST/PATCH/DELETE /pages/:id | Sim, editor | Persistência real |
| Menus/configuração | GET/PATCH /site-settings | GET público; PATCH admin | Configuração persistida |
| Fact-checks | GET /fact-checks | Não | Verificações publicadas |
| Fontes editoriais | GET/POST/PATCH/DELETE /editorial/sources | Sim, equipa autorizada | Gestão real de fontes |
| Fila editorial | GET /editorial/queue | Sim, equipa autorizada | Itens reais da fila |
| Contactos | POST /contact-submissions | Não | Validar, limitar abuso, persistir |
| Pedidos LGPD | POST /privacy-requests | Não | Criar protocolo real e persistir; notificação apenas se implementada |
| Newsletter | POST /newsletter/subscriptions | Não | Consentimento, deduplicação e persistência |
| Conta do leitor | GET/PATCH /me | Sim | Perfil associado ao UID verificado |
| Favoritos | GET/PUT /me/bookmarks | Sim | Persistência por utilizador |
| Assinaturas | GET /me/subscription | Sim | Estado derivado do fornecedor/webhook |
| Checkout | POST /checkout | Sim ou fluxo de convidado explicitamente definido | Criar checkout no fornecedor |
| Doação | POST /donation | Não | Criar doação pendente e checkout seguro |
| Dashboard | GET /admin/dashboard | Sim, admin | Métricas calculadas de dados reais |
| Auditoria | GET /admin/audit-log | Sim, admin autorizado | Registos de auditoria |

As rotas acima constituem o contrato-alvo; a sua inclusão neste documento não significa que já estejam implementadas no backend.

## Anúncios padrão, editáveis manualmente

Os espaços publicitários devem ser apenas posições padrão configuráveis pelo painel, sem inventar campanhas, métricas, impressões ou receitas. Configuração mínima: identificador, posição, formato/tamanho, ativo/inativo, plataforma e ID de slot fornecido pelo administrador. Não renderizar anúncios de terceiros enquanto não houver ID válido e consentimento aplicável. Permitir guardar alterações no servidor e recarregar a configuração; cache local nunca deve ser considerada confirmação de persistência.

## Critérios de aceitação

- Nenhuma ação mostra sucesso antes de a API confirmar a persistência.
- Sem API configurada, exibir erro explícito; nunca simular sucesso com localStorage.
- A UI não decide permissões por si só; o servidor aplica RBAC.
- Dados públicos são carregados da API e limitados a recursos publicados.
- Operações de escrita exigem validação, autorização, rate limiting onde aplicável e trilho de auditoria.
- O backend devolve paginação consistente e erros tipados.
- Build, testes de integração e testes manuais são executados antes de declarar produção pronta.
