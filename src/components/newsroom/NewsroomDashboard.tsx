import React, { useState } from 'react';
import { 
  Article, 
  CategorySlug, 
  ContentAccessLevel, 
  EditorialStatus, 
  MediaItem, 
  RssSource, 
  UserRole, 
  UserSession,
  InstitutionalPage,
  CategoryDetail,
  SiteMenuConfig
} from '../../types';
import { api } from '../../services/apiClient';
import { PagesManager } from '../admin/PagesManager';
import { CategoriesManager } from '../admin/CategoriesManager';
import { MenusManager } from '../admin/MenusManager';
import { OfficialSourcesHub } from '../admin/OfficialSourcesHub';
import { isGloboSource } from '../../utils/editorialPolicy';
import { 
  FileText, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Image as ImageIcon, 
  BookOpen, 
  UserCheck, 
  SlidersHorizontal,
  Globe,
  Compass,
  Menu
} from 'lucide-react';
import { NewsroomOverviewTab } from './NewsroomOverviewTab';
import { NewsroomArticlesTab } from './NewsroomArticlesTab';
import { NewsroomEditorTab } from './NewsroomEditorTab';
import { NewsroomMediaTab } from './NewsroomMediaTab';
import { CorrectionRequestModal } from './CorrectionRequestModal';

interface NewsroomDashboardProps {
  articles: Article[];
  sources: RssSource[];
  onUpdateSources?: (sources: RssSource[]) => void;
  currentUser: UserSession;
  onUpdateArticles: (articles: Article[]) => void;
  onBackToHome: () => void;
  onSwitchStaffRole: (roleKey: string) => void;
  pages?: InstitutionalPage[];
  onSavePage?: (page: InstitutionalPage) => void;
  onDeletePage?: (pageId: string) => void;
  onPreviewPage?: (slug: string) => void;
  categories?: CategoryDetail[];
  onSaveCategory?: (category: CategoryDetail) => void;
  onPreviewCategory?: (slug: CategorySlug) => void;
  menuConfig?: SiteMenuConfig;
  onSaveMenuConfig?: (config: SiteMenuConfig) => void;
}

