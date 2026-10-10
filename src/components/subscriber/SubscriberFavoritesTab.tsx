import React from 'react';
import { Article } from '../../types';
import { Bookmark, Trash2 } from 'lucide-react';

interface SubscriberFavoritesTabProps {
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
}

export const SubscriberFavoritesTab: React.FC<SubscriberFavoritesTabProps> = ({
  bookmarkedArticles,
  onSelectArticle,
  onRemoveBookmark
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#0B2345]">Notícias Salvas nos Favoritos</h3>
        <p className="text-xs text-[#5D6673] mt-1">
          Reportagens marcadas para consulta ou leitura aprofundada posterior.
        </p>
      </div>

      {bookmarkedArticles.length === 0 ? (
        <div className="p-8 text-center bg-[#F7F8FA] rounded border border-[#D9DEE7] text-xs text-[#5D6673]">
          <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="font-semibold text-sm text-[#0B2345]">Nenhum artigo salvo até o momento.</p>
          <p className="mt-1">Ao navegar pelo portal, clique no marcador para salvar artigos nesta lista.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarkedArticles.map((art) => (
            <div
              key={art.id}
              className="p-4 rounded border border-[#D9DEE7] hover:border-[#0B5FFF] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FA]"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-16 h-14 object-cover rounded shrink-0 border border-[#D9DEE7]"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#0B5FFF] uppercase block">
                    {art.kicker}
                  </span>
                  <h4
                    className="font-serif text-sm font-bold text-[#0B2345] hover:text-[#0B5FFF] cursor-pointer"
                    onClick={() => onSelectArticle(art)}
                  >
                    {art.title}
                  </h4>
                  <span className="text-[11px] text-[#5D6673]">
                    {art.readTimeMinutes} min de leitura • {art.publishedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectArticle(art)}
                  className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer"
                >
                  Ler Matéria
                </button>
                <button
                  onClick={() => onRemoveBookmark(art.id)}
                  className="p-1.5 text-[#5D6673] hover:text-[#B42318] rounded border border-[#D9DEE7] bg-white transition cursor-pointer"
                  title="Remover dos favoritos"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
