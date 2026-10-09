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
import { DEMO_USERS, INITIAL_MEDIA_ITEMS } from '../../data/mockData';
import { PagesManager } from '../admin/PagesManager';
import { CategoriesManager } from '../admin/CategoriesManager';
import { MenusManager } from '../admin/MenusManager';
import { OfficialSourcesHub } from '../admin/OfficialSourcesHub';
import { 
  classifyLeadFactualStatus, 
  isGloboSource, 
  EDITORIAL_POLICY_CONFIG 
} from '../../utils/editorialPolicy';
import { 
  FileText, 
  Plus, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Send, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Image as ImageIcon, 
  ShieldAlert, 
  Layers, 
  Eye, 
  BookOpen, 
  Trash2, 
  UserCheck, 
  SlidersHorizontal,
  Upload,
  Calendar,
  Lock,
  ExternalLink,
  MessageSquareQuote,
  Globe,
  Compass,
  Menu
} from 'lucide-react';

interface NewsroomDashboardProps {
  articles: Article[];
  sources: RssSource[];
  onUpdateSources?: (sources: RssSource[]) => void;
  currentUser: UserSession;
  onUpdateArticles: (articles: Article[]) => void;
  onBackToHome: () => void;
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
  // Matriz de acesso por função. As permissões de backend devem espelhar esta matriz.
  const isAdmin = currentUser.role === 'administrador';
  const isChiefEditor = currentUser.role === 'editor_chefe';
  const isEditor = currentUser.role === 'editor';
  const isReviewer = currentUser.role === 'revisor';
  const isReporter = currentUser.role === 'jornalista';
  const canManageSite = isAdmin || isChiefEditor;
  const canManageSources = isAdmin || isChiefEditor || isEditor || isReviewer;
  const canPublish = isAdmin || isChiefEditor || isEditor;
  const canReview = isAdmin || isChiefEditor || isEditor || isReviewer;
  const canCreateArticle = isAdmin || isChiefEditor || isEditor || isReporter;
  const canEditArticle = (article: Article) => isAdmin || isChiefEditor || isEditor || (article.authorId === currentUser.id && (isReporter || isReviewer));
  type NewsroomTab = 'painel' | 'materias' | 'editor' | 'fontes' | 'midia' | 'paginas' | 'categorias' | 'menus';
  const availableTabs: { id: NewsroomTab; label: string; icon: typeof SlidersHorizontal }[] = [
    { id: 'painel', label: 'Painel Geral & Métricas', icon: SlidersHorizontal },
    { id: 'materias', label: 'Matérias', icon: FileText },
    ...(canManageSources ? [{ id: 'fontes' as const, label: 'Fontes Oficiais', icon: BookOpen }] : []),
    ...(canManageSite ? [
      { id: 'paginas' as const, label: 'Gestor de Páginas', icon: Globe },
      { id: 'categorias' as const, label: 'Editorias & Categorias', icon: Compass },
      { id: 'menus' as const, label: 'Gestor de Menus', icon: Menu },
    ] : []),
    ...(canManageSite || isEditor ? [{ id: 'midia' as const, label: 'Biblioteca de Mídia', icon: ImageIcon }] : []),
  ];
  const [activeTab, setActiveTab] = useState<NewsroomTab>('painel');

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
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
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
    if (!canEditArticle(editingArticle)) { showFeedback('Você não tem permissão para editar esta matéria.', 'error'); return; }

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
    if (!canReview) { showFeedback('Seu perfil não tem permissão para aprovar matérias.', 'error'); return; }
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
    if (!canPublish) {
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

  // AI Assistant trigger
  const handleRunAiAssistant = () => {
    if (!formTitle && !formContent) {
      showFeedback('Digite ao menos o título e uma prévia do texto para acionar o assistente.', 'error');
      return;
    }

    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestions({
        titles: [
          `${formTitle}: Entenda o impacto fiscal e legislativo no Congresso`,
          `Modernização e empregabilidade: Os pilares da nova proposição em Brasília`,
          `Comissão avança com pacote de reformas: O que muda para trabalhadores e setor produtivo`
        ],
        clarityScore: '94/100 (Excelente legibilidade editorial)',
        clarityFeedback: 'Estrutura gramatical formal e concisa. Tom objetivo em conformidade com o Manual de Redação de O Patriota.',
        missingSources: [
          'No parágrafo 2: Recomenda-se citar o número do Projeto de Lei ou a página do Diário Oficial da União correspondente.',
          'No parágrafo 4: Mencione a entidade patronal que emitiu a nota referida.'
        ],
        suggestedTags: ['Congresso Nacional', 'Economia Brasileira', 'Legislação', 'Reforma Estrutural', 'Trabalho'],
        summary: formSubtitle || 'Resumo analítico dos principais desdobramentos da votação.'
      });
      setAiLoading(false);
      showFeedback('Auditoria e sugestões de redação geradas pela IA!');
    }, 1200);
  };

  // Media upload simulation
  const handleMediaUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaName.trim()) return;

    const newItem: MediaItem = {
      id: 'med-' + Date.now(),
      name: newMediaName.endsWith('.jpg') ? newMediaName : `${newMediaName}.jpg`,
      url: '/src/assets/images/hero_congresso.jpg',
      uploadedAt: new Date().toLocaleDateString('pt-BR'),
      uploadedBy: currentUser.name,
      fileType: 'image/jpeg',
      sizeBytes: 850000,
      caption: newMediaCaption,
      credits: newMediaCredits || 'Redação O Patriota'
    };

    setMediaList([newItem, ...mediaList]);
    setNewMediaName('');
    setNewMediaCaption('');
    setNewMediaCredits('');
    setMediaUploadModal(false);
    showFeedback('Imagem adicionada à Biblioteca de Mídia!');
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

        {/* Identidade da conta autenticada; a própria pessoa não pode trocar de função. */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 rounded border border-white/20 bg-[#0B2345] px-3 py-2">
            <UserCheck className="h-4 w-4 text-[#FFCC29]" />
            <span className="font-bold text-white">{currentUser.name}</span>
            <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-mono uppercase text-[#FFCC29]">{currentUser.role.replace('_', ' ')}</span>
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
            {availableTabs.map((t) => {
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

          {canCreateArticle && <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-3.5 py-2 rounded transition cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>NOVA MATÉRIA</span>
          </button>}
        </div>

        {/* TAB 1: PAINEL GERAL & MÉTRICAS */}
        {activeTab === 'painel' && (
          <div className="space-y-6">
            {/* Real Status Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#5D6673] shadow-xs">
                <span className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider block">Em Rascunho</span>
                <span className="text-2xl font-black text-[#17202A] block mt-1">{countRascunho}</span>
                <span className="text-[10px] text-[#5D6673]">Em produção inicial</span>
              </div>

              <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B5FFF] shadow-xs">
                <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block">Aguardando Revisão</span>
                <span className="text-2xl font-black text-[#0B5FFF] block mt-1">{countEmRevisao}</span>
                <span className="text-[10px] text-[#0B5FFF] font-semibold">Exige parecer editorial</span>
              </div>

              <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#D97706] shadow-xs">
                <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider block">Com Correções</span>
                <span className="text-2xl font-black text-[#D97706] block mt-1">{countCorrecoes}</span>
                <span className="text-[10px] text-[#D97706]">Devolvidas ao autor</span>
              </div>

              <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#16803C] shadow-xs">
                <span className="text-[10px] font-bold text-[#16803C] uppercase tracking-wider block">Aprovadas</span>
                <span className="text-2xl font-black text-[#16803C] block mt-1">{countAprovadas}</span>
                <span className="text-[10px] text-[#16803C] font-semibold">Prontas p/ publicação</span>
              </div>

              <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#2563EB] shadow-xs">
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">Agendadas</span>
                <span className="text-2xl font-black text-[#2563EB] block mt-1">{countAgendadas}</span>
                <span className="text-[10px] text-[#2563EB]">Fila de disparo</span>
              </div>

              <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B2345] shadow-xs">
                <span className="text-[10px] font-bold text-[#0B2345] uppercase tracking-wider block">Publicadas</span>
                <span className="text-2xl font-black text-[#0B2345] block mt-1">{countPublicadas}</span>
                <span className="text-[10px] text-[#0B2345] font-semibold">Ao vivo no portal</span>
              </div>
            </div>

            {/* Editorial Policy Reminder */}
            <div className="p-4 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] rounded text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  <strong>POLÍTICA DE INTEGRIDADE:</strong> Toda publicação exige revisão independente. Um jornalista não pode aprovar a própria matéria.
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold bg-[#16803C] text-white px-2 py-0.5 rounded">
                Regra Editorial Ativa
              </span>
            </div>

            {/* Items Waiting Review */}
            <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-[#0B2345]">
                  Fila Prioritária de Revisão Editorial
                </h3>
                <span className="text-xs text-[#5D6673]">Apenas Editores e Revisores podem aprovar</span>
              </div>

              <div className="divide-y divide-[#D9DEE7]">
                {articles.filter(a => a.editorialStatus === 'EM REVISÃO' || a.editorialStatus === 'CORREÇÕES').map((art) => (
                  <div key={art.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#5D6673] uppercase mb-1">
                        <span className="text-[#0B5FFF]">{art.kicker}</span>
                        <span>•</span>
                        <span>Autor: {art.author}</span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.2 rounded font-mono ${
                          art.editorialStatus === 'EM REVISÃO' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#FEF3F2] text-[#B42318]'
                        }`}>
                          {art.editorialStatus}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#0B2345] mb-1">
                        {art.title}
                      </h4>
                      {art.reviewNotes && (
                        <p className="text-[11px] text-[#B42318] italic bg-[#FEF3F2] p-2 rounded border border-[#B42318]/20 mt-1">
                          Nota do Revisor: {art.reviewNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="px-3 py-1.5 border border-[#D9DEE7] hover:border-[#0B2345] rounded font-bold transition cursor-pointer"
                      >
                        Abrir Texto
                      </button>

                      {/* Approve button */}
                      <button
                        onClick={() => handleApprove(art)}
                        className="px-3 py-1.5 bg-[#16803C] hover:bg-[#22A447] text-white rounded font-bold transition cursor-pointer"
                        title={art.authorId === currentUser.id ? 'Você é o autor desta matéria e não pode aprová-la' : 'Aprovar matéria'}
                      >
                        Aprovar
                      </button>

                      {/* Request corrections */}
                      <button
                        onClick={() => handleOpenCorrectionModal(art)}
                        className="px-3 py-1.5 bg-[#D97706] hover:bg-amber-600 text-white rounded font-bold transition cursor-pointer"
                      >
                        Pedir Correção
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TODAS AS MATÉRIAS & FILTROS */}
        {activeTab === 'materias' && (
          <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">
                  Arquivo e Gestão de Matérias
                </h3>
                <p className="text-xs text-[#5D6673]">
                  Pesquise, edite, envie para revisão e publique matérias do portal.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#5D6673] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrar por título ou autor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-[#D9DEE7] rounded text-xs w-48 sm:w-60 focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-[#D9DEE7] p-1.5 rounded text-xs focus:outline-none"
                >
                  <option value="TODAS">Todos os Status</option>
                  <option value="PUBLICADA">Publicada</option>
                  <option value="EM REVISÃO">Em Revisão</option>
                  <option value="CORREÇÕES">Correções</option>
                  <option value="APROVADA">Aprovada</option>
                  <option value="EM REDAÇÃO">Em Redação</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-[#D9DEE7] p-1.5 rounded text-xs focus:outline-none"
                >
                  <option value="TODAS">Todas as Editorias</option>
                  <option value="politica">Política</option>
                  <option value="brasil">Brasil</option>
                  <option value="economia">Economia</option>
                  <option value="seguranca">Segurança</option>
                  <option value="saude">Saúde</option>
                  <option value="opiniao">Opinião</option>
                </select>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F8FA] border-b border-[#D9DEE7] text-[#5D6673] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Título da Matéria</th>
                    <th className="py-2.5 px-3">Autor</th>
                    <th className="py-2.5 px-3">Editoria</th>
                    <th className="py-2.5 px-3">Acesso</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DEE7]">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-[#F7F8FA]">
                      <td className="py-3 px-3 max-w-md">
                        <strong className="block text-[#0B2345] font-serif text-xs">
                          {art.title}
                        </strong>
                        <span className="text-[10px] text-[#5D6673] block truncate">
                          {art.subtitle}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5D6673]">{art.author}</td>
                      <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#0B5FFF]">{art.category}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          art.accessLevel === 'premium'
                            ? 'bg-[#FFCC29] text-[#17202A]'
                            : art.accessLevel === 'assinante'
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : 'bg-[#F1F3F5] text-[#5D6673]'
                        }`}>
                          {art.accessLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          art.editorialStatus === 'PUBLICADA'
                            ? 'bg-[#EBF7EE] text-[#16803C]'
                            : art.editorialStatus === 'EM REVISÃO'
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : art.editorialStatus === 'CORREÇÕES'
                            ? 'bg-[#FEF3F2] text-[#B42318]'
                            : art.editorialStatus === 'APROVADA'
                            ? 'bg-[#EBF7EE] text-[#16803C]'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {art.editorialStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="px-2 py-1 border border-[#D9DEE7] hover:border-[#0B2345] rounded font-bold text-[11px] cursor-pointer"
                        >
                          Editar
                        </button>
                        {art.editorialStatus === 'APROVADA' && (
                          <button
                            onClick={() => handlePublish(art)}
                            className="px-2 py-1 bg-[#16803C] hover:bg-[#22A447] text-white rounded font-bold text-[11px] cursor-pointer"
                          >
                            Publicar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EDITOR DE MATÉRIAS (CRIAR / EDITAR) */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: MAIN FORM */}
            <form onSubmit={handleSaveDraft} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded border border-[#D9DEE7] shadow-xs space-y-6 text-xs">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE7]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0B2345]">
                    {isCreatingNew ? 'Nova Reportagem' : `Editando: ${editingArticle?.title.substring(0, 40)}...`}
                  </h3>
                  <span className="text-[11px] text-[#5D6673]">
                    Status atual: <strong>{editingArticle?.editorialStatus || 'EM REDAÇÃO'}</strong> • Autor: <strong>{editingArticle?.author || currentUser.name}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold px-4 py-2 rounded transition cursor-pointer"
                  >
                    Salvar Rascunho
                  </button>

                  {editingArticle && (
                    <button
                      type="button"
                      onClick={handleSubmitToReview}
                      className="bg-[#16803C] hover:bg-[#22A447] text-white font-bold px-4 py-2 rounded transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar p/ Revisão</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block font-bold mb-1 text-[#0B2345]">Título da Matéria (Manchete):</label>
                <input
                  type="text"
                  placeholder="Ex: Congresso avança em propostas para modernização da economia..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-[#D9DEE7] p-2.5 rounded font-serif text-sm font-bold text-[#0B2345] focus:outline-none focus:border-[#0B5FFF]"
                  required
                />

                {/* Real-time Factual Status Evaluation */}
                {formTitle.trim().length > 5 && (() => {
                  const leadAnalysis = classifyLeadFactualStatus(formTitle, formSubtitle);
                  return (
                    <div className="mt-2 p-2 rounded-lg border text-[11px] flex items-center justify-between gap-2 bg-slate-50 border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#0B2345]">Classificação Factual:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${leadAnalysis.badgeClass}`}>
                          {leadAnalysis.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#5D6673] hidden sm:inline">
                        {leadAnalysis.recommendation}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#0B2345]">Subtítulo (Linha Fina / Resumo):</label>
                <textarea
                  rows={2}
                  placeholder="Resumo explicativo do acontecimento..."
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full border border-[#D9DEE7] p-2.5 rounded focus:outline-none focus:border-[#0B5FFF]"
                />
              </div>

              {/* Body Content */}
              <div>
                <label className="block font-bold mb-1 text-[#0B2345]">Corpo da Matéria:</label>
                <textarea
                  rows={12}
                  placeholder="Texto completo da reportagem, com citações, dados e apuração circunstanciada..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full border border-[#D9DEE7] p-3 rounded font-sans leading-relaxed focus:outline-none focus:border-[#0B5FFF]"
                  required
                />
              </div>

              {/* Sources & References */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-[#0B2345]">Fontes Primárias Consultadas (1 por linha):</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Diário Oficial da União nº 198&#10;Relatório CNI 2026"
                    value={formSources}
                    onChange={(e) => setFormSources(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                  />

                  {/* Real-time Globo Restriction Alert */}
                  {isGloboSource(formSources) && (
                    <div className="mt-2 p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 text-[11px] flex items-start gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-rose-800 font-bold">
                          RESTRIÇÃO EDITORIAL — GRUPO GLOBO
                        </strong>
                        <p className="mt-0.5 text-[10px] text-rose-700 leading-snug">
                          Conforme o Adendo ao Manual de Fontes de O PATRIOTA, publicações da Rede Globo não podem ser utilizadas como sustentação factual. A matéria deve citar documentos originais ou fontes primárias oficiais.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#0B2345]">Tags / Palavras-Chave (separadas por vírgula):</label>
                  <textarea
                    rows={3}
                    placeholder="Congresso, Economia, Trabalho, Brasília"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>
              </div>

              {/* SEO Settings */}
              <div className="p-4 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-3">
                <h4 className="font-bold text-[#0B2345] uppercase text-[11px]">Metadados & SEO Técnico</h4>
                <div>
                  <label className="block mb-1 font-semibold">Meta Title (Google / Redes Sociais):</label>
                  <input
                    type="text"
                    value={formMetaTitle}
                    onChange={(e) => setFormMetaTitle(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Meta Description:</label>
                  <input
                    type="text"
                    value={formMetaDesc}
                    onChange={(e) => setFormMetaDesc(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
                  />
                </div>
              </div>

              {/* Review Notes if any */}
              {editingArticle?.reviewNotes && (
                <div className="p-4 bg-[#FEF3F2] border border-[#B42318]/30 text-[#B42318] rounded">
                  <strong className="block font-bold mb-1">Orientações de Correção Pendentes:</strong>
                  <p>{editingArticle.reviewNotes}</p>
                </div>
              )}
            </form>

            {/* RIGHT SIDEBAR: SETTINGS & AI ASSISTANT */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card: Classification & Access Level */}
              <div className="bg-white p-5 rounded border border-[#D9DEE7] shadow-xs space-y-4 text-xs">
                <h4 className="font-bold text-[#0B2345] uppercase tracking-wider text-[11px] border-b border-[#D9DEE7] pb-2">
                  Configurações de Publicação
                </h4>

                <div>
                  <label className="block font-semibold mb-1">Editoria:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategorySlug)}
                    className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none"
                  >
                    <option value="politica">Política Nacional</option>
                    <option value="brasil">Brasil</option>
                    <option value="economia">Economia</option>
                    <option value="seguranca">Segurança Pública</option>
                    <option value="saude">Saúde</option>
                    <option value="cultura">Cultura</option>
                    <option value="opiniao">Opinião</option>
                    <option value="checagem">Checagem de Fatos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Chapéu / Kicker Editorial:</label>
                  <input
                    type="text"
                    value={formKicker}
                    onChange={(e) => setFormKicker(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none"
                  />
                </div>

                {/* Content Access Level / Paywall Config */}
                <div>
                  <label className="block font-semibold mb-1">Nível de Acesso (Paywall):</label>
                  <select
                    value={formAccessLevel}
                    onChange={(e) => setFormAccessLevel(e.target.value as ContentAccessLevel)}
                    className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none font-bold text-[#0B2345]"
                  >
                    <option value="aberto">Aberto (Acesso Geral Livre)</option>
                    <option value="assinante">Exclusivo para Assinantes (Digital/Premium)</option>
                    <option value="premium">Assinante Premium (Inteligência & Ensaio)</option>
                  </select>
                </div>

                {/* Featured Image Selection */}
                <div>
                  <label className="block font-semibold mb-1">Imagem Destacada:</label>
                  <div className="h-28 rounded overflow-hidden border border-[#D9DEE7] mb-2 bg-slate-100">
                    <img src={formImageUrl} alt="Imagem destacada" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="Legenda da imagem..."
                    value={formImageCaption}
                    onChange={(e) => setFormImageCaption(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-1.5 rounded mb-1 text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Créditos da fotografia..."
                    value={formImageCredits}
                    onChange={(e) => setFormImageCredits(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-1.5 rounded text-[11px]"
                  />
                </div>
              </div>

              {/* Card: AI Editorial Assistant */}
              <div className="bg-[#0B2345] text-white p-5 rounded border border-[#07172E] shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FFCC29]" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                      Assistente IA Editorial
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#FFCC29] font-mono">Gemini API Ready</span>
                </div>

                <p className="text-[11px] text-white/80 leading-relaxed">
                  Auxilia na formulação de títulos de impacto, análise de clareza textual e auditoria de fontes faltantes sem inventar declarações ou dados.
                </p>

                <button
                  type="button"
                  onClick={handleRunAiAssistant}
                  disabled={aiLoading}
                  className="w-full bg-[#16803C] hover:bg-[#22A447] text-white font-bold py-2 rounded transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                  <span>{aiLoading ? 'Analisando texto...' : 'Auditar e Sugerir Títulos'}</span>
                </button>

                {aiSuggestions && (
                  <div className="space-y-3 pt-3 border-t border-white/10 text-white/90">
                    <div>
                      <strong className="block text-[#FFCC29] text-[11px] mb-1">Sugestões de Título Ético:</strong>
                      <ul className="space-y-1">
                        {aiSuggestions.titles?.map((t, idx) => (
                          <li
                            key={idx}
                            onClick={() => setFormTitle(t)}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded cursor-pointer text-[11px] transition"
                            title="Clique para aplicar este título"
                          >
                            • {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="block text-[#FFCC29] text-[11px] mb-1">Fontes a Verificar:</strong>
                      <ul className="space-y-1 text-[11px] text-white/80">
                        {aiSuggestions.missingSources?.map((s, idx) => (
                          <li key={idx}>⚠️ {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 text-[10px] text-white/60 italic">
                      Nota de Integridade: As sugestões da IA são consultivas. Nenhuma matéria é publicada sem validação humana.
                    </div>
                  </div>
                )}
              </div>

              {/* Card: Audit Trail */}
              {editingArticle?.auditLog && editingArticle.auditLog.length > 0 && (
                <div className="bg-white p-5 rounded border border-[#D9DEE7] shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-[#0B2345] uppercase tracking-wider text-[11px] border-b border-[#D9DEE7] pb-2">
                    Histórico & Auditoria
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {editingArticle.auditLog.map((log) => (
                      <div key={log.id} className="p-2 bg-[#F7F8FA] rounded border border-[#D9DEE7] text-[11px]">
                        <div className="font-bold text-[#0B2345]">{log.action}</div>
                        <div className="text-[10px] text-[#5D6673]">{log.userName} ({log.userRole}) • {log.timestamp}</div>
                        {log.notes && <div className="text-[10px] text-[#17202A] italic mt-1">{log.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 4: CENTRAL DE FONTES OFICIAIS */}
        {activeTab === 'fontes' && canManageSources && (
          <div className="bg-white p-6 rounded-xl border border-[#D9DEE7] shadow-xs">
            <OfficialSourcesHub
              sources={sources}
              onUpdateSources={onUpdateSources || (() => {})}
            />
          </div>
        )}

        {/* TAB 5: BIBLIOTECA DE MÍDIA */}
        {activeTab === 'midia' && (canManageSite || isEditor) && (
          <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0B2345]">
                  Biblioteca de Mídia & Fotografias Jornalísticas
                </h3>
                <p className="text-xs text-[#5D6673]">
                  Imagens autorizadas para uso com créditos e legendas obrigatórias.
                </p>
              </div>

              <button
                onClick={() => setMediaUploadModal(true)}
                className="flex items-center gap-1.5 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-3.5 py-2 rounded transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Enviar Imagem</span>
              </button>
            </div>

            {/* Media Upload Modal */}
            {mediaUploadModal && (
              <form onSubmit={handleMediaUpload} className="p-5 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-3 text-xs max-w-lg">
                <h4 className="font-bold text-[#0B2345] uppercase">Cadastrar Nova Imagem</h4>
                <div>
                  <label className="block font-semibold mb-1">Nome do Arquivo / Título:</label>
                  <input
                    type="text"
                    placeholder="Ex: plenário_camara_votacao.jpg"
                    value={newMediaName}
                    onChange={(e) => setNewMediaName(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Legenda Padrão:</label>
                  <input
                    type="text"
                    placeholder="Ex: Sessão deliberativa no plenário da Câmara dos Deputados"
                    value={newMediaCaption}
                    onChange={(e) => setNewMediaCaption(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Créditos da Fotografia:</label>
                  <input
                    type="text"
                    placeholder="Ex: Agência Câmara / Lula Marques"
                    value={newMediaCredits}
                    onChange={(e) => setNewMediaCredits(e.target.value)}
                    className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMediaUploadModal(false)}
                    className="px-3 py-1.5 border border-[#D9DEE7] rounded font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#16803C] text-white rounded font-bold cursor-pointer"
                  >
                    Salvar na Biblioteca
                  </button>
                </div>
              </form>
            )}

            {/* Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((med) => (
                <div key={med.id} className="p-3 bg-[#F7F8FA] rounded border border-[#D9DEE7] flex flex-col justify-between">
                  <div>
                    <div className="h-32 rounded overflow-hidden mb-2 bg-slate-200">
                      <img src={med.url} alt={med.name} className="w-full h-full object-cover" />
                    </div>
                    <strong className="block text-xs font-bold text-[#0B2345] truncate">{med.name}</strong>
                    <p className="text-[11px] text-[#5D6673] truncate">{med.caption || 'Sem legenda'}</p>
                    <span className="text-[10px] text-[#5D6673] block mt-1">Créditos: {med.credits}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#D9DEE7] flex justify-between items-center text-[11px]">
                    <span className="text-[#5D6673]">{(med.sizeBytes / 1024).toFixed(0)} KB</span>
                    <button
                      onClick={() => {
                        setFormImageUrl(med.url);
                        setFormImageCaption(med.caption || '');
                        setFormImageCredits(med.credits || '');
                        showFeedback(`Imagem "${med.name}" selecionada como capa!`);
                        setActiveTab('editor');
                      }}
                      className="text-[#0B5FFF] font-bold hover:underline cursor-pointer"
                    >
                      Usar no Artigo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GESTOR DE PÁGINAS & MODELOS */}
        {activeTab === 'paginas' && canManageSite && onSavePage && onDeletePage && onPreviewPage && (
          <PagesManager
            pages={pages}
            onSavePage={onSavePage}
            onDeletePage={onDeletePage}
            onPreviewPage={onPreviewPage}
          />
        )}

        {/* TAB: GESTOR DE EDITORIAS & CATEGORIAS */}
        {activeTab === 'categorias' && canManageSite && onSaveCategory && onPreviewCategory && (
          <CategoriesManager
            categories={categories}
            onSaveCategory={onSaveCategory}
            onPreviewCategory={onPreviewCategory}
          />
        )}

        {/* TAB: GESTOR DE MENUS */}
        {activeTab === 'menus' && canManageSite && menuConfig && onSaveMenuConfig && (
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
              <h3 className="font-serif text-lg font-bold text-[#0B2345]">
                Solicitar Correções ao Repórter
              </h3>
              <button
                onClick={() => setCorrectionModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5D6673]">
              Matéria: <strong>"{targetArticleForCorrection.title}"</strong> (Autor: {targetArticleForCorrection.author})
            </p>

            {correctionError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-[#B42318] text-xs rounded font-medium flex items-center justify-between">
                <span>{correctionError}</span>
                <button type="button" onClick={() => setCorrectionError(null)} className="text-red-400 hover:text-red-700">✕</button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1 text-[#0B2345]">
                Orientações Editoriais e Ajustes Obrigatórios:
              </label>
              <textarea
                rows={4}
                placeholder="Indique com clareza quais pontos devem ser retificados (ex: checar dados oficiais, melhorar título, incluir posição do ministério)..."
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                className="w-full border border-[#D9DEE7] p-2.5 rounded text-xs focus:outline-none focus:border-[#0B5FFF]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCorrectionModalOpen(false)}
                className="px-4 py-2 border border-[#D9DEE7] text-xs font-bold rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCorrection}
                className="px-4 py-2 bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold rounded transition cursor-pointer"
              >
                Devolver para Correção
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
