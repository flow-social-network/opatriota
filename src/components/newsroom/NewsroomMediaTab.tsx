import React from 'react';
import { MediaItem } from '../../types';
import { Upload } from 'lucide-react';

interface NewsroomMediaTabProps {
  mediaList: MediaItem[];
  mediaUploadModal: boolean;
  setMediaUploadModal: (value: boolean) => void;
  newMediaName: string;
  setNewMediaName: (value: string) => void;
  newMediaCaption: string;
  setNewMediaCaption: (value: string) => void;
  newMediaCredits: string;
  setNewMediaCredits: (value: string) => void;
  onMediaUpload: (e: React.FormEvent) => void;
  onUseMedia: (med: MediaItem) => void;
}

export const NewsroomMediaTab: React.FC<NewsroomMediaTabProps> = ({
  mediaList,
  mediaUploadModal,
  setMediaUploadModal,
  newMediaName,
  setNewMediaName,
  newMediaCaption,
  setNewMediaCaption,
  newMediaCredits,
  setNewMediaCredits,
  onMediaUpload,
  onUseMedia
}) => {
  return (
    <div className="bg-white p-6 rounded border border-[#D9DEE7] shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0B2345]">
            Biblioteca de Mídia & Fotografias Jornalísticas
          </h3>
          <p className="text-xs text-[#5D6673]">
            Imagens autorizadas para uso com créditos e legendas obrigatórias.
          </p>
        </div>

        <button
          onClick={() => setMediaUploadModal(true)}
          className="flex items-center gap-1.5 bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-3.5 py-2 rounded transition cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Enviar Imagem</span>
        </button>
      </div>

      {/* Media Upload Modal */}
      {mediaUploadModal && (
        <form onSubmit={onMediaUpload} className="p-5 bg-[#F7F8FA] border border-[#D9DEE7] rounded space-y-3 text-xs max-w-lg">
          <h4 className="font-bold text-[#0B2345] uppercase">Cadastrar Nova Imagem</h4>
          <div>
            <label className="block font-semibold mb-1">Nome do Arquivo / Título:</label>
            <input
              type="text"
              placeholder="Ex: plenário_camara_votacao.jpg"
              value={newMediaName}
              onChange={(e) => setNewMediaName(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Legenda Padrão:</label>
            <input
              type="text"
              placeholder="Ex: Sessão deliberativa no plenário da Câmara dos Deputados"
              value={newMediaCaption}
              onChange={(e) => setNewMediaCaption(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Créditos da Fotografia:</label>
            <input
              type="text"
              placeholder="Ex: Agência Câmara / Lula Marques"
              value={newMediaCredits}
              onChange={(e) => setNewMediaCredits(e.target.value)}
              className="w-full border border-[#D9DEE7] p-2 rounded bg-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMediaUploadModal(false)}
              className="px-3 py-1.5 border border-[#D9DEE7] rounded font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#16803C] text-white rounded font-bold cursor-pointer"
            >
              Salvar na Biblioteca
            </button>
          </div>
        </form>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mediaList.map((med) => (
          <div key={med.id} className="p-3 bg-[#F7F8FA] rounded border border-[#D9DEE7] flex flex-col justify-between">
            <div>
              <div className="h-32 rounded overflow-hidden mb-2 bg-slate-200">
                <img src={med.url} alt={med.name} className="w-full h-full object-cover" />
              </div>
              <strong className="block text-xs font-bold text-[#0B2345] truncate">{med.name}</strong>
              <p className="text-[11px] text-[#5D6673] truncate">{med.caption || 'Sem legenda'}</p>
              <span className="text-[10px] text-[#5D6673] block mt-1">Créditos: {med.credits}</span>
            </div>

            <div className="mt-3 pt-2 border-t border-[#D9DEE7] flex justify-between items-center text-[11px]">
              <span className="text-[#5D6673]">{(med.sizeBytes / 1024).toFixed(0)} KB</span>
              <button
                onClick={() => onUseMedia(med)}
                className="text-[#0B5FFF] font-bold hover:underline cursor-pointer"
              >
                Usar no Artigo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
