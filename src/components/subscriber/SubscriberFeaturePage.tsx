import React from 'react';
import { Article, UserSession } from '../../types';
import { ArrowRight, BookOpen, Headphones, Mail, ShieldCheck, Video } from 'lucide-react';

interface SubscriberFeaturePageProps {
  page: string;
  currentUser: UserSession;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigate: (page: string) => void;
}

const copy: Record<string, { title: string; eyebrow: string; description: string }> = {
  editorias: { eyebrow: 'EXPLORAR', title: 'Editorias em destaque', description: 'Acompanhe os assuntos que importam para você em uma visão organizada e exclusiva.' },
  colunistas: { eyebrow: 'OPINIÃO', title: 'Colunistas', description: 'Leia análises e opiniões de vozes selecionadas pela redação do O Patriota.' },
  videos: { eyebrow: 'CONTEÚDO EXCLUSIVO', title: 'Vídeos', description: 'Assista às principais reportagens, entrevistas e análises em vídeo.' },
  podcasts: { eyebrow: 'OUÇA O PATRIOTA', title: 'Podcasts', description: 'Acompanhe episódios e conversas especiais onde estiver.' },
  newsletter: { eyebrow: 'FIQUE INFORMADO', title: 'Newsletter', description: 'Escolha os alertas e resumos que deseja receber no seu e-mail.' },
};

const media = [
  { label: 'Política', color: 'from-[#123C73] to-[#0B2345]' },
  { label: 'Economia', color: 'from-[#136B8B] to-[#0B2345]' },
  { label: 'Brasil', color: 'from-[#16803C] to-[#0B2345]' },
  { label: 'Mundo', color: 'from-[#49617F] to-[#0B2345]' },
  { label: 'Saúde', color: 'from-[#0284C7] to-[#0B2345]' },
  { label: 'Educação', color: 'from-[#C98A00] to-[#6D4500]' },
  { label: 'Segurança', color: 'from-[#B42318] to-[#5C1610]' },
  { label: 'Opinião', color: 'from-[#7C3AED] to-[#32145E]' },
];

export const SubscriberFeaturePage: React.FC<SubscriberFeaturePageProps> = ({ page, currentUser, articles, onSelectArticle, onNavigate }) => {
  const content = copy[page];
  const isNewsletter = page === 'newsletter';
  const isPodcast = page === 'podcasts';
  const isVideo = page === 'videos';
  const list = articles.filter((article) => article.editorialStatus === 'PUBLICADA' || !article.editorialStatus).slice(0, 8);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-[#071F43] via-[#0B3D78] to-[#087A9A] p-6 text-white shadow-lg sm:p-8">
        <div className="max-w-3xl"><p className="mb-2 text-xs font-black tracking-[.2em] text-[#FFCC29]">{content.eyebrow}</p><h1 className="font-serif text-3xl font-black sm:text-4xl">{content.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{content.description}</p></div>
      </div>
      {isNewsletter ? (
        <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="rounded-2xl border border-[#D9E6F5] bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-[#0B5FFF] p-3 text-white"><Mail /></div><div><h2 className="text-xl font-black text-[#0B2345]">Preferências de e-mail</h2><p className="text-sm text-[#64748B]">Personalize o que chega na sua caixa de entrada.</p></div></div>{['Resumo diário das principais notícias','Alertas de última hora','Análises e colunas exclusivas','Edição digital do jornal'].map((item) => <label key={item} className="flex items-center justify-between border-b border-[#E7EEF7] py-4 text-sm font-semibold text-[#17345D]"><span>{item}</span><input type="checkbox" defaultChecked className="h-5 w-5 accent-[#0B5FFF]" /></label>)}<button className="mt-6 rounded-lg bg-[#0B5FFF] px-6 py-3 text-sm font-black text-white">Salvar preferências</button></div><div className="rounded-2xl bg-[#E7F2FF] p-6"><ShieldCheck className="h-8 w-8 text-[#0B5FFF]" /><h2 className="mt-4 text-xl font-black text-[#0B2345]">Você no controle</h2><p className="mt-2 text-sm leading-6 text-[#49617F]">Você pode alterar suas preferências ou cancelar a qualquer momento.</p></div></div>
      ) : (
        <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{media.map((item) => <button key={item.label} onClick={() => onNavigate('dashboard')} className={`group min-h-32 rounded-2xl bg-gradient-to-br ${item.color} p-5 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}><div className="flex h-full flex-col justify-between"><span className="text-xs font-black uppercase tracking-widest text-white/70">O Patriota</span><span className="flex items-center justify-between text-lg font-black">{item.label}<ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" /></span></div></button>)}</div><div className="rounded-2xl border border-[#D9E6F5] bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black text-[#0B2345]">Conteúdo recente</h2><span className="text-xs font-bold text-[#0B5FFF]">Atualizado agora</span></div><div className="grid gap-3 md:grid-cols-2">{list.map((article) => <button key={article.id} onClick={() => onSelectArticle(article)} className="group flex gap-4 rounded-xl border border-[#E7EEF7] p-3 text-left hover:border-[#0B5FFF]"><div className={`flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${isVideo ? 'from-[#B42318] to-[#0B2345]' : isPodcast ? 'from-[#7C3AED] to-[#0B2345]' : 'from-[#0B5FFF] to-[#0B2345]'} text-white`}>{isVideo ? <Video /> : isPodcast ? <Headphones /> : <BookOpen />}</div><div className="min-w-0"><p className="line-clamp-2 text-sm font-black text-[#17345D] group-hover:text-[#0B5FFF]">{article.title}</p><span className="mt-2 flex items-center gap-1 text-xs text-[#64748B]">{isVideo ? 'Assistir agora' : isPodcast ? 'Ouvir episódio' : 'Ler matéria'} <ArrowRight className="h-3 w-3" /></span></div></button>)}</div></div></>
      )}
    </section>
  );
};

export default SubscriberFeaturePage;

