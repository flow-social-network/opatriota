import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EditorialGrid } from './components/EditorialGrid';
import { FactCheckRibbon } from './components/FactCheckRibbon';
import { BrandPillarsFooter } from './components/BrandPillarsFooter';
import { Footer } from './components/Footer';
import { ArticleView } from './components/ArticleView';
import { FactCheckHub } from './components/FactCheckHub';
import { AdminDashboard } from './components/AdminDashboard';
import { SubscriberPortal } from './components/subscriber/SubscriberPortal';
import { NewsroomDashboard } from './components/newsroom/NewsroomDashboard';
import { SupportModal } from './components/SupportModal';
import { observeAuth, signInWithGoogle, signOutFromFirebase } from './services/firebaseAuthService';
import { api, isApiConfigured } from './services/apiClient';

// Model Pages Components
import { InstitutionalPageView } from './components/pages/InstitutionalPageView';
import { CategoryPageView } from './components/pages/CategoryPageView';
import { AuthorPageView } from './components/pages/AuthorPageView';
import { SearchPageView } from './components/pages/SearchPageView';
import { ArchivePageView } from './components/pages/ArchivePageView';
import { ContactPageView } from './components/pages/ContactPageView';
import { LgpdPageView } from './components/pages/LgpdPageView';
import { PlansPageView } from './components/pages/PlansPageView';
import { CheckoutWizard } from './components/pages/CheckoutWizard';
import { NotFoundPageView } from './components/pages/NotFoundPageView';
import { CustomPageView } from './components/pages/CustomPageView';

import { 
  PortalSettings, 
  loadPortalSettings, 
  savePortalSettings, 
  DEFAULT_PORTAL_SETTINGS 
} from './services/siteConfigService';

