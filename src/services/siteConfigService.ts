import { api } from './apiClient';
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
  copyrightText: '© 2026 O PATRIOTA BRASIL. Todos os direitos reservados.'
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

export const DEFAULT_MARKET_TICKER_CONFIG = {
  enabled: true,
  speedSeconds: 42,
  showEconomicNews: false,
  indicators: ['USD/BRL', 'EUR/BRL', 'IBOVESPA', 'SELIC', 'IPCA'],
  lastCollectionAt: undefined
};

export const DEFAULT_PORTAL_SETTINGS: PortalSettings = {
  identity: DEFAULT_IDENTITY_CONFIG,
  socialNetworks: DEFAULT_SOCIAL_NETWORKS,
  adsense: DEFAULT_ADSENSE_CONFIG,
  adSlots: DEFAULT_AD_SLOTS,
  webPush: DEFAULT_WEBPUSH_CONFIG,
  marketTicker: DEFAULT_MARKET_TICKER_CONFIG,
  updatedAt: new Date().toISOString()
};

const LOCAL_STORAGE_KEY = 'o_patriota_portal_settings_v1';
const SUPABASE_SETTINGS_ID = 'main';

/**
 * Loads current settings from Firestore with local storage cache fallback.
 */
export async function loadPortalSettings(): Promise<PortalSettings> {
  try {
    const data = await api.get<Partial<PortalSettings>>('/site-settings', { auth: false });
    const merged: PortalSettings = {
      identity: { ...DEFAULT_IDENTITY_CONFIG, ...(data.identity || {}) },
      socialNetworks: Array.isArray(data.socialNetworks) ? data.socialNetworks : DEFAULT_SOCIAL_NETWORKS,
      adsense: { ...DEFAULT_ADSENSE_CONFIG, ...(data.adsense || {}) },
      adSlots: Array.isArray(data.adSlots) ? data.adSlots : DEFAULT_AD_SLOTS,
      webPush: { ...DEFAULT_WEBPUSH_CONFIG, ...(data.webPush || {}) },
      marketTicker: { ...DEFAULT_MARKET_TICKER_CONFIG, ...(data.marketTicker || {}) },
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged)); } catch { /* cache is optional */ }
    return merged;
  } catch (error) {
    console.error('Não foi possível carregar as configurações persistidas:', error);
    return DEFAULT_PORTAL_SETTINGS;
  }
}

/**
 * Saves settings to Firestore and local storage.
 */
export async function savePortalSettings(settings: PortalSettings): Promise<{ success: boolean; message: string }> {
  const updatedSettings: PortalSettings = { ...settings, updatedAt: new Date().toISOString() };
  try {
    await api.patch<PortalSettings>('/site-settings', updatedSettings);
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSettings)); } catch { /* cache is optional */ }
    return { success: true, message: 'Configurações gravadas no servidor.' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Falha ao persistir configurações.' };
  }
}

/**
 * Registers a new newsletter subscriber into Firestore and local store.
 */
export async function subscribeToNewsletter(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, message: 'Por favor, insira um endereço de e-mail válido.' };
  }

  try {
    const { api } = await import('./apiClient');
    await api.post('/newsletter/subscriptions', {
      email: cleanEmail,
      name: name?.trim() || undefined,
      consent: true,
      source: 'rodape_institucional',
    }, { auth: false });
    return { success: true, message: 'Inscrição na newsletter confirmada.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível confirmar a inscrição.';
    return { success: false, message };
  }
}
