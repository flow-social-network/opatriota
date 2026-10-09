import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EditorialGrid } from './components/EditorialGrid';
import { FactCheckRibbon } from './components/FactCheckRibbon';
import { BrandPillarsFooter } from './components/BrandPillarsFooter';
import { Footer } from './components/Footer';
import { LiveSourceNews } from './components/LiveSourceNews';
import { ArticleView } from './components/ArticleView';
import { FactCheckHub } from './components/FactCheckHub';
import { FactCheckSubmissionPage } from './components/FactCheckSubmissionPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { SubscriberPortal } from './components/subscriber/SubscriberPortal';
import { NewsroomDashboard } from './components/newsroom/NewsroomDashboard';
import { SupportModal } from './components/SupportModal';
import { AuthModal } from './components/AuthModal';
import { observeAuth, signInWithGoogle, signInWithFacebook, signOutFromFirebase } from './services/firebaseAuthService';

// Model Pages Components
import { InstitutionalPageView } from './components/pages/InstitutionalPageView';
import { CategoryPageView } from './components/pages/CategoryPageView';
import { AuthorPageView } from './components/pages/AuthorPageView';
import { SearchPageView } from './components/pages/SearchPageView';
import { ArchivePageView } from './components/pages/ArchivePageView';
import { ContactPageView } from './components/pages/ContactPageView';
import { LgpdPageView } from './components/pages/LgpdPageView';
import { PlansPageView } from './components/pages/PlansPageView';
import { NotFoundPageView } from './components/pages/NotFoundPageView';
import { CustomPageView } from './components/pages/CustomPageView';

import { 
  INITIAL_ARTICLES, 
  INITIAL_FACT_CHECKS, 
  INITIAL_RSS_SOURCES, 
  INITIAL_EDITORIAL_QUEUE,
  DEMO_USERS,
  SUBSCRIPTION_PLANS
} from './data/mockData';

