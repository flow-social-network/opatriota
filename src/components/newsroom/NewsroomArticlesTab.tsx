import React from 'react';
import { Article } from '../../types';
import { Search } from 'lucide-react';

interface NewsroomArticlesTabProps {
  filteredArticles: Article[];
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onOpenEdit: (art: Article) => void;
  onPublish: (art: Article) => void;
}

export const NewsroomArticlesTab: React.FC<NewsroomArticlesTabProps> = ({
  filteredArticles,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  onOpenEdit,
  onPublish
}) => {
  return (
    <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0B2345]">
            Arquivo e Gestão de Matérias
          </h3>
          <p className="text-xs text-[#5D6673]">
            Pesquise, edite, envie para revisão e publique matérias do portal.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#5D6673] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar por título ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-[#D9DEE7] rounded text-xs w-48 sm:w-60 focus:outline-none focus:border-[#0B5FFF]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#D9DEE7] p-1.5 rounded text-xs focus:outline-none"
          >
            <option value="TODAS">Todos os Status</option>
            <option value="PUBLICADA">Publicada</option>
            <option value="EM REVISÃO">Em Revisão</option>
            <option value="CORREÇÕES">Correções</option>
            <option value="APROVADA">Aprovada</option>
            <option value="EM REDAÇÃO">Em Redação</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-[#D9DEE7] p-1.5 rounded text-xs focus:outline-none"
          >
            <option value="TODAS">Todas as Editorias</option>
            <option value="politica">Política</option>
            <option value="brasil">Brasil</option>
            <option value="economia">Economia</option>
            <option value="seguranca">Segurança</option>
            <option value="saude">Saúde</option>
            <option value="opiniao">Opinião</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F7F8FA] border-b border-[#D9DEE7] text-[#5D6673] uppercase text-[10px] font-bold">
            <tr>
              <th className="py-2.5 px-3">Título da Matéria</th>
              <th className="py-2.5 px-3">Autor</th>
              <th className="py-2.5 px-3">Editoria</th>
              <th className="py-2.5 px-3">Acesso</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9DEE7]">
            {filteredArticles.map((art) => (
              <tr key={art.id} className="hover:bg-[#F7F8FA]">
                <td className="py-3 px-3 max-w-md">
                  <strong className="block text-[#0B2345] font-serif text-xs">
                    {art.title}
                  </strong>
                  <span className="text-[10px] text-[#5D6673] block truncate">
                    {art.subtitle}
                  </span>
                </td>
                <td className="py-3 px-3 text-[#5D6673]">{art.author}</td>
                <td className="py-3 px-3 uppercase text-[10px] font-bold text-[#0B5FFF]">{art.category}</td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    art.accessLevel === 'premium'
                      ? 'bg-[#FFCC29] text-[#17202A]'
                      : art.accessLevel === 'assinante'
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'bg-[#F1F3F5] text-[#5D6673]'
                  }`}>
                    {art.accessLevel}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                    art.editorialStatus === 'PUBLICADA'
                      ? 'bg-[#EBF7EE] text-[#16803C]'
                      : art.editorialStatus === 'EM REVISÃO'
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : art.editorialStatus === 'CORREÇÕES'
                      ? 'bg-[#FEF3F2] text-[#B42318]'
                      : art.editorialStatus === 'APROVADA'
                      ? 'bg-[#EBF7EE] text-[#16803C]'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {art.editorialStatus}
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                  <button
                    onClick={() => onOpenEdit(art)}
                    className="px-2 py-1 border border-[#D9DEE7] hover:border-[#0B2345] rounded font-bold text-[11px] cursor-pointer"
                  >
                    Editar
                  </button>
                  {art.editorialStatus === 'APROVADA' && (
                    <button
                      onClick={() => onPublish(art)}
                      className="px-2 py-1 bg-[#16803C] hover:bg-[#22A447] text-white rounded font-bold text-[11px] cursor-pointer"
                    >
                      Publicar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
