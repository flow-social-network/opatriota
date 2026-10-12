import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '~/src/lib/auth'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/login?returnTo=/app/dashboard')
  redirect('/app/dashboard')
}
