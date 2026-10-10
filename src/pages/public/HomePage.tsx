import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../../components/HeroSection';
import { EditorialGrid } from '../../components/EditorialGrid';
import { FactCheckRibbon } from '../../components/FactCheckRibbon';
import { FacebookPostsSection } from '../../components/FacebookPostsSection';
import { NationalNewsSection } from '../../components/NationalNewsSection';
import { OpinionColumnistsSection } from '../../components/OpinionColumnistsSection';
import { RegionalCoverageRS } from '../../components/RegionalCoverageRS';
import { useData } from '../../app/contexts/DataContext';
import { isApiConfigured } from '../../services/apiClient';
import type { Article, FactCheckItem } from '../../types';

const FACEBOOK_POSTS = [
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02T7wStxG716x5W1jjEGLZdw795at5RpTarVtUxLgFXDCSzmQEuKdi12LwqZf3ESTrl',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0NjGBfZ7qUUPzfZamZNEspNBF7TKnqCmnBEQr7CF6DvjHjJBmeCZHCGGf1uQWCJ9gl',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0ioDvAMSiCPtxaDsJBRg6ya5WRRCSJmFfunhtKuqFQrtD9sWwXDpAbJxWNypWPaLBl',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0Fqt3KAQvb95mAd6wCB4gxi94S8SVpaqPGszcgG7ARV7f5QBcedoA8con1DP47bW9l',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0GD4saUqCh61z6Dcp6XwvwUdR7Vhpn13Xsx6xjrs64nSU4VMHtrxBS7iHMfKV38eHl',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02rLcGppFvtK6hzDtHQxozL1p8V8Vj8LoH2G4CPH5t4PxcmZgKTCYoBZeoPH8yQ1pLl',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02h79kw8nw6BN5rbB4HWVWgPLn9sKEQNzdMLZNVNJ5ES4cenmJNTmg39C7ET91kj8ol',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02T7PkYhr8X3XxQ1viCBrbWTJxR6soiT9arJtfeZkDHvVkAnumjcuE9hHkAKE9otejl',
  'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02TYwyZN6VbWr9GKxer6uGfhGKAVaSXoz1ic9TmgZqENZcMyAMHa9Kpk23F1fthwAql',
].map((href) => ({ href }));

export default function HomePage() {
  const {
    articles,
    factChecks,
    authors,
    portalSettings,
    dataLoading,
  } = useData();
  const navigate = useNavigate();

  const handleSelectArticle = (article: Article) => navigate(`/noticia/${article.slug}`);
  const handleOpenFactCheck = (_item: FactCheckItem) => navigate('/verificacao');

  if (dataLoading) {
    return (
      <main className="mx-auto max-w-[1360px] px-4 py-8" aria-busy="true" aria-label="Carregando notícias">
        <div className="animate-pulse space-y-6" aria-hidden="true">
          <div className="h-64 rounded-lg bg-[#E2E8F0]" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-40 rounded-lg bg-[#E2E8F0]" />
            <div className="h-40 rounded-lg bg-[#E2E8F0]" />
            <div className="h-40 rounded-lg bg-[#E2E8F0]" />
          </div>
        </div>
      </main>
    );
  }

  const hasPublishedArticles = articles.length > 0;
  const apiConfigured = isApiConfigured();

  return (
    <main className="mx-auto max-w-[1360px] px-4 py-6 sm:py-8">
      {!apiConfigured && (
        <div role="alert" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <strong>Conteúdo indisponível:</strong> a ligação à API não está configurada neste ambiente.
          Configure <code>VITE_API_BASE_URL</code> no ambiente de publicação. Não serão mostradas notícias de demonstração como se fossem publicadas.
        </div>
      )}
      {apiConfigured && !hasPublishedArticles && (
        <div role="status" className="mb-6 rounded-lg border border-[#D9DEE7] bg-white p-4 text-sm text-[#404B5A]">
          <strong>Não há notícias publicadas para apresentar.</strong> A API respondeu, mas não devolveu artigos publicados.
          Verifique a configuração do fornecedor de dados e o estado editorial das matérias.
        </div>
      )}

      <HeroSection articles={articles} onSelectArticle={handleSelectArticle} />
      <EditorialGrid articles={articles} onSelectArticle={handleSelectArticle} />

      <NationalNewsSection
        articles={articles}
        onSelectArticle={handleSelectArticle}
        adSlots={portalSettings.adSlots}
        adsense={portalSettings.adsense}
      />

      <RegionalCoverageRS
        articles={articles}
        onSelectArticle={handleSelectArticle}
        onSelectCategory={(category) => navigate(`/categoria/${category}`)}
      />

      <OpinionColumnistsSection
        articles={articles}
        authors={authors}
        onSelectArticle={handleSelectArticle}
        onSelectAuthor={(slug) => navigate(`/autor/${slug}`)}
      />

      <FactCheckRibbon
        factChecks={factChecks}
        onOpenFactCheck={handleOpenFactCheck}
        onOpenHub={() => navigate('/verificacao')}
      />

      <FacebookPostsSection posts={FACEBOOK_POSTS} />
    </main>
  );
}
