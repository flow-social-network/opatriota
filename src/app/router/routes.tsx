import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { PanelLayout } from '../layouts/PanelLayout';
import { RequireAuth, RequireRole } from './routeGuards';

// ─── Páginas públicas (carregamento imediato) ───
import HomePage from '../../pages/public/HomePage';
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
} from '../../pages/public/PublicPages';

// ─── Páginas de autenticação independentes (sem cabeçalho/rodapé do jornal) ───
const ClientLoginPage = lazy(() => import('../../pages/auth/ClientLoginPage'));
const ClientRegisterPage = lazy(() => import('../../pages/auth/ClientRegisterPage'));
const ClientForgotPasswordPage = lazy(() => import('../../pages/auth/ClientForgotPasswordPage'));
const ClientResetPasswordPage = lazy(() => import('../../pages/auth/ClientResetPasswordPage'));

const NewsroomLoginPage = lazy(() => import('../../pages/auth/NewsroomLoginPage'));
const NewsroomForgotPasswordPage = lazy(() => import('../../pages/auth/NewsroomForgotPasswordPage'));
const NewsroomResetPasswordPage = lazy(() => import('../../pages/auth/NewsroomResetPasswordPage'));

const AdminLoginPage = lazy(() => import('../../pages/auth/AdminLoginPage'));
const AdminForgotPasswordPage = lazy(() => import('../../pages/auth/AdminForgotPasswordPage'));
const AdminResetPasswordPage = lazy(() => import('../../pages/auth/AdminResetPasswordPage'));

const AuthCallbackPage = lazy(() => import('../../pages/auth/AuthCallbackPage'));
const AccessDeniedPage = lazy(() => import('../../pages/auth/AccessDeniedPage'));

// ─── Páginas de painel (lazy) ───
const AdminPage = lazy(() => import('../../pages/admin/AdminPage'));
const NewsroomPage = lazy(() => import('../../pages/editorial/NewsroomPage'));
const ClientPage = lazy(() => import('../../pages/client/ClientPage'));

function AuthFallback() {
  return (
    <div className="min-h-screen bg-[#071322] flex items-center justify-center p-6 text-white" role="status" aria-label="Carregando autenticação">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#FFCC29]/20 border-t-[#FFCC29] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-white/70 font-mono tracking-wider">CARREGANDO AUTENTICAÇÃO...</p>
      </div>
    </div>
  );
}

function PanelFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-label="Carregando painel">
      <div className="text-[#0B2345] font-semibold animate-pulse text-sm">Carregando painel…</div>
    </div>
  );
}

function LazyAuth({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<AuthFallback />}>{children}</Suspense>;
}

function LazyPanel({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PanelFallback />}>{children}</Suspense>;
}

const ADMIN_ROLES = ['editor_chefe', 'administrador'];
const EDITORIAL_ROLES = ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'];

export const router = createBrowserRouter([
  // ─── PÁGINAS DE AUTENTICAÇÃO INDEPENDENTES (LAYOUT DEDICADO) ───
  // 1. Cliente / Leitor
  { path: '/login', element: <LazyAuth><ClientLoginPage /></LazyAuth> },
  { path: '/cadastro', element: <LazyAuth><ClientRegisterPage /></LazyAuth> },
  { path: '/esqueci-a-senha', element: <LazyAuth><ClientForgotPasswordPage /></LazyAuth> },
  { path: '/redefinir-senha', element: <LazyAuth><ClientResetPasswordPage /></LazyAuth> },

  // 2. Redação Jornalística
  { path: '/redacao/login', element: <LazyAuth><NewsroomLoginPage /></LazyAuth> },
  { path: '/redacao/esqueci-a-senha', element: <LazyAuth><NewsroomForgotPasswordPage /></LazyAuth> },
  { path: '/redacao/redefinir-senha', element: <LazyAuth><NewsroomResetPasswordPage /></LazyAuth> },

  // 3. Administração
  { path: '/admin/login', element: <LazyAuth><AdminLoginPage /></LazyAuth> },
  { path: '/admin/esqueci-a-senha', element: <LazyAuth><AdminForgotPasswordPage /></LazyAuth> },
  { path: '/admin/redefinir-senha', element: <LazyAuth><AdminResetPasswordPage /></LazyAuth> },

  // 4. Retorno de autenticação & Acesso Negado
  { path: '/auth/callback', element: <LazyAuth><AuthCallbackPage /></LazyAuth> },
  { path: '/acesso-negado', element: <LazyAuth><AccessDeniedPage /></LazyAuth> },

  // ─── PAINÉIS INTERNOS PROTEGIDOS ───
  // Painel Administrativo
  {
    path: '/admin',
    element: (
      <RequireRole roles={ADMIN_ROLES} loginRedirect="/admin/login">
        <PanelLayout showHeader={false} />
      </RequireRole>
    ),
    children: [
      { index: true, element: <LazyPanel><AdminPage /></LazyPanel> },
      { path: ':section', element: <LazyPanel><AdminPage /></LazyPanel> },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },

  // Painel da Redação
  {
    path: '/redacao',
    element: (
      <RequireRole roles={EDITORIAL_ROLES} loginRedirect="/redacao/login">
        <PanelLayout showHeader={false} />
      </RequireRole>
    ),
    children: [
      { index: true, element: <LazyPanel><NewsroomPage /></LazyPanel> },
      { path: ':section', element: <LazyPanel><NewsroomPage /></LazyPanel> },
      { path: '*', element: <Navigate to="/redacao" replace /> },
    ],
  },

  // ─── PORTAL PÚBLICO (COM CABEÇALHO E RODAPÉ INSTITUCIONAL) ───
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/noticia/:slug', element: <ArticlePage /> },
      { path: '/categoria/:slug', element: <CategoryPage /> },
      { path: '/autor/:slug', element: <AuthorPage /> },
      { path: '/busca', element: <SearchPage /> },
      { path: '/arquivo', element: <ArchivePage /> },
      { path: '/contato', element: <ContactPage /> },
      { path: '/gestao-de-dados', element: <LgpdPage /> },
      { path: '/planos', element: <PlansPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/verificacao', element: <FactCheckPage /> },
      { path: '/checagem', element: <FactCheckPage /> },

      // Área do assinante
      { path: '/minha-conta', element: <ClientPage /> },
      { path: '/minha-conta/:subpage', element: <ClientPage /> },

      // Atalho de receitas
      { path: '/receitas', element: <Navigate to="/categoria/receita" replace /> },

      // Páginas institucionais / CMS
      { path: '/pagina/:slug', element: <InstitutionalPage /> },
      { path: '/p/:slug', element: <InstitutionalPage /> },
      { path: '/:slug', element: <InstitutionalPage /> },

      // 404
      { path: '/404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
