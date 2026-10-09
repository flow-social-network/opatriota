import React, { useState } from 'react';
import { InstitutionalPage, PageModelType, PageStatus } from '../../types';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  Globe, 
  Save, 
  Clock, 
  AlertCircle,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface PagesManagerProps {
  pages: InstitutionalPage[];
  onSavePage: (page: InstitutionalPage) => void;
  onDeletePage: (pageId: string) => void;
  onPreviewPage: (slug: string) => void;
}

export const PagesManager: React.FC<PagesManagerProps> = ({
  pages,
  onSavePage,
  onDeletePage,
  onPreviewPage
}) => {
  const [editingPage, setEditingPage] = useState<InstitutionalPage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'conteudo' | 'seo' | 'localizacao'>('conteudo');

  const filteredPages = pages.filter((p) => {
    if (filterStatus !== 'todos' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateNew = () => {
    const newPage: InstitutionalPage = {
      id: `page-${Date.now()}`,
      slug: 'nova-pagina',
      title: 'Título da Nova Página',
      subtitle: 'Breve descrição institucional ou resumo da página.',
      badge: 'INSTITUCIONAL',
      model: 'institucional',
      content: '<h2>1. Primeira Seção</h2>\n<p>Insira aqui o conteúdo oficial da página...</p>',
      publishedAt: new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      status: 'rascunho',
      menuLocations: ['nenhum'],
      seo: {
        metaTitle: 'Nova Página — O Patriota',
        metaDescription: 'Descrição para motores de busca e compartilhamento social.',
        canonicalUrl: 'https://opatriota.com.br/nova-pagina/'
      }
    };
    setEditingPage(newPage);
  };

  const handleSave = () => {
    if (!editingPage) return;
    if (!editingPage.title.trim()) {
      alert('Por favor, defina um título para a página.');
      return;
    }
    if (!editingPage.slug.trim()) {
      alert('Por favor, defina um slug (URL) válido.');
      return;
    }

    const updated = {
      ...editingPage,
      updatedAt: new Date().toLocaleDateString('pt-BR')
    };
    onSavePage(updated);
    setEditingPage(null);
  };

  return (
    <div className="bg-white border border-[#D9DEE7] rounded-xl shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-[#EAECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0B2345] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              CMS WORDPRESS
            </span>
            <h2 className="font-serif font-black text-xl text-[#0B2345]">
              Gestão de Páginas e Modelos
            </h2>
          </div>
          <p className="text-xs text-[#5D6673] mt-1">
            Crie, edite, publique e defina modelos de páginas institucionais e editoriais sem programar.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Página</span>
        </button>
      </div>

      {editingPage ? (
        /* Edit Form Mode */
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAECEF] mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#0B5FFF]">
                {editingPage.id.startsWith('page-') && editingPage.status === 'rascunho' ? 'NOVA PÁGINA' : 'EDITANDO PÁGINA'}
              </span>
              <h3 className="font-serif text-xl font-bold text-[#0B2345]">
                {editingPage.title || 'Sem título'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingPage(null)}
                className="bg-gray-100 hover:bg-gray-200 text-[#0B2345] text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-5 py-2 rounded transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>

          {/* Edit Tabs */}
          <div className="flex border-b border-[#EAECEF] mb-6 gap-6 text-xs">
            <button
              onClick={() => setActiveTab('conteudo')}
              className={`pb-2.5 font-bold transition cursor-pointer border-b-2 ${
                activeTab === 'conteudo'
                  ? 'border-[#0B2345] text-[#0B2345]'
                  : 'border-transparent text-[#717E8E] hover:text-[#0B2345]'
              }`}
            >
              Conteúdo & Modelo
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`pb-2.5 font-bold transition cursor-pointer border-b-2 ${
                activeTab === 'seo'
                  ? 'border-[#0B2345] text-[#0B2345]'
                  : 'border-transparent text-[#717E8E] hover:text-[#0B2345]'
              }`}
            >
              Metadados SEO & Indexação
            </button>
            <button
              onClick={() => setActiveTab('localizacao')}
              className={`pb-2.5 font-bold transition cursor-pointer border-b-2 ${
                activeTab === 'localizacao'
                  ? 'border-[#0B2345] text-[#0B2345]'
                  : 'border-transparent text-[#717E8E] hover:text-[#0B2345]'
              }`}
            >
              Exibição nos Menus & Rodapé
            </button>
          </div>

          {activeTab === 'conteudo' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0B2345] mb-1">Título da Página *</label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 font-semibold text-[#0B2345] focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1">Slug / URL Amigável *</label>
                  <div className="flex items-center text-xs border border-[#D9DEE7] rounded overflow-hidden">
                    <span className="bg-[#F8FAFC] px-2.5 py-2.5 text-[#717E8E] border-r border-[#D9DEE7]">/</span>
                    <input
                      type="text"
                      value={editingPage.slug}
                      onChange={(e) => setEditingPage({ 
                        ...editingPage, 
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
                      })}
                      className="w-full px-2.5 py-2.5 focus:outline-none text-[#0B2345]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1">Modelo de Página</label>
                  <select
                    value={editingPage.model}
                    onChange={(e) => setEditingPage({ ...editingPage, model: e.target.value as PageModelType })}
                    className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 bg-white text-[#0B2345] focus:outline-none cursor-pointer"
                  >
                    <option value="institucional">Modelo 1: Institucional (com Índice lateral e links)</option>
                    <option value="personalizada">Modelo 11: Página Padrão / Personalizada</option>
                    <option value="contato">Modelo 7: Contato / Fale com a Redação</option>
                    <option value="planos">Modelo 9: Planos & Assinaturas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1">Status de Publicação</label>
                  <select
                    value={editingPage.status}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value as PageStatus })}
                    className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 bg-white text-[#0B2345] focus:outline-none cursor-pointer"
                  >
                    <option value="publicada">Publicada (Visível no portal)</option>
                    <option value="rascunho">Rascunho (Não indexada)</option>
                    <option value="revisao">Em Revisão Editorial</option>
                    <option value="despublicada">Despublicada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1">Selo / Badge</label>
                  <input
                    type="text"
                    value={editingPage.badge || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, badge: e.target.value })}
                    placeholder="Ex.: IDENTIDADE EDITORIAL"
                    className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2.5 text-[#0B2345] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">Subtítulo Explicativo</label>
                <input
                  type="text"
                  value={editingPage.subtitle || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                  placeholder="Resumo do objetivo institucional da página..."
                  className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 text-[#404B5A] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#0B2345]">
                    Conteúdo da Página (HTML / Gutenberg Blocks) *
                  </label>
                  <span className="text-[11px] text-[#717E8E]">
                    Suporta tags HTML semânticas como &lt;section&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;
                  </span>
                </div>
                <textarea
                  rows={12}
                  value={editingPage.content}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full text-xs font-mono border border-[#D9DEE7] rounded p-3 text-[#17202A] focus:outline-none focus:border-[#0B5FFF] bg-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">URL da Imagem Destacada</label>
                <input
                  type="text"
                  value={editingPage.featuredImage || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, featuredImage: e.target.value })}
                  placeholder="/src/assets/images/hero_congresso.jpg"
                  className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 text-[#404B5A] focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">Título SEO (Meta Title)</label>
                <input
                  type="text"
                  value={editingPage.seo.metaTitle || ''}
                  onChange={(e) => setEditingPage({ 
                    ...editingPage, 
                    seo: { ...editingPage.seo, metaTitle: e.target.value } 
                  })}
                  className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 focus:outline-none"
                />
                <span className="text-[10px] text-[#717E8E]">Recomendado: 50 a 60 caracteres.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">Meta Descrição</label>
                <textarea
                  rows={3}
                  value={editingPage.seo.metaDescription || ''}
                  onChange={(e) => setEditingPage({ 
                    ...editingPage, 
                    seo: { ...editingPage.seo, metaDescription: e.target.value } 
                  })}
                  className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 focus:outline-none"
                />
                <span className="text-[10px] text-[#717E8E]">Recomendado: 120 a 160 caracteres.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2345] mb-1">URL Canônica</label>
                <input
                  type="text"
                  value={editingPage.seo.canonicalUrl || ''}
                  onChange={(e) => setEditingPage({ 
                    ...editingPage, 
                    seo: { ...editingPage.seo, canonicalUrl: e.target.value } 
                  })}
                  className="w-full text-xs border border-[#D9DEE7] rounded px-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'localizacao' && (
            <div className="space-y-4 max-w-xl text-xs">
              <p className="text-[#5D6673]">
                Defina em quais menus do portal este link deve ser exibido automaticamente:
              </p>

              <div className="space-y-2 border border-[#EAECEF] p-4 rounded-lg bg-[#F8FAFC]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.menuLocations.includes('topbar')}
                    onChange={(e) => {
                      const locs = e.target.checked
                        ? [...editingPage.menuLocations.filter(l => l !== 'nenhum'), 'topbar']
                        : editingPage.menuLocations.filter(l => l !== 'topbar');
                      setEditingPage({ ...editingPage, menuLocations: locs as any });
                    }}
                  />
                  <span className="font-bold text-[#0B2345]">Barra Superior (Topbar)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.menuLocations.includes('footer_col2')}
                    onChange={(e) => {
                      const locs = e.target.checked
                        ? [...editingPage.menuLocations.filter(l => l !== 'nenhum'), 'footer_col2']
                        : editingPage.menuLocations.filter(l => l !== 'footer_col2');
                      setEditingPage({ ...editingPage, menuLocations: locs as any });
                    }}
                  />
                  <span className="font-bold text-[#0B2345]">Rodapé — Coluna 2 (Institucional)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPage.menuLocations.includes('footer_col3')}
                    onChange={(e) => {
                      const locs = e.target.checked
                        ? [...editingPage.menuLocations.filter(l => l !== 'nenhum'), 'footer_col3']
                        : editingPage.menuLocations.filter(l => l !== 'footer_col3');
                      setEditingPage({ ...editingPage, menuLocations: locs as any });
                    }}
                  />
                  <span className="font-bold text-[#0B2345]">Rodapé — Coluna 3 (Transparência & LGPD)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Pages Table List */
        <div>
          {/* Filter Bar */}
          <div className="p-4 border-b border-[#EAECEF] flex flex-wrap items-center justify-between gap-3 text-xs bg-white">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0B2345]">Status:</span>
              <button
                onClick={() => setFilterStatus('todos')}
                className={`px-2.5 py-1 rounded cursor-pointer ${filterStatus === 'todos' ? 'bg-[#0B2345] text-white font-bold' : 'hover:bg-gray-100 text-[#5D6673]'}`}
              >
                Todas ({pages.length})
              </button>
              <button
                onClick={() => setFilterStatus('publicada')}
                className={`px-2.5 py-1 rounded cursor-pointer ${filterStatus === 'publicada' ? 'bg-[#16803C] text-white font-bold' : 'hover:bg-gray-100 text-[#5D6673]'}`}
              >
                Publicadas ({pages.filter(p => p.status === 'publicada').length})
              </button>
              <button
                onClick={() => setFilterStatus('rascunho')}
                className={`px-2.5 py-1 rounded cursor-pointer ${filterStatus === 'rascunho' ? 'bg-amber-600 text-white font-bold' : 'hover:bg-gray-100 text-[#5D6673]'}`}
              >
                Rascunhos ({pages.filter(p => p.status === 'rascunho').length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5D6673] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar páginas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-[#D9DEE7] rounded w-52 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#EAECEF] text-[#5D6673] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Título da Página</th>
                  <th className="py-3 px-4">Rota / URL</th>
                  <th className="py-3 px-4">Modelo</th>
                  <th className="py-3 px-4">Situação</th>
                  <th className="py-3 px-4">Última Atualização</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECEF]">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-3.5 px-4 font-bold text-[#0B2345]">
                      {page.title}
                      {page.subtitle && (
                        <p className="text-[11px] font-normal text-[#717E8E] line-clamp-1">
                          {page.subtitle}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#0B5FFF]">
                      /{page.slug}/
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#F1F3F5] text-[#0B2345] px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                        {page.model}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                        page.status === 'publicada'
                          ? 'bg-green-100 text-green-800'
                          : page.status === 'rascunho'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'publicada' ? 'bg-green-600' : 'bg-amber-600'}`}></span>
                        {page.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#717E8E]">
                      {page.updatedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onPreviewPage(page.slug)}
                          className="p-1.5 hover:bg-gray-100 rounded text-[#0B5FFF] transition cursor-pointer"
                          title="Visualizar página pública"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingPage(page)}
                          className="p-1.5 hover:bg-gray-100 rounded text-[#0B2345] transition cursor-pointer"
                          title="Editar página"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {/* Only allow deleting custom pages, not core institutional */}
                        {!['page-sobre', 'page-expediente', 'page-principios', 'page-privacidade'].includes(page.id) && (
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir a página "${page.title}"?`)) {
                                onDeletePage(page.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 rounded text-red-600 transition cursor-pointer"
                            title="Excluir página"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