export const NewsroomDashboard: React.FC<NewsroomDashboardProps> = ({
  articles,
  sources,
  onUpdateSources,
  currentUser,
  onUpdateArticles,
  onBackToHome,
  onSwitchStaffRole,
  pages = [],
  onSavePage,
  onDeletePage,
  onPreviewPage,
  categories = [],
  onSaveCategory,
  onPreviewCategory,
  menuConfig,
  onSaveMenuConfig
}) => {
  // Navigation tabs in newsroom
  const [activeTab, setActiveTab] = useState<'painel' | 'materias' | 'editor' | 'fontes' | 'midia' | 'paginas' | 'categorias' | 'menus'>('painel');

  // Article filters
  const [statusFilter, setStatusFilter] = useState<string>('TODAS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing or creating article
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form inputs for editor
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<CategorySlug>('politica');
  const [formKicker, setFormKicker] = useState('POLÍTICA NACIONAL');
  const [formImageUrl, setFormImageUrl] = useState('/src/assets/images/hero_congresso.jpg');
  const [formImageCaption, setFormImageCaption] = useState('');
  const [formImageCredits, setFormImageCredits] = useState('');
  const [formAccessLevel, setFormAccessLevel] = useState<ContentAccessLevel>('aberto');
  const [formTags, setFormTags] = useState('');
  const [formSources, setFormSources] = useState('');
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');

  // Modal for requesting corrections
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [targetArticleForCorrection, setTargetArticleForCorrection] = useState<Article | null>(null);

  // Feedback banner
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // AI Assistant states
  const [aiSuggestions, setAiSuggestions] = useState<{
    titles?: string[];
    clarityScore?: string;
    clarityFeedback?: string;
    missingSources?: string[];
    suggestedTags?: string[];
    summary?: string;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Media Library state
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [mediaUploadModal, setMediaUploadModal] = useState(false);
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaCredits, setNewMediaCredits] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Metrics counters based on real articles
  const countRascunho = articles.filter(a => a.editorialStatus === 'RECEBIDA' || a.editorialStatus === 'EM TRIAGEM' || a.editorialStatus === 'EM REDAÇÃO').length;
  const countEmRevisao = articles.filter(a => a.editorialStatus === 'EM REVISÃO').length;
  const countCorrecoes = articles.filter(a => a.editorialStatus === 'CORREÇÕES').length;
  const countAprovadas = articles.filter(a => a.editorialStatus === 'APROVADA').length;
  const countAgendadas = articles.filter(a => a.editorialStatus === 'AGENDADA').length;
  const countPublicadas = articles.filter(a => a.editorialStatus === 'PUBLICADA').length;

  // Open editor for an article
  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setIsCreatingNew(false);
    setFormTitle(art.title);
    setFormSubtitle(art.subtitle);
    setFormContent(art.content);
    setFormCategory(art.category);
    setFormKicker(art.kicker);
    setFormImageUrl(art.imageUrl);
    setFormImageCaption(art.imageCaption);
    setFormImageCredits(art.imageCredits || '');
    setFormAccessLevel(art.accessLevel);
    setFormTags(art.tags?.join(', ') || '');
    setFormSources(art.sourcesConsulted?.join('\n') || '');
    setFormMetaTitle(art.seo?.metaTitle || art.title);
    setFormMetaDesc(art.seo?.metaDescription || art.subtitle);
    setAiSuggestions(null);
    setActiveTab('editor');
  };

  // Open editor for brand new article
  const handleOpenCreate = () => {
    setEditingArticle(null);
    setIsCreatingNew(true);
    setFormTitle('');
    setFormSubtitle('');
    setFormContent('');
    setFormCategory('politica');
    setFormKicker('POLÍTICA NACIONAL');
    setFormImageUrl('/src/assets/images/hero_congresso.jpg');
    setFormImageCaption('');
    setFormImageCredits('Redação O Patriota');
    setFormAccessLevel('aberto');
    setFormTags('');
    setFormSources('');
    setFormMetaTitle('');
    setFormMetaDesc('');
    setAiSuggestions(null);
    setActiveTab('editor');
  };

  // Save as Draft (Rascunho)
  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showFeedback('Informe pelo menos o título da matéria.', 'error');
      return;
    }

    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);
    const sourcesArray = formSources.split('\n').map(s => s.trim()).filter(Boolean);

    if (isCreatingNew) {
      const newArt: Article = {
        id: 'art-' + Date.now(),
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: formTitle,
        subtitle: formSubtitle,
        kicker: formKicker,
        category: formCategory,
        content: formContent,
        author: currentUser.name,
        authorId: currentUser.id,
        authorRole: currentUser.role === 'jornalista' ? 'Jornalista' : 'Editor',
        publishedAt: 'Pendente de publicação',
        readTimeMinutes: Math.max(1, Math.ceil(formContent.split(/\s+/).length / 200)),
        imageUrl: formImageUrl,
        imageCaption: formImageCaption,
        imageCredits: formImageCredits,
        sourceName: sourcesArray[0] || 'Redação O Patriota',
        sourcesConsulted: sourcesArray,
        tags: tagsArray,
        accessLevel: formAccessLevel,
        editorialStatus: 'EM REDAÇÃO',
        seo: {
          metaTitle: formMetaTitle,
          metaDescription: formMetaDesc
        },
        auditLog: [
          {
            id: 'aud-' + Date.now(),
            timestamp: new Date().toLocaleString('pt-BR'),
            userName: currentUser.name,
            userRole: currentUser.role,
            action: 'Criação da matéria em rascunho'
          }
        ]
      };
      onUpdateArticles([newArt, ...articles]);
      setEditingArticle(newArt);
      setIsCreatingNew(false);
      showFeedback('Matéria salva como Rascunho com sucesso!');
    } else if (editingArticle) {
      const updated = articles.map((a) => {
        if (a.id === editingArticle.id) {
          return {
            ...a,
            title: formTitle,
            subtitle: formSubtitle,
            kicker: formKicker,
            category: formCategory,
            content: formContent,
            imageUrl: formImageUrl,
            imageCaption: formImageCaption,
            imageCredits: formImageCredits,
            accessLevel: formAccessLevel,
            tags: tagsArray,
            sourcesConsulted: sourcesArray,
            seo: { metaTitle: formMetaTitle, metaDescription: formMetaDesc },
            auditLog: [
              ...(a.auditLog || []),
              {
                id: 'aud-' + Date.now(),
                timestamp: new Date().toLocaleString('pt-BR'),
                userName: currentUser.name,
                userRole: currentUser.role,
                action: 'Alterações salvas no rascunho'
              }
            ]
          };
        }
        return a;
      });
      onUpdateArticles(updated);
      showFeedback('Alterações salvas no rascunho com sucesso!');
    }
  };

  // Submit to Review (EM REVISÃO)
  const handleSubmitToReview = () => {
    if (!editingArticle) return;

    // Checagem de fontes da matéria: se for sustentada exclusivamente por veículos da Globo, rejeita
    const allSourcesText = [
      editingArticle.sourceName || '',
      ...(editingArticle.sourcesConsulted || []),
      formSources
    ].join(' ');

    if (isGloboSource(allSourcesText)) {
      const otherOfficialSources = (editingArticle.sourcesConsulted || [])
        .filter(s => !isGloboSource(s) && s.trim().length > 0);

      if (otherOfficialSources.length === 0) {
        showFeedback('RESTRIÇÃO EDITORIAL (MANUAL DE FONTES): Veículos da Rede Globo não podem fundamentar reportagens de O PATRIOTA. Obtenha confirmação em documentos oficiais ou fontes autorizadas antes do envio para revisão.', 'error');
        return;
      }
    }

    const updated = articles.map((a) => {
      if (a.id === editingArticle.id) {
        return {
          ...a,
          editorialStatus: 'EM REVISÃO' as EditorialStatus,
          auditLog: [
            ...(a.auditLog || []),
            {
              id: 'aud-' + Date.now(),
              timestamp: new Date().toLocaleString('pt-BR'),
              userName: currentUser.name,
              userRole: currentUser.role,
              action: 'Envio da matéria para revisão editorial independente',
              previousStatus: a.editorialStatus,
              newStatus: 'EM REVISÃO'
            }
          ]
        };
      }
      return a;
    });
    onUpdateArticles(updated);
    setEditingArticle({ ...editingArticle, editorialStatus: 'EM REVISÃO' });
    showFeedback('Matéria enviada para a fila de revisão dos Editores!');
  };

  // Approve Article (STRICT RULE: Journalist cannot approve their own story!)
  const handleApprove = (art: Article) => {
    // 1. Strict Self-approval check
    if (art.authorId === currentUser.id && currentUser.role !== 'administrador') {
      showFeedback('VIOLAÇÃO DE POLÍTICA EDITORIAL: O próprio autor da matéria não pode aprová-la. A aprovação exige a validação de um Revisor ou Editor independente.', 'error');
      return;
    }

    // 2. Strict Globo source restriction check
    const sourcesStr = [art.sourceName || '', ...(art.sourcesConsulted || [])].join(' ');
    if (isGloboSource(sourcesStr)) {
      const validSecondary = (art.sourcesConsulted || []).filter(s => !isGloboSource(s));
      if (validSecondary.length === 0) {
        showFeedback('APROVAÇÃO BLOQUEADA (DIRETRIZ GLOBO): Matéria não possui fontes primárias válidas além de veículo com restrição editorial. Apure confirmação oficial antes de aprovar.', 'error');
        return;
      }
    }

    // 3. Role permission check
    const allowedRoles: UserRole[] = ['revisor', 'editor', 'editor_chefe', 'administrador'];
    if (!allowedRoles.includes(currentUser.role)) {
      showFeedback('Você não possui permissão de Revisor ou Editor para aprovar matérias.', 'error');
      return;
    }

    const updated = articles.map((a) => {
      if (a.id === art.id) {
        return {
          ...a,
          editorialStatus: 'APROVADA' as EditorialStatus,
          reviewNotes: undefined,
          auditLog: [
            ...(a.auditLog || []),
            {
              id: 'aud-' + Date.now(),
              timestamp: new Date().toLocaleString('pt-BR'),
              userName: currentUser.name,
              userRole: currentUser.role,
              action: 'Aprovação editorial concedida',
              previousStatus: a.editorialStatus,
              newStatus: 'APROVADA'
            }
          ]
        };
      }
      return a;
    });
    onUpdateArticles(updated);
    if (editingArticle && editingArticle.id === art.id) {
      setEditingArticle({ ...editingArticle, editorialStatus: 'APROVADA' });
    }
    showFeedback(`Matéria "${art.title.substring(0, 30)}..." aprovada com sucesso!`);
  };

  // Open correction request modal
  const handleOpenCorrectionModal = (art: Article) => {
    setTargetArticleForCorrection(art);
    setCorrectionNotes('');
    setCorrectionError(null);
    setCorrectionModalOpen(true);
  };

  // Confirm correction request
  const handleConfirmCorrection = () => {
    if (!targetArticleForCorrection) return;
    if (!correctionNotes.trim()) {
      setCorrectionError('É obrigatório informar as orientações de correção para o repórter.');
      return;
    }
    setCorrectionError(null);

    const updated = articles.map((a) => {
      if (a.id === targetArticleForCorrection.id) {
        return {
          ...a,
          editorialStatus: 'CORREÇÕES' as EditorialStatus,
          reviewNotes: correctionNotes,
          auditLog: [
            ...(a.auditLog || []),
            {
              id: 'aud-' + Date.now(),
              timestamp: new Date().toLocaleString('pt-BR'),
              userName: currentUser.name,
              userRole: currentUser.role,
              action: 'Devolvido para correções pelo revisor/editor',
              previousStatus: a.editorialStatus,
              newStatus: 'CORREÇÕES',
              notes: correctionNotes
            }
          ]
        };
      }
      return a;
    });
    onUpdateArticles(updated);
    setCorrectionModalOpen(false);
    showFeedback('Matéria devolvida para correções com notas anexadas.');
  };

  // Publish / Schedule Article
  const handlePublish = (art: Article) => {
    const canPublishRoles: UserRole[] = ['editor', 'editor_chefe', 'administrador'];
    if (!canPublishRoles.includes(currentUser.role)) {
      showFeedback('Apenas Editores e Administradores possuem autorização para publicar no portal.', 'error');
      return;
    }

    const updated = articles.map((a) => {
      if (a.id === art.id) {
        return {
          ...a,
          editorialStatus: 'PUBLICADA' as EditorialStatus,
          publishedAt: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          auditLog: [
            ...(a.auditLog || []),
            {
              id: 'aud-' + Date.now(),
              timestamp: new Date().toLocaleString('pt-BR'),
              userName: currentUser.name,
              userRole: currentUser.role,
              action: 'Publicação oficial no portal',
              previousStatus: a.editorialStatus,
              newStatus: 'PUBLICADA'
            }
          ]
        };
      }
      return a;
    });
    onUpdateArticles(updated);
    if (editingArticle && editingArticle.id === art.id) {
      setEditingArticle({ ...editingArticle, editorialStatus: 'PUBLICADA' });
    }
    showFeedback(`Matéria "${art.title.substring(0, 30)}..." PUBLICADA no portal!`);
  };

  // AI suggestions come from the configured backend provider; never fabricate editorial analysis.
  const handleRunAiAssistant = async () => {
    if (!formTitle.trim() && !formContent.trim()) {
      showFeedback('Digite ao menos o título e o texto para acionar o assistente.', 'error');
      return;
    }
    setAiLoading(true);
    try {
      const suggestions = await api.post<{
        titles?: string[];
        clarityScore?: string;
        clarityFeedback?: string;
        missingSources?: string[];
        suggestedTags?: string[];
        summary?: string;
      }>('/editorial/ai-review', {
        title: formTitle, subtitle: formSubtitle, content: formContent,
        category: formCategory, sources: formSources.split('\n').filter(Boolean)
      });
      setAiSuggestions(suggestions);
      showFeedback('Sugestões reais do assistente editorial carregadas.');
    } catch (error) {
      showFeedback(error instanceof Error ? error.message : 'Assistente editorial indisponível; nenhuma sugestão fictícia foi apresentada.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // A metadata-only form must not pretend to upload an image file.
  const handleMediaUpload = (e: React.FormEvent) => {
    e.preventDefault();
    showFeedback('O envio de ficheiros ainda não está ligado a um armazenamento de mídia. Nenhum ficheiro foi enviado.', 'error');
  };

  const handleUseMedia = (med: MediaItem) => {
    setFormImageUrl(med.url);
    setFormImageCaption(med.caption || '');
    setFormImageCredits(med.credits || '');
    showFeedback(`Imagem "${med.name}" selecionada como capa!`);
    setActiveTab('editor');
  };

  // Filtered articles list
  const filteredArticles = articles.filter((a) => {
    const matchesStatus = statusFilter === 'TODAS' || a.editorialStatus === statusFilter;
    const matchesCategory = categoryFilter === 'TODAS' || a.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F1F3F5] text-[#17202A] select-none pb-16">
      
      {/* 1. TOP NEWSROOM CONTROL BAR */}
      <div className="bg-[#07172E] text-white px-6 py-3 border-b border-[#0B2345] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white px-2.5 py-1 rounded bg-white/10 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PORTAL PÚBLICO</span>
          </button>
          <span className="text-white/30">|</span>
          <div className="flex items-center gap-2">
            <span className="text-[#FFCC29] font-black text-sm">O PATRIOTA</span>
            <span className="text-xs text-white/70 font-mono">REDAÇÃO JORNALÍSTICA</span>
          </div>
        </div>

        {/* STAFF IDENTITY SWITCHER (CRITICAL FOR DEMONSTRATING REAL ROLES & RESTRICTIONS) */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-white/70 hidden sm:inline">Operando como:</span>
          <div className="flex items-center gap-2 bg-[#0B2345] border border-white/20 px-2.5 py-1 rounded">
            <UserCheck className="w-3.5 h-3.5 text-[#FFCC29]" />
            <span className="font-bold text-white">{currentUser.name}</span>
            <span className="text-[10px] uppercase font-mono bg-white/10 px-1.5 py-0.5 rounded text-[#FFCC29]">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          {/* Quick test buttons to change role */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSwitchStaffRole('jornalista')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                currentUser.role === 'jornalista' ? 'bg-[#0B5FFF] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              title="Testar como Repórter/Jornalista (não pode auto-aprovar)"
            >
              Jornalista
            </button>
            <button
              onClick={() => onSwitchStaffRole('revisor')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                currentUser.role === 'revisor' ? 'bg-[#0B5FFF] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              title="Testar como Revisor Textual"
            >
              Revisor
            </button>
            <button
              onClick={() => onSwitchStaffRole('editor_chefe')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition cursor-pointer ${
                currentUser.role === 'editor_chefe' ? 'bg-[#16803C] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              title="Testar como Editor-Chefe (aprova e publica)"
            >
              Editor-Chefe
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedbackMsg && (
        <div className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 ${
          feedbackMsg.type === 'error' ? 'bg-[#FEF3F2] text-[#B42318] border-b border-[#B42318]/30' : 'bg-[#EBF7EE] text-[#16803C] border-b border-[#16803C]/30'
        }`}>
          {feedbackMsg.type === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 2. MAIN NEWSROOM CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-[#D9DEE7] pb-2">
          <div className="flex gap-2">
            {[
              { id: 'painel', label: 'Painel Geral & Métricas', icon: SlidersHorizontal },
              { id: 'materias', label: `Todas as Matérias (${articles.length})`, icon: FileText },
              { id: 'paginas', label: `Gestor de Páginas (${pages.length})`, icon: Globe },
              { id: 'categorias', label: `Editorias & Categorias (${categories.length})`, icon: Compass },
              { id: 'menus', label: 'Gestor de Menus', icon: Menu },
              { id: 'fontes', label: `Fontes Oficiais (${sources.length})`, icon: BookOpen },
              { id: 'midia', label: `Biblioteca de Mídia (${mediaList.length})`, icon: ImageIcon },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { setActiveTab(t.id as any); setEditingArticle(null); }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-t font-bold text-xs transition cursor-pointer ${
                    isActive ? 'bg-white text-[#0B2345] border-t-2 border-[#0B2345] shadow-xs' : 'text-[#5D6673] hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-3.5 py-2 rounded transition cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>NOVA MATÉRIA</span>
          </button>
        </div>

        {/* TAB 1: PAINEL GERAL & MÉTRICAS */}
        {activeTab === 'painel' && (
          <NewsroomOverviewTab
            articles={articles}
            currentUser={currentUser}
            countRascunho={countRascunho}
            countEmRevisao={countEmRevisao}
            countCorrecoes={countCorrecoes}
            countAprovadas={countAprovadas}
            countAgendadas={countAgendadas}
            countPublicadas={countPublicadas}
            onOpenEdit={handleOpenEdit}
            onApprove={handleApprove}
            onRequestCorrection={handleOpenCorrectionModal}
          />
        )}

        {/* TAB 2: TODAS AS MATÉRIAS & FILTROS */}
        {activeTab === 'materias' && (
          <NewsroomArticlesTab
            filteredArticles={filteredArticles}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenEdit={handleOpenEdit}
            onPublish={handlePublish}
          />
        )}

        {/* TAB 3: EDITOR DE MATÉRIAS (CRIAR / EDITAR) */}
        {activeTab === 'editor' && (
          <NewsroomEditorTab
            editingArticle={editingArticle}
            isCreatingNew={isCreatingNew}
            currentUser={currentUser}
            formTitle={formTitle}
            setFormTitle={setFormTitle}
            formSubtitle={formSubtitle}
            setFormSubtitle={setFormSubtitle}
            formContent={formContent}
            setFormContent={setFormContent}
            formCategory={formCategory}
            setFormCategory={setFormCategory}
            formKicker={formKicker}
            setFormKicker={setFormKicker}
            formImageUrl={formImageUrl}
            formImageCaption={formImageCaption}
            setFormImageCaption={setFormImageCaption}
            formImageCredits={formImageCredits}
            setFormImageCredits={setFormImageCredits}
            formAccessLevel={formAccessLevel}
            setFormAccessLevel={setFormAccessLevel}
            formTags={formTags}
            setFormTags={setFormTags}
            formSources={formSources}
            setFormSources={setFormSources}
            formMetaTitle={formMetaTitle}
            setFormMetaTitle={setFormMetaTitle}
            formMetaDesc={formMetaDesc}
            setFormMetaDesc={setFormMetaDesc}
            aiSuggestions={aiSuggestions}
            aiLoading={aiLoading}
            onSaveDraft={handleSaveDraft}
            onSubmitToReview={handleSubmitToReview}
            onRunAiAssistant={handleRunAiAssistant}
          />
        )}

        {/* TAB 4: CENTRAL DE FONTES OFICIAIS */}
        {activeTab === 'fontes' && (
          <div className="bg-white p-6 rounded-xl border border-[#D9DEE7] shadow-xs">
            <OfficialSourcesHub
              sources={sources}
              onUpdateSources={onUpdateSources || (() => {})}
            />
          </div>
        )}

        {/* TAB 5: BIBLIOTECA DE MÍDIA */}
        {activeTab === 'midia' && (
          <NewsroomMediaTab
            mediaList={mediaList}
            mediaUploadModal={mediaUploadModal}
            setMediaUploadModal={setMediaUploadModal}
            newMediaName={newMediaName}
            setNewMediaName={setNewMediaName}
            newMediaCaption={newMediaCaption}
            setNewMediaCaption={setNewMediaCaption}
            newMediaCredits={newMediaCredits}
            setNewMediaCredits={setNewMediaCredits}
            onMediaUpload={handleMediaUpload}
            onUseMedia={handleUseMedia}
          />
        )}

        {/* TAB: GESTOR DE PÁGINAS & MODELOS */}
        {activeTab === 'paginas' && onSavePage && onDeletePage && onPreviewPage && (
          <PagesManager
            pages={pages}
            onSavePage={onSavePage}
            onDeletePage={onDeletePage}
            onPreviewPage={onPreviewPage}
          />
        )}

        {/* TAB: GESTOR DE EDITORIAS & CATEGORIAS */}
        {activeTab === 'categorias' && onSaveCategory && onPreviewCategory && (
          <CategoriesManager
            categories={categories}
            onSaveCategory={onSaveCategory}
            onPreviewCategory={onPreviewCategory}
          />
        )}

        {/* TAB: GESTOR DE MENUS */}
        {activeTab === 'menus' && menuConfig && onSaveMenuConfig && (
          <MenusManager
            menuConfig={menuConfig}
            allPages={pages}
            allCategories={categories}
            onSaveMenuConfig={onSaveMenuConfig}
          />
        )}

      </div>

      {/* MODAL: SOLICITAÇÃO DE CORREÇÕES */}
      {correctionModalOpen && targetArticleForCorrection && (
        <CorrectionRequestModal
          targetArticle={targetArticleForCorrection}
          correctionNotes={correctionNotes}
          setCorrectionNotes={setCorrectionNotes}
          correctionError={correctionError}
          setCorrectionError={setCorrectionError}
          onClose={() => setCorrectionModalOpen(false)}
          onConfirm={handleConfirmCorrection}
        />
      )}

    </div>
  );
};
