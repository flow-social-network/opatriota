import React, { useState } from 'react';
import { Logo } from './Logo';
import { CategorySlug, UserSession } from '../types';
import { 
  Search, 
  ChevronDown, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Sun, 
  SlidersHorizontal, 
  ShieldCheck, 
  User, 
  PenTool, 
  Sparkles 
} from 'lucide-react';

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
  onSearchSubmit
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="w-full bg-white select-none">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-[#F1F3F5] border-b border-[#D9DEE7] text-xs py-1.5 px-4 text-[#5D6673]">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Date & Weather */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="font-semibold text-[#17202A]">Brasília, 8 de outubro de 2026</span>
            <span className="text-[#D9DEE7] hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 font-medium text-[#17202A]">
              <span>Distrito Federal</span>
              <Sun className="w-3.5 h-3.5 text-[#FFCC29] fill-[#FFCC29]" />
              <span className="font-bold">25°C</span>
              <span className="text-[#5D6673] hidden sm:inline">Tempo firme</span>
            </div>
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
            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-2.5 text-[#0B2345] mr-1">
              <a href="#facebook" aria-label="Facebook" className="hover:text-[#0B5FFF] transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#x" aria-label="X Twitter" className="hover:text-[#0B5FFF] transition-colors">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#instagram" aria-label="Instagram" className="hover:text-[#0B5FFF] transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#youtube" aria-label="YouTube" className="hover:text-[#0B5FFF] transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </a>
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

            {/* BUTTON 1: ÁREA DO ASSINANTE (/minha-conta) */}
            <button
              onClick={() => onOpenSubscriberArea('dashboard')}
              className="flex items-center gap-1.5 bg-white border border-[#0B2345] hover:bg-[#0B2345] hover:text-white text-[#0B2345] text-[11px] font-bold px-2.5 py-1 rounded transition-colors shadow-2xs cursor-pointer"
              title="Acessar Área do Assinante e Minha Conta"
            >
              <User className="w-3 h-3" />
              <span className="truncate max-w-[120px]">
                {currentUser ? currentUser.name.split(' ')[0] : 'MINHA CONTA'}
              </span>
            </button>

            {/* BUTTON 2: ÁREA DA REDAÇÃO (/redacao) */}
            <button
              onClick={onOpenNewsroom}
              className="flex items-center gap-1.5 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-[11px] font-bold px-2.5 py-1 rounded transition-colors shadow-2xs cursor-pointer"
              title="Acessar Esteira Editorial e Gestão de Matérias"
            >
              <PenTool className="w-3 h-3 text-[#FFCC29]" />
              <span className="hidden sm:inline">REDAÇÃO</span>
            </button>

            {/* BUTTON 3: BACKOFFICE WORDPRESS */}
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-[#07172E] text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer"
              title="Acessar Central de Fontes e Gerador ZIP do WordPress"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>WP ADMIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. GRAND BRANDING BANNER (Exact reproduction of middle header) */}
      <div className="py-6 sm:py-8 px-4 bg-white border-b border-[#D9DEE7]">
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
              <Logo />
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
      <nav className="bg-[#0B2345] text-white sticky top-0 z-40 shadow-sm border-b border-[#07172E]">
        <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden py-3 text-white focus:outline-none flex items-center gap-2 text-xs font-bold uppercase"
          >
            <span>☰ MENU</span>
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
          <div className="lg:hidden bg-[#07172E] border-t border-white/10 px-4 py-3 space-y-2">
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
                Área do Assinante (/minha-conta)
              </button>
              <button
                onClick={() => { onOpenNewsroom(); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 text-xs font-bold text-white hover:bg-white/10 rounded uppercase"
              >
                Área da Redação (/redacao)
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
