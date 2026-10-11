import React, { useState } from 'react';
import { CategorySlug, SiteMenuConfig } from '../types';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Mail,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: CategorySlug) => void;
  onOpenSupport: () => void;
  onNavigatePage: (slug: string) => void;
  menuConfig?: SiteMenuConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSupport,
  onNavigatePage,
  menuConfig
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterAgreed, setNewsletterAgreed] = useState(true);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterAgreed) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  return (
    <footer className="bg-[#07172E] text-white pt-12 pb-8 border-t border-[#0B2345] select-none">
      <div className="max-w-[1360px] mx-auto px-4">
        {/* Top 6 Columns Grid Matching Reference Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-10 border-b border-white/10 text-xs">
          
          {/* COLUMN 1: BRAND LOGO + SLOGAN + SOCIAL NETWORKS */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-xl sm:text-2xl font-black text-white tracking-wide block">
                O PATRIOTA
              </span>
              <p className="text-[10px] text-[#FFCC29] font-bold tracking-wider uppercase mt-1 leading-tight">
                INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE
              </p>
            </div>

            {/* Social Icons (With official Kwai & Instagram links) */}
            <div className="flex flex-wrap items-center gap-2.5 text-white/80 pt-2">
              <a 
                href="https://www.facebook.com/opatriota.news.brasil/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook oficial"
                className="hover:text-[#FFCC29] transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/journal_opatriota/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram oficial (@journal_opatriota)"
                className="hover:text-[#FFCC29] transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com/@opatriotabrasil" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="YouTube oficial"
                className="hover:text-[#FFCC29] transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/opatriotabr" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X oficial"
                className="hover:text-[#FFCC29] transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/opatriotabrasil" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn oficial"
                className="hover:text-[#FFCC29] transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://t.me/opatriotabrasil" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Telegram"
                title="Telegram oficial"
                className="hover:text-[#FFCC29] transition"
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href="https://whatsapp.com/channel/opatriotabrasil" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp oficial"
                className="hover:text-[#FFCC29] transition"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              {/* Official Kwai Link & Badge */}
              <a 
                href="https://k.kwai.com/u/@jornal-opatriota/WPiCxD5Te" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Kwai"
                title="Kwai oficial (@jornal-opatriota)"
                className="hover:text-[#FFCC29] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: INSTITUCIONAL */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3.5 text-[#FFCC29]">
              Institucional
            </h4>
            <ul className="space-y-2 text-white/75 text-[11px]">
              <li>
                <button onClick={() => onNavigatePage('sobre-o-patriota')} className="hover:text-white hover:underline transition cursor-pointer">
                  Sobre O Patriota
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('principios-editoriais')} className="hover:text-white hover:underline transition cursor-pointer">
                  Princípios Editoriais
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('expediente')} className="hover:text-white hover:underline transition cursor-pointer">
                  Expediente
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('politica-de-privacidade')} className="hover:text-white hover:underline transition cursor-pointer">
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('termos-de-uso')} className="hover:text-white hover:underline transition cursor-pointer">
                  Termos de Uso
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('politica-de-correcoes')} className="hover:text-white hover:underline transition cursor-pointer">
                  Política de Correções
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: EDITORIAS */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3.5 text-[#FFCC29]">
              Editorias
            </h4>
            <ul className="space-y-2 text-white/75 text-[11px]">
              <li><button onClick={() => onSelectCategory('politica')} className="hover:text-white hover:underline transition cursor-pointer">Política</button></li>
              <li><button onClick={() => onSelectCategory('brasil')} className="hover:text-white hover:underline transition cursor-pointer">Brasil</button></li>
              <li><button onClick={() => onSelectCategory('economia')} className="hover:text-white hover:underline transition cursor-pointer">Economia</button></li>
              <li><button onClick={() => onSelectCategory('seguranca')} className="hover:text-white hover:underline transition cursor-pointer">Segurança</button></li>
              <li><button onClick={() => onSelectCategory('saude')} className="hover:text-white hover:underline transition cursor-pointer">Saúde</button></li>
              <li><button onClick={() => onSelectCategory('mundo')} className="hover:text-white hover:underline transition cursor-pointer">Mundo</button></li>
              <li><button onClick={() => onSelectCategory('cultura')} className="hover:text-white hover:underline transition cursor-pointer">Cultura</button></li>
              <li><button onClick={() => onSelectCategory('esportes')} className="hover:text-white hover:underline transition cursor-pointer">Esportes</button></li>
              <li><button onClick={() => onSelectCategory('tecnologia')} className="hover:text-white hover:underline transition cursor-pointer">Tecnologia</button></li>
              <li><button onClick={() => onSelectCategory('checagem')} className="hover:text-white hover:underline transition cursor-pointer">Checagem</button></li>
            </ul>
          </div>

          {/* COLUMN 4: SERVIÇOS */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3.5 text-[#FFCC29]">
              Serviços
            </h4>
            <ul className="space-y-2 text-white/75 text-[11px]">
              <li>
                <button onClick={() => onNavigatePage('planos')} className="hover:text-white hover:underline transition cursor-pointer">
                  Planos e Assinaturas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('planos')} className="hover:text-white hover:underline transition cursor-pointer">
                  Receber Alertas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('newsletter')} className="hover:text-white hover:underline transition cursor-pointer">
                  Newsletter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('contato')} className="hover:text-white hover:underline transition cursor-pointer">
                  Anuncie Conosco
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('contato')} className="hover:text-white hover:underline transition cursor-pointer">
                  Fale Conosco
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('contato')} className="hover:text-white hover:underline transition cursor-pointer">
                  Trabalhe Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: AJUDA */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3.5 text-[#FFCC29]">
              Ajuda
            </h4>
            <ul className="space-y-2 text-white/75 text-[11px]">
              <li>
                <button onClick={() => onNavigatePage('contato')} className="hover:text-white hover:underline transition cursor-pointer">
                  Central de Ajuda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('contato')} className="hover:text-white hover:underline transition cursor-pointer">
                  Perguntas Frequentes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('mapa-do-site')} className="hover:text-white hover:underline transition cursor-pointer">
                  Mapa do Site
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('contato')} className="hover:text-white hover:underline transition cursor-pointer">
                  Acessibilidade
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('seguranca-da-informacao')} className="hover:text-white hover:underline transition cursor-pointer">
                  Segurança da Informação
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 6: NEWSLETTER SUBSCRIPTION */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-[#FFCC29]">
              Receba nossas notícias
            </h4>
            <p className="text-[11px] text-white/70 mb-3 leading-relaxed">
              Assine nossa newsletter e receba as principais notícias no seu e-mail.
            </p>

            {newsletterSuccess && (
              <div className="mb-3 p-2 bg-[#16803C]/30 border border-[#22A447] text-white text-[10px] rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22A447] shrink-0" />
                <span>Inscrição confirmada com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSubscribeNewsletter} className="space-y-2">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 px-3 py-1.5 text-xs text-white placeholder-white/50 rounded-l focus:outline-none focus:border-[#0B5FFF] flex-1 min-w-0"
                  required
                />
                <button 
                  type="submit"
                  className="bg-[#0B5FFF] hover:bg-[#0948c2] text-white font-bold text-xs px-3 py-1.5 rounded-r transition cursor-pointer shrink-0"
                >
                  Assinar
                </button>
              </div>

              <label className="flex items-start gap-1.5 text-[10px] text-white/60 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={newsletterAgreed}
                  onChange={(e) => setNewsletterAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#0B5FFF] shrink-0"
                />
                <span>
                  Li e concordo com a{' '}
                  <button 
                    type="button" 
                    onClick={() => onNavigatePage('politica-de-privacidade')}
                    className="underline text-white/80 hover:text-white"
                  >
                    Política de Privacidade
                  </button>
                </span>
              </label>
            </form>
          </div>

        </div>

        {/* Bottom Tier: Copyright & Patriot Brand Tag */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/50 gap-3 text-center md:text-left">
          <p>
            © 2026 O Patriota. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1.5 text-white/60">
            <span>Um jornal livre ajuda a construir um país mais forte.</span>
            <span>🇧🇷</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
