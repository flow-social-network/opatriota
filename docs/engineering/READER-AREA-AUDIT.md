# Auditoria da Área do Leitor

## Referências visuais auditadas

As referências mostram um produto com cabeçalho azul, identidade do O Patriota, busca, perfil do leitor, menu lateral persistente e conteúdo principal em cartões. O painel inicial destaca o Jornal Digital, últimas edições e editorias. As demais telas apresentam assinaturas, matérias salvas, favoritos, notificações, editorias, colunistas, vídeos, podcasts, newsletter, dados pessoais, pagamentos, configurações, suporte e saída.

| Nº | Página | Elementos e comportamento esperado | Implementação atual | Backend necessário | Critério de aceite |
|---:|---|---|---|---|---|
| 1 | Minha Conta | Resumo, status, jornal, edições e atalhos | Parcial, dashboard existente | Sessão e dados do leitor | Dados vêm da sessão/API |
| 2 | Jornal Digital | Visualizador paginado, sumário, zoom, teclado e edições | Implementado nesta etapa com páginas estruturadas | Edições, páginas e autorização | Navegar sem PDF único obrigatório |
| 3 | Assinaturas | Plano, benefícios, ciclo, status e gestão | Parcial, planos e checkout existentes | Gateway, webhooks, assinatura | Status só após confirmação backend |
| 4 | Matérias Salvas | Lista, abrir e remover | Implementado | `/me/bookmarks` | Persistência por usuário |
| 5 | Favoritos | Cards e leitura posterior | Implementado | Bookmarks | Sem dados compartilhados entre usuários |
| 6 | Notificações | Preferências e histórico | Preferências parcialmente implementadas | Preferências e notificações | Alteração persistida no servidor |
| 7 | Editorias | Grade de editorias e acesso | Parcial | Categorias públicas | Links resolvem para páginas reais |
| 8 | Colunistas | Perfis e artigos | Parcial | Autores e matérias | Perfil abre conteúdo relacionado |
| 9 | Vídeos | Listagem e reprodução | A validar | Mídia e provedor | Player com estados de erro |
| 10 | Podcasts | Episódios e reprodução | A validar | Episódios e mídia | Reprodução acessível |
| 11 | Newsletter | Inscrição e preferências | A validar | Lista de contatos e consentimento | Confirmação e descadastro |
| 12 | Meus Dados | Formulário e exportação LGPD | Parcial, perfil e exportação existentes | Dados do usuário | Alteração autenticada |
| 13 | Pagamento | Método, histórico e comprovantes | Parcial, histórico existente | Gateway e registros | Nunca expor dados sensíveis |
| 14 | Configurações | Alertas, privacidade e preferências | Parcial | Preferências por usuário | Persistência real |
| 15 | Ajuda e Suporte | FAQ e abertura de chamado | A validar | Tickets e notificações | Protocolo rastreável |
| 16 | Sair | Confirmação e encerramento | Implementado | Revogação/expiração de sessão | Sessão deixa de autorizar chamadas |

## Riscos identificados

- Dados de demonstração ainda existem no frontend e precisam ser substituídos por consultas reais quando o módulo correspondente for ativado.
- Assinatura e doação devem permanecer entidades distintas.
- Conteúdo e jornal digital precisam passar por autorização no backend.
- Edições publicadas devem ser versionadas, não alteradas silenciosamente.
