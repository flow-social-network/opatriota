import React from 'react';
import { RssSource, EditorialQueueItem } from '../../types';
import { Activity, AlertTriangle, ArrowUpRight, CheckCircle2, CreditCard, Database, ShieldCheck, Users } from 'lucide-react';

interface AdminOverviewTabProps {
  sources: RssSource[];
  queueItems: EditorialQueueItem[];
  onNavigateToQueue: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ sources, queueItems }) => {
  const pendingEditorial = queueItems.filter((item) => ['RECEBIDA', 'EM TRIAGEM'].includes(item.editorialStatus)).length;
  const failedItems = queueItems.filter((item) => ['ERRO', 'FALHA'].includes(item.editorialStatus)).length;
  const activeSources = sources.filter((source) => source.isActive).length;
  const metrics = [
    { label: 'Usuários cadastrados', value: '—', detail: 'Dado protegido pelo serviço de usuários', icon: Users, tone: 'text-[#0B5FFF]', bg: 'bg-[#EAF3FF]' },
    { label: 'Assinaturas ativas', value: '—', detail: 'Aguardando consulta financeira autorizada', icon: CreditCard, tone: 'text-[#16803C]', bg: 'bg-[#E8F7ED]' },
    { label: 'Receita confirmada', value: '—', detail: 'Sem valor inventado: fonte financeira não conectada', icon: ArrowUpRight, tone: 'text-[#B87500]', bg: 'bg-[#FFF6D8]' },
    { label: 'Pagamentos pendentes', value: '—', detail: 'Aguardando consulta financeira autorizada', icon: AlertTriangle, tone: 'text-[#B42318]', bg: 'bg-[#FEF3F2]' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => { const Icon = metric.icon; return <article key={metric.label} className="rounded-2xl border border-[#D9E6F5] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bg}`}><Icon className={`h-5 w-5 ${metric.tone}`} /></div><span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Admin</span></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#64748B]">{metric.label}</p><p className="mt-1 text-3xl font-black text-[#07172E]">{metric.value}</p><p className="mt-2 text-xs text-[#64748B]">{metric.detail}</p></article>; })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-[11px] font-black uppercase tracking-[.18em] text-[#0B5FFF]">Visão geral da plataforma</p><h2 className="mt-1 font-serif text-2xl font-black text-[#07172E]">Saúde operacional</h2></div><Activity className="h-6 w-6 text-[#0B5FFF]" /></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[#E8F7ED] p-4"><CheckCircle2 className="h-5 w-5 text-[#16803C]" /><p className="mt-3 text-sm font-bold text-[#14532D]">Sistema online</p><p className="mt-1 text-xs text-[#52705B]">Serviços básicos respondendo</p></div><div className="rounded-xl bg-[#EAF3FF] p-4"><Database className="h-5 w-5 text-[#0B5FFF]" /><p className="mt-3 text-sm font-bold text-[#123D84]">{activeSources} integrações ativas</p><p className="mt-1 text-xs text-[#52719D]">Fontes conectadas ao sistema</p></div><div className="rounded-xl bg-[#FFF6D8] p-4"><ShieldCheck className="h-5 w-5 text-[#B87500]" /><p className="mt-3 text-sm font-bold text-[#805B00]">Auditoria protegida</p><p className="mt-1 text-xs text-[#806F43]">Operações sensíveis registradas</p></div></div></section>
        <section className="rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-sm"><h2 className="font-serif text-xl font-black text-[#07172E]">Alertas do sistema</h2><div className="mt-5 space-y-4 text-sm"><div className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#16803C]" /><div><p className="font-bold text-[#17324F]">Nenhuma falha crítica registrada</p><p className="text-xs text-[#64748B]">O status será atualizado pelos serviços conectados.</p></div></div><div className="flex items-start gap-3"><span className={`mt-1 h-2.5 w-2.5 rounded-full ${pendingEditorial > 0 ? 'bg-[#B87500]' : 'bg-[#16803C]'}`} /><div><p className="font-bold text-[#17324F]">{pendingEditorial} itens aguardando triagem editorial</p><p className="text-xs text-[#64748B]">Disponível para acompanhamento administrativo.</p></div></div><div className="flex items-start gap-3"><span className={`mt-1 h-2.5 w-2.5 rounded-full ${failedItems > 0 ? 'bg-[#B42318]' : 'bg-[#16803C]'}`} /><div><p className="font-bold text-[#17324F]">{failedItems} falhas de ingestão</p><p className="text-xs text-[#64748B]">Sem alterar o fluxo operacional da redação.</p></div></div></div></section>
      </div>

      <section className="rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-[11px] font-black uppercase tracking-[.18em] text-[#0B5FFF]">Governança</p><h2 className="mt-1 font-serif text-2xl font-black text-[#07172E]">Acesso rápido administrativo</h2></div><span className="rounded-full bg-[#EAF3FF] px-3 py-1 text-xs font-bold text-[#0B5FFF]">Sem dados fictícios</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl border border-[#E6EDF5] p-4"><p className="font-bold text-[#17324F]">Usuários e permissões</p><p className="mt-1 text-xs text-[#64748B]">Gerencie acesso e papéis.</p></div><div className="rounded-xl border border-[#E6EDF5] p-4"><p className="font-bold text-[#17324F]">Financeiro</p><p className="mt-1 text-xs text-[#64748B]">Consulte pagamentos autorizados.</p></div><div className="rounded-xl border border-[#E6EDF5] p-4"><p className="font-bold text-[#17324F]">Integrações</p><p className="mt-1 text-xs text-[#64748B]">Acompanhe serviços conectados.</p></div><div className="rounded-xl border border-[#E6EDF5] p-4"><p className="font-bold text-[#17324F]">Segurança</p><p className="mt-1 text-xs text-[#64748B]">Revise logs e auditoria.</p></div></div></section>
    </div>
  );
};
