import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArticleView } from '../../components/ArticleView';
import { NotFoundPageView } from '../../components/pages/NotFoundPageView';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { articles, categories, toggleCategory } = useArticleNavigation();
  const { currentUser, toggleBookmark } = useAuth();

  const article = articles.find(a => a.slug === slug || a.id === slug);

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
        onOpenSubscribe={() => navigate('/minha-conta?tab=assinatura')}
        onOpenLogin={() => navigate('/minha-conta?tab=entrar')}
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
