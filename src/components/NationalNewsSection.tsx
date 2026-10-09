import React from 'react';
import { Article, AdSlotConfig, AdSenseGlobalConfig } from '../types';
import { AdSlot } from './ads/AdSlot';
import { Newspaper, ArrowRight, Flame } from 'lucide-react';

interface NationalNewsSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  adSlots: AdSlotConfig[];
  adsense: AdSenseGlobalConfig;
}

export const NationalNewsSection: React.FC<NationalNewsSectionProps> = ({
  articles,
  onSelectArticle,
  adSlots,
  adsense
}) => {
  // Select national coverage articles (skip lead article)
  const nationalArticles = articles.filter(
    (a) => a.category === 'brasil' || a.category === 'politica' || a.category === 'seguranca'
  ).slice(1, 7);

  const trendingArticles = articles.slice(0, 4);

  return (
    <section className="mb-12 select-none" aria-label="Últimas Notícias do Brasil">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#0B2345]">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#0B5FFF]" />
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0B2345] tracking-tight">
            Últimas Notícias do Brasil
          </h2>
        </div>
        <span className="text-xs text-[#5D6673] uppercase font-bold tracking-wider">
          Cobertura em Tempo Real
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: National News Cards Grid (8 cols) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {nationalArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-white border border-[#D9DEE7] rounded-lg overflow-hidden flex flex-col group cursor-pointer hover:shadow-md hover:border-[#0B5FFF] transition"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <span className="absolute top-2 left-2 z-10 bg-[#0B2345] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
                    {art.kicker || 'BRASIL'}
                  </span>
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#0B2345] leading-snug group-hover:text-[#0B5FFF] transition-colors mb-2 line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#5D6673] leading-relaxed line-clamp-3">
                      {art.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#F1F3F5] flex items-center justify-between text-[11px] text-[#8C9BAE]">
                    <span>{art.author.split(' ')[0]} • {art.readTimeMinutes} min</span>
                    <span className="text-[#0B5FFF] font-bold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Lateral Ad Slot + Trending Briefs (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Lateral Advertising Slot (300x250) */}
          <div className="bg-white p-2 rounded-lg border border-[#D9DEE7] shadow-2xs">
            <AdSlot
              position="HOME_SIDEBAR_NATIONAL"
              adSlots={adSlots}
              adsense={adsense}
              className="my-0"
            />
          </div>

          {/* Quick Trending Bulletins */}
          <div className="bg-white p-5 rounded-lg border border-[#D9DEE7] shadow-2xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#EAECEF]">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="font-serif text-sm font-bold text-[#0B2345] uppercase tracking-wider">
                Destaques da Redação
              </h4>
            </div>

            <div className="divide-y divide-[#F1F3F5]">
              {trendingArticles.map((art, idx) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="py-3 first:pt-0 last:pb-0 cursor-pointer group flex items-start gap-3"
                >
                  <span className="font-serif font-black text-lg text-[#0B2345]/30 group-hover:text-[#0B5FFF] transition shrink-0">
                    0{idx + 1}
                  </span>
                  <div>
                    <h5 className="font-serif text-xs font-bold text-[#0B2345] leading-snug group-hover:text-[#0B5FFF] transition-colors line-clamp-2">
                      {art.title}
                    </h5>
                    <span className="text-[10px] text-[#8C9BAE] mt-1 block">
                      {art.kicker} • {art.readTimeMinutes} min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </section>
  );
};
