import React from 'react';
import { SubscriptionPlan } from '../../types';
import { CheckCircle2, Crown, ArrowRight, ShieldCheck } from 'lucide-react';

type PlanId = 'gratuito' | 'digital' | 'premium';

interface SubscriberSubscriptionTabProps {
  plans: SubscriptionPlan[];
  activePlanId: PlanId;
  successMessage: string | null;
  onChangePlan: (planId: PlanId) => void;
}

export const SubscriberSubscriptionTab: React.FC<SubscriberSubscriptionTabProps> = ({
  plans,
  activePlanId,
  successMessage,
  onChangePlan
}) => {
  const activePlan = plans.find((plan) => plan.id === activePlanId);
  const activePrice = Number(activePlan?.priceMonthly ?? 0);
  const formatPrice = (value: unknown) => {
    const amount = Number(value ?? 0);
    return Number.isFinite(amount) ? amount.toFixed(2) : '0.00';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0B5FFF]">Minha conta</p><h3 className="mt-1 font-serif text-3xl font-black text-[#0B2345]">Minha Assinatura</h3><p className="mt-1 text-sm text-[#5D6673]">Gerencie seu plano, benefícios e próxima renovação.</p></div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#DDF7E7] px-3 py-1.5 text-xs font-black text-[#16803C]"><CheckCircle2 className="h-4 w-4" /> ASSINATURA ATIVA</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-2xl bg-gradient-to-br from-[#061D40] via-[#0B356D] to-[#087CA8] p-6 text-white shadow-lg"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#FFCC29]">Plano atual</p><h4 className="mt-2 flex items-center gap-2 font-serif text-3xl font-black">{activePlan?.name || 'Premium'} <Crown className="h-6 w-6 text-[#FFCC29]" /></h4></div><div className="rounded-xl bg-white/10 p-3"><ShieldCheck className="h-7 w-7 text-[#FFCC29]" /></div></div><div className="mt-7 grid gap-4 border-t border-white/20 pt-4 sm:grid-cols-3"><div><span className="block text-xs text-white/65">Valor mensal</span><b className="text-lg">R$ {formatPrice(activePrice)}</b></div><div><span className="block text-xs text-white/65">Próxima cobrança</span><b className="text-lg">13 nov. 2026</b></div><div><span className="block text-xs text-white/65">Pagamento</span><b className="text-lg">PIX</b></div></div></div>
        <div className="rounded-2xl border border-[#D9E6F5] bg-white p-5 shadow-sm"><h4 className="font-bold text-[#0B2345]">Resumo do plano</h4><ul className="mt-4 space-y-3 text-sm text-[#405571]"><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> Jornal Digital completo</li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> Colunas e análises exclusivas</li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> Vídeos, podcasts e newsletter</li></ul><button className="mt-5 flex w-full items-center justify-between rounded-lg border border-[#0B5FFF] px-4 py-2.5 text-sm font-bold text-[#0B5FFF] hover:bg-[#EEF5FF]">Gerenciar assinatura <ArrowRight className="h-4 w-4" /></button></div>
      </div>
      <div><h4 className="font-serif text-2xl font-black text-[#0B2345]">Escolha outro plano</h4><p className="mt-1 text-sm text-[#5D6673]">Você pode alterar sua assinatura quando quiser.</p></div>

      {successMessage && (
        <div className="p-3 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((plan) => {
          const isCurrent = activePlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded border p-6 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-[#0B2345] bg-[#F7F8FA] ring-2 ring-[#0B2345]/20 shadow-md'
                  : 'border-[#D9DEE7] bg-white hover:border-[#0B5FFF]'
              }`}
            >
              <div>
                {plan.badge && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-3 ${
                    plan.id === 'premium' ? 'bg-[#FFCC29] text-[#17202A]' : 'bg-[#0B2345] text-white'
                  }`}>
                    {plan.badge}
                  </span>
                )}
                <h4 className="font-serif text-lg font-bold text-[#0B2345] mb-1">
                  {plan.name}
                </h4>
                <p className="text-xs text-[#5D6673] mb-4 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-2xl font-black text-[#0B2345]">
                    {Number(plan.priceMonthly ?? 0) === 0 ? 'Grátis' : `R$ ${formatPrice(plan.priceMonthly)}`}
                  </span>
                  {Number(plan.priceMonthly ?? 0) > 0 && <span className="text-xs text-[#5D6673]"> /mês</span>}
                </div>

                <ul className="space-y-2 text-xs text-[#5D6673] mb-6">
                  {(plan.benefits ?? []).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {isCurrent ? (
                  <div className="w-full text-center py-2 bg-[#EBF7EE] text-[#16803C] font-bold text-xs rounded border border-[#16803C]/30">
                    ✓ SEU PLANO ATIVO
                  </div>
                ) : (
                  <button
                    onClick={() => { onChangePlan(plan.id); }}
                    className="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2.5 rounded transition cursor-pointer"
                  >
                    {plan.id === 'gratuito' ? 'MUDAR PARA GRÁTIS' : `ASSINAR ${plan.name.toUpperCase()}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
