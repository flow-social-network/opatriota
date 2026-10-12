import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { FactCheckItem } from '../types';

interface FactCheckRibbonProps {
  factChecks: FactCheckItem[];
  onOpenFactCheck: (item: FactCheckItem) => void;
  onOpenHub: () => void;
}

export const FactCheckRibbon: React.FC<FactCheckRibbonProps> = ({
  factChecks,
  onOpenFactCheck,
  onOpenHub
}) => {

  return (
    <section className="mb-14 select-none">
      <div className="bg-white border border-[#D9DEE7] rounded p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. FAÇA A CHECAGEM CALLOUT (2 cols on lg) */}
          <div className="order-last lg:col-span-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-[#D9DEE7] pt-5">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#0B2345] text-white flex items-center justify-center mb-3 shadow-xs">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-[#0B2345] leading-none mb-2">
                FAÇA A CHECAGEM
              </h3>
              <p className="text-xs text-[#5D6673] leading-relaxed">
                Informação verdadeira fortalece o Brasil. Antes de compartilhar, verifique os fatos.
              </p>
            </div>

            <div className="sm:shrink-0">
              <button
                onClick={onOpenHub}
                className="inline-flex items-center gap-1.5 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-[11px] font-bold px-3.5 py-2 rounded transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <span>VERIFICAR AGORA</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. THREE FACT CHECK CARDS (6 cols on lg) */}
          <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-[#D9DEE7] pb-6 lg:pb-0 lg:pr-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0B5FFF]">Apurações recentes</p>
                <h4 className="mt-0.5 font-serif text-base font-black text-[#0B2345]">O que está circulando por aí</h4>
              </div>
              <span className="text-[10px] font-semibold text-[#718096]">Atualizado hoje</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {factChecks.slice(0, 3).map((item) => {
              const isFalse = item.verdict === 'FALSO';
              return (
                <article
                  key={item.id}
                  onClick={() => onOpenFactCheck(item)}
                  className="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col group cursor-pointer hover:border-[#0B2345] transition-all hover:shadow-xs"
                >
                  <div className="relative h-24 w-full bg-slate-100 overflow-hidden">
                    <span
                      className={`absolute top-2 left-2 z-10 text-[10px] font-black px-2 py-0.5 uppercase tracking-wider rounded-xs shadow-xs ${
                        isFalse ? 'bg-[#B42318] text-white' : 'bg-[#D97706] text-white'
                      }`}
                    >
                      {item.verdict}
                    </span>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <h5 className="font-serif text-xs font-bold text-[#0B2345] leading-snug group-hover:text-[#0B5FFF] transition-colors line-clamp-3">
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-[#0B5FFF] font-semibold mt-2 block">
                      Ver apuração →
                    </span>
                  </div>
                </article>
              );
            })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
