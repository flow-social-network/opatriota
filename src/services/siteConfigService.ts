import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  PortalSettings, 
  SiteIdentityConfig, 
  SocialNetworkItem, 
  AdSenseGlobalConfig, 
  AdSlotConfig,
  NewsletterSubscriber,
  WebPushConfig 
} from '../types';

export type { 
  PortalSettings, 
  SiteIdentityConfig, 
  SocialNetworkItem, 
  AdSenseGlobalConfig, 
  AdSlotConfig, 
  NewsletterSubscriber,
  WebPushConfig 
};

// Official Firebase configuration provided for O Patriota
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAM7XqRKi2DWNvEpwZZTg99QGgq75_FWgc",
  authDomain: "o-patriota-5db52.firebaseapp.com",
  projectId: "o-patriota-5db52",
  storageBucket: "o-patriota-5db52.firebasestorage.app",
  messagingSenderId: "144044011965",
  appId: "1:144044011965:web:6da58292d47845e931e2d4",
  measurementId: "G-DSWWC4VLNP"
};

// Initialize Firebase App safely (singleton)
export const firebaseApp = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
export const firestoreDb = getFirestore(firebaseApp);

export const DEFAULT_IDENTITY_CONFIG: SiteIdentityConfig = {
  headerLogoType: 'default_svg',
  headerLogoUrl: '',
  headerLogoAlt: 'O Patriota — Informação com Liberdade por um Brasil Mais Forte',
  headerLogoWidth: 320,
  footerLogoType: 'default_svg',
  footerLogoUrl: '',
  footerLogoAlt: 'O Patriota Brasil',
  footerLogoWidth: 280,
  slogan: 'INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE',
  shortDescription: 'Jornalismo independente, defesa das liberdades civis e compromisso inegociável com a soberania nacional e a verdade factual.',
  copyrightText: 'DEEVO Soluções Financeiras LTDA — CNPJ: 63.187.175/0001-70. Todos os direitos reservados. Mantenedora Jornal O Patriota.'
};

export const DEFAULT_SOCIAL_NETWORKS: SocialNetworkItem[] = [
  {
    id: 'soc-fb',
    name: 'Facebook',
    platform: 'facebook',
    url: 'https://www.facebook.com/opatriota.news.brasil',
    active: true,
    order: 1,
    ariaLabel: 'Página oficial de O Patriota no Facebook'
  },
  {
    id: 'soc-ig',
    name: 'Instagram',
    platform: 'instagram',
    url: 'https://www.instagram.com/opatriota',
    active: true,
    order: 2,
    ariaLabel: 'Perfil oficial de O Patriota no Instagram'
  },
  {
    id: 'soc-yt',
    name: 'YouTube',
    platform: 'youtube',
    url: 'https://www.youtube.com/@opatriota',
    active: true,
    order: 3,
    ariaLabel: 'Canal oficial de O Patriota no YouTube'
  },
  {
    id: 'soc-x',
    name: 'X (antigo Twitter)',
    platform: 'x',
    url: 'https://x.com/opatriota',
    active: true,
    order: 4,
    ariaLabel: 'Conta oficial de O Patriota no X'
  },
  {
    id: 'soc-tt',
    name: 'TikTok',
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@opatriota',
    active: true,
    order: 5,
    ariaLabel: 'Canal de O Patriota no TikTok'
  },
  {
    id: 'soc-wa',
    name: 'WhatsApp',
    platform: 'whatsapp',
    url: 'https://whatsapp.com/channel/opatriota',
    active: true,
    order: 6,
    ariaLabel: 'Canal oficial de transmissão no WhatsApp'
  },
  {
    id: 'soc-rss',
    name: 'Feed RSS',
    platform: 'rss',
    url: '/feed/',
    active: true,
    order: 7,
    ariaLabel: 'Feed RSS de Notícias de O Patriota'
  }
];

export const DEFAULT_ADSENSE_CONFIG: AdSenseGlobalConfig = {
  publisherId: '',
  enabled: false,
  autoAds: false,
  testMode: true
};

