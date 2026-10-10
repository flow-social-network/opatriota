import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { api, isApiConfigured } from '../../services/apiClient';
import {
  PortalSettings,
  loadPortalSettings,
  savePortalSettings,
  DEFAULT_PORTAL_SETTINGS,
} from '../../services/siteConfigService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import type {
  Article,
  CategorySlug,
  FactCheckItem,
  RssSource,
  EditorialQueueItem,
  InstitutionalPage,
  CategoryDetail,
  AuthorDetail,
  SiteMenuConfig,
  ContactSubmission,
  LgpdRequest,
  SubscriptionPlan,
} from '../../types';

interface DataContextValue {
  // Data
  articles: Article[];
  factChecks: FactCheckItem[];
  sources: RssSource[];
  queueItems: EditorialQueueItem[];
  pages: InstitutionalPage[];
  categories: CategoryDetail[];
  authors: AuthorDetail[];
  menuConfig: SiteMenuConfig;
  subscriptionPlans: SubscriptionPlan[];
  contactSubmissions: ContactSubmission[];
  lgpdRequests: LgpdRequest[];
  portalSettings: PortalSettings;
  dataLoading: boolean;
  dataError: string | null;

  // Setters (exposed for admin/newsroom panels)
  setArticles: Dispatch<SetStateAction<Article[]>>;
  setSources: Dispatch<SetStateAction<RssSource[]>>;
  setQueueItems: Dispatch<SetStateAction<EditorialQueueItem[]>>;
  setPages: Dispatch<SetStateAction<InstitutionalPage[]>>;
  setCategories: Dispatch<SetStateAction<CategoryDetail[]>>;
  setMenuConfig: Dispatch<SetStateAction<SiteMenuConfig>>;
  setContactSubmissions: Dispatch<SetStateAction<ContactSubmission[]>>;
  setLgpdRequests: Dispatch<SetStateAction<LgpdRequest[]>>;

  // CRUD operations
  updateArticles: (next: Article[]) => Promise<void>;
  updateSources: (next: RssSource[]) => Promise<void>;
  updateQueue: (next: EditorialQueueItem[]) => Promise<void>;
  savePage: (page: InstitutionalPage) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  saveCategory: (category: CategoryDetail) => Promise<void>;
  saveMenuConfig: (config: SiteMenuConfig) => Promise<void>;
  savePortalSettings: (settings: PortalSettings) => Promise<void>;

