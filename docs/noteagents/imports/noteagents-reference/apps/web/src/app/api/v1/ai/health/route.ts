import { getNvidiaConfig } from '~/src/lib/ai/config'

export async function GET() {
  const config = getNvidiaConfig()
  return Response.json({ provider: 'nvidia', configured: Boolean(config), available: Boolean(config), ...(config ? { model: config.model } : {}) })
}
