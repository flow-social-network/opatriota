import React from 'react';
import { EditorialQueueItem, EditorialStatus } from '../../types';
import {
  classifyLeadFactualStatus,
  isGloboSource
} from '../../utils/editorialPolicy';
import {
  AlertCircle,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';

interface AdminQueueTabProps {
  items: EditorialQueueItem[];
  queueFilter: string;
  onQueueFilterChange: (value: string) => void;
  onStatusChange: (id: number, newStatus: EditorialStatus) => void;
}

export const AdminQueueTab: React.FC<AdminQueueTabProps> = ({
  items,
  queueFilter,
  onQueueFilterChange,
  onStatusChange
}) => {
  return (
    <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0B2345]">
            Fila de Triagem e Produção Editorial
          </h3>
          <p className="text-xs text-[#5D6673]">
            Gerencie a esteira jornalística. Nenhuma notícia é publicada sem revisão humana.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0B2345]">Status:</span>
          <select
            value={queueFilter}
            onChange={(e) => onQueueFilterChange(e.target.value)}
            className="border border-[#D9DEE7] text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#0B5FFF]"
          >
            <option value="TODAS">Todas as Fases</option>
            <option value="RECEBIDA">Recebida</option>
            <option value="EM TRIAGEM">Em Triagem</option>
            <option value="EM APURAÇÃO">Em Apuração</option>
            <option value="EM REDAÇÃO">Em Redação</option>
            <option value="EM REVISÃO">Em Revisão</option>
            <option value="PUBLICADA">Publicada</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const isGlobo = isGloboSource(item.sourceName) || isGloboSource(item.originalUrl) || item.editorialPolicy === 'EXCLUIDA_POLITICA_EDITORIAL';
          const factAnalysis = classifyLeadFactualStatus(item.title, item.summary, item.sourceName);

          return (
            <div
              key={item.id}
              className={`p-4 rounded border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isGlobo ? 'bg-rose-50/50 border-rose-300 hover:border-rose-500' : 'bg-[#F7F8FA] border-[#D9DEE7] hover:border-[#0B5FFF]'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#5D6673] uppercase mb-1 flex-wrap">
                  <span className="text-[#0B5FFF]">{item.category}</span>
                  <span>•</span>
                  <span>{item.sourceName}</span>
                  <span>•</span>
                  <span>{item.capturedAt}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${factAnalysis.badgeClass}`}>
                    {factAnalysis.label}
                  </span>
                </div>

                <h4 className="font-serif text-sm font-bold text-[#0B2345] mb-1.5">
                  {item.title}
                </h4>

                <p className="text-xs text-[#5D6673] mb-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Explicit Warning for Excluded/Globo Source */}
                {isGlobo && (
                  <div className="mb-2 p-2 bg-rose-100/70 border border-rose-300 rounded text-rose-900 text-[11px] flex items-start gap-1.5 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>RESTRIÇÃO EDITORIAL — GRUPO GLOBO:</strong> Vedado como fonte de sustentação. A redação deve buscar confirmação em documentos originais, registros oficiais ou fontes independentes autorizadas.
                    </span>
                  </div>
                )}

                {/* Speculative Headline Warning */}
                {factAnalysis.isSpeculative && !isGlobo && (
                  <div className="mb-2 p-2 bg-amber-50 border border-amber-300 rounded text-amber-900 text-[11px] flex items-start gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>MANCHETE ESPECULATIVA:</strong> {factAnalysis.recommendation}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="text-slate-500">
                    Deduplicação: <strong className="text-slate-700">{item.dedupStatus}</strong> ({item.dedupReason})
                  </span>
                  {item.assignedTo && (
                    <span className="text-blue-700 font-semibold">
                      Responsável: {item.assignedTo}
                    </span>
                  )}
                </div>
              </div>

            {/* Actions for editorial transition */}
            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <select
                value={item.editorialStatus}
                onChange={(e) => onStatusChange(item.id, e.target.value as EditorialStatus)}
                className="border border-[#D9DEE7] bg-white text-xs font-bold text-[#0B2345] px-2.5 py-1.5 rounded focus:outline-none"
              >
                <option value="RECEBIDA">1. Recebida</option>
                <option value="EM TRIAGEM">2. Em Triagem</option>
                <option value="EM APURAÇÃO">3. Em Apuração</option>
                <option value="EM REDAÇÃO">4. Em Redação</option>
                <option value="EM REVISÃO">5. Em Revisão</option>
                <option value="APROVADA">6. Aprovada</option>
                <option value="PUBLICADA">7. Publicada</option>
                <option value="REJEITADA">Rejeitada</option>
              </select>

              <a
                href={item.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 border border-[#D9DEE7] bg-white rounded text-[#5D6673] hover:text-[#0B2345] transition"
                title="Abrir URL original da fonte"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
