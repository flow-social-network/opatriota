import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface SupportBannerProps {
  onOpenSupport: () => void;
}

export const SupportBanner: React.FC<SupportBannerProps> = ({ onOpenSupport }) => {
  return (
    <section 
      className="my-10 relative overflow-hidden rounded-lg bg-gradient-to-r from-[#07172E] via-[#0B2345] to-[#16803C] p-6 sm:p-8 text-white shadow-md border border-[#0B2345]"
      aria-label="Apoie o jornalismo independente"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-full bg-[#16803C]/30 border border-[#22A447]/50 flex items-center justify-center shrink-0 hidden sm:flex">
            <ShieldCheck className="w-8 h-8 text-[#FFCC29]" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
              Apoie o jornalismo independente do O PATRIOTA
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-normal">
              Sua contribuição ajuda a manter um jornalismo livre, com informação de qualidade e liberdade de expressão.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSupport}
          className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3 rounded transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>APOIE AGORA</span>
        </button>
      </div>

      {/* Decorative background element */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default SupportBanner;
