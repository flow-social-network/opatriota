import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { useData } from '../../app/contexts/DataContext';
import { useToast } from '../../app/contexts/ToastContext';
import { NewsroomDashboard } from '../../components/newsroom/NewsroomDashboard';

export default function NewsroomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, authLoading, role, setCurrentUser } = useAuth();
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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans antialiased text-[#17202A]">
      <NewsroomDashboard
        articles={articles}
        sources={sources}
        onUpdateSources={updateSources}
        currentUser={currentUser}
        onUpdateArticles={updateArticles}
        onBackToHome={() => navigate('/')}
        onSwitchStaffRole={(newRole) => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, role: newRole as any });
          }
        }}
        pages={pages}
        onSavePage={savePage}
        onDeletePage={deletePage}
        categories={categories}
        onSaveCategory={saveCategory}
        onSaveMenuConfig={saveMenuConfig}
      />
    </div>
  );
}
