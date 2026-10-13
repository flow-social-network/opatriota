import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArticleView } from '../../components/ArticleView';
import { NotFoundPageView } from '../../components/pages/NotFoundPageView';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { articles, categories, toggleCategory } = useArticleNavigation();
  const { currentUser, toggleBookmark } = useAuth();

  const isOldEnergySlug = slug === 'brasil-lidera-em-energia-renovavel-na-america-latina';
  const targetSlug = isOldEnergySlug
    ? 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista'
    : slug;

  const article = isOldEnergySlug
    ? (articles.find(a => a.slug === 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista' || a.id === 'art-policia-metro-divergem-paulista' || a.id === 'art-4') || articles[0])
    : (articles.find(a => a.slug === targetSlug || a.id === targetSlug || a.slug === slug || a.id === slug));

  React.useEffect(() => {
    if (isOldEnergySlug && article && article.slug !== 'brasil-lidera-em-energia-renovavel-na-america-latina') {
      navigate(`/noticia/${article.slug}`, { replace: true });
    }
  }, [isOldEnergySlug, article, navigate]);

  useSeoMetadata({
    title: article?.seo?.metaTitle || article?.title,
    description: article?.seo?.metaDescription || article?.subtitle,
    pathname: article ? `/noticia/${article.slug}` : undefined,
    canonicalUrl: article?.seo?.canonicalUrl,
    imageUrl: article?.imageUrl,
    type: 'article',
    articleMeta: article ? {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      author: article.author,
      section: article.category,
      tags: article.tags,
    } : undefined,
  });

  if (!article) {
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
      <ArticleView
        article={article}
        onBack={() => navigate('/')}
        onSelectCategory={toggleCategory}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        relatedArticles={articles.filter(a => a.id !== article.id)}
        currentUser={currentUser}
        onToggleBookmark={(id) => void toggleBookmark(id)}
        onOpenSubscribe={() => navigate('/leitor/assinatura')}
        onOpenLogin={() => navigate('/auth/login?next=/leitor')}
        onSelectAuthor={(name) => navigate(`/autor/${encodeURIComponent(name)}`)}
      />
    </div>
  );
}

// Hook auxiliar para navegação de categoria
function useArticleNavigation() {
  const navigate = useNavigate();
  const { articles, categories } = useData();
  const toggleCategory = (cat: string) => {
    if (cat === 'checagem') navigate('/verificacao');
    else if (cat === 'todos') navigate('/');
    else navigate(`/categoria/${cat}`);
  };
  return { articles, categories, toggleCategory };
}
