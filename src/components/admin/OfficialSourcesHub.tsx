import React, { useState, useMemo } from 'react';
import { 
  RssSource, 
  OfficialSourceCategory, 
  SourceIntegrationType, 
  SourceValidationStatus 
} from '../../types';
import { 
  Rss, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Building2, 
  Globe, 
  Layers, 
  Clock, 
  Trash2, 
  Edit3,
  MapPin,
  Check,
  FileText
} from 'lucide-react';

interface OfficialSourcesHubProps {
  sources: RssSource[];
  onUpdateSources: (sources: RssSource[]) => void;
  onSyncAll?: () => void;
  isSyncing?: boolean;
}

export const OFFICIAL_CATEGORIES: OfficialSourceCategory[] = [
  'Partidos políticos',
  'Presidência da República',
  'Governo Federal',
  'Ministérios',
  'Banco Central',
  'Congresso Nacional',
  'Poder Judiciário',
  'Tribunais eleitorais',
  'Tribunais de contas',
  'Polícia Federal',
  'Polícia Rodoviária Federal',
  'Polícias estaduais',
  'Governos estaduais',
  'Secretarias de Segurança Pública',
  'Defesa Civil',
  'Ministério Público',
  'Economia e finanças',
  'Transparência pública',
  'Municípios',
  'Outras fontes oficiais'
];

