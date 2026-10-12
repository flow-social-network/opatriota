'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Github, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { authClient } from '~/src/lib/auth-client'

type AuthMode = 'login' | 'register' | 'reset'

export function AuthScreen({ returnTo = '/app/dashboard' }: { returnTo?: string }) {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'reset') {
        const result = await authClient.requestPasswordReset({ email, redirectTo: `${window.location.origin}/login` })
        if (result.error) throw new Error('Não foi possível enviar as instruções.')
        setMessage('Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.')
      } else if (mode === 'register') {
        const result = await authClient.signUp.email({ name, email, password })
        if (result.error) throw new Error('Não foi possível criar a conta.')
        router.replace(returnTo)
        router.refresh()
      } else {
        const result = await authClient.signIn.email({ email, password })
        if (result.error) throw new Error('E-mail ou senha inválidos.')
        router.replace(returnTo)
        router.refresh()
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível concluir a operação.')
    } finally {
      setPending(false)
    }
  }

  async function continueWithGithub() {
    setPending(true)
    setError('')
    const result = await authClient.signIn.social({ provider: 'github', callbackURL: `${window.location.origin}/app/dashboard` })
    if (result.error) {
      setError('O login com GitHub não está configurado neste ambiente.')
      setPending(false)
    }
  }

  const isReset = mode === 'reset'
  const isRegister = mode === 'register'

  return <main className="auth-page"><Link className="auth-back-home" href="/">Voltar ao site</Link><section className="auth-panel"><div className="auth-logo"><span><Sparkles size={17} /></span><b>Note<span>Agents</span></b></div><div className="auth-content"><small>{isReset ? 'Recuperação segura' : isRegister ? 'Comece sua jornada' : 'Acesso ao workspace'}</small><h1>{isReset ? 'Recuperar sua senha' : isRegister ? 'Criar sua conta' : 'Bem-vindo de volta'}</h1><p>{isReset ? 'Informe seu e-mail para receber as instruções de redefinição de senha.' : isRegister ? 'Comece a usar o NoteAgents e leve sua engenharia para o próximo nível.' : 'Acesse sua conta e continue construindo com o NoteAgents.'}</p>{!isReset && <button className="auth-provider" type="button" onClick={continueWithGithub} disabled={pending}><Github size={16} /> Continuar com GitHub</button>} {!isReset && <div className="auth-or">ou</div>}<form className="auth-form" onSubmit={submit}>{isRegister && <label>Nome completo<input value={name} onChange={(event) => setName(event.target.value)} required /></label>}<label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>{!isReset && <label>Senha<input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>}{error && <p className="auth-error">{error}</p>}{message && <p className="auth-message">{message}</p>}<button className="auth-submit" disabled={pending}>{pending ? <Loader2 className="spin" size={16} /> : isReset ? 'Enviar instruções' : isRegister ? 'Criar conta' : 'Entrar'} {!pending && <ArrowRight size={15} />}</button></form>{!isRegister && !isReset && <button className="auth-link" type="button" onClick={() => setMode('reset')}>Esqueceu sua senha?</button>}{isReset && <button className="auth-link" type="button" onClick={() => setMode('login')}>Voltar para o login</button>}<p className="auth-switch">{isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <button type="button" onClick={() => setMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Entrar agora' : 'Criar agora'}</button></p></div><div className="auth-footer"><ShieldCheck size={12} /> Seus dados continuam protegidos</div></section><section className="auth-visual"><div className="visual-orb orb-one" /><div className="visual-orb orb-two" /><div className="visual-stack"><div className="visual-card"><span><Github size={28} /></span><span><Sparkles size={28} /></span><span><Check size={28} /></span></div><div className="visual-code"><i /><i /><i /><i /><i /></div></div><h2>Conecte, analise,<br />construa e evolua<br />com agentes de IA.</h2><div className="visual-points"><span><Check size={15} /> Integração com GitHub</span><span><Check size={15} /> Agentes especializados</span><span><Check size={15} /> Evidências e auditoria</span><span><Check size={15} /> Observabilidade em tempo real</span></div></section></main>
}
