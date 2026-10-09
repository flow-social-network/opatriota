import React, { useState, useEffect } from 'react';
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
  Sparkles,
  ExternalLink,
  ChevronRight,
  Bell
} from 'lucide-react';
import { 
  CapitalWeather, 
  BRAZIL_CAPITALS_WEATHER, 
  OFFICIAL_INMET_URL,
  fetchLiveCapitalWeather,
  getSyncStateMeta
} from '../data/weatherData';
import { WeatherCapitalsModal } from './weather/WeatherCapitalsModal';
import { WeatherBar } from './weather/WeatherBar';
import { BreakingNewsTicker } from './BreakingNewsTicker';
import { subscribeToWebPush, getPushPermissionStatus } from '../services/webPushService';

interface HeaderProps {
  currentCategory: CategorySlug;
  onSelectCategory: (category: CategorySlug) => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onOpenSubscriberArea: (subpage?: string) => void;
  onOpenNewsroom: () => void;
  onNavigatePage?: (slug: string) => void;
  currentUser: UserSession | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  portalSettings?: PortalSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSupport,
  onOpenAdmin,
  onOpenSubscriberArea,
  onOpenNewsroom,
  onNavigatePage,
  currentUser,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  portalSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [selectedCapital, setSelectedCapital] = useState<CapitalWeather>(BRAZIL_CAPITALS_WEATHER[0]);
  const [pushStatus, setPushStatus] = useState<string>('default');
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    setPushStatus(getPushPermissionStatus());
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  const handleTogglePush = async () => {
    setPushLoading(true);
    try {
      const res = await subscribeToWebPush(portalSettings?.webPush?.vapidPublicKey);
      setPushStatus(res.permission);
    } catch (e) {
      // Ignored
    } finally {
      setPushLoading(false);
    }
  };

