import type { AIChatRequest, AIMessage } from '@noteagents/contracts'

export type { AIChatRequest, AIMessage }
export type AIMessageRole = AIMessage['role']
export type AIMessageContent = AIMessage['content']

export type AIChatResponse = {
  success: true
  data: { message: { id: string; role: 'assistant'; content: string }; provider: string; model: string }
  meta: { requestId: string }
}

export type AIErrorCode =
  | 'AI_PROVIDER_NOT_CONFIGURED'
  | 'AI_PROVIDER_AUTHENTICATION_FAILED'
  | 'AI_PROVIDER_RATE_LIMITED'
  | 'AI_PROVIDER_TIMEOUT'
  | 'AI_PROVIDER_UNAVAILABLE'
  | 'AI_PROVIDER_INVALID_REQUEST'
  | 'AI_PROVIDER_RESPONSE_INVALID'
  | 'AI_PROVIDER_UNKNOWN_ERROR'
