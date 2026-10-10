import React from 'react';
import { Article, UserSession } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface NewsroomOverviewTabProps {
  articles: Article[];
  currentUser: UserSession;
  countRascunho: number;
  countEmRevisao: number;
  countCorrecoes: number;
  countAprovadas: number;
  countAgendadas: number;
  countPublicadas: number;
  onOpenEdit: (art: Article) => void;
  onApprove: (art: Article) => void;
  onRequestCorrection: (art: Article) => void;
}

export const NewsroomOverviewTab: React.FC<NewsroomOverviewTabProps> = ({
  articles,
  currentUser,
  countRascunho,
  countEmRevisao,
  countCorrecoes,
  countAprovadas,
  countAgendadas,
  countPublicadas,
  onOpenEdit,
  onApprove,
  onRequestCorrection
}) => {
  return (
    <div className="space-y-6">
      {/* Real Status Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#5D6673] shadow-xs">
          <span className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider block">Em Rascunho</span>
          <span className="text-2xl font-black text-[#17202A] block mt-1">{countRascunho}</span>
          <span className="text-[10px] text-[#5D6673]">Em produção inicial</span>
        </div>

        <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B5FFF] shadow-xs">
          <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block">Aguardando Revisão</span>
          <span className="text-2xl font-black text-[#0B5FFF] block mt-1">{countEmRevisao}</span>
          <span className="text-[10px] text-[#0B5FFF] font-semibold">Exige parecer editorial</span>
        </div>

        <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#D97706] shadow-xs">
          <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider block">Com Correções</span>
          <span className="text-2xl font-black text-[#D97706] block mt-1">{countCorrecoes}</span>
          <span className="text-[10px] text-[#D97706]">Devolvidas ao autor</span>
        </div>

        <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#16803C] shadow-xs">
          <span className="text-[10px] font-bold text-[#16803C] uppercase tracking-wider block">Aprovadas</span>
          <span className="text-2xl font-black text-[#16803C] block mt-1">{countAprovadas}</span>
          <span className="text-[10px] text-[#16803C] font-semibold">Prontas p/ publicação</span>
        </div>

        <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#2563EB] shadow-xs">
          <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">Agendadas</span>
          <span className="text-2xl font-black text-[#2563EB] block mt-1">{countAgendadas}</span>
          <span className="text-[10px] text-[#2563EB]">Fila de disparo</span>
        </div>

        <div className="bg-white p-4 rounded border border-[#D9DEE7] border-l-4 border-l-[#0B2345] shadow-xs">
          <span className="text-[10px] font-bold text-[#0B2345] uppercase tracking-wider block">Publicadas</span>
          <span className="text-2xl font-black text-[#0B2345] block mt-1">{countPublicadas}</span>
          <span className="text-[10px] text-[#0B2345] font-semibold">Ao vivo no portal</span>
        </div>
      </div>

      {/* Editorial Policy Reminder */}
      <div className="p-4 bg-[#EBF7EE] border border-[#16803C]/30 text-[#16803C] rounded text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            <strong>POLÍTICA DE INTEGRIDADE:</strong> Toda publicação exige revisão independente. Um jornalista não pode aprovar a própria matéria.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold bg-[#16803C] text-white px-2 py-0.5 rounded">
          Regra Editorial Ativa
        </span>
      </div>

      {/* Items Waiting Review */}
      <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-bold text-[#0B2345]">
            Fila Prioritária de Revisão Editorial
          </h3>
          <span className="text-xs text-[#5D6673]">Apenas Editores e Revisores podem aprovar</span>
        </div>

        <div className="divide-y divide-[#D9DEE7]">
          {articles.filter(a => a.editorialStatus === 'EM REVISÃO' || a.editorialStatus === 'CORREÇÕES').map((art) => (
            <div key={art.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#5D6673] uppercase mb-1">
                  <span className="text-[#0B5FFF]">{art.kicker}</span>
                  <span>•</span>
                  <span>Autor: {art.author}</span>
                  <span>•</span>
                  <span className={`px-1.5 py-0.2 rounded font-mono ${
                    art.editorialStatus === 'EM REVISÃO' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#FEF3F2] text-[#B42318]'
                  }`}>
                    {art.editorialStatus}
                  </span>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#0B2345] mb-1">
                  {art.title}
                </h4>
                {art.reviewNotes && (
                  <p className="text-[11px] text-[#B42318] italic bg-[#FEF3F2] p-2 rounded border border-[#B42318]/20 mt-1">
                    Nota do Revisor: {art.reviewNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenEdit(art)}
                  className="px-3 py-1.5 border border-[#D9DEE7] hover:border-[#0B2345] rounded font-bold transition cursor-pointer"
                >
                  Abrir Texto
                </button>

                {/* Approve button */}
                <button
                  onClick={() => onApprove(art)}
                  className="px-3 py-1.5 bg-[#16803C] hover:bg-[#22A447] text-white rounded font-bold transition cursor-pointer"
                  title={art.authorId === currentUser.id ? 'Você é o autor desta matéria e não pode aprová-la' : 'Aprovar matéria'}
                >
                  Aprovar
                </button>

                {/* Request corrections */}
                <button
                  onClick={() => onRequestCorrection(art)}
                  className="px-3 py-1.5 bg-[#D97706] hover:bg-amber-600 text-white rounded font-bold transition cursor-pointer"
                >
                  Pedir Correção
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
