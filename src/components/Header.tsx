import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { CategorySlug, UserSession, PortalSettings, SocialPlatform } from '../types';
import { 
  Search, 
  ChevronDown, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Radio,
  MessageCircle,
  Rss,
  Share2,
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  SlidersHorizontal, 
  ShieldCheck, 
  User, 
  PenTool, 
  ExternalLink,
  ChevronRight,
  Bell,
  Linkedin,
  Send,
  LogOut,
  Star,
  CreditCard,
  LayoutGrid,
  Settings,
  Menu,
  X,
  MapPin,
  TrendingUp,
  Heart,
  Home,
  Landmark,
  BarChart3,
  Shield,
  HeartPulse,
  MessageSquare,
  CheckCircle2,
  Cpu,
  Globe,
  Palette,
  Trophy,
  PlayCircle,
  Mic,
  UtensilsCrossed,
  Newspaper,
  Clock,
  Bookmark,
  UserCircle
} from 'lucide-react';
import { 
  CapitalWeather, 
  BRAZIL_CAPITALS_WEATHER, 
  TAQUARA_HEADQUARTERS_WEATHER,
  OFFICIAL_INMET_URL,
  getSyncStateMeta
} from '../data/weatherData';
import { WeatherCapitalsModal } from './weather/WeatherCapitalsModal';
import { BreakingNewsTicker } from './BreakingNewsTicker';
import { subscribeToWebPush, getPushPermissionStatus } from '../services/webPushService';
import type { SubscriberModalType } from './subscriber/SubscriberModalsContainer';

