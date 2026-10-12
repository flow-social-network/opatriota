import type { AIChatRequest } from '~/src/lib/ai/types'
import { getNvidiaConfig } from '~/src/lib/ai/config'

export class AIProviderError extends Error { constructor(public readonly code: string, message: string, public readonly retryable = false) { super(message) } }

export async function chatWithNvidia(request: AIChatRequest) {
  const config = getNvidiaConfig()
  if (!config) throw new AIProviderError('AI_PROVIDER_NOT_CONFIGURED', 'NVIDIA AI provider is not configured.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), config.timeoutMs)
  try {
    for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
      const response = await fetch(`${config.baseUrl.replace(/\/$/, '')}/chat/completions`, { method: 'POST', headers: { Authorization: `Bearer ${config.apiKey}`, Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ model: config.model, messages: request.messages, max_tokens: config.maxTokens, temperature: config.temperature, top_p: config.topP, stream: false }), signal: controller.signal })
      if (response.ok) {
        const data = await response.json() as { choices?: Array<{ message?: { content?: string } }>; usage?: Record<string, number> }
        const content = data.choices?.[0]?.message?.content
        if (!content) throw new AIProviderError('AI_PROVIDER_RESPONSE_INVALID', 'The AI provider returned an invalid response.')
        return { content, model: config.model, usage: data.usage }
      }
      if ((response.status === 429 || response.status >= 500) && attempt < config.maxRetries) { await new Promise((resolve) => setTimeout(resolve, config.retryBaseDelayMs * 2 ** attempt)); continue }
      if (response.status === 401 || response.status === 403) throw new AIProviderError('AI_PROVIDER_AUTHENTICATION_FAILED', 'The AI provider authentication failed.')
      if (response.status === 429) throw new AIProviderError('AI_PROVIDER_RATE_LIMITED', 'The AI provider rate limit was reached.', true)
      throw new AIProviderError(response.status >= 500 ? 'AI_PROVIDER_UNAVAILABLE' : 'AI_PROVIDER_INVALID_REQUEST', 'The AI provider could not process the request.', response.status >= 500)
    }
    throw new AIProviderError('AI_PROVIDER_UNAVAILABLE', 'The AI provider is temporarily unavailable.', true)
  } catch (error) { if (error instanceof AIProviderError) throw error; if (error instanceof Error && error.name === 'AbortError') throw new AIProviderError('AI_PROVIDER_TIMEOUT', 'The AI provider request timed out.', true); throw new AIProviderError('AI_PROVIDER_UNKNOWN_ERROR', 'The AI provider request failed.', true) } finally { clearTimeout(timer) }
}