  // Navigation helpers
  handleSelectCategory: (cat: CategorySlug) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const DEFAULT_MENU: SiteMenuConfig = {
  mainNav: [], topBar: [], footerCol1: [], footerCol2: [], footerCol3: [],
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [articles, setArticles] = useState<Article[]>([]);
  const [factChecks, setFactChecks] = useState<FactCheckItem[]>([]);
  const [sources, setSources] = useState<RssSource[]>([]);
  const [queueItems, setQueueItems] = useState<EditorialQueueItem[]>([]);
  const [pages, setPages] = useState<InstitutionalPage[]>([]);
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [authors, setAuthors] = useState<AuthorDetail[]>([]);
  const [menuConfig, setMenuConfig] = useState<SiteMenuConfig>(DEFAULT_MENU);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [lgpdRequests, setLgpdRequests] = useState<LgpdRequest[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [portalSettings, setPortalSettingsState] = useState<PortalSettings>(DEFAULT_PORTAL_SETTINGS);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Load portal settings on mount
  useEffect(() => {
    let active = true;
    loadPortalSettings().then((loaded) => {
      if (active && loaded) setPortalSettingsState(loaded);
    });
    return () => { active = false; };
  }, []);

  // Load data from API whenever auth state changes
  useEffect(() => {
    if (!isApiConfigured()) {
      showToast('API não configurada: defina VITE_API_BASE_URL para carregar conteúdo real.');
      setDataLoading(false);
      return;
    }
    let active = true;
    const load = async <T,>(path: string, setter: (value: T) => void, auth = false) => {
      try {
        const result = await api.get<T>(path, { auth });
        if (active) {
          setter(result);
          if (path === '/articles') setDataError(null);
        }
      } catch (error) {
        console.error('Falha ao carregar ' + path, error);
        if (active && path === '/articles') {
          setDataError(error instanceof Error ? error.message : 'Não foi possível carregar as notícias.');
        }
      }
    };
    setDataLoading(true);
    void Promise.all([
      load<SubscriptionPlan[]>('/plans', setSubscriptionPlans),
      load<Article[]>('/articles', setArticles),
      load<FactCheckItem[]>('/fact-checks', setFactChecks),
      load<RssSource[]>('/editorial/sources', setSources, true),
      load<EditorialQueueItem[]>('/editorial/queue', setQueueItems, true),
      load<InstitutionalPage[]>('/pages', setPages),
      load<CategoryDetail[]>('/categories', setCategories),
      load<AuthorDetail[]>('/authors', setAuthors),
      load<SiteMenuConfig>('/site-settings/menu', setMenuConfig),
    ]).finally(() => { if (active) setDataLoading(false); });
    return () => { active = false; };
  }, [currentUser?.id, showToast]);

  // Generic collection persistence
  const persistCollection = useCallback(async <T extends { id: string | number }>(
    collectionPath: string,
    previous: T[],
    next: T[],
    setter: Dispatch<SetStateAction<T[]>>,
  ) => {
    try {
      const prevById = new Map(previous.map(item => [String(item.id), item]));
      const nextById = new Map(next.map(item => [String(item.id), item]));
      for (const [id, item] of nextById) {
        const before = prevById.get(id);
        if (!before) await api.post(collectionPath, item);
        else if (JSON.stringify(before) !== JSON.stringify(item)) {
          await api.patch(`${collectionPath}/${encodeURIComponent(id)}`, item);
        }
      }
      for (const id of prevById.keys()) {
        if (!nextById.has(id)) await api.delete(`${collectionPath}/${encodeURIComponent(id)}`);
      }
      setter(next);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'A API não confirmou as alterações; os dados locais foram mantidos.');
    }
  }, [showToast]);

  const updateArticles = useCallback((next: Article[]) =>
    persistCollection('/articles', articles, next, setArticles), [articles, persistCollection]);

  const updateSources = useCallback((next: RssSource[]) =>
    persistCollection('/editorial/sources', sources, next, setSources), [sources, persistCollection]);

  const updateQueue = useCallback((next: EditorialQueueItem[]) =>
    persistCollection('/editorial/queue', queueItems, next, setQueueItems), [queueItems, persistCollection]);

  const savePage = useCallback(async (page: InstitutionalPage) => {
    try {
      const exists = pages.some(p => p.id === page.id);
      const persisted = exists
        ? await api.patch<InstitutionalPage>(`/pages/${encodeURIComponent(page.id)}`, page)
        : await api.post<InstitutionalPage>('/pages', page);
      setPages(current => exists
        ? current.map(p => p.id === persisted.id ? persisted : p)
        : [persisted, ...current]);
      showToast(`Página "${persisted.title}" salva no servidor.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao salvar página.');
    }
  }, [pages, showToast]);

  const deletePage = useCallback(async (pageId: string) => {
    try {
      await api.delete(`/pages/${encodeURIComponent(pageId)}`);
      setPages(current => current.filter(p => p.id !== pageId));
      showToast('Página excluída no servidor.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao excluir página.');
    }
  }, [showToast]);

  const saveCategory = useCallback(async (category: CategoryDetail) => {
    try {
      const exists = categories.some(c => c.id === category.id || c.slug === category.slug);
      const persisted = exists
        ? await api.patch<CategoryDetail>(`/categories/${encodeURIComponent(category.id)}`, category)
        : await api.post<CategoryDetail>('/categories', category);
      setCategories(current => exists
        ? current.map(c => c.id === persisted.id ? persisted : c)
        : [...current, persisted]);
      showToast(`Editoria "${persisted.name}" salva no servidor.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao salvar editoria.');
    }
  }, [categories, showToast]);

  const saveMenuConfigHandler = useCallback(async (config: SiteMenuConfig) => {
    try {
      const saved = await api.patch<SiteMenuConfig>('/site-settings/menu', config);
      setMenuConfig(saved);
      showToast('Menus gravados no servidor.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Não foi possível gravar os menus.');
    }
  }, [showToast]);

  const savePortalSettingsHandler = useCallback(async (settings: PortalSettings) => {
    const res = await savePortalSettings(settings);
    if (res.success) setPortalSettingsState(settings);
    showToast(res.message);
  }, [showToast]);

  const handleSelectCategory = useCallback((cat: CategorySlug) => {
    // Delegado ao router via evento customizado; mantido para compatibilidade
    window.dispatchEvent(new CustomEvent('navigate-category', { detail: cat }));
  }, []);

  return (
    <DataContext.Provider
      value={{
        articles, factChecks, sources, queueItems, pages, categories, authors,
        menuConfig, subscriptionPlans, contactSubmissions, lgpdRequests,
        portalSettings, dataLoading, dataError,
        setArticles, setSources, setQueueItems, setPages, setCategories,
        setMenuConfig, setContactSubmissions, setLgpdRequests,
        updateArticles, updateSources, updateQueue,
        savePage, deletePage, saveCategory,
        saveMenuConfig: saveMenuConfigHandler,
        savePortalSettings: savePortalSettingsHandler,
        handleSelectCategory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
