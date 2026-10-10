import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../app/contexts/DataContext';
import { RecipesSection } from '../../components/recipes/RecipesSection';
import { ArrowLeft, ChefHat } from 'lucide-react';

export default function RecipesPage() {
  const navigate = useNavigate();
  const { articles, dataLoading } = useData();
  return <main className="mx-auto w-full max-w-[1360px] px-4 py-6 sm:py-10">
    <button onClick={() => navigate('/')} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0B5FFF]"><ArrowLeft size={16}/> Voltar ao início</button>
    <header className="mb-8 rounded-xl bg-[#0B2345] p-6 text-white sm:p-10"><div className="flex items-center gap-3 text-[#FFCC29]"><ChefHat size={26}/><span className="text-xs font-bold uppercase tracking-[.18em]">Caderno de gastronomia</span></div><h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Receitas Dona Nita</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">Sabores de família, receitas tradicionais e dicas para preparar e partilhar à mesa.</p></header>
    {dataLoading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-busy="true">{[0,1,2].map(i=><div key={i} className="h-64 animate-pulse rounded-lg bg-[#E2E8F0]"/>)}</div> : <RecipesSection articles={articles} onSelectArticle={article => navigate(`/noticia/${article.slug}`)} fullPage />}
  </main>;
}
