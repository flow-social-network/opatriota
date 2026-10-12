import React from 'react';
import { PaymentRecord } from '../../types';

interface SubscriberPaymentsTabProps {
  payments: PaymentRecord[];
}

export const SubscriberPaymentsTab: React.FC<SubscriberPaymentsTabProps> = ({ payments }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#0B2345]">Histórico de Pagamentos</h3>
        <p className="text-xs text-[#5D6673] mt-1">
          Histórico de cobranças registradas pelo provedor. A referência abaixo identifica o pedido; não é uma nota fiscal.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F7F8FA] border-b border-[#D9DEE7] text-[#5D6673] uppercase text-[10px] font-bold">
            <tr>
              <th className="py-2.5 px-3">Data</th>
              <th className="py-2.5 px-3">Plano / Descrição</th>
              <th className="py-2.5 px-3">Valor</th>
              <th className="py-2.5 px-3">Referência do pedido</th>
              <th className="py-2.5 px-3">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9DEE7]">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-[#F7F8FA]">
                <td className="py-3 px-3 font-semibold">{p.date ? new Date(p.date).toLocaleDateString('pt-BR') : '—'}</td>
                <td className="py-3 px-3">{p.planName}</td>
                <td className="py-3 px-3 font-bold text-[#0B2345]">R$ {p.amount.toFixed(2)}</td>
                <td className="py-3 px-3 font-mono text-[11px] text-[#5D6673]">{p.orderReference}</td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${p.status === 'concluido' ? 'bg-[#EBF7EE] text-[#16803C]' : p.status === 'reembolsado' ? 'bg-amber-100 text-amber-800' : p.status === 'cancelado' ? 'bg-slate-100 text-slate-700' : p.status === 'recusado' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {p.status === 'concluido' ? 'Pago' : p.status === 'reembolsado' ? 'Reembolsado' : p.status === 'cancelado' ? 'Cancelado' : p.status === 'recusado' ? 'Recusado' : 'Em processamento'}
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
