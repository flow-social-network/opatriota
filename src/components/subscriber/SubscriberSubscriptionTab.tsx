import React from 'react';
import { SubscriptionPlan } from '../../types';
import { CheckCircle2 } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#0B2345]">Planos de Assinatura</h3>
        <p className="text-xs text-[#5D6673] mt-1">
          Escolha a modalidade que melhor se adapta à sua rotina de leitura e fortaleça o jornalismo nacional independente.
        </p>
      </div>

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
                    {plan.priceMonthly === 0 ? 'Grátis' : `R$ ${plan.priceMonthly.toFixed(2)}`}
                  </span>
                  {plan.priceMonthly > 0 && <span className="text-xs text-[#5D6673]"> /mês</span>}
                </div>

                <ul className="space-y-2 text-xs text-[#5D6673] mb-6">
                  {plan.benefits.map((b, idx) => (
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
