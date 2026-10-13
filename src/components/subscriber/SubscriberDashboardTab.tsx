import React from 'react';
import { Article, UserSession } from '../../types';
import { Bookmark, Sparkles, ShieldCheck, ArrowRight, BookOpen, Crown, Mail, Users, ChevronRight } from 'lucide-react';

interface SubscriberDashboardTabProps {
  currentUser: UserSession;
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigate: (subpage: string) => void;
}

export const SubscriberDashboardTab: React.FC<SubscriberDashboardTabProps> = ({ currentUser, bookmarkedArticles, onSelectArticle, onNavigate }) => {
  const lead = bookmarkedArticles[0];
  const cover = lead?.imageUrl || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hdUsSDQb6llr8W65bNN5lElYtfUWLA.png';

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,.8fr)]">
        <div className="rounded-xl border border-[#D9E6F5] bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-[.16em] text-[#0B5FFF]">Área do leitor O Patriota</p>
          <h1 className="font-serif text-3xl font-black text-[#07172E]">Olá, {currentUser.name}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#49617F]">Bem-vindo ao O PATRIOTA. Acesse o jornal digital, leia as últimas matérias, salve conteúdos e acompanhe tudo em um só lugar.</p>
        </div>
        <div className="rounded-xl border border-[#D9E6F5] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3"><div className="rounded-lg bg-[#FFB800] p-3 text-[#07172E]"><Crown className="h-6 w-6" /></div><div><div className="flex items-center gap-2"><h2 className="font-serif text-lg font-black text-[#07172E]">Assinatura Premium</h2><span className="rounded-full bg-[#CFF7DF] px-2 py-0.5 text-[10px] font-black text-[#16803C]">Ativa</span></div><p className="mt-1 text-xs leading-5 text-[#49617F]">Você tem acesso completo ao jornal digital, matérias exclusivas, colunas e todo o conteúdo premium.</p></div></div>
          <button onClick={() => onNavigate('assinatura')} className="mt-4 flex w-full items-center justify-between rounded-lg border border-[#B9D5F5] px-4 py-2.5 text-left text-xs font-bold text-[#0B5FFF] hover:bg-[#EFF6FF]">Gerenciar Assinatura <ChevronRight className="h-4 w-4" /></button>
        </div>
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.8fr)]">
        <div className="overflow-hidden rounded-xl bg-[#061D40] text-white shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-[#FFCC29] p-2 text-[#07172E]"><BookOpen className="h-5 w-5" /></div><div><h2 className="font-condensed text-xl font-black tracking-wide">JORNAL DIGITAL</h2><p className="text-xs text-white/70">Edição completa, como no impresso, agora no digital.</p></div></div><span className="rounded-md bg-[#EF2B2D] px-2 py-1 text-[10px] font-black">NOVA</span></div>
          <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-center"><button onClick={() => onNavigate('jornal')} className="group overflow-hidden rounded-lg border-4 border-white/20 bg-white shadow-lg"><img src={cover} alt="Capa da edição atual do jornal digital" className="aspect-[.73] w-full object-cover transition group-hover:scale-[1.02]" /></button><div><p className="text-3xl font-black">Edição 274</p><p className="mt-1 text-sm text-white/75">13 de outubro de 2026</p><p className="mt-5 text-sm leading-6 text-white/85">Governo não tem orçamento para cobrir R$ 105,5 bilhões em despesas. Saúde, Educação e investimentos em risco.</p><button onClick={() => onNavigate('jornal')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFCC29] px-4 py-3 text-sm font-black text-[#07172E] hover:bg-white">Ler o Jornal Digital <ArrowRight className="h-4 w-4" /></button><button onClick={() => onNavigate('jornal')} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/35 px-4 py-3 text-sm font-bold hover:bg-white/10">Baixar em PDF</button></div></div>
        </div>
        <div className="rounded-xl border border-[#D9E6F5] bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-xl font-black text-[#07172E]">Últimas Edições</h2><button onClick={() => onNavigate('jornal')} className="text-xs font-bold text-[#0B5FFF]">Ver todas <ArrowRight className="inline h-3 w-3" /></button></div><div className="grid grid-cols-3 gap-2">{[274,273,272].map((edition, index) => <button key={edition} onClick={() => onNavigate('jornal')} className="text-left"><img src={index === 0 ? cover : 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oUaSxF0iKydLMoQDQJeLXgVtg1Ub8f.png'} alt={`Capa da edição ${edition}`} className="aspect-[.72] w-full rounded border border-[#D9E6F5] object-cover" /><span className="mt-1 block text-xs font-bold text-[#07172E]">Edição {edition}</span><span className="text-[10px] text-[#607A9B]">{13 - index}/10/2026</span></button>)}</div></div>
      </section>

      <section className="grid gap-3 md:grid-cols-3"><button onClick={() => onNavigate('favoritos')} className="flex items-center gap-3 rounded-xl border border-[#D9E6F5] bg-white p-4 text-left shadow-sm hover:border-[#0B5FFF]"><Bookmark className="h-7 w-7 text-[#0B5FFF]" /><span><b className="block text-sm text-[#07172E]">Matérias Salvas</b><small className="text-xs text-[#607A9B]">Você tem {currentUser.bookmarks.length} matérias salvas</small></span><ChevronRight className="ml-auto h-4 w-4 text-[#0B5FFF]" /></button><button onClick={() => onNavigate('colunistas')} className="flex items-center gap-3 rounded-xl border border-[#D9E6F5] bg-white p-4 text-left shadow-sm hover:border-[#0B5FFF]"><Users className="h-7 w-7 text-[#0B5FFF]" /><span><b className="block text-sm text-[#07172E]">Colunistas</b><small className="text-xs text-[#607A9B]">Acompanhe seus preferidos</small></span><ChevronRight className="ml-auto h-4 w-4 text-[#0B5FFF]" /></button><button onClick={() => onNavigate('newsletter')} className="flex items-center gap-3 rounded-xl border border-[#D9E6F5] bg-white p-4 text-left shadow-sm hover:border-[#0B5FFF]"><Mail className="h-7 w-7 text-[#0B5FFF]" /><span><b className="block text-sm text-[#07172E]">Newsletter</b><small className="text-xs text-[#607A9B]">Receba as principais notícias</small></span><ChevronRight className="ml-auto h-4 w-4 text-[#0B5FFF]" /></button></section>

      {lead && <section className="rounded-xl border border-[#D9E6F5] bg-white p-5 shadow-sm"><div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-lg font-black text-[#07172E]">Suas Notícias Salvas Recentemente</h2><button onClick={() => onNavigate('favoritos')} className="text-xs font-bold text-[#0B5FFF]">Ver todas</button></div><button onClick={() => onSelectArticle(lead)} className="flex items-center gap-4 text-left"><img src={lead.imageUrl || cover} alt="" className="h-16 w-24 rounded object-cover" /><span><b className="block text-sm text-[#07172E]">{lead.title}</b><small className="text-xs text-[#607A9B]">{lead.kicker}</small></span></button></section>}
    </div>
  );
};
