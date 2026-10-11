import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { useData } from '../../app/contexts/DataContext';
import { useToast } from '../../app/contexts/ToastContext';
import { DashboardPage } from './DashboardPage';

export default function NewsroomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, authLoading } = useAuth();
  const {
    articles, sources, pages, categories, authors, subscriptionPlans,
    updateArticles, updateSources, savePage, deletePage,
    saveCategory, saveMenuConfig,
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
        <p className="text-[#64748B]">Faça login para acessar a redação.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-sans antialiased text-[#17202A]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#1A365D]">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/redacao')}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs transition-colors"
              aria-label="Voltar à redação"
            >
              <i className="lucide-arrow-left" /> Redação
            </button>
            <span className="text-white font-bold text-sm tracking-wide">Redação</span>
          </div>
          <nav className="flex items-center gap-4 text-xs" aria-label="Navegação da redação">
            <span className="text-white/50">{currentUser.name}</span>
            <span className="text-white/50 text-xs">({role})</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <nav className="mt-4 flex space-x-2">
          <button
            onClick={() => navigate('/redacao')}
            className="px-4 py-2 bg-[#1A365D] text-white rounded hover:bg-[#2D4A7D] transition-colors text-sm font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/redacao/articles')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#1A365D] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Artigos
          </button>
          <button
            onClick={() => navigate('/redacao/categories')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#1A365D] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Categorias
          </button>
          <button
            onClick={() => navigate('/redacao/sources')}
            className="px-4 py-2 bg-transparent text-white/70 hover:bg-[#1A365D] hover:text-[#FFCC29] transition-colors text-sm font-medium"
          >
            Fontes
          </button>
        </nav>

        <section className="mt-6">
          <h3 className="text-xl font-bold text-[#17202A] mb-4">Painel da Redação</h3>

          {location.pathname === '/redacao' && (
            <div>
              <p className="text-[#64748B] mb-4">Bem-vindo à redação, {currentUser.name}.</p>
              <p className="text-sm">Use o menu acima para navegar entre as áreas.</p>
            </div>
          )}

          {location.pathname === '/redacao/dashboard' && (
            <div>
              <DashboardPage />
            </div>
          )}

          {location.pathname === '/redacao/articles' && (
            <div>
              <p>Lista de artigos</p>
            </div>
          )}

          {location.pathname === '/redacao/categories' && (
            <div>
              <p>Gerenciar categorias</p>
            </div>
          )}

          {location.pathname === '/redacao/sources' && (
            <div>
              <p>Gerenciar fontes</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}