import React, { useEffect, useState } from 'react';
import { Article } from '../../types';
import { ArrowLeft, ArrowRight, BookOpen, Download, List, Maximize2, Minimize2 } from 'lucide-react';

interface SubscriberJournalTabProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
}

const pageImages = ['/images/hero_congresso.jpg', '/images/news_economia.jpg', '/images/news_saude.jpg', '/images/news_porto.jpg'];

export const SubscriberJournalTab: React.FC<SubscriberJournalTabProps> = ({ articles, onSelectArticle, onBack }) => {
  const [page, setPage] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const totalPages = 4;
  const currentArticle = articles[page - 1] || articles[0];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setPage((current) => Math.min(totalPages, current + 1));
      if (event.key === 'ArrowLeft') setPage((current) => Math.max(1, current - 1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!currentArticle) return <div className="rounded-xl border border-[#D9DEE7] p-8 text-center text-sm text-[#5D6673]">Nenhuma matéria disponível para esta edição.</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9DEE7] pb-4">
        <div>
          <button type="button" onClick={onBack} className="mb-2 inline-flex items-center gap-2 text-xs font-bold text-[#0B5FFF]"><ArrowLeft className="h-4 w-4" /> Voltar ao painel</button>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-black text-[#0B2345]"><BookOpen className="h-6 w-6 text-[#E7B500]" /> Jornal Digital</h2>
          <p className="text-xs text-[#5D6673]">Edição atual · página {page} de {totalPages}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setZoomed((current) => !current)} className="rounded border border-[#D9DEE7] p-2 text-[#0B2345]" aria-label={zoomed ? 'Reduzir zoom' : 'Ampliar'}>{zoomed ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
          <button type="button" className="inline-flex items-center gap-2 rounded bg-[#0B2345] px-3 py-2 text-xs font-bold text-white"><Download className="h-4 w-4" /> Baixar PDF</button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)_220px]">
        <aside className="order-2 flex gap-2 overflow-x-auto xl:order-1 xl:block xl:space-y-3" aria-label="Miniaturas da edição">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
            <button type="button" key={item} onClick={() => setPage(item)} className={`min-w-[110px] rounded-lg border p-2 text-left xl:w-full ${page === item ? 'border-[#0B5FFF] bg-[#EFF6FF]' : 'border-[#D9DEE7] bg-white'}`}>
              <img src={pageImages[item - 1]} alt={`Miniatura da página ${item}`} className="h-20 w-full rounded object-cover" />
              <span className="mt-1 block text-[11px] font-bold text-[#0B2345]">Página {item}</span>
            </button>
          ))}
        </aside>

        <section className="order-1 rounded-xl bg-[#07172E] p-3 shadow-lg xl:order-2" aria-label="Página atual do jornal">
          <div className={`mx-auto max-w-3xl overflow-hidden rounded bg-white transition-transform ${zoomed ? 'scale-[1.04]' : ''}`}>
            <img src={pageImages[page - 1]} alt="Imagem editorial da edição atual" className="h-56 w-full object-cover sm:h-80" />
            <div className="space-y-3 p-5 sm:p-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#B42318]">O PATRIOTA · EDIÇÃO 274</span>
              <h3 className="font-serif text-2xl font-black leading-tight text-[#0B2345]">{currentArticle.title}</h3>
              <p className="text-sm leading-7 text-[#344054]">{currentArticle.subtitle}</p>
              <button type="button" onClick={() => onSelectArticle(currentArticle)} className="text-xs font-bold text-[#0B5FFF]">Ler matéria completa no site →</button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-white">
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="inline-flex items-center gap-2 rounded border border-white/30 px-3 py-2 text-xs disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Anterior</button>
            <span className="text-xs font-bold">{page} / {totalPages}</span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-2 rounded border border-white/30 px-3 py-2 text-xs disabled:opacity-40">Próxima <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>

        <aside className="order-3 rounded-xl border border-[#D9DEE7] bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 font-serif font-black text-[#0B2345]"><List className="h-4 w-4" /> Sumário</h3>
          <ol className="space-y-3 text-xs text-[#344054]">
            {articles.slice(0, totalPages).map((article, index) => <li key={article.id}><button type="button" onClick={() => { setPage(index + 1); }} className="text-left hover:text-[#0B5FFF]"><span className="mr-2 font-bold text-[#0B5FFF]">{index + 1}.</span>{article.title}</button></li>)}
          </ol>
        </aside>
      </div>
    </div>
  );
};
