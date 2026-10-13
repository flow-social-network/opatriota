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

  AlertTriangle, 

  Image as ImageIcon, 
  BookOpen, 

  SlidersHorizontal,
  Globe,
  Compass,
  Menu,
  Search,
  ChevronDown,
  LayoutDashboard,
  WalletCards,
  Users,
  BarChart3,
  Settings,
  CheckCircle2
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
  onUpdateArticles: (articles: Article[]) => void | Promise<void>;
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ Inicio: true, Conteúdo: true, 'Jornal Digital': false, Editorial: false, Multimídia: false, Financeiro: false, Usuários: false, Relatórios: false, Configurações: false });

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
  const canManageContent = currentUser.role === 'administrador';

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
    if (!canManageContent) {
      showFeedback('A Redação está em modo técnico. O conteúdo é administrado pelo painel administrativo.', 'error');
      return;
    }
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
    if (!canManageContent) {
      showFeedback('A Redação está em modo técnico. O conteúdo é administrado pelo painel administrativo.', 'error');
      return;
    }
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
  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageContent) {
      showFeedback('Somente o administrador pode alterar matérias.', 'error');
      return;
    }
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
      await onUpdateArticles([newArt, ...articles]);
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
      await onUpdateArticles(updated);
      showFeedback('Alterações salvas no rascunho com sucesso!');
    }
  };

  // Submit to Review (EM REVISÃO)
  const handleSubmitToReview = async () => {
    if (!canManageContent) {
      showFeedback('Somente o administrador pode enviar matérias para revisão.', 'error');
      return;
    }
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
    await onUpdateArticles(updated);
    setEditingArticle({ ...editingArticle, editorialStatus: 'EM REVISÃO' });
    showFeedback('Matéria enviada para a fila de revisão dos Editores!');
  };

  // Approve Article (STRICT RULE: Journalist cannot approve their own story!)
  const handleApprove = async (art: Article) => {
    if (!canManageContent) {
      showFeedback('A aprovação de conteúdo é exclusiva do painel administrativo.', 'error');
      return;
    }
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
    await onUpdateArticles(updated);
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
  const handleConfirmCorrection = async () => {
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
    await onUpdateArticles(updated);
    setCorrectionModalOpen(false);
    showFeedback('Matéria devolvida para correções com notas anexadas.');
  };

  // Publish / Schedule Article
  const handlePublish = async (art: Article) => {
    if (!canManageContent) {
      showFeedback('A publicação é exclusiva do painel administrativo.', 'error');
      return;
    }
    const canPublishRoles: UserRole[] = ['administrador'];
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
    await onUpdateArticles(updated);
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

  const navigation = [
    { id: 'painel', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materias', label: 'Matérias', icon: FileText },
    { id: 'editor', label: 'Nova Matéria', icon: Plus },
    { id: 'fontes', label: 'Fontes e Contatos', icon: BookOpen },
    { id: 'midia', label: 'Mídia e Arquivos', icon: ImageIcon },
    { id: 'paginas', label: 'Páginas', icon: Globe },
    { id: 'categorias', label: 'Editorias', icon: Compass },
    { id: 'menus', label: 'Menus', icon: Menu },
  ];
  const navigationGroups = [
    { label: 'Início', icon: LayoutDashboard, items: navigation.slice(0, 1) },
    { label: 'Conteúdo', icon: FileText, items: navigation.slice(1, 7) },
    { label: 'Jornal Digital', icon: BookOpen, items: [{ id: 'paginas', label: 'Edições e Páginas', icon: Globe }] },
    { label: 'Editorial', icon: CheckCircle2, items: [{ id: 'materias', label: 'Fluxo Editorial', icon: CheckCircle2 }] },
    { label: 'Multimídia', icon: ImageIcon, items: [{ id: 'midia', label: 'Vídeos e Podcasts', icon: ImageIcon }] },
    { label: 'Financeiro', icon: WalletCards, items: [{ id: 'painel', label: 'Assinaturas e Pagamentos', icon: WalletCards }] },
    { label: 'Usuários', icon: Users, items: [{ id: 'painel', label: 'Equipe e Permissões', icon: Users }] },
    { label: 'Relatórios', icon: BarChart3, items: [{ id: 'painel', label: 'Desempenho Editorial', icon: BarChart3 }] },
    { label: 'Configurações', icon: Settings, items: [{ id: 'menus', label: 'Configurações Gerais', icon: Settings }] },
  ];

  return (
    <div className="min-h-screen bg-[#eef5fb] text-[#17202A] select-none">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[286px] shrink-0 flex-col bg-gradient-to-b from-[#062F51] to-[#031A2E] text-white shadow-2xl lg:flex">
          <div className="border-b border-white/15 px-4 py-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0875bd] text-xl font-black shadow-sm">OP</div><div><div className="font-serif text-[18px] font-black leading-tight">O PATRIOTA</div><div className="text-[9px] uppercase tracking-widest text-white/60">Painel da redação</div></div></div></div>
          <nav className="flex-1 overflow-y-auto p-2" aria-label="Navegação da redação">
            <div className="space-y-1">{navigationGroups.map((group) => { const GroupIcon = group.icon; const open = expandedGroups[group.label]; return <div key={group.label} className="rounded-xl border border-white/15 bg-white/[.03]"><button type="button" onClick={() => setExpandedGroups((current) => ({ ...current, [group.label]: !current[group.label] }))} className="flex w-full items-center gap-3 px-3 py-3 text-left font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0875bd] text-white"><GroupIcon className="size-4" /></span><span className="flex-1 text-[13px]">{group.label}</span><ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <div className="space-y-0.5 px-2 pb-2">{group.items.map((item) => { const Icon = item.icon; const active = activeTab === item.id; return <button key={`${group.label}-${item.id}-${item.label}`} disabled={item.id === 'editor' && !canManageContent} onClick={() => { setActiveTab(item.id as any); setEditingArticle(null); if (item.id === 'editor') handleOpenCreate(); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[11px] font-semibold transition ${active ? 'bg-[#0875bd] text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'} ${item.id === 'editor' && !canManageContent ? 'cursor-not-allowed opacity-50' : ''}`}><Icon className="size-4" />{item.label}</button>; })}</div>}</div>; })}</div>
          </nav>
          <div className="border-t border-white/15 p-3 text-[11px] text-white/75">{currentUser.name}<div className="text-[10px] text-white/50">{currentUser.role.replace('_', ' ')}</div></div>
        </aside>
        <main className="min-w-0 flex-1 lg:ml-[286px]">
          <header className="fixed inset-x-0 top-0 z-30 h-[74px] border-b border-[#c7d9ea] bg-white/95 px-4 backdrop-blur md:px-7 lg:left-[286px] flex items-center justify-between gap-4">
            <div><p className="text-[11px] font-bold text-[#8195a8]">O PATRIOTA / REDAÇÃO</p><h1 className="text-lg font-black text-[#153d61]">{activeTab === 'painel' ? 'Painel Principal' : navigation.find((item) => item.id === activeTab)?.label || 'Redação'}</h1></div>
            <div className="flex items-center gap-3"><label className="hidden md:flex h-9 w-72 rounded-md bg-[#f1f6fa] border border-[#d7e5ef] items-center gap-2 px-3 text-xs text-[#8aa0b2]"><Search className="size-4 shrink-0 text-[#0875bd]" aria-hidden="true" /><input aria-label="Buscar na redação" placeholder="Buscar matérias, pautas, autores..." className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8aa0b2]" /></label><button onClick={handleOpenCreate} disabled={!canManageContent} className="flex items-center gap-1.5 rounded-md bg-[#0875bd] px-3 py-2 text-xs font-bold text-white hover:bg-[#0564aa] disabled:cursor-not-allowed disabled:opacity-50"><Plus className="size-4" /> Nova matéria</button><div className="hidden sm:block text-right"><div className="text-xs font-bold text-[#153d61]">{currentUser.name}</div><div className="text-[10px] text-[#7b91a4]">{currentUser.role.replace('_', ' ')}</div></div><div className="size-9 rounded-full bg-[#d9eafa] text-[#0875bd] flex items-center justify-center text-xs font-black">{currentUser.name.slice(0, 2).toUpperCase()}</div></div>
          </header>
          {!canManageContent && <div className="mt-[74px] border-b border-[#f0c36d] bg-[#fff7e6] px-6 py-2 text-xs font-semibold text-[#8a5a00]">Modo técnico: consulta e manutenção da redação. Conteúdo, aprovação e publicação são administrados no painel administrativo.</div>}
          {feedbackMsg && <div className={`${canManageContent ? 'mt-[74px]' : ''} px-6 py-2.5 text-xs font-semibold flex items-center gap-2 ${feedbackMsg.type === 'error' ? 'bg-[#FEF3F2] text-[#B42318] border-b border-[#B42318]/30' : 'bg-[#EBF7EE] text-[#16803C] border-b border-[#16803C]/30'}`}><AlertTriangle className="size-4" /><span>{feedbackMsg.text}</span></div>}
          <div className={`w-full px-4 pb-5 md:px-7 ${canManageContent ? 'pt-[94px]' : 'pt-[86px]'}`}>

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
        </main>
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
