'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Bot, Database, FileText, FolderKanban, Github, LayoutDashboard, Menu, Network, Settings, ShieldCheck, Sparkles, Terminal, X } from 'lucide-react'
import { panelNavigation, panelRoutes } from '~/src/lib/routes'

const iconMap = { dashboard: LayoutDashboard, projetos: FolderKanban, chat: Sparkles, fontes: FileText, agentes: Bot, pipelines: Network, auditorias: ShieldCheck, database: Database, integracoes: Github, ambiente: Terminal, orquestrador: Network, memoria: Database, ferramentas: Settings, evidencias: ShieldCheck, observabilidade: Activity, cli: Terminal } as const
const items = panelNavigation.map(([label, href, key]) => [label, href, iconMap[key]] as const)

export function ApplicationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const active = items.find(([, href]) => pathname === href)?.[0] ?? 'Dashboard'
  return <div className={`application-shell ${collapsed ? 'is-collapsed' : ''}`}><header className="application-header"><button className="app-mobile-toggle" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu size={19} /></button><Link href="/app/dashboard" className="application-brand"><span className="application-brand-mark"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icone-RxzatGh5zLyRqc6WE6I32LuIblr1nd.png" alt="" /></span><b>Note<span>Agents</span></b></Link><div className="application-context">Workspace / <strong>{active}</strong></div><div className="application-user"><span>VA</span><b>Vini Amaral</b></div></header><div className="application-body"><aside className={`application-sidebar ${open ? 'is-open' : ''}`}><div className="sidebar-top"><button className="sidebar-collapse" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}>{collapsed ? '→' : '←'}</button><button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Fechar menu"><X size={18} /></button></div><nav aria-label="Navegação do painel">{items.map(([label, href, Icon]) => <Link key={href} href={href} title={collapsed ? label : undefined} className={pathname === href ? 'active' : ''} onClick={() => setOpen(false)}><Icon size={16} /><span>{label}</span></Link>)}</nav><Link className="application-settings" href={panelRoutes.configuracoes} onClick={() => setOpen(false)}><Settings size={16} /><span>Configurações</span></Link></aside>{open && <button className="application-overlay" onClick={() => setOpen(false)} aria-label="Fechar menu" /> }<main className="application-content">{children}</main></div><ApplicationFooter /></div>
}

export function ApplicationFooter() { return <footer className="application-footer">© 2026 NoteAgents <span>•</span> Sistema operacional <span>•</span> Documentação</footer> }
