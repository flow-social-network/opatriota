import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { PanelLayout } from '../layouts/PanelLayout';
import { RequireAuth, RequireRole } from './routeGuards';

// ─── Páginas públicas (carregamento imediato — já no bundle) ───
import HomePage from '../../pages/public/HomePage';
import RecipesPage from '../../pages/public/RecipesPage';
import ArticlePage from '../../pages/public/ArticlePage';
import CategoryPage from '../../pages/public/CategoryPage';
import SearchPage from '../../pages/public/SearchPage';
import CheckoutPage from '../../pages/public/CheckoutPage';
import {
  ArchivePage,
  ContactPage,
  LgpdPage,
  PlansPage,
  FactCheckPage,
  NotFound,
  AuthorPage,
  InstitutionalPage,
  CustomPage,
} from '../../pages/public/PublicPages';

// ─── Páginas de painel (lazy — carregam sob demanda) ───
const AdminPage = lazy(() => import('../../pages/admin/AdminPage'));
const NewsroomPage = lazy(() => import('../../pages/editorial/NewsroomPage'));
const ClientPage = lazy(() => import('../../pages/client/ClientPage'));
const AccessDeniedPage = lazy(() => import('../../pages/auth/AccessDeniedPage'));

function PanelFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-label="Carregando painel">
      <div className="text-[#0B2345] font-semibold animate-pulse">Carregando painel…</div>
    </div>
  );
}

function LazyPanel({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PanelFallback />}>{children}</Suspense>;
}

const STAFF_ROLES = ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'];
const ADMIN_ROLES = ['editor_chefe', 'administrador'];
const EDITORIAL_ROLES = ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'];

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      // ─── Portal público ───
      { path: '/', element: <HomePage /> },
      { path: '/noticia/:slug', element: <ArticlePage /> },
      { path: '/categoria/:slug', element: <CategoryPage /> },
      { path: '/autor/:slug', element: <AuthorPage /> },
      { path: '/busca', element: <SearchPage /> },
      { path: '/arquivo', element: <ArchivePage /> },
      { path: '/receitas', element: <RecipesPage /> },
      { path: '/contato', element: <ContactPage /> },
      { path: '/gestao-de-dados', element: <LgpdPage /> },
      { path: '/planos', element: <PlansPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/verificacao', element: <FactCheckPage /> },
      { path: '/checagem', element: <FactCheckPage /> },

      // ─── Área do assinante ───
      { path: '/minha-conta', element: <ClientPage /> },
      { path: '/minha-conta/:subpage', element: <ClientPage /> },

      // ─── Acesso negado / 404 ───
      { path: '/acesso-negado', element: <LazyPanel><AccessDeniedPage /></LazyPanel> },
      { path: '/404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },

  // ─── Administração ───
  {
    path: '/admin',
    element: (
      <RequireRole roles={ADMIN_ROLES}>
        <PanelLayout title="Administração" subtitle="Painel administrativo" accentColor="#0B2345" />
      </RequireRole>
    ),
    children: [
      { index: true, element: <LazyPanel><AdminPage /></LazyPanel> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },

  // ─── Redação ───
  {
    path: '/redacao',
    element: (
      <RequireRole roles={EDITORIAL_ROLES}>
        <PanelLayout title="Redação" subtitle="Fluxo editorial" accentColor="#1A365D" />
      </RequireRole>
    ),
    children: [
      { index: true, element: <LazyPanel><NewsroomPage /></LazyPanel> },
      { path: '*', element: <Navigate to="/redacao" replace /> },
    ],
  },
]);
