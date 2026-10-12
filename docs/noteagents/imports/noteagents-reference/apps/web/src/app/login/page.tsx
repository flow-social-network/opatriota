import { AuthScreen } from '../../components/AuthScreen'

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ returnTo?: string }> }) {
  const params = await searchParams
  const returnTo = params?.returnTo?.startsWith('/app/') ? params.returnTo : '/app/dashboard'
  return <AuthScreen returnTo={returnTo} />
}
