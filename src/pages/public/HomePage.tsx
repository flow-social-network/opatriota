import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../../components/HeroSection';
import { EditorialGrid } from '../../components/EditorialGrid';
import { FactCheckRibbon } from '../../components/FactCheckRibbon';
import { useData } from '../../app/contexts/DataContext';
import type { Article, FactCheckItem } from '../../types';

export default function HomePage() {
  const { articles, factChecks, dataLoading } = useData();
  const navigate = useNavigate();

  const handleSelectArticle = (article: Article) => navigate(`/noticia/${article.slug}`);

  if (dataLoading) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 py-8" role="status" aria-label="Carregando conteúdo">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-[#E2E8F0] rounded-lg" />
          <div className="h-40 bg-[#E2E8F0] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <HeroSection articles={articles} onSelectArticle={handleSelectArticle} />
      <EditorialGrid articles={articles} onSelectArticle={handleSelectArticle} />
      <FactCheckRibbon
        factChecks={factChecks}
        onOpenFactCheck={() => navigate('/verificacao')}
        onOpenHub={() => navigate('/verificacao')}
      />
    </div>
  );
}