import { 
  INITIAL_PAGES, 
  INITIAL_CATEGORIES, 
  INITIAL_AUTHORS, 
  INITIAL_MENU_CONFIG,
  INITIAL_CONTACT_SUBMISSIONS,
  INITIAL_LGPD_REQUESTS
} from './data/pagesData';

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
    'notfound' | 
    'institutional' | 
    'custom' | 
    'factcheck' | 
    'factcheck-submit' | 
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
  
  // Data States
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [factChecks, setFactChecks] = useState<FactCheckItem[]>(INITIAL_FACT_CHECKS);
  const [sources, setSources] = useState<RssSource[]>(INITIAL_RSS_SOURCES);
  const [queueItems, setQueueItems] = useState<EditorialQueueItem[]>(INITIAL_EDITORIAL_QUEUE);
  
  // Pages & Navigation Data
  const [pages, setPages] = useState<InstitutionalPage[]>(INITIAL_PAGES);
  const [categories, setCategories] = useState<CategoryDetail[]>(INITIAL_CATEGORIES);
  const [authors, setAuthors] = useState<AuthorDetail[]>(INITIAL_AUTHORS);
  const [menuConfig, setMenuConfig] = useState<SiteMenuConfig>(INITIAL_MENU_CONFIG);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(INITIAL_CONTACT_SUBMISSIONS);
  const [lgpdRequests, setLgpdRequests] = useState<LgpdRequest[]>(INITIAL_LGPD_REQUESTS);

  // A sessão real é restaurada pelo Firebase; enquanto isso, o visitante permanece sem identidade.
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Portal Settings (Identity, Logos, Social Networks, Ad Slots, AdSense)
  const [portalSettings, setPortalSettings] = useState<PortalSettings>(DEFAULT_PORTAL_SETTINGS);

  useEffect(() => {
    const openFactCheckSubmit = () => setCurrentView('factcheck-submit');
    window.addEventListener('opatriota:open-fact-check-submit', openFactCheckSubmit);
    return () => window.removeEventListener('opatriota:open-fact-check-submit', openFactCheckSubmit);
  }, []);

  useEffect(() => {
    const unsubscribe = observeAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) setAuthModalOpen(false);
    });
    return unsubscribe;
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
    setPortalSettings(newSettings);
    const res = await savePortalSettings(newSettings);
    showToast(res.message);
  };

  // Modals & Notifications
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
        // Fallback detail if newly created
        setSelectedCategoryDetail({
          id: `cat-${cat}`,
          slug: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          description: `Cobertura de ${cat} no portal O Patriota.`,
          introText: `Notícias e análises de ${cat}.`,
          active: true,
          order: 99
        });
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
      // Dynamic profile creation for journalist if not in initial list
      const dynamicAuthor: AuthorDetail = {
        id: `usr-${Date.now()}`,
        slug: authorNameOrId.toLowerCase().replace(/\s+/g, '-'),
        name: authorNameOrId,
        role: 'Repórter da Redação O Patriota',
        bio: `${authorNameOrId} integra o corpo jornalístico de O Patriota com atuação na apuração de fatos nacionais e defesa da liberdade de informação.`,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
        credentials: 'DRT/DF • Membro da Equipe de Redação'
      };
      setSelectedAuthor(dynamicAuthor);
      setCurrentView('author');
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
    if (slug === 'enviar-checagem') {
      setCurrentView('factcheck-submit');
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

    setCurrentUser({
      ...currentUser,
      bookmarks: updatedBookmarks
    });
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

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      showToast(code === 'AUTH_NOT_CONFIGURED'
        ? 'Autenticação ainda não configurada neste ambiente.'
        : 'Não foi possível concluir o acesso com Facebook. Verifique se o provedor está habilitado.');
    }
  };

  const handleGoogleLogout = async () => {
    await signOutFromFirebase();
    setCurrentUser(null);
    handleNavigateHome();
  };

  const handleSwitchStaffRole = (roleKey: string) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
    }
  };

  // CMS Pages management handlers
  const handleSavePage = (savedPage: InstitutionalPage) => {
    const exists = pages.some(p => p.id === savedPage.id);
    const updated = exists
      ? pages.map(p => p.id === savedPage.id ? savedPage : p)
      : [savedPage, ...pages];
    setPages(updated);
    showToast(`Página "${savedPage.title}" salva com sucesso no portal!`);
  };

  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(p => p.id !== pageId));
    showToast('Página excluída do sistema com sucesso.');
  };

  // CMS Category management handlers
  const handleSaveCategory = (savedCategory: CategoryDetail) => {
    const exists = categories.some(c => c.id === savedCategory.id || c.slug === savedCategory.slug);
    const updated = exists
      ? categories.map(c => c.slug === savedCategory.slug ? savedCategory : c)
      : [...categories, savedCategory];
    setCategories(updated);
    showToast(`Editoria "${savedCategory.name}" salva! Página /categoria/${savedCategory.slug}/ atualizada.`);
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
        onOpenAuthModal={() => setAuthModalOpen(true)}
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
            {/* A capa usa o feed publicado pelas fontes; os artigos de demonstração
                não devem aparecer como se fossem notícias atuais. */}
            <LiveSourceNews />

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
            onSubmitContact={(submission) => {
              setContactSubmissions([submission, ...contactSubmissions]);
            }}
          />
        </main>
      )}

      {/* VIEW: LGPD DATA MANAGEMENT PAGE */}
      {currentView === 'lgpd' && (
        <main className="flex-1">
          <LgpdPageView
            onNavigateHome={handleNavigateHome}
            onSubmitLgpd={(req) => {
              setLgpdRequests([req, ...lgpdRequests]);
            }}
          />
        </main>
      )}

      {/* VIEW: PLANS & SUBSCRIPTIONS (MODELO 9 — PLANOS E ASSINATURAS) */}
      {currentView === 'plans' && (
        <main className="flex-1">
          <PlansPageView
            plans={SUBSCRIPTION_PLANS}
            currentUser={currentUser}
            onSelectPlan={(planId) => {
              handleOpenSubscriberArea(currentUser ? 'assinatura' : 'entrar');
            }}
            onNavigateHome={handleNavigateHome}
          />
        </main>
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
            onStartCheck={() => setCurrentView('factcheck-submit')}
          />
        </main>
      )}

      {/* VIEW: ENVIO DE MATERIAL PARA CHECAGEM */}
      {currentView === 'factcheck-submit' && (
        <main className="flex-1">
          <FactCheckSubmissionPage onBack={() => setCurrentView('factcheck')} />
        </main>
      )}

      {/* VIEW: ÁREA DO ASSINANTE (/minha-conta/*) */}
      {currentView === 'subscriber' && (
        <main className="flex-1">
          <SubscriberPortal
            currentUser={currentUser}
            onLogin={(user) => setCurrentUser(user)}
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
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
            onUpdateSources={setSources}
            currentUser={currentUser}
            onUpdateArticles={setArticles}
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
            onSaveMenuConfig={setMenuConfig}
          />
        </main>
      )}

      {/* VIEW: WORDPRESS BACKOFFICE / FONTES & DEDUPLICAÇÃO */}
      {currentView === 'admin' && (
        currentUser && (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((email: string) => email.trim().toLowerCase()).filter(Boolean).includes(currentUser.email.toLowerCase()) ? (
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
        ) : currentUser ? (
          <main className="flex flex-1 items-center justify-center px-4 py-16">
            <section className="max-w-lg rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <h1 className="text-2xl font-bold text-[#0B2345]">Acesso não autorizado</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">Esta conta Google não está autorizada para administrar O Patriota Brasil. Solicite ao responsável que inclua o e-mail institucional na lista de administradores.</p>
              <button type="button" onClick={handleGoogleLogout} className="mt-6 rounded-lg bg-[#0B2345] px-5 py-3 font-semibold text-white">Sair da conta</button>
            </section>
          </main>
        ) : (
          <AdminLoginPage onGoogleLogin={handleGoogleLogin} onBack={handleNavigateHome} error={toastMessage} />
        )
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

      {/* Login/cadastro em janela modal, sem abandonar a página atual. */}
      {authModalOpen && !currentUser && (
        <AuthModal onClose={() => setAuthModalOpen(false)} onGoogleLogin={handleGoogleLogin} onFacebookLogin={handleFacebookLogin} />
      )}

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
