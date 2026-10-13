# Especificação tela a tela — Painel da redação

## Sistema visual comum

Todas as telas seguem cabeçalho azul-marinho com marca O PATRIOTA, busca global, notificações e perfil; menu lateral compacto e recolhível; fundo claro; cartões brancos; azul para ações; verde para sucesso; amarelo para atenção; vermelho para erro; tabelas com filtros e estados vazios.

## Inventário funcional

| Grupo | Telas/rotas | Operações mínimas | Persistência esperada |
|---|---|---|---|
| Início | `/redacao`, `/redacao/tarefas`, `/redacao/notificacoes`, `/redacao/agenda` | visualizar indicadores, abrir tarefa, marcar notificação, criar evento | tarefas, notificações e agenda via API |
| Conteúdo | `/redacao/materias`, `/redacao/materias/nova`, `/redacao/pautas`, `/redacao/editorias`, `/redacao/colunistas`, `/redacao/tags`, `/redacao/midia`, `/redacao/comentarios` | listar, filtrar, criar, editar, revisar e relacionar conteúdo | matérias, pautas, categorias, mídia e comentários |
| Jornal Digital | `/redacao/edicoes`, `/redacao/edicoes/nova`, `/redacao/edicoes/:id`, `/redacao/paginas`, `/redacao/editor-de-pagina`, `/redacao/modelos`, `/redacao/sumario`, `/redacao/revisao`, `/redacao/publicacao`, `/redacao/edicoes-publicadas` | criar edição, ordenar páginas, inserir matéria, revisar, agendar e publicar | edições, páginas, blocos e versões aprovadas |
| Editorial | `/redacao/rascunhos`, `/redacao/revisao`, `/redacao/correcao`, `/redacao/aprovadas`, `/redacao/programadas`, `/redacao/publicadas`, `/redacao/historico`, `/redacao/lixeira` | transicionar status com autorização e trilha | status editorial, histórico e auditoria |
| Multimídia | `/redacao/videos`, `/redacao/podcasts`, `/redacao/galerias`, `/redacao/banco-de-midia`, `/redacao/transmissoes` | registrar referências externas, validar URL, relacionar e arquivar | metadados e referências, não bytes no banco |
| Financeiro | `/redacao/financeiro`, `/redacao/assinaturas`, `/redacao/doacoes`, `/redacao/pagamentos`, `/redacao/reembolsos`, `/redacao/conciliacao`, `/redacao/relatorios-financeiros` | consultar, filtrar, exportar, reconciliar e auditar | assinaturas, pagamentos, webhooks e lançamentos |
| Usuários | `/redacao/equipe`, `/redacao/autores`, `/redacao/usuarios`, `/redacao/permissoes`, `/redacao/convites` | convidar, atribuir papéis, suspender e revisar acesso | usuários, papéis, convites e auditoria |
| Relatórios | `/redacao/desempenho`, `/redacao/mais-lidas`, `/redacao/audiencia`, `/redacao/relatorios`, `/redacao/exportar` | filtrar período, visualizar métricas disponíveis e exportar | consultas agregadas e registros de exportação |
| Configurações | `/redacao/configuracoes`, `/redacao/site`, `/redacao/jornal`, `/redacao/integracoes`, `/redacao/pagamentos-config`, `/redacao/seguranca`, `/redacao/preferencias`, `/redacao/logs`, `/redacao/suporte` | editar configurações autorizadas, testar integração e consultar logs | configurações versionadas e auditoria |

## Regras

- Ações editoriais sensíveis exigem permissão no servidor.
- Conteúdo sem dados reais mostra estado vazio, não números inventados.
- Publicação exige revisão/aprovação humana válida.
- Campos de matéria incluem título, subtítulo, linha fina, resumo, slug, editora, tags, autor, texto, mídia, crédito, fontes, SEO, acesso, status e agendamento.
- URL de vídeo/imagem deve ser validada por domínio e protocolo antes de incorporação.

## Estado

A arquitetura atual possui componentes funcionais para fontes, fila, identidade, redes, anúncios, push, exportação, usuários e permissões. O inventário acima é o escopo de implementação e a matriz de rotas a completar; componentes genéricos não substituem operações persistentes reais.
