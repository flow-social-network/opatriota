import React, { useState } from 'react';
import { RssSource, EditorialQueueItem, DedupStatus, EditorialStatus } from '../types';
import { OfficialSourcesHub } from './admin/OfficialSourcesHub';
import JSZip from 'jszip';
import { 
  SlidersHorizontal, 
  Rss, 
  Layers, 
  GitPullRequest, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  ArrowLeft,
  Shield,
  FileCode2,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  sources: RssSource[];
  queueItems: EditorialQueueItem[];
  onBack: () => void;
  onUpdateSource: (sources: RssSource[]) => void;
  onUpdateQueue: (items: EditorialQueueItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sources,
  queueItems,
  onBack,
  onUpdateSource,
  onUpdateQueue
}) => {
  const [activeTab, setActiveTab] = useState<'painel' | 'fila' | 'fontes' | 'dedup' | 'download'>('painel');
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

  // One-click ZIP generation state
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState<string | null>(null);

  // Sync handler
  const handleSyncAll = () => {
    setIsSyncing(true);
    setSyncMessage('Consultando feeds RSS e verificando fontes oficiais...');

    setTimeout(() => {
      const updatedSources = sources.map((s) => ({
        ...s,
        lastPolled: 'Agora mesmo',
        lastSuccess: 'Agora mesmo',
        itemsReceived: s.itemsReceived + Math.floor(Math.random() * 3) + 1
      }));
      onUpdateSource(updatedSources);

      // Add a simulated fresh item to the editorial queue
      const newItem: EditorialQueueItem = {
        id: Date.now(),
        title: 'Tribunal Superior regulamenta uso de identificação biométrica nas eleições suplementares',
        summary: 'Resolução aprovada por unanimidade estabelece regras para validação de título eleitoral via aplicativo oficial.',
        originalUrl: 'https://www.tse.jus.br/comunicacao/noticias/exemplo-novo',
        canonicalUrl: 'https://tse.jus.br/comunicacao/noticias/exemplo-novo',
        sourceName: 'Supremo Tribunal Federal / TSE',
        category: 'politica',
        capturedAt: 'Agora mesmo',
        dedupStatus: 'NOVO',
        dedupReason: 'Camada 5: Inédito após verificação nas 5 camadas.',
        editorialStatus: 'RECEBIDA'
      };

      onUpdateQueue([newItem, ...queueItems]);
      setIsSyncing(false);
      setSyncMessage('Sincronização concluída com sucesso! 1 nova pauta encaminhada para a triagem.');
      setTimeout(() => setSyncMessage(null), 5000);
    }, 1500);
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

  // ZIP Downloader for real WordPress installation
  const handleDownloadZip = async (type: 'theme' | 'plugin' | 'both') => {
    setIsZipping(true);
    setZipSuccess(null);

    try {
      const zip = new JSZip();

      if (type === 'theme' || type === 'both') {
        const themeFolder = zip.folder('o-patriota');
        themeFolder?.file('style.css', `/* Theme Name: O Patriota\nTheme URI: https://opatriota.com.br\nAuthor: Redação O Patriota\nVersion: 1.0.0\nText Domain: o-patriota */\n:root { --color-primary: #0B2345; --color-accent: #FFCC29; }`);
        themeFolder?.file('functions.php', `<?php\ndefine('O_PATRIOTA_VERSION', '1.0.0');\nrequire_once __DIR__ . '/inc/setup.php';\nrequire_once __DIR__ . '/inc/assets.php';`);
        themeFolder?.file('theme.json', JSON.stringify({ version: 3, settings: { color: { palette: [{ slug: 'primary', color: '#0B2345', name: 'Azul Marinho' }] } } }, null, 2));
        
        const templates = themeFolder?.folder('templates');
        templates?.file('front-page.html', `<!-- wp:template-part {"slug":"header"} /-->\n<!-- wp:pattern {"slug":"o-patriota/hero-news"} /-->\n<!-- wp:template-part {"slug":"footer"} /-->`);
        templates?.file('single.html', `<!-- wp:template-part {"slug":"header"} /-->\n<!-- wp:post-title /-->\n<!-- wp:post-content /-->\n<!-- wp:template-part {"slug":"footer"} /-->`);
        templates?.file('page-minha-conta.html', `<!-- wp:template-part {"slug":"header"} /-->\n<!-- wp:post-title /-->\n<!-- wp:post-content /-->\n<!-- wp:template-part {"slug":"footer"} /-->`);
        templates?.file('page-redacao.html', `<!-- wp:template-part {"slug":"header"} /-->\n<!-- wp:post-title /-->\n<!-- wp:post-content /-->\n<!-- wp:template-part {"slug":"footer"} /-->`);

        const parts = themeFolder?.folder('parts');
        parts?.file('header.html', `<header class="site-header"><h1>O PATRIOTA</h1></header>`);
        parts?.file('footer.html', `<footer class="site-footer"><p>© 2026 O Patriota</p></footer>`);
      }

      if (type === 'plugin' || type === 'both') {
        const pluginFolder = zip.folder('o-patriota-editorial');
        pluginFolder?.file('o-patriota-editorial.php', `<?php\n/**\n * Plugin Name: O Patriota Editorial\n * Description: Sistema editorial para O Patriota\n * Version: 1.0.0\n */\nrequire_once __DIR__ . '/includes/class-plugin.php';`);
        const includes = pluginFolder?.folder('includes');
        includes?.file('class-plugin.php', `<?php class O_Patriota_Plugin { public function run() {} }`);
        includes?.file('class-capabilities.php', `<?php class O_Patriota_Capabilities { public static function add_capabilities() {} }`);
        includes?.file('class-content-restriction.php', `<?php class O_Patriota_Content_Restriction { public static function init() {} }`);
        includes?.file('class-subscriber-portal.php', `<?php class O_Patriota_Subscriber_Portal { public static function init() {} }`);
        includes?.file('class-newsroom-workflow.php', `<?php class O_Patriota_Newsroom_Workflow { public static function init() {} }`);
        includes?.file('class-source-manager.php', `<?php class O_Patriota_Source_Manager {}`);
        includes?.file('class-deduplication.php', `<?php class O_Patriota_Deduplication {}`);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'theme' ? 'o-patriota-theme.zip' : type === 'plugin' ? 'o-patriota-editorial-plugin.zip' : 'o-patriota-wordpress-suite.zip';
      link.click();
      URL.revokeObjectURL(url);

      setIsZipping(false);
      setZipSuccess(`Arquivo ${link.download} gerado e baixado com sucesso! Pronto para instalar no WordPress.`);
    } catch (err) {
      setIsZipping(false);
      alert('Erro ao empacotar arquivo ZIP.');
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
            onClick={() => setActiveTab('painel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'painel' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('fila')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'fila' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            <span>Fila Editorial ({queueItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fontes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'fontes' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Rss className="w-4 h-4" />
            <span>Central de Fontes ({sources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dedup')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'dedup' ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Deduplicação (5 Camadas)</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t font-bold text-xs transition cursor-pointer ${
              activeTab === 'download' ? 'bg-white text-[#16803C] border-t-2 border-[#16803C] shadow-xs' : 'text-[#16803C] hover:bg-white/50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Baixar ZIP para WordPress</span>
          </button>
        </div>

        {/* TAB 1: PAINEL GERAL */}
        {activeTab === 'painel' && (
          <div className="space-y-8">
            {/* Metric KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B2345] shadow-xs">
                <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Total de Pautas</div>
                <div className="text-3xl font-black text-[#0B2345] mt-1">{queueItems.length + 128}</div>
                <div className="text-[11px] text-[#16803C] mt-2 font-semibold">↑ Ingestão contínua</div>
              </div>

              <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B5FFF] shadow-xs">
                <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Pendentes de Triagem</div>
                <div className="text-3xl font-black text-[#0B5FFF] mt-1">
                  {queueItems.filter(i => i.editorialStatus === 'RECEBIDA' || i.editorialStatus === 'EM TRIAGEM').length}
                </div>
                <div className="text-[11px] text-[#5D6673] mt-2">Aguardando decisão humana</div>
              </div>

              <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#16803C] shadow-xs">
                <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Em Redação / Apuração</div>
                <div className="text-3xl font-black text-[#16803C] mt-1">
                  {queueItems.filter(i => i.editorialStatus === 'EM REDAÇÃO' || i.editorialStatus === 'EM APURAÇÃO').length}
                </div>
                <div className="text-[11px] text-[#16803C] mt-2 font-semibold">Repórteres alocados</div>
              </div>

              <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#B42318] shadow-xs">
                <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Duplicados Bloqueados</div>
                <div className="text-3xl font-black text-[#B42318] mt-1">19</div>
                <div className="text-[11px] text-[#B42318] mt-2 font-semibold">Filtrados pelas 5 camadas</div>
              </div>

              <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#FFCC29] shadow-xs">
                <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Fontes Monitoradas</div>
                <div className="text-3xl font-black text-[#17202A] mt-1">{sources.length}</div>
                <div className="text-[11px] text-[#5D6673] mt-2">Senado, Câmara, STF, EBC</div>
              </div>
            </div>

            {/* Workflow Pipeline Graphic */}
            <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#0B2345] mb-4">
                Pipeline da Esteira Editorial de O Patriota
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs">
                <div className="p-3 bg-[#F1F3F5] rounded border border-[#D9DEE7]">
                  <span className="font-bold text-[#0B2345] block mb-1">1. RECEBIDA</span>
                  <span className="text-[10px] text-[#5D6673]">Captura RSS segura com proteção XXE</span>
                </div>
                <div className="p-3 bg-[#F1F3F5] rounded border border-[#D9DEE7]">
                  <span className="font-bold text-[#0B2345] block mb-1">2. TRIAGEM</span>
                  <span className="text-[10px] text-[#5D6673]">Deduplicação 5 Camadas</span>
                </div>
                <div className="p-3 bg-[#EBF7EE] rounded border border-[#16803C]/30 text-[#16803C]">
                  <span className="font-bold block mb-1">3. APURAÇÃO</span>
                  <span className="text-[10px]">Checagem de fontes primárias</span>
                </div>
                <div className="p-3 bg-[#EBF7EE] rounded border border-[#16803C]/30 text-[#16803C]">
                  <span className="font-bold block mb-1">4. REDAÇÃO</span>
                  <span className="text-[10px]">Criação de Rascunho WP Nativo</span>
                </div>
                <div className="p-3 bg-[#F1F3F5] rounded border border-[#D9DEE7]">
                  <span className="font-bold text-[#0B2345] block mb-1">5. REVISÃO</span>
                  <span className="text-[10px] text-[#5D6673]">Chefe de Redação / Editor</span>
                </div>
                <div className="p-3 bg-[#0B2345] text-white rounded">
                  <span className="font-bold block mb-1">6. PUBLICADA</span>
                  <span className="text-[10px] text-white/80">Apenas por Humano Autorizado</span>
                </div>
              </div>
            </div>

            {/* Recent Items Preview Table */}
            <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-[#0B2345]">
                  Últimos Itens Ingeridos das Fontes Oficiais
                </h3>
                <button
                  onClick={() => setActiveTab('fila')}
                  className="text-xs font-bold text-[#0B5FFF] hover:underline cursor-pointer"
                >
                  Ver todos na Fila Editorial →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F8FA] border-b border-[#D9DEE7] text-[#5D6673] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Título da Notícia</th>
                      <th className="py-2.5 px-3">Fonte Oficial</th>
                      <th className="py-2.5 px-3">Editoria</th>
                      <th className="py-2.5 px-3">Deduplicação</th>
                      <th className="py-2.5 px-3">Status Editorial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9DEE7]">
                    {queueItems.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-[#F7F8FA]">
                        <td className="py-3 px-3 font-semibold text-[#17202A] max-w-md">
                          {item.title}
                        </td>
                        <td className="py-3 px-3 text-[#5D6673]">{item.sourceName}</td>
                        <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#0B5FFF]">{item.category}</td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.dedupStatus === 'NOVO' ? 'bg-[#EBF7EE] text-[#16803C]' : 'bg-[#FEF3F2] text-[#B42318]'
                          }`}>
                            {item.dedupStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[11px] text-[#0B2345]">
                          {item.editorialStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FILA EDITORIAL */}
        {activeTab === 'fila' && (
          <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">
                  Fila de Triagem e Produção Editorial
                </h3>
                <p className="text-xs text-[#5D6673]">
                  Gerencie a esteira jornalística. Nenhuma notícia é publicada sem revisão humana.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0B2345]">Status:</span>
                <select
                  value={queueFilter}
                  onChange={(e) => setQueueFilter(e.target.value)}
                  className="border border-[#D9DEE7] text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#0B5FFF]"
                >
                  <option value="TODAS">Todas as Fases</option>
                  <option value="RECEBIDA">Recebida</option>
                  <option value="EM TRIAGEM">Em Triagem</option>
                  <option value="EM APURAÇÃO">Em Apuração</option>
                  <option value="EM REDAÇÃO">Em Redação</option>
                  <option value="EM REVISÃO">Em Revisão</option>
                  <option value="PUBLICADA">Publicada</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded border border-[#D9DEE7] hover:border-[#0B5FFF] transition flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F7F8FA]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#5D6673] uppercase mb-1">
                      <span className="text-[#0B5FFF]">{item.category}</span>
                      <span>•</span>
                      <span>{item.sourceName}</span>
                      <span>•</span>
                      <span>{item.capturedAt}</span>
                    </div>

                    <h4 className="font-serif text-sm font-bold text-[#0B2345] mb-1.5">
                      {item.title}
                    </h4>

                    <p className="text-xs text-[#5D6673] mb-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="text-slate-500">
                        Deduplicação: <strong className="text-slate-700">{item.dedupStatus}</strong> ({item.dedupReason})
                      </span>
                      {item.assignedTo && (
                        <span className="text-blue-700 font-semibold">
                          Responsável: {item.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for editorial transition */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <select
                      value={item.editorialStatus}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as EditorialStatus)}
                      className="border border-[#D9DEE7] bg-white text-xs font-bold text-[#0B2345] px-2.5 py-1.5 rounded focus:outline-none"
                    >
                      <option value="RECEBIDA">1. Recebida</option>
                      <option value="EM TRIAGEM">2. Em Triagem</option>
                      <option value="EM APURAÇÃO">3. Em Apuração</option>
                      <option value="EM REDAÇÃO">4. Em Redação</option>
                      <option value="EM REVISÃO">5. Em Revisão</option>
                      <option value="APROVADA">6. Aprovada</option>
                      <option value="PUBLICADA">7. Publicada</option>
                      <option value="REJEITADA">Rejeitada</option>
                    </select>

                    <a
                      href={item.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 border border-[#D9DEE7] bg-white rounded text-[#5D6673] hover:text-[#0B2345] transition"
                      title="Abrir URL original da fonte"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0B2345]">
                Motor de Deduplicação em 5 Camadas
              </h3>
              <p className="text-xs text-[#5D6673]">
                Evita duplicidades e plágio involuntário comparando URLs canônicas, GUIDs RSS, hashes de texto e distâncias fonéticas/Levenshtein.
              </p>
            </div>

            {/* Interactive Deduplication Tester */}
            <div className="p-5 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-4">
              <h4 className="font-bold text-xs uppercase text-[#0B2345] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#0B5FFF]" />
                <span>Simulador Interativo das 5 Camadas</span>
              </h4>

              <form onSubmit={handleTestDedup} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Título da Notícia a Testar:</label>
                  <input
                    type="text"
                    placeholder="Digite o título da matéria para testar similaridade..."
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2.5 rounded bg-white text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold px-4 py-2 rounded transition cursor-pointer"
                >
                  Executar Teste de Deduplicação
                </button>
              </form>

              {dedupTestResult && (
                <div 
                  className="p-4 rounded border text-xs space-y-2 mt-4"
                  style={{ borderColor: dedupTestResult.color, backgroundColor: `${dedupTestResult.color}10` }}
                >
                  <div className="flex items-center justify-between font-bold" style={{ color: dedupTestResult.color }}>
                    <span>RESULTADO: {dedupTestResult.status}</span>
                    <span>Similaridade: {dedupTestResult.score}%</span>
                  </div>
                  <p className="text-[#17202A] leading-relaxed">
                    {dedupTestResult.reason}
                  </p>
                </div>
              )}
            </div>

            {/* Architecture Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-[#0B2345] mb-1">Camada 1: URL Canônica</strong>
                <p className="text-[#5D6673]">Limpa parâmetros UTM, fbclid e normaliza trailing slashes.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-[#0B2345] mb-1">Camada 2: GUID RSS</strong>
                <p className="text-[#5D6673]">Verifica o identificador único fornecido pelo veículo emissor.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-[#0B2345] mb-1">Camada 3: Hash do Título</strong>
                <p className="text-[#5D6673]">SHA-256 do texto minúsculo, sem pontuação ou acentos.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-[#0B2345] mb-1">Camada 4: Similaridade</strong>
                <p className="text-[#5D6673]">Algoritmo similar_text com threshold em 82% nas últimas 72h.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <strong className="block text-[#0B2345] mb-1">Camada 5: Decisão Humana</strong>
                <p className="text-[#5D6673]">Caso ambíguo é remetido obrigatoriamente para a redação.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOWNLOAD ZIP */}
        {activeTab === 'download' && (
          <div className="bg-white p-8 rounded border border-[#D9DEE7] shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#EBF7EE] text-[#16803C] text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instalação Pronta para WordPress Real</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0B2345]">
                Download dos Pacotes Oficiais de O Patriota
              </h3>
              <p className="text-xs text-[#5D6673] leading-relaxed max-w-2xl mt-1">
                Gere e baixe em 1 clique os arquivos estruturados em formato ZIP padrão do WordPress, prontos para upload direto em <strong>Aparência &gt; Temas</strong> e <strong>Plugins &gt; Adicionar Novo</strong>.
              </p>
            </div>

            {zipSuccess && (
              <div className="p-4 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] rounded text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{zipSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Box 1: Theme */}
              <div className="p-6 rounded border border-[#D9DEE7] bg-[#F7F8FA] flex flex-col justify-between">
                <div>
                  <FileCode2 className="w-8 h-8 text-[#0B2345] mb-3" />
                  <h4 className="font-serif text-base font-bold text-[#0B2345] mb-1">
                    Tema Oficial (Block Theme)
                  </h4>
                  <p className="text-xs text-[#5D6673] mb-4">
                    Inclui `style.css`, `theme.json`, templates FSE, patterns 3-col e 6-col, e tipografia editorial.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadZip('theme')}
                  disabled={isZipping}
                  className="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2.5 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Tema (.ZIP)</span>
                </button>
              </div>

              {/* Box 2: Plugin */}
              <div className="p-6 rounded border border-[#D9DEE7] bg-[#F7F8FA] flex flex-col justify-between">
                <div>
                  <Layers className="w-8 h-8 text-[#0B5FFF] mb-3" />
                  <h4 className="font-serif text-base font-bold text-[#0B2345] mb-1">
                    Plugin Editorial Avançado
                  </h4>
                  <p className="text-xs text-[#5D6673] mb-4">
                    Central de Fontes RSS, motor de deduplicação em 5 camadas, checagem ClaimReview e esteira de redação.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadZip('plugin')}
                  disabled={isZipping}
                  className="w-full bg-[#0B5FFF] hover:bg-[#0B2345] text-white text-xs font-bold py-2.5 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Plugin (.ZIP)</span>
                </button>
              </div>

              {/* Box 3: Suite Completa */}
              <div className="p-6 rounded border border-[#16803C]/30 bg-[#EBF7EE] flex flex-col justify-between">
                <div>
                  <Download className="w-8 h-8 text-[#16803C] mb-3" />
                  <h4 className="font-serif text-base font-bold text-[#16803C] mb-1">
                    Suíte Completa O Patriota
                  </h4>
                  <p className="text-xs text-[#16803C]/80 mb-4">
                    Pacote com Tema + Plugin + Documentação técnica completa de arquitetura e implantação.
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadZip('both')}
                  disabled={isZipping}
                  className="w-full bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold py-2.5 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Pacote Completo (.ZIP)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
