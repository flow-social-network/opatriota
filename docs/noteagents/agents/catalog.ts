import type { Agent, AgentContext } from '../server/contracts'

const progress = (context: AgentContext, message: string) => context.emit({ type: 'run.progress', message })

export const createAgents = (): Agent[] => [
  { name: 'orchestrator', description: 'Decompõe pedidos, escolhe especialistas e coordena o fluxo.', async run(context) { progress(context, 'Requisitos analisados e plano criado.'); progress(context, 'Especialistas prontos para execução.') } },
  { name: 'frontend', description: 'Implementa interfaces acessíveis e responsivas.', async run(context) { progress(context, 'Estrutura de interface analisada.'); progress(context, 'Componentes e estados planejados.') } },
  { name: 'backend', description: 'Implementa APIs, validação, autorização e regras de negócio.', async run(context) { progress(context, 'Contrato de API definido.'); progress(context, 'Validação e autorização verificadas.') } },
  { name: 'database', description: 'Inspeciona schemas, cria consultas e migrações seguras.', async run(context) { progress(context, 'Schema remoto deve ser confirmado antes da consulta.'); progress(context, 'Migrações destrutivas bloqueadas por padrão.') } },
  { name: 'qa', description: 'Executa testes, type-check, lint, build e validação no navegador.', async run(context) { progress(context, 'Plano de verificação criado.'); progress(context, 'Resultados serão anexados à execução.') } },
  { name: 'security', description: 'Audita segredos, permissões, entradas e superfície de ataque.', async run(context) { progress(context, 'Políticas de segurança aplicadas.') } },
  { name: 'devops', description: 'Gerencia Git, preview, deploy, logs e rollback.', async run(context) { progress(context, 'Ambiente de preview identificado.'); progress(context, 'Produção exige aprovação explícita.') } },
  { name: 'ui-reviewer', description: 'Compara telas com referências e corrige responsividade.', async run(context) { progress(context, 'Viewport desktop e mobile serão validados.') } },
]
