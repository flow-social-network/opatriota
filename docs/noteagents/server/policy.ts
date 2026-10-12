import type { Actor, Risk, ToolCall } from './contracts'

const rank: Record<Risk, number> = { low: 0, medium: 1, high: 2, critical: 3 }
const privileged: Record<Actor['role'], number> = { viewer: 0, developer: 1, admin: 2, owner: 3 }

export function validateToolCall(actor: Actor, call: ToolCall) {
  if (call.name.includes('deploy.production') && actor.role !== 'owner') throw new Error('Somente o proprietário pode publicar em produção.')
  if (rank[call.risk] >= rank.high && privileged[actor.role] < privileged.admin) throw new Error('Esta ação exige permissão administrativa.')
  if (call.name.startsWith('filesystem.') && actor.role === 'viewer') throw new Error('Visualizadores não podem alterar arquivos.')
}

export function requiresApproval(call: ToolCall) { return call.approvalRequired || rank[call.risk] >= rank.high }
