import React from 'react';
import { Article } from '../types';
import { MapPin, ArrowRight, TrendingUp } from 'lucide-react';

interface RegionalCoverageRSProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory?: (category: string) => void;
}

export const RegionalCoverageRS: React.FC<RegionalCoverageRSProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  // Filter RS specific articles or fallbacks with RS tags
  const rsArticles = articles.filter(
    (a) => 
      a.kicker?.includes('RIO GRANDE DO SUL') ||
      a.kicker?.includes('VALE DO SINOS') ||
      a.kicker?.includes('SERRA GAÚCHA') ||
      a.kicker?.includes('AGRONEGÓCIO GAÚCHO') ||
      a.tags?.some(t => ['Rio Grande do Sul', 'Porto Alegre', 'Novo Hamburgo', 'Vale do Sinos', 'Serra Gaúcha'].includes(t))
  );

  // Never label unrelated national stories as regional coverage.
  const displayArticles = rsArticles.slice(0, 4);
  if (displayArticles.length === 0) return null;

  return (
    <section className="mb-12 select-none" aria-label="Cobertura Regional do Rio Grande do Sul">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 mb-6 border-b-2 border-[#16803C] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16803C]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#16803C]">
              COBERTURA REGIONAL SUL
            </span>
            <span className="text-xs text-[#5D6673] hidden sm:inline">• Porto Alegre, Vale do Sinos, Serra & Interior</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0B2345] tracking-tight mt-1">
            Rio Grande do Sul em Foco
          </h2>
        </div>

        {/* Quick regional badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[#0B2345]">
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-[#D9DEE7]">Porto Alegre</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-[#D9DEE7]">Novo Hamburgo</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-[#D9DEE7]">Vale do Sinos</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-[#D9DEE7]">Serra Gaúcha</span>
        </div>
      </div>

      {/* Grid: 1 Featured Large Card (Left) + 3 Stacked / Medium Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main Regional Lead (7 cols) */}
        {displayArticles[0] && (
          <article 
            onClick={() => onSelectArticle(displayArticles[0])}
            className="lg:col-span-7 bg-white border border-[#D9DEE7] rounded-lg overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all hover:border-[#16803C]"
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
              <span className="absolute top-3 left-3 z-10 bg-[#16803C] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded shadow-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{displayArticles[0].kicker || 'RIO GRANDE DO SUL'}</span>
              </span>
              <img
                src={displayArticles[0].imageUrl}
                alt={displayArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[11px] text-white/80 block mb-1">
                  {displayArticles[0].imageCaption}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345] leading-tight mb-2 group-hover:text-[#16803C] transition-colors">
                  {displayArticles[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5D6673] leading-relaxed font-normal">
                  {displayArticles[0].subtitle}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F1F3F5] flex items-center justify-between text-xs text-[#5D6673]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0B2345]">{displayArticles[0].author}</span>
                  <span>•</span>
                  <span>{displayArticles[0].readTimeMinutes} min de leitura</span>
                </div>
                <span className="text-[#16803C] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ler reportagem</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        )}

        {/* 3 Secondary Regional Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {displayArticles.slice(1, 4).map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="bg-white border border-[#D9DEE7] rounded-lg p-3.5 flex gap-3.5 items-start group cursor-pointer hover:shadow-sm hover:border-[#16803C] transition flex-1"
            >
              <div className="w-28 sm:w-32 h-20 sm:h-24 rounded overflow-hidden shrink-0 bg-slate-100 border border-[#E2E8F0]">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10px] font-bold text-[#16803C] uppercase tracking-wider block mb-1">
                    {art.kicker}
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-[#0B2345] leading-snug group-hover:text-[#16803C] transition-colors line-clamp-2 mb-1">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-[#5D6673] leading-snug line-clamp-2 hidden sm:block">
                    {art.subtitle}
                  </p>
                </div>

                <div className="pt-2 text-[10px] text-[#8C9BAE] flex items-center justify-between">
                  <span>{art.publishedAt?.split(' às ')[0] || 'Hoje'}</span>
                  <span className="text-[#16803C] font-semibold">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
