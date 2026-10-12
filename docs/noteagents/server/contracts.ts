export type Role = 'owner' | 'admin' | 'developer' | 'viewer'
export type AgentStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
export type Risk = 'low' | 'medium' | 'high' | 'critical'

export interface Project { id: string; name: string; root: string; ownerId: string; createdAt: string }
export interface Actor { id: string; role: Role; projectId: string }
export interface AgentRun { id: string; projectId: string; agent: string; prompt: string; status: AgentStatus; risk: Risk; createdAt: string; updatedAt: string; error?: string }
export interface ToolCall { name: string; input: Record<string, unknown>; risk: Risk; approvalRequired: boolean }
export interface AgentEvent { runId: string; type: 'run.started' | 'run.progress' | 'tool.called' | 'approval.required' | 'run.completed' | 'run.failed'; message: string; data?: unknown; at: string }
export interface AgentContext { actor: Actor; project: Project; run: AgentRun; emit: (event: Omit<AgentEvent, 'runId' | 'at'>) => void; approve: (reason: string) => Promise<boolean> }
export interface Agent { name: string; description: string; run(context: AgentContext): Promise<void> }
export interface Tool<TInput = Record<string, unknown>, TResult = unknown> { name: string; description: string; risk(input: TInput): Risk; execute(input: TInput, context: AgentContext): Promise<TResult> }

export const now = () => new Date().toISOString()
export const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`
