import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { useData } from '../../app/contexts/DataContext';
import { useToast } from '../../app/contexts/ToastContext';
import { NewsroomDashboard } from '../../components/newsroom/NewsroomDashboard';

export default function NewsroomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, authLoading } = useAuth();
  const section = location.pathname.split('/').filter(Boolean)[1] || 'painel';
  const tabMapping: Record<string, 'painel' | 'materias' | 'editor' | 'fontes' | 'midia' | 'paginas' | 'categorias' | 'menus'> = {
    painel: 'painel',
    materias: 'materias',
    artigos: 'materias',
    editor: 'editor',
    nova: 'editor',
    fontes: 'fontes',
    midia: 'midia',
    paginas: 'paginas',
    categorias: 'categorias',
    menus: 'menus',
    revisao: 'materias',
    agenda: 'materias',
    aprovacao: 'materias',
  };
  const statusFilterMapping: Record<string, string> = {
    revisao: 'EM REVISÃO',
    agenda: 'AGENDADA',
    aprovacao: 'APROVADA',
  };
  const initialStatusFilter = statusFilterMapping[section] || 'TODAS';
  const initialTab = tabMapping[section] || 'painel';
  const {
    articles, pages, categories,
    updateArticles, savePage, deletePage,
    saveCategory, saveMenuConfig,
  } = useData();

  // Unknown editorial paths must not silently open the dashboard.
  if (section && !tabMapping[section]) return <Navigate to="/404" replace />;

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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans antialiased text-[#17202A]">
      <NewsroomDashboard
        initialTab={initialTab}
        initialStatusFilter={initialStatusFilter}
        onTabChange={(tab) => navigate(tab === 'painel' ? '/redacao' : `/redacao/${tab}`)}
        articles={articles}
        currentUser={currentUser}
        onUpdateArticles={updateArticles}
        pages={pages}
        onSavePage={savePage}
        onDeletePage={deletePage}
        onPreviewPage={(slug) => navigate(`/${slug.replace(/^\\/+|\\/+$/g, '')}?preview=1`)}
        categories={categories}
        onSaveCategory={saveCategory}
        onSaveMenuConfig={saveMenuConfig}
      />
    </div>
  );
}
