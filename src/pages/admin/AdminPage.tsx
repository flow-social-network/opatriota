import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { useData } from '../../app/contexts/DataContext';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const section = location.pathname.split('/').filter(Boolean)[1];
  const { currentUser, authLoading } = useAuth();
  const {
    sources,
    queueItems,
    portalSettings,
    updateQueue,
    savePortalSettings,
  } = useData();

  // Handle auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div role="status" aria-label="Carregando sessão" className="text-[#0B2345] font-semibold animate-pulse text-sm">
          Verificando credenciais administrativas…
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

  // Map sub-route parameter to tab
  const tabMapping: Record<string, 'painel' | 'fila' | 'dedup' | 'identidade' | 'redes' | 'publicidade' | 'push' | 'usuarios' | 'permissoes'> = {
    painel: 'painel',
    dashboard: 'painel',
    users: 'usuarios',
    usuarios: 'usuarios',
    permissions: 'permissoes',
    permissoes: 'permissoes',
    queue: 'fila',
    fila: 'fila',
    dedup: 'dedup',
    identity: 'identidade',
    identidade: 'identidade',
    social: 'redes',
    redes: 'redes',
    ads: 'publicidade',
    publicidade: 'publicidade',
    push: 'push',
  };

  if (section && !tabMapping[section]) return <Navigate to="/404" replace />;
  const initialTab = (section && tabMapping[section]) || 'painel';

  return (
    <AdminDashboard
      queueItems={queueItems}
      onBack={() => navigate('/')}
      onUpdateQueue={(q) => { void updateQueue(q); }}
      portalSettings={portalSettings}
      onSavePortalSettings={savePortalSettings}
      initialTab={initialTab}
      sources={sources}
      onNavigateToSources={() => navigate('/admin/sources')}
      onTabChange={(tab) => navigate(tab === 'painel' ? '/admin' : `/admin/${tab}`)}
    />
  );
}
