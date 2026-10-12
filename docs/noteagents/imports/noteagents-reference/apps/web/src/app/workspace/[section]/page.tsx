import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '~/src/lib/auth'
import { panelRoutes } from '~/src/lib/routes'

const legacySections: Record<string, string> = {
  projetos: panelRoutes.projetos,
  chat: panelRoutes.chat,
  fontes: panelRoutes.fontes,
  agentes: panelRoutes.agentes,
  pipelines: panelRoutes.pipelines,
  auditorias: panelRoutes.auditorias,
  'banco-de-dados': panelRoutes.database,
  integracoes: panelRoutes.integracoes,
  ambiente: panelRoutes.ambiente,
  orquestrador: panelRoutes.orquestrador,
  memoria: panelRoutes.memoria,
  ferramentas: panelRoutes.ferramentas,
  evidencias: panelRoutes.evidencias,
  observabilidade: panelRoutes.observabilidade,
  cli: panelRoutes.cli,
}

export default async function WorkspaceSectionPage({ params }: { params: { section: string } }) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session?.user) redirect(`/auth/login?returnTo=/app/${params.section}`)
  redirect(legacySections[params.section] ?? panelRoutes.dashboard)
}
