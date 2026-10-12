import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../app/contexts/AuthContext';
import { useData } from '../../app/contexts/DataContext';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  const navigate = useNavigate();
  const { section } = useParams();
  const { currentUser, authLoading } = useAuth();
  const {
    sources, 
    queueItems, 
    portalSettings,
    updateSources,
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
  const tabMapping: Record<string, string> = {
    users: 'usuarios',
    usuarios: 'usuarios',
    permissions: 'permissoes',
    permissoes: 'permissoes',
    sources: 'fontes',
    fontes: 'fontes',
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
    wordpress: 'download',
  };

  const initialTab = (section && tabMapping[section]) || 'painel';

  return (
    <AdminDashboard
      sources={sources}
      queueItems={queueItems}
      onBack={() => navigate('/')}
      onUpdateSource={(s) => { void updateSources(s); }}
      onUpdateQueue={(q) => { void updateQueue(q); }}
      onSyncResult={(s, q) => { void updateSources(s); void updateQueue(q); }}
      portalSettings={portalSettings}
      onSavePortalSettings={savePortalSettings}
      initialTab={initialTab}
    />
  );
}
