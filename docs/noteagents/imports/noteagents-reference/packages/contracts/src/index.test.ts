import { describe, expect, it } from 'vitest'
import { aiChatRequestSchema, failure, success } from './index'

describe('contratos compartilhados', () => {
  it('valida uma requisição de chat válida', () => {
    const result = aiChatRequestSchema.safeParse({
      messages: [{ role: 'user', content: 'Olá' }],
    })

    expect(result.success).toBe(true)
  })

  it('rejeita uma requisição de chat sem mensagens', () => {
    expect(aiChatRequestSchema.safeParse({ messages: [] }).success).toBe(false)
  })

  it('mantém o envelope de API consistente', () => {
    expect(success({ ok: true }, 'req-1')).toEqual({
      success: true,
      data: { ok: true },
      meta: { requestId: 'req-1' },
    })
    expect(failure('INVALID_REQUEST', 'Entrada inválida', 'req-2')).toEqual({
      success: false,
      error: { code: 'INVALID_REQUEST', message: 'Entrada inválida', requestId: 'req-2', timestamp: expect.any(String) },
    })
  })
})
