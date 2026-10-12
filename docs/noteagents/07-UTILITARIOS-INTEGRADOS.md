# Utilitários integrados ao NoteAgents

## Fontes analisadas

Foram analisados e copiados para `imports/` os dois arquivos fornecidos:

- `awesome-claude-code`: catálogo de recursos, categorias e utilitários de curadoria.
- `clonar-repositorio-git-hub`: referência do runtime NoteAgents com agentes reviewer, error-fixer e testing, CLI, auditoria, evidências, cache, locks e readiness.

## O que foi integrado

O registro de capacidades (`registry.ts`) agora descobre também:

- agentes e aplicações da referência NoteAgents;
- recursos de auditoria do catálogo awesome;
- skills, comandos e MCPs das importações anteriores;
- capabilities importadas com indicação de aprovação obrigatória.

O endpoint `GET /api/capabilities` expõe a lista para o chat e para a futura interface de seleção de agente.

## Utilitários úteis adotados

### Auditoria

Use o padrão de auditoria para detectar segredos, arquivos grandes, TODO/FIXME excessivos, dependências vulneráveis e prontidão do projeto. A auditoria deve ser somente leitura por padrão.

### Evidências

Cada execução deve registrar agente, tarefa, arquivos afetados, comandos, testes, duração e resultado. Nunca grave chaves ou valores de variáveis de ambiente.

### Cache

Use cache por hash de agente, tarefa e contexto, com TTL e invalidação quando os arquivos mudarem. Respostas com falha não devem ser armazenadas como sucesso.

### Locks e escrita atômica

Use lock por arquivo, detecção de lock antigo e escrita temporária seguida de rename. Isso evita corrupção quando dois agentes trabalham no mesmo workspace.

### Agentes especializados

- `reviewer`: revisão sem editar diretamente;
- `error-fixer`: propõe e aplica correções autorizadas;
- `testing`: executa testes e registra evidências;
- `security`: procura segredos e riscos;
- `devops`: analisa build, deploy e infraestrutura.

## Limites e licenciamento

Os arquivos foram mantidos como referências importadas e não são executados automaticamente. O NoteAgents usa contratos próprios e adaptadores locais. Antes de redistribuir ou modificar qualquer conteúdo de terceiros, verifique a licença correspondente e preserve avisos obrigatórios.

Não foram importadas dependências de `node_modules`, builds ou credenciais. O código importado não substitui o sandbox: qualquer execução deve passar pelo policy engine e por aprovação humana quando houver risco.
