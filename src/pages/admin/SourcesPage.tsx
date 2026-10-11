import React from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export function SourcesPage() {
  const { sources, dataLoading } = useData();
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();

  if (role !== 'administrador' && role !== 'editor_chefe') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#17202A] mb-6">Fontes e Feeds RSS</h2>
        <p className="text-[#64748B]">Apenas administradores e editores-chefe podem gerenciar fontes.</p>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse h-64 bg-[#E2E8F0] rounded mx-auto mb-4" />
        <p className="text-[#64748B]">Carregando fontes...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Fontes e Feeds RSS</h2>

      {/* Sources Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#F8FAFC] p-3 rounded border border-[#CBD5E0]">
          <div className="text-2xl font-bold text-[#0B2345]">{sources.length}</div>
          <p className="text-xs text-[#4A5568]">Fontes cadastradas</p>
        </div>
      </div>

      {/* Sources List */}
      <div className="overflow-x-auto">
        <table className="min-w-full rounded border border-[#E2E8F0]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Nome</th>
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Categoria</th>
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Status</th>
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source: any) => (
              <tr key={source.id} className="hover:bg-[#F8FAFC]">
                <td className="p-3">{source.name}</td>
                <td className="p-3">{source.category}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${source.isActive ? 'bg-[#E6FFFA] text-[#0C9295]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
                    {source.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="p-3">
                  <button className="text-[#0B5FFF] text-sm hover:underline">Editar</button>
                  <button className="text-[#EF4444] text-sm ml-2 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Source Form */}
      {role === 'administrador' || role === 'editor_chefe' && (
        <div className="mt-6">
          <h3 className="text-base font-medium text-[#17202A] mb-3">Nova Fonte RSS</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#17202A] mb-1">Nome da Fonte</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#D9DEE7] rounded focus:outline-none focus:ring-2 focus:ring-[#0B2345]"
                placeholder="Ex.: Agência Senado"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#17202A] mb-1">RSS URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#D9DEE7] rounded focus:outline-none focus:ring-2 focus:ring-[#0B2345]"
                placeholder="https://exemplo.com/rss"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#17202A] mb-1">Categoria</label>
              <select
                className="w-full px-3 py-2 border border-[#D9DEE7] rounded focus:outline-none focus:ring-2 focus:ring-[#0B2345]"
              >
                <option value="politica">Política</option>
                <option value="brasil">Brasil</option>
                <option value="economia">Economia</option>
                <option value="saúde">Saúde</option>
                <option value="segurança">Segurança</option>
                <option value="opinião">Opinião</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="mundo">Mundo</option>
                <option value="esportes">Esportes</option>
                <option value="cultura">Cultura</option>
                <option value="receita">Receita</option>
              </select>
            </div>
            <button type="submit" className="bg-[#0B2345] text-white px-4 py-2 rounded hover:bg-[#132D50] transition-colors">
              Adicionar Fonte
            </button>
          </form>
        </div>
      )}
    </div>
  );
}