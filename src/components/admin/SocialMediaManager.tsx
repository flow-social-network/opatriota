import React, { useState } from 'react';
import { SocialNetworkItem, SocialPlatform } from '../../types';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Share2, 
  MoveUp, 
  MoveDown, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Trash2, 
  ExternalLink,
  Radio,
  MessageCircle,
  Rss
} from 'lucide-react';
import { DEFAULT_SOCIAL_NETWORKS } from '../../services/siteConfigService';

interface SocialMediaManagerProps {
  socialNetworks: SocialNetworkItem[];
  onSaveSocialNetworks: (items: SocialNetworkItem[]) => void;
}

export const SocialMediaManager: React.FC<SocialMediaManagerProps> = ({
  socialNetworks,
  onSaveSocialNetworks
}) => {
  const [items, setItems] = useState<SocialNetworkItem[]>(socialNetworks);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('instagram');
  const [newUrl, setNewUrl] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setItems(items.map(it => it.id === id ? { ...it, active: !it.active } : it));
  };

  const handleUrlChange = (id: string, url: string) => {
    setItems(items.map(it => it.id === id ? { ...it, url } : it));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate order index
    const reordered = updated.map((it, idx) => ({ ...it, order: idx + 1 }));
    setItems(reordered);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(it => it.id !== id));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      setModalError('Informe a URL oficial do perfil.');
      return;
    }

    const platformLabels: Record<SocialPlatform, string> = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      x: 'X (Twitter)',
      tiktok: 'TikTok',
      whatsapp: 'WhatsApp',
      rss: 'Feed RSS'
    };

    const newItem: SocialNetworkItem = {
      id: `soc-${Date.now()}`,
      name: platformLabels[newPlatform] || 'Rede Social',
      platform: newPlatform,
      url: newUrl.trim(),
      active: true,
      order: items.length + 1,
      ariaLabel: `Perfil oficial de O Patriota no ${platformLabels[newPlatform]}`
    };

    setItems([...items, newItem]);
    setShowAddModal(false);
    setNewUrl('');
    setModalError(null);
  };

  const handleSave = () => {
    onSaveSocialNetworks(items);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetDefaults = () => {
    setItems(DEFAULT_SOCIAL_NETWORKS);
  };

  const renderPlatformIcon = (platform: SocialPlatform, className = "w-4 h-4") => {
    switch (platform) {
      case 'facebook':
        return <Facebook className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'youtube':
        return <Youtube className={className} />;
      case 'x':
        return <Twitter className={className} />;
      case 'tiktok':
        return <Radio className={className} />;
      case 'whatsapp':
        return <MessageCircle className={className} />;
      case 'rss':
        return <Rss className={className} />;
      default:
        return <Share2 className={className} />;
    }
  };

  const activeItems = items.filter(it => it.active);

  return (
    <div className="bg-white border border-[#D9DEE7] rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#EAECEF] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0B5FFF] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              CANAIS & REDES SOCIAIS
            </span>
            <span className="text-xs text-[#5D6673]">• Distribuição Editorial</span>
          </div>
          <h2 className="font-serif font-black text-xl text-[#0B2345] mt-1">
            Gestão de Redes Sociais Oficiais
          </h2>
          <p className="text-xs text-[#5D6673] mt-0.5">
            Adicione, ative, ordene e configure as URLs dos perfis públicos que aparecem no cabeçalho e na Coluna 5 do rodapé.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-[#5D6673] hover:text-[#0B2345] px-3 py-2 rounded border border-[#D9DEE7] bg-white hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            title="Restaurar redes padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-3 py-2 rounded transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Rede</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-4 py-2 rounded transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Redes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-[#EBF7EE] border-b border-[#16803C]/30 text-[#16803C] p-4 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuração das redes sociais salva e sincronizada com sucesso no portal!</span>
        </div>
      )}

      <div className="p-6 space-y-6">
        
        {/* LIVE PREVIEW BAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Header Preview */}
          <div className="p-4 rounded-lg border border-[#D9DEE7] bg-white">
            <span className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#0B5FFF]" />
              <span>Como aparecerá no Cabeçalho (Top Bar):</span>
            </span>
            <div className="flex items-center gap-3 p-3 bg-[#F1F3F5] rounded border border-[#D9DEE7] text-[#5D6673]">
              <span className="text-[11px] font-semibold text-[#17202A] mr-2">Siga O Patriota:</span>
              <div className="flex items-center gap-2.5">
                {activeItems.map((soc) => (
                  <span
                    key={soc.id}
                    title={`${soc.name}: ${soc.url}`}
                    className="p-1 hover:text-[#0B5FFF] text-[#5D6673] transition"
                  >
                    {renderPlatformIcon(soc.platform, "w-3.5 h-3.5")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="p-4 rounded-lg border border-[#0B2345] bg-[#07172E] text-white">
            <span className="text-[10px] font-bold text-[#FFCC29] uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#FFCC29]" />
              <span>Como aparecerá no Rodapé (Coluna 5):</span>
            </span>
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded border border-white/10">
              {activeItems.map((soc) => (
                <span
                  key={soc.id}
                  title={`${soc.name}: ${soc.url}`}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FFCC29] hover:text-[#0B2345] text-white flex items-center justify-center transition"
                >
                  {renderPlatformIcon(soc.platform, "w-4 h-4")}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Networks Table */}
        <div className="overflow-x-auto border border-[#D9DEE7] rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#EAECEF] text-[#5D6673] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Ordem</th>
                <th className="py-3 px-4 w-16 text-center">Ícone</th>
                <th className="py-3 px-4 w-44">Plataforma</th>
                <th className="py-3 px-4">URL do Perfil Oficial</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-36 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              {items.map((soc, idx) => (
                <tr key={soc.id} className={`hover:bg-slate-50 transition ${soc.active ? '' : 'opacity-60 bg-slate-50/50'}`}>
                  {/* Order */}
                  <td className="py-3 px-4 text-center font-mono font-bold text-[#5D6673]">
                    {idx + 1}
                  </td>

                  {/* Icon */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-[#0B2345]/10 text-[#0B2345]">
                      {renderPlatformIcon(soc.platform, "w-4 h-4")}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#0B2345] block">{soc.name}</span>
                    <span className="text-[10px] text-[#5D6673] font-mono">{soc.platform}</span>
                  </td>

                  {/* URL Input */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => handleUrlChange(soc.id, e.target.value)}
                        placeholder="https://..."
                        className="w-full text-xs border border-[#D9DEE7] rounded px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#0B5FFF]"
                      />
                      {soc.url && soc.url.startsWith('http') && (
                        <a
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5D6673] hover:text-[#0B5FFF] p-1 shrink-0"
                          title="Testar link externo em nova aba"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Active Switch */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(soc.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition ${
                        soc.active 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${soc.active ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                      <span>{soc.active ? 'Ativa' : 'Inativa'}</span>
                    </button>
                  </td>

                  {/* Action Reordering */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-200 text-[#5D6673] disabled:opacity-30 cursor-pointer"
                        title="Mover para cima"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === items.length - 1}
                        className="p-1 rounded hover:bg-slate-200 text-[#5D6673] disabled:opacity-30 cursor-pointer"
                        title="Mover para baixo"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(soc.id)}
                        className="p-1 rounded hover:bg-red-100 text-red-600 ml-1 cursor-pointer"
                        title="Remover rede social"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <p className="text-[11px] text-[#5D6673] bg-[#F8FAFC] p-3 rounded border border-[#EAECEF]">
          💡 <strong>Nota de Arquitetura:</strong> A gestão de URLs das redes sociais no portal é estritamente voltada para os links públicos de consulta e compartilhamento dos leitores. Não requer nem expõe credenciais de APIs sociais para operar.
        </p>
      </div>

      {/* Modal Add New Social */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in fade-in space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0B2345]">
              Adicionar Rede Social
            </h3>

            {modalError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-[#B42318] text-xs rounded font-medium flex items-center justify-between">
                <span>{modalError}</span>
                <button type="button" onClick={() => setModalError(null)} className="text-red-400 hover:text-red-700">✕</button>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B2345] mb-1">Selecione a Plataforma:</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as SocialPlatform)}
                  className="w-full border border-[#D9DEE7] rounded p-2 focus:outline-none focus:border-[#0B5FFF]"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="x">X (antigo Twitter)</option>
                  <option value="tiktok">TikTok</option>
                  <option value="whatsapp">WhatsApp Channel</option>
                  <option value="rss">Feed RSS de Notícias</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0B2345] mb-1">URL Completa do Perfil:</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full border border-[#D9DEE7] rounded p-2 focus:outline-none focus:border-[#0B5FFF]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#EAECEF]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#D9DEE7] rounded text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white px-4 py-2 rounded text-xs font-bold cursor-pointer"
                >
                  Adicionar Rede
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
