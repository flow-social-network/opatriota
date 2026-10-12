import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../app/contexts/DataContext';
import { InstitutionalPageView } from '../../components/pages/InstitutionalPageView';
import { NotFoundPageView } from '../../components/pages/NotFoundPageView';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';

const PAGE_ALIASES: Record<string, string> = {
  'sobre': 'sobre-o-patriota',
  'principios': 'principios-editoriais',
  'contrato': 'contrato-de-assinatura',
};

function PageLoading() {
  return <main className="mx-auto max-w-4xl px-4 py-16" role="status">Carregando página institucional…</main>;
}

export default function InstitutionalInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pages, categories, articles, dataLoading, dataErrors } = useData();
  const pathSlug = location.pathname.replace(/^\/+|\/+$/g, '');
  const candidates = [pathSlug, PAGE_ALIASES[pathSlug]].filter(Boolean);
  const page = pages.find((item) => candidates.includes(item.slug));

  useSeoMetadata({
    title: page?.seo?.metaTitle || page?.title,
    description: page?.seo?.metaDescription || page?.subtitle,
    canonicalUrl: page?.seo?.canonicalUrl,
    pathname: page ? location.pathname : undefined,
    imageUrl: page?.featuredImage,
    type: 'article',
  });

  if (dataLoading && !page) return <PageLoading />;
  if (!page && dataErrors['/pages']) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16" role="alert">
        <h1 className="text-xl font-bold text-slate-900">Não foi possível carregar a página institucional</h1>
        <p className="mt-2 text-sm text-slate-600">{dataErrors['/pages']}</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-[#0B2345] px-4 py-2 text-sm font-semibold text-white">Tentar novamente</button>
      </main>
    );
  }

  if (!page) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-8">
        <NotFoundPageView
          categories={categories}
          recentArticles={articles.filter((article) => article.editorialStatus === 'PUBLICADA').slice(0, 4)}
          onNavigateHome={() => navigate('/')}
          onSelectCategory={(category) => navigate(category === 'todos' ? '/' : `/categoria/${category}`)}
          onSelectArticle={(article) => navigate(`/noticia/${article.slug}`)}
          onSearch={(query) => navigate(`/busca?q=${encodeURIComponent(query)}`)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <InstitutionalPageView
        page={page}
        onNavigateHome={() => navigate('/')}
        onNavigatePage={(slug) => navigate(`/${slug.replace(/^\/+|\/+$/g, '')}`)}
        onNavigateContact={() => navigate('/contato')}
      />
    </div>
  );
}
