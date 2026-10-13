import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CategoryPageView } from '../../components/pages/CategoryPageView';
import { NotFoundPageView } from '../../components/pages/NotFoundPageView';
import { useData } from '../../app/contexts/DataContext';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';

export default function CategoryPage({ defaultCategory }: { defaultCategory?: string }) {
  const { slug, subcategory } = useParams<{ slug: string; subcategory?: string }>();
  const navigate = useNavigate();
  const { articles, categories } = useData();

  const activeSlug = slug || defaultCategory || 'todos';
  let category = categories.find(c => c.slug === activeSlug);

  useSeoMetadata({
    title: category ? `${subcategory ? `${subcategory} — ` : ''}Notícias de ${category.name}` : undefined,
    description: category?.description || `Acompanhe as principais notícias sobre ${category?.name} no portal O Patriota.`,
    pathname: category ? `/categoria/${category.slug}${subcategory ? `/${subcategory}` : ''}` : undefined,
  });

  if (!category) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-8">
        <NotFoundPageView
          categories={categories}
          recentArticles={articles.slice(0, 4)}
          onNavigateHome={() => navigate('/')}
          onSelectCategory={(cat) => navigate(cat === 'todos' ? '/' : `/categoria/${cat}`)}
          onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
          onSearch={(q) => navigate(`/busca?q=${encodeURIComponent(q)}`)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <CategoryPageView
        category={category}
        subcategory={subcategory}
        articles={articles}
        allCategories={categories}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        onSelectCategory={(cat) => navigate(cat === 'todos' ? '/' : `/categoria/${cat}`)}
        onNavigateHome={() => navigate('/')}
        onSearch={(q) => navigate(`/busca?q=${encodeURIComponent(q)}`)}
      />
    </div>
  );
}
