import { api } from '../services/apiClient';
import React, { useEffect, useState } from 'react';
import { RssSource, EditorialQueueItem, EditorialStatus, PortalSettings } from '../types';
import { OfficialSourcesHub } from './admin/OfficialSourcesHub';
import { IdentityManager } from './admin/IdentityManager';
import { SocialMediaManager } from './admin/SocialMediaManager';
import { AdsManager } from './admin/AdsManager';
import { PushNotificationManager } from './admin/PushNotificationManager';
import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminQueueTab } from './admin/AdminQueueTab';
import { AdminDedupTab } from './admin/AdminDedupTab';
import { UsersPage } from '../pages/admin/UsersPage';
import { PermissionsPage } from '../pages/admin/PermissionsPage';
import { DEFAULT_WEBPUSH_CONFIG } from '../services/siteConfigService';
import { 
  SlidersHorizontal, 
  Rss, 
  Layers, 
  GitPullRequest, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeft,
  Palette,
  Share2,
  Megaphone,
  Bell,
  Users,
  Shield
} from 'lucide-react';

type AdminTab = 'painel' | 'fila' | 'fontes' | 'dedup' | 'identidade' | 'redes' | 'publicidade' | 'push' | 'usuarios' | 'permissoes';

interface AdminDashboardProps {
  initialTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
  sources: RssSource[];
  queueItems: EditorialQueueItem[];
  onBack: () => void;
  onUpdateSource: (sources: RssSource[]) => void;
  onUpdateQueue: (items: EditorialQueueItem[]) => void;
  onSyncResult: (sources: RssSource[], queue: EditorialQueueItem[]) => void;
  portalSettings: PortalSettings;
  onSavePortalSettings: (newSettings: PortalSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = 'painel',
  onTabChange,
  sources,
  queueItems,
  onBack,
  onUpdateSource,
  onUpdateQueue,
  onSyncResult,
  portalSettings,
  onSavePortalSettings,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // State for adding a new source
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newRssUrl, setNewRssUrl] = useState('');
  const [newCategory, setNewCategory] = useState('politica');
  const [showAddSource, setShowAddSource] = useState(false);

  // State for interactive deduplication tester
  const [testTitle, setTestTitle] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [dedupTestResult, setDedupTestResult] = useState<any>(null);

  // Status filter for editorial queue
  const [queueFilter, setQueueFilter] = useState<string>('TODAS');


  // The backend performs the actual RSS fetch and persists source/queue updates.
  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncMessage('Consultando feeds RSS reais e persistindo as pautas...');
    try {
      const result = await api.post<{
        sources: RssSource[];
        queueItems: EditorialQueueItem[];
        importedCount: number;
        checkedSources: number;
      }>('/editorial/sources/sync', {});
      onUpdateSource(result.sources);
      if (result.queueItems.length) onUpdateQueue([...result.queueItems, ...queueItems]);
      setSyncMessage(`Sincronização concluída: ${result.checkedSources} fontes consultadas; ${result.importedCount} pautas novas.`);
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : 'Falha na sincronização. Nenhuma pauta fictícia foi criada.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Add source handler
  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newRssUrl) return;

    const newSource: RssSource = {
      id: Date.now(),
      name: newSourceName,
      officialUrl: newSourceUrl || newRssUrl,
      rssUrl: newRssUrl,
      sourceType: 'órgão público',
      category: newCategory as any,
      isActive: true,
      pollFrequencyMin: 30,
      lastPolled: 'Pendente',
      lastSuccess: 'Pendente',
      lastError: null,
      itemsReceived: 0
    };

