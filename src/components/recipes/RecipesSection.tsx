import React from 'react';
import type { Article } from '../../types';
import { ArticleImage } from '../ArticleImage';
import { ArrowRight, Clock, UtensilsCrossed } from 'lucide-react';

interface RecipesSectionProps { articles: Article[]; onSelectArticle: (article: Article) => void; onViewAll?: () => void; fullPage?: boolean; }

export function RecipesSection({ articles, onSelectArticle, onViewAll, fullPage = false }: RecipesSectionProps) {
  const recipes = articles.filter(article => article.category === 'receita' && article.editorialStatus === 'PUBLICADA')
    .sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return <section className={fullPage ? 'space-y-6' : 'mt-10 mb-12'}>
    <div className="mb-4 flex items-end justify-between border-b-2 border-[#0B2345] pb-3">
      <div className="flex items-center gap-3"><UtensilsCrossed className="h-6 w-6 text-[#16803C]"/><div><p className="text-[10px] font-bold tracking-[.16em] text-[#16803C]">GASTRONOMIA E TRADIÇÃO</p><h2 className="font-serif text-2xl font-bold text-[#0B2345] sm:text-3xl">Receitas Dona Nita</h2></div></div>
      {!fullPage && onViewAll && <button onClick={onViewAll} className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5FFF]">Ver todas <ArrowRight size={14}/></button>}
    </div>
    {recipes.length ? <div className={fullPage ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'grid grid-cols-1 gap-3 sm:grid-cols-3'}>
      {recipes.slice(0, fullPage ? undefined : 3).map(article => <button key={article.id} onClick={() => onSelectArticle(article)} className="overflow-hidden rounded-lg border border-[#D9DEE7] bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="aspect-[16/9] overflow-hidden bg-slate-100"><ArticleImage src={article.imageUrl} alt={article.imageCaption || article.title} className="h-full w-full object-cover"/></div>
        <div className="p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-[#16803C]">Receita publicada</span><h3 className="mt-2 font-serif text-lg font-bold leading-snug text-[#0B2345]">{article.title}</h3>{article.subtitle && <p className="mt-1 line-clamp-2 text-sm text-[#64748B]">{article.subtitle}</p>}<span className="mt-3 inline-flex items-center gap-1 text-xs text-[#64748B]"><Clock size={13}/> {article.readTimeMinutes} min de leitura</span></div>
      </button>)}
    </div> : <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white p-6 sm:p-8"><h3 className="font-serif text-xl font-bold text-[#0B2345]">Receitas para partilhar à mesa</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B]">Esta editoria está preparada para receber receitas aprovadas pela redação. Assim que houver matérias de receita publicadas, elas aparecerão aqui automaticamente.</p></div>}
  </section>;
}
