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

  const isPublicArticle = (article: Article) => {
    const editorialStatus = String(article.editorialStatus || '').trim().toUpperCase();
    const status = String((article as any).status || '').trim().toLowerCase();
    return editorialStatus === 'PUBLICADA' && ['', 'publicada', 'publicado', 'published'].includes(status);
  };
  const publicArticles = articles.filter(isPublicArticle);
  const publicAuthors = authors.filter((author) => author.active !== false);
  const publicFactChecks = factChecks.filter((item: any) => {
    const status = String(item.status || '').trim().toLowerCase();
    return item.published !== false && !['rascunho', 'draft', 'revisao', 'review', 'despublicada', 'unpublished'].includes(status);
  });
  const videoArticle = publicArticles.find((article) => Boolean(article.videoEmbedUrl));

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
      <HeroSection articles={publicArticles} onSelectArticle={handleSelectArticle} />
      <FeaturedVideoSpotlight article={videoArticle} onSelectArticle={handleSelectArticle} />
      <EditorialGrid articles={publicArticles} onSelectArticle={handleSelectArticle} />
      <RegionalCoverageRS
        articles={publicArticles}
        onSelectArticle={handleSelectArticle}
        onSelectCategory={(cat) => navigate(cat === 'todos' ? '/' : `/categoria/${cat}`)}
      />
      <NationalNewsSection
        articles={publicArticles}
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
        authors={publicAuthors}
        onSelectArticle={handleSelectArticle}
      />
      <FactCheckRibbon
        factChecks={publicFactChecks}
        onOpenFactCheck={() => navigate('/verificacao')}
        onOpenHub={() => navigate('/verificacao')}
      />
      <FacebookPostsSection />
    </div>
  );
}