    onUpdateSource([...sources, newSource]);
    setNewSourceName('');
    setNewSourceUrl('');
    setNewRssUrl('');
    setShowAddSource(false);
  };

  // Transition queue status
  const handleStatusChange = (id: number, newStatus: EditorialStatus) => {
    const updated = queueItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          editorialStatus: newStatus,
          assignedTo: newStatus === 'EM REDAÇÃO' ? 'Repórter Designado' : item.assignedTo
        };
      }
      return item;
    });
    onUpdateQueue(updated);
  };

  // Run interactive deduplication evaluation
  const handleTestDedup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle) return;

    const lowerTitle = testTitle.toLowerCase();
    let matchedItem: any = null;
    let maxSim = 0;

    queueItems.forEach((it) => {
      const itTitle = it.title.toLowerCase();
      if (itTitle === lowerTitle) {
        matchedItem = it;
        maxSim = 100;
      } else {
        // Simple word similarity estimation
        const wordsA = new Set(lowerTitle.split(/\s+/));
        const wordsB = new Set(itTitle.split(/\s+/));
        const intersection = [...wordsA].filter(x => wordsB.has(x)).length;
        const union = new Set([...wordsA, ...wordsB]).size;
        const sim = (intersection / union) * 100;
        if (sim > maxSim) {
          maxSim = sim;
          matchedItem = it;
        }
      }
    });

    if (maxSim >= 90) {
      setDedupTestResult({
        status: 'DUPLICADO CONFIRMADO',
        color: '#B42318',
        reason: `Camada 3 (Hash de Título): Título quase idêntico ao item #${matchedItem.id} ("${matchedItem.title.substring(0, 40)}...")`,
        score: maxSim.toFixed(1)
      });
    } else if (maxSim >= 60) {
      setDedupTestResult({
        status: 'REVISÃO MANUAL (POSSÍVEL DUPLICADO)',
        color: '#D97706',
        reason: `Camada 4 (Similaridade Textual): Coincidência de ${maxSim.toFixed(1)}% com o item #${matchedItem.id}. Encaminhar para editor humano.`,
        score: maxSim.toFixed(1)
      });
    } else {
      setDedupTestResult({
        status: 'NOVO (APROVADO PARA TRIAGEM)',
        color: '#16803C',
        reason: 'Camada 5: Nenhuma correspondência prévia detectada. Pauta inédita.',
        score: maxSim.toFixed(1)
      });
    }
  };

  const filteredQueue = queueFilter === 'TODAS'
    ? queueItems
    : queueItems.filter(i => i.editorialStatus === queueFilter);

  return (
    <div className="min-h-screen bg-[#F1F3F5] text-[#17202A] select-none pb-16">
      {/* Top Admin Bar */}
      <div className="bg-[#07172E] text-white px-6 py-3 border-b border-[#0B2345] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white px-2 py-1 rounded bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VER PORTAL AO VIVO</span>
          </button>
          <span className="text-white/40">|</span>
          <div className="flex items-center gap-2">
            <span className="text-[#FFCC29] font-black text-sm">O PATRIOTA</span>
            <span className="text-xs text-white/70 font-mono">PAINEL DE CONTROLE EDITORIAL</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Esteira Ativa (50-100 matérias/dia)</span>
          </span>
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-[#16803C] hover:bg-[#22A447] text-white font-bold px-3 py-1.5 rounded transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'SINCRONIZAR FONTES AGORA'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="bg-[#EBF7EE] border-b border-[#16803C]/30 text-[#16803C] px-6 py-2.5 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Main Admin Container */}
      <div className="max-w-[1360px] mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#D9DEE7] pb-2">
          <button
            onClick={() => handleTabChange('painel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'painel' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>

          <button
            onClick={() => handleTabChange('fila')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'fila' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            <span>Fila Editorial ({queueItems.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('fontes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'fontes' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Rss className="w-4 h-4" />
            <span>Central de Fontes ({sources.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('dedup')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'dedup' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Deduplicação (5 Camadas)</span>
          </button>

          <button
            onClick={() => handleTabChange('identidade')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'identidade' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Palette className="w-4 h-4 text-[#0B5FFF]" />
            <span>Identidade & Logótipos</span>
          </button>

          <button
            onClick={() => handleTabChange('redes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'redes' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Share2 className="w-4 h-4 text-[#16803C]" />
            <span>Redes Sociais</span>
          </button>

          <button
            onClick={() => handleTabChange('publicidade')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'publicidade' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#FFCC29]" />
            <span>Central de Publicidade</span>
          </button>

          <button
            onClick={() => handleTabChange('push')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'push' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Bell className="w-4 h-4 text-[#0B5FFF]" />
            <span>Web Push (FCM)</span>
          </button>

          <button
            onClick={() => handleTabChange('usuarios')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'usuarios' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Users className="w-4 h-4 text-[#0B5FFF]" />
            <span>Equipe & Usuários</span>
          </button>

          <button
            onClick={() => handleTabChange('permissoes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'permissoes' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Shield className="w-4 h-4 text-[#FFCC29]" />
            <span>Permissões (RBAC)</span>
          </button>


        </div>

        {/* TAB 1: PAINEL GERAL */}
        {activeTab === 'painel' && (
          <AdminOverviewTab
            sources={sources}
            queueItems={queueItems}
            onNavigateToQueue={() => handleTabChange('fila')}
          />
        )}

        {/* TAB 2: FILA EDITORIAL */}
        {activeTab === 'fila' && (
          <AdminQueueTab
            items={filteredQueue}
            queueFilter={queueFilter}
            onQueueFilterChange={setQueueFilter}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* TAB 3: CENTRAL DE FONTES */}
        {activeTab === 'fontes' && (
          <div className="bg-white p-6 rounded-xl border border-[#D9DEE7] shadow-xs">
            <OfficialSourcesHub
              sources={sources}
              onUpdateSources={onUpdateSource}
              onSyncAll={handleSyncAll}
              isSyncing={isSyncing}
            />
          </div>
        )}

        {/* TAB 4: DEDUPLICAÇÃO */}
        {activeTab === 'dedup' && (
          <AdminDedupTab
            testTitle={testTitle}
            onTestTitleChange={setTestTitle}
            dedupTestResult={dedupTestResult}
            onSubmitTest={handleTestDedup}
          />
        )}

        {/* TAB 5: IDENTIDADE & LOGÓTIPOS */}
        {activeTab === 'identidade' && (
          <IdentityManager
            identityConfig={portalSettings.identity}
            onSaveIdentity={(newIdentity) => {
              onSavePortalSettings({
                ...portalSettings,
                identity: newIdentity
              });
            }}
          />
        )}

        {/* TAB 6: REDES SOCIAIS */}
        {activeTab === 'redes' && (
          <SocialMediaManager
            socialNetworks={portalSettings.socialNetworks}
            onSaveSocialNetworks={(newSocials) => {
              onSavePortalSettings({
                ...portalSettings,
                socialNetworks: newSocials
              });
            }}
          />
        )}

        {/* TAB 7: CENTRAL DE PUBLICIDADE & ADSENSE */}
        {activeTab === 'publicidade' && (
          <AdsManager
            adsenseConfig={portalSettings.adsense}
            adSlots={portalSettings.adSlots}
            onSaveAds={(newAdsense, newSlots) => {
              onSavePortalSettings({
                ...portalSettings,
                adsense: newAdsense,
                adSlots: newSlots
              });
            }}
          />
        )}

        {/* TAB 8: NOTIFICAÇÕES WEB PUSH (FCM) */}
        {activeTab === 'push' && (
          <PushNotificationManager
            webPushConfig={portalSettings.webPush || DEFAULT_WEBPUSH_CONFIG}
            onUpdateWebPushConfig={(newWebPush) => {
              onSavePortalSettings({
                ...portalSettings,
                webPush: newWebPush
              });
            }}
            onShowToast={(msg) => {
              setSyncMessage(msg);
              setTimeout(() => setSyncMessage(null), 4000);
            }}
          />
        )}

        {/* TAB 10: GESTÃO DE EQUIPE & USUÁRIOS */}
        {activeTab === 'usuarios' && (
          <div className="bg-white rounded-xl border border-[#D9DEE7] shadow-xs p-6">
            <UsersPage />
          </div>
        )}

        {/* TAB 11: PERMISSÕES & POLÍTICAS RBAC */}
        {activeTab === 'permissoes' && (
          <div className="bg-white rounded-xl border border-[#D9DEE7] shadow-xs p-6">
            <PermissionsPage />
          </div>
        )}

      </div>
    </div>
  );
};
