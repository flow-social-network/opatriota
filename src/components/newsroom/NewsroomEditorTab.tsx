import React from 'react';
import { Article, CategorySlug, ContentAccessLevel, UserSession } from '../../types';
import { classifyLeadFactualStatus, isGloboSource } from '../../utils/editorialPolicy';
import { Send, ShieldAlert, Sparkles } from 'lucide-react';

interface NewsroomEditorTabProps {
  editingArticle: Article | null;
  isCreatingNew: boolean;
  currentUser: UserSession;
  formTitle: string;
  setFormTitle: (value: string) => void;
  formSubtitle: string;
  setFormSubtitle: (value: string) => void;
  formContent: string;
  setFormContent: (value: string) => void;
  formCategory: CategorySlug;
  setFormCategory: (value: CategorySlug) => void;
  formKicker: string;
  setFormKicker: (value: string) => void;
  formImageUrl: string;
  formImageCaption: string;
  setFormImageCaption: (value: string) => void;
  formImageCredits: string;
  setFormImageCredits: (value: string) => void;
  formAccessLevel: ContentAccessLevel;
  setFormAccessLevel: (value: ContentAccessLevel) => void;
  formTags: string;
  setFormTags: (value: string) => void;
  formSources: string;
  setFormSources: (value: string) => void;
  formMetaTitle: string;
  setFormMetaTitle: (value: string) => void;
  formMetaDesc: string;
  setFormMetaDesc: (value: string) => void;
  aiSuggestions: {
    titles?: string[];
    clarityScore?: string;
    clarityFeedback?: string;
    missingSources?: string[];
    suggestedTags?: string[];
    summary?: string;
  } | null;
  aiLoading: boolean;
  onSaveDraft: (e: React.FormEvent) => void;
  onSubmitToReview: () => void;
  onRunAiAssistant: () => void;
}

