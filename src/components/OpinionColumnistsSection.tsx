import React from 'react';
import { Article, AuthorDetail } from '../types';
import { Feather, Quote, ArrowRight, UserCheck } from 'lucide-react';

interface OpinionColumnistsSectionProps {
  articles: Article[];
  authors: AuthorDetail[];
  onSelectArticle: (article: Article) => void;
  onSelectAuthor?: (authorSlug: string) => void;
}

export const OpinionColumnistsSection: React.FC<OpinionColumnistsSectionProps> = ({
  articles,
  authors,
  onSelectArticle,
  onSelectAuthor
}) => {
  // Filter opinion articles
  const opinionArticles = articles.filter(
    (a) => a.category === 'opiniao' || a.kicker?.includes('OPINIÃO') || a.tags?.includes('Opinião')
  );

  const displayArticles = opinionArticles.length > 0 ? opinionArticles : articles.slice(9, 13);

  return (
    <section className="mb-12 select-none" aria-label="Opinião e Análise">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 mb-6 border-b-2 border-[#FFCC29] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-[#FFCC29]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#0B2345]">
              ARTIGOS ASSINADOS & ENSAIOS
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0B2345] tracking-tight mt-0.5">
            Opinião & Análise
          </h2>
        </div>

        {/* Factual disclaimer complying with strict sources policy */}
        <div className="flex items-center gap-1.5 text-[10px] text-[#5D6673] bg-amber-50 border border-amber-200 px-3 py-1 rounded">
          <UserCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Os artigos expressam a visão e análise crítica de seus respectivos autores.</span>
        </div>
      </div>

      {/* Columnists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayArticles.slice(0, 4).map((art, idx) => {
          const matchingAuthor = authors.find(
            (aut) => aut.name === art.author || aut.id === art.authorId
          ) || authors[idx % authors.length];

          return (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectArticle(art);
                }
              }}
              className="bg-white border border-[#D9DEE7] rounded-xl p-4 flex flex-col justify-between group cursor-pointer hover:shadow-md hover:border-[#FFCC29] transition relative overflow-hidden focus-within:ring-2 focus-within:ring-[#0B5FFF] focus-within:ring-offset-2"
            >
              {/* Subtle gold top ribbon */}
              <div className="absolute top-0 inset-x-0 h-1 bg-[#FFCC29] group-hover:h-1.5 transition-all" />

              <div>
                {/* Author Avatar & Header */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#FFCC29] shrink-0 bg-slate-100 shadow-xs">
                    <img
                      src={matchingAuthor?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'}
                      alt={art.author}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#0B2345] group-hover:text-[#0B5FFF] transition-colors">
                      {art.author}
                    </h4>
                    <p className="text-[10px] text-[#5D6673] line-clamp-1">
                      {art.authorRole || matchingAuthor?.role || 'Colunista de O Patriota'}
                    </p>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="font-serif text-[15px] sm:text-base font-bold text-[#0B2345] leading-[1.35] group-hover:text-[#0B5FFF] transition-colors mb-2 line-clamp-3">
                  "{art.title}"
                </h3>

                {/* Subtitle / Excerpt */}
                <p className="text-[12px] sm:text-[13px] text-[#5D6673] leading-[1.4] line-clamp-2 font-normal">
                  {art.subtitle}
                </p>
              </div>

              {/* Bottom footer link */}
              <div className="pt-3 mt-3 border-t border-[#F1F3F5] flex items-center justify-between text-xs">
                <span className="text-[10px] font-semibold text-[#8C9BAE]">
                  {art.readTimeMinutes} min de leitura
                </span>
                <span className="text-[#0B2345] font-bold group-hover:text-[#0B5FFF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ler artigo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
