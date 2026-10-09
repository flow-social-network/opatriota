import React, { useState } from 'react';
import { CategoryDetail, CategorySlug } from '../../types';
import { 
  FolderPlus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  Layers, 
  Plus, 
  Save, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface CategoriesManagerProps {
  categories: CategoryDetail[];
  onSaveCategory: (category: CategoryDetail) => void;
  onPreviewCategory: (slug: CategorySlug) => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  onSaveCategory,
  onPreviewCategory
}) => {
  const [editingCategory, setEditingCategory] = useState<CategoryDetail | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateNew = () => {
    setFormError(null);
    const newCat: CategoryDetail = {
      id: `cat-${Date.now()}`,
      slug: 'nova-editoria' as CategorySlug,
      name: 'Nova Editoria',
      description: 'Descrição da cobertura jornalística desta editoria.',
      introText: 'Texto introdutório sobre os temas tratados.',
      bannerImage: '/src/assets/images/hero_congresso.jpg',
      seoTitle: 'Nova Editoria | O Patriota',
      seoDescription: 'Acompanhe as reportagens exclusivas desta editoria.',
      active: true,
      order: categories.length + 1
    };
    setEditingCategory(newCat);
  };

  const handleSave = () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      setFormError('Informe o nome da categoria.');
      return;
    }
    if (!editingCategory.slug.trim()) {
      setFormError('Informe o slug da categoria.');
      return;
    }

    setFormError(null);
    onSaveCategory(editingCategory);
    setEditingCategory(null);
  };

  return (
    <div className="bg-white border border-[#D9DEE7] rounded-xl shadow-xs overflow-hidden">
      <div className="p-6 border-b border-[#EAECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0B2345] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              TAXONOMIAS WORDPRESS
            </span>
            <h2 className="font-serif font-black text-xl text-[#0B2345]">
              Gestão de Editorias e Categorias
            </h2>
          </div>
          <p className="text-xs text-[#5D6673] mt-1">
            Qualquer categoria criada ou atualizada gera automaticamente sua respectiva página pública via Modelo 2 com paginação e SEO.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Editoria</span>
        </button>
      </div>

      {editingCategory ? (
        /* Edit Mode */
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAECEF] mb-6">
            <h3 className="font-serif text-lg font-bold text-[#0B2345]">
              Configurar Editoria: {editingCategory.name}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingCategory(null)}
                className="bg-gray-100 hover:bg-gray-200 text-[#0B2345] text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-5 py-2 rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Editoria</span>
              </button>
            </div>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#B42318] text-xs rounded font-medium flex items-center justify-between">
              <span>{formError}</span>
              <button type="button" onClick={() => setFormError(null)} className="text-red-400 hover:text-red-700">✕</button>
            </div>
          )}

          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 text-[#0B2345] font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">Slug / Permalinks *</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory, 
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') as CategorySlug 
                  })}
                  className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 font-mono text-[#0B5FFF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1">Descrição Curta *</label>
              <textarea
                rows={2}
                value={editingCategory.description}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1">Texto Introdutório</label>
              <input
                type="text"
                value={editingCategory.introText || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, introText: e.target.value })}
                className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1">Imagem / Banner de Destaque</label>
              <input
                type="text"
                value={editingCategory.bannerImage || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, bannerImage: e.target.value })}
                className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">Meta Title SEO</label>
                <input
                  type="text"
                  value={editingCategory.seoTitle || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, seoTitle: e.target.value })}
                  className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">Situação de Utilização</label>
                <select
                  value={editingCategory.active ? 'ativo' : 'inativo'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, active: e.target.value === 'ativo' })}
                  className="w-full text-xs border border-[#D9DEE7] rounded p-2 bg-white text-[#0B2345] focus:outline-none cursor-pointer"
                >
                  <option value="ativo">Ativa (Visível e com página pública)</option>
                  <option value="inativo">Inativa</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List Mode */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#EAECEF] text-[#5D6673] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Editoria / Categoria</th>
                <th className="py-3 px-4">Slug / URL Automática</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#F8FAFC] transition">
                  <td className="py-3.5 px-4 font-bold text-[#0B2345]">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#0B5FFF]">
                    /categoria/{cat.slug}/
                  </td>
                  <td className="py-3.5 px-4 text-[#5D6673] max-w-xs truncate">
                    {cat.description}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      cat.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.active ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                      {cat.active ? 'ATIVA' : 'INATIVA'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onPreviewCategory(cat.slug)}
                        className="p-1.5 hover:bg-gray-100 rounded text-[#0B5FFF] transition cursor-pointer"
                        title="Ver página pública automática"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 hover:bg-gray-100 rounded text-[#0B2345] transition cursor-pointer"
                        title="Editar categoria"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
