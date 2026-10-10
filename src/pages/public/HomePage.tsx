import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../../components/HeroSection';
import { EditorialGrid } from '../../components/EditorialGrid';
import { FactCheckRibbon } from '../../components/FactCheckRibbon';
import { FacebookPostsSection } from '../../components/FacebookPostsSection';
import { useData } from '../../app/contexts/DataContext';
import type { Article, FactCheckItem } from '../../types';

export default function HomePage() {
  const { articles, factChecks, dataLoading } = useData();
  const navigate = useNavigate();

  const handleSelectArticle = (article: Article) => navigate(`/noticia/${article.slug}`);

  // Facebook posts to display on home page
  const facebookPosts = [
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02T7wStxG716x5W1jjEGLZdw795at5RpTarVtUxLgFXDCSzmQEuKdi12LwqZf3ESTrl',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0NjGBfZ7qUUPzfZamZNEspNBF7TKnqCmnBEQr7CF6DvjHjJBmeCZHCGGf1uQWCJ9gl',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0ioDvAMSiCPtxaDsJBRg6ya5WRRCSJmFfunhtKuqFQrtD9sWwXDpAbJxWNypWPaLBl',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0Fqt3KAQvb95mAd6wCB4gxi94S8SVpaqPGszcgG7ARV7f5QBcedoA8con1DP47bW9l',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0GD4saUqCh61z6Dcp6XwvwUdR7Vhpn13Xsx6xjrs64nSU4VMHtrxBS7iHMfKV38eHl',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02rLcGppFvtK6hzDtHQxozL1p8V8Vj8LoH2G4CPH5t4PxcmZgKTCYoBZeoPH8yQ1pLl',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02h79kw8nw6BN5rbB4HWVWgPLn9sKEQNzdMLZNVNJ5ES4cenmJNTmg39C7ET91kj8ol',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02T7PkYhr8X3XxQ1viCBrbWTJxR6soiT9arJtfeZkDHvVkAnumjcuE9hHkAKE9otejl',
    },
    {
      href:
        'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02TYwyZN6VbWr9GKxer6uGfhGKAVaSXoz1ic9TmgZqENZcMyAMHa9Kpk23F1fthwAql',
    },
  ];

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
      <FacebookPostsSection posts={facebookPosts} />
    </div>
  );
}
