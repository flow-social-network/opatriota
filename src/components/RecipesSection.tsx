import React from 'react';
import { Article } from '../types';
import { ArticleImage } from './ArticleImage';
import { Utensils, Clock, ChevronRight } from 'lucide-react';

interface RecipesSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onViewAll?: () => void;
}

export const RecipesSection: React.FC<RecipesSectionProps> = ({
  articles,
  onSelectArticle,
  onViewAll,
}) => {
  const recipeArticles = articles.filter(
    (a) => a.category === 'receita' || a.kicker?.toLowerCase().includes('receita')
  );

  if (recipeArticles.length === 0) return null;

  return (
    <section className="mb-12 select-none" aria-label="Receitas e Culinária Brasileira">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 mb-6 border-b-2 border-[#4A6B2F] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A6B2F]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#4A6B2F]">
              GASTRONOMIA & TRADIÇÃO
            </span>
            <span className="text-xs text-[#5D6673] hidden sm:inline">• Sabores autênticos do Brasil</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0B2345] tracking-tight mt-1 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-[#4A6B2F]" />
            Receitas & Cozinha Brasileira
          </h2>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A6B2F] hover:text-[#2E4A19] transition-colors group cursor-pointer"
          >
            <span>Ver todas as receitas</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Grid of Recipes: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipeArticles.slice(0, 3).map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="bg-white border border-[#D9DEE7] rounded-lg overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Container with Badge */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <span className="absolute top-3 left-3 z-10 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded bg-[#4A6B2F] text-white shadow-sm">
                {article.kicker || 'RECEITA'}
              </span>
              <ArticleImage
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#0B2345] leading-snug mb-2 group-hover:text-[#4A6B2F] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[#5D6673] leading-relaxed line-clamp-3 mb-4">
                  {article.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between text-xs font-semibold text-[#5D6673]">
                <div className="flex items-center gap-1.5 text-[#4A6B2F]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTimeMinutes} min de preparo</span>
                </div>
                <span className="text-[#0B2345] group-hover:text-[#4A6B2F] flex items-center gap-1 transition-colors">
                  Acessar receita <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
