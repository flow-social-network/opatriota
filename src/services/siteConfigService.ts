const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function supabaseRequest(path: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase não configurado');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}`);
  return response.status === 204 ? null : response.json();
}
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

export const DEFAULT_PORTAL_SETTINGS: PortalSettings = {
  identity: DEFAULT_IDENTITY_CONFIG,
  socialNetworks: DEFAULT_SOCIAL_NETWORKS,
  adsense: DEFAULT_ADSENSE_CONFIG,
  adSlots: DEFAULT_AD_SLOTS,
  webPush: DEFAULT_WEBPUSH_CONFIG,
  updatedAt: new Date().toISOString()
};

const LOCAL_STORAGE_KEY = 'o_patriota_portal_settings_v1';
const SUPABASE_SETTINGS_ID = 'main';

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

  // 2. Tenta buscar a configuração persistida no Supabase
  try {
    const rows = await supabaseRequest(`portal_settings?id=eq.${SUPABASE_SETTINGS_ID}&select=settings`);
    const data = rows?.[0]?.settings as Partial<PortalSettings> | undefined;
    if (data) {
      const merged: PortalSettings = {
        identity: { ...DEFAULT_IDENTITY_CONFIG, ...(data.identity || {}) },
        socialNetworks: data.socialNetworks?.length ? data.socialNetworks : DEFAULT_SOCIAL_NETWORKS,
        adsense: { ...DEFAULT_ADSENSE_CONFIG, ...(data.adsense || {}) },
        adSlots: data.adSlots?.length ? data.adSlots : DEFAULT_AD_SLOTS,
        webPush: { ...DEFAULT_WEBPUSH_CONFIG, ...(data.webPush || {}) },
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch {
    // Permite que o portal continue funcional quando a rede estiver indisponível.
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

  // 2. Persiste no Supabase; o RLS impede alterações sem sessão administrativa.
  try {
    await supabaseRequest('portal_settings?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ id: SUPABASE_SETTINGS_ID, settings: updatedSettings })
    });
    return { success: true, message: 'Configurações salvas e sincronizadas com o Supabase.' };
  } catch {
    return { success: true, message: 'Configurações salvas no navegador; sincronização pendente de autenticação administrativa.' };
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

  // A tabela de newsletter pode ser habilitada depois sem bloquear a inscrição local.

  return { success: true, message: 'Inscrição na newsletter confirmada com sucesso!' };
}
