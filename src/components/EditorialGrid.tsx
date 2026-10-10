import React from 'react';
import { Article } from '../types';
import { ArticleImage } from './ArticleImage';

interface EditorialGridProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const EditorialGrid: React.FC<EditorialGridProps> = ({
  articles,
  onSelectArticle
}) => {
  // Articles from index 4 to 9 match the 6 cards in the reference
  const gridCards = articles.slice(4, 10);

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'politica':
      case 'brasil':
      case 'saude':
        return 'bg-[#16803C] text-white';
      case 'economia':
        return 'bg-[#0B5FFF] text-white';
      case 'seguranca':
        return 'bg-[#0B2345] text-white';
      case 'opiniao':
        return 'bg-[#FFCC29] text-[#17202A]';
      case 'receita':
        return 'bg-[#4A6B2F] text-white';
      case 'tecnologia':
        return 'bg-[#6B4CFF] text-white';
      default:
        return 'bg-[#0B2345] text-white';
    }
  };

  return (
    <section className="mb-12 select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {gridCards.map((article) => {
          const badgeClass = getBadgeColor(article.category);
          return (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 min-w-0"
            >
              {/* Thumbnail with Badge */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-xs shadow-xs ${badgeClass}`}>
                  {article.kicker}
                </span>
                <ArticleImage
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 group-hover:text-[#0B5FFF] transition-colors line-clamp-3">
                    {article.title}
                  </h4>
                  <p className="text-[11px] text-[#5D6673] leading-snug line-clamp-3">
                    {article.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-[#F1F3F5] text-[10px] font-semibold text-[#5D6673] flex items-center justify-between">
                  <span>{article.readTimeMinutes} min de leitura</span>
                  <span className="text-[#0B5FFF] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
