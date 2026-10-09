import React from 'react';
import { Newspaper, BarChart3, MessageSquare, Users } from 'lucide-react';

export const BrandPillarsFooter: React.FC = () => {
  return (
    <div className="w-full bg-[#07172E] border-t border-[#0B2345] text-white py-6 px-4 select-none">
      <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Flag Emblem & Grand Slogan */}
        <div className="md:col-span-5 flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
          <div className="w-14 h-10 rounded overflow-hidden shrink-0 shadow-md relative bg-[#16803C] flex items-center justify-center">
            {/* Brazilian flag miniature */}
            <div className="w-10 h-6 bg-[#FFCC29] transform rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#0B2345] transform -rotate-45" />
            </div>
          </div>
          <div>
            <h4 className="font-serif text-sm sm:text-base font-black tracking-wide text-white leading-tight uppercase">
              INFORMAÇÃO COM LIBERDADE
            </h4>
            <span className="font-serif text-xs sm:text-sm font-bold text-[#FFCC29] tracking-wider uppercase block">
              POR UM BRASIL MAIS FORTE.
            </span>
          </div>
        </div>

        {/* Right: The 4 Pillars */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {/* Pillar 1 */}
          <div className="flex items-center gap-2.5">
            <Newspaper className="w-5 h-5 text-[#FFCC29] shrink-0" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">NOTÍCIA</div>
              <div className="text-[10px] text-white/70">com responsabilidade</div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-[#FFCC29] shrink-0" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">ANÁLISE</div>
              <div className="text-[10px] text-white/70">com profundidade</div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#FFCC29] shrink-0" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">OPINIÃO</div>
              <div className="text-[10px] text-white/70">com pluralidade</div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#FFCC29] shrink-0" />
            <div>
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">BRASIL</div>
              <div className="text-[10px] text-white/70">em primeiro lugar</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