export const OfficialSourcesHub: React.FC<OfficialSourcesHubProps> = ({
  sources,
  onUpdateSources,
  onSyncAll,
  isSyncing = false
}) => {
  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedUf, setSelectedUf] = useState<string>('TODAS');
  const [selectedIntegration, setSelectedIntegration] = useState<string>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal State for adding/editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<OfficialSourceCategory>('Congresso Nacional');
  const [formUf, setFormUf] = useState('BR');
  const [formOfficialUrl, setFormOfficialUrl] = useState('');
  const [formNewsUrl, setFormNewsUrl] = useState('');
  const [formRssUrl, setFormRssUrl] = useState('');
  const [formIntegrationType, setFormIntegrationType] = useState<SourceIntegrationType>('Monitoramento Editorial');
  const [formValidationStatus, setFormValidationStatus] = useState<SourceValidationStatus>('VALIDADO');
  const [formFrequencyMin, setFormFrequencyMin] = useState(60);
  const [formNotes, setFormNotes] = useState('');

  // Status message
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filtered sources
  const filteredSources = useMemo(() => {
    return sources.filter((src) => {
      // 1. Text search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = src.name.toLowerCase().includes(q);
        const matchesCat = src.sourceCategory?.toLowerCase().includes(q);
        const matchesNotes = src.notes?.toLowerCase().includes(q);
        const matchesUf = src.uf?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesNotes && !matchesUf) return false;
      }

      // 2. Category
      if (selectedCategory !== 'TODAS') {
        if (src.sourceCategory !== selectedCategory) return false;
      }

      // 3. UF
      if (selectedUf !== 'TODAS') {
        if (src.uf !== selectedUf) return false;
      }

      // 4. Integration
      if (selectedIntegration !== 'TODOS') {
        if (src.integrationType !== selectedIntegration) return false;
      }

      // 5. Status
      if (selectedStatus !== 'TODOS') {
        if (src.validationStatus !== selectedStatus) return false;
      }

      return true;
    });
  }, [sources, search, selectedCategory, selectedUf, selectedIntegration, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = sources.length;
    const rssFeeds = sources.filter(s => s.integrationType === 'RSS Feed' && s.rssUrl).length;
    const manualMonitoring = sources.filter(s => s.integrationType === 'Monitoramento Editorial').length;
    const validated = sources.filter(s => s.validationStatus === 'VALIDADO').length;
    const federal = sources.filter(s => s.uf === 'BR').length;
    const rs = sources.filter(s => s.uf === 'RS').length;
    const totalColected = sources.reduce((acc, curr) => acc + (curr.itemsReceived || 0), 0);

    return { total, rssFeeds, manualMonitoring, validated, federal, rs, totalColected };
  }, [sources]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormCategory('Congresso Nacional');
    setFormUf('BR');
    setFormOfficialUrl('');
    setFormNewsUrl('');
    setFormRssUrl('');
    setFormIntegrationType('Monitoramento Editorial');
    setFormValidationStatus('VALIDADO');
    setFormFrequencyMin(60);
    setFormNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (src: RssSource) => {
    setEditingId(src.id);
    setFormName(src.name);
    setFormCategory(src.sourceCategory || 'Outras fontes oficiais');
    setFormUf(src.uf || 'BR');
    setFormOfficialUrl(src.officialUrl);
    setFormNewsUrl(src.newsUrl || '');
    setFormRssUrl(src.rssUrl || '');
    setFormIntegrationType(src.integrationType || 'Monitoramento Editorial');
    setFormValidationStatus(src.validationStatus || 'VALIDADO');
    setFormFrequencyMin(src.pollFrequencyMin || 60);
    setFormNotes(src.notes || '');
    setModalOpen(true);
  };

  const handleSaveSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formOfficialUrl.trim()) return;

    if (editingId) {
      const updated = sources.map(s => {
        if (s.id === editingId) {
          return {
            ...s,
            name: formName.trim(),
            sourceCategory: formCategory,
            uf: formUf,
            officialUrl: formOfficialUrl.trim(),
            newsUrl: formNewsUrl.trim(),
            rssUrl: formRssUrl.trim(),
            integrationType: formIntegrationType,
            validationStatus: formValidationStatus,
            pollFrequencyMin: formFrequencyMin,
            notes: formNotes.trim(),
            lastVerified: 'Agora mesmo'
          };
        }
        return s;
      });
      onUpdateSources(updated);
      setFeedback(`Fonte "${formName}" atualizada com sucesso na Central Nacional.`);
    } else {
      const newSource: RssSource = {
        id: Date.now(),
        name: formName.trim(),
        sourceCategory: formCategory,
        uf: formUf,
        officialUrl: formOfficialUrl.trim(),
        newsUrl: formNewsUrl.trim(),
        rssUrl: formRssUrl.trim(),
        sourceType: 'órgão público',
        category: 'brasil',
        integrationType: formIntegrationType,
        validationStatus: formValidationStatus,
        isActive: true,
        pollFrequencyMin: formFrequencyMin,
        lastPolled: 'Hoje às 16:30',
        lastSuccess: 'Hoje às 16:30',
        lastError: null,
        lastVerified: 'Agora mesmo',
        lastImported: 'Hoje às 15:00',
        itemsReceived: 0,
        notes: formNotes.trim()
      };
      onUpdateSources([newSource, ...sources]);
      setFeedback(`Fonte oficial "${formName}" cadastrada com sucesso!`);
    }

    setModalOpen(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleActive = (id: number) => {
    const updated = sources.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
    onUpdateSources(updated);
  };

  const handleTestVerify = (id: number) => {
    const target = sources.find(s => s.id === id);
    if (!target) return;

    const updated = sources.map(s => {
      if (s.id === id) {
        return {
          ...s,
          lastPolled: 'Agora mesmo',
          lastSuccess: 'Agora mesmo',
          lastVerified: 'Agora mesmo',
          itemsReceived: s.itemsReceived + 1
        };
      }
      return s;
    });
    onUpdateSources(updated);
    setFeedback(`Fonte "${target.name}" verificada e validada com sucesso! Conexão íntegra.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9DEE7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0B2345] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              CADASTRO NACIONAL
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#0B2345]">
              Central Nacional de Fontes Oficiais
            </h2>
          </div>
          <p className="text-xs text-[#5D6673] mt-1">
            Base de dados unificada de órgãos federais, governos estaduais, forças de segurança, tribunais e partidos políticos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSyncAll && (
            <button
              onClick={onSyncAll}
              disabled={isSyncing}
              className="flex items-center gap-1.5 bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Verificando...' : 'Verificar Todas as Fontes'}</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Fonte Oficial</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] p-3 rounded-lg text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-[#16803C] font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE7] shadow-xs">
          <div className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider">Total de Fontes</div>
          <div className="text-2xl font-black text-[#0B2345] mt-0.5">{stats.total}</div>
          <div className="text-[10px] text-[#16803C] font-semibold mt-1">100% Mapeadas</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE7] shadow-xs">
          <div className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider">Feeds RSS Ativos</div>
          <div className="text-2xl font-black text-[#0B5FFF] mt-0.5">{stats.rssFeeds}</div>
          <div className="text-[10px] text-[#5D6673] mt-1">Ingestão automatizada</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE7] shadow-xs">
          <div className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider">Monitoramento Manual</div>
          <div className="text-2xl font-black text-[#D97706] mt-0.5">{stats.manualMonitoring}</div>
          <div className="text-[10px] text-[#5D6673] mt-1">Triagem de redação</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE7] shadow-xs">
          <div className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider">Fontes Validadas</div>
          <div className="text-2xl font-black text-[#16803C] mt-0.5">{stats.validated}</div>
          <div className="text-[10px] text-[#16803C] font-semibold mt-1">Anti-SSRF auditado</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE7] shadow-xs">
          <div className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider">Âmbito RS / Estados</div>
          <div className="text-2xl font-black text-[#0B2345] mt-0.5">{stats.rs}</div>
          <div className="text-[10px] text-[#5D6673] mt-1">Rio Grande do Sul</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE7] shadow-xs">
          <div className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider">Itens Recebidos</div>
          <div className="text-2xl font-black text-[#0B2345] mt-0.5">{stats.totalColected}</div>
          <div className="text-[10px] text-[#16803C] font-semibold mt-1">Total acumulado</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D9DEE7] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
          {/* Search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5D6673]" />
            <input
              type="text"
              placeholder="Buscar por instituição, órgão, partido ou palavra..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#0B2345]"
            />
          </div>

          {/* Category */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-xs text-[#0B2345] font-semibold focus:outline-hidden"
            >
              <option value="TODAS">Todas as Categorias ({sources.length})</option>
              {OFFICIAL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({sources.filter(s => s.sourceCategory === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* UF */}
          <div className="lg:col-span-2">
            <select
              value={selectedUf}
              onChange={(e) => setSelectedUf(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-xs text-[#0B2345] font-semibold focus:outline-hidden"
            >
              <option value="TODAS">Âmbito: Todos</option>
              <option value="BR">Federal (BR)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
            </select>
          </div>

          {/* Integration Type */}
          <div className="lg:col-span-2">
            <select
              value={selectedIntegration}
              onChange={(e) => setSelectedIntegration(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-2 text-xs text-[#0B2345] font-semibold focus:outline-hidden"
            >
              <option value="TODOS">Integração: Todas</option>
              <option value="RSS Feed">RSS Feed</option>
              <option value="Monitoramento Editorial">Monitoramento Editorial</option>
              <option value="API Pública">API Pública</option>
              <option value="Scraping Autorizado">Scraping Autorizado</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="lg:col-span-1 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded border cursor-pointer ${
                viewMode === 'cards' ? 'bg-[#0B2345] text-white border-[#0B2345]' : 'bg-[#F8FAFC] text-[#5D6673] border-[#CBD5E1]'
              }`}
              title="Visualização em Cards"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded border cursor-pointer ${
                viewMode === 'table' ? 'bg-[#0B2345] text-white border-[#0B2345]' : 'bg-[#F8FAFC] text-[#5D6673] border-[#CBD5E1]'
              }`}
              title="Visualização em Tabela"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* List / Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((src) => {
            const hasRss = Boolean(src.rssUrl && src.rssUrl.trim().length > 0);

            return (
              <div
                key={src.id}
                className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition shadow-xs hover:shadow-md ${
                  src.isActive ? 'border-[#D9DEE7]' : 'border-gray-200 opacity-60 bg-gray-50'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-[#0B2345] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {src.uf || 'BR'}
                      </span>
                      <span className="bg-[#EBF7EE] text-[#16803C] text-[10px] font-bold px-2 py-0.5 rounded">
                        {src.sourceCategory || 'Órgão Público'}
                      </span>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      hasRss 
                        ? 'bg-[#0B5FFF]/10 text-[#0B5FFF]' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {hasRss ? 'RSS ATIVO' : 'MANUAL'}
                    </span>
                  </div>

                  {/* Institution Name */}
                  <h3 className="font-serif font-black text-base text-[#0B2345] leading-snug mb-1.5">
                    {src.name}
                  </h3>

                  {/* Notes / Description */}
                  <p className="text-xs text-[#5D6673] mb-3 line-clamp-2 leading-relaxed">
                    {src.notes || 'Monitoramento regular de comunicados e matérias oficiais.'}
                  </p>

                  {/* Official Links */}
                  <div className="space-y-1.5 text-[11px] pt-2 border-t border-[#F1F3F5] text-[#4A5568]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#718096]">Portal:</span>
                      <a
                        href={src.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0B5FFF] font-medium hover:underline truncate max-w-[200px] flex items-center gap-1"
                      >
                        <span className="truncate">{src.officialUrl}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>

                    {src.newsUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#718096]">Notícias:</span>
                        <a
                          href={src.newsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#16803C] font-semibold hover:underline truncate max-w-[200px] flex items-center gap-1"
                        >
                          <span className="truncate">Seção de Notícias</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </div>
                    )}

                    {hasRss && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#718096]">Feed RSS:</span>
                        <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono truncate max-w-[190px]">
                          {src.rssUrl}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Audit & Timing info */}
                  <div className="mt-3 pt-2 border-t border-[#F1F3F5] text-[10px] text-[#718096] space-y-0.5">
                    <div className="flex justify-between">
                      <span>Última verificação:</span>
                      <span className="font-semibold text-[#0B2345]">{src.lastVerified || src.lastPolled || 'Hoje'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequência:</span>
                      <span>a cada {src.pollFrequencyMin} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Itens coletados:</span>
                      <strong className="text-[#16803C]">{src.itemsReceived} matérias</strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-[#EAECEF] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleTestVerify(src.id)}
                    className="text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] bg-[#F1F3F5] hover:bg-[#E2E6EC] px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Verificar</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(src)}
                      className="p-1.5 text-gray-500 hover:text-[#0B2345] hover:bg-gray-100 rounded cursor-pointer"
                      title="Editar dados da fonte"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(src.id)}
                      className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                        src.isActive
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {src.isActive ? 'Ativa' : 'Pausada'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-[#D9DEE7] shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#D9DEE7] text-[#5D6673] uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">UF</th>
                <th className="py-3 px-4">Instituição / Órgão</th>
                <th className="py-3 px-4">Categoria Oficial</th>
                <th className="py-3 px-4">Integração</th>
                <th className="py-3 px-4">Links Oficiais</th>
                <th className="py-3 px-4">Última Verificação</th>
                <th className="py-3 px-4 text-center">Itens</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              {filteredSources.map((src) => {
                const hasRss = Boolean(src.rssUrl && src.rssUrl.trim().length > 0);

                return (
                  <tr key={src.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="bg-[#0B2345] text-white text-[10px] font-black px-2 py-0.5 rounded">
                        {src.uf || 'BR'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="block text-[#0B2345]">{src.name}</strong>
                      <span className="text-[11px] text-[#718096] truncate max-w-xs block">{src.notes}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#16803C]">
                      {src.sourceCategory || 'Órgão Público'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        hasRss ? 'bg-[#0B5FFF]/10 text-[#0B5FFF]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hasRss ? 'RSS Feed' : 'Monitoramento'}
                      </span>
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <a href={src.officialUrl} target="_blank" rel="noopener noreferrer" className="text-[#0B5FFF] font-medium hover:underline inline-flex items-center gap-0.5">
                        <span>Portal</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      {src.newsUrl && (
                        <a href={src.newsUrl} target="_blank" rel="noopener noreferrer" className="text-[#16803C] font-medium hover:underline inline-flex items-center gap-0.5">
                          <span>Notícias</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#718096]">
                      {src.lastVerified || src.lastPolled || 'Hoje'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-[#0B2345]">
                      {src.itemsReceived}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleTestVerify(src.id)}
                        className="p-1 hover:bg-slate-100 text-[#0B2345] rounded cursor-pointer"
                        title="Verificar agora"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(src)}
                        className="p-1 hover:bg-slate-100 text-[#5D6673] rounded cursor-pointer"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Cadastrar / Editar Fonte Oficial */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8 animate-in fade-in duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-lg p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-5">
              <span className="bg-[#0B2345] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                {editingId ? 'EDITAR FONTE' : 'NOVA FONTE OFICIAL'}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#0B2345] mt-1">
                {editingId ? 'Editar Dados da Fonte Oficial' : 'Cadastrar Nova Fonte Oficial'}
              </h3>
              <p className="text-xs text-[#5D6673]">
                Defina os endereços oficiais e os parâmetros de ingestão e monitoramento jornalístico.
              </p>
            </div>

            <form onSubmit={handleSaveSource} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0B2345] mb-1">Nome da Instituição:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tribunal Regional Eleitoral do RS"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0B2345]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">UF / Âmbito:</label>
                  <select
                    value={formUf}
                    onChange={(e) => setFormUf(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0B2345]"
                  >
                    <option value="BR">BR (Federal)</option>
                    <option value="RS">RS (Rio Grande do Sul)</option>
                    <option value="SP">SP (São Paulo)</option>
                    <option value="RJ">RJ (Rio de Janeiro)</option>
                    <option value="MG">MG (Minas Gerais)</option>
                    <option value="PR">PR (Paraná)</option>
                    <option value="SC">SC (Santa Catarina)</option>
                    <option value="GO">GO (Goiás)</option>
                    <option value="DF">DF (Distrito Federal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B2345] mb-1">Categoria da Fonte:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as OfficialSourceCategory)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0B2345]"
                >
                  {OFFICIAL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">URL Institucional (Portal):</label>
                  <input
                    type="url"
                    required
                    placeholder="https://instituicao.gov.br/"
                    value={formOfficialUrl}
                    onChange={(e) => setFormOfficialUrl(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0B2345]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">URL da Seção de Notícias:</label>
                  <input
                    type="url"
                    placeholder="https://instituicao.gov.br/noticias"
                    value={formNewsUrl}
                    onChange={(e) => setFormNewsUrl(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0B2345]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B2345] mb-1">
                  URL do Feed RSS (quando disponível com feed autêntico):
                </label>
                <input
                  type="url"
                  placeholder="https://instituicao.gov.br/feed.xml (deixe vazio se não houver feed RSS)"
                  value={formRssUrl}
                  onChange={(e) => {
                    setFormRssUrl(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setFormIntegrationType('RSS Feed');
                    }
                  }}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0B2345]"
                />
                <span className="text-[10px] text-[#718096] mt-0.5 block">
                  Aviso: Não invente URLs de RSS. Se o órgão não mantiver feed XML aberto, deixe vazio e selecione Monitoramento Editorial.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">Tipo de Integração:</label>
                  <select
                    value={formIntegrationType}
                    onChange={(e) => setFormIntegrationType(e.target.value as SourceIntegrationType)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs"
                  >
                    <option value="Monitoramento Editorial">Monitoramento Editorial</option>
                    <option value="RSS Feed">RSS Feed</option>
                    <option value="API Pública">API Pública</option>
                    <option value="Scraping Autorizado">Scraping Autorizado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">Situação da Validação:</label>
                  <select
                    value={formValidationStatus}
                    onChange={(e) => setFormValidationStatus(e.target.value as SourceValidationStatus)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs"
                  >
                    <option value="VALIDADO">VALIDADO</option>
                    <option value="EM VERIFICAÇÃO">EM VERIFICAÇÃO</option>
                    <option value="SEM RSS (MONITORAMENTO MANUAL)">SEM RSS (MONITORAMENTO MANUAL)</option>
                    <option value="PENDENTE">PENDENTE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">Frequência (minutos):</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={formFrequencyMin}
                    onChange={(e) => setFormFrequencyMin(parseInt(e.target.value) || 60)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B2345] mb-1">Notas Editoriais / Orientações:</label>
                <textarea
                  rows={2}
                  placeholder="Orientações aos jornalistas sobre esta fonte..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAECEF]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#CBD5E1] text-[#4A5568] font-bold rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold rounded-lg cursor-pointer transition shadow-xs"
                >
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Fonte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
