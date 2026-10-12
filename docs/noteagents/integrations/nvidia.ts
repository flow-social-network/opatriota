import type { LlmMessage, LlmProvider } from '../server/contracts'

export const NVIDIA_FREE_MODELS = [
  { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', family: 'Llama', context: '128k', free: true },
  { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct', family: 'Llama', context: '128k', free: true },
  { id: 'mistralai/mistral-7b-instruct-v0.3', name: 'Mistral 7B Instruct', family: 'Mistral', context: '32k', free: true },
  { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B IT', family: 'Gemma', context: '8k', free: true },
  { id: 'qwen/qwen2.5-72b-instruct', name: 'Qwen 2.5 72B Instruct', family: 'Qwen', context: '128k', free: true },
]

export class NvidiaProvider implements LlmProvider {
  constructor(private readonly endpoint = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1', private readonly model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct') {}
  async *stream(messages: LlmMessage[], signal?: AbortSignal) {
    const response = await fetch(`${this.endpoint}/chat/completions`, { method: 'POST', signal, headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.API_KEY || process.env.NVIDIA_API_KEY || ''}` }, body: JSON.stringify({ model: this.model, messages, stream: true, temperature: 0.2 }) })
    if (!response.ok || !response.body) throw new Error(`NVIDIA API indisponível: ${response.status}`)
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''
    while (true) { const chunk = await reader.read(); if (chunk.done) break; buffer += decoder.decode(chunk.value, { stream: true }); const lines = buffer.split('\n'); buffer = lines.pop() || ''; for (const line of lines) { if (!line.startsWith('data: ') || line.includes('[DONE]')) continue; try { const data = JSON.parse(line.slice(6)); const text = data.choices?.[0]?.delta?.content; if (text) yield text } catch {} } }
  }
}
