import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { useData } from '../../app/contexts/DataContext';
import { UsersPage } from './UsersPage';
import { PermissionsPage } from './PermissionsPage';
import { JournalistsPage } from './JournalistsPage';
import { CategoriesPage } from './CategoriesPage';
import { SourcesPage } from './SourcesPage';
import { ArticlesPage } from './ArticlesPage';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, authLoading } = useAuth();
  const {
    sources, queueItems, pages, categories, authors, portalSettings,
    setSources, setQueueItems, savePortalSettings,
    saveCategory, savePage, deletePage,
  } = useData();

  // Handle auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div role="status" aria-label="Carregando sessão" className="text-[#0B2345] font-semibold animate-pulse">
          Verificando sessão…
        </div>
      </div>
    );
  }

  // Handle unauthorized access
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <p className="text-[#64748B]">Faça login para acessar o painel administrativo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-sans antialiased text-[#17202A]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#0B2345]">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs transition-colors"
              aria-label="Voltar ao painel"
            >
              <i className="lucide-arrow-left" /> Portal
            </button>
            <span className="text-white font-bold text-sm tracking-wide">Admin</span>
          </div>
          <nav className="flex items-center gap-4 text-xs" aria-label="Navegação do painel">
            <span className="text-white/50">{currentUser.name}</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <nav className="mt-4 flex space-x-2">
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-[#0B2345] text-white rounded hover:bg-[#132D50] transition-colors text-sm font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#07172E] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Usuarios
          </button>
          <button
            onClick={() => navigate('/admin/permissions')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#07172E] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Permissoes
          </button>
          <button
            onClick={() => navigate('/admin/journalists')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#07172E] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Jornalistas
          </button>
          <button
            onClick={() => navigate('/admin/categories')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#07172E] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Categorias
          </button>
          <button
            onClick={() => navigate('/admin/sources')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#07172E] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Fontes
          </button>
          <button
            onClick={() => navigate('/admin/articles')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#07172E] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Artigos
          </button>
        </nav>

        <section className="mt-6">
          <h3 className="text-xl font-bold text-[#17202A] mb-4">Painel Administrativo</h3>

          {location.pathname === '/admin' && (
            <AdminDashboard
              sources={sources}
              queueItems={queueItems}
              onBack={() => navigate('/')}
              onUpdateSource={(s) => setSources(s)}
              onUpdateQueue={(q) => setQueueItems(q)}
              onSyncResult={(s, q) => { setSources(s); setQueueItems(q); }}
              portalSettings={portalSettings}
              onSavePortalSettings={savePortalSettings}
            />
          )}

          {location.pathname === '/admin/users' && (
            <div>
              <UsersPage />
            </div>
          )}

          {location.pathname === '/admin/permissions' && (
            <div>
              <PermissionsPage />
            </div>
          )}

          {location.pathname === '/admin/journalists' && (
            <div>
              <JournalistsPage />
            </div>
          )}

          {location.pathname === '/admin/categories' && (
            <div>
              <CategoriesPage />
            </div>
          )}

          {location.pathname === '/admin/sources' && (
            <div>
              <SourcesPage />
            </div>
          )}

          {location.pathname === '/admin/articles' && (
            <div>
              <ArticlesPage />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}