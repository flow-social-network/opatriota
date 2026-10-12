'use client'

import { Activity, Bot, FolderKanban, ShieldCheck, Sparkles } from 'lucide-react'

const cards = [
  ['Projetos', 'Ainda não disponível', FolderKanban],
  ['Agentes', 'Ainda não disponível', Bot],
  ['Execuções', 'Ainda não disponível', Activity],
  ['Readiness', 'Ainda não disponível', ShieldCheck],
] as const

export default function DashboardPage() {
  return <div className="application-dashboard">
    <div className="dashboard-page-heading"><div><p className="panel-breadcrumb">Workspace / Visão geral</p><h1>Dashboard</h1><p>Acompanhe sua operação de engenharia com dados conectados ao workspace.</p></div><button className="panel-action-button"><Sparkles size={15} /> Nova análise</button></div>
    <div className="dashboard-metric-grid">{cards.map(([label, value, Icon]) => <section className="dashboard-metric-card" key={label}><span className="dashboard-metric-icon"><Icon size={18} /></span><div><span>{label}</span><strong>{value}</strong></div></section>)}</div>
    <div className="dashboard-content-grid"><section className="dashboard-card dashboard-chart-card"><div><span className="dashboard-card-kicker">Atividade</span><h2>Execuções dos agentes</h2><p>A atividade aparecerá quando uma integração estiver conectada.</p></div><div className="dashboard-empty-state"><Activity size={28} /><strong>Nenhuma execução disponível</strong><span>Conecte um projeto para visualizar execuções reais.</span></div></section><section className="dashboard-card"><span className="dashboard-card-kicker">Operação</span><h2>Status do sistema</h2><div className="dashboard-status-list"><div><span>Backend</span><strong>Não disponível</strong></div><div><span>Integrações</span><strong>Não configuradas</strong></div><div><span>Observabilidade</span><strong>Aguardando dados</strong></div></div></section></div>
    <section className="dashboard-card dashboard-next-step"><div><span className="dashboard-card-kicker">Próximo passo</span><h2>Conecte seu workspace</h2><p>Adicione um projeto ou integração para começar a receber dados reais.</p></div><a className="panel-action-button secondary" href="/app/integracoes">Ver integrações</a></section>
  </div>
}