export const DEFAULT_AD_SLOTS: AdSlotConfig[] = [
  {
    id: 'slot-home-top',
    position: 'HOME_TOP_LEADERBOARD',
    name: 'Topo da Página (Leaderboard Superior)',
    format: 'leaderboard_728x90',
    width: 728,
    height: 90,
    active: false,
    platform: 'adsense',
    slotId: '',
    demoTitle: 'Espaço Publicitário Superior (728x90)'
  },
  {
    id: 'slot-home-below-breaking',
    position: 'HOME_BELOW_BREAKING',
    name: 'Faixa Pós-Últimas Notícias (Billboard)',
    format: 'billboard_970x250',
    width: 970,
    height: 120,
    active: true,
    platform: 'adsense',
    slotId: '',
    demoTitle: 'Espaço Publicitário Pós-Plantão (970x120)'
  },
  {
    id: 'slot-home-sidebar',
    position: 'HOME_SIDEBAR_NATIONAL',
    name: 'Barra Lateral — Notícias do Brasil',
    format: 'medium_rectangle_300x250',
    width: 300,
    height: 250,
    active: true,
    platform: 'adsense',
    slotId: '',
    demoTitle: 'Espaço Publicitário Lateral (300x250)'
  },
  {
    id: 'slot-home-between',
    position: 'HOME_BETWEEN_SECTIONS',
    name: 'Divisor Editorial — Rio Grande do Sul & Opinião',
    format: 'responsive_banner',
    width: 1200,
    height: 100,
    active: true,
    platform: 'adsense',
    slotId: '',
    demoTitle: 'Espaço Publicitário Entre Seções Editoriais'
  },
  {
    id: 'slot-home-pre-footer',
    position: 'HOME_PRE_FOOTER',
    name: 'Rodapé Superior (Banner Pré-Rodapé)',
    format: 'billboard_970x250',
    width: 970,
    height: 120,
    active: true,
    platform: 'adsense',
    slotId: '',
    demoTitle: 'Espaço Publicitário Pré-Rodapé Institucional'
  },
  {
    id: 'slot-article-after',
    position: 'ARTICLE_AFTER_CONTENT',
    name: 'Final do Artigo (Pós-Leitura)',
    format: 'responsive_banner',
    width: 800,
    height: 120,
    active: true,
    platform: 'adsense',
    slotId: '',
    demoTitle: 'Espaço Publicitário ao Final da Matéria'
  },
  {
    id: 'slot-article-sidebar',
    position: 'ARTICLE_SIDEBAR',
    name: 'Coluna Lateral da Matéria',
    format: 'half_page_300x600',
    width: 300,
    height: 600,
    active: true,
    platform: 'adsense',
    slotId: '',
    demoTitle: 'Espaço Publicitário Half-Page (300x600)'
  }
];

export const DEFAULT_WEBPUSH_CONFIG: WebPushConfig = {
  enabled: true,
  vapidPublicKey: 'BPA-ZMTWvVvRVhRaSqZiBvBOGl8vjYjtURNbJAbP0zZix6s8BkizVNqijXUxqrP27yLa0sdR9iSsvwqZM8dV2bg',
  projectId: 'o-patriota-5db52',
  autoPrompt: false,
  welcomeTitle: 'O Patriota Brasil — Notificações Ativadas',
  welcomeMessage: 'Você receberá notícias urgentes, plantões e reportagens investigativas em primeira mão.'
};

export const DEFAULT_PORTAL_SETTINGS: PortalSettings = {
  identity: DEFAULT_IDENTITY_CONFIG,
  socialNetworks: DEFAULT_SOCIAL_NETWORKS,
  adsense: DEFAULT_ADSENSE_CONFIG,
  adSlots: DEFAULT_AD_SLOTS,
  webPush: DEFAULT_WEBPUSH_CONFIG,
  updatedAt: new Date().toISOString()
};

const LOCAL_STORAGE_KEY = 'o_patriota_portal_settings_v1';
const FIRESTORE_SETTINGS_DOC = 'portal_settings/main';

