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
  const { dataLoading, dataErrors } = useData();

  const article = articles.find((item) => item.slug === slug || item.id === slug);
  const isPremiumLocked = Boolean((article as any)?.premiumLocked);

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

  if (!article && dataLoading) {
    return <main className="mx-auto max-w-4xl px-4 py-16" role="status">Carregando matéria…</main>;
  }

  if (!article && dataErrors['/articles']) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16" role="alert">
        <h1 className="text-xl font-bold text-slate-900">Não foi possível carregar a matéria</h1>
        <p className="mt-2 text-sm text-slate-600">{dataErrors['/articles']}</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-[#0B2345] px-4 py-2 text-sm font-semibold text-white">Tentar novamente</button>
      </main>
    );
  }

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

  if (isPremiumLocked) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="overflow-hidden rounded-xl border border-[#D9DEE7] bg-white shadow-sm">
          {article.imageUrl && <img src={article.imageUrl} alt="" className="max-h-80 w-full object-cover" />}
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B5FFF]">
              Conteúdo {article.accessLevel === 'premium' ? 'premium' : 'para assinantes'}
            </p>
            <h1 className="mt-3 font-serif text-2xl font-black leading-tight text-[#0B2345] sm:text-3xl">{article.title}</h1>
            {article.subtitle && <p className="mt-3 text-base leading-relaxed text-[#5D6673]">{article.subtitle}</p>}
            <p className="mt-5 text-sm leading-6 text-[#344054]">
              O texto integral exige uma assinatura ativa com o nível de acesso correspondente. O conteúdo completo não foi enviado pela API.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => navigate('/planos')} className="min-h-11 rounded-lg bg-[#0B2345] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0B5FFF]">
                Ver planos de assinatura
              </button>
              {!currentUser && (
                <button type="button" onClick={() => navigate('/minha-conta?tab=entrar')} className="min-h-11 rounded-lg border border-[#CBD5E0] px-5 py-2.5 text-sm font-semibold text-[#0B2345] hover:bg-[#F8FAFC]">
                  Entrar na conta
                </button>
              )}
            </div>
          </div>
        </div>
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
