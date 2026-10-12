import Link from 'next/link'

export default function DemoPage() {
  return <main className="demo-context"><header className="demo-header"><strong>NoteAgents Demo</strong><span>DEMONSTRAÇÃO</span></header><section className="demo-content"><p className="public-eyebrow">Demonstração</p><h1>Explore uma visão demonstrativa do workspace.</h1><p>Este ambiente é separado da aplicação autenticada e não representa dados reais.</p><Link className="primary-button" href="/auth/login">Entrar na aplicação</Link></section></main>
}
