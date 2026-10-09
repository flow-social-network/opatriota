import React from 'react';
import { Article } from '../types';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  onSelectArticle
}) => {
  const leadArticle = articles[0]; // Congresso avança
  const sideArticles = [articles[1], articles[2], articles[3]]; // PIB, Segurança, Farmácia Popular

  return (
    <section className="mb-10 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN 1: Lead Headline (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-2">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#0B5FFF] mb-2 block">
              {leadArticle.kicker}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl xl:text-[40px] font-bold leading-[1.12] text-[#0B2345] mb-4 hover:text-[#0B5FFF] transition-colors cursor-pointer">
              <button 
                onClick={() => onSelectArticle(leadArticle)}
                className="text-left cursor-pointer"
              >
                {leadArticle.title}
              </button>
            </h2>
            <p className="text-sm text-[#5D6673] leading-relaxed mb-6 font-normal">
              {leadArticle.subtitle}
            </p>
          </div>

          <div>
            <button
              onClick={() => onSelectArticle(leadArticle)}
              className="inline-flex items-center gap-2 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-5 py-2.5 rounded transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>LER MATÉRIA COMPLETA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COLUMN 2: Central Hero Photo (5 cols on lg) */}
        <div 
          onClick={() => onSelectArticle(leadArticle)}
          className="lg:col-span-5 relative group overflow-hidden rounded border border-[#D9DEE7] bg-black cursor-pointer shadow-xs min-h-[340px] flex flex-col justify-end"
        >
          {/* Green Category Badge */}
          <div className="absolute top-3 left-3 z-10 bg-[#16803C] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-xs shadow-xs">
            BRASIL
          </div>

          {/* Hero Image */}
          <img
            src={leadArticle.imageUrl}
            alt="Congresso Nacional em Brasília"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
          />

          {/* Bottom Caption Overlay */}
          <div className="relative z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pt-10 text-white">
            <p className="text-xs font-medium text-white/95 leading-snug">
              {leadArticle.imageCaption}
            </p>
          </div>
        </div>

        {/* COLUMN 3: Right Stacked Stories (3 cols on lg) */}
        <div className="lg:col-span-3 flex flex-col justify-between divide-y divide-[#D9DEE7] border-l-0 lg:border-l border-[#D9DEE7] lg:pl-6">
          {sideArticles.map((article, idx) => (
            <article 
              key={article.id} 
              className={`flex gap-3 items-start cursor-pointer group ${idx === 0 ? 'pb-4' : idx === sideArticles.length - 1 ? 'pt-4' : 'py-4'}`}
              onClick={() => onSelectArticle(article)}
            >
              <div className="flex-1">
                <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block mb-1">
                  {article.kicker}
                </span>
                <h4 className="font-serif text-sm font-bold text-[#0B2345] leading-snug mb-1 group-hover:text-[#0B5FFF] transition-colors line-clamp-3">
                  {article.title}
                </h4>
                <p className="text-[11px] text-[#5D6673] leading-snug line-clamp-2">
                  {article.subtitle}
                </p>
              </div>

              <div className="w-20 h-16 rounded overflow-hidden shrink-0 border border-[#D9DEE7] bg-slate-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
