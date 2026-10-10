import React from 'react';
import { Article } from '../../types';

interface CorrectionRequestModalProps {
  targetArticle: Article;
  correctionNotes: string;
  setCorrectionNotes: (value: string) => void;
  correctionError: string | null;
  setCorrectionError: (value: string | null) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const CorrectionRequestModal: React.FC<CorrectionRequestModalProps> = ({
  targetArticle,
  correctionNotes,
  setCorrectionNotes,
  correctionError,
  setCorrectionError,
  onClose,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
          <h3 className="font-serif text-lg font-bold text-[#0B2345]">
            Solicitar Correções ao Repórter
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 font-bold p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#5D6673]">
          Matéria: <strong>"{targetArticle.title}"</strong> (Autor: {targetArticle.author})
        </p>

        {correctionError && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-[#B42318] text-xs rounded font-medium flex items-center justify-between">
            <span>{correctionError}</span>
            <button type="button" onClick={() => setCorrectionError(null)} className="text-red-400 hover:text-red-700">✕</button>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold mb-1 text-[#0B2345]">
            Orientações Editoriais e Ajustes Obrigatórios:
          </label>
          <textarea
            rows={4}
            placeholder="Indique com clareza quais pontos devem ser retificados (ex: checar dados oficiais, melhorar título, incluir posição do ministério)..."
            value={correctionNotes}
            onChange={(e) => setCorrectionNotes(e.target.value)}
            className="w-full border border-[#D9DEE7] p-2.5 rounded text-xs focus:outline-none focus:border-[#0B5FFF]"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#D9DEE7] text-xs font-bold rounded cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold rounded transition cursor-pointer"
          >
            Devolver para Correção
          </button>
        </div>
      </div>
    </div>
  );
};
