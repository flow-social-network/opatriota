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


const scaffoldSections = [
  { title: 'Últimas Notícias', kicker: 'ACOMPANHAMENTO', items: ['Política nacional e decisões públicas', 'Economia, emprego e custo de vida', 'Segurança pública e temas regionais'] },
  { title: 'Política', kicker: 'ANÁLISE', items: ['Congresso Nacional', 'Governo e instituições', 'Eleições e representação'] },
  { title: 'Brasil', kicker: 'COBERTURA NACIONAL', items: ['Infraestrutura e desenvolvimento', 'Saúde e serviços públicos', 'Agricultura e produção'] },
  { title: 'Economia', kicker: 'MERCADOS E NEGÓCIOS', items: ['Indicadores econômicos', 'Emprego e renda', 'Empreendedorismo'] },
  { title: 'Mundo', kicker: 'INTERNACIONAL', items: ['América do Sul', 'Relações internacionais', 'Tecnologia e geopolítica'] },
];

function HomeEditorialScaffold() {
  return <div className="space-y-10 pb-10">
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="flex min-h-[250px] flex-col justify-end rounded-lg bg-[#0B2345] p-6 text-white lg:col-span-7 sm:min-h-[340px]">
        <span className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#FFCC29]">O Patriota • Informação</span>
        <h1 className="max-w-2xl font-serif text-3xl font-bold leading-tight sm:text-4xl">Informação, contexto e acompanhamento dos fatos que importam ao Brasil.</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">Acompanhe pautas nacionais, regionais e internacionais em um só lugar.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">{['Política e decisões públicas','Economia e vida cotidiana','Segurança e comunidade'].map(title => <article key={title} className="flex min-h-24 items-center rounded-lg border border-[#D9DEE7] bg-white p-4"><span className="mr-3 h-10 w-1 shrink-0 rounded bg-[#16803C]"/><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0B5FFF]">Em pauta</p><h2 className="mt-1 font-serif text-lg font-bold text-[#0B2345]">{title}</h2></div></article>)}</div>
    </section>
    {scaffoldSections.map(section => <section key={section.title} className="min-w-0">
      <div className="mb-4 flex items-end justify-between border-b-2 border-[#0B2345] pb-3"><div><p className="text-[10px] font-bold tracking-[.16em] text-[#0B5FFF]">{section.kicker}</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#0B2345] sm:text-3xl">{section.title}</h2></div><span className="hidden text-[10px] font-bold uppercase tracking-wider text-[#64748B] sm:inline">Cobertura editorial</span></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{section.items.map((item,index) => <article key={item} className="overflow-hidden rounded-lg border border-[#D9DEE7] bg-white"><div className={`h-2 ${index===0?'bg-[#0B5FFF]':index===1?'bg-[#16803C]':'bg-[#0B2345]'}`}/><div className="p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">{section.title}</p><h3 className="mt-2 font-serif text-lg font-bold leading-snug text-[#0B2345]">{item}</h3><p className="mt-2 text-sm leading-relaxed text-[#64748B]">Reportagens, contexto e atualizações desta editoria.</p></div></article>)}</div>
    </section>)}
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2"><article className="rounded-lg border border-[#D9DEE7] bg-white p-5"><h2 className="font-serif text-2xl font-bold text-[#0B2345]">Vídeos em destaque</h2><div className="mt-4 flex aspect-video items-center justify-center rounded bg-[#0B2345] text-sm font-semibold text-white">Vídeos do O Patriota</div></article><article className="rounded-lg border border-[#D9DEE7] bg-white p-5"><h2 className="font-serif text-2xl font-bold text-[#0B2345]">O Patriota no Facebook</h2><p className="mt-3 text-sm text-[#64748B]">Acompanhe as publicações nos canais oficiais do jornal.</p><a href="https://www.facebook.com/opatriota.news.brasil" target="_blank" rel="noreferrer" className="mt-4 inline-flex font-bold text-[#0B5FFF]">Visitar Facebook →</a></article></section>
    <section className="rounded-lg border border-[#D9DEE7] bg-white p-5"><h2 className="font-serif text-2xl font-bold text-[#0B2345]">Colunistas</h2><p className="mt-2 text-sm text-[#64748B]">Opinião, análise e memória: artigos assinados serão exibidos nesta área.</p></section>
    <section><h2 className="mb-4 font-serif text-2xl font-bold text-[#0B2345]">Receitas Dona Nita</h2><div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{['Morango Cravejado na Travessa','Pão Caseiro da Dona Nita','Cuca Gaúcha Tradicional'].map(name=><article key={name} className="rounded-lg border border-[#D9DEE7] bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#16803C]">Receitas</p><h3 className="mt-2 font-serif text-lg font-bold text-[#0B2345]">{name}</h3></article>)}</div></section>
  </div>;
}

export default function HomePage() {
  const {
    articles,
    factChecks,
    authors,
    portalSettings,
    dataLoading,
    dataError,
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
      {hasPublishedArticles ? (
        <>
          <HeroSection articles={articles} onSelectArticle={handleSelectArticle} />
          <EditorialGrid articles={articles} onSelectArticle={handleSelectArticle} />
        </>
      ) : (
        <HomeEditorialScaffold />
      )}

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
