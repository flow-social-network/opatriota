import type { AgentRuntime } from './runtime'
import type { Actor, LlmProvider, Project } from './contracts'

export async function* streamChat(runtime: AgentRuntime, llm: LlmProvider, input: string, actor: Actor, project: Project, approve: (reason: string) => Promise<boolean>) {
  const run = await runtime.execute('orchestrator', input, actor, project, approve)
  for await (const token of llm.stream([{ role: 'system', content: 'Você é o NoteAgents. Analise o pedido, explique o plano e sugira ações seguras.' }, { role: 'user', content: input }])) { runtime.events.publish({ runId: run.id, type: 'chat.delta', message: token, at: new Date().toISOString() }); yield token }
  runtime.events.publish({ runId: run.id, type: 'chat.done', message: 'Resposta concluída.', at: new Date().toISOString() })
}
