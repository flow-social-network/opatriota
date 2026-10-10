import React from 'react';
import { ArrowRight, BookOpen, Globe2, Landmark, Shield, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sections = [
  { title: 'Últimas Notícias', kicker: 'ACOMPANHAMENTO', icon: BookOpen, topics: ['Política nacional', 'Economia e emprego', 'Segurança pública'], href: '/arquivo' },
  { title: 'Política', kicker: 'ANÁLISE E INSTITUIÇÕES', icon: Landmark, topics: ['Congresso Nacional', 'Governo e instituições', 'Eleições e representação'], href: '/categoria/politica' },
  { title: 'Brasil', kicker: 'COBERTURA NACIONAL', icon: Shield, topics: ['Infraestrutura e desenvolvimento', 'Saúde e serviços públicos', 'Agricultura e produção'], href: '/categoria/brasil' },
  { title: 'Economia', kicker: 'MERCADOS E NEGÓCIOS', icon: TrendingUp, topics: ['Indicadores econômicos', 'Emprego e renda', 'Empreendedorismo'], href: '/categoria/economia' },
  { title: 'Mundo', kicker: 'INTERNACIONAL', icon: Globe2, topics: ['América do Sul', 'Relações internacionais', 'Tecnologia e geopolítica'], href: '/categoria/mundo' },
];

export function HomeEditorialScaffold() {
  const navigate = useNavigate();
  return <div className="space-y-10 pb-10">
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="flex min-h-[260px] flex-col justify-end rounded-lg bg-[#0B2345] p-6 text-white sm:min-h-[340px] lg:col-span-7">
        <span className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#FFCC29]">O Patriota • Jornalismo</span>
        <h1 className="max-w-2xl font-serif text-3xl font-bold leading-tight sm:text-4xl">Informação, contexto e acompanhamento dos fatos que importam ao Brasil.</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">Notícias, análise e opinião com apuração, contexto e responsabilidade editorial.</p>
        <button onClick={() => navigate('/arquivo')} className="mt-5 inline-flex w-fit items-center gap-2 rounded bg-[#0B5FFF] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Explorar notícias <ArrowRight size={16}/></button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
        {['Política e decisões públicas','Economia e vida cotidiana','Segurança e comunidade'].map((title,index) => <button key={title} onClick={() => navigate(['/categoria/politica','/categoria/economia','/categoria/seguranca'][index])} className="flex min-h-24 items-center rounded-lg border border-[#D9DEE7] bg-white p-4 text-left hover:border-[#0B5FFF]"><span className="mr-3 h-10 w-1 shrink-0 rounded bg-[#16803C]"/><span><span className="block text-[10px] font-bold uppercase tracking-wider text-[#0B5FFF]">Editorias</span><span className="mt-1 block font-serif text-lg font-bold text-[#0B2345]">{title}</span></span></button>)}
      </div>
    </section>
    {sections.map(section => { const Icon=section.icon; return <section key={section.title}>
      <div className="mb-4 flex items-end justify-between border-b-2 border-[#0B2345] pb-3"><div className="flex items-center gap-3"><Icon className="h-6 w-6 text-[#0B5FFF]"/><div><p className="text-[10px] font-bold tracking-[.16em] text-[#0B5FFF]">{section.kicker}</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#0B2345] sm:text-3xl">{section.title}</h2></div></div><button onClick={() => navigate(section.href)} className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5FFF]">Ver editoria <ArrowRight size={14}/></button></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{section.topics.map((topic,index)=><button key={topic} onClick={() => navigate(section.href)} className="rounded-lg border border-[#D9DEE7] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm"><span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{section.title}</span><span className="mt-2 block font-serif text-lg font-bold leading-snug text-[#0B2345]">{topic}</span><span className="mt-2 block text-sm text-[#64748B]">Acesse a editoria para consultar matérias publicadas e atualizações.</span></button>)}</div>
    </section>})}
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <button onClick={() => navigate('/arquivo')} className="rounded-lg border border-[#D9DEE7] bg-white p-5 text-left hover:border-[#0B5FFF]"><h2 className="font-serif text-2xl font-bold text-[#0B2345]">Vídeos em destaque</h2><p className="mt-2 text-sm text-[#64748B]">Acompanhe conteúdos audiovisuais publicados pela redação.</p><span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0B5FFF]">Ver conteúdos <ArrowRight size={15}/></span></button>
      <a href="https://www.facebook.com/opatriota.news.brasil" target="_blank" rel="noreferrer" className="rounded-lg border border-[#D9DEE7] bg-white p-5 hover:border-[#0B5FFF]"><h2 className="font-serif text-2xl font-bold text-[#0B2345]">O Patriota nas redes</h2><p className="mt-2 text-sm text-[#64748B]">Acompanhe os canais oficiais e as publicações do jornal.</p><span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0B5FFF]">Visitar Facebook <ArrowRight size={15}/></span></a>
    </section>
    <section className="rounded-lg border border-[#D9DEE7] bg-white p-5"><h2 className="font-serif text-2xl font-bold text-[#0B2345]">Colunistas</h2><p className="mt-2 text-sm text-[#64748B]">Consulte perfis editoriais e artigos assinados pela equipa do jornal.</p><button onClick={() => navigate('/arquivo')} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#0B5FFF]">Explorar publicações <ArrowRight size={15}/></button></section>
  </div>;
}
