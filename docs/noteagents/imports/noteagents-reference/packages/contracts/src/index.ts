import { z } from 'zod'

export const idSchema = z.string().trim().min(1)
export const isoDateSchema = z.string().datetime({ offset: true })

export const apiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  requestId: idSchema,
  timestamp: isoDateSchema,
  details: z.record(z.unknown()).optional(),
})

export const apiSuccessSchema = <T extends z.ZodTypeAny>(data: T) => z.object({
  success: z.literal(true),
  data,
  meta: z.object({ requestId: idSchema }),
})

export const apiFailureSchema = z.object({ success: z.literal(false), error: apiErrorSchema })
export const apiResponseSchema = <T extends z.ZodTypeAny>(data: T) => z.union([apiSuccessSchema(data), apiFailureSchema])

export const projectStatusSchema = z.enum(['active', 'archived'])
export const projectSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  repository: z.string().url().nullable(),
  status: projectStatusSchema,
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
})
export const createProjectSchema = z.object({ name: z.string().trim().min(1).max(120), repository: z.string().trim().url().nullable().optional() }).strict()
export const projectListSchema = z.array(projectSchema)

export const healthSchema = z.object({ status: z.literal('ok'), persistence: z.boolean() })

export const aiMessageRoleSchema = z.enum(['system', 'user', 'assistant'])
export const aiTextContentSchema = z.string().trim().min(1).max(100_000)
export const aiMessageContentSchema = z.union([aiTextContentSchema, z.array(z.discriminatedUnion('type', [z.object({ type: z.literal('text'), text: z.string().min(1) }), z.object({ type: z.literal('image_url'), image_url: z.object({ url: z.string().url() }) })])).min(1)])
export const aiMessageSchema = z.object({ role: aiMessageRoleSchema, content: aiMessageContentSchema })
export const aiChatContextSchema = z.object({ projectId: idSchema.optional(), workspaceId: idSchema.optional(), taskId: idSchema.optional(), agentId: idSchema.optional(), metadata: z.record(z.string()).optional() }).strict()
export const aiChatRequestSchema = z.object({ conversationId: idSchema.optional(), messages: z.array(aiMessageSchema).min(1).max(50), context: aiChatContextSchema.optional() }).strict()
export const aiChatResultSchema = z.object({ message: z.object({ id: idSchema, role: z.literal('assistant'), content: z.string().min(1) }), provider: z.string().min(1), model: z.string().min(1) })
export const aiChatResponseSchema = apiSuccessSchema(aiChatResultSchema)
export const aiHealthSchema = z.object({ provider: z.literal('nvidia'), configured: z.boolean(), available: z.boolean(), model: z.string().optional() })

export const agentDefinitionSchema = z.object({ identity: z.string(), mission: z.string(), allowed_tasks: z.array(z.string()), forbidden_tasks: z.array(z.string()), required_knowledge: z.array(z.string()), preferred_tools: z.array(z.string()), decision_rules: z.string(), workflow: z.string(), input_contract: z.record(z.unknown()), output_contract: z.record(z.unknown()), quality_gate: z.string() })
export const auditFindingSchema = z.object({ id: idSchema, category: z.string(), severity: z.enum(['critical', 'high', 'medium', 'low', 'info']), title: z.string(), description: z.string(), evidence: z.array(z.string()), recommendation: z.string(), autoFixAvailable: z.boolean() })
export const evidenceRecordSchema = z.object({ id: idSchema, source: z.string(), type: z.string(), content: z.string(), timestamp: z.number().int() })
export const readinessScoreSchema = z.object({ overall: z.number().min(0).max(100), categories: z.record(z.number().min(0).max(100)), blockers: z.number().int().nonnegative(), lastChecked: z.number().int() })

export type Project = z.infer<typeof projectSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type ApiResponse<T> = { success: true; data: T; meta: { requestId: string } }
export type ApiErrorResponse = { success: false; error: z.infer<typeof apiErrorSchema> }
export type AIMessage = z.infer<typeof aiMessageSchema>
export type AIChatRequest = z.infer<typeof aiChatRequestSchema>
export type AIChatResult = z.infer<typeof aiChatResultSchema>
export type AgentDefinition = z.infer<typeof agentDefinitionSchema>
export type AuditFinding = z.infer<typeof auditFindingSchema>
export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>
export type ReadinessScore = z.infer<typeof readinessScoreSchema>

export function success<T>(data: T, requestId: string): ApiResponse<T> { return { success: true, data, meta: { requestId } } }
export function failure(code: string, message: string, requestId: string, details?: Record<string, unknown>): ApiErrorResponse { return { success: false, error: { code, message, requestId, timestamp: new Date().toISOString(), ...(details ? { details } : {}) } } }

export const databaseTableMap = {
  projects: { table: 'projects', columns: { id: 'id', name: 'name', repository: 'repository', status: 'status', createdAt: 'created_at', updatedAt: 'updated_at' } },
  chatMessages: { table: 'chat_message', columns: { id: 'id', userId: 'userId', role: 'role', content: 'content', createdAt: 'createdAt' } },
  auth: { tables: ['user', 'session', 'account', 'verification'] },
} as const

export type Health = z.infer<typeof healthSchema>
export type AIHealth = z.infer<typeof aiHealthSchema>
export type ApiErrorCode = z.infer<typeof apiErrorSchema>['code']
