import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchPageView } from '../../components/pages/SearchPageView';
import { useData } from '../../app/contexts/DataContext';
import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { articles, categories } = useData();

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <SearchPageView
        initialQuery={query}
        articles={articles}
        categories={categories}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        onNavigateHome={() => navigate('/')}
      />
    </div>
  );
}
