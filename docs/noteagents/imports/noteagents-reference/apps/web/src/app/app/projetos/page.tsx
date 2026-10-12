import { headers } from 'next/headers'
import { desc, eq } from 'drizzle-orm'
import { FolderKanban, Plus } from 'lucide-react'
import { auth } from '~/src/lib/auth'
import { db } from '~/src/lib/db'
import { projects } from '~/src/lib/db-schema'

export default async function ProjetosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const rows = session?.user ? await db.select().from(projects).where(eq(projects.userId, session.user.id)).orderBy(desc(projects.createdAt)) : []
  return <div className="module-page"><header><p className="panel-breadcrumb">Workspace / Projetos</p><h1>Projetos</h1><p>Projetos persistidos na sua workspace, sem dados fictícios.</p></header><section className="module-card"><FolderKanban size={28}/><div className="panel-section-card-heading"><div><span>Projetos registrados</span><h2>{rows.length ? `${rows.length} projeto${rows.length === 1 ? '' : 's'}` : 'Nenhum projeto conectado'}</h2></div><button className="panel-action-button secondary" type="button"><Plus size={14}/> Novo projeto</button></div>{rows.length ? <div className="project-list">{rows.map((project) => <article key={project.id}><strong>{project.name}</strong><span>{project.status} · criado em {project.createdAt.toLocaleDateString('pt-BR')}</span></article>)}</div> : <p>Integre um repositório para começar. Quando criar um projeto pela API, ele aparecerá aqui.</p>}</section></div>
}
