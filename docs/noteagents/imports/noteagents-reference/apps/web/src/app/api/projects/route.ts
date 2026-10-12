import { headers } from 'next/headers'
import { desc, eq } from 'drizzle-orm'
import { auth } from '~/src/lib/auth'
import { db } from '~/src/lib/db'
import { projects } from '~/src/lib/db-schema'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Não autorizado' }, { status: 401 })
  const rows = await db.select().from(projects).where(eq(projects.userId, session.user.id)).orderBy(desc(projects.createdAt))
  return Response.json({ projects: rows })
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return Response.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await request.json() as { name?: string; description?: string; repositoryUrl?: string }
  const name = body.name?.trim()
  if (!name) return Response.json({ error: 'Nome do projeto é obrigatório' }, { status: 400 })
  const id = crypto.randomUUID()
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id.slice(0, 8)}`
  const [project] = await db.insert(projects).values({ id, userId: session.user.id, name, slug, description: body.description?.trim() || null, repositoryUrl: body.repositoryUrl?.trim() || null }).returning()
  return Response.json({ project }, { status: 201 })
}
