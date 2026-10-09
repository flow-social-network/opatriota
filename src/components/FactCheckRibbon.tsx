import React, { useState } from 'react';
import { Search, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className="mb-14 select-none">
      <div className="bg-white border border-[#D9DEE7] rounded p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. FAÇA A CHECAGEM CALLOUT (2 cols on lg) */}
          <div className="lg:col-span-3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D9DEE7] pb-6 lg:pb-0 lg:pr-6">
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

            <div className="mt-4">
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
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b lg:border-b-0 lg:border-r border-[#D9DEE7] pb-6 lg:pb-0 lg:pr-6">
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

          {/* 3. RECEBA NOSSA NEWSLETTER (3 cols on lg) */}
          <div className="lg:col-span-3 flex flex-col justify-center pl-0 lg:pl-2">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-[#0B2345]" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B2345]">
                RECEBA NOSSA NEWSLETTER
              </h4>
            </div>
            <p className="text-[11px] text-[#5D6673] mb-3 leading-snug">
              As principais notícias no seu e-mail, sem spam, com responsabilidade.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] rounded text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Inscrição realizada com sucesso!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#D9DEE7] text-xs px-3 py-2 rounded focus:outline-none focus:border-[#0B5FFF] bg-[#F7F8FA]"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2 px-3 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>INSCREVER-SE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
