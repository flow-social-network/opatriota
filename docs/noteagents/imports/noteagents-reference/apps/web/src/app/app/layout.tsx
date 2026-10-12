import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { ApplicationShell } from '~/src/components/layout/ApplicationShell'
import { auth } from '~/src/lib/auth'

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/login')
  return <ApplicationShell>{children}</ApplicationShell>
}
