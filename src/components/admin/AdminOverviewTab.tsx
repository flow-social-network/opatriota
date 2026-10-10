import React from 'react';
import { RssSource, EditorialQueueItem } from '../../types';

interface AdminOverviewTabProps {
  sources: RssSource[];
  queueItems: EditorialQueueItem[];
  onNavigateToQueue: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  sources,
  queueItems,
  onNavigateToQueue
}) => {
  return (
    <div className="space-y-8">
      {/* Metric KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B2345] shadow-xs">
          <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Total de Pautas</div>
          <div className="text-3xl font-black text-[#0B2345] mt-1">{queueItems.length + 128}</div>
          <div className="text-[11px] text-[#16803C] mt-2 font-semibold">↑ Ingestão contínua</div>
        </div>

        <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B5FFF] shadow-xs">
          <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Pendentes de Triagem</div>
          <div className="text-3xl font-black text-[#0B5FFF] mt-1">
            {queueItems.filter(i => i.editorialStatus === 'RECEBIDA' || i.editorialStatus === 'EM TRIAGEM').length}
          </div>
          <div className="text-[11px] text-[#5D6673] mt-2">Aguardando decisão humana</div>
        </div>

        <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#16803C] shadow-xs">
          <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Em Redação / Apuração</div>
          <div className="text-3xl font-black text-[#16803C] mt-1">
            {queueItems.filter(i => i.editorialStatus === 'EM REDAÇÃO' || i.editorialStatus === 'EM APURAÇÃO').length}
          </div>
          <div className="text-[11px] text-[#16803C] mt-2 font-semibold">Repórteres alocados</div>
        </div>

        <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#B42318] shadow-xs">
          <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Duplicados Bloqueados</div>
          <div className="text-3xl font-black text-[#B42318] mt-1">19</div>
          <div className="text-[11px] text-[#B42318] mt-2 font-semibold">Filtrados pelas 5 camadas</div>
        </div>

        <div className="bg-white p-5 rounded border border-[#D9DEE7] border-l-4 border-l-[#FFCC29] shadow-xs">
          <div className="text-[11px] font-bold text-[#5D6673] uppercase tracking-wider">Fontes Monitoradas</div>
          <div className="text-3xl font-black text-[#17202A] mt-1">{sources.length}</div>
          <div className="text-[11px] text-[#5D6673] mt-2">Senado, Câmara, STF, EBC</div>
        </div>
      </div>

      {/* Workflow Pipeline Graphic */}
      <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs">
        <h3 className="font-serif text-base font-bold text-[#0B2345] mb-4">
          Pipeline da Esteira Editorial de O Patriota
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3 bg-[#F1F3F5] rounded border border-[#D9DEE7]">
            <span className="font-bold text-[#0B2345] block mb-1">1. RECEBIDA</span>
            <span className="text-[10px] text-[#5D6673]">Captura RSS segura com proteção XXE</span>
          </div>
          <div className="p-3 bg-[#F1F3F5] rounded border border-[#D9DEE7]">
            <span className="font-bold text-[#0B2345] block mb-1">2. TRIAGEM</span>
            <span className="text-[10px] text-[#5D6673]">Deduplicação 5 Camadas</span>
          </div>
          <div className="p-3 bg-[#EBF7EE] rounded border border-[#16803C]/30 text-[#16803C]">
            <span className="font-bold block mb-1">3. APURAÇÃO</span>
            <span className="text-[10px]">Checagem de fontes primárias</span>
          </div>
          <div className="p-3 bg-[#EBF7EE] rounded border border-[#16803C]/30 text-[#16803C]">
            <span className="font-bold block mb-1">4. REDAÇÃO</span>
            <span className="text-[10px]">Criação de Rascunho WP Nativo</span>
          </div>
          <div className="p-3 bg-[#F1F3F5] rounded border border-[#D9DEE7]">
            <span className="font-bold text-[#0B2345] block mb-1">5. REVISÃO</span>
            <span className="text-[10px] text-[#5D6673]">Chefe de Redação / Editor</span>
          </div>
          <div className="p-3 bg-[#0B2345] text-white rounded">
            <span className="font-bold block mb-1">6. PUBLICADA</span>
            <span className="text-[10px] text-white/80">Apenas por Humano Autorizado</span>
          </div>
        </div>
      </div>

      {/* Recent Items Preview Table */}
      <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-bold text-[#0B2345]">
            Últimos Itens Ingeridos das Fontes Oficiais
          </h3>
          <button
            onClick={onNavigateToQueue}
            className="text-xs font-bold text-[#0B5FFF] hover:underline cursor-pointer"
          >
            Ver todos na Fila Editorial →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F8FA] border-b border-[#D9DEE7] text-[#5D6673] uppercase font-bold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Título da Notícia</th>
                <th className="py-2.5 px-3">Fonte Oficial</th>
                <th className="py-2.5 px-3">Editoria</th>
                <th className="py-2.5 px-3">Deduplicação</th>
                <th className="py-2.5 px-3">Status Editorial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE7]">
              {queueItems.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-[#F7F8FA]">
                  <td className="py-3 px-3 font-semibold text-[#17202A] max-w-md">
                    {item.title}
                  </td>
                  <td className="py-3 px-3 text-[#5D6673]">{item.sourceName}</td>
                  <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#0B5FFF]">{item.category}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.dedupStatus === 'NOVO' ? 'bg-[#EBF7EE] text-[#16803C]' : 'bg-[#FEF3F2] text-[#B42318]'
                    }`}>
                      {item.dedupStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[11px] text-[#0B2345]">
                    {item.editorialStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
