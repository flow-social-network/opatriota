import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CategoryPageView } from '../../components/pages/CategoryPageView';
import { NotFoundPageView } from '../../components/pages/NotFoundPageView';
import { useData } from '../../app/contexts/DataContext';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';
import type { CategorySlug } from '../../types';

export default function CategoryPage({ defaultCategory }: { defaultCategory?: string }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { articles, categories } = useData();

  const activeSlug = slug || defaultCategory || 'todos';
  let category = categories.find(c => c.slug === activeSlug);

  if (!category && activeSlug && activeSlug !== 'todos') {
    const formattedTitle = activeSlug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    category = {
      id: `cat-dynamic-${activeSlug}`,
      slug: activeSlug as CategorySlug,
      name: formattedTitle,
      description: `Cobertura completa e notícias atualizadas sobre ${formattedTitle} em O Patriota.`,
      introText: `Acompanhe as reportagens, análises e acontecimentos mais recentes sobre ${formattedTitle}.`,
      bannerImage: '/images/hero_congresso.jpg',
      seoTitle: `${formattedTitle} — Notícias e Cobertura | O Patriota`,
      seoDescription: `Acompanhe notícias sobre ${formattedTitle} com apuração factual e fontes oficiais.`,
      active: true,
      order: 99
    };
  }

  useSeoMetadata({
    title: category ? `Notícias de ${category.name}` : undefined,
    description: category?.description || `Acompanhe as principais notícias sobre ${category?.name} no portal O Patriota.`,
    pathname: category ? `/categoria/${category.slug}` : undefined,
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
