import { headers } from 'next/headers'
import { auth } from '~/src/lib/auth'
import { db } from '~/src/lib/db'
import { chatMessages } from '~/src/lib/db-schema'
import { chatWithNvidia, AIProviderError } from '~/src/lib/ai/nvidia-provider'
import { aiChatRequestSchema, failure, success } from '@noteagents/contracts'

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Faça login para usar a IA.' }, requestId }, { status: 401 })
  try {
    const parsed = aiChatRequestSchema.safeParse(await request.json())
    if (!parsed.success) throw new AIProviderError('AI_PROVIDER_INVALID_REQUEST', 'A conversa precisa conter entre 1 e 50 mensagens.')
    const body = parsed.data
    const result = await chatWithNvidia(body)
    const userMessage = [...body.messages].reverse().find((message) => message.role === 'user')
    const content = typeof userMessage?.content === 'string' ? userMessage.content : JSON.stringify(userMessage?.content || '')
    await db.insert(chatMessages).values({ id: crypto.randomUUID(), userId: session.user.id, role: 'user', content })
    await db.insert(chatMessages).values({ id: crypto.randomUUID(), userId: session.user.id, role: 'assistant', content: result.content })
    return Response.json(success({ message: { id: crypto.randomUUID(), role: 'assistant' as const, content: result.content }, provider: 'nvidia', model: result.model }, requestId))
  } catch (error) {
    const known = error instanceof AIProviderError ? error : new AIProviderError('AI_PROVIDER_UNKNOWN_ERROR', 'Não foi possível concluir a solicitação.')
    return Response.json(failure(known.code, known.message, requestId), { status: known.code === 'AI_PROVIDER_NOT_CONFIGURED' ? 503 : 502 })
  }
}
