import React from 'react';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';
import { useToast } from '../../app/contexts/ToastContext';

export function CategoriesPage() {
  const { categories, dataLoading } = useData();
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();

  if (role !== 'administrador' && role !== 'editor_chefe') {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#17202A] mb-6">Categorias e Editorias</h2>
        <p className="text-[#64748B]">Apenas administradores e editores-chefe podem gerenciar categorias.</p>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse h-64 bg-[#E2E8F0] rounded mx-auto mb-4" />
        <p className="text-[#64748B]">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#17202A] mb-6">Categorias e Editorias</h2>

      {/* Category Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#F8FAFC] p-3 rounded border border-[#CBD5E0]">
          <div className="text-2xl font-bold text-[#0B2345]">{categories.length}</div>
          <p className="text-xs text-[#4A5568]">Total</p>
        </div>
      </div>

      {/* Categories List */}
      <div className="overflow-x-auto">
        <table className="min-w-full rounded border border-[#E2E8F0]">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Nome</th>
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Slug</th>
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Ativa</th>
              <th className="p-3 text-left text-xs font-medium text-[#4A5568] uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-[#F8FAFC]">
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.slug}</td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded bg-[#E6FFFA] text-[#0C9295]">
                    Ativa
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

      {/* Add Category Form */}
      {role === 'administrador' || role === 'editor_chefe' && (
        <div className="mt-6">
          <h3 className="text-base font-medium text-[#17202A] mb-3">Nova Categoria</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#17202A] mb-1">Nome da Categoria</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#D9DEE7] rounded focus:outline-none focus:ring-2 focus:ring-[#0B2345]"
                placeholder="Ex.: Política, Economia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#17202A] mb-1">Slug</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#D9DEE7] rounded focus:outline-none focus:ring-2 focus:ring-[#0B2345]"
                placeholder="ex.: politica, economia"
              />
            </div>
            <button type="submit" className="bg-[#0B2345] text-white px-4 py-2 rounded hover:bg-[#132D50] transition-colors">
              Criar Categoria
            </button>
          </form>
        </div>
      )}
    </div>
  );
}