import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Heart, QrCode, CreditCard, X, Lock, Newspaper, Share2 } from 'lucide-react';
import { PixDonationCard } from './PixDonationCard';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pix' | 'planos'>('pix');
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'anual'>('mensal');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#06152B]/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        className="relative my-0 flex min-h-screen w-full max-w-[1240px] flex-col overflow-hidden bg-white shadow-2xl sm:my-6 sm:min-h-0 sm:rounded-2xl sm:border sm:border-white/60"
      >
        <header className="relative flex items-center justify-between gap-4 bg-[#071D3A] px-5 py-4 text-white sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#32BCAD]">
              <Heart size={23} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#78D7CC]">O PATRIOTA · APOIO AO JORNALISMO</p>
              <h2 id="support-modal-title" className="mt-0.5 text-lg font-extrabold sm:text-2xl">Apoie o jornalismo independente</h2>
              <p className="mt-1 hidden text-sm text-blue-100/80 sm:block">Sua contribuição ajuda a manter informação de qualidade e liberdade de expressão.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Fechar janela de apoio"
          >
            <X size={23} />
          </button>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-0 bg-[#F6F9FD] lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <main className="min-w-0 p-4 sm:p-6 lg:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0B2345] sm:text-lg">Escolha como deseja apoiar</h3>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">Contribuição avulsa ou plano de apoio.</p>
              </div>
              <div className="flex w-full rounded-xl border border-[#D9E2EF] bg-white p-1 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('pix')}
                  aria-pressed={activeTab === 'pix'}
                  className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition sm:flex-none sm:px-4 ${activeTab === 'pix' ? 'bg-[#0B5FFF] text-white shadow-sm' : 'text-[#475569] hover:bg-slate-50'}`}
                >
                  <QrCode size={16} /> Doação via Pix
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('planos')}
                  aria-pressed={activeTab === 'planos'}
                  className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition sm:flex-none sm:px-4 ${activeTab === 'planos' ? 'bg-[#0B5FFF] text-white shadow-sm' : 'text-[#475569] hover:bg-slate-50'}`}
                >
                  <CreditCard size={16} /> Planos
                </button>
              </div>
            </div>

            {activeTab === 'pix' ? (
              <div className="rounded-2xl border border-[#DCE6F3] bg-white p-3 shadow-sm sm:p-5">
                <div className="mb-4 flex items-start gap-3 rounded-xl bg-[#EFF6FF] p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0B5FFF]"><QrCode size={20} /></div>
                  <div>
                    <p className="text-sm font-extrabold text-[#0B2345]">Pagamento seguro</p>
                    <p className="mt-1 text-xs leading-5 text-[#526783]">Escolha o valor e continue para o ambiente de pagamento seguro, onde serão apresentadas as opções disponíveis, incluindo Pix quando habilitado.</p>
                  </div>
                </div>
                <PixDonationCard compact={true} onSuccess={onClose} />
              </div>
            ) : (
              confirmed ? (
                <div className="rounded-2xl border border-green-200 bg-white p-7 text-center sm:p-10">
                  <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#16803C]" />
                  <h3 className="text-xl font-extrabold text-[#0B2345]">Obrigado pelo interesse!</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#526783]">Esta seleção ainda não registra uma assinatura nem realiza cobrança. Entre em contato com a equipe para confirmar a disponibilidade e as condições do plano.</p>
                  <button type="button" onClick={() => { setConfirmed(false); onClose(); }} className="mt-6 rounded-xl bg-[#0B2345] px-5 py-3 text-sm font-bold text-white hover:bg-[#0B5FFF]">Fechar</button>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#DCE6F3] bg-white p-4 shadow-sm sm:p-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => setSelectedPlan('mensal')} aria-pressed={selectedPlan === 'mensal'} className={`rounded-xl border p-4 text-left transition ${selectedPlan === 'mensal' ? 'border-[#0B5FFF] bg-blue-50 ring-1 ring-[#0B5FFF]' : 'border-[#D9DEE7] hover:border-blue-300'}`}>
                      <span className="text-xs font-bold text-[#64748B]">APOIO DIGITAL MENSAL</span>
                      <span className="mt-2 block text-2xl font-black text-[#0B2345]">R$ 20,70<span className="text-xs font-medium text-[#64748B]">/mês</span></span>
                      <span className="mt-2 block text-xs leading-5 text-[#526783]">Apoio recorrente ao jornalismo independente.</span>
                    </button>
                    <button type="button" onClick={() => setSelectedPlan('anual')} aria-pressed={selectedPlan === 'anual'} className={`rounded-xl border p-4 text-left transition ${selectedPlan === 'anual' ? 'border-[#16803C] bg-green-50 ring-1 ring-[#16803C]' : 'border-[#D9DEE7] hover:border-green-300'}`}>
                      <span className="text-xs font-bold text-[#64748B]">APOIO DIGITAL ANUAL</span>
                      <span className="mt-2 block text-2xl font-black text-[#0B2345]">R$ 62,90<span className="text-xs font-medium text-[#64748B]">/ano</span></span>
                      <span className="mt-2 block text-xs leading-5 text-[#526783]">Uma contribuição anual para apoiar o projeto.</span>
                    </button>
                  </div>
                  <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                    <ShieldCheck size={17} className="mt-0.5 shrink-0" />
                    <span>Esta tela é informativa: a seleção não cria assinatura nem cobra valores. A contratação só deve ocorrer após a integração do checkout recorrente.</span>
                  </div>
                  <button type="button" onClick={() => setConfirmed(true)} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B2345] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#0B5FFF]">
                    <Heart size={17} /> Tenho interesse neste plano
                  </button>
                </div>
              )
            )}
          </main>

          <aside className="border-t border-[#DCE6F3] bg-white p-4 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex items-start gap-3 rounded-xl bg-[#F5F9FF] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0B5FFF]"><Lock size={20} /></div>
                <div><h4 className="text-sm font-extrabold text-[#0B2345]">Ambiente seguro</h4><p className="mt-1 text-xs leading-5 text-[#526783]">Os dados de pagamento são tratados pelo provedor de pagamento.</p></div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#F5F9FF] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0B5FFF]"><Newspaper size={20} /></div>
                <div><h4 className="text-sm font-extrabold text-[#0B2345]">Jornalismo independente</h4><p className="mt-1 text-xs leading-5 text-[#526783]">Seu apoio ajuda a manter notícias, análises e reportagens.</p></div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#F5F9FF] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0B5FFF]"><Share2 size={20} /></div>
                <div><h4 className="text-sm font-extrabold text-[#0B2345]">Transparência</h4><p className="mt-1 text-xs leading-5 text-[#526783]">Mensagens opcionais passam por avaliação e não são publicadas automaticamente.</p></div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#DCE6F3] p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#0B2345]">Cada contribuição faz diferença</p>
              <p className="mt-2 text-xs leading-5 text-[#526783]">Obrigado por considerar apoiar o O PATRIOTA. Escolha a opção adequada para você.</p>
              <button type="button" onClick={onClose} className="mt-4 min-h-10 w-full rounded-lg border border-[#CBD8E8] px-4 py-2 text-sm font-bold text-[#0B2345] transition hover:bg-slate-50">Voltar ao site</button>
            </div>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#DCE6F3] bg-white px-4 py-3 text-[11px] font-medium text-[#64748B] sm:justify-start sm:px-7">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#16803C]" /> Segurança</span>
          <span className="inline-flex items-center gap-1.5"><Lock size={14} className="text-[#0B5FFF]" /> Privacidade</span>
          <span className="inline-flex items-center gap-1.5"><Heart size={14} className="text-[#0B5FFF]" /> Apoio voluntário</span>
        </footer>
      </section>
    </div>
  );
};
