import React, { useState } from 'react';
import { CategorySlug, SiteMenuConfig } from '../types';
import { Bell, CheckCircle2 } from 'lucide-react';
import { subscribeToWebPush, getPushPermissionStatus } from '../services/webPushService';

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
  const [pushStatus, setPushStatus] = useState<string>(() => getPushPermissionStatus());
  const [isPushLoading, setIsPushLoading] = useState(false);
  const [pushNotice, setPushNotice] = useState<string | null>(null);

  const handleSubscribePush = async () => {
    setIsPushLoading(true);
    setPushNotice(null);
    try {
      const res = await subscribeToWebPush();
      setPushStatus(res.permission);
      setPushNotice(res.message);
      setTimeout(() => setPushNotice(null), 5000);
    } catch (err: any) {
      setPushNotice(err.message || 'Falha ao registrar.');
    } finally {
      setIsPushLoading(false);
    }
  };
  return (
    <footer className="bg-[#07172E] text-white pt-12 pb-8 border-t border-[#0B2345] select-none">
      <div className="max-w-[1360px] mx-auto px-4">
        
        {/* Top Banner: Brand, Slogan & Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-8 mb-8 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl md:text-3xl font-black text-white tracking-wide">
                O PATRIOTA
              </span>
            </div>
            <p className="text-xs text-[#FFCC29] font-bold tracking-widest uppercase mt-1">
              INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigatePage('planos')}
              className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-5 py-2.5 rounded transition cursor-pointer shadow-sm"
            >
              APOIAR O JORNAL
            </button>
            <button
              onClick={() => onNavigatePage('contato')}
              className="border border-white/30 hover:border-white text-white text-xs font-bold px-5 py-2.5 rounded transition cursor-pointer"
            >
              FALE COM A REDAÇÃO
            </button>
          </div>
        </div>

        {/* 4 Columns Grid including Web Push & Transparency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
          
          {/* EDITORIAS */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-4 text-[#FFCC29] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16803C]"></span>
              EDITORIAL
            </h4>
            <ul className="space-y-2.5 text-white/80">
              <li>
                <button onClick={() => onSelectCategory('politica')} className="hover:text-white hover:underline transition cursor-pointer">
                  Política Nacional
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('brasil')} className="hover:text-white hover:underline transition cursor-pointer">
                  Brasil e Estados
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('economia')} className="hover:text-white hover:underline transition cursor-pointer">
                  Economia e Mercado
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('seguranca')} className="hover:text-white hover:underline transition cursor-pointer">
                  Segurança Pública
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('saude')} className="hover:text-white hover:underline transition cursor-pointer">
                  Saúde
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('opiniao')} className="hover:text-white hover:underline transition cursor-pointer">
                  Artigos e Opinião
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('checagem')} className="hover:text-white hover:underline transition cursor-pointer">
                  Agência de Checagem
                </button>
              </li>
            </ul>
          </div>

          {/* INSTITUCIONAL */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-4 text-[#FFCC29] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFCC29]"></span>
              INSTITUCIONAL
            </h4>
            <ul className="space-y-2.5 text-white/80">
              <li>
                <button onClick={() => onNavigatePage('sobre-o-patriota')} className="hover:text-white hover:underline transition cursor-pointer">
                  Sobre O Patriota
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('expediente')} className="hover:text-white hover:underline transition cursor-pointer">
                  Expediente e Redação
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('principios-editoriais')} className="hover:text-white hover:underline transition cursor-pointer">
                  Princípios Editoriais
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('fontes-e-metodologia')} className="hover:text-white hover:underline transition cursor-pointer">
                  Fontes e Metodologia
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('politica-de-correcoes')} className="hover:text-white hover:underline transition cursor-pointer">
                  Política de Correções
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('contato')} className="hover:text-white hover:underline transition cursor-pointer">
                  Fale com a Redação
                </button>
              </li>
            </ul>
          </div>

          {/* TRANSPARÊNCIA E LGPD */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-4 text-[#FFCC29] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0B5FFF]"></span>
              TRANSPARÊNCIA E LGPD
            </h4>
            <ul className="space-y-2.5 text-white/80">
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
                <button onClick={() => onNavigatePage('gestao-de-dados')} className="hover:text-white hover:underline transition cursor-pointer">
                  Gestão de Dados (LGPD)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('seguranca-da-informacao')} className="hover:text-white hover:underline transition cursor-pointer">
                  Segurança da Informação
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button onClick={() => onNavigatePage('minha-conta')} className="text-[#FFCC29] hover:underline transition cursor-pointer font-bold block">
                  Área do Assinante
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('nossas-fontes')} className="hover:text-white hover:underline transition cursor-pointer">
                  Nossas Fontes
                </button>
              </li>
            </ul>
          </div>

          {/* 4. ALERTAS WEB PUSH (FCM) */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex h-fit min-h-0 self-start flex-col justify-start gap-4">
            <div>
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider mb-2 text-[#FFCC29] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#FFCC29]" />
                ALERTAS URGENTES PUSH
              </h4>
              <p className="text-[11px] text-white/70 leading-relaxed mb-3">
                Receba breaking news, plantões e apurações exclusivas em tempo real no seu dispositivo.
              </p>
            </div>

            <div className="space-y-2 mt-1">
              {pushNotice && (
                <div className="p-2 bg-[#16803C]/30 border border-[#22A447] text-white text-[10px] rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#22A447] shrink-0" />
                  <span>{pushNotice}</span>
                </div>
              )}

              <button
                onClick={handleSubscribePush}
                disabled={isPushLoading}
                className={`w-full py-2 px-3 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  pushStatus === 'granted'
                    ? 'bg-[#16803C] hover:bg-[#22A447] text-white'
                    : 'bg-[#FFCC29] hover:bg-[#ffb700] text-[#07172E]'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${pushStatus === 'granted' ? 'fill-white' : ''}`} />
                <span>
                  {pushStatus === 'granted' ? 'Notificações Ativadas ✓' : 'Ativar Alertas Push'}
                </span>
              </button>
              <div className="text-[9px] text-white/40 text-center">
                Firebase Cloud Messaging • Cancele a qualquer momento
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Tier: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 gap-4 text-center md:text-left">
          <p>
            © 2026 O PATRIOTA BRASIL. Todos os direitos reservados.
          </p>
          <div className="text-[11px] text-white/40">
            Jornalismo independente com compromisso com a informação verificável.
          </div>
        </div>

      </div>
    </footer>
  );
};
