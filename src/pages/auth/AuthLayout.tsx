import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { 
  Shield, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Compass, 
  Users 
} from 'lucide-react';

export interface AuthPillar {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface AuthLayoutProps {
  badgeTitle: string;
  badgeColor?: 'blue' | 'gold' | 'emerald' | 'amber';
  heading: string;
  subheading: string;
  pillars?: AuthPillar[];
  securityNote?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  badgeTitle,
  badgeColor = 'gold',
  heading,
  subheading,
  pillars,
  securityNote,
  children
}) => {
  const badgeClasses = {
    gold: 'bg-[#FFCC29]/15 text-[#FFCC29] border-[#FFCC29]/30',
    blue: 'bg-[#0B5FFF]/15 text-[#60A5FA] border-[#0B5FFF]/30',
    emerald: 'bg-[#16803C]/15 text-[#34D399] border-[#16803C]/30',
    amber: 'bg-[#D97706]/15 text-[#FBBF24] border-[#D97706]/30',
  }[badgeColor];

  const defaultPillars: AuthPillar[] = pillars || [
    {
      icon: <Shield className="w-5 h-5 text-[#FFCC29]" />,
      title: 'Jornalismo Independente & Soberano',
      desc: 'Compromisso com a verdade factual, liberdade de expressão e transparência editorial.'
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      title: 'Ambiente Criptografado & Seguro',
      desc: 'Autenticação com proteção ponta a ponta, controle de acesso e auditoria em tempo real.'
    },
    {
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      title: 'Cobertura Nacional & Regional',
      desc: 'Informação ágil e verificada direto de Brasília (DF), Taquara (RS) e todo o Brasil.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#071322] flex flex-col justify-between selection:bg-[#FFCC29] selection:text-[#081628]">
      {/* Top micro bar for quick exit */}
      <div className="w-full bg-[#050D17] border-b border-white/10 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-white/70">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#FFCC29] font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Portal O Patriota</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SISTEMA SEGURO</span>
        </div>
      </div>

      <div className="flex-1 flex items-stretch">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row shadow-2xl my-auto">
          {/* LEFT SIDE: INSTITUTIONAL BRAND PANEL */}
          <div className="lg:w-5/12 bg-gradient-to-br from-[#08182E] via-[#0B2345] to-[#061222] p-8 sm:p-12 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
            {/* Background flag watermark decoration */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#FFCC29]/5 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#16803C]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Brand Logo */}
              <div className="mb-6">
                <Link to="/" className="inline-block hover:opacity-95 transition">
                  <Logo size="lg" variant="footer" />
                </Link>
              </div>

              {/* Area Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${badgeClasses}`}>
                  <Shield className="w-3.5 h-3.5" />
                  {badgeTitle}
                </span>
              </div>

              {/* Main Slogan & Statement */}
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white mb-3 leading-tight">
                Informação com Liberdade por um Brasil Soberano
              </h2>
              <p className="text-sm text-white/80 leading-relaxed mb-8">
                Plataforma oficial de comunicação e gestão editorial. Acesso monitorado para garantia da integridade e proteção de dados.
              </p>

              {/* Pillars List */}
              <div className="space-y-4 pt-4 border-t border-white/10 hidden sm:block">
                {defaultPillars.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 mt-0.5">
                      {p.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">{p.title}</h4>
                      <p className="text-[11px] text-white/60 leading-snug mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Panel Footer */}
            <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-white/50 gap-2">
              <span>© {new Date().getFullYear()} O Patriota Brasil</span>
              <span>Taquara–RS • Brasília–DF</span>
            </div>
          </div>

          {/* RIGHT SIDE: AUTHENTICATION FORM CARD */}
          <div className="lg:w-7/12 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2345] tracking-tight">
                  {heading}
                </h1>
                <p className="text-sm text-[#4A5568] mt-1.5">
                  {subheading}
                </p>
              </div>

              {children}

              {securityNote && (
                <div className="mt-8 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-[11px] text-[#64748B] leading-relaxed">
                  <Lock className="w-4 h-4 text-[#0B2345] shrink-0 mt-0.5" />
                  <span>{securityNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Micro bottom copyright */}
      <footer className="w-full text-center py-3 text-[11px] text-white/40 border-t border-white/5">
        O Patriota — Informação com Liberdade • Sede Editorial: Taquara–RS • Central de Brasília–DF
      </footer>
    </div>
  );
};
