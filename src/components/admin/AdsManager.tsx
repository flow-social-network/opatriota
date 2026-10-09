import React, { useState } from 'react';
import { AdSlotConfig, AdSenseGlobalConfig, AdSlotPosition, AdSlotFormat } from '../../types';
import { 
  Megaphone, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  Sliders, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  HelpCircle,
  AlertTriangle,
  Monitor
} from 'lucide-react';
import { DEFAULT_AD_SLOTS, DEFAULT_ADSENSE_CONFIG } from '../../services/siteConfigService';

interface AdsManagerProps {
  adsenseConfig: AdSenseGlobalConfig;
  adSlots: AdSlotConfig[];
  onSaveAds: (adsense: AdSenseGlobalConfig, slots: AdSlotConfig[]) => void;
}

export const AdsManager: React.FC<AdsManagerProps> = ({
  adsenseConfig,
  adSlots,
  onSaveAds
}) => {
  const [adsense, setAdsense] = useState<AdSenseGlobalConfig>(adsenseConfig);
  const [slots, setSlots] = useState<AdSlotConfig[]>(adSlots);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'slots' | 'adsense' | 'admob'>('slots');

  const handleToggleSlot = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleSlotFieldChange = (id: string, field: keyof AdSlotConfig, value: any) => {
    setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    onSaveAds(adsense, slots);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleResetDefaults = () => {
    setAdsense(DEFAULT_ADSENSE_CONFIG);
    setSlots(DEFAULT_AD_SLOTS);
  };

  return (
    <div className="bg-white border border-[#D9DEE7] rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#EAECEF] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#16803C] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              CENTRAL DE MONETIZAÇÃO
            </span>
            <span className="text-xs text-[#5D6673]">• Publicidade & AdSense</span>
          </div>
          <h2 className="font-serif font-black text-xl text-[#0B2345] mt-1">
            Central de Espaços Publicitários e Google AdSense
          </h2>
          <p className="text-xs text-[#5D6673] mt-0.5">
            Gerencie os 7 espaços publicitários oficiais da homepage e das matérias, configure sua conta Google AdSense e consulte a especificação AdMob.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-[#5D6673] hover:text-[#0B2345] px-3 py-2 rounded border border-[#D9DEE7] bg-white hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            title="Restaurar posições originais"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-4 py-2 rounded transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configuração</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-[#EBF7EE] border-b border-[#16803C]/30 text-[#16803C] p-4 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuração da Central de Publicidade salva e sincronizada com sucesso no portal!</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-[#EAECEF] bg-[#FAFBFC] px-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('slots')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition ${
            activeTab === 'slots' 
              ? 'border-[#0B2345] text-[#0B2345] bg-white' 
              : 'border-transparent text-[#5D6673] hover:text-[#0B2345]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span>7 Espaços Publicitários ({slots.filter(s => s.active).length} ativos)</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('adsense')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition ${
            activeTab === 'adsense' 
              ? 'border-[#0B2345] text-[#0B2345] bg-white' 
              : 'border-transparent text-[#5D6673] hover:text-[#0B2345]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Conta Google AdSense (Web)</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('admob')}
          className={`py-3 px-4 border-b-2 cursor-pointer transition ${
            activeTab === 'admob' 
              ? 'border-[#0B2345] text-[#0B2345] bg-white' 
              : 'border-transparent text-[#5D6673] hover:text-[#0B2345]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>Google AdMob (App Móvel)</span>
          </span>
        </button>
      </div>

      <div className="p-6">
        
        {/* ======================================================== */}
        {/* TAB 1: ESPAÇOS PUBLICITÁRIOS */}
        {/* ======================================================== */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5D6673]">
                Ative ou desative posições individualmente. Quando ativas, as posições reservam espaço em tela para evitar saltos visuais (CLS).
              </p>
              <span className="text-xs font-bold text-[#0B2345]">
                {slots.filter(s => s.active).length} de {slots.length} posições ativas
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {slots.map((slot, idx) => (
                <div 
                  key={slot.id}
                  className={`p-4 rounded-lg border transition ${
                    slot.active ? 'border-[#D9DEE7] bg-white shadow-2xs' : 'border-dashed border-gray-300 bg-gray-50/70 opacity-70'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold w-6 h-6 rounded-full bg-[#0B2345]/10 text-[#0B2345] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#0B2345]">
                            {slot.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-[#5D6673]">
                            {slot.position}
                          </span>
                        </div>
                        <p className="text-xs text-[#5D6673] mt-0.5">
                          Formato: <strong>{slot.format}</strong> • Dimensões sugeridas: {slot.width}x{slot.height}px
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Platform Select */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#5D6673] uppercase mb-0.5">Plataforma:</label>
                        <select
                          value={slot.platform}
                          onChange={(e) => handleSlotFieldChange(slot.id, 'platform', e.target.value)}
                          className="text-xs border border-[#D9DEE7] rounded px-2.5 py-1 bg-white focus:outline-none"
                        >
                          <option value="adsense">Google AdSense</option>
                          <option value="direct">Anunciante Direto</option>
                          <option value="empty">Vazio / Reserva</option>
                        </select>
                      </div>

                      {/* Slot ID */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#5D6673] uppercase mb-0.5">ID do Bloco (Slot ID):</label>
                        <input
                          type="text"
                          placeholder="Ex: 1234567890"
                          value={slot.slotId}
                          onChange={(e) => handleSlotFieldChange(slot.id, 'slotId', e.target.value)}
                          className="text-xs border border-[#D9DEE7] rounded px-2.5 py-1 bg-white focus:outline-none font-mono w-32"
                        />
                      </div>

                      {/* Active Toggle Button */}
                      <div className="pt-3 sm:pt-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSlot(slot.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer transition flex items-center gap-1.5 ${
                            slot.active 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${slot.active ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                          <span>{slot.active ? 'Exibir no Portal' : 'Oculto'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CONTA GOOGLE ADSENSE (WEB) */}
        {/* ======================================================== */}
        {activeTab === 'adsense' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#0B2345]">
                <Globe className="w-4 h-4 text-[#0B5FFF]" />
                <span>Integração Oficial com Google AdSense (Web)</span>
              </div>
              <p className="text-[#17202A] leading-relaxed">
                Insira o seu Identificador de Editor (Publisher ID) oficial fornecido pelo Google AdSense após aprovação da conta. Os anúncios só serão solicitados à rede do Google quando esta chave estiver configurada.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B2345] mb-1">
                  Publisher ID Oficial (Identificador da Conta):
                </label>
                <input
                  type="text"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  value={adsense.publisherId}
                  onChange={(e) => setAdsense({ ...adsense, publisherId: e.target.value.trim() })}
                  className="w-full border border-[#D9DEE7] rounded p-2.5 font-mono text-sm bg-white focus:outline-none focus:border-[#0B5FFF]"
                />
                <p className="text-[11px] text-[#5D6673] mt-1">
                  Encontrado no painel do Google AdSense em Conta &gt; Informações da conta.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-3 border border-[#D9DEE7] rounded-lg cursor-pointer bg-[#F8FAFC]">
                  <input
                    type="checkbox"
                    checked={adsense.enabled}
                    onChange={(e) => setAdsense({ ...adsense, enabled: e.target.checked })}
                    className="mt-0.5 accent-[#16803C]"
                  />
                  <div>
                    <span className="font-bold text-[#0B2345] block">Ativar Monetização Global do Portal</span>
                    <span className="text-[11px] text-[#5D6673]">
                      Permite que os espaços ativos solicitem anúncios ao Google AdSense no site.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-[#D9DEE7] rounded-lg cursor-pointer bg-[#F8FAFC]">
                  <input
                    type="checkbox"
                    checked={adsense.testMode}
                    onChange={(e) => setAdsense({ ...adsense, testMode: e.target.checked })}
                    className="mt-0.5 accent-[#0B5FFF]"
                  />
                  <div>
                    <span className="font-bold text-[#0B2345] block">Modo Demonstração / Homologação (Recomendado)</span>
                    <span className="text-[11px] text-[#5D6673]">
                      Exibe espaços reservados elegantes no layout sem quebrar o design enquanto sua conta estiver em análise ou em desenvolvimento.
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Conformidade com a Política Editorial</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Conforme a política do jornal O Patriota, as notícias permanecem 100% abertas para leitura integral, e os anúncios não devem cobrir títulos editoriais nem bloquear a navegação.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ESPECIFICAÇÃO ADMOB (APP MÓVEL) */}
        {/* ======================================================== */}
        {activeTab === 'admob' && (
          <div className="max-w-2xl space-y-5 text-xs">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-900">
                <Smartphone className="w-4 h-4 text-purple-700" />
                <span>Arquitetura Google AdMob para Aplicativo Móvel</span>
              </div>
              <p className="text-purple-900 leading-relaxed">
                O Google AdMob é destinado <strong>exclusivamente a aplicativos móveis nativos (Android/iOS)</strong>. Por regra de engenharia, o SDK do AdMob não é injetado no portal WordPress/Web para preservar a velocidade e a conformidade técnica.
              </p>
            </div>

            <div className="border border-[#D9DEE7] rounded-lg p-5 space-y-3 bg-[#FAFBFC]">
              <h4 className="font-bold text-[#0B2345] text-sm">
                Diretrizes de Implementação no Futuro App Móvel:
              </h4>
              <ul className="space-y-2 text-[#5D6673] list-disc pl-5">
                <li>
                  <strong>Banners de Rodapé Fixo:</strong> Dimensões 320x50 ou Adaptive Banner no rodapé do aplicativo.
                </li>
                <li>
                  <strong>Anúncios Nativos no Feed:</strong> Integrados no feed de rolagem infinita de notícias, respeitando o design system azul e branco de O Patriota.
                </li>
                <li>
                  <strong>Restrição de Intersticiais:</strong> Não interromper a leitura de notícias no meio de parágrafos com anúncios de tela cheia.
                </li>
                <li>
                  <strong>Consentimento e Privacidade:</strong> SDK UMP (User Messaging Platform) do Google para conformidade com a LGPD no Brasil.
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
