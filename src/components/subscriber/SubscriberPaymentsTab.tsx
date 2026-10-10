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
          Comprovantes de faturamento e notas fiscais eletrônicas de sua assinatura.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
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
