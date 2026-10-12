import type { Agent, AgentContext, AgentRun, Actor, Project, Tool, ToolCall } from './contracts'
import { id, now } from './contracts'
import { EventBus } from './event-bus'
import { requiresApproval, validateToolCall } from './policy'

export class AgentRuntime {
  readonly events = new EventBus()
  private readonly agents = new Map<string, Agent>()
  private readonly tools = new Map<string, Tool>()
  private readonly runs = new Map<string, AgentRun>()

  registerAgent(agent: Agent) { this.agents.set(agent.name, agent) }
  registerTool(tool: Tool) { this.tools.set(tool.name, tool) }
  getRun(runId: string) { return this.runs.get(runId) }
  listRuns(projectId: string) { return [...this.runs.values()].filter(run => run.projectId === projectId) }

  async execute(agentName: string, prompt: string, actor: Actor, project: Project, approve: AgentContext['approve']) {
    const agent = this.agents.get(agentName)
    if (!agent) throw new Error(`Agente não registrado: ${agentName}`)
    const run: AgentRun = { id: id('run'), projectId: project.id, agent: agentName, prompt, status: 'running', risk: 'low', createdAt: now(), updatedAt: now() }
    this.runs.set(run.id, run)
    const emit = (event: Parameters<AgentContext['emit']>[0]) => this.events.publish({ ...event, runId: run.id, at: now() })
    emit({ type: 'run.started', message: `Agente ${agentName} iniciado.` })
    const context: AgentContext = { actor, project, run, emit, approve }
    try { await agent.run(context); run.status = 'completed'; run.updatedAt = now(); emit({ type: 'run.completed', message: 'Execução concluída.' }) }
    catch (error) { run.status = 'failed'; run.error = error instanceof Error ? error.message : 'Falha desconhecida'; run.updatedAt = now(); emit({ type: 'run.failed', message: run.error }); throw error }
    return run
  }

  async callTool<T>(call: ToolCall, input: T, context: AgentContext) {
    validateToolCall(context.actor, call)
    if (requiresApproval(call)) { context.emit({ type: 'approval.required', message: `Aprovação necessária para ${call.name}.`, data: call }); if (!await context.approve(`Autorizar ${call.name}`)) throw new Error('Ação recusada pelo usuário.') }
    const tool = this.tools.get(call.name) as Tool<T> | undefined
    if (!tool) throw new Error(`Ferramenta não registrada: ${call.name}`)
    context.emit({ type: 'tool.called', message: `Executando ${call.name}.`, data: { input } })
    return tool.execute(input, context)
  }
}
