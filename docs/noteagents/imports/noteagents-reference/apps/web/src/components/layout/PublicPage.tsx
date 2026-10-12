'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, Sparkles } from 'lucide-react'
import { Footer } from './Footer'

type PublicPageProps = {
  eyebrow: string
  title: string
  description: string
  sections: { title: string; text: string }[]
  action?: { label: string; href: string }
}

export function PublicPage({ eyebrow, title, description, sections, action }: PublicPageProps) {
  return <div className="public-page-shell">
    <header className="public-page-header"><Link href="/" className="public-page-brand"><span className="public-page-mark"><Bot size={20} /></span><strong>Note<span>Agents</span></strong></Link><Link href="/" className="public-page-back"><ArrowLeft size={15} /> Voltar ao início</Link></header>
    <main className="public-page-main"><div className="public-page-hero"><span className="public-page-eyebrow"><Sparkles size={14} /> {eyebrow}</span><h1>{title}</h1><p>{description}</p>{action && (action.href.startsWith('http') ? <a href={action.href} target="_blank" rel="noreferrer" className="primary-button">{action.label}<ArrowRight size={15} /></a> : <Link href={action.href} className="primary-button">{action.label}<ArrowRight size={15} /></Link>)}</div><div className="public-page-sections">{sections.map((section) => <article className="public-page-card" key={section.title}><CheckCircle2 size={19} /><div><h2>{section.title}</h2><p>{section.text}</p></div></article>)}</div></main>
    <Footer />
  </div>
}

export default PublicPage
