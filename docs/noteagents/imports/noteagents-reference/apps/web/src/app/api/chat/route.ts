import { convertToModelMessages, streamText } from 'ai'
import { headers } from 'next/headers'
import { auth } from '~/src/lib/auth'
import { db } from '~/src/lib/db'
import { chatMessages } from '~/src/lib/db-schema'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return new Response('Não autorizado', { status: 401 })

  const body = await request.json()
  const messages = await convertToModelMessages(body.messages ?? [])
  const latest = [...messages].reverse().find((message) => message.role === 'user')
  const conversationId = typeof body.conversationId === 'string' ? body.conversationId : crypto.randomUUID()
  if (latest) {
    const content = latest.content
    await db.insert(chatMessages).values({
      id: crypto.randomUUID(),
      conversationId,
      userId: session.user.id,
      role: 'user',
      content: typeof content === 'string' ? content : JSON.stringify(content),
    })
  }

  const result = streamText({
    model: 'spacexai/grok-4.7',
    system: 'Você é o assistente de engenharia do NoteAgents. Responda em português, seja objetivo e nunca invente dados. Explique decisões técnicas com clareza.',
    messages,
    onFinish: async ({ text }) => {
      await db.insert(chatMessages).values({
        id: crypto.randomUUID(),
        conversationId,
        userId: session.user.id,
        role: 'assistant',
        content: text,
      })
    },
  })

  return result.toUIMessageStreamResponse()
}
