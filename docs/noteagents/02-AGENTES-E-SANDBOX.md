# Agentes, ferramentas e sandbox

## Agentes

Cada agente recebe apenas o contexto necessário: regras do projeto, arquivos relevantes, pedido atual e resultados anteriores. O sistema deve resumir contexto antigo e nunca incluir segredos.

### Ferramentas de filesystem

`list_files`, `read_file`, `search_files`, `write_file`, `edit_file`, `move_file`, `delete_file`, `diff_workspace`.

Escritas são atômicas, usam checksum esperado e preservam histórico. Delete exige aprovação, exceto em arquivos temporários criados pelo próprio run.

### Ferramentas de execução

`install_dependencies`, `run_command`, `start_dev_server`, `stop_process`, `read_process_output`, `run_tests`, `run_lint`, `run_typecheck`, `run_build`.

O executor deve bloquear shell injection, comandos fora do workspace, acesso ao socket Docker, leitura de `/proc` sensível, escalada de privilégio e processos sem timeout.

### Ferramentas de navegador

`open`, `reload`, `snapshot`, `get_text`, `click`, `fill`, `select`, `set_viewport`, `screenshot`, `console_errors`, `vitals`.

Usar para validar visual, navegação, formulários, responsividade, hidratação e acessibilidade. Screenshots ficam em storage temporário e expiram.

### Ferramentas Git

`status`, `diff`, `log`, `create_branch`, `commit`, `push_branch`, `pull`, `create_pull_request`. Nunca fazer push direto para a branch padrão sem aprovação explícita.

### Ferramentas de integração

`list_integrations`, `request_connection`, `read_schema`, `run_query`, `prepare_migration`, `deploy_preview`, `read_deploy_logs`, `rollback_deploy`. Cada uma usa OAuth, token efêmero ou credencial do cofre.

## Sandbox

Cada execução recebe um sandbox efêmero com:

- filesystem montado somente no workspace do projeto;
- usuário sem privilégios;
- CPU, memória, disco e duração limitados;
- rede negada por padrão e allowlist por integração;
- filesystem temporário separado;
- imagem de runtime versionada;
- limite de processos e conexões;
- limpeza garantida após término;
- logs e artefatos enviados ao storage sem segredos.

Para desenvolvimento, o sandbox expõe apenas uma porta proxyada. O preview público nunca deve apontar diretamente para um processo interno sem autenticação de sessão e expiração.

## Aprovações

Exigir confirmação para: apagar arquivos, migrar banco, escrever dados remotos, instalar pacote desconhecido, usar credencial, publicar produção, alterar domínio, push, merge, enviar e-mail ou executar comando de alto risco.

A aprovação registra usuário, resumo do impacto, escopo, validade e resultado. Nunca pedir aprovação para cada leitura segura.

## Resiliência

Cada tool call tem timeout, retry limitado e chave de idempotência. Em falha, registrar causa e oferecer a menor recuperação conhecida. Cancelamento deve interromper processos filhos e marcar o run como cancelado. Jobs longos usam fila durável e heartbeat.

## Prompt de sistema do agente

O prompt deve obrigar: inspecionar antes de editar, preferir mudanças mínimas, manter idioma do projeto, respeitar regras locais, validar no preview, não inventar APIs e relatar limitações. O modelo não pode alterar suas próprias permissões nem remover auditoria.
