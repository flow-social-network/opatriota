# Produto, preview, Git e deploy

## Interface principal

Layout recomendado em três áreas responsivas:

1. barra lateral: projetos, threads, integrações e arquivos;
2. área central: chat, plano, aprovações e diffs;
3. painel direito: preview, console, terminal e testes.

No celular, usar abas ou drawer, sem overflow horizontal. O usuário sempre deve saber qual projeto, branch, run e ambiente estão ativos.

## Chat

Suportar streaming, markdown seguro, código com copiar, referências de arquivos, anexos, cancelamento, retry, edição de prompt e histórico. Cada resposta mostra ações executadas e evidências. Mensagens podem ser regeneradas sem apagar o histórico.

## Preview

O Preview Service:

1. cria workspace a partir de branch/snapshot;
2. instala dependências com cache isolado;
3. inicia dev server;
4. detecta porta;
5. cria URL assinada e proxyada;
6. transmite logs;
7. reinicia após alteração;
8. encerra por inatividade.

Deve suportar viewport desktop/tablet/mobile, tema claro/escuro, screenshot e console. Erros do navegador devem virar contexto para o agente, não apenas uma tela vazia.

## Edição e versões

O editor mostra diff por arquivo e permite aceitar/rejeitar hunk. Antes da alteração, criar checkpoint. Cada checkpoint aponta para commit ou snapshot imutável. Undo restaura o checkpoint, nunca apaga auditoria.

## Git workflow

1. conectar provedor via OAuth;
2. selecionar repositório e branch base;
3. clonar em workspace isolado;
4. criar branch `noteagents/<slug>`;
5. editar e validar;
6. commit com mensagem imperativa;
7. push da branch;
8. abrir ou atualizar PR;
9. exibir checks;
10. permitir merge apenas ao usuário autorizado.

Nunca sobrescrever mudanças novas do usuário: detectar conflito e pedir resolução.

## Deploy

Ambientes: `development`, `preview`, `production`. Preview deve ser criado por branch/PR. Produção requer aprovação e checklist verde. Após deploy, executar smoke tests, verificar status, coletar logs e registrar URL. Rollback aponta para deployment anterior conhecido.

## Pipeline de qualidade

- formatter;
- lint;
- typecheck;
- testes unitários;
- testes de contrato;
- testes de integração;
- teste de build;
- navegador para fluxos visíveis;
- acessibilidade automatizada;
- análise de dependências;
- diff de segurança.

## Estados de erro da interface

Exibir estados distintos para: sem integração, sem permissão, segredo ausente, dependência ausente, build quebrado, preview indisponível, timeout, conflito Git, deploy falhou e ação aguardando aprovação. Cada estado deve sugerir a próxima ação segura.

## Métricas de produto

Tempo até primeiro preview, taxa de sucesso da primeira execução, runs corrigidos, falhas por etapa, custo por projeto, retenção de threads, tempo de deploy e taxa de rollback. Não usar métricas para ocultar falhas ou pressionar aprovação automática.