import { 
  Article, 
  CategorySlug, 
  FactCheckItem, 
  RssSource, 
  EditorialQueueItem, 
  UserSession,
  InstitutionalPage,
  CategoryDetail,
  AuthorDetail,
  SiteMenuConfig,
  ContactSubmission,
  LgpdRequest
} from './types';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<
    'home' | 
    'article' | 
    'category' | 
    'author' | 
    'search' | 
    'archive' | 
    'contact' | 
    'lgpd' | 
    'plans' | 
    'checkout' | 
    'notfound' | 
    'institutional' | 
    'custom' | 
    'factcheck' | 
    'admin' | 
    'subscriber' | 
    'newsroom'
  >('home');

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>('todos');
  const [selectedPage, setSelectedPage] = useState<InstitutionalPage | null>(null);
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState<CategoryDetail | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorDetail | null>(null);
  const [subscriberSubpage, setSubscriberSubpage] = useState<string>('dashboard');
  const [selectedCheckoutPlanId, setSelectedCheckoutPlanId] = useState<string>('digital');
  
  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [factChecks, setFactChecks] = useState<FactCheckItem[]>([]);
  const [sources, setSources] = useState<RssSource[]>([]);
  const [queueItems, setQueueItems] = useState<EditorialQueueItem[]>([]);
  
  // Pages & Navigation Data
  const [pages, setPages] = useState<InstitutionalPage[]>([]);
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [authors, setAuthors] = useState<AuthorDetail[]>([]);
  const [menuConfig, setMenuConfig] = useState<SiteMenuConfig>({ mainNav: [], topBar: [], footerCol1: [], footerCol2: [], footerCol3: [] });
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [lgpdRequests, setLgpdRequests] = useState<LgpdRequest[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<import('./types').SubscriptionPlan[]>([]);

  // A sessão real é restaurada pelo Firebase; enquanto isso, o visitante permanece sem identidade.
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Portal Settings (Identity, Logos, Social Networks, Ad Slots, AdSense)
  const [portalSettings, setPortalSettings] = useState<PortalSettings>(DEFAULT_PORTAL_SETTINGS);

  useEffect(() => {
    const unsubscribe = observeAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Carrega dados reais da API sem preencher a interface com conteúdo fictício.
  useEffect(() => {
    if (!isApiConfigured()) {
      setToastMessage('API não configurada: defina VITE_API_BASE_URL para carregar conteúdo real.');
      return;
    }
    let active = true;
    const load = async <T,>(path: string, setter: (value: T) => void, auth = false) => {
      try {
        const result = await api.get<T>(path, { auth });
        if (active) setter(result);
      } catch (error) {
        console.error('Falha ao carregar ' + path, error);
      }
    };
    void Promise.all([
      load<import('./types').SubscriptionPlan[]>('/plans', setSubscriptionPlans),
      load<Article[]>('/articles', setArticles),
      load<FactCheckItem[]>('/fact-checks', setFactChecks),
      load<RssSource[]>('/editorial/sources', setSources, true),
      load<EditorialQueueItem[]>('/editorial/queue', setQueueItems, true),
      load<InstitutionalPage[]>('/pages', setPages),
      load<CategoryDetail[]>('/categories', setCategories),
      load<AuthorDetail[]>('/authors', setAuthors),
      load<SiteMenuConfig>('/site-settings/menu', setMenuConfig),
    ]);
    return () => { active = false; };
  }, []);

  // Load persistent settings from the centralized portal service on mount
  useEffect(() => {
    let isMounted = true;
    loadPortalSettings().then((loaded) => {
      if (isMounted && loaded) {
        setPortalSettings(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSavePortalSettings = async (newSettings: PortalSettings) => {
    const res = await savePortalSettings(newSettings);
    if (res.success) setPortalSettings(newSettings);
    showToast(res.message);
  };

  // Modals & Notifications
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => prev === message ? null : prev);
    }, 4000);
  };

  // Handlers
  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedCategory('todos');
    setSelectedArticle(null);
    setSelectedPage(null);
    setSelectedCategoryDetail(null);
    setSelectedAuthor(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: CategorySlug) => {
    if (cat === 'checagem') {
      setCurrentView('factcheck');
      setSelectedCategory('checagem');
    } else if (cat === 'todos') {
      handleNavigateHome();
    } else {
      const foundCat = categories.find(c => c.slug === cat);
      if (foundCat) {
        setSelectedCategoryDetail(foundCat);
      } else {
        showToast('Esta editoria ainda não existe no conteúdo publicado.');
        return;
      }
      setSelectedCategory(cat);
      setCurrentView('category');
      setSelectedArticle(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAuthor = (authorNameOrId: string) => {
    const q = authorNameOrId.toLowerCase();
    const found = authors.find(a => 
      a.name.toLowerCase() === q || 
      a.id.toLowerCase() === q || 
      a.slug.toLowerCase() === q ||
      a.name.toLowerCase().includes(q)
    );

    if (found) {
      setSelectedAuthor(found);
      setCurrentView('author');
    } else {
      showToast('O perfil deste autor ainda não está cadastrado no servidor.');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePage = (rawSlug: string) => {
    const slug = rawSlug.replace(/^\/|\/$/g, '');

    // 1. Direct standard routes
    if (slug === 'minha-conta') {
      handleOpenSubscriberArea('dashboard');
      return;
    }
    if (slug === 'redacao') {
      handleOpenNewsroom();
      return;
    }
    if (slug === 'planos' || slug === 'apoie-o-jornal') {
      setCurrentView('plans');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (slug === 'contato') {
      setCurrentView('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (slug === 'gestao-de-dados') {
      setCurrentView('lgpd');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (slug === 'arquivo') {
      setCurrentView('archive');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (slug === 'busca') {
      setCurrentView('search');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (slug === 'checagem') {
      setCurrentView('factcheck');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Category check
    if (slug.startsWith('categoria/')) {
      const catSlug = slug.replace('categoria/', '') as CategorySlug;
      handleSelectCategory(catSlug);
      return;
    }
    const catMatch = categories.find(c => c.slug === slug);
    if (catMatch) {
      handleSelectCategory(catMatch.slug);
      return;
    }

    // 3. Institutional or Custom Page check
    const pageMatch = pages.find(p => p.slug === slug);
    if (pageMatch) {
      setSelectedPage(pageMatch);
      if (pageMatch.model === 'institucional') {
        setCurrentView('institutional');
      } else if (pageMatch.model === 'contato') {
        setCurrentView('contact');
      } else if (pageMatch.model === 'planos') {
        setCurrentView('plans');
      } else {
        setCurrentView('custom');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. Fallback 404
    setCurrentView('notfound');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFactCheck = (item: FactCheckItem) => {
    setCurrentView('factcheck');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : searchQuery).trim();
    if (!q) return;
    setSearchQuery(q);
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (artId: string) => {
    if (!currentUser) {
      setCurrentView('subscriber');
      setSubscriberSubpage('entrar');
      return;
    }
    const currentBookmarks = currentUser.bookmarks || [];
    const exists = currentBookmarks.includes(artId);
    const updatedBookmarks = exists
      ? currentBookmarks.filter(id => id !== artId)
      : [...currentBookmarks, artId];

    void api.put('/me/bookmarks', { bookmarks: updatedBookmarks }).then(() => {
      setCurrentUser({ ...currentUser, bookmarks: updatedBookmarks });
    }).catch(() => showToast('Não foi possível guardar os favoritos no servidor.'));
  };

  const handleOpenSubscriberArea = (subpage: string = 'dashboard') => {
    setSubscriberSubpage(subpage);
    setCurrentView('subscriber');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewsroom = () => {
    if (!currentUser || !['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'].includes(currentUser.role)) {
      showToast('Acesso restrito à equipe editorial autorizada.');
      return;
    }
    setCurrentView('newsroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      showToast(error instanceof Error && error.message === 'AUTH_NOT_CONFIGURED'
        ? 'Autenticação Google ainda não configurada neste ambiente.'
        : 'Não foi possível concluir o acesso com Google.');
    }
  };

  const handleGoogleLogout = async () => {
    await signOutFromFirebase();
    setCurrentUser(null);
    handleNavigateHome();
  };

  const handleSwitchStaffRole = (_roleKey: string) => {
    showToast('A função da equipa é atribuída pelo backend; não é possível alterná-la no navegador.');
  };

  const persistCollectionChanges = async <T extends { id: string | number }>(
    collectionPath: string,
    previous: T[],
    next: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    try {
      const previousById = new Map(previous.map(item => [String(item.id), item]));
      const nextById = new Map(next.map(item => [String(item.id), item]));
      for (const [id, item] of nextById) {
        const before = previousById.get(id);
        if (!before) await api.post(collectionPath, item);
        else if (JSON.stringify(before) !== JSON.stringify(item)) {
          await api.patch(`${collectionPath}/${encodeURIComponent(id)}`, item);
        }
      }
      for (const id of previousById.keys()) {
        if (!nextById.has(id)) await api.delete(`${collectionPath}/${encodeURIComponent(id)}`);
      }
      setter(next);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'A API não confirmou as alterações; os dados locais foram mantidos.');
    }
  };

  const handleUpdateArticles = (next: Article[]) => {
    void persistCollectionChanges('/articles', articles, next, setArticles);
  };

  const handleUpdateSources = (next: RssSource[]) => {
    void persistCollectionChanges('/editorial/sources', sources, next, setSources);
  };

  const handleSaveMenuConfig = async (config: SiteMenuConfig) => {
    try {
      const saved = await api.patch<SiteMenuConfig>('/site-settings/menu', config);
      setMenuConfig(saved);
      showToast('Menus gravados no servidor.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Não foi possível gravar os menus.');
    }
  };

  // CMS Pages management handlers
  const handleSavePage = async (savedPage: InstitutionalPage) => {
    try {
      const exists = pages.some(p => p.id === savedPage.id);
      const persisted = exists
        ? await api.patch<InstitutionalPage>(`/pages/${encodeURIComponent(savedPage.id)}`, savedPage)
        : await api.post<InstitutionalPage>('/pages', savedPage);
      setPages(current => exists
        ? current.map(p => p.id === persisted.id ? persisted : p)
        : [persisted, ...current]);
      showToast(`Página "${persisted.title}" salva no servidor.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao salvar página. Nenhuma alteração foi confirmada.');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    try {
      await api.delete(`/pages/${encodeURIComponent(pageId)}`);
      setPages(current => current.filter(p => p.id !== pageId));
      showToast('Página excluída no servidor.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao excluir página.');
    }
  };

  // CMS Category management handlers
  const handleSaveCategory = async (savedCategory: CategoryDetail) => {
    try {
      const exists = categories.some(c => c.id === savedCategory.id || c.slug === savedCategory.slug);
      const persisted = exists
        ? await api.patch<CategoryDetail>(`/categories/${encodeURIComponent(savedCategory.id)}`, savedCategory)
        : await api.post<CategoryDetail>('/categories', savedCategory);
      setCategories(current => exists
        ? current.map(c => c.id === persisted.id ? persisted : c)
        : [...current, persisted]);
      showToast(`Editoria "${persisted.name}" salva no servidor.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao salvar editoria.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-sans antialiased text-[#17202A]">
      {/* 1. Header (Sticky navigation, Date, Weather, Logo, Search, Pillars, Subscriber & Newsroom buttons) */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onOpenSupport={() => setSupportModalOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenSubscriberArea={handleOpenSubscriberArea}
        onOpenNewsroom={handleOpenNewsroom}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
        onNavigatePage={handleNavigatePage}
        currentUser={currentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() => handleSearchSubmit()}
        portalSettings={portalSettings}
      />

      {/* VIEW: HOME (Front Page Layout) */}
      {currentView === 'home' && (
        <main className="flex-1">

          <div className="max-w-[1360px] mx-auto px-4 py-8">
            <HeroSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
            />

            <EditorialGrid
              articles={articles}
              onSelectArticle={handleSelectArticle}
            />

            <FactCheckRibbon
              factChecks={factChecks}
              onOpenFactCheck={handleOpenFactCheck}
              onOpenHub={() => setCurrentView('factcheck')}
            />
          </div>
        </main>
      )}

      {/* VIEW: ARTICLE READING MODE (MODELO 3) */}
      {currentView === 'article' && selectedArticle && (
        <main className="flex-1">
          <ArticleView
            article={selectedArticle}
            onBack={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
            onSelectArticle={handleSelectArticle}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id)}
            currentUser={currentUser}
            onToggleBookmark={handleToggleBookmark}
            onOpenSubscribe={() => handleOpenSubscriberArea('assinatura')}
            onOpenLogin={() => handleOpenSubscriberArea('entrar')}
            onSelectAuthor={handleSelectAuthor}
          />
        </main>
      )}

      {/* VIEW: CATEGORY PAGE (MODELO 2 — PÁGINA AUTOMÁTICA DE CATEGORIA) */}
      {currentView === 'category' && selectedCategoryDetail && (
        <main className="flex-1">
          <CategoryPageView
            category={selectedCategoryDetail}
            articles={articles}
            allCategories={categories}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onNavigateHome={handleNavigateHome}
            onSearch={handleSearchSubmit}
          />
        </main>
      )}

      {/* VIEW: AUTHOR PROFILE PAGE (MODELO 4 — PÁGINA DE AUTOR) */}
      {currentView === 'author' && selectedAuthor && (
        <main className="flex-1">
          <AuthorPageView
            author={selectedAuthor}
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onNavigateHome={handleNavigateHome}
          />
        </main>
      )}

      {/* VIEW: SEARCH PAGE (MODELO 5 ��� PÁGINA DE PESQUISA) */}
      {currentView === 'search' && (
        <main className="flex-1">
          <SearchPageView
            initialQuery={searchQuery}
            articles={articles}
            categories={categories}
            onSelectArticle={handleSelectArticle}
            onNavigateHome={handleNavigateHome}
          />
        </main>
      )}

      {/* VIEW: ARCHIVE PAGE (MODELO 6 — PÁGINA DE ARQUIVO) */}
      {currentView === 'archive' && (
        <main className="flex-1">
          <ArchivePageView
            articles={articles}
            categories={categories}
            authors={authors}
            onSelectArticle={handleSelectArticle}
            onNavigateHome={handleNavigateHome}
          />
        </main>
      )}

      {/* VIEW: CONTACT PAGE (MODELO 7 — FALE COM A REDAÇÃO) */}
      {currentView === 'contact' && (
        <main className="flex-1">
          <ContactPageView
            onNavigateHome={handleNavigateHome}
            onSubmitContact={async (submission) => {
              const result = await api.post<{ id: string; protocol: string }>('/contact-submissions', {
                name: submission.name, email: submission.email, phone: submission.phone,
                subject: submission.subject, articleRef: submission.articleRef, message: submission.message
              }, { auth: false });
              setContactSubmissions(current => [{ ...submission, id: result.id }, ...current]);
              return result;
            }}
          />
        </main>
      )}

      {/* VIEW: LGPD DATA MANAGEMENT PAGE */}
      {currentView === 'lgpd' && (
        <main className="flex-1">
          <LgpdPageView
            onNavigateHome={handleNavigateHome}
            onSubmitLgpd={async (request) => {
              const result = await api.post<{ id: string; protocol: string }>('/privacy-requests', {
                name: request.name, email: request.email, documentId: request.documentId,
                requestType: request.requestType, details: request.details
              }, { auth: false });
              setLgpdRequests(current => [{ ...request, id: result.id }, ...current]);
              return result;
            }}
          />
        </main>
      )}

      {/* VIEW: PLANS & SUBSCRIPTIONS (MODELO 9 — PLANOS E ASSINATURAS) */}
      {currentView === 'plans' && (
        <main className="flex-1">
          <PlansPageView
            plans={subscriptionPlans}
            currentUser={currentUser}
            onSelectPlan={(planId) => {
              setSelectedCheckoutPlanId(planId);
              setCurrentView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={handleNavigateHome}
          />
        </main>
      )}

      {/* VIEW: THREE-STEP SUBSCRIPTION CHECKOUT */}
      {currentView === 'checkout' && (
        <CheckoutWizard
          plans={subscriptionPlans}
          selectedPlanId={selectedCheckoutPlanId}
          currentUser={currentUser}
          onBack={() => setCurrentView('plans')}
          onOpenAccount={handleOpenSubscriberArea}
        />
      )}

      {/* VIEW: INSTITUTIONAL PAGE (MODELO 1 — PÁGINA INSTITUCIONAL) */}
      {currentView === 'institutional' && selectedPage && (
        <main className="flex-1">
          <InstitutionalPageView
            page={selectedPage}
            onNavigateHome={handleNavigateHome}
            onNavigatePage={handleNavigatePage}
            onNavigateContact={() => setCurrentView('contact')}
          />
        </main>
      )}

      {/* VIEW: CUSTOM PAGE (MODELO 11 — PÁGINA PERSONALIZADA) */}
      {currentView === 'custom' && selectedPage && (
        <main className="flex-1">
          <CustomPageView
            page={selectedPage}
            onNavigateHome={handleNavigateHome}
            onNavigatePage={handleNavigatePage}
          />
        </main>
      )}

      {/* VIEW: 404 NOT FOUND (MODELO 10 — PÁGINA DE ERRO 404) */}
      {currentView === 'notfound' && (
        <main className="flex-1">
          <NotFoundPageView
            categories={categories}
            recentArticles={articles.slice(0, 4)}
            onNavigateHome={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
            onSelectArticle={handleSelectArticle}
            onSearch={handleSearchSubmit}
          />
        </main>
      )}

      {/* VIEW: FACT-CHECKING HUB */}
      {currentView === 'factcheck' && (
        <main className="flex-1">
          <FactCheckHub
            factChecks={factChecks}
            onBack={handleNavigateHome}
            onOpenItem={handleOpenFactCheck}
          />
        </main>
      )}

      {/* VIEW: ÁREA DO ASSINANTE (/minha-conta/*) */}
      {currentView === 'subscriber' && (
        <main className="flex-1">
          <SubscriberPortal
            currentUser={currentUser}
            onLogin={(user) => setCurrentUser(user)}
            onLogout={() => { setCurrentUser(null); handleNavigateHome(); }}
            onBackToHome={handleNavigateHome}
            articles={articles}
            onSelectArticle={handleSelectArticle}
            initialSubpage={subscriberSubpage}
          />
        </main>
      )}

      {/* VIEW: ÁREA DA REDAÇÃO (/redacao) COM CMS COMPLETO */}
      {currentView === 'newsroom' && currentUser && (
        <main className="flex-1">
          <NewsroomDashboard
            articles={articles}
            sources={sources}
            onUpdateSources={handleUpdateSources}
            currentUser={currentUser}
            onUpdateArticles={handleUpdateArticles}
            onBackToHome={handleNavigateHome}
            onSwitchStaffRole={handleSwitchStaffRole}
            pages={pages}
            onSavePage={handleSavePage}
            onDeletePage={handleDeletePage}
            onPreviewPage={handleNavigatePage}
            categories={categories}
            onSaveCategory={handleSaveCategory}
            onPreviewCategory={handleSelectCategory}
            menuConfig={menuConfig}
            onSaveMenuConfig={handleSaveMenuConfig}
          />
        </main>
      )}

      {/* VIEW: WORDPRESS BACKOFFICE / FONTES & DEDUPLICAÇÃO */}
      {currentView === 'admin' && (
        <main className="flex-1">
          <AdminDashboard
            sources={sources}
            queueItems={queueItems}
            onBack={handleNavigateHome}
            onUpdateSource={setSources}
            onUpdateQueue={setQueueItems}
            portalSettings={portalSettings}
            onSavePortalSettings={handleSavePortalSettings}
          />
        </main>
      )}

      {/* 4. Brazilian Brand Pillars Banner Ribbon */}
      <BrandPillarsFooter />

      {/* 5. Comprehensive Multi-tier Footer with 3 Official Columns */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenSupport={() => setSupportModalOpen(true)}
        onNavigatePage={handleNavigatePage}
        menuConfig={menuConfig}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      {/* Floating Toast Feedback */}
      {toastMessage && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#0B2345] text-white px-4 py-3 rounded-lg shadow-xl border border-[#FFCC29] text-xs sm:text-sm flex items-center gap-3 animate-fade-in"
        >
          <span className="font-medium">{toastMessage}</span>
          <button 
            type="button"
            onClick={() => setToastMessage(null)} 
            className="text-white/70 hover:text-white font-bold ml-2 cursor-pointer"
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
