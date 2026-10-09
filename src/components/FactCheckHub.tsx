import React, { useState } from 'react';
import { FactCheckItem, FactVerdict } from '../types';
import { ShieldAlert, CheckCircle, AlertTriangle, FileText, ArrowLeft, ExternalLink, UploadCloud } from 'lucide-react';

interface FactCheckHubProps {
  factChecks: FactCheckItem[];
  onBack: () => void;
  onOpenItem: (item: FactCheckItem) => void;
  onStartCheck?: () => void;
}

export const FactCheckHub: React.FC<FactCheckHubProps> = ({
  factChecks,
  onBack,
  onOpenItem,
  onStartCheck
}) => {
  const [filterVerdict, setFilterVerdict] = useState<string>('TODOS');
  const [activeItem, setActiveItem] = useState<FactCheckItem | null>(null);

  const filtered = filterVerdict === 'TODOS'
    ? factChecks
    : factChecks.filter((f) => f.verdict === filterVerdict);

  const getVerdictBadge = (verdict: FactVerdict) => {
    switch (verdict) {
      case 'VERDADEIRO':
        return <span className="bg-[#16803C] text-white text-[11px] font-black px-2.5 py-1 rounded uppercase tracking-wider">VERDADEIRO</span>;
      case 'FALSO':
        return <span className="bg-[#B42318] text-white text-[11px] font-black px-2.5 py-1 rounded uppercase tracking-wider">FALSO</span>;
      case 'ENGANOSO':
        return <span className="bg-[#D97706] text-white text-[11px] font-black px-2.5 py-1 rounded uppercase tracking-wider">ENGANOSO</span>;
      case 'FORA DE CONTEXTO':
        return <span className="bg-[#2563EB] text-white text-[11px] font-black px-2.5 py-1 rounded uppercase tracking-wider">FORA DE CONTEXTO</span>;
      default:
        return <span className="bg-[#5D6673] text-white text-[11px] font-black px-2.5 py-1 rounded uppercase tracking-wider">NÃO COMPROVADO</span>;
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8 select-none">
      {/* Back button */}
      <div className="mb-6 pb-4 border-b border-[#D9DEE7] flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLTAR PARA A HOMEPAGE</span>
        </button>

        <span className="text-xs text-[#5D6673] font-medium">
          Agência Oficial de Verificação de Fatos de O Patriota
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-[#0B2345] text-white p-8 rounded border border-[#07172E] mb-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#16803C] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>VERIFICAÇÃO FACTUAL RIGOROSA</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
            Agência de Checagem — O Patriota
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Nossa missão é combater a desinformação com método transparente, consulta a documentos oficiais primários, auditoria de dados públicos e compromisso irrestrito com a verdade dos fatos.
          </p>
          <button onClick={onStartCheck} className="mt-5 inline-flex items-center gap-2 rounded bg-[#FFCC29] px-4 py-3 text-sm font-black text-[#0B2345] transition hover:bg-white"><UploadCloud size={17}/> ENVIAR TEXTO OU CAPTURA PARA CHECAGEM</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-[#D9DEE7]">
        <span className="text-xs font-bold text-[#0B2345] mr-2">Filtrar por Veredito:</span>
        {['TODOS', 'FALSO', 'ENGANOSO', 'VERDADEIRO', 'FORA DE CONTEXTO'].map((v) => (
          <button
            key={v}
            onClick={() => setFilterVerdict(v)}
            className={`px-3 py-1.5 text-xs font-bold rounded transition cursor-pointer ${
              filterVerdict === v
                ? 'bg-[#0B2345] text-white'
                : 'bg-white border border-[#D9DEE7] text-[#5D6673] hover:text-[#0B2345]'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <article
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="bg-white border border-[#D9DEE7] rounded overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition duration-300"
          >
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <div className="absolute top-3 left-3 z-10">
                {getVerdictBadge(item.verdict)}
              </div>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#5D6673] block mb-1">
                  Checado em: {item.date}
                </span>
                <h3 className="font-serif text-sm font-bold text-[#0B2345] leading-snug mb-3 group-hover:text-[#0B5FFF] transition">
                  {item.title}
                </h3>
                <div className="p-3 bg-[#F7F8FA] rounded border border-[#D9DEE7] text-xs mb-3">
                  <strong className="text-[#0B2345] block mb-1">Afirmação analisada:</strong>
                  <p className="text-[#5D6673] italic">"{item.claim}"</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between text-xs font-bold text-[#0B5FFF]">
                <span>Ler relatório completo</span>
                <span>→</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Detail Modal if clicked */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE7] mb-4">
              <div className="flex items-center gap-3">
                {getVerdictBadge(activeItem.verdict)}
                <span className="text-xs text-[#5D6673]">{activeItem.date}</span>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2345] mb-4">
              {activeItem.title}
            </h2>

            <div className="space-y-4 text-xs text-[#17202A] leading-relaxed">
              <div className="p-4 bg-[#F7F8FA] rounded border border-[#D9DEE7]">
                <strong className="text-[#0B2345] block mb-1 text-sm">Alegação sob checagem:</strong>
                <p className="italic">"{activeItem.claim}"</p>
                <span className="text-[11px] text-[#5D6673] mt-1 block">Origem informada: {activeItem.claimant}</span>
              </div>

              <div>
                <strong className="text-[#0B2345] block mb-1 text-sm">Contexto e Apuração:</strong>
                <p>{activeItem.context}</p>
              </div>

              <div>
                <strong className="text-[#0B2345] block mb-1 text-sm">Conclusão Factual:</strong>
                <p>{activeItem.conclusion}</p>
              </div>

              <div className="p-4 bg-[#EBF7EE] border border-[#16803C]/30 rounded">
                <strong className="text-[#16803C] block mb-2 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Documentos e Fontes Primárias Auditadas:</span>
                </strong>
                <ul className="space-y-1.5">
                  {activeItem.documents.map((doc, idx) => (
                    <li key={idx}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0B5FFF] hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>• {doc.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-[#5D6673] pt-4 border-t border-[#D9DEE7] flex justify-between items-center">
                <span>Responsável técnico: {activeItem.factChecker}</span>
                <span>Metodologia: Código de Princípios IFCN</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
