import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../app/contexts/AuthContext';
import { api } from '../../services/apiClient';
import { useToast } from '../../app/contexts/ToastContext';
import { useParams } from 'react-router-dom';

// ─── Archive ───
export function ArchivePage() {
  const navigate = useNavigate();
  const { articles, categories, authors } = useData();
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <ArchivePageView
        articles={articles}
        categories={categories}
        authors={authors}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
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
  const { factChecks } = useData();
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <FactCheckHub
        factChecks={factChecks}
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
  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <NotFoundPageView
        categories={categories}
        recentArticles={articles.slice(0, 4)}
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
  const { authors, articles } = useData();

  const author = authors.find(a =>
    a.slug === slug || a.id === slug || a.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!author) {
    return <NotFound />;
  }

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
  const { pages } = useData();

  const page = pages.find(p => p.slug === slug);

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
  const { pages } = useData();

  const page = pages.find(p => p.slug === slug);

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
