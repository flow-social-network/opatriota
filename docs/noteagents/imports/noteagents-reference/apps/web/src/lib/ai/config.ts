export type NvidiaConfig = { apiKey: string; baseUrl: string; model: string; timeoutMs: number; maxTokens: number; temperature: number; topP: number; maxRetries: number; retryBaseDelayMs: number }

export function getNvidiaConfig(): NvidiaConfig | null {
  const apiKey = process.env.NVIDIA_API_KEY
  const model = process.env.NVIDIA_MODEL || process.env.NOTEAGENTS_MODEL
  if (!apiKey || !model) return null
  return { apiKey, baseUrl: process.env.NVIDIA_API_BASE_URL || 'https://integrate.api.nvidia.com/v1', model, timeoutMs: Number(process.env.NVIDIA_TIMEOUT_MS || 120000), maxTokens: Number(process.env.NVIDIA_MAX_TOKENS || 4096), temperature: Number(process.env.NVIDIA_TEMPERATURE || 1), topP: Number(process.env.NVIDIA_TOP_P || 0.95), maxRetries: Number(process.env.AI_MAX_RETRIES || 2), retryBaseDelayMs: Number(process.env.AI_RETRY_BASE_DELAY_MS || 500) }
}
