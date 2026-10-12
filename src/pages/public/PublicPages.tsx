import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArchivePageView } from '../../components/pages/ArchivePageView';
import { ContactPageView } from '../../components/pages/ContactPageView';
import { LgpdPageView } from '../../components/pages/LgpdPageView';
import { NotFoundPageView } from '../../components/pages/NotFoundPageView';
import { PlansPageView } from '../../components/pages/PlansPageView';
import { InstitutionalPageView } from '../../components/pages/InstitutionalPageView';
import { CustomPageView } from '../../components/pages/CustomPageView';
import { AuthorPageView } from '../../components/pages/AuthorPageView';
import { FactCheckHub } from '../../components/FactCheckHub';
import { useData } from '../../app/contexts/DataContext';

function PageLoading({ label = 'Carregando conteúdo…' }: { label?: string }) {
  return <main className="mx-auto max-w-4xl px-4 py-16" role="status" aria-live="polite"><p className="text-sm text-slate-600">{label}</p></main>;
}

function PageDataError({ message }: { message: string }) {
  return <main className="mx-auto max-w-4xl px-4 py-16" role="alert"><h1 className="text-xl font-bold text-slate-900">Não foi possível carregar esta página</h1><p className="mt-2 text-sm text-slate-600">{message}</p><button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-[#0B2345] px-4 py-2 text-sm font-semibold text-white">Tentar novamente</button></main>;
}
import { useAuth } from '../../app/contexts/AuthContext';
import { api } from '../../services/apiClient';
import { useToast } from '../../app/contexts/ToastContext';
import { useParams } from 'react-router-dom';
import { useSeoMetadata } from '../../hooks/useSeoMetadata';

// ─── Archive ───
export function ArchivePage() {
  const navigate = useNavigate();
  const { articles, categories, authors, dataLoading, dataErrors } = useData();
  const publicArticles = articles.filter((article) => {
    const editorialStatus = String(article.editorialStatus || '').trim().toUpperCase();
    const status = String((article as any).status || '').trim().toLowerCase();
    return editorialStatus === 'PUBLICADA' && ['', 'publicada', 'publicado', 'published'].includes(status);
  });
  if (dataLoading) return <PageLoading label="Carregando arquivo editorial…" />;
  if (dataErrors['/articles']) return <PageDataError message={dataErrors['/articles']} />;
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <ArchivePageView
        articles={publicArticles}
        categories={categories.filter((category) => category.active !== false)}
        authors={authors.filter((author) => author.active !== false)}
        onSelectArticle={(article) => navigate(`/noticia/${article.slug}`)}
        onNavigateHome={() => navigate('/')}
      />
    </div>
  );
}

// ─── Contact ───
export function ContactPage() {
  const navigate = useNavigate();
  const { setContactSubmissions } = useData();
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <ContactPageView
        onNavigateHome={() => navigate('/')}
        onSubmitContact={async (submission) => {
          const result = await api.post<{ id: string; protocol: string }>('/contact-submissions', {
            name: submission.name, email: submission.email, phone: submission.phone,
            subject: submission.subject, articleRef: submission.articleRef, message: submission.message,
          }, { auth: false });
          setContactSubmissions(current => [{ ...submission, id: result.id }, ...current]);
          return result;
        }}
      />
    </div>
  );
}

// ─── LGPD ───
export function LgpdPage() {
  const navigate = useNavigate();
  const { setLgpdRequests } = useData();
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <LgpdPageView
        onNavigateHome={() => navigate('/')}
        onSubmitLgpd={async (request) => {
          const result = await api.post<{ id: string; protocol: string }>('/privacy-requests', {
            name: request.name, email: request.email, documentId: request.documentId,
            requestType: request.requestType, details: request.details,
          }, { auth: false });
          setLgpdRequests(current => [{ ...request, id: result.id }, ...current]);
          return result;
        }}
      />
    </div>
  );
}

// ─── Plans ───
export function PlansPage() {
  const navigate = useNavigate();
  const { subscriptionPlans } = useData();
  const { currentUser } = useAuth();
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <PlansPageView
        plans={subscriptionPlans}
        currentUser={currentUser}
        onSelectPlan={(planId) => navigate(`/checkout?plano=${encodeURIComponent(planId)}`)}
        onNavigateHome={() => navigate('/')}
      />
    </div>
  );
}

