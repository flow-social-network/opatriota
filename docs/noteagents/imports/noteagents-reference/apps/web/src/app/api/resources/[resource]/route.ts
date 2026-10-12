import { headers } from 'next/headers'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { auth } from '~/src/lib/auth'
import { db } from '~/src/lib/db'
import { agents, audits, evidence, integrations, notifications, observabilityEvents, pipelines, repositories, tasks, workspaces } from '~/src/lib/db-schema'

const resources = { agents, audits, evidence, integrations, notifications, observability: observabilityEvents, pipelines, repositories, tasks, workspaces } as const
const input = z.object({ name: z.string().trim().min(1).max(160), description: z.string().trim().max(2000).optional(), projectId: z.string().trim().min(1).optional() }).strict()

export async function GET(_request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Não autorizado' }, { status: 401 })
  const { resource } = await params
  const table = resources[resource as keyof typeof resources]
  if (!table) return Response.json({ error: 'Recurso não encontrado' }, { status: 404 })
  const rows = await db.select().from(table).where(eq(table.userId, session.user.id)).orderBy(desc(table.createdAt)).limit(100)
  return Response.json({ success: true, data: rows })
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Não autorizado' }, { status: 401 })
  const { resource } = await params
  const table = resources[resource as keyof typeof resources]
  if (!table || !('name' in table)) return Response.json({ error: 'Recurso não aceita criação' }, { status: 404 })
  const parsed = input.safeParse(await request.json())
  if (!parsed.success) return Response.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
  const row = { id: crypto.randomUUID(), userId: session.user.id, name: parsed.data.name, description: parsed.data.description ?? null, ...(parsed.data.projectId ? { projectId: parsed.data.projectId } : {}) }
  const [created] = await db.insert(table as typeof agents).values(row as never).returning()
  return Response.json({ success: true, data: created }, { status: 201 })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Não autorizado' }, { status: 401 })
  const { resource } = await params
  const table = resources[resource as keyof typeof resources]
  if (!table) return Response.json({ error: 'Recurso não encontrado' }, { status: 404 })
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return Response.json({ error: 'id é obrigatório' }, { status: 400 })
  await db.delete(table).where(and(eq(table.id, id), eq(table.userId, session.user.id)))
  return new Response(null, { status: 204 })
}

export const runtime = 'nodejs'
