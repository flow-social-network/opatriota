import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NewsroomDashboard } from '../../components/newsroom/NewsroomDashboard';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export default function NewsroomPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const {
    articles, sources, pages, categories, menuConfig,
    updateArticles, updateSources, savePage, deletePage,
    saveCategory, saveMenuConfig,
  } = useData();

  if (!currentUser) return null; // RequireRole já garante, mas defesa em profundidade

  return (
    <div className="flex-1">
      <NewsroomDashboard
        articles={articles}
        sources={sources}
        onUpdateSources={updateSources}
        currentUser={currentUser}
        onUpdateArticles={updateArticles}
        onBackToHome={() => navigate('/')}
        onSwitchStaffRole={() => {
          showToast('A função da equipa é atribuída pelo backend; não é possível alterná-la no navegador.');
        }}
        pages={pages}
        onSavePage={savePage}
        onDeletePage={deletePage}
        onPreviewPage={(slug) => navigate(`/${slug.replace(/^\/|\/$/g, '')}`)}
        categories={categories}
        onSaveCategory={saveCategory}
        onPreviewCategory={(cat) => navigate(cat === 'todos' ? '/' : `/categoria/${cat}`)}
        menuConfig={menuConfig}
        onSaveMenuConfig={saveMenuConfig}
      />
    </div>
  );
}
