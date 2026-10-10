import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Download,
  Layers,
  FileCode2
} from 'lucide-react';

interface AdminExportTabProps {
  isZipping: boolean;
  zipSuccess: string | null;
  zipError: string | null;
  onDownloadZip: (type: 'theme' | 'plugin' | 'both') => void;
}

export const AdminExportTab: React.FC<AdminExportTabProps> = ({
  isZipping,
  zipSuccess,
  zipError,
  onDownloadZip
}) => {
  return (
    <div className="bg-white p-8 rounded border border-[#D9DEE7] shadow-xs space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 bg-[#EBF7EE] text-[#16803C] text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Instalação Pronta para WordPress Real</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#0B2345]">
          Download dos Pacotes Oficiais de O Patriota
        </h3>
        <p className="text-xs text-[#5D6673] leading-relaxed max-w-2xl mt-1">
          Gere e baixe em 1 clique os arquivos estruturados em formato ZIP padrão do WordPress, prontos para upload direto em <strong>Aparência &gt; Temas</strong> e <strong>Plugins &gt; Adicionar Novo</strong>.
        </p>
      </div>

      {zipSuccess && (
        <div className="p-4 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] rounded text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{zipSuccess}</span>
        </div>
      )}

      {zipError && (
        <div className="p-4 bg-red-50 border border-red-200 text-[#B42318] rounded text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{zipError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Box 1: Theme */}
        <div className="p-6 rounded border border-[#D9DEE7] bg-[#F7F8FA] flex flex-col justify-between">
          <div>
            <FileCode2 className="w-8 h-8 text-[#0B2345] mb-3" />
            <h4 className="font-serif text-base font-bold text-[#0B2345] mb-1">
              Tema Oficial (Block Theme)
            </h4>
            <p className="text-xs text-[#5D6673] mb-4">
              Inclui `style.css`, `theme.json`, templates FSE, patterns 3-col e 6-col, e tipografia editorial.
            </p>
          </div>
          <button
            onClick={() => onDownloadZip('theme')}
            disabled={isZipping}
            className="w-full bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold py-2.5 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Tema (.ZIP)</span>
          </button>
        </div>

        {/* Box 2: Plugin */}
        <div className="p-6 rounded border border-[#D9DEE7] bg-[#F7F8FA] flex flex-col justify-between">
          <div>
            <Layers className="w-8 h-8 text-[#0B5FFF] mb-3" />
            <h4 className="font-serif text-base font-bold text-[#0B2345] mb-1">
              Plugin Editorial Avançado
            </h4>
            <p className="text-xs text-[#5D6673] mb-4">
              Central de Fontes RSS, motor de deduplicação em 5 camadas, checagem ClaimReview e esteira de redação.
            </p>
          </div>
          <button
            onClick={() => onDownloadZip('plugin')}
            disabled={isZipping}
            className="w-full bg-[#0B5FFF] hover:bg-[#0B2345] text-white text-xs font-bold py-2.5 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Plugin (.ZIP)</span>
          </button>
        </div>

        {/* Box 3: Suite Completa */}
        <div className="p-6 rounded border border-[#16803C]/30 bg-[#EBF7EE] flex flex-col justify-between">
          <div>
            <Download className="w-8 h-8 text-[#16803C] mb-3" />
            <h4 className="font-serif text-base font-bold text-[#16803C] mb-1">
              Suíte Completa O Patriota
            </h4>
            <p className="text-xs text-[#16803C]/80 mb-4">
              Pacote com Tema + Plugin + Documentação técnica completa de arquitetura e implantação.
            </p>
          </div>
          <button
            onClick={() => onDownloadZip('both')}
            disabled={isZipping}
            className="w-full bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold py-2.5 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Pacote Completo (.ZIP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
