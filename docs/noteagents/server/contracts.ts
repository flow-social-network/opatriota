export type Role = 'owner' | 'admin' | 'developer' | 'viewer'
export type AgentStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
export type Risk = 'low' | 'medium' | 'high' | 'critical'
export type EventType = 'run.started' | 'run.progress' | 'chat.delta' | 'chat.done' | 'tool.called' | 'approval.required' | 'run.completed' | 'run.failed'

export interface Project { id: string; name: string; root: string; ownerId: string; createdAt: string }
export interface Actor { id: string; role: Role; projectId: string }
export interface AgentRun { id: string; projectId: string; agent: string; prompt: string; status: AgentStatus; risk: Risk; createdAt: string; updatedAt: string; error?: string }
export interface ToolCall { name: string; input: Record<string, unknown>; risk: Risk; approvalRequired: boolean }
export interface AgentEvent { runId: string; type: EventType; message: string; data?: unknown; at: string }
export interface AgentContext { actor: Actor; project: Project; run: AgentRun; emit: (event: Omit<AgentEvent, 'runId' | 'at'>) => void; approve: (reason: string) => Promise<boolean> }
export interface Agent { name: string; description: string; run(context: AgentContext): Promise<void> }
export interface Tool<TInput = Record<string, unknown>, TResult = unknown> { name: string; description: string; risk(input: TInput): Risk; execute(input: TInput, context: AgentContext): Promise<TResult> }
export interface LlmMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface LlmProvider { stream(messages: LlmMessage[], signal?: AbortSignal): AsyncIterable<string> }
export interface WorkspaceAdapter { read(path: string): Promise<string>; write(path: string, content: string): Promise<void>; list(path?: string): Promise<string[]>; diff(): Promise<string> }
export interface BrowserAdapter { open(url: string): Promise<void>; snapshot(): Promise<unknown>; screenshot(path: string): Promise<void>; click(selector: string): Promise<void>; fill(selector: string, value: string): Promise<void> }
export interface GitAdapter { status(): Promise<unknown>; diff(): Promise<string>; commit(message: string): Promise<string>; createBranch(name: string): Promise<void>; push(): Promise<void>; createPullRequest(title: string, body: string): Promise<string> }
export interface DeployAdapter { preview(project: Project): Promise<{ url: string }>; production(project: Project): Promise<{ url: string }> }
export interface DatabaseAdapter { schema(): Promise<unknown>; query<T>(sql: string, params?: unknown[]): Promise<T[]>; migrate(sql: string): Promise<void>; health(): Promise<{ connected: boolean; serverTime?: string }> }
export interface ProjectRepository { getOrCreateLocalProject(): Promise<Project>; saveRun(run: AgentRun): Promise<AgentRun>; saveMessage(projectId: string, role: LlmMessage['role'] | 'tool', content: string, model: string, attachments?: unknown[]): Promise<void> }
export const now = () => new Date().toISOString()
export const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`
