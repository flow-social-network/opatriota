import React, { useState } from 'react';
import { SubscriptionPlan, UserSession } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { PixDonationCard } from '../PixDonationCard';
import { 
  Check, 
  ShieldCheck, 
  Zap, 
  Star, 
  HelpCircle, 
  ArrowRight,
  Lock,
  Sparkles,
  QrCode,
  CreditCard,
  FileText
} from 'lucide-react';

interface PlansPageViewProps {
  plans: SubscriptionPlan[];
  currentUser: UserSession | null;
  onSelectPlan: (planId: string) => void;
  onNavigateHome: () => void;
}

export const PlansPageView: React.FC<PlansPageViewProps> = ({
  plans,
  currentUser,
  onSelectPlan,
  onNavigateHome
}) => {
  const [activeMode, setActiveMode] = useState<'planos' | 'pix'>('planos');

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Assinaturas & Apoio' }
            ]}
          />
          <span className="text-xs text-[#5D6673]">
            Planos de Leitura & Doações O Patriota
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 pt-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="bg-[#0B2345] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded inline-block mb-3">
            LIBERDADE & INDEPENDÊNCIA EDITORIAL
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#0B2345] tracking-tight mb-4">
            Escolha Como Fortalecer o Jornalismo que Defende o Brasil
          </h1>
          <p className="text-sm md:text-base text-[#404B5A] leading-relaxed">
            Sua contribuição financia repórteres credenciados no Congresso e tribunais, investigações exclusivas e o combate diário à desinformação com independência absoluta.
          </p>

          {/* Mode Selector Tabs */}
          <div className="mt-8 inline-flex items-center bg-[#E2E6EC] p-1.5 rounded-full shadow-inner">
            <button
              onClick={() => setActiveMode('planos')}
              className={`px-6 py-2.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeMode === 'planos'
                  ? 'bg-[#0B2345] text-white shadow-xs'
                  : 'text-[#0B2345] hover:text-black'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>PLANOS DE ASSINATURA</span>
            </button>
            <button
              onClick={() => setActiveMode('pix')}
              className={`px-6 py-2.5 rounded-full text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                activeMode === 'pix'
                  ? 'bg-[#32BCAD] text-white shadow-xs'
                  : 'text-[#0B2345] hover:text-[#32BCAD]'
              }`}
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>DOAÇÃO VIA PIX / QR CODE</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: PIX DONATION INSTANT */}
        {activeMode === 'pix' && (
          <div className="max-w-3xl mx-auto mb-16 animate-in fade-in duration-300">
            <PixDonationCard />
          </div>
        )}

        {/* VIEW 2: SUBSCRIPTION PLANS */}
        {activeMode === 'planos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16 animate-in fade-in duration-300">
            {plans.map((plan) => {
              const isCurrent = currentUser?.subscription.plan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl flex flex-col justify-between transition relative border-2 ${
                    plan.bestValue
                      ? 'border-[#16803C] shadow-xl md:-translate-y-2'
                      : plan.isPopular
                      ? 'border-[#0B5FFF] shadow-lg md:-translate-y-1'
                      : 'border-[#D9DEE7] shadow-xs'
                  }`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <div className={`text-center py-2 text-[11px] font-black tracking-widest uppercase rounded-t-[14px] ${
                      plan.bestValue
                        ? 'bg-[#16803C] text-white'
                        : plan.isPopular
                        ? 'bg-[#0B5FFF] text-white'
                        : 'bg-[#F1F3F5] text-[#0B2345]'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-black text-[#0B2345] mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-[#5D6673] min-h-8 mb-4 leading-relaxed">
                        {plan.description}
                      </p>

                      {/* Price Block */}
                      <div className="mb-6 pb-6 border-b border-[#EAECEF]">
                        {plan.originalPriceMonthly && (
                          <div className="text-xs text-[#718096] line-through font-medium mb-0.5">
                            De R$ {plan.originalPriceMonthly.toFixed(2).replace('.', ',')}
                          </div>
                        )}
                        {plan.originalPriceAnnual && (
                          <div className="text-xs text-[#718096] line-through font-medium mb-0.5">
                            De R$ {plan.originalPriceAnnual.toFixed(2).replace('.', ',')}
                          </div>
                        )}

                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-[#5D6673]">R$</span>
                          <span className={`font-serif text-4xl md:text-5xl font-black ${
                            plan.bestValue ? 'text-[#16803C]' : 'text-[#0B2345]'
                          }`}>
                            {plan.id === 'premium' 
                              ? plan.priceAnnual.toFixed(2).replace('.', ',')
                              : plan.priceMonthly.toFixed(2).replace('.', ',')
                            }
                          </span>
                          <span className="text-xs text-[#717E8E] font-medium">
                            {plan.id === 'premium' ? '/ ano inteiro' : '/mês'}
                          </span>
                        </div>

                        {/* Promo explanation */}
                        {plan.promoNotice && (
                          <div className="text-[11px] font-bold text-[#16803C] bg-[#EBF7EE] p-2 rounded-lg mt-2.5 leading-snug">
                            {plan.promoNotice}
                          </div>
                        )}

                        {plan.id === 'gratuito' && (
                          <div className="text-[11px] text-[#5D6673] font-semibold mt-2">
                            100% gratuito, sem necessidade de cartão de crédito
                          </div>
                        )}

                        {plan.loyaltyTerm && (
                          <div className="text-[10px] text-[#718096] italic mt-2">
                            {plan.loyaltyTerm}
                          </div>
                        )}
                      </div>

                      {/* Benefits List */}
                      <div className="space-y-3 mb-8 text-xs text-[#2D3748]">
                        {plan.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                              plan.bestValue ? 'text-[#16803C]' : 'text-[#0B5FFF]'
                            }`} />
                            <span className="leading-snug font-medium">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div>
                      {isCurrent ? (
                        <div className="w-full bg-[#16803C]/10 text-[#16803C] border border-[#16803C]/30 text-xs font-bold py-3.5 rounded-xl text-center">
                          Plano Ativo na Sua Conta
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectPlan(plan.id)}
                          className={`w-full py-4 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                            plan.bestValue
                              ? 'bg-[#16803C] hover:bg-[#1f9b4b] text-white shadow-lg active:scale-98'
                              : plan.isPopular
                              ? 'bg-[#0B2345] hover:bg-[#0B5FFF] text-white shadow-md active:scale-98'
                              : 'bg-[#F1F3F5] hover:bg-[#E2E6EC] text-[#0B2345] active:scale-98'
                          }`}
                        >
                          <span>{plan.id === 'gratuito' ? 'Cadastrar Gratuitamente' : 'Assinar Agora'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] py-2.5 px-4 rounded-b-2xl border-t border-[#EAECEF] text-center text-[10px] text-[#717E8E]">
                    Acesso imediato após confirmação segura
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust Badges */}
        <div className="bg-white border border-[#D9DEE7] rounded-2xl p-6 mb-12 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#EAECEF]">
            <div className="px-4 py-2">
              <ShieldCheck className="w-8 h-8 text-[#16803C] mx-auto mb-2" />
              <h4 className="font-bold text-xs uppercase text-[#0B2345]">Jornalismo 100% Independente</h4>
              <p className="text-[11px] text-[#5D6673] mt-1">Sem subvenção pública ou amarras ideológicas</p>
            </div>
            <div className="px-4 py-2">
              <Lock className="w-8 h-8 text-[#0B5FFF] mx-auto mb-2" />
              <h4 className="font-bold text-xs uppercase text-[#0B2345]">Pagamento 100% Seguro</h4>
              <p className="text-[11px] text-[#5D6673] mt-1">Criptografia bancária de ponta a ponta</p>
            </div>
            <div className="px-4 py-2">
              <FileText className="w-8 h-8 text-[#FFCC29] text-amber-500 mx-auto mb-2" />
              <h4 className="font-bold text-xs uppercase text-[#0B2345]">Réplica em PDF & Acervo</h4>
              <p className="text-[11px] text-[#5D6673] mt-1">Edição digital folheável e dossiês históricos</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-white border border-[#D9DEE7] rounded-2xl p-8 md:p-12 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0B2345] mb-2">
              Perguntas Frequentes sobre as Assinaturas e Apoio
            </h2>
            <p className="text-xs md:text-sm text-[#5D6673]">
              Tire suas dúvidas sobre planos, cancelamento, réplica digital folheável e doações Pix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#2D3748]">
            <div className="p-5 bg-[#F8FAFC] rounded-xl border border-[#EAECEF]">
              <h3 className="font-bold text-[#0B2345] text-sm mb-1.5">
                Como funciona a réplica digital folheável (PDF)?
              </h3>
              <p className="leading-relaxed text-[#5D6673]">
                Assinantes dos planos Digital e CP Econômico têm acesso diário matutino à edição diagramada completa em alta definição para leitura no celular, tablet ou computador.
              </p>
            </div>

            <div className="p-5 bg-[#F8FAFC] rounded-xl border border-[#EAECEF]">
              <h3 className="font-bold text-[#0B2345] text-sm mb-1.5">
                O que é a promoção de R$ 6,50 por 3 meses?
              </h3>
              <p className="leading-relaxed text-[#5D6673]">
                É a nossa oferta de boas-vindas: você usufrui de todo o conteúdo ilimitado por apenas R$ 6,50 mensais durante os três primeiros meses, passando para o valor regular de R$ 20,70 a partir do quarto mês.
              </p>
            </div>

            <div className="p-5 bg-[#F8FAFC] rounded-xl border border-[#EAECEF]">
              <h3 className="font-bold text-[#0B2345] text-sm mb-1.5">
                Posso doar via Pix sem assinar mensalmente?
              </h3>
              <p className="leading-relaxed text-[#5D6673]">
                Sim! Basta selecionar a aba "Doação via Pix" no topo desta página, escanear o QR Code ou copiar o código Pix para contribuir com qualquer valor de forma direta e pontual.
              </p>
            </div>

            <div className="p-5 bg-[#F8FAFC] rounded-xl border border-[#EAECEF]">
              <h3 className="font-bold text-[#0B2345] text-sm mb-1.5">
                Como funciona a renovação do plano anual?
              </h3>
              <p className="leading-relaxed text-[#5D6673]">
                O plano CP Digital Anual possui fidelidade de 12 meses e renovação automática ao final do período, garantindo a tarifa econômica contratada. Você pode gerenciar sua assinatura no painel Minha Conta.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
