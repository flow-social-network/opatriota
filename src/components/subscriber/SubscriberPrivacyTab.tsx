import React from 'react';
import { Download } from 'lucide-react';

interface SubscriberPrivacyTabProps {
  deletionRequested: boolean;
  deletionProtocol: string | null;
  onExportData: () => void;
  onRequestDeletion: () => void;
}

export const SubscriberPrivacyTab: React.FC<SubscriberPrivacyTabProps> = ({
  deletionRequested,
  deletionProtocol,
  onExportData,
  onRequestDeletion
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#0B2345]">Privacidade e Gestão de Dados (LGPD)</h3>
        <p className="text-xs text-[#5D6673] mt-1">
          Em conformidade com a Lei nº 13.709/2018, você possui controle absoluto sobre seus dados.
        </p>
      </div>

      <div className="p-4 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-3 text-xs">
        <strong className="text-[#0B2345] block font-semibold">1. Portabilidade e Exportação de Dados</strong>
        <p className="text-[#5D6673]">
          Baixe uma cópia estruturada em formato JSON de todos os seus dados pessoais, histórico de assinaturas e preferências armazenadas no sistema.
        </p>
        <button
          onClick={onExportData}
          className="inline-flex items-center gap-1.5 bg-white border border-[#D9DEE7] hover:border-[#0B2345] text-[#0B2345] font-bold px-3 py-1.5 rounded transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Meus Dados (JSON)</span>
        </button>
      </div>

      <div className="p-4 bg-[#FEF3F2] border border-[#B42318]/30 rounded space-y-3 text-xs">
        <strong className="text-[#B42318] block font-semibold">2. Direito ao Esquecimento / Exclusão de Conta</strong>
        <p className="text-[#5D6673]">
          Ao solicitar a exclusão de sua conta, seus dados de perfil, favoritos e sessões ativas serão permanentemente apagados dos servidores de O Patriota, mantendo-se apenas os registros contábeis estritamente exigidos pela legislação fiscal brasileira.
        </p>

        {deletionRequested ? (
          <div className="p-3 bg-white border border-[#B42318] text-[#B42318] font-bold rounded">
            ✓ Solicitação de exclusão protocolada sob o código {deletionProtocol}. O prazo será informado pela equipe após análise.
          </div>
        ) : (
          <button
            onClick={onRequestDeletion}
            className="bg-[#B42318] hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded transition cursor-pointer"
          >
            SOLICITAR EXCLUSÃO DEFINITIVA DA CONTA
          </button>
        )}
      </div>
    </div>
  );
};