  // Automatically sync live weather for initial capital on mount
  useEffect(() => {
    let isMounted = true;
    fetchLiveCapitalWeather(BRAZIL_CAPITALS_WEATHER[0]).then((result) => {
      if (isMounted && result.isSuccess && result.updatedCapital) {
        setSelectedCapital(result.updatedCapital);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const navItems: { label: string; slug: CategorySlug; hasSubmenu?: boolean }[] = [
    { label: 'INÍCIO', slug: 'todos' },
    { label: 'POLÍTICA', slug: 'politica' },
    { label: 'BRASIL', slug: 'brasil' },
    { label: 'ECONOMIA', slug: 'economia' },
    { label: 'SEGURANÇA', slug: 'seguranca' },
    { label: 'SAÚDE', slug: 'saude' },
    { label: 'OPINIÃO', slug: 'opiniao' },
    { label: 'CHECAGEM', slug: 'checagem' },
    { label: 'TECNOLOGIA', slug: 'tecnologia' },
    { label: 'MUNDO', slug: 'mundo' },
    { label: 'CULTURA', slug: 'cultura' },
    { label: 'ESPORTES', slug: 'esportes' },
  ];

  const handleOpenWeather = (capitalId?: string) => {
    if (capitalId) {
      const found = BRAZIL_CAPITALS_WEATHER.find(c => c.id === capitalId);
      if (found) setSelectedCapital(found);
    }
    setIsWeatherModalOpen(true);
  };

  const renderWeatherIcon = (code: CapitalWeather['code'], className = "w-3.5 h-3.5") => {
    switch (code) {
      case 'clear':
        return <Sun className={`${className} text-[#FFCC29] fill-[#FFCC29]`} />;
      case 'partly-cloudy':
        return <CloudSun className={`${className} text-[#FFCC29]`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-[#0B5FFF]`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-amber-500`} />;
      default:
        return <Sun className={`${className} text-[#FFCC29]`} />;
    }
  };

  const renderSocialIcon = (platform: SocialPlatform, className = "w-3.5 h-3.5") => {
    switch (platform) {
      case 'facebook':
        return <Facebook className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'youtube':
        return <Youtube className={className} />;
      case 'x':
        return <Twitter className={className} />;
      case 'tiktok':
        return <Radio className={className} />;
      case 'whatsapp':
        return <MessageCircle className={className} />;
      case 'rss':
        return <Rss className={className} />;
      default:
        return <Share2 className={className} />;
    }
  };

  const activeSocials = (portalSettings?.socialNetworks || []).filter(s => s.active);

  return (
    <>
      <header className="w-full bg-white select-none">
        {/* A barra de utilidades permanece fixa; marca e navegação rolam com o conteúdo. */}
      <div className="site-utility-bar bg-[#F1F3F5] border-b border-[#D9DEE7] text-xs px-4 text-[#5D6673]">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1">
          {/* Left: Date & Dynamic Weather from INMET */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="font-semibold text-[#17202A]">Brasília, 8 de outubro de 2026</span>
            <span className="text-[#D9DEE7] hidden sm:inline">|</span>

            {/* DYNAMIC WEATHER PILL (Open-Meteo live / INMET stations reference) */}
            <button
              onClick={() => handleOpenWeather(selectedCapital.id)}
              className="group flex items-center gap-1.5 font-medium text-[#17202A] hover:text-[#0B5FFF] bg-white hover:bg-[#F0F5FF] border border-[#D9DEE7] hover:border-[#0B5FFF] px-2 py-0.5 rounded transition cursor-pointer shadow-2xs"
              title={`Previsão de ${selectedCapital.fullName} • ${selectedCapital.syncState === 'live' ? 'Tempo real via Open-Meteo' : 'Cache local preservado'} • Estação INMET: ${selectedCapital.inmetStationCode}`}
            >
              <span 
                className="w-1.5 h-1.5 rounded-full shrink-0" 
                style={{ backgroundColor: getSyncStateMeta(selectedCapital.syncState).indicatorColor }}
                title={`Estado: ${getSyncStateMeta(selectedCapital.syncState).label}`}
              />
              <span className="font-bold">{selectedCapital.name} ({selectedCapital.uf})</span>
              {renderWeatherIcon(selectedCapital.code)}
              <span className="font-black text-[#0B2345]">{selectedCapital.temp}°C</span>
              <span className="text-[#5D6673] hidden sm:inline text-[11px] font-normal truncate max-w-[110px]">
                {selectedCapital.condition}
              </span>
              <span className="bg-[#16803C] group-hover:bg-[#22A447] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider ml-0.5">
                INMET
              </span>
            </button>

            {onNavigatePage && (
              <>
                <span className="text-[#D9DEE7] hidden md:inline">|</span>
                <div className="hidden md:flex items-center gap-3 text-[11px]">
                  <button onClick={() => onNavigatePage('sobre-o-patriota')} className="hover:text-[#0B2345] cursor-pointer">Sobre</button>
                  <button onClick={() => onNavigatePage('principios-editoriais')} className="hover:text-[#0B2345] cursor-pointer">Princípios</button>
                  <button onClick={() => onNavigatePage('expediente')} className="hover:text-[#0B2345] cursor-pointer">Expediente</button>
                  <button onClick={() => onNavigatePage('planos')} className="hover:text-[#0B2345] cursor-pointer text-[#16803C] font-bold">Planos</button>
                  <button onClick={() => onNavigatePage('contato')} className="hover:text-[#0B2345] cursor-pointer">Contato</button>
                </div>
              </>
            )}
          </div>

          {/* Right: Social Networks, Search, Subscriber Area & Newsroom */}
          <div className="flex items-center gap-3">
            {/* Social Icons (Dynamic from Portal Settings) */}
            <div className="hidden md:flex items-center gap-2.5 text-[#0B2345] mr-1">
              {activeSocials.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target={soc.url.startsWith('http') ? '_blank' : undefined}
                  rel={soc.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={soc.ariaLabel || soc.name}
                  title={`${soc.name}: ${soc.url}`}
                  className="hover:text-[#0B5FFF] transition-colors"
                >
                  {renderSocialIcon(soc.platform)}
                </a>
              ))}
            </div>

            {/* Search Input Box */}
            <form 
              onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
              className="flex items-center border border-[#D9DEE7] bg-white rounded overflow-hidden h-7"
            >
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="px-2.5 py-1 text-xs text-[#17202A] placeholder-[#5D6673] w-24 sm:w-36 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white px-2.5 h-full flex items-center justify-center transition-colors"
              >
                <Search className="w-3 h-3" />
              </button>
            </form>

            {/* BUTTON: ALERTA WEB PUSH */}
            <button
              onClick={handleTogglePush}
              disabled={pushLoading}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded border transition-colors shadow-2xs cursor-pointer ${
                pushStatus === 'granted'
                  ? 'bg-[#EBF7EE] text-[#16803C] border-[#16803C]/40 hover:bg-[#d8f2dc]'
                  : 'bg-white text-[#0B2345] border-[#D9DEE7] hover:border-[#0B5FFF] hover:text-[#0B5FFF]'
              }`}
              title={pushStatus === 'granted' ? 'Alertas push ativos neste navegador' : 'Ativar alertas urgentes no navegador'}
            >
              <Bell className={`w-3 h-3 ${pushStatus === 'granted' ? 'text-[#16803C] fill-[#16803C]' : 'text-[#0B2345]'}`} />
              <span>{pushStatus === 'granted' ? 'ALERTAS ATIVOS' : 'RECEBER ALERTAS'}</span>
            </button>

            {/* BUTTON 1: ÁREA DO ASSINANTE */}
            <button
              onClick={() => onOpenSubscriberArea('dashboard')}
              className="flex items-center gap-1.5 bg-white border border-[#0B2345] hover:bg-[#0B2345] hover:text-white text-[#0B2345] text-[11px] font-bold px-2.5 py-1 rounded transition-colors shadow-2xs cursor-pointer"
              title="Acessar Área do Assinante"
            >
              <User className="w-3 h-3" />
              <span className="truncate max-w-[130px]">
                {currentUser ? currentUser.name.split(' ')[0] : 'ÁREA DO ASSINANTE'}
              </span>
            </button>

            {/* BUTTONS PRIVADOS DA REDAÇÃO E ADMIN (Apenas para equipe autorizada autenticada) */}
            {currentUser && ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'].includes(currentUser.role) && (
              <>
                <button
                  onClick={onOpenNewsroom}
                  className="flex items-center gap-1.5 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-[11px] font-bold px-2.5 py-1 rounded transition-colors shadow-2xs cursor-pointer"
                  title="Acessar Esteira Editorial e Gestão de Matérias"
                >
                  <PenTool className="w-3 h-3 text-[#FFCC29]" />
                  <span className="hidden sm:inline">REDAÇÃO</span>
                </button>

                {['editor_chefe', 'administrador'].includes(currentUser.role) && (
                  <button
                    onClick={onOpenAdmin}
                    className="hidden lg:flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-[#07172E] text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                    title="Acessar Central de Fontes e Gerador ZIP do WordPress"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>WP ADMIN</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* O ticker fica logo abaixo da barra fixa e recolhe visualmente ao rolar. */}
      <BreakingNewsTicker enabled={portalSettings?.marketTicker?.enabled ?? true} speedSeconds={portalSettings?.marketTicker?.speedSeconds ?? 42} />

      {/* 2. GRAND BRANDING BANNER */}
      <div className="py-2 sm:py-2.5 px-4 bg-white border-b border-[#D9DEE7]">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Quote */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-center">
            <blockquote className="font-serif italic text-sm text-[#5D6673] border-l-2 border-[#FFCC29] pl-3 leading-relaxed">
              “Um jornal livre ajuda a construir um país mais forte.”
            </blockquote>
          </div>

          {/* Center Column: The Grand Logo */}
          <div className="lg:col-span-6 flex justify-center">
            <button 
              onClick={() => onSelectCategory('todos')}
              className="text-left focus:outline-none cursor-pointer"
            >
              <Logo identityConfig={portalSettings?.identity} />
            </button>
          </div>

          {/* Right Column: Editorial Pillars */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-end text-right justify-center">
            <div className="text-[11px] font-bold tracking-[0.25em] text-[#0B2345] uppercase leading-relaxed font-sans border-r-2 border-[#16803C] pr-3">
              <div>FATOS</div>
              <div>IDEIAS</div>
              <div>PESSOAS</div>
              <div>SOLUÇÕES</div>
              <div className="text-[#16803C]">PELO BRASIL</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION BAR (Dark Navy #0B2345 with Gold/Green accents) */}
      <nav className="bg-[#0B2345] text-white shadow-sm border-b border-[#07172E]">
        <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="lg:hidden py-3 px-2 text-white focus:outline-none flex items-center gap-2 text-xs font-bold uppercase"
          >
            <span>{mobileMenuOpen ? 'FECHAR MENU' : 'ABRIR MENU'}</span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => {
              const isActive = (item.slug === 'todos' && currentCategory === 'todos') || currentCategory === item.slug;
              return (
                <button
                  key={item.slug}
                  onClick={() => onSelectCategory(item.slug)}
                  className={`flex items-center gap-1 px-3 py-3 text-[11px] xl:text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#07172E] text-[#FFCC29] border-b-2 border-[#FFCC29]'
                      : 'text-white/90 hover:text-white hover:bg-[#0E2C56]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown className="w-2.5 h-2.5 text-white/50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: APOIE O JORNAL / ASSINATURA */}
          <div className="py-2 flex items-center gap-2">
            <button
              onClick={onOpenSupport}
              className="bg-[#16803C] hover:bg-[#22A447] text-white text-[11px] xl:text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>APOIE O JORNAL</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="lg:hidden bg-[#07172E] border-t border-white/10 px-4 py-3 space-y-2" aria-label="Navegação móvel">
            {navItems.map((item) => (
              <button
                key={item.slug}
                onClick={() => {
                  onSelectCategory(item.slug);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs font-bold text-white hover:bg-white/10 rounded uppercase"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/20 flex flex-col gap-2">
              <button
                onClick={() => { onOpenSubscriberArea(); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 text-xs font-bold text-[#FFCC29] hover:bg-white/10 rounded uppercase"
              >
                Área do Assinante
              </button>
              {currentUser && ['jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador'].includes(currentUser.role) && (
                <button
                  onClick={() => { onOpenNewsroom(); setMobileMenuOpen(false); }}
                  className="text-left py-2 px-3 text-xs font-bold text-white hover:bg-white/10 rounded uppercase"
                >
                  Área da Redação
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 4. DYNAMIC WEATHER BAR (CAPITAIS DO BRASIL — INMET) */}
      <WeatherBar 
        onOpenModal={handleOpenWeather}
        selectedCapital={selectedCapital}
      />

      {/* 5. WEATHER CAPITALS MODAL (FONTE OFICIAL INMET) */}
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
