import React from 'react';
import { PaymentRecord } from '../../types';
import { CreditCard, Plus, ShieldCheck, WalletCards, ArrowRight } from 'lucide-react';

interface SubscriberPaymentsTabProps {
  payments: PaymentRecord[];
}

export const SubscriberPaymentsTab: React.FC<SubscriberPaymentsTabProps> = ({ payments }) => {
  return (
    <div className="space-y-6">
      <div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0B5FFF]">Financeiro</p><h3 className="mt-1 font-serif text-3xl font-black text-[#0B2345]">Forma de Pagamento</h3><p className="mt-1 text-sm text-[#5D6673]">Gerencie seus métodos de pagamento e acompanhe o histórico da assinatura.</p></div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-2xl bg-gradient-to-br from-[#0B2345] to-[#0B5FFF] p-6 text-white shadow-lg"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-white/70">Método principal</p><h4 className="mt-3 flex items-center gap-2 text-2xl font-black"><CreditCard className="h-6 w-6 text-[#FFCC29]" /> PIX</h4><p className="mt-2 text-sm text-white/75">Usado na renovação da assinatura Premium</p></div><ShieldCheck className="h-7 w-7 text-[#FFCC29]" /></div><div className="mt-7 flex items-center justify-between border-t border-white/20 pt-4"><span className="text-sm text-white/70">Próxima cobrança</span><b>13 nov. 2026 · R$ 24,90</b></div></div>
        <div className="rounded-2xl border border-[#D9E6F5] bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-[#EAF3FF] p-3"><WalletCards className="h-5 w-5 text-[#0B5FFF]" /></div><div><h4 className="font-bold text-[#0B2345]">Métodos cadastrados</h4><p className="text-xs text-[#5D6673]">PIX e cartão com segurança</p></div></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B5FFF] px-4 py-3 text-sm font-bold text-white hover:bg-[#084BC4]"><Plus className="h-4 w-4" /> Adicionar forma de pagamento</button></div>
      </div>
      <div className="flex items-center justify-between"><div><h4 className="font-serif text-2xl font-black text-[#0B2345]">Histórico de pagamentos</h4><p className="mt-1 text-sm text-[#5D6673]">Comprovantes e notas fiscais da sua assinatura.</p></div><button className="hidden items-center gap-2 text-sm font-bold text-[#0B5FFF] sm:flex">Ver todos <ArrowRight className="h-4 w-4" /></button></div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left overflow-hidden rounded-xl">
          <thead className="bg-[#F7F8FA] border-b border-[#D9DEE7] text-[#5D6673] uppercase text-[10px] font-bold">
            <tr>
              <th className="py-2.5 px-3">Data</th>
              <th className="py-2.5 px-3">Plano / Descrição</th>
              <th className="py-2.5 px-3">Valor</th>
              <th className="py-2.5 px-3">Nota Fiscal</th>
              <th className="py-2.5 px-3">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9DEE7]">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F8FA]">
                <td className="py-3 px-3 font-semibold">{p.date}</td>
                <td className="py-3 px-3">{p.planName}</td>
                <td className="py-3 px-3 font-bold text-[#0B2345]">R$ {p.amount.toFixed(2)}</td>
                <td className="py-3 px-3 font-mono text-[11px] text-[#5D6673]">{p.invoiceNumber}</td>
                <td className="py-3 px-3">
                  <span className="bg-[#EBF7EE] text-[#16803C] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Concluído
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