interface HeaderProps {
  currentCategory: CategorySlug;
  onSelectCategory: (category: CategorySlug) => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onOpenSubscriberArea: (subpage?: string) => void;
  onOpenSubscriberModal?: (modalType: SubscriberModalType) => void;
  onOpenNewsroom: () => void;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  onNavigatePage?: (slug: string) => void;
  currentUser: UserSession | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (query?: string) => void;
  portalSettings?: PortalSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSupport,
  onOpenAdmin,
  onOpenSubscriberArea,
  onOpenSubscriberModal,
  onOpenNewsroom,
  onGoogleLogin,
  onGoogleLogout,
  onNavigatePage,
  currentUser,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  portalSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setHeaderSearchQuery(searchQuery);
  }, [searchQuery]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [selectedCapital, setSelectedCapital] = useState<CapitalWeather>(TAQUARA_HEADQUARTERS_WEATHER);
  const [pushStatus, setPushStatus] = useState<string>('default');
  const [pushLoading, setPushLoading] = useState(false);

  // States for navbar dropdown menus and mobile accordion
  const [activeDropdownSlug, setActiveDropdownSlug] = useState<string | null>(null);
  const [expandedMobileCats, setExpandedMobileCats] = useState<Record<string, boolean>>({});
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnterNav = (slug: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdownSlug(slug);
  };

  const handleMouseLeaveNav = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdownSlug(null);
    }, 180);
  };

  const toggleMobileCategory = (slug: string) => {
    setExpandedMobileCats(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  useEffect(() => {
    setPushStatus(getPushPermissionStatus());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      setActiveDropdownSlug(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const handleTogglePush = async () => {
    setPushLoading(true);
    try {
      const res = await subscribeToWebPush();
      setPushStatus(res.success ? 'granted' : 'denied');
    } catch {
      setPushStatus('denied');
    } finally {
      setPushLoading(false);
    }
  };

  const handleOpenWeather = (capitalId?: string) => {
    if (capitalId) {
      const found = BRAZIL_CAPITALS_WEATHER.find(c => c.id === capitalId);
      if (found) setSelectedCapital(found);
    }
    setIsWeatherModalOpen(true);
  };

  // Nav categories with subcategory dropdowns matching Editorial Coverage Brief
  interface SubcategoryItem {
    label: string;
    slug: string;
  }

  interface NavItemDef {
    label: string;
    slug: CategorySlug;
    subcategories?: SubcategoryItem[];
  }

  const navItems: NavItemDef[] = [
    { label: 'INÍCIO', slug: 'todos' },
    {
      label: 'BRASIL',
      slug: 'brasil',
      subcategories: [
        { label: 'Todas de Brasil', slug: 'brasil' },
        { label: 'Política Nacional', slug: 'politica-nacional' },
        { label: 'Governo Federal', slug: 'governo-federal' },
        { label: 'Congresso Nacional', slug: 'congresso-nacional' },
        { label: 'Justiça e STF', slug: 'justica' },
        { label: 'Segurança Pública', slug: 'seguranca-publica' },
        { label: 'Economia Nacional', slug: 'economia-nacional' },
      ]
    },
    {
      label: 'RIO GRANDE DO SUL',
      slug: 'rio-grande-do-sul' as CategorySlug,
      subcategories: [
        { label: 'Todas do RS', slug: 'rio-grande-do-sul' },
        { label: 'Política Estadual', slug: 'politica-estadual' },
        { label: 'Segurança Pública RS', slug: 'seguranca-rs' },
        { label: 'Polícia Civil', slug: 'policia-civil' },
        { label: 'Brigada Militar', slug: 'brigada-militar' },
        { label: 'Corpo de Bombeiros', slug: 'bombeiros' },
        { label: 'Defesa Civil RS', slug: 'defesa-civil' },
        { label: 'Municípios e Regiões', slug: 'municipios-rs' },
      ]
    },
    {
      label: 'POLÍTICA',
      slug: 'politica',
      subcategories: [
        { label: 'Todas de Política', slug: 'politica' },
        { label: 'Governo', slug: 'governo' },
        { label: 'Congresso', slug: 'congresso' },
        { label: 'Partidos Políticos', slug: 'partidos-politicos' },
        { label: 'Eleições 2026', slug: 'eleicoes' },
        { label: 'Projetos de Lei', slug: 'projetos-de-lei' },
        { label: 'Decisões Políticas', slug: 'decisoes-politicas' },
      ]
    },
    {
      label: 'SEGURANÇA E JUSTIÇA',
      slug: 'seguranca',
      subcategories: [
        { label: 'Todas de Segurança', slug: 'seguranca' },
        { label: 'Vandalismo e Ordem', slug: 'vandalismo' },
        { label: 'Combate ao Crime', slug: 'criminalidade' },
        { label: 'Operações Policiais', slug: 'operacoes-policiais' },
        { label: 'Investigações', slug: 'investigacoes' },
        { label: 'Justiça Criminal', slug: 'justica-criminal' },
        { label: 'Decisões Judiciais', slug: 'decisoes-judiciais' },
      ]
    },
    {
      label: 'ECONOMIA',
      slug: 'economia',
      subcategories: [
        { label: 'Todas de Economia', slug: 'economia' },
        { label: 'Economia Brasileira', slug: 'economia-brasileira' },
        { label: 'Emprego e Renda', slug: 'emprego' },
        { label: 'Indústria e Comércio', slug: 'industria-e-comercio' },
        { label: 'Agronegócio', slug: 'agronegocio' },
        { label: 'Finanças Públicas', slug: 'financas-publicas' },
        { label: 'Indicadores Econômicos', slug: 'indicadores-economicos' },
      ]
    },
    {
      label: 'BRASIL E MUNDO',
      slug: 'mundo',
      subcategories: [
        { label: 'Todas de Mundo', slug: 'mundo' },
        { label: 'Relações Internacionais', slug: 'relacoes-internacionais' },
        { label: 'América Latina', slug: 'america-latina' },
        { label: 'Conflitos Internacionais', slug: 'conflitos-internacionais' },
        { label: 'Diplomacia & Itamaraty', slug: 'diplomacia' },
      ]
    },
    {
      label: 'OPINIÃO',
      slug: 'opiniao',
      subcategories: [
        { label: 'Todas as Colunas e Opinião', slug: 'opiniao' },
        { label: 'Editorial O Patriota', slug: 'opiniao' },
        { label: 'Colunistas', slug: 'opiniao' },
      ]
    },
    { label: 'CHECAGEM', slug: 'checagem' },
    {
      label: 'MAIS',
      slug: 'todos',
      subcategories: [
        { label: 'Tecnologia', slug: 'tecnologia' },
        { label: 'Saúde', slug: 'saude' },
        { label: 'Educação', slug: 'educacao' },
        { label: 'Meio Ambiente', slug: 'meio-ambiente' },
        { label: 'Infraestrutura', slug: 'infraestrutura' },
        { label: 'Cultura', slug: 'cultura' },
        { label: 'Entretenimento', slug: 'entretenimento' },
        { label: 'Receitas', slug: 'receita' },
        { label: 'Esportes', slug: 'esportes' },
      ]
    }
  ];

  // Additional mobile categories
  const mobileExtraNavItems: { label: string; slug: CategorySlug }[] = [
    { label: 'RECEITAS', slug: 'receita' },
    { label: 'VÍDEOS', slug: 'videos' },
    { label: 'PODCAST', slug: 'podcast' },
  ];

  // Helper for dynamic formatted date
  const now = new Date();
  const fullDateText = now.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  // Capitalize first letter (e.g. Quinta-feira, 9 de outubro de 2026)
  const formattedFullDate = fullDateText.charAt(0).toUpperCase() + fullDateText.slice(1);
  const mobileShortDate = `Taquara (RS), ${now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  // Circular colored social icons matching Image 3
  const socialIconsConfig: {
    platform: SocialPlatform;
    name: string;
    url: string;
    bgColor: string;
    icon: React.ReactNode;
  }[] = [
    {
      platform: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/opatriota.news.brasil/',
      bgColor: 'bg-[#1877F2]',
      icon: <Facebook className="w-3.5 h-3.5 text-white fill-current" />
    },
    {
      platform: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/journal_opatriota/',
      bgColor: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      icon: <Instagram className="w-3.5 h-3.5 text-white" />
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      url: 'https://www.youtube.com/@jornal_opatriota',
      bgColor: 'bg-[#FF0000]',
      icon: <Youtube className="w-3.5 h-3.5 text-white fill-current" />
    },
    {
      platform: 'x',
      name: 'X',
      url: 'https://x.com/opatriotabr',
      bgColor: 'bg-[#000000]',
      icon: <Twitter className="w-3.5 h-3.5 text-white fill-current" />
    },
    {
      platform: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/journal-o-patriota',
      bgColor: 'bg-[#0A66C2]',
      icon: <Linkedin className="w-3.5 h-3.5 text-white fill-current" />
    },
    {
      platform: 'telegram',
      name: 'Telegram',
      url: 'https://t.me/opatriotabrasil',
      bgColor: 'bg-[#229ED9]',
      icon: <Send className="w-3.5 h-3.5 text-white fill-current" />
    },
    {
      platform: 'whatsapp',
      name: 'WhatsApp',
      url: 'https://whatsapp.com/channel/0029VbDzzEo4o7qIuMMRBp2n',
      bgColor: 'bg-[#25D366]',
      icon: <MessageCircle className="w-3.5 h-3.5 text-white fill-current" />
    },
    {
      platform: 'rss',
      name: 'RSS',
      url: '/rss.xml',
      bgColor: 'bg-[#EE802F]',
      icon: <Rss className="w-3.5 h-3.5 text-white" />
    },
    {
      platform: 'tiktok',
      name: 'TikTok Marcos Dresbach',
      url: 'https://www.tiktok.com/@marcosdresbach',
      bgColor: 'bg-[#000000]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.88-4.49V8.75a8.28 8.28 0 0 0 3.89 1.15V6.69z"/>
        </svg>
      )
    },
    {
      platform: 'kwai',
      name: 'Kwai',
      url: 'https://k.kwai.com/u/@jornal-opatriota/WPiCxD5Te',
      bgColor: 'bg-[#FF5000]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"/>
        </svg>
      )
    }
  ];

  // Papéis autorizados para Redação e Painel Administrativo
  const EDITORIAL_ROLES = ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'];
  const ADMIN_ROLES = ['administrador'];
  const canAccessNewsroom = Boolean(currentUser && EDITORIAL_ROLES.includes(currentUser.role));
  const canAccessAdmin = Boolean(currentUser && ADMIN_ROLES.includes(currentUser.role));

  const displayName = currentUser?.name || '';
  const displayAvatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';

  // Lista de itens do menu mobile com suporte a subcategorias
  const mobileDrawerMenuItems: {
    slug: CategorySlug;
    label: string;
    icon: React.ReactNode;
    subcategories?: SubcategoryItem[];
  }[] = [
    { slug: 'todos', label: 'Início', icon: <Home className="w-4 h-4 shrink-0" /> },
    {
      slug: 'brasil',
      label: 'Brasil',
      icon: <MapPin className="w-4 h-4 shrink-0" />,
      subcategories: [
        { label: 'Todas de Brasil', slug: 'brasil' },
        { label: 'Política Nacional', slug: 'politica-nacional' },
        { label: 'Governo Federal', slug: 'governo-federal' },
        { label: 'Congresso Nacional', slug: 'congresso-nacional' },
        { label: 'Justiça e STF', slug: 'justica' },
        { label: 'Segurança Pública', slug: 'seguranca-publica' },
        { label: 'Economia Nacional', slug: 'economia-nacional' },
      ]
    },
    {
      slug: 'rio-grande-do-sul' as CategorySlug,
      label: 'Rio Grande do Sul',
      icon: <MapPin className="w-4 h-4 shrink-0" />,
      subcategories: [
        { label: 'Todas do RS', slug: 'rio-grande-do-sul' },
        { label: 'Política Estadual', slug: 'politica-estadual' },
        { label: 'Segurança Pública RS', slug: 'seguranca-rs' },
        { label: 'Polícia Civil', slug: 'policia-civil' },
        { label: 'Brigada Militar', slug: 'brigada-militar' },
        { label: 'Corpo de Bombeiros', slug: 'bombeiros' },
        { label: 'Defesa Civil RS', slug: 'defesa-civil' },
        { label: 'Municípios e Regiões', slug: 'municipios-rs' },
      ]
    },
    {
      slug: 'politica',
      label: 'Política',
      icon: <Landmark className="w-4 h-4 shrink-0" />,
      subcategories: [
        { label: 'Todas de Política', slug: 'politica' },
        { label: 'Governo', slug: 'governo' },
        { label: 'Congresso', slug: 'congresso' },
        { label: 'Partidos Políticos', slug: 'partidos-politicos' },
        { label: 'Eleições 2026', slug: 'eleicoes' },
        { label: 'Projetos de Lei', slug: 'projetos-de-lei' },
        { label: 'Decisões Políticas', slug: 'decisoes-politicas' },
      ]
    },
    {
      slug: 'seguranca',
      label: 'Segurança e Justiça',
      icon: <Shield className="w-4 h-4 shrink-0" />,
      subcategories: [
        { label: 'Todas de Segurança', slug: 'seguranca' },
        { label: 'Vandalismo e Ordem', slug: 'vandalismo' },
        { label: 'Combate ao Crime', slug: 'criminalidade' },
        { label: 'Operações Policiais', slug: 'operacoes-policiais' },
        { label: 'Investigações', slug: 'investigacoes' },
        { label: 'Justiça Criminal', slug: 'justica-criminal' },
        { label: 'Decisões Judiciais', slug: 'decisoes-judiciais' },
      ]
    },
    {
      slug: 'economia',
      label: 'Economia',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
      subcategories: [
        { label: 'Todas de Economia', slug: 'economia' },
        { label: 'Economia Brasileira', slug: 'economia-brasileira' },
        { label: 'Emprego e Renda', slug: 'emprego' },
        { label: 'Indústria e Comércio', slug: 'industria-e-comercio' },
        { label: 'Agronegócio', slug: 'agronegocio' },
        { label: 'Finanças Públicas', slug: 'financas-publicas' },
        { label: 'Indicadores Econômicos', slug: 'indicadores-economicos' },
      ]
    },
    {
      slug: 'mundo',
      label: 'Brasil e Mundo',
      icon: <Globe className="w-4 h-4 shrink-0" />,
      subcategories: [
        { label: 'Todas de Mundo', slug: 'mundo' },
        { label: 'Notícias Nacionais', slug: 'brasil' },
        { label: 'Relações Internacionais', slug: 'relacoes-internacionais' },
        { label: 'América Latina', slug: 'america-latina' },
        { label: 'Conflitos Internacionais', slug: 'conflitos-internacionais' },
        { label: 'Diplomacia & Itamaraty', slug: 'diplomacia' },
      ]
    },
    {
      slug: 'opiniao',
      label: 'Opinião',
      icon: <MessageSquare className="w-4 h-4 shrink-0" />,
      subcategories: [
        { label: 'Todas as Colunas e Opinião', slug: 'opiniao' },
        { label: 'Editorial O Patriota', slug: 'opiniao' },
        { label: 'Colunistas', slug: 'opiniao' },
      ]
    },
    { slug: 'checagem', label: 'Checagem', icon: <CheckCircle2 className="w-4 h-4 shrink-0" /> },
    { slug: 'saude', label: 'Saúde', icon: <HeartPulse className="w-4 h-4 shrink-0" /> },
    { slug: 'tecnologia', label: 'Tecnologia', icon: <Cpu className="w-4 h-4 shrink-0" /> },
    { slug: 'cultura', label: 'Cultura', icon: <Palette className="w-4 h-4 shrink-0" /> },
    { slug: 'esportes', label: 'Esportes', icon: <Trophy className="w-4 h-4 shrink-0" /> },
    { slug: 'videos', label: 'Vídeos', icon: <PlayCircle className="w-4 h-4 shrink-0" /> },
    { slug: 'podcast', label: 'Podcast', icon: <Mic className="w-4 h-4 shrink-0" /> },
    { slug: 'receita', label: 'Receitas', icon: <UtensilsCrossed className="w-4 h-4 shrink-0" /> },
  ];

  // 7 Ícones Sociais Redondos selecionados para a barra inferior do menu mobile
  const mobileSocialKeys: SocialPlatform[] = ['facebook', 'instagram', 'x', 'youtube', 'tiktok', 'whatsapp', 'telegram'];
  const drawerSocialIcons = mobileSocialKeys
    .map(key => socialIconsConfig.find(s => s.platform === key))
    .filter(Boolean) as typeof socialIconsConfig;

  return (
    <>
      <header className="w-full select-none font-sans">
        
        {/* ═══════════════════════════════════════════════════════════════════
            1. MOBILE HEADER (Celulares e Telas Menores - Imagem 1)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden">
          {/* Main White Bar: Hamburger + Centered Logo + Search, Bell, Profile */}
          <div className="bg-white px-3 py-2 flex items-center justify-between border-b border-[#E2E8F0] shadow-xs">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Fechar menu do site' : 'Abrir menu do site'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-menu"
              className="p-1.5 text-[#0B2345] hover:bg-slate-100 rounded-md transition cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Centered Logo (Vector with brush arc) */}
            <button
              onClick={() => onSelectCategory('todos')}
              className="flex flex-col items-center justify-center text-center cursor-pointer focus:outline-none"
            >
              <div className="w-40 h-7 flex items-center justify-center -mb-1">
                <svg viewBox="0 0 320 80" className="w-full h-full" fill="none">
                  <path d="M 30,48 C 90,14 230,14 290,48 C 250,22 70,22 30,48 Z" fill="#16803C" />
                  <path d="M 50,52 C 100,30 220,30 270,52 C 220,38 100,38 50,52 Z" fill="#FFCC29" />
                  <g transform="translate(160, 38)">
                    <circle cx="0" cy="0" r="14" fill="#0B2345" stroke="#FFFFFF" strokeWidth="1" />
                    <path d="M -13,1 Q 0,-5 13,1" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
                  </g>
                </svg>
              </div>
              <span className="font-serif text-2xl font-black text-[#0B2345] tracking-tight leading-none">
                O PATRIOT<span className="tracking-normal">A</span>
              </span>
              <span className="text-[7px] font-bold tracking-[0.14em] uppercase text-[#5D6673] mt-0.5">
                INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE
              </span>
            </button>

            {/* Right Icons: Search + Bell with badge 5 + User Profile */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buscar Notícias"
                className="p-1.5 text-[#0B2345] hover:bg-slate-100 rounded-md transition cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => onOpenSubscriberModal?.('notificacoes')}
                aria-label="Notificações"
                className="relative p-1.5 text-[#0B2345] hover:bg-slate-100 rounded-md transition cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#E11D48] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-xs">
                  5
                </span>
              </button>

              <button
                onClick={() => onOpenSubscriberModal?.('perfil')}
                aria-label="Perfil do Usuário"
                className="p-1 text-[#0B2345] hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <img 
                  src={displayAvatar} 
                  alt={displayName} 
                  className="w-6 h-6 rounded-full object-cover border border-[#15803D]" 
                />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Category Bar (Fundo Azul-Marinho #0B2345) */}
          <div className="bg-[#0B2345] border-b border-[#0d223a] px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1 shadow-2xs">
            {navItems.map((item) => {
              const isActive = (item.slug === 'todos' && currentCategory === 'todos') || currentCategory === item.slug;
              return (
                <button
                  key={item.slug}
                  onClick={() => onSelectCategory(item.slug)}
                  className={`px-3 py-1 rounded text-[11px] font-black tracking-wider uppercase whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-white/20 text-[#FFCC29] shadow-xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Utility Bar (Cinza Claro): Data + Taquara (RS) 24°C + [INMET] */}
          <div className="bg-[#F8FAFC] px-3 py-1.5 border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#475569]">
            <span className="font-medium">{formattedFullDate}</span>
            <button
              onClick={() => handleOpenWeather('taquara')}
              className="flex items-center gap-1.5 font-bold text-[#0F172A] hover:text-[#0284C7] transition cursor-pointer"
            >
              <Sun className="w-3.5 h-3.5 text-[#EAB308] fill-[#EAB308]" />
              <span>Taquara (RS)</span>
              <span>24°C</span>
              <span className="bg-[#10B981] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                INMET
              </span>
            </button>
          </div>

          {/* Markets Bar no Mobile */}
          <div className="bg-white px-3 py-1.5 border-b border-[#E2E8F0] flex items-center text-[11px] font-medium text-[#0F172A]">
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-[#16803C] shrink-0 mr-3">
              <span className="w-2 h-2 rounded-full bg-[#16803C] animate-pulse" />
              <span>MERCADOS AO VIVO</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none text-slate-700">
              <span>Dólar</span>
              <span className="font-bold">R$ 5,45</span>
              <span className="text-[#16803C] font-bold">▲ +0,32%</span>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════════════════
            2. DESKTOP & TABLET HEADER (Fidelidade Absoluta à Imagem de Auditoria)
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block">
          
          {/* TIER 1: BARRA BRANCA COM DATA, TAQUARA (RS) [INMET], BUSCA, REDES SOCIAIS E ANUNCIE */}
          <div className="bg-[#F4F7FB] border-b border-[#DDE5EF] px-5 py-2 text-xs text-[#334155]">
            <div className="w-full mx-auto flex items-center justify-between gap-5">
              
              {/* Lado Esquerdo: Data Completa + Previsão em Taquara (RS) + Selo INMET */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-medium text-[#1E293B] text-[11px]">
                  {formattedFullDate}
                </span>

                <span className="text-[#CBD5E1] text-xs">|</span>

                {/* Previsão do Tempo Oficial de Taquara (RS) */}
                <button
                  onClick={() => handleOpenWeather('taquara')}
                  className="flex items-center gap-1 font-medium text-[#1E293B] hover:text-[#0284C7] transition cursor-pointer text-[11px] whitespace-nowrap"
                  title="Clique para ver a previsão meteorológica (INMET)"
                >
                  <Sun className="w-3.5 h-3.5 text-[#EAB308] fill-[#EAB308]" />
                  <span className="font-bold">Taquara (RS)</span>
                  <span className="font-bold">24°C</span>
                  <span className="text-[#64748B] text-[10px]">Céu limpo</span>
                  <span className="bg-[#10B981] hover:bg-[#059669] text-white text-[8px] font-black px-1 py-0.5 rounded uppercase">
                    INMET
                  </span>
                </button>
              </div>

              {/* Redes sociais seguem a ordem da referência: Facebook, Instagram, YouTube, X, LinkedIn e Telegram */}
              <div className="flex items-center gap-2 shrink-0" aria-label="Redes sociais oficiais">
                {socialIconsConfig.filter(({ platform }) => ['facebook', 'instagram', 'youtube', 'x', 'linkedin', 'telegram'].includes(platform)).map((soc) => (
                  <a
                    key={soc.platform}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.name}
                    title={soc.name}
                    className={`inline-flex items-center justify-center w-8 h-8 min-w-8 min-h-8 shrink-0 overflow-hidden rounded-full ${soc.bgColor} hover:scale-105 transition-transform [&>svg]:w-[18px] [&>svg]:h-[18px] [&>img]:w-[18px] [&>img]:h-[18px]`}
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>

              {/* Centro: Search Input */}
              <form 
                onSubmit={(e) => { e.preventDefault(); onSearchSubmit(headerSearchQuery.trim()); }}
                className="flex items-center flex-1 min-w-[220px] max-w-[390px] bg-white border border-[#CBD5E1] rounded overflow-hidden h-9 shadow-xs focus-within:border-[#0B2345] transition-colors"
              >
                <Search className="w-[18px] h-[18px] text-[#94A3B8] ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar notícias, análises, vídeos..."
                  value={headerSearchQuery}
                  onChange={(e) => {
                    setHeaderSearchQuery(e.target.value);
                    onSearchChange(e.target.value);
                  }}
                  className="w-full px-2 py-1 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="bg-[#0B1E36] hover:bg-[#0284C7] text-white px-2.5 h-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Search className="w-[18px] h-[18px] text-white" />
                </button>
              </form>

              {/* Lado direito: notificações, perfil e selo Digital */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onOpenSubscriberModal?.('notificacoes')}
                  className="relative p-1 text-[#0B2345] hover:text-[#0284C7] transition cursor-pointer"
                  title="Notificações"
                  aria-label="Abrir notificações"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF2222] text-white text-[9px] font-black flex items-center justify-center">3</span>
                </button>
                {currentUser ? (
                  <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 text-[#0B2345] font-bold text-[12px] cursor-pointer" aria-label="Menu do usuário" aria-expanded={userDropdownOpen}>
                    <img src={currentUser.avatarUrl || displayAvatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#0B2345]" />
                    <span className="max-w-[110px] truncate">{currentUser.name}</span>
                    <span className="text-[#0B2345]">⌄</span>
                  </button>
                ) : (
                  <button onClick={onGoogleLogin} className="flex items-center gap-1 text-[#0B2345] font-bold text-xs cursor-pointer" aria-label="Entrar">
                    <User className="w-5 h-5" />
                    <span>Entrar</span>
                  </button>
                )}
                <span className="bg-[#16A34A] text-white font-black text-[11px] px-2.5 py-1 rounded">DIGITAL</span>
                <button type="button" onClick={() => onNavigatePage?.('anuncie-conosco')} className="border border-[#0B5FFF] text-[#0B5FFF] hover:bg-[#0B5FFF] hover:text-white rounded px-2 py-1 text-[10px] font-black transition-colors cursor-pointer">Anuncie</button>
              </div>
            </div>
          </div>

          {/* TIER 2: BARRA DE MERCADOS AO VIVO (Fundo Azul-marinho profundo #081628) */}
          <div className="bg-[#061A35] text-white px-5 py-3 text-[13px] font-medium border-b border-[#0d223a]">
            <div className="w-full mx-auto flex items-center justify-between gap-5">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none whitespace-nowrap">
                {/* Ponto verde pulsante + MERCADOS AO VIVO */}
                <div className="flex items-center gap-1.5 font-bold tracking-wider text-[#22C55E] shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span>MERCADOS AO VIVO</span>
                </div>

                <span className="text-white/20">|</span>

                {/* Indicadores Econômicos */}
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <span className="text-white/60">Dólar</span>
                    <span className="font-bold text-white">R$ 5,45</span>
                    <span className="text-[#22C55E] font-bold">▲ +0,32%</span>
                  </div>

                  <span className="text-white/20">|</span>

                  <div className="flex items-center gap-1">
                    <span className="text-white/60">Euro</span>
                    <span className="font-bold text-white">R$ 5,89</span>
                    <span className="text-[#EF4444] font-bold">▼ -0,14%</span>
                  </div>

                  <span className="text-white/20">|</span>

                  <div className="flex items-center gap-1">
                    <span className="text-white/60">Ibovespa</span>
                    <span className="font-bold text-white">145.320</span>
                    <span className="text-[#22C55E] font-bold">▲ +0,68%</span>
                  </div>
                </div>
              </div>

              {/* Mais Cotações */}
              <button 
                onClick={() => onSelectCategory('economia')}
                className="text-white/70 hover:text-white flex items-center gap-1 text-[11px] shrink-0 transition cursor-pointer"
              >
                <span>Mais cotações</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* TIER 3: BARRA BRANCA COM LOGOTIPO CENTRALIZADO E CONTROLES DE NOTIFICAÇÃO/USUÁRIO */}
          <div className="bg-white py-7 px-9 border-b border-[#E2E8F0]">
            <div className="w-full mx-auto flex items-center justify-center relative min-h-[170px]">
              
              {/* Assinatura editorial esquerda da referência */}
              <div className="absolute left-9 top-1/2 -translate-y-1/2 border-l-4 border-[#FFCC29] pl-7 max-w-[360px] hidden xl:block">
                <p className="font-serif italic text-[20px] leading-relaxed text-[#526B8D]">“Um jornal livre ajuda a construir<br />um país mais forte.”</p>
              </div>

              {/* Logotipo Central O PATRIOTA */}
              <button
                onClick={() => onSelectCategory('todos')}
                className="flex flex-col items-center justify-center focus:outline-none cursor-pointer group"
              >
                {/* Brush Flag Arc */}
                <div className="w-[390px] h-16 flex items-center justify-center -mb-2">
                  <svg viewBox="0 0 320 80" className="w-full h-full" fill="none">
                    <path d="M 20,48 C 80,10 240,10 300,48 C 260,20 60,20 20,48 Z" fill="#16803C" />
                    <path d="M 40,54 C 100,28 220,28 280,54 C 230,36 90,36 40,54 Z" fill="#FFCC29" />
                    <g transform="translate(160, 36)">
                      <circle cx="0" cy="0" r="16" fill="#0B2345" stroke="#FFFFFF" strokeWidth="1" />
                      <path d="M -15,1 Q 0,-6 15,1" stroke="#FFFFFF" strokeWidth="2.8" fill="none" />
                      <circle cx="-5" cy="5" r="0.8" fill="#FFFFFF" />
                      <circle cx="0" cy="8" r="0.9" fill="#FFFFFF" />
                      <circle cx="6" cy="4" r="0.7" fill="#FFFFFF" />
                    </g>
                  </svg>
                </div>

                <h1 className="font-serif text-6xl font-black text-[#0B2345] tracking-tight leading-none">
                  O PATRIOT<span className="tracking-normal">A</span>
                </h1>

                <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#64748B] mt-1">
                  INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE
                </p>
              </button>

              {/* Manifesto institucional direito da referência */}
              <div className="absolute right-9 top-1/2 -translate-y-1/2 border-r-4 border-[#16A34A] pr-7 text-right hidden xl:block">
                <p className="text-[16px] font-black tracking-[0.18em] leading-relaxed text-[#0B2345]">FATOS<br />IDEIAS<br />PESSOAS<br />SOLUÇÕES<br /><span className="text-[#16A34A]">PELO BRASIL</span></p>
              </div>

              {/* Linha Centralizada: Sino Notificação + Usuário */}
              <div className="hidden">
                
                {/* Sino de Notificações com badge 5 */}
                <button
                  onClick={() => onOpenSubscriberModal?.('notificacoes')}
                  className="relative p-2 text-[#0F172A] hover:text-[#0284C7] hover:bg-slate-100 rounded-full transition cursor-pointer shrink-0"
                  title="5 novas notificações não lidas"
                  aria-label="Abrir Notificações"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#E11D48] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                    5
                  </span>
                </button>

                {/* Avatar do Usuário com Dropdown ou Botão de Entrar */}
                {currentUser ? (
                  <div className="relative shrink-0" ref={userMenuRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-[#0B2345]"
                      aria-expanded={userDropdownOpen}
                      aria-label="Menu do Usuário"
                    >
                      <img 
                        src={currentUser.avatarUrl || displayAvatar} 
                        alt={currentUser.name} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs" 
                      />
                    </button>

                    {/* Dropdown Card */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-[#CBD5E1] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                          <img 
                            src={currentUser.avatarUrl || displayAvatar} 
                            alt="" 
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#15803D]" 
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#0F172A] truncate">{currentUser.name}</h5>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                              <span>👑</span>
                              <span>
                                {currentUser.subscription?.plan === 'premium' 
                                  ? 'Assinante Premium' 
                                  : currentUser.subscription?.plan === 'digital' 
                                    ? 'Assinatura Digital Ativa' 
                                    : 'Leitor Cadastrado'}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="py-1 text-xs text-[#334155]">
                          <button 
                            onClick={() => { setUserDropdownOpen(false); onOpenSubscriberModal?.('perfil'); }} 
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 hover:text-[#0284C7] transition text-left cursor-pointer"
                          >
                            <User className="w-4 h-4 text-[#0284C7]" />
                            <span>Meu Perfil</span>
                          </button>
                          <button 
                            onClick={() => { setUserDropdownOpen(false); onOpenSubscriberModal?.('assinatura'); }} 
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 hover:text-[#0284C7] transition text-left cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4 text-[#0284C7]" />
                            <span>Minha Assinatura</span>
                          </button>
                          <button 
                            onClick={() => { setUserDropdownOpen(false); onOpenSubscriberModal?.('favoritos'); }} 
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 hover:text-[#0284C7] transition text-left cursor-pointer"
                          >
                            <Star className="w-4 h-4 text-[#EAB308]" />
                            <span>Meus Favoritos</span>
                          </button>
                          <button 
                            onClick={() => { setUserDropdownOpen(false); onOpenSubscriberModal?.('notificacoes'); }} 
                            className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 hover:text-[#0284C7] transition text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <Bell className="w-4 h-4 text-[#0284C7]" />
                              <span>Notificações</span>
                            </div>
                            <span className="bg-[#E11D48] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">5</span>
                          </button>
                          <button 
                            onClick={() => { setUserDropdownOpen(false); onOpenSubscriberModal?.('configuracoes'); }} 
                            className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 hover:text-[#64748B] transition text-left cursor-pointer"
                          >
                            <Settings className="w-4 h-4 text-[#64748B]" />
                            <span>Configurações</span>
                          </button>
                        </div>

                        <div className="pt-1 mt-1 border-t border-slate-100 text-xs">
                          {canAccessNewsroom && (
                            <button 
                              onClick={() => { setUserDropdownOpen(false); onOpenNewsroom(); }} 
                              className="w-full px-4 py-2 flex items-center gap-2.5 hover:bg-slate-50 hover:text-[#0B2345] transition text-left cursor-pointer font-bold"
                            >
                              <PenTool className="w-4 h-4 text-[#0B2345]" />
                              <span>Acesso à Redação</span>
                            </button>
                          )}
                          {canAccessAdmin && (
                            <button 
                              onClick={() => { setUserDropdownOpen(false); onOpenAdmin(); }} 
                              className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 hover:text-[#0B2345] transition text-left cursor-pointer font-bold"
                            >
                              <div className="flex items-center gap-2.5">
                                <SlidersHorizontal className="w-4 h-4 text-[#0B2345]" />
                                <span>Painel Administrativo</span>
                              </div>
                              <span className="text-[#EAB308]">👑</span>
                            </button>
                          )}
                          <button 
                            onClick={() => { setUserDropdownOpen(false); onGoogleLogout(); }} 
                            className="w-full px-4 py-2 flex items-center gap-2.5 text-[#DC2626] hover:bg-red-50 transition text-left cursor-pointer font-bold"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onGoogleLogin}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B2345] hover:text-[#0B5FFF] border border-slate-300 hover:border-[#0B2345] rounded-lg transition shrink-0 cursor-pointer shadow-2xs"
                  >
                    <User className="w-4 h-4" />
                    <span>Entrar</span>
                  </button>
                )}

              </div>

            </div>
          </div>

          {/* TIER 4: BARRA DE NAVEGAÇÃO AZUL-MARINHO (#0B2345) */}
          <nav className="bg-[#061A35] text-white shadow-md">
            <div className="w-full mx-auto px-9 flex items-center justify-between min-h-[80px]">
              
              {/* Navigation Items with Dropdowns */}
              <div className="flex-1 min-w-0 flex items-center space-x-0.5 pr-2 overflow-visible">
                {navItems.map((item) => {
                  const isActive = (item.slug === 'todos' && currentCategory === 'todos') || currentCategory === item.slug;
                  const hasSubcategories = Boolean(item.subcategories && item.subcategories.length > 0);
                  const isDropdownOpen = activeDropdownSlug === item.label;

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => hasSubcategories && handleMouseEnterNav(item.label)}
                      onMouseLeave={handleMouseLeaveNav}
                    >
                      <button
                        onClick={() => {
                          setActiveDropdownSlug(null);
                          onSelectCategory(item.slug);
                        }}
                        className={`px-2.5 py-3 text-[13px] leading-[1.2] font-semibold tracking-wide uppercase transition-colors whitespace-nowrap cursor-pointer relative flex items-center gap-1 ${
                          isActive
                            ? 'text-[#FFCC29]'
                            : 'text-white/90 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{item.label}</span>
                        {hasSubcategories && (
                          <ChevronDown
                            className={`w-3 h-3 transition-transform duration-150 ${
                              isDropdownOpen ? 'rotate-180 text-[#FFCC29]' : 'opacity-60'
                            }`}
                          />
                        )}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFCC29]" />
                        )}
                      </button>

                      {hasSubcategories && isDropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-0 w-60 bg-white rounded-b-lg shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left"
                          role="menu"
                          aria-label={`Subcategorias de ${item.label}`}
                        >
                          <div className="px-3.5 py-1.5 border-b border-slate-100 bg-[#F8FAFC]">
                            <span className="text-[10px] font-black uppercase text-[#0B2345] tracking-wider block">
                              {item.label} — SEÇÕES
                            </span>
                          </div>
                          <div className="py-1 max-h-72 overflow-y-auto">
                            {item.subcategories!.map((sub) => (
                              <button
                                key={sub.slug}
                                onClick={() => {
                                  setActiveDropdownSlug(null);
                                  onSelectCategory(sub.slug as CategorySlug);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-[#1E293B] hover:text-[#0B5FFF] hover:bg-[#F1F5F9] transition flex items-center justify-between group cursor-pointer"
                                role="menuitem"
                              >
                                <span>{sub.label}</span>
                                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#0B5FFF] transition-opacity shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Button: APOIE O JORNAL */}
              <div className="py-2 pl-2 shrink-0">
                <button
                  onClick={onOpenSupport}
                  className="bg-[#15803D] hover:bg-[#166534] text-white text-[13px] leading-[1.2] font-semibold uppercase tracking-wide px-3 py-2 rounded-md transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>APOIE O JORNAL</span>
                </button>
              </div>
            </div>
          </nav>
        </div>


        {/* ═══════════════════════════════════════════════════════════════════
            3. MOBILE DRAWER MENU (GAVETA LATERAL DO MOBILE)
            Fidelidade total à captura de tela de referência
           ═══════════════════════════════════════════════════════════════════ */}
        {mobileMenuOpen && (
          <div id="mobile-site-menu" className="fixed inset-0 z-50 lg:hidden flex" role="dialog" aria-modal="true" aria-label="Menu principal">
            {/* Backdrop escuro */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Gaveta branca */}
            <div className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
              
              {/* TOPO DA GAVETA: AZUL-MARINHO INSTITUCIONAL COM LOGO E BUSCA */}
              <div className="bg-[#07192F] text-white pt-3 pb-4 px-4 relative shrink-0 border-b border-[#0D2444]">
                {/* Botão Fechar no canto superior direito */}
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Logotipo Centralizado com Arco e Tipografia Oficial */}
                <div className="flex flex-col items-center justify-center text-center pt-1 pb-3">
                  <div className="w-36 h-7 flex items-center justify-center -mb-0.5">
                    <svg viewBox="0 0 320 80" className="w-full h-full" fill="none">
                      <path d="M 20,48 C 80,14 240,14 300,48 C 260,22 60,22 20,48 Z" fill="#16803C" />
                      <path d="M 40,52 C 100,30 220,30 280,52 C 230,38 90,38 40,52 Z" fill="#FFCC29" />
                      <g transform="translate(160, 38)">
                        <circle cx="0" cy="0" r="14" fill="#0B2345" stroke="#FFFFFF" strokeWidth="1" />
                        <path d="M -13,1 Q 0,-5 13,1" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
                      </g>
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-black text-white tracking-tight leading-none">
                    O PATRIOT<span className="tracking-normal">A</span>
                  </h3>
                  <p className="text-[9px] text-white/90 font-bold tracking-[0.18em] uppercase mt-1 leading-tight">
                    INFORMAÇÃO COM LIBERDADE
                  </p>
                  <p className="text-[8px] text-[#FFCC29] font-bold tracking-[0.22em] uppercase leading-tight mt-0.5">
                    POR UM BRASIL MAIS FORTE
                  </p>
                </div>

                {/* Campo de Busca Integrado no Topo */}
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    onSearchSubmit(headerSearchQuery.trim());
                    setMobileMenuOpen(false);
                  }}
                  className="relative flex items-center"
                >
                  <div className="absolute left-3 text-white/60 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar notícias, análises, vídeos..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs text-white placeholder-white/50 bg-[#142A4A] border border-white/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/40 shadow-inner"
                  />
                </form>
              </div>

              {/* CORPO DA GAVETA: LISTA COMPLETA DE EDITORIAS E SERVIÇOS */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {/* 1. Editorias Principais com Chevrons */}
                <div className="px-2 py-1.5 space-y-0.5">
                  {mobileDrawerMenuItems.map((item) => {
                    const isActive = currentCategory === item.slug;
                    const hasSubcategories = Boolean(item.subcategories && item.subcategories.length > 0);
                    const isExpanded = Boolean(expandedMobileCats[item.label]);

                    return (
                      <div key={item.label} className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              onSelectCategory(item.slug);
                              setMobileMenuOpen(false);
                            }}
                            className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#EEF4FF] text-[#2563EB]'
                                : 'text-[#0F172A] hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={isActive ? 'text-[#2563EB]' : 'text-[#0F172A]'}>
                                {item.icon}
                              </span>
                              <span>{item.label}</span>
                            </div>
                          </button>

                          {hasSubcategories && (
                            <button
                              onClick={() => toggleMobileCategory(item.label)}
                              aria-label={`Expandir subcategorias de ${item.label}`}
                              className="p-2.5 text-slate-400 hover:text-[#0B2345] cursor-pointer"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-[#0B2345]' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {hasSubcategories && isExpanded && (
                          <div className="pl-9 pr-2 py-1 space-y-0.5 bg-slate-50/70 border-l-2 border-[#0B2345] ml-4 my-0.5 rounded-r">
                            {item.subcategories!.map((sub) => (
                              <button
                                key={sub.slug}
                                onClick={() => {
                                  onSelectCategory(sub.slug as CategorySlug);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full text-left py-1.5 px-2 text-xs text-[#334155] hover:text-[#0B5FFF] font-medium flex items-center justify-between cursor-pointer"
                              >
                                <span>{sub.label}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 2. Seções Rápidas: Últimas Notícias, Mais Lidas, Meus Favoritos */}
                <div className="px-2 py-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      onSelectCategory('todos');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Newspaper className="w-4 h-4 shrink-0 text-[#0F172A]" />
                      <span>Últimas Notícias</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectCategory('todos');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 shrink-0 text-[#0F172A]" />
                      <span>Mais Lidas</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenSubscriberModal?.('favoritos');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Bookmark className="w-4 h-4 shrink-0 text-[#0F172A]" />
                      <span>Meus Favoritos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                  </button>
                </div>

                {/* 3. Botões de Ação Destacados */}
                <div className="p-3 space-y-2.5">
                  {/* Botão Verde: APOIE O JORNAL */}
                  <button
                    onClick={() => { onOpenSupport(); setMobileMenuOpen(false); }}
                    className="w-full bg-[#0F763E] hover:bg-[#0c5f32] active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-between text-xs tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 fill-white text-white" />
                      <span>APOIE O JORNAL</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>

                  {/* Botão Branco/Azul: Entrar / Criar conta (ou Minha Conta) */}
                  {currentUser ? (
                    <button
                      onClick={() => { onOpenSubscriberModal?.('perfil'); setMobileMenuOpen(false); }}
                      className="w-full bg-white hover:bg-blue-50/50 border-2 border-[#1E6FD9] text-[#1E6FD9] font-semibold py-2.5 px-3.5 rounded-xl flex items-center justify-between text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img 
                          src={displayAvatar} 
                          alt={displayName} 
                          className="w-5 h-5 rounded-full object-cover shrink-0 border border-[#1E6FD9]" 
                        />
                        <span className="truncate">{displayName}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#1E6FD9] shrink-0" />
                    </button>
                  ) : (
                    <button
                      onClick={() => { onGoogleLogin(); setMobileMenuOpen(false); }}
                      className="w-full bg-white hover:bg-blue-50/50 border-2 border-[#1E6FD9] text-[#1E6FD9] font-semibold py-2.5 px-3.5 rounded-xl flex items-center justify-between text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCircle className="w-5 h-5 text-[#1E6FD9]" />
                        <span>Entrar / Criar conta</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#1E6FD9]" />
                    </button>
                  )}

                  {/* Acesso exclusivo para equipe autorizada ou link de saída */}
                  {(canAccessNewsroom || canAccessAdmin || currentUser) && (
                    <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-slate-500">
                      {canAccessNewsroom && (
                        <button
                          onClick={() => { onOpenNewsroom(); setMobileMenuOpen(false); }}
                          className="hover:text-[#0B2345] underline cursor-pointer"
                        >
                          Redação
                        </button>
                      )}
                      {canAccessNewsroom && canAccessAdmin && <span>•</span>}
                      {canAccessAdmin && (
                        <button
                          onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                          className="hover:text-[#0B2345] underline cursor-pointer"
                        >
                          Painel Geral
                        </button>
                      )}
                      {currentUser && (canAccessNewsroom || canAccessAdmin) && <span>•</span>}
                      {currentUser && (
                        <button
                          onClick={() => { onGoogleLogout(); setMobileMenuOpen(false); }}
                          className="text-rose-600 hover:text-rose-700 underline cursor-pointer"
                        >
                          Sair da conta
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Barra Inferior de Redes Sociais Redondas Oficiais */}
                <div className="p-3 border-t border-slate-100 flex items-center justify-center gap-2 bg-slate-50/50">
                  {drawerSocialIcons.map((soc) => (
                    <a
                      key={soc.platform}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={soc.name}
                      title={soc.name}
                      style={{ borderRadius: '9999px' }}
                      className={`w-8 h-8 rounded-full aspect-square shrink-0 ${soc.bgColor} flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-transform overflow-hidden`}
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Meteorológico das 27 Capitais (INMET) */}
        <WeatherCapitalsModal
          isOpen={isWeatherModalOpen}
          onClose={() => setIsWeatherModalOpen(false)}
          selectedCapitalId={selectedCapital.id}
          onSelectCapital={(cap) => setSelectedCapital(cap)}
        />
      </header>
    </>
  );
};
