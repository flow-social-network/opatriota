import React from 'react';
import { Article } from '../types';
import { ArticleImage } from './ArticleImage';
import { ArrowRight, MapPin } from 'lucide-react';

interface RegionalCoverageRSProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory?: (category: string) => void;
}

const isRioGrandeDoSulCoverage = (article: Article) => {
  const tags = (article.tags || []).join(' ').toLowerCase();
  const text = `${article.kicker || ''} ${article.subtitle || ''} ${tags}`.toLowerCase();
  return article.category === 'regional' ||
    /rio grande do sul|porto alegre|ga[uú]ch[oa]|\brs\b|vale do sinos|serra ga[uú]cha/.test(text);
};

export const RegionalCoverageRS: React.FC<RegionalCoverageRSProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
}) => {
  const regionalArticles = articles.filter(isRioGrandeDoSulCoverage).slice(0, 4);

  return (
    <section className="mb-12" aria-label="Cobertura regional do Rio Grande do Sul">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b-2 border-[#0B2345]">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#DC2626]" aria-hidden="true" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#DC2626]">Cobertura regional</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0B2345]">Rio Grande do Sul</h2>
          </div>
        </div>
        {onSelectCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory('brasil')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5FFF] hover:text-[#0B2345]"
          >
            Ver notícias do Brasil <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {regionalArticles.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#D9DEE7] bg-white p-6 text-sm text-[#5D6673]" role="status">
          Nenhuma matéria regional publicada no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regionalArticles.map((article) => (
            <article
              key={article.id}
              className="min-w-0 overflow-hidden rounded-lg border border-[#D9DEE7] bg-white transition hover:border-[#0B5FFF] hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => onSelectArticle(article)}
                className="flex h-full w-full flex-col text-left"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <ArticleImage
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#DC2626]">
                    {article.kicker || 'RIO GRANDE DO SUL'}
                  </span>
                  <h3 className="mb-2 font-serif text-base font-bold leading-snug text-[#0B2345]">
                    {article.title}
                  </h3>
                  {article.subtitle && (
                    <p className="line-clamp-3 text-xs leading-relaxed text-[#5D6673]">{article.subtitle}</p>
                  )}
                  <span className="mt-auto pt-3 text-[11px] font-semibold text-[#0B5FFF]">
                    Ler matéria →
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default RegionalCoverageRS;
