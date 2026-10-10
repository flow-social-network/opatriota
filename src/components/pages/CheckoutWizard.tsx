import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, LockKeyhole, CreditCard, QrCode, UserRound, CircleCheck, Newspaper } from 'lucide-react';
import type { SubscriptionPlan, UserSession } from '../../types';
import { getFirebaseIdToken } from '../../services/firebaseAuthService';

type CheckoutStep = 1 | 2 | 3;
type PaymentMethod = 'pix' | 'card';

interface CheckoutWizardProps {
  plans: SubscriptionPlan[];
  selectedPlanId: string;
  currentUser: UserSession | null;
  onBack: () => void;
  onOpenAccount: (subpage: string) => void;
}

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  plans,
  selectedPlanId,
  currentUser,
  onBack,
  onOpenAccount,
}) => {
  const initialPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const [step, setStep] = useState<CheckoutStep>(1);
  const [planId, setPlanId] = useState<string>(initialPlan?.id ?? 'gratuito');
  const [cycle, setCycle] = useState<'monthly' | 'annual'>(initialPlan?.id === 'premium' ? 'annual' : 'monthly');
  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [notice, setNotice] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? plans[0],
    [plans, planId],
  );
  const amount = !selectedPlan ? 0 : cycle === 'annual' ? selectedPlan.priceAnnual : selectedPlan.priceMonthly;
  const isFree = selectedPlan?.id === 'gratuito' || amount === 0;

  const choosePlan = (id: string) => {
    setPlanId(id);
    if (id === 'premium') setCycle('annual');
    else setCycle('monthly');
    setNotice('');
  };

  const next = () => {
    setNotice('');
    if (step === 1) {
      if (isFree) {
        setStep(2);
      } else {
        setStep(2);
      }
      return;
    }
    if (step === 2) {
      if (!currentUser && (!name.trim() || !email.trim())) {
        setNotice('Informe seu nome e e-mail para continuar.');
        return;
      }
      if (!acceptedTerms) {
        setNotice('Leia e aceite os Termos de Uso e a Política de Privacidade.');
        return;
      }
      setStep(3);
    }
  };

  const startPayment = async () => {
    setNotice('');
    if (isFree) {
      setNotice('O plano gratuito não gera cobrança. Entre ou crie sua conta para ativar o acesso livre.');
      return;
    }
    if (!acceptedTerms) {
      setNotice('Aceite os Termos de Uso e a Política de Privacidade para continuar.');
      setStep(2);
      return;
    }
    if (!currentUser && (!name.trim() || !email.trim())) {
      setNotice('Informe seu nome e e-mail antes de continuar.');
      setStep(2);
      return;
    }
    setSubmittingPayment(true);
    try {
      const token = await getFirebaseIdToken();
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({
          planId,
          cycle,
          paymentMethod,
          name: currentUser?.name || name.trim(),
          email: currentUser?.email || email.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setNotice(result.message || 'Não foi possível iniciar o pagamento. Tente novamente.');
        return;
      }
      if (typeof result.checkoutUrl !== 'string' || !result.checkoutUrl.startsWith('https://')) {
        setNotice('O provedor não retornou um endereço de pagamento válido.');
        return;
      }
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      setNotice('Não foi possível conectar ao serviço de pagamento. Tente novamente.');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const stepLabels = ['Plano', 'Conta', 'Pagamento'];

  return (
    <main className="flex-1 bg-[#F7F8FA] px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={onBack} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#0B2345] hover:bg-white">
          <ArrowLeft size={17} /> Voltar aos planos
        </button>

        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2345] text-white"><Newspaper size={24} /></div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#16803C]">O PATRIOTA • ASSINATURA</p>
          <h1 className="mt-2 font-serif text-3xl font-black text-[#0B2345] sm:text-4xl">Finalize sua assinatura</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#5D6673]">Um processo simples, transparente e seguro. Você pode revisar o plano antes de continuar.</p>
        </div>

        <nav aria-label="Etapas do checkout" className="mb-7 grid grid-cols-3 overflow-hidden rounded-xl border border-[#D9DEE7] bg-white">
          {stepLabels.map((label, index) => {
            const number = (index + 1) as CheckoutStep;
            const active = step === number;
            const complete = step > number;
            return <div key={label} className={`flex items-center justify-center gap-2 border-r border-[#D9DEE7] px-1 py-4 last:border-r-0 sm:py-5 ${active ? 'bg-[#0B2345] text-white' : complete ? 'bg-[#EBF7EE] text-[#16803C]' : 'text-[#718096]'}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${active ? 'bg-white text-[#0B2345]' : complete ? 'bg-[#16803C] text-white' : 'bg-[#E2E6EC] text-[#5D6673]'}`}>{complete ? <Check size={14} /> : number}</span>
              <span className="text-xs font-bold sm:text-sm">{label}</span>
            </div>;
          })}
        </nav>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 rounded-2xl border border-[#D9DEE7] bg-white p-4 shadow-sm sm:p-7">
            {step === 1 && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#16803C]">Etapa 1 de 3</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#0B2345]">Escolha seu plano</h2>
                <p className="mt-1 text-sm text-[#5D6673]">O checkout se adapta ao plano selecionado. Há três planos disponíveis neste momento.</p>
                <div className="mt-5 space-y-3">
                  {plans.map((plan) => {
                    const chosen = plan.id === planId;
                    return <button type="button" key={plan.id} onClick={() => choosePlan(plan.id)} aria-pressed={chosen} className={`w-full rounded-xl border-2 p-4 text-left transition ${chosen ? 'border-[#0B5FFF] bg-[#EFF6FF] ring-2 ring-[#0B5FFF]/10' : 'border-[#D9DEE7] hover:border-[#93B4E8]'}`}>
                      <span className="flex items-start justify-between gap-3">
                        <span><span className="block font-bold text-[#0B2345]">{plan.name}</span><span className="mt-1 block text-xs leading-5 text-[#5D6673]">{plan.description}</span></span>
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${chosen ? 'border-[#0B5FFF] bg-[#0B5FFF] text-white' : 'border-[#C5CCD6]'}`}>{chosen && <Check size={13} />}</span>
                      </span>
                      <span className="mt-3 flex flex-wrap items-baseline gap-1 text-[#0B2345]"><strong className="text-xl">{money(plan.id === 'premium' ? plan.priceAnnual : plan.priceMonthly)}</strong><span className="text-xs text-[#5D6673]">{plan.id === 'premium' ? '/ano' : '/mês'}</span>{plan.badge && <span className="ml-1 rounded-full bg-[#FFF5CC] px-2 py-1 text-[10px] font-extrabold uppercase text-[#755800]">{plan.badge}</span>}</span>
                    </button>;
                  })}
                </div>
                {selectedPlan && selectedPlan.id !== 'gratuito' && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-bold text-[#0B2345]">Periodicidade</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setCycle('monthly')} className={`min-h-12 rounded-lg border px-3 py-2 text-sm font-semibold ${cycle === 'monthly' ? 'border-[#0B5FFF] bg-[#EFF6FF] text-[#0B2345]' : 'border-[#D9DEE7] text-[#5D6673]'}`}>Mensal</button>
                      <button type="button" onClick={() => setCycle('annual')} className={`min-h-12 rounded-lg border px-3 py-2 text-sm font-semibold ${cycle === 'annual' ? 'border-[#0B5FFF] bg-[#EFF6FF] text-[#0B2345]' : 'border-[#D9DEE7] text-[#5D6673]'}`}>Anual · economize</button>
                    </div>
                  </div>
                )}
                <button type="button" onClick={next} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B2345] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#0B5FFF]">Continuar <ArrowRight size={17} /></button>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#16803C]">Etapa 2 de 3</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#0B2345]">Seus dados</h2>
                <p className="mt-1 text-sm text-[#5D6673]">Usaremos esses dados para identificar sua conta e administrar a assinatura.</p>
                {currentUser ? (
                  <div className="mt-5 rounded-xl border border-[#B9E4C4] bg-[#EBF7EE] p-4">
                    <div className="flex items-center gap-2 font-bold text-[#166534]"><CircleCheck size={18} /> Você já está conectado</div>
                    <p className="mt-1 text-sm text-[#365C43]">{currentUser.name} · {currentUser.email}</p>
                    <button type="button" onClick={() => onOpenAccount('dashboard')} className="mt-3 text-sm font-bold text-[#0B5FFF] underline">Gerenciar minha conta</button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    <label className="block text-sm font-semibold text-[#263445]">Nome completo<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-1.5 min-h-12 w-full rounded-lg border border-[#CBD3DF] px-3 py-2 font-normal outline-none focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#0B5FFF]/10" placeholder="Seu nome completo" /></label>
                    <label className="block text-sm font-semibold text-[#263445]">E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="mt-1.5 min-h-12 w-full rounded-lg border border-[#CBD3DF] px-3 py-2 font-normal outline-none focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#0B5FFF]/10" placeholder="voce@exemplo.com.br" /></label>
                    <div className="rounded-lg bg-[#F7F8FA] p-3 text-xs leading-5 text-[#5D6673]">Se ainda não tem conta, será necessário concluir o cadastro antes de ativar uma assinatura. Não solicitamos senha ou dados de cartão nesta etapa.</div>
                  </div>
                )}
                <label className="mt-5 flex items-start gap-3 rounded-lg border border-[#D9DEE7] p-3 text-xs leading-5 text-[#5D6673]"><input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#0B5FFF]" /><span>Li e aceito os <strong className="text-[#0B2345]">Termos de Uso</strong> e a <strong className="text-[#0B2345]">Política de Privacidade</strong> do O PATRIOTA.</span></label>
                {notice && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{notice}</p>}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" onClick={() => setStep(1)} className="min-h-12 rounded-xl border border-[#D9DEE7] px-4 py-3 text-sm font-bold text-[#0B2345]">Voltar</button>
                  <button type="button" onClick={next} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B2345] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#0B5FFF]">Revisar pedido <ArrowRight size={17} /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#16803C]">Etapa 3 de 3</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-[#0B2345]">Pagamento e confirmação</h2>
                <p className="mt-1 text-sm leading-6 text-[#5D6673]">Confira o pedido e selecione a forma de pagamento. Os dados de pagamento devem ser processados por um provedor seguro.</p>
                {isFree ? (
                  <div className="mt-5 rounded-xl border border-[#B9E4C4] bg-[#EBF7EE] p-4 text-sm text-[#166534]"><CircleCheck className="mb-2" size={22} /><strong className="block">Plano gratuito</strong>Não há cobrança. A liberação da conta deve ocorrer após a conclusão do cadastro e validação de acesso.</div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <button type="button" onClick={() => setPaymentMethod('pix')} className={`flex min-h-16 w-full items-center gap-3 rounded-xl border-2 p-4 text-left ${paymentMethod === 'pix' ? 'border-[#16803C] bg-[#F0FBF3]' : 'border-[#D9DEE7]'}`}><QrCode className="text-[#16803C]" size={24} /><span className="flex-1"><strong className="block text-sm text-[#0B2345]">PIX</strong><span className="text-xs text-[#5D6673]">Pagamento instantâneo</span></span>{paymentMethod === 'pix' && <Check className="text-[#16803C]" size={18} />}</button>
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`flex min-h-16 w-full items-center gap-3 rounded-xl border-2 p-4 text-left ${paymentMethod === 'card' ? 'border-[#0B5FFF] bg-[#EFF6FF]' : 'border-[#D9DEE7]'}`}><CreditCard className="text-[#0B5FFF]" size={24} /><span className="flex-1"><strong className="block text-sm text-[#0B2345]">Cartão de crédito</strong><span className="text-xs text-[#5D6673]">Pagamento processado em ambiente seguro</span></span>{paymentMethod === 'card' && <Check className="text-[#0B5FFF]" size={18} />}</button>
                  </div>
                )}
                <div className="mt-5 rounded-xl border border-[#D9DEE7] bg-[#F7F8FA] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0B2345]"><ShieldCheck size={18} className="text-[#16803C]" /> Proteção de dados</div>
                  <p className="mt-1 text-xs leading-5 text-[#5D6673]">Não informe dados do cartão diretamente neste formulário. A cobrança deve ocorrer em checkout hospedado pelo provedor de pagamento.</p>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" onClick={() => setStep(2)} className="min-h-12 rounded-xl border border-[#D9DEE7] px-4 py-3 text-sm font-bold text-[#0B2345]">Voltar</button>
                  <button type="button" onClick={startPayment} disabled={submittingPayment} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#16803C] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#116B31] disabled:cursor-wait disabled:opacity-60"><LockKeyhole size={17} /> {submittingPayment ? 'Preparando pagamento…' : isFree ? 'Ativar acesso livre' : 'Pagar com segurança'}</button>
                </div>
                {notice && <p role="status" className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm leading-5 text-amber-900">{notice}</p>}
              </div>
            )}
          </section>

          <aside className="rounded-2xl border border-[#D9DEE7] bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="font-serif text-xl font-bold text-[#0B2345]">Resumo do pedido</h2>
            <div className="mt-4 rounded-xl bg-[#F7F8FA] p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5D6673]">Plano selecionado</span>
              <h3 className="mt-1 font-bold text-[#0B2345]">{selectedPlan?.name ?? 'Plano'}</h3>
              <p className="mt-1 text-xs leading-5 text-[#5D6673]">{selectedPlan?.description}</p>
              {selectedPlan?.benefits?.slice(0, 4).map((benefit) => <p key={benefit} className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#344054]"><Check className="mt-0.5 shrink-0 text-[#16803C]" size={14} />{benefit}</p>)}
            </div>
            <div className="mt-4 space-y-3 border-b border-[#E5E7EB] pb-4 text-sm">
              <div className="flex justify-between gap-3 text-[#5D6673]"><span>Periodicidade</span><span className="font-semibold text-[#0B2345]">{isFree ? 'Gratuito' : cycle === 'annual' ? 'Anual' : 'Mensal'}</span></div>
              <div className="flex justify-between gap-3 text-[#5D6673]"><span>Forma de pagamento</span><span className="font-semibold text-[#0B2345]">{isFree ? 'Sem cobrança' : paymentMethod === 'pix' ? 'PIX' : 'Cartão'}</span></div>
            </div>
            <div className="flex items-end justify-between gap-3 pt-4"><span className="text-sm font-bold text-[#0B2345]">Total previsto</span><span className="text-right text-2xl font-black text-[#0B2345]">{money(amount)}<span className="block text-xs font-medium text-[#5D6673]">{!isFree && cycle === 'annual' ? 'por ano' : !isFree ? 'por mês' : 'sem cobrança'}</span></span></div>
            <div className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-[#5D6673]"><ShieldCheck className="mt-0.5 shrink-0 text-[#16803C]" size={16} /><span>Checkout responsivo, com resumo sempre visível e sem coleta direta de dados de cartão.</span></div>
            <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-[#5D6673]"><UserRound className="mt-0.5 shrink-0 text-[#0B5FFF]" size={16} /><span>O plano só deve ser ativado após confirmação do backend, nunca apenas pelo navegador.</span></div>
          </aside>
        </div>
      </div>
    </main>
  );
};
