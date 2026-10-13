import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { ArrowLeft, Shield, Lock, Compass } from 'lucide-react';

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
  heading,
  subheading,
  pillars,
  children,
}) => {
  const defaultPillars: AuthPillar[] = pillars || [
    { icon: <Shield className="h-5 w-5" />, title: 'Jornal Digital', desc: 'Edições completas e conteúdo exclusivo.' },
    { icon: <Lock className="h-5 w-5" />, title: 'Seus dados protegidos', desc: 'Segurança e privacidade em todos os acessos.' },
    { icon: <Compass className="h-5 w-5" />, title: 'Informação nacional', desc: 'Notícias, editorias e colunistas em um só lugar.' },
  ];

  return (
    <div className="min-h-screen bg-[#EAF4FC] text-[#0B2345]">
      <header className="h-[92px] bg-gradient-to-r from-[#061D40] via-[#0A3470] to-[#073B62] px-5 text-white shadow-md sm:px-8">
        <div className="mx-auto flex h-full max-w-[1536px] items-center justify-between">
          <Link to="/" aria-label="O Patriota" className="transition-opacity hover:opacity-90">
            <Logo size="lg" variant="footer" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#FFCC29]">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="relative min-h-[calc(100vh-92px)] overflow-hidden bg-cover bg-center px-4 py-10 sm:px-8" style={{ backgroundImage: "linear-gradient(90deg, rgba(234,244,252,.92), rgba(234,244,252,.72)), url('/images/hero_congresso.jpg')" }}>
        <div className="relative mx-auto flex min-h-[calc(100vh-172px)] max-w-[1380px] items-center justify-center gap-10 lg:justify-between">
          <section className="hidden max-w-[340px] lg:block">
            <h2 className="font-serif text-5xl font-black leading-[1.02] tracking-tight text-[#0B2345]">Jornalismo<br />que valoriza<br />o Brasil.</h2>
            <p className="mt-5 text-lg leading-relaxed text-[#173762]">Acesse sua conta e tenha uma experiência completa com as notícias, editorias, colunistas e o jornal digital do O PATRIOTA.</p>
            <div className="mt-10 space-y-5 text-sm font-semibold text-[#0B2345]">
              {defaultPillars.map((pillar) => <div key={pillar.title} className="flex items-center gap-3"> <span className="rounded-full bg-[#0B5FFF] p-2 text-white">{pillar.icon}</span><span>{pillar.title}<small className="block font-normal text-[#49617F]">{pillar.desc}</small></span></div>)}
            </div>
          </section>

          <section className="w-full max-w-[520px] rounded-xl border border-[#D5E4F3] bg-white/95 p-7 shadow-xl sm:p-10">
            <div className="mb-7">
              <h1 className="font-serif text-3xl font-black tracking-tight text-[#0B2345] sm:text-4xl">{heading}</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#49617F]">{subheading}</p>
            </div>
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