// ─── Fact-Check Hub ───
export function FactCheckPage() {
  const navigate = useNavigate();
  const { factChecks, dataLoading, dataErrors } = useData();
  const publicFactChecks = factChecks.filter((item: any) => {
    const status = String(item.status || '').trim().toLowerCase();
    return item.published !== false && !['rascunho', 'draft', 'revisao', 'review', 'despublicada', 'unpublished'].includes(status);
  });
  if (dataLoading) return <PageLoading label="Carregando checagens…" />;
  if (dataErrors['/fact-checks']) return <PageDataError message={dataErrors['/fact-checks']} />;
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <FactCheckHub
        factChecks={publicFactChecks}
        onBack={() => navigate('/')}
        onOpenItem={() => navigate('/verificacao')}
      />
    </div>
  );
}

// ─── 404 ───
export function NotFound() {
  const navigate = useNavigate();
  const { articles, categories } = useData();
  const publicArticles = articles.filter((article) => {
    const editorialStatus = String(article.editorialStatus || '').trim().toUpperCase();
    const status = String((article as any).status || '').trim().toLowerCase();
    return editorialStatus === 'PUBLICADA' && ['', 'publicada', 'publicado', 'published'].includes(status);
  });
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <NotFoundPageView
        categories={categories.filter((category) => category.active !== false)}
        recentArticles={publicArticles.slice(0, 4)}
        onNavigateHome={() => navigate('/')}
        onSelectCategory={(cat) => navigate(cat === 'todos' ? '/' : `/categoria/${cat}`)}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        onSearch={(q) => navigate(`/busca?q=${encodeURIComponent(q)}`)}
      />
    </div>
  );
}

// ─── Author ───
export function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { authors, articles, dataLoading, dataErrors } = useData();

  const author = authors.find((item) => item.active !== false && (
    item.slug === slug || item.id === slug || item.name.toLowerCase().replace(/\s+/g, '-') === slug
  ));

  if (dataLoading && !author) return <PageLoading label="Carregando perfil de autoria…" />;
  if (!author && (dataErrors['/authors'] || dataErrors['/articles'])) {
    return <PageDataError message={dataErrors['/authors'] || dataErrors['/articles']} />;
  }
  if (!author) return <NotFound />;

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <AuthorPageView
        author={author}
        articles={articles}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        onNavigateHome={() => navigate('/')}
      />
    </div>
  );
}

// ─── Institutional Page (CMS) ───
export function InstitutionalPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { pages, dataLoading, dataErrors } = useData();
  const previewRequested = new URLSearchParams(location.search).get('preview') === '1';
  const canPreviewDraft = Boolean(previewRequested && currentUser &&
    ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'].includes(String(currentUser.role)));
  const page = pages.find((item) => item.slug === slug && (
    canPreviewDraft ||
    (['publicado', 'publicada', 'published'].includes(String((item as any).status || '').trim().toLowerCase()) ||
      (!String((item as any).status || '').trim() && (item as any).published === true))
  ));

  useSeoMetadata({
    title: page?.seo?.metaTitle || page?.title,
    description: page?.seo?.metaDescription || page?.subtitle,
    canonicalUrl: page?.seo?.canonicalUrl,
    pathname: page ? `/${page.slug}` : undefined,
    imageUrl: page?.featuredImage,
    type: 'article',
  });

  if (dataLoading && !page) return <PageLoading label="Carregando página institucional…" />;
  if (!page && dataErrors['/pages']) return <PageDataError message={dataErrors['/pages']} />;
  if (!page) return <NotFound />;

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <InstitutionalPageView
        page={page}
        onNavigateHome={() => navigate('/')}
        onNavigatePage={(s) => navigate(`/${s.replace(/^\/|\/$/g, '')}`)}
        onNavigateContact={() => navigate('/contato')}
      />
    </div>
  );
}

// ─── Custom Page (CMS) ───
export function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { pages, dataLoading, dataErrors } = useData();

  const page = pages.find(p => p.slug === slug);

  if (dataLoading && !page) return <PageLoading label="Carregando página…" />;
  if (!page && dataErrors['/pages']) return <PageDataError message={dataErrors['/pages']} />;
  if (!page) return <NotFound />;

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <CustomPageView
        page={page}
        onNavigateHome={() => navigate('/')}
        onNavigatePage={(s) => navigate(`/${s.replace(/^\/|\/$/g, '')}`)}
      />
    </div>
  );
}
