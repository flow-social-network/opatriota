import React from 'react';
import { Article } from '../../types';
import { ArticleImage } from '../ArticleImage';
import { Utensils, Clock, ArrowRight, Users } from 'lucide-react';

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
  const displayedRecipes = articles
    .filter((article) => article.category === 'receita')
    .slice(0, 3)
    .map((article) => ({
      id: article.id,
      title: article.title,
      time: article.readTimeMinutes ? `${article.readTimeMinutes} min de leitura` : 'Tempo não informado',
      portions: 'Consulte a matéria',
      imageUrl: article.imageUrl,
      article,
    }));

  return (
    <div className="bg-white border border-[#D9DEE7] rounded-lg p-5 shadow-2xs select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-[#DC2626]">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-[#DC2626]" />
          <h3 className="font-serif text-lg font-black text-[#DC2626] tracking-tight">
            Receitas Dona Nita
          </h3>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B5FFF] hover:text-[#0B2345] transition-colors group cursor-pointer uppercase tracking-wider"
          >
            <span>VER TODAS</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {displayedRecipes.length === 0 ? (
        <p className="rounded border border-dashed border-[#D9DEE7] p-6 text-sm text-[#5D6673]" role="status">
          Nenhuma receita publicada no momento.
        </p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedRecipes.map((recipe) => (
          <article
            key={recipe.id}
            onClick={() => onSelectArticle(recipe.article)}
            className="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <ArticleImage
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Body */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <h4 className="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-2 group-hover:text-[#DC2626] transition-colors line-clamp-2">
                {recipe.title}
              </h4>

              <div className="pt-2 border-t border-[#F1F3F5] flex items-center justify-between text-[10px] text-[#5D6673]">
                <div className="flex items-center gap-1 text-[#DC2626] font-semibold">
                  <Clock className="w-3 h-3" />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center gap-1 text-[#5D6673]">
                  <Users className="w-3 h-3 text-[#5D6673]/70" />
                  <span>{recipe.portions}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      )}
    </div>
  );
};

export default RecipesSection;
