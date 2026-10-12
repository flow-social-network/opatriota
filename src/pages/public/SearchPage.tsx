import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchPageView } from '../../components/pages/SearchPageView';
import { useData } from '../../app/contexts/DataContext';
import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { articles, categories, dataLoading, dataErrors } = useData();
  const publicArticles = articles.filter((article) => {
    const editorialStatus = String(article.editorialStatus || '').trim().toUpperCase();
    const status = String((article as any).status || '').trim().toLowerCase();
    return editorialStatus === 'PUBLICADA' && ['', 'publicada', 'publicado', 'published'].includes(status);
  });

  if (dataLoading) return <main className="mx-auto max-w-4xl px-4 py-16" role="status">Carregando resultados…</main>;
  if (dataErrors['/articles']) return <main className="mx-auto max-w-4xl px-4 py-16" role="alert"><h1 className="text-xl font-bold">A pesquisa está temporariamente indisponível</h1><p className="mt-2 text-sm text-slate-600">{dataErrors['/articles']}</p><button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-[#0B2345] px-4 py-2 text-sm font-semibold text-white">Tentar novamente</button></main>;

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <SearchPageView
        initialQuery={query}
        articles={publicArticles}
        categories={categories}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        onNavigateHome={() => navigate('/')}
      />
    </div>
  );
}
