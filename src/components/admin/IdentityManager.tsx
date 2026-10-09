import React, { useState } from 'react';
import { SiteIdentityConfig, LogoSourceType } from '../../types';
import { Logo } from '../Logo';
import { 
  Image, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  Sliders, 
  Info,
  Sparkles,
  Layers
} from 'lucide-react';
import { DEFAULT_IDENTITY_CONFIG } from '../../services/siteConfigService';

interface IdentityManagerProps {
  identityConfig: SiteIdentityConfig;
  onSaveIdentity: (config: SiteIdentityConfig) => void;
}

export const IdentityManager: React.FC<IdentityManagerProps> = ({
  identityConfig,
  onSaveIdentity
}) => {
  const [formData, setFormData] = useState<SiteIdentityConfig>(identityConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveIdentity(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_IDENTITY_CONFIG);
  };

  return (
    <div className="bg-white border border-[#D9DEE7] rounded-xl shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-[#EAECEF] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0B2345] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              IDENTIDADE & LOGÓTIPOS
            </span>
            <span className="text-xs text-[#5D6673]">• Personalização de Marca</span>
          </div>
          <h2 className="font-serif font-black text-xl text-[#0B2345] mt-1">
            Gestão de Logótipos e Identidade Visual
          </h2>
          <p className="text-xs text-[#5D6673] mt-0.5">
            Configure de forma independente os logótipos do cabeçalho e do rodapé, slogans oficiais e créditos da mantenedora.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-[#5D6673] hover:text-[#0B2345] px-3 py-2 rounded border border-[#D9DEE7] bg-white hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            title="Restaurar valores de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-4 py-2 rounded transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-[#EBF7EE] border-b border-[#16803C]/30 text-[#16803C] p-4 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configurações de identidade visual salvas e sincronizadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ======================================================== */}
          {/* 1. LOGÓTIPO DO CABEÇALHO */}
          {/* ======================================================== */}
          <div className="border border-[#D9DEE7] rounded-lg p-5 bg-[#FAFBFC] space-y-5">
            <div className="border-b border-[#EAECEF] pb-3">
              <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block">
                CABEÇALHO PRINCIPAL
              </span>
              <h3 className="font-serif font-bold text-base text-[#0B2345]">
                Logótipo do Cabeçalho (Fundo Claro)
              </h3>
              <p className="text-xs text-[#5D6673]">
                Exibido no topo de todas as páginas do portal jornalístico.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                Tipo de Apresentação do Logótipo:
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <label className={`p-3 border rounded-lg cursor-pointer flex items-center gap-2.5 transition ${
                  formData.headerLogoType === 'default_svg' 
                    ? 'border-[#0B5FFF] bg-blue-50/50 text-[#0B2345] font-bold ring-1 ring-[#0B5FFF]' 
                    : 'border-[#D9DEE7] bg-white text-[#5D6673]'
                }`}>
                  <input
                    type="radio"
                    name="headerLogoType"
                    value="default_svg"
                    checked={formData.headerLogoType === 'default_svg'}
                    onChange={() => setFormData({ ...formData, headerLogoType: 'default_svg' })}
                    className="accent-[#0B5FFF]"
                  />
                  <div>
                    <span className="block">Emblema SVG Oficial</span>
                    <span className="text-[10px] text-[#5D6673] font-normal">Vetor nativo ultradefinido</span>
                  </div>
                </label>

                <label className={`p-3 border rounded-lg cursor-pointer flex items-center gap-2.5 transition ${
                  formData.headerLogoType === 'custom_image' 
                    ? 'border-[#0B5FFF] bg-blue-50/50 text-[#0B2345] font-bold ring-1 ring-[#0B5FFF]' 
                    : 'border-[#D9DEE7] bg-white text-[#5D6673]'
                }`}>
                  <input
                    type="radio"
                    name="headerLogoType"
                    value="custom_image"
                    checked={formData.headerLogoType === 'custom_image'}
                    onChange={() => setFormData({ ...formData, headerLogoType: 'custom_image' })}
                    className="accent-[#0B5FFF]"
                  />
                  <div>
                    <span className="block">Imagem Personalizada</span>
                    <span className="text-[10px] text-[#5D6673] font-normal">PNG / WebP / SVG externo</span>
                  </div>
                </label>
              </div>
            </div>

            {formData.headerLogoType === 'custom_image' && (
              <div className="space-y-3 pt-2 border-t border-[#EAECEF]">
                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1">
                    URL da Imagem do Logótipo:
                  </label>
                  <input
                    type="text"
                    placeholder="https://... ou /assets/images/logo-header.png"
                    value={formData.headerLogoUrl}
                    onChange={(e) => setFormData({ ...formData, headerLogoUrl: e.target.value })}
                    className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 bg-white focus:outline-none focus:border-[#0B5FFF]"
                  />
                  <p className="text-[11px] text-[#5D6673] mt-1">
                    Recomendado: imagem com fundo transparente em formato PNG ou WebP.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1">
                Texto Alternativo (Alt Text para Acessibilidade):
              </label>
              <input
                type="text"
                value={formData.headerLogoAlt}
                onChange={(e) => setFormData({ ...formData, headerLogoAlt: e.target.value })}
                className="w-full text-xs border border-[#D9DEE7] rounded p-2 bg-white focus:outline-none focus:border-[#0B5FFF]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#0B2345] mb-1">
                <span>Largura de Apresentação:</span>
                <span className="font-mono text-[#0B5FFF]">{formData.headerLogoWidth}px</span>
              </div>
              <input
                type="range"
                min="200"
                max="480"
                step="10"
                value={formData.headerLogoWidth}
                onChange={(e) => setFormData({ ...formData, headerLogoWidth: Number(e.target.value) })}
                className="w-full accent-[#0B5FFF]"
              />
              <div className="flex justify-between text-[10px] text-[#5D6673]">
                <span>Compacto (200px)</span>
                <span>Padrão (320px)</span>
                <span>Expandido (480px)</span>
              </div>
            </div>

            {/* LIVE PREVIEW CABEÇALHO */}
            <div className="border border-[#D9DEE7] rounded-lg p-4 bg-white shadow-2xs">
              <span className="text-[10px] font-bold text-[#5D6673] uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#0B5FFF]" />
                <span>Pré-visualização no Cabeçalho (Fundo Branco):</span>
              </span>
              <div className="py-4 flex justify-center items-center bg-white border border-dashed border-[#D9DEE7] rounded min-h-[90px]">
                {formData.headerLogoType === 'custom_image' && formData.headerLogoUrl ? (
                  <img
                    src={formData.headerLogoUrl}
                    alt={formData.headerLogoAlt}
                    style={{ maxWidth: `${formData.headerLogoWidth}px` }}
                    className="h-auto object-contain"
                  />
                ) : (
                  <div style={{ maxWidth: `${formData.headerLogoWidth}px` }} className="w-full flex justify-center">
                    <Logo />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. LOGÓTIPO DO RODAPÉ */}
          {/* ======================================================== */}
          <div className="border border-[#D9DEE7] rounded-lg p-5 bg-[#0B2345]/5 space-y-5">
            <div className="border-b border-[#EAECEF] pb-3">
              <span className="text-[10px] font-bold text-[#16803C] uppercase tracking-wider block">
                RODAPÉ INSTITUCIONAL
              </span>
              <h3 className="font-serif font-bold text-base text-[#0B2345]">
                Logótipo do Rodapé (Fundo Escuro #07172E)
              </h3>
              <p className="text-xs text-[#5D6673]">
                Exibido na Coluna 1 do novo rodapé sobre fundo azul-marinho.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1.5">
                Fonte do Logótipo do Rodapé:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className={`p-2.5 border rounded-lg cursor-pointer flex items-center gap-2 transition ${
                  formData.footerLogoType === 'default_svg' 
                    ? 'border-[#0B2345] bg-slate-100 text-[#0B2345] font-bold ring-1 ring-[#0B2345]' 
                    : 'border-[#D9DEE7] bg-white text-[#5D6673]'
                }`}>
                  <input
                    type="radio"
                    name="footerLogoType"
                    value="default_svg"
                    checked={formData.footerLogoType === 'default_svg'}
                    onChange={() => setFormData({ ...formData, footerLogoType: 'default_svg' })}
                    className="accent-[#0B2345]"
                  />
                  <span className="text-[11px]">Vetor Claro Oficial</span>
                </label>

                <label className={`p-2.5 border rounded-lg cursor-pointer flex items-center gap-2 transition ${
                  formData.footerLogoType === 'same_as_header' 
                    ? 'border-[#0B2345] bg-slate-100 text-[#0B2345] font-bold ring-1 ring-[#0B2345]' 
                    : 'border-[#D9DEE7] bg-white text-[#5D6673]'
                }`}>
                  <input
                    type="radio"
                    name="footerLogoType"
                    value="same_as_header"
                    checked={formData.footerLogoType === 'same_as_header'}
                    onChange={() => setFormData({ ...formData, footerLogoType: 'same_as_header' })}
                    className="accent-[#0B2345]"
                  />
                  <span className="text-[11px]">Reutilizar Cabeçalho</span>
                </label>

                <label className={`p-2.5 border rounded-lg cursor-pointer flex items-center gap-2 transition ${
                  formData.footerLogoType === 'custom_image' 
                    ? 'border-[#0B2345] bg-slate-100 text-[#0B2345] font-bold ring-1 ring-[#0B2345]' 
                    : 'border-[#D9DEE7] bg-white text-[#5D6673]'
                }`}>
                  <input
                    type="radio"
                    name="footerLogoType"
                    value="custom_image"
                    checked={formData.footerLogoType === 'custom_image'}
                    onChange={() => setFormData({ ...formData, footerLogoType: 'custom_image' })}
                    className="accent-[#0B2345]"
                  />
                  <span className="text-[11px]">Imagem Independente</span>
                </label>
              </div>
            </div>

            {formData.footerLogoType === 'custom_image' && (
              <div className="space-y-3 pt-2 border-t border-[#EAECEF]">
                <div>
                  <label className="block text-xs font-bold text-[#0B2345] mb-1">
                    URL da Imagem para Fundo Escuro:
                  </label>
                  <input
                    type="text"
                    placeholder="https://... ou /assets/images/logo-footer-light.png"
                    value={formData.footerLogoUrl}
                    onChange={(e) => setFormData({ ...formData, footerLogoUrl: e.target.value })}
                    className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 bg-white focus:outline-none focus:border-[#0B5FFF]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1">
                Texto Alternativo do Rodapé:
              </label>
              <input
                type="text"
                value={formData.footerLogoAlt}
                onChange={(e) => setFormData({ ...formData, footerLogoAlt: e.target.value })}
                className="w-full text-xs border border-[#D9DEE7] rounded p-2 bg-white focus:outline-none focus:border-[#0B5FFF]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#0B2345] mb-1">
                <span>Largura do Logótipo no Rodapé:</span>
                <span className="font-mono text-[#0B2345]">{formData.footerLogoWidth}px</span>
              </div>
              <input
                type="range"
                min="180"
                max="400"
                step="10"
                value={formData.footerLogoWidth}
                onChange={(e) => setFormData({ ...formData, footerLogoWidth: Number(e.target.value) })}
                className="w-full accent-[#0B2345]"
              />
            </div>

            {/* LIVE PREVIEW RODAPÉ */}
            <div className="border border-[#0B2345] rounded-lg p-4 bg-[#07172E] text-white shadow-2xs">
              <span className="text-[10px] font-bold text-[#FFCC29] uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>Pré-visualização no Rodapé (Fundo #07172E):</span>
              </span>
              <div className="py-4 flex flex-col justify-center items-start border border-dashed border-white/20 rounded p-4 min-h-[90px]">
                {formData.footerLogoType === 'custom_image' && formData.footerLogoUrl ? (
                  <img
                    src={formData.footerLogoUrl}
                    alt={formData.footerLogoAlt}
                    style={{ maxWidth: `${formData.footerLogoWidth}px` }}
                    className="h-auto object-contain mb-2"
                  />
                ) : formData.footerLogoType === 'same_as_header' && formData.headerLogoType === 'custom_image' && formData.headerLogoUrl ? (
                  <img
                    src={formData.headerLogoUrl}
                    alt={formData.footerLogoAlt}
                    style={{ maxWidth: `${formData.footerLogoWidth}px` }}
                    className="h-auto object-contain mb-2"
                  />
                ) : (
                  <div className="mb-2">
                    <span className="font-serif text-2xl font-black text-white tracking-wide block">
                      O PATRIOTA
                    </span>
                    <span className="text-[9px] font-bold tracking-widest uppercase text-[#FFCC29] block">
                      BRASIL
                    </span>
                  </div>
                )}
                <p className="text-[10px] text-[#FFCC29] font-bold uppercase tracking-widest">
                  {formData.slogan}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 3. SLOGAN, APRESENTAÇÃO INSTITUCIONAL & COPYRIGHT */}
        {/* ======================================================== */}
        <div className="border border-[#D9DEE7] rounded-lg p-5 bg-[#FAFBFC] space-y-4">
          <h3 className="font-serif font-bold text-base text-[#0B2345]">
            Textos Institucionais e Informações da Mantenedora
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1">
                Slogan Oficial do Jornal:
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 bg-white font-semibold focus:outline-none focus:border-[#0B5FFF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2345] mb-1">
                Apresentação Institucional Curta (Coluna 1 do Rodapé):
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 bg-white focus:outline-none focus:border-[#0B5FFF]"
                placeholder="Breve resumo da missão e história do jornal..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2345] mb-1">
              Texto de Copyright e Mantenedora (Barra Inferior do Rodapé):
            </label>
            <input
              type="text"
              value={formData.copyrightText}
              onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
              className="w-full text-xs border border-[#D9DEE7] rounded p-2.5 bg-white focus:outline-none focus:border-[#0B5FFF]"
              required
            />
            <p className="text-[11px] text-[#5D6673] mt-1">
              O ano atual ({new Date().getFullYear()}) é inserido automaticamente antes deste texto no rodapé.
            </p>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#EAECEF]">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 border border-[#D9DEE7] text-xs font-semibold text-[#5D6673] hover:text-[#0B2345] rounded cursor-pointer"
          >
            Descartar Alterações
          </button>
          <button
            type="submit"
            className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-6 py-2.5 rounded transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar e Aplicar Identidade Visual</span>
          </button>
        </div>
      </form>
    </div>
  );
};
