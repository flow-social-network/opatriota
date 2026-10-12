import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../../components/HeroSection';
import { FeaturedVideoSpotlight } from '../../components/FeaturedVideoSpotlight';
import { EditorialGrid } from '../../components/EditorialGrid';
import { RegionalCoverageRS } from '../../components/RegionalCoverageRS';
import { NationalNewsSection } from '../../components/NationalNewsSection';
import { RecipesSection } from '../../components/RecipesSection';
import { OpinionColumnistsSection } from '../../components/OpinionColumnistsSection';
import { FactCheckRibbon } from '../../components/FactCheckRibbon';
import { FacebookPostsSection } from '../../components/FacebookPostsSection';
import { useData } from '../../app/contexts/DataContext';
import type { Article } from '../../types';

export default function HomePage() {
  const { articles, factChecks, authors, portalSettings, dataLoading, dataError } = useData();
  const navigate = useNavigate();

  const handleSelectArticle = (article: Article) => navigate(`/noticia/${article.slug}`);

  const videoArticle = articles.find((article) => Boolean(article.videoEmbedUrl));

  // Facebook posts to display on home page


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
      {dataError && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" role="alert">
          <strong className="block">Não foi possível carregar as matérias da API.</strong>
          <span>
            {dataError === 'API_NOT_CONFIGURED'
              ? 'A API não está configurada neste ambiente. O portal não exibirá conteúdo de demonstração.'
              : 'A conexão falhou. O portal está a ocultar conteúdo não confirmado em vez de apresentar dados fictícios.'}
          </span>
        </div>
      )}
      <HeroSection articles={articles} onSelectArticle={handleSelectArticle} />
      <FeaturedVideoSpotlight article={videoArticle} onSelectArticle={handleSelectArticle} />
      <EditorialGrid articles={articles} onSelectArticle={handleSelectArticle} />
      <RegionalCoverageRS
        articles={articles}
        onSelectArticle={handleSelectArticle}
        onSelectCategory={(cat) => navigate(cat === 'todos' ? '/' : `/categoria/${cat}`)}
      />
      <NationalNewsSection
        articles={articles}
        onSelectArticle={handleSelectArticle}
        adSlots={portalSettings?.adSlots || []}
        adsense={portalSettings?.adsense || { enabled: false, publisherId: '', autoAds: false, clientStatus: 'nao_configurado', testMode: true }}
      />
      <RecipesSection
        articles={articles}
        onSelectArticle={handleSelectArticle}
        onViewAll={() => navigate('/categoria/receita')}
      />
      <OpinionColumnistsSection
        articles={articles}
        authors={authors}
        onSelectArticle={handleSelectArticle}
      />
      <FactCheckRibbon
        factChecks={factChecks}
        onOpenFactCheck={() => navigate('/verificacao')}
        onOpenHub={() => navigate('/verificacao')}
      />
      <FacebookPostsSection />
    </div>
  );
}
