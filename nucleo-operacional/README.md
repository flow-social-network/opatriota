# Núcleo Operacional — O Patriota Brasil

Núcleo inicial persistente para ingestão RSS, fila de tarefas PostgreSQL, Agente Redator, Agente Guardião, registo de execuções e monitorização administrativa.

## Componentes

- `src/core.ts`: consulta fontes RSS ativas, deduplica itens, enfileira tarefas persistentes, chama uma API real de IA compatível com chat completions, cria rascunhos, executa revisão preliminar e regista resultados.
- `src/worker.ts`: processo separado e contínuo, independente de utilizadores conectados.
- `backend/src/routes/operational-core.ts`: endpoints administrativos protegidos por sessão e funções ADMIN/CHIEF_EDITOR.
- `prisma/schema.prisma` e migração: tarefas, execuções de agentes e proveniência/crédito da imagem.

## Configuração

Definir no ambiente do worker:
- `DATABASE_URL`: PostgreSQL online.
- `OPERATIONAL_AUTHOR_ID`: ID de utilizador editorial existente, ativo e autorizado.
- `OPATRIOTA_AI_API_URL`: endpoint compatível com chat completions.
- `OPATRIOTA_AI_API_KEY`: segredo do fornecedor de IA; não versionar.
- `OPATRIOTA_AI_MODEL`: modelo real.
- `CORE_POLL_INTERVAL_MS`: intervalo do worker (padrão 15000 ms).
- `CORE_BATCH_SIZE`: máximo de tarefas por ciclo (padrão 5).

Sem a configuração real da API de IA, as tarefas falham explicitamente e ficam registadas; não existem respostas simuladas. O núcleo também aceita a configuração existente FACTCHECK_AI_API_URL, FACTCHECK_AI_API_KEY e FACTCHECK_AI_MODEL como alternativa.

## Execução

Depois de aplicar a migração num ambiente autorizado e regenerar Prisma Client:

```bash
pnpm install
pnpm exec prisma generate --schema prisma/schema.prisma
pnpm core:check
pnpm core:worker
```

O worker deve executar como processo/worker online separado. Não o manter dentro de uma função serverless da Vercel. A hospedagem e os segredos precisam de ser configurados no serviço escolhido.

## Regras editoriais e de transparência

- Os artigos gerados ficam sempre como rascunhos; o núcleo não aprova nem publica.
- O Guardião faz uma revisão preliminar, não uma garantia absoluta de verdade nem parecer jurídico.
- O artigo guarda URL canónica, fonte relacionada, URL da imagem e crédito apenas quando a fonte o fornece. O ficheiro da imagem não é descarregado.
- Sem crédito fotográfico explícito, o campo fica vazio e o Guardião deve sinalizar a pendência; não se inventa fotógrafo nem se atribui automaticamente o crédito da fotografia ao editor do feed.
- A orientação conservadora/liberal pode orientar o enquadramento, sem distorcer factos.
- O conteúdo do feed pode ter direitos próprios; a origem e os termos devem ser confirmados antes da publicação. A existência de uma fonte não torna automaticamente permitida a republicação integral.

## Limitações e validação pendente

Esta é uma primeira implementação de núcleo. Ainda exige geração do Prisma Client, validação do schema, typecheck, testes de integração e configuração real do fornecedor de IA e do worker online. O endpoint de status demonstra dados consultados na base de dados, mas não prova por si só que o processo worker esteja ativo.


## NotebookLM

A auditoria desta branch não encontrou uma integração programática de NotebookLM no código. O núcleo não simula chamadas a esse serviço. Antes de integrar, é necessário identificar o fluxo/acesso existente e confirmar um método suportado; até lá, o núcleo usa a API de IA configurada acima e mantém URLs e evidências de origem.
