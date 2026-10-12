import { 
  AdSpaceConfig, 
  GoogleAdSenseConfig, 
  AdMobConfig, 
  SiteBrandingConfig, 
  SocialNetworkItem 
} from '../types';

/**
 * CONFIGURAÇÃO INICIAL DE ESPAÇOS PUBLICITÁRIOS
 * O PATRIOTA BRASIL — CENTRAL DE MONETIZAÇÃO
 */
export const INITIAL_AD_SPACES: AdSpaceConfig[] = [
  {
    id: 'ad-home-top',
    position: 'HOME_TOP_BANNER',
    name: 'Banner Horizontal Topo (Abaixo do Ticker)',
    locationLabel: 'Homepage — Entre o Ticker de Notícias e a Manchete Nobre',
    dimensions: '728x90',
    recommendedSize: '728x90 (Leaderboard) ou Responsivo (Smart Banner)',
    supportedDevices: 'all',
    active: true,
    platform: 'demo',
    adSlotId: '1092837465',
    customBannerUrl: '',
    customLinkUrl: 'https://www.opatriota.sbs/anuncie-conosco/',
    customAltText: 'Publicidade Institucional — Apoie o Jornalismo Independente',
    notes: 'Posição nobre com alta visibilidade sem sobrepor a manchete principal.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  },
  {
    id: 'ad-home-sidebar-top',
    position: 'HOME_SIDEBAR_TOP',
    name: 'Retângulo Lateral Topo (Coluna Nobre)',
    locationLabel: 'Homepage — Coluna lateral junto aos destaques nobres',
    dimensions: '300x250',
    recommendedSize: '300x250 (Medium Rectangle)',
    supportedDevices: 'desktop',
    active: true,
    platform: 'demo',
    adSlotId: '2039485716',
    customBannerUrl: '',
    customLinkUrl: 'https://www.opatriota.sbs/anuncie-conosco/',
    customAltText: 'Espaço Publicitário Reservado',
    notes: 'Integrado contextualmente na barra lateral da primeira dobra.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  },
  {
    id: 'ad-home-sidebar-middle',
    position: 'HOME_SIDEBAR_MIDDLE',
    name: 'Retângulo Lateral Central (Seção Brasil & RS)',
    locationLabel: 'Homepage — Coluna lateral das coberturas regionais e nacionais',
    dimensions: '300x250',
    recommendedSize: '300x250 (Medium Rectangle) ou 300x600 (Half Page)',
    supportedDevices: 'desktop',
    active: true,
    platform: 'demo',
    adSlotId: '3948572610',
    notes: 'Posição entre blocos temáticos de notícias regionais e nacionais.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  },
  {
    id: 'ad-home-below-grid',
    position: 'HOME_BELOW_NEWS_GRID',
    name: 'Banner Horizontal Pós-Grid Temático',
    locationLabel: 'Homepage — Após os 6 cartões temáticos de editorias',
    dimensions: '728x90',
    recommendedSize: '728x90 (Leaderboard)',
    supportedDevices: 'all',
    active: true,
    platform: 'demo',
    adSlotId: '4958673829',
    notes: 'Separação elegante entre o grid de editorias e a faixa de checagem.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  },
  {
    id: 'ad-home-pre-footer',
    position: 'HOME_PRE_FOOTER',
    name: 'Super Banner Horizontal Pré-Rodapé',
    locationLabel: 'Homepage — Final do conteúdo editorial, imediatamente antes do rodapé',
    dimensions: '970x250',
    recommendedSize: '970x250 (Billboard) ou 728x90 (Leaderboard)',
    supportedDevices: 'all',
    active: true,
    platform: 'demo',
    adSlotId: '5849302194',
    notes: 'Espaço de grande impacto na conclusão da leitura da página inicial.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  },
  {
    id: 'ad-article-after-content',
    position: 'ARTICLE_AFTER_CONTENT',
    name: 'Banner Final da Matéria',
    locationLabel: 'Página da Notícia — Após o encerramento do texto da reportagem',
    dimensions: '728x90',
    recommendedSize: '728x90 ou 300x250 em dispositivos móveis',
    supportedDevices: 'all',
    active: true,
    platform: 'demo',
    adSlotId: '6748392019',
    notes: 'Aparece ao final do artigo, antes dos botões de partilha e recomendados.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  },
  {
    id: 'ad-article-sidebar',
    position: 'ARTICLE_SIDEBAR',
    name: 'Retângulo Lateral na Leitura da Notícia',
    locationLabel: 'Página da Notícia — Coluna lateral junto às matérias mais lidas',
    dimensions: '300x250',
    recommendedSize: '300x250 (Medium Rectangle)',
    supportedDevices: 'desktop',
    active: true,
    platform: 'demo',
    adSlotId: '7839201948',
    notes: 'Fixado na coluna lateral para acompanhar a leitura sem atrapalhar o texto.',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  }
];

/**
 * CONFIGURAÇÃO GLOBAL GOOGLE ADSENSE
 */
export const INITIAL_ADSENSE_CONFIG: GoogleAdSenseConfig = {
  enabled: false, // Inativo até que o proprietário insira o Publisher ID oficial aprovado
  publisherId: 'ca-pub-0000000000000000',
  testMode: true,
  autoAdsEnabled: false,
  lastUpdated: '2026-10-09T18:00:00Z'
};

/**
 * PREPARAÇÃO ARQUITETURAL PARA ADMOB (FUTURO APP MÓVEL NATIVO)
 * Nota: Não injetado no website WordPress para evitar violações e scripts desnecessários.
 */
export const INITIAL_ADMOB_CONFIG: AdMobConfig = {
  enabled: false,
  androidAppId: 'ca-app-pub-0000000000000000~0000000000',
  iosAppId: 'ca-app-pub-0000000000000000~0000000000',
  bannerUnitId: 'ca-app-pub-0000000000000000/0000000000',
  interstitialUnitId: 'ca-app-pub-0000000000000000/1111111111',
  nativeUnitId: 'ca-app-pub-0000000000000000/2222222222',
  notes: 'Configuração reservada para o aplicativo móvel nativo (Android/iOS) do O PATRIOTA BRASIL.',
  platformTarget: 'mobile_only'
};

/**
 * REDES SOCIAIS OFICIAIS GERENCIÁVEIS
 */
export const INITIAL_SOCIAL_NETWORKS: SocialNetworkItem[] = [
  {
    id: 'soc-fb',
    name: 'Facebook',
    platform: 'facebook',
    url: 'https://www.facebook.com/opatriota.news.brasil/',
    active: true,
    order: 1,
    ariaLabel: 'Página oficial do O Patriota no Facebook'
  },
  {
    id: 'soc-ig',
    name: 'Instagram',
    platform: 'instagram',
    url: 'https://www.instagram.com/journal_opatriota/',
    active: true,
    order: 2,
    ariaLabel: 'Perfil oficial do O Patriota no Instagram (@journal_opatriota)'
  },
  {
    id: 'soc-yt',
    name: 'YouTube',
    platform: 'youtube',
    url: 'https://youtube.com/@opatriotabrasil',
    active: true,
    order: 3,
    ariaLabel: 'Canal oficial do O Patriota no YouTube'
  },
  {
    id: 'soc-x',
    name: 'X (Twitter)',
    platform: 'x',
    url: 'https://x.com/opatriotabr',
    active: true,
    order: 4,
    ariaLabel: 'Perfil oficial do O Patriota no X'
  },
  {
    id: 'soc-in',
    name: 'LinkedIn',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/company/journal-o-patriota',
    active: true,
    order: 5,
    ariaLabel: 'Página oficial do O Patriota no LinkedIn'
  },
  {
    id: 'soc-tg',
    name: 'Telegram',
    platform: 'telegram',
    url: 'https://t.me/opatriotabrasil',
    active: true,
    order: 6,
    ariaLabel: 'Canal oficial do O Patriota no Telegram'
  },
  {
    id: 'soc-wa',
    name: 'WhatsApp',
    platform: 'whatsapp',
    url: 'https://whatsapp.com/channel/opatriotabrasil',
    active: true,
    order: 7,
    ariaLabel: 'Canal oficial do O Patriota no WhatsApp'
  },
  {
    id: 'soc-kw',
    name: 'Kwai',
    platform: 'kwai',
    url: 'https://k.kwai.com/u/@jornal-opatriota/WPiCxD5Te',
    active: true,
    order: 8,
    ariaLabel: 'Perfil oficial do O Patriota no Kwai (@jornal-opatriota)'
  },
  {
    id: 'soc-rss',
    name: 'Feed RSS',
    platform: 'rss',
    url: '/rss.xml',
    active: true,
    order: 9,
    ariaLabel: 'Feed RSS oficial de notícias do O Patriota'
  }
];

/**
 * IDENTIDADE INSTITUCIONAL E LOGÓTIPOS ADMINISTRÁVEIS
 */
export const INITIAL_BRANDING_CONFIG: SiteBrandingConfig = {
  headerLogoUrl: '', // vazio = utiliza o componente oficial vetorial SVG de alta fidelidade
  footerLogoUrl: '', // vazio = utiliza versão contrastante vetorial SVG para fundo escuro
  headerLogoAlt: 'Logótipo Oficial O PATRIOTA BRASIL',
  footerLogoAlt: 'Logótipo Oficial O PATRIOTA BRASIL — Fundo Escuro',
  slogan: 'Informação com liberdade por um Brasil mais forte.',
  institutionalBio: 'Jornal digital independente comprometido com os fatos, a defesa das liberdades individuais, da soberania nacional e do desenvolvimento do Brasil.',
  copyrightText: '© {year} O PATRIOTA BRASIL. Todos os direitos reservados.',
  maintainerName: 'DEEVO Soluções Financeiras LTDA',
  maintainerCnpj: '63.187.175/0001-70',
  contactEmail: 'redacao@opatriota.sbs',
  contactCity: 'Taquara/RS',
  socialNetworks: INITIAL_SOCIAL_NETWORKS
};