export const NewsroomEditorTab: React.FC<NewsroomEditorTabProps> = ({
  editingArticle,
  isCreatingNew,
  currentUser,
  formTitle,
  setFormTitle,
  formSubtitle,
  setFormSubtitle,
  formContent,
  setFormContent,
  formCategory,
  setFormCategory,
  formKicker,
  setFormKicker,
  formImageUrl,
  formImageCaption,
  setFormImageCaption,
  formImageCredits,
  setFormImageCredits,
  formAccessLevel,
  setFormAccessLevel,
  formTags,
  setFormTags,
  formSources,
  setFormSources,
  formMetaTitle,
  setFormMetaTitle,
  formMetaDesc,
  setFormMetaDesc,
  aiSuggestions,
  aiLoading,
  onSaveDraft,
  onSubmitToReview,
  onRunAiAssistant
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      {/* LEFT: MAIN FORM */}
      <form onSubmit={onSaveDraft} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded border border-[#D9DEE7] shadow-xs space-y-6 text-xs">

        <div className="flex items-center justify-between pb-4 border-b border-[#D9DEE7]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0B2345]">
              {isCreatingNew ? 'Nova Reportagem' : `Editando: ${editingArticle?.title.substring(0, 40)}...`}
            </h3>
            <span className="text-[11px] text-[#5D6673]">
              Status atual: <strong>{editingArticle?.editorialStatus || 'EM REDAÇÃO'}</strong> • Autor: <strong>{editingArticle?.author || currentUser.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold px-4 py-2 rounded transition cursor-pointer"
            >
              Salvar Rascunho
            </button>

            {editingArticle && (
              <button
                type="button"
                onClick={onSubmitToReview}
                className="bg-[#16803C] hover:bg-[#22A447] text-white font-bold px-4 py-2 rounded transition cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar p/ Revisão</span>
              </button>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <label className="block font-bold mb-1 text-[#0B2345]">Título da Matéria (Manchete):</label>
          <input
            type="text"
            placeholder="Ex: Congresso avança em propostas para modernização da economia..."
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="w-full border border-[#D9DEE7] p-2.5 rounded font-serif text-sm font-bold text-[#0B2345] focus:outline-none focus:border-[#0B5FFF]"
            required
          />

          {/* Real-time Factual Status Evaluation */}
          {formTitle.trim().length > 5 && (() => {
            const leadAnalysis = classifyLeadFactualStatus(formTitle, formSubtitle);
            return (
              <div className="mt-2 p-2 rounded-lg border text-[11px] flex items-center justify-between gap-2 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[#0B2345]">Classificação Factual:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${leadAnalysis.badgeClass}`}>
                    {leadAnalysis.label}
                  </span>
                </div>
                <span className="text-[10px] text-[#5D6673] hidden sm:inline">
                  {leadAnalysis.recommendation}
                </span>
              </div>
            );
          })()}
        </div>

        <div>
          <label className="block font-bold mb-1 text-[#0B2345]">Subtítulo (Linha Fina / Resumo):</label>
          <textarea
            rows={2}
            placeholder="Resumo explicativo do acontecimento..."
            value={formSubtitle}
            onChange={(e) => setFormSubtitle(e.target.value)}
            className="w-full border border-[#D9DEE7] p-2.5 rounded focus:outline-none focus:border-[#0B5FFF]"
          />
        </div>

        {/* Body Content */}
        <div>
          <label className="block font-bold mb-1 text-[#0B2345]">Corpo da Matéria:</label>
          <textarea
            rows={12}
            placeholder="Texto completo da reportagem, com citações, dados e apuração circunstanciada..."
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            className="w-full border border-[#D9DEE7] p-3 rounded font-sans leading-relaxed focus:outline-none focus:border-[#0B5FFF]"
            required
          />
        </div>

        {/* Sources & References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-[#0B2345]">Fontes Primárias Consultadas (1 por linha):</label>
            <textarea
              rows={3}
              placeholder="Ex: Diário Oficial da União nº 198&#10;Relatório CNI 2026"
              value={formSources}
              onChange={(e) => setFormSources(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
            />

            {/* Real-time Globo Restriction Alert */}
            {isGloboSource(formSources) && (
              <div className="mt-2 p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 text-[11px] flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-800 font-bold">
                    RESTRIÇÃO EDITORIAL — GRUPO GLOBO
                  </strong>
                  <p className="mt-0.5 text-[10px] text-rose-700 leading-snug">
                    Conforme o Adendo ao Manual de Fontes de O PATRIOTA, publicações da Rede Globo não podem ser utilizadas como sustentação factual. A matéria deve citar documentos originais ou fontes primárias oficiais.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold mb-1 text-[#0B2345]">Tags / Palavras-Chave (separadas por vírgula):</label>
            <textarea
              rows={3}
              placeholder="Congresso, Economia, Trabalho, Brasília"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none focus:border-[#0B5FFF]"
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="p-4 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-3">
          <h4 className="font-bold text-[#0B2345] uppercase text-[11px]">Metadados & SEO Técnico</h4>
          <div>
            <label className="block mb-1 font-semibold">Meta Title (Google / Redes Sociais):</label>
            <input
              type="text"
              value={formMetaTitle}
              onChange={(e) => setFormMetaTitle(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Meta Description:</label>
            <input
              type="text"
              value={formMetaDesc}
              onChange={(e) => setFormMetaDesc(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
            />
          </div>
        </div>

        {/* Review Notes if any */}
        {editingArticle?.reviewNotes && (
          <div className="p-4 bg-[#FEF3F2] border border-[#B42318]/30 text-[#B42318] rounded">
            <strong className="block font-bold mb-1">Orientações de Correção Pendentes:</strong>
            <p>{editingArticle.reviewNotes}</p>
          </div>
        )}
      </form>

      {/* RIGHT SIDEBAR: SETTINGS & AI ASSISTANT */}
      <div className="lg:col-span-4 space-y-6">

        {/* Card: Classification & Access Level */}
        <div className="bg-white p-5 rounded border border-[#D9DEE7] shadow-xs space-y-4 text-xs">
          <h4 className="font-bold text-[#0B2345] uppercase tracking-wider text-[11px] border-b border-[#D9DEE7] pb-2">
            Configurações de Publicação
          </h4>

          <div>
            <label className="block font-semibold mb-1">Editoria:</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as CategorySlug)}
              className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none"
            >
              <option value="politica">Política Nacional</option>
              <option value="brasil">Brasil</option>
              <option value="economia">Economia</option>
              <option value="seguranca">Segurança Pública</option>
              <option value="saude">Saúde</option>
              <option value="cultura">Cultura</option>
              <option value="opiniao">Opinião</option>
              <option value="checagem">Checagem de Fatos</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Chapéu / Kicker Editorial:</label>
            <input
              type="text"
              value={formKicker}
              onChange={(e) => setFormKicker(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none"
            />
          </div>

          {/* Content Access Level / Paywall Config */}
          <div>
            <label className="block font-semibold mb-1">Nível de Acesso (Paywall):</label>
            <select
              value={formAccessLevel}
              onChange={(e) => setFormAccessLevel(e.target.value as ContentAccessLevel)}
              className="w-full border border-[#D9DEE7] p-2 rounded focus:outline-none font-bold text-[#0B2345]"
            >
              <option value="aberto">Aberto (Acesso Geral Livre)</option>
              <option value="assinante">Exclusivo para Assinantes (Digital/Premium)</option>
              <option value="premium">Assinante Premium (Inteligência & Ensaio)</option>
            </select>
          </div>

          {/* Featured Image Selection */}
          <div>
            <label className="block font-semibold mb-1">Imagem Destacada:</label>
            <div className="h-28 rounded overflow-hidden border border-[#D9DEE7] mb-2 bg-slate-100">
              <img src={formImageUrl} alt="Imagem destacada" className="w-full h-full object-cover" />
            </div>
            <input
              type="text"
              placeholder="Legenda da imagem..."
              value={formImageCaption}
              onChange={(e) => setFormImageCaption(e.target.value)}
              className="w-full border border-[#D9DEE7] p-1.5 rounded mb-1 text-[11px]"
            />
            <input
              type="text"
              placeholder="Créditos da fotografia..."
              value={formImageCredits}
              onChange={(e) => setFormImageCredits(e.target.value)}
              className="w-full border border-[#D9DEE7] p-1.5 rounded text-[11px]"
            />
          </div>
        </div>

        {/* Card: AI Editorial Assistant */}
        <div className="bg-[#0B2345] text-white p-5 rounded border border-[#07172E] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFCC29]" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                Assistente IA Editorial
              </h4>
            </div>
            <span className="text-[10px] text-[#FFCC29] font-mono">Gemini API Ready</span>
          </div>

          <p className="text-[11px] text-white/80 leading-relaxed">
            Auxilia na formulação de títulos de impacto, análise de clareza textual e auditoria de fontes faltantes sem inventar declarações ou dados.
          </p>

          <button
            type="button"
            onClick={onRunAiAssistant}
            disabled={aiLoading}
            className="w-full bg-[#16803C] hover:bg-[#22A447] text-white font-bold py-2 rounded transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
            <span>{aiLoading ? 'Analisando texto...' : 'Auditar e Sugerir Títulos'}</span>
          </button>

          {aiSuggestions && (
            <div className="space-y-3 pt-3 border-t border-white/10 text-white/90">
              <div>
                <strong className="block text-[#FFCC29] text-[11px] mb-1">Sugestões de Título Ético:</strong>
                <ul className="space-y-1">
                  {aiSuggestions.titles?.map((t, idx) => (
                    <li
                      key={idx}
                      onClick={() => setFormTitle(t)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded cursor-pointer text-[11px] transition"
                      title="Clique para aplicar este título"
                    >
                      • {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="block text-[#FFCC29] text-[11px] mb-1">Fontes a Verificar:</strong>
                <ul className="space-y-1 text-[11px] text-white/80">
                  {aiSuggestions.missingSources?.map((s, idx) => (
                    <li key={idx}>⚠️ {s}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[10px] text-white/60 italic">
                Nota de Integridade: As sugestões da IA são consultivas. Nenhuma matéria é publicada sem validação humana.
              </div>
            </div>
          )}
        </div>

        {/* Card: Audit Trail */}
        {editingArticle?.auditLog && editingArticle.auditLog.length > 0 && (
          <div className="bg-white p-5 rounded border border-[#D9DEE7] shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-[#0B2345] uppercase tracking-wider text-[11px] border-b border-[#D9DEE7] pb-2">
              Histórico & Auditoria
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {editingArticle.auditLog.map((log) => (
                <div key={log.id} className="p-2 bg-[#F7F8FA] rounded border border-[#D9DEE7] text-[11px]">
                  <div className="font-bold text-[#0B2345]">{log.action}</div>
                  <div className="text-[10px] text-[#5D6673]">{log.userName} ({log.userRole}) • {log.timestamp}</div>
                  {log.notes && <div className="text-[10px] text-[#17202A] italic mt-1">{log.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
