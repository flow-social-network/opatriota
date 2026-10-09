import React, { useState } from 'react';
import { SiteMenuConfig, SiteMenuItem, CategoryDetail, InstitutionalPage } from '../../types';
import { 
  Menu, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  ExternalLink,
  Layers,
  Check
} from 'lucide-react';

interface MenusManagerProps {
  menuConfig: SiteMenuConfig;
  allPages: InstitutionalPage[];
  allCategories: CategoryDetail[];
  onSaveMenuConfig: (config: SiteMenuConfig) => void;
}

export const MenusManager: React.FC<MenusManagerProps> = ({
  menuConfig,
  allPages,
  allCategories,
  onSaveMenuConfig
}) => {
  const [currentMenuTab, setCurrentMenuTab] = useState<'mainNav' | 'topBar' | 'footerCol1' | 'footerCol2' | 'footerCol3'>('mainNav');
  const [config, setConfig] = useState<SiteMenuConfig>(menuConfig);
  const [showAddModal, setShowAddModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New item form state
  const [itemType, setItemType] = useState<'categoria' | 'pagina' | 'custom'>('categoria');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [customLabel, setCustomLabel] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');

  const currentItems = config[currentMenuTab];

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...currentItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setConfig({
      ...config,
      [currentMenuTab]: newItems
    });
  };

  const handleRemove = (index: number) => {
    const newItems = currentItems.filter((_, i) => i !== index);
    setConfig({
      ...config,
      [currentMenuTab]: newItems
    });
  };

  const handleAddItem = () => {
    let newItem: SiteMenuItem;

    if (itemType === 'categoria') {
      const cat = allCategories.find(c => c.slug === selectedTargetId) || allCategories[0];
      newItem = {
        id: `item-${Date.now()}`,
        label: cat.name,
        url: `/categoria/${cat.slug}`,
        type: 'categoria'
      };
    } else if (itemType === 'pagina') {
      const page = allPages.find(p => p.slug === selectedTargetId) || allPages[0];
      newItem = {
        id: `item-${Date.now()}`,
        label: page.title,
        url: `/${page.slug}`,
        type: 'pagina'
      };
    } else {
      if (!customLabel || !customUrl) {
        alert('Preencha o rótulo e a URL do link personalizado.');
        return;
      }
      newItem = {
        id: `item-${Date.now()}`,
        label: customLabel,
        url: customUrl,
        type: 'custom'
      };
    }

    setConfig({
      ...config,
      [currentMenuTab]: [...currentItems, newItem]
    });
    setShowAddModal(false);
    setCustomLabel('');
    setCustomUrl('');
  };

  const handleSave = () => {
    onSaveMenuConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-white border border-[#D9DEE7] rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#EAECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0B2345] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              NAVEGAÇÃO WORDPRESS
            </span>
            <h2 className="font-serif font-black text-xl text-[#0B2345]">
              Gestão de Menus e Localizações
            </h2>
          </div>
          <p className="text-xs text-[#5D6673] mt-1">
            Administre os itens e links do Menu Principal, Barra Superior e das 3 Colunas Oficiais do Rodapé.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Link ao Menu</span>
          </button>
          <button
            onClick={handleSave}
            className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvo no Portal!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Menus</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Menu Location Selector Tabs */}
      <div className="flex border-b border-[#EAECEF] bg-white px-6 overflow-x-auto text-xs">
        {[
          { key: 'mainNav', label: 'Menu Principal (Header)' },
          { key: 'topBar', label: 'Barra Superior (Topbar)' },
          { key: 'footerCol1', label: 'Rodapé — Coluna 1 (Editorias)' },
          { key: 'footerCol2', label: 'Rodapé — Coluna 2 (Institucional)' },
          { key: 'footerCol3', label: 'Rodapé — Coluna 3 (Transparência/LGPD)' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentMenuTab(tab.key as any)}
            className={`py-3 px-4 font-bold whitespace-nowrap transition cursor-pointer border-b-2 ${
              currentMenuTab === tab.key
                ? 'border-[#0B2345] text-[#0B2345] bg-[#F8FAFC]'
                : 'border-transparent text-[#717E8E] hover:text-[#0B2345]'
            }`}
          >
            {tab.label} ({config[tab.key as keyof SiteMenuConfig].length})
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="p-6">
        <div className="space-y-2 max-w-2xl">
          {currentItems.length === 0 ? (
            <p className="text-xs text-[#717E8E] p-4 bg-gray-50 rounded text-center">
              Nenhum item configurado para este menu. Adicione itens acima.
            </p>
          ) : (
            currentItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-white border border-[#D9DEE7] rounded-lg shadow-2xs hover:border-[#0B5FFF] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#A0AAB8] w-5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-[#0B2345] block">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-[#0B5FFF]">
                      {item.url}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-[#5D6673] hover:text-[#0B2345] disabled:opacity-30 cursor-pointer"
                    title="Mover para cima"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === currentItems.length - 1}
                    className="p-1 text-[#5D6673] hover:text-[#0B2345] disabled:opacity-30 cursor-pointer"
                    title="Mover para baixo"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(idx)}
                    className="p-1 text-red-500 hover:text-red-700 cursor-pointer ml-2"
                    title="Remover do menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in">
            <h3 className="font-serif font-bold text-lg text-[#0B2345] mb-4">
              Adicionar Link ao Menu
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B2345] mb-1">Tipo de Link:</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as any)}
                  className="w-full border border-[#D9DEE7] rounded p-2 focus:outline-none"
                >
                  <option value="categoria">Editoria / Categoria Existente</option>
                  <option value="pagina">Página Institucional Existente</option>
                  <option value="custom">Link Externo / Personalizado</option>
                </select>
              </div>

              {itemType === 'categoria' && (
                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">Selecione a Categoria:</label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full border border-[#D9DEE7] rounded p-2 focus:outline-none"
                  >
                    <option value="">Selecione...</option>
                    {allCategories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {itemType === 'pagina' && (
                <div>
                  <label className="block font-bold text-[#0B2345] mb-1">Selecione a Página:</label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full border border-[#D9DEE7] rounded p-2 focus:outline-none"
                  >
                    <option value="">Selecione...</option>
                    {allPages.map(p => (
                      <option key={p.slug} value={p.slug}>{p.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {itemType === 'custom' && (
                <>
                  <div>
                    <label className="block font-bold text-[#0B2345] mb-1">Texto do Link:</label>
                    <input
                      type="text"
                      placeholder="Ex.: Apoiar o Jornal"
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      className="w-full border border-[#D9DEE7] rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#0B2345] mb-1">URL de Destino:</label>
                    <input
                      type="text"
                      placeholder="Ex.: /planos ou https://..."
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="w-full border border-[#D9DEE7] rounded p-2"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-[#EAECEF] flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0B2345] rounded font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-5 py-2 bg-[#0B2345] hover:bg-[#0B5FFF] text-white rounded font-bold cursor-pointer"
                >
                  Inserir no Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
