import React, { useState } from 'react';
import { CategorySlug, SiteMenuConfig, SocialPlatform } from '../types';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Mail,
  ShieldCheck,
  Heart,
  User,
  Crown,
  Star,
  Bell,
  Settings,
  LogOut,
  MapPin,
  Rss,
  LogIn,
  UserPlus
} from 'lucide-react';
import type { SubscriberModalType } from './subscriber/SubscriberModalsContainer';
import { useAuth } from '../app/contexts/AuthContext';
import { subscribeToNewsletter } from '../services/siteConfigService';

interface FooterProps {
  onSelectCategory: (category: CategorySlug) => void;
  onOpenSupport: () => void;
  onNavigatePage: (slug: string) => void;
  onOpenSubscriberModal?: (modalType: SubscriberModalType) => void;
  menuConfig?: SiteMenuConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSupport,
  onNavigatePage,
  onOpenSubscriberModal,
  menuConfig
}) => {
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterAgreed, setNewsletterAgreed] = useState(true);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterFeedback, setNewsletterFeedback] = useState('');

  const handleSubscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterAgreed) return;

    setNewsletterStatus('loading');
    setNewsletterFeedback('');

    try {
      const res = await subscribeToNewsletter(newsletterEmail);
      if (res.success) {
        setNewsletterStatus('success');
        setNewsletterFeedback(res.message || 'Inscrição confirmada com sucesso! Você receberá as principais notícias.');
        setNewsletterEmail('');
        setTimeout(() => {
          setNewsletterStatus('idle');
          setNewsletterFeedback('');
        }, 8000);
      } else {
        setNewsletterStatus('error');
        setNewsletterFeedback(res.message || 'Não foi possível completar o cadastro. Tente novamente.');
      }
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterFeedback('Erro de conexão ao registrar na newsletter. Verifique sua conexão.');
    }
  };

  // 10 Redes Sociais Oficiais — Links reais e cores oficiais
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
      icon: <Facebook className="w-4 h-4 text-white fill-current" />
    },
    {
      platform: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/journal_opatriota/',
      bgColor: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      icon: <Instagram className="w-4 h-4 text-white" />
    },
    {
      platform: 'youtube',
      name: 'YouTube',
      url: 'https://www.youtube.com/@jornal_opatriota',
      bgColor: 'bg-[#FF0000]',
      icon: <Youtube className="w-4 h-4 text-white fill-current" />
    },
    {
      platform: 'x',
      name: 'X (Twitter)',
      url: 'https://x.com/opatriotabr',
      bgColor: 'bg-[#000000]',
      icon: <Twitter className="w-4 h-4 text-white fill-current" />
    },
    {
      platform: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/journal-o-patriota',
      bgColor: 'bg-[#0A66C2]',
      icon: <Linkedin className="w-4 h-4 text-white fill-current" />
    },
    {
      platform: 'whatsapp',
      name: 'WhatsApp Oficial',
      url: 'https://whatsapp.com/channel/0029VbDzzEo4o7qIuMMRBp2n',
      bgColor: 'bg-[#25D366]',
      icon: <MessageCircle className="w-4 h-4 text-white fill-current" />
    },
    {
      platform: 'telegram',
      name: 'Telegram',
      url: 'https://t.me/opatriotabrasil',
      bgColor: 'bg-[#229ED9]',
      icon: <Send className="w-4 h-4 text-white fill-current" />
    },
    {
      platform: 'tiktok',
      name: 'TikTok Marcos Dresbach',
      url: 'https://www.tiktok.com/@marcosdresbach',
      bgColor: 'bg-[#000000]',
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.88-4.49V8.75a8.28 8.28 0 0 0 3.89 1.15V6.69z"/>
        </svg>
      )
    },
    {
      platform: 'kwai',
      name: 'Kwai Oficial',
      url: 'https://k.kwai.com/u/@jornal-opatriota/WPiCxD5Te',
      bgColor: 'bg-[#FF5000]',
      icon: (
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"/>
        </svg>
      )
    },
    {
      platform: 'rss',
      name: 'Feed RSS',
      url: '/rss.xml',
      bgColor: 'bg-[#EE802F]',
      icon: <Rss className="w-4 h-4 text-white" />
    }
  ];

  return (
    <footer className="w-full bg-[#061525] text-white select-none font-sans border-t border-[#0d223a]">
      
      {/* ═══════════════════════════════════════════════════════════════════
          ÁREA SUPERIOR: BANNER "APOIE O JORNALISMO INDEPENDENTE"
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#041B33] via-[#08284C] to-[#041B33] border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        {/* Glow sutil com as cores nacionais */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-yellow-500 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Lado Esquerdo: Título e Subtítulo */}
          <div className="text-center lg:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Apoie o jornalismo independente do O PATRIOTA
            </h3>
            <p className="text-white/80 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
              Sua contribuição ajuda a manter um jornalismo livre, com informação de qualidade e liberdade de expressão.
            </p>
          </div>

          {/* Lado Direito: Botão Verde + Frase Inspiradora */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={onOpenSupport}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm uppercase tracking-wider px-7 py-3.5 rounded-md transition-all shadow-lg flex items-center gap-2.5 cursor-pointer active:scale-95"
            >
              <Heart className="w-4.5 h-4.5 fill-white text-white" />
              <span>APOIE AGORA</span>
            </button>

            <span className="hidden sm:inline text-white/30 text-xl font-light">|</span>

            <span className="font-serif italic text-white/90 text-sm sm:text-base text-center sm:text-left">
              Um Brasil mais informado depende de você.
            </span>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          ÁREA PRINCIPAL: GRADE EQUILIBRADA DE 6 COLUNAS
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-[1.3fr_0.9fr_1.1fr_1fr_1fr_1.4fr] gap-8 xl:gap-10 text-xs">
          
          {/* COLUNA 1: MARCA OFICIAL & REDES SOCIAIS */}
          <div className="space-y-4">
            <div>
              {/* Arco Vetorial com Cores Oficiais */}
              <div className="w-48 h-8 flex items-center justify-start -mb-0.5">
                <svg viewBox="0 0 320 80" className="w-full h-full" fill="none">
                  <path d="M 20,48 C 80,14 240,14 300,48 C 260,22 60,22 20,48 Z" fill="#16803C" />
                  <path d="M 40,52 C 100,30 220,30 280,52 C 230,38 90,38 40,52 Z" fill="#FFCC29" />
                  <g transform="translate(160, 38)">
                    <circle cx="0" cy="0" r="14" fill="#0B2345" stroke="#FFFFFF" strokeWidth="1" />
                    <path d="M -13,1 Q 0,-5 13,1" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
                  </g>
                </svg>
              </div>

              <span className="font-serif text-3xl font-black text-white tracking-tight leading-none block">
                O PATRIOT<span className="tracking-normal">A</span>
              </span>
              <p className="text-[10px] xl:text-[11px] text-white/90 font-bold tracking-[0.16em] uppercase mt-1.5 leading-tight">
                INFORMAÇÃO COM LIBERDADE
              </p>
              <p className="text-[9px] xl:text-[10px] text-[#FFCC29] font-bold tracking-[0.2em] uppercase leading-tight mt-0.5">
                POR UM BRASIL MAIS FORTE
              </p>
            </div>

            <blockquote className="font-serif italic text-white/75 text-xs xl:text-[13px] leading-relaxed pt-2 border-t border-white/10">
              “Um jornal livre ajuda a construir um país mais forte.”
            </blockquote>

            {/* Ícones Coloridos Redondos Proporcionais */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-2">
                Canais Oficiais
              </span>
              <div className="flex flex-wrap items-center gap-2.5 max-w-[240px]">
                {socialIconsConfig.map((soc) => (
                  <a
                    key={soc.platform}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.name}
                    title={`${soc.name} do O Patriota`}
                    style={{ borderRadius: '9999px' }}
                    className={`w-9 h-9 rounded-full aspect-square shrink-0 ${soc.bgColor} flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all ring-2 ring-white/20 border border-white/15 overflow-hidden`}
                  >
                    {soc.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>


          {/* COLUNA 2: EDITORIAS */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3 border-b border-white/10 pb-1.5">
              EDITORIAS
            </h4>
            <ul className="space-y-1.5 text-white/75 text-xs">
              <li><button onClick={() => onSelectCategory('todos')} className="hover:text-white transition-colors cursor-pointer text-left">Início</button></li>
              <li><button onClick={() => onSelectCategory('politica')} className="hover:text-white transition-colors cursor-pointer text-left">Política</button></li>
              <li><button onClick={() => onSelectCategory('brasil')} className="hover:text-white transition-colors cursor-pointer text-left">Brasil</button></li>
              <li><button onClick={() => onSelectCategory('economia')} className="hover:text-white transition-colors cursor-pointer text-left">Economia</button></li>
              <li><button onClick={() => onSelectCategory('seguranca')} className="hover:text-white transition-colors cursor-pointer text-left">Segurança</button></li>
              <li><button onClick={() => onSelectCategory('opiniao')} className="hover:text-white transition-colors cursor-pointer text-left">Opinião</button></li>
              <li><button onClick={() => onSelectCategory('checagem')} className="hover:text-white transition-colors cursor-pointer text-left">Checagem</button></li>
              <li><button onClick={() => onSelectCategory('mundo')} className="hover:text-white transition-colors cursor-pointer text-left">Mundo</button></li>
              <li><button onClick={() => onSelectCategory('cultura')} className="hover:text-white transition-colors cursor-pointer text-left">Cultura</button></li>
            </ul>
          </div>


          {/* COLUNA 3: INSTITUCIONAL */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3 border-b border-white/10 pb-1.5">
              INSTITUCIONAL
            </h4>
            <ul className="space-y-1.5 text-white/75 text-xs">
              <li><button onClick={() => onNavigatePage('sobre-o-patriota')} className="hover:text-white transition-colors cursor-pointer text-left">Sobre o O Patriota</button></li>
              <li><button onClick={() => onNavigatePage('principios-editoriais')} className="hover:text-white transition-colors cursor-pointer text-left">Princípios editoriais</button></li>
              <li><button onClick={() => onNavigatePage('expediente')} className="hover:text-white transition-colors cursor-pointer text-left">Expediente</button></li>
              <li><button onClick={() => onNavigatePage('fontes-e-metodologia')} className="hover:text-white transition-colors cursor-pointer text-left">Fontes e metodologia</button></li>
              <li><button onClick={() => onNavigatePage('politica-de-correcoes')} className="hover:text-white transition-colors cursor-pointer text-left">Política de correções</button></li>
              <li><button onClick={() => onNavigatePage('contato')} className="hover:text-white transition-colors cursor-pointer text-left">Fale Conosco</button></li>
              <li><button onClick={() => onNavigatePage('trabalhe-conosco')} className="hover:text-white transition-colors cursor-pointer text-left">Trabalhe conosco</button></li>
            </ul>
          </div>


          {/* COLUNA 4: SERVIÇOS */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              SERVIÇOS
            </h4>
            <ul className="space-y-2.5 text-white/80 text-xs xl:text-[13px]">
              <li><button onClick={() => onNavigatePage('planos')} className="hover:text-white transition-colors cursor-pointer text-left font-medium">Planos e assinaturas</button></li>
              <li><button onClick={onOpenSupport} className="hover:text-white transition-colors cursor-pointer text-left font-medium text-emerald-400">Apoie o jornal</button></li>
              <li><button onClick={() => onNavigatePage('newsletter')} className="hover:text-white transition-colors cursor-pointer text-left">Newsletter</button></li>
              <li><button onClick={() => onNavigatePage('central-de-ajuda')} className="hover:text-white transition-colors cursor-pointer text-left">Central de ajuda</button></li>
              <li><button onClick={() => onNavigatePage('perguntas-frequentes')} className="hover:text-white transition-colors cursor-pointer text-left">Perguntas frequentes</button></li>
              <li><button onClick={() => onNavigatePage('anuncie-conosco')} className="hover:text-white transition-colors cursor-pointer text-left">Anuncie conosco</button></li>
              <li><button onClick={() => onNavigatePage('fale-com-a-redacao')} className="hover:text-white transition-colors cursor-pointer text-left">Fale com a redação</button></li>
              <li><button onClick={() => onNavigatePage('fale-com-o-comercial')} className="hover:text-white transition-colors cursor-pointer text-left">Fale com o comercial</button></li>
            </ul>
          </div>


          {/* COLUNA 5: MINHA CONTA */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              MINHA CONTA
            </h4>
            <ul className="space-y-3 text-white/80 text-xs xl:text-[13px]">
              <li>
                <button 
                  onClick={() => onOpenSubscriberModal ? onOpenSubscriberModal('perfil') : onNavigatePage('minha-conta')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-white/70" />
                  <span>Meu perfil</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSubscriberModal ? onOpenSubscriberModal('assinatura') : onNavigatePage('minha-conta')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <Crown className="w-4 h-4 text-[#FFCC29]" />
                  <span>Minha assinatura</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSubscriberModal ? onOpenSubscriberModal('favoritos') : onNavigatePage('minha-conta')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Meus favoritos</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSubscriberModal ? onOpenSubscriberModal('notificacoes') : onNavigatePage('minha-conta')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span>Notificações</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenSubscriberModal ? onOpenSubscriberModal('configuracoes') : onNavigatePage('minha-conta')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-white/70" />
                  <span>Configurações</span>
                </button>
              </li>
              
              {/* Entrar ou Sair de acordo com o estado do usuário */}
              <li className="pt-2 border-t border-white/10">
                {currentUser ? (
                  <button 
                    onClick={() => auth?.logout()} 
                    className="hover:text-red-300 transition-colors cursor-pointer flex items-center gap-2.5 text-red-400 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da conta</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onNavigatePage('login')} 
                      className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 text-[#38BDF8] font-medium"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Entrar na conta</span>
                    </button>
                    <button 
                      onClick={() => onNavigatePage('cadastro')} 
                      className="hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 text-white/70 text-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Criar cadastro</span>
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>


          {/* COLUNA 6: RECEBA NOSSAS NOTÍCIAS & BAIXE NOSSO APP */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2 border-b border-white/10 pb-2">
                RECEBA NOSSAS NOTÍCIAS
              </h4>
              <p className="text-white/80 text-xs xl:text-[13px] leading-relaxed mb-3">
                Assine nossa newsletter e receba as principais notícias apuradas diariamente no seu e-mail.
              </p>

              {/* Formulário de Newsletter Robusto e Conectado */}
              <form onSubmit={handleSubscribeNewsletter} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail principal"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={newsletterStatus === 'loading'}
                    className="w-full px-3.5 py-2.5 text-xs text-[#0F172A] bg-white rounded-md placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0284C7] shadow-sm disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'loading' || !newsletterEmail}
                    className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs px-4 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === 'loading' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <span>Assinar</span>
                    )}
                  </button>
                </div>

                {/* Consentimento com Checkbox */}
                <label className="flex items-start gap-2 text-[11px] text-white/70 cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={newsletterAgreed}
                    onChange={(e) => setNewsletterAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#0284C7] focus:ring-0 shrink-0 cursor-pointer"
                  />
                  <span>
                    Li e concordo com a{' '}
                    <button
                      type="button"
                      onClick={() => onNavigatePage('politica-de-privacidade')}
                      className="underline text-white hover:text-[#38BDF8] cursor-pointer"
                    >
                      Política de Privacidade
                    </button>
                    .
                  </span>
                </label>

                {/* Feedback em tempo real */}
                {newsletterStatus === 'success' && (
                  <div className="bg-emerald-950/80 border border-emerald-500/50 p-2.5 rounded-md text-xs text-emerald-300 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{newsletterFeedback}</span>
                  </div>
                )}

                {newsletterStatus === 'error' && (
                  <div className="bg-rose-950/80 border border-rose-500/50 p-2.5 rounded-md text-xs text-rose-300 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{newsletterFeedback}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Baixe nosso App */}
            <div className="pt-2 border-t border-white/10">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                BAIXE NOSSO APP
              </h5>
              <p className="text-white/75 text-xs mb-3">
                Acompanhe as notícias onde você estiver.
              </p>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                {/* App Store Badge Oficial */}
                <a
                  href="https://apps.apple.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-black hover:bg-zinc-900 border border-white/20 hover:border-white/40 rounded-lg px-3.5 py-2 transition-all shadow-sm w-fit"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.81.93-2.87-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.74-.95 2.78 1.02.08 2.06-.52 2.69-1.28z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-white/70 leading-none">Baixar na</p>
                    <p className="text-xs font-bold text-white leading-tight font-sans">App Store</p>
                  </div>
                </a>

                {/* Google Play Badge Oficial */}
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-black hover:bg-zinc-900 border border-white/20 hover:border-white/40 rounded-lg px-3.5 py-2 transition-all shadow-sm w-fit"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.37-.42-.61-.99-.61-1.686V3.5c0-.696.24-1.266.609-1.686zm11.238 11.243l2.25 2.25-11.83 6.654 9.58-8.904zm0-2.114L5.267 2.04l11.83 6.654-2.25 2.249zM18.847 11.3l2.67 1.5c.6.34.6.89 0 1.23l-2.67 1.5-1.74-1.74 1.74-1.49z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[8.5px] text-white/70 uppercase leading-none">DISPONÍVEL NO</p>
                    <p className="text-xs font-bold text-white leading-tight font-sans">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          FAIXA INFERIOR: DIREITOS AUTORAIS, TAQUARA–RS & IDENTIFICAÇÃO OFICIAL
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#040F1C] border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 text-xs text-white/70">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Identificação Empresarial Oficial & Sede em Taquara–RS */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="font-normal">
              © 2026 DEEVO Soluções Financeiras LTDA — CNPJ: 63.187.175/0001-70. Todos os direitos reservados.
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-white/90 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FFCC29]" />
              <span>Sede: Taquara–RS</span>
            </span>
          </div>

          {/* E-mail de Contato Institucional */}
          <div className="flex items-center gap-4 flex-wrap justify-center text-white/80">
            <a 
              href="mailto:contato@opatriota.sbs" 
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FFCC29]" />
              <span>contato@opatriota.sbs</span>
            </a>
          </div>

          {/* Links Legais e Símbolo Nacional */}
          <div className="flex items-center gap-3 justify-center md:justify-end text-xs text-white/70">
            <button 
              onClick={() => onNavigatePage('politica-de-privacidade')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
            <span className="text-white/20">|</span>
            <button 
              onClick={() => onNavigatePage('termos-de-uso')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Termos de Uso
            </button>
            <span className="text-white/20">|</span>
            <button 
              onClick={() => onNavigatePage('cookies')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              LGPD & Cookies
            </button>
            <span className="text-base ml-1" role="img" aria-label="Brasil" title="Brasil">🇧🇷</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