/**
 * Loads current settings from Firestore with local storage cache fallback.
 */
export async function loadPortalSettings(): Promise<PortalSettings> {
  // 1. Try local cache first for instant hydration
  let cached: PortalSettings | null = null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      cached = JSON.parse(raw);
    }
  } catch (e) {
    // Ignore cache error
  }

  // 2. Try fetching latest from Firestore
  try {
    const docRef = doc(firestoreDb, 'config', 'portal_settings');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as PortalSettings;
      const merged: PortalSettings = {
        identity: { ...DEFAULT_IDENTITY_CONFIG, ...(data.identity || {}) },
        socialNetworks: data.socialNetworks?.length ? data.socialNetworks : DEFAULT_SOCIAL_NETWORKS,
        adsense: { ...DEFAULT_ADSENSE_CONFIG, ...(data.adsense || {}) },
        adSlots: data.adSlots?.length ? data.adSlots : DEFAULT_AD_SLOTS,
        webPush: { ...DEFAULT_WEBPUSH_CONFIG, ...(data.webPush || {}) },
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      // Update local storage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {}
      return merged;
    }
  } catch (error) {
    // Firestore unavailable or permissions not configured yet; return cached or default
  }

  if (cached) {
    return {
      identity: { ...DEFAULT_IDENTITY_CONFIG, ...(cached.identity || {}) },
      socialNetworks: cached.socialNetworks?.length ? cached.socialNetworks : DEFAULT_SOCIAL_NETWORKS,
      adsense: { ...DEFAULT_ADSENSE_CONFIG, ...(cached.adsense || {}) },
      adSlots: cached.adSlots?.length ? cached.adSlots : DEFAULT_AD_SLOTS,
      webPush: { ...DEFAULT_WEBPUSH_CONFIG, ...(cached.webPush || {}) },
      updatedAt: cached.updatedAt || new Date().toISOString()
    };
  }

  return DEFAULT_PORTAL_SETTINGS;
}

/**
 * Saves settings to Firestore and local storage.
 */
export async function savePortalSettings(settings: PortalSettings): Promise<{ success: boolean; message: string }> {
  const updatedSettings: PortalSettings = {
    ...settings,
    updatedAt: new Date().toISOString()
  };

  // 1. Save to local storage immediately
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSettings));
  } catch (e) {
    console.warn('Falha ao gravar configurações em cache local', e);
  }

  // 2. Persist to Firestore
  try {
    const docRef = doc(firestoreDb, 'config', 'portal_settings');
    await setDoc(docRef, updatedSettings, { merge: true });
    return { success: true, message: 'Configurações salvas e sincronizadas com sucesso no Firebase!' };
  } catch (error: any) {
    // Return success for local update with notice
    return { 
      success: true, 
      message: 'Configurações salvas localmente no navegador (sincronização na nuvem pendente de regras de acesso).' 
    };
  }
}

/**
 * Registers a new newsletter subscriber into Firestore and local store.
 */
export async function subscribeToNewsletter(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, message: 'Por favor, insira um endereço de e-mail válido.' };
  }

  const subscriber: NewsletterSubscriber = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    name: name?.trim() || '',
    subscribedAt: new Date().toLocaleDateString('pt-BR'),
    source: 'rodapé_institucional',
    consentLgpd: true
  };

  // Save to local subscribers list
  try {
    const raw = localStorage.getItem('o_patriota_subscribers_v1');
    const list: NewsletterSubscriber[] = raw ? JSON.parse(raw) : [];
    if (!list.some(s => s.email === cleanEmail)) {
      list.push(subscriber);
      localStorage.setItem('o_patriota_subscribers_v1', JSON.stringify(list));
    }
  } catch (e) {}

  // Attempt Firestore insert
  try {
    const colRef = collection(firestoreDb, 'newsletter_subscribers');
    await addDoc(colRef, {
      ...subscriber,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    // Safe graceful fallback
  }

  return { success: true, message: 'Inscrição na newsletter confirmada com sucesso!' };
}
