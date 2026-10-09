import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Heart, QrCode, CreditCard, Sparkles } from 'lucide-react';
import { PixDonationCard } from './PixDonationCard';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pix' | 'planos'>('pix');
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'anual' | 'avulso'>('mensal');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8 animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-xl p-1 cursor-pointer transition"
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#16803C]/10 text-[#16803C] flex items-center justify-center mx-auto mb-2.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0B2345]">
            Apoie o Jornalismo Independente
          </h2>
          <p className="text-xs text-[#5D6673] mt-1 leading-relaxed max-w-md mx-auto">
            Contribua para mantermos uma redação investigativa atuante em Brasília, livre de verbas partidárias e comprometida com a liberdade de expressão.
          </p>

          {/* Mode Selector */}
          <div className="inline-flex items-center bg-[#F1F3F5] p-1 rounded-full mt-4 border border-[#D9DEE7]">
            <button
              onClick={() => setActiveTab('pix')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pix'
                  ? 'bg-[#0B2345] text-white shadow-xs'
                  : 'text-[#5D6673] hover:text-[#0B2345]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-[#32BCAD]" />
              <span>QR Code Pix (Instantâneo)</span>
            </button>
            <button
              onClick={() => setActiveTab('planos')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'planos'
                  ? 'bg-[#0B2345] text-white shadow-xs'
                  : 'text-[#5D6673] hover:text-[#0B2345]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Assinatura Mensal / Anual</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Pix QR Code Direct */}
        {activeTab === 'pix' && (
          <div>
            <PixDonationCard compact={true} onSuccess={onClose} />
          </div>
        )}

        {/* Tab 2: Monthly / Annual Traditional Plan */}
        {activeTab === 'planos' && (
          <div>
            {confirmed ? (
              <div className="p-6 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 mx-auto text-[#16803C]" />
                <h3 className="font-bold text-sm">Muito obrigado pelo seu apoio patriótico!</h3>
                <p className="text-xs text-[#5D6673]">
                  Informações do programa de apoiadores foram registradas com sucesso. Juntos construímos uma imprensa mais forte e transparente.
                </p>
                <button
                  onClick={() => { setConfirmed(false); onClose(); }}
                  className="mt-3 bg-[#16803C] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={() => setSelectedPlan('mensal')}
                    className={`p-3.5 rounded-xl border text-center transition cursor-pointer ${
                      selectedPlan === 'mensal' 
                        ? 'border-[#0B5FFF] bg-[#0B5FFF]/5 text-[#0B2345] font-bold shadow-xs' 
                        : 'border-[#D9DEE7] text-[#5D6673]'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-[#718096]">Digital Mensal</div>
                    <div className="text-base font-black text-[#0B2345] mt-0.5">R$ 6,50 <span className="text-[10px] text-[#718096]">p/ 3 meses</span></div>
                    <div className="text-[10px] text-[#16803C] font-semibold mt-0.5">Após R$ 20,70/mês</div>
                  </button>

                  <button
                    onClick={() => setSelectedPlan('anual')}
                    className={`p-3.5 rounded-xl border text-center transition cursor-pointer relative ${
                      selectedPlan === 'anual' 
                        ? 'border-[#16803C] bg-[#EBF7EE] text-[#0B2345] font-bold shadow-xs' 
                        : 'border-[#D9DEE7] text-[#5D6673]'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 bg-[#FFCC29] text-[#07172E] text-[9px] font-black px-1.5 py-0.2 rounded">
                      MELHOR VALOR
                    </span>
                    <div className="text-[11px] font-bold text-[#718096]">CP Digital Anual</div>
                    <div className="text-base font-black text-[#16803C] mt-0.5">R$ 62,90 <span className="text-[10px] text-[#718096]">/ano</span></div>
                    <div className="text-[10px] text-[#718096] line-through mt-0.5">De R$ 248,40</div>
                  </button>
                </div>

                <div className="space-y-2 text-xs text-[#5D6673] pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                    <span>Completo acesso ao site, notícias exclusivas e investigações</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                    <span>Réplica digital folheável (PDF) e Acervo Digital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
                    <span>Vídeos exclusivos e podcasts de bastidores da política</span>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmed(true)}
                  className="w-full mt-3 bg-[#0B2345] hover:bg-[#163866] text-white text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>CONFIRMAR ADESÃO AO PLANO</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

