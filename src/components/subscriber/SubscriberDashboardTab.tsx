import React from 'react';
import { Article, UserSession } from '../../types';
import { Bookmark, Sparkles, ShieldCheck } from 'lucide-react';

interface SubscriberDashboardTabProps {
  currentUser: UserSession;
  bookmarkedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigate: (subpage: string) => void;
}

export const SubscriberDashboardTab: React.FC<SubscriberDashboardTabProps> = ({
  currentUser,
  bookmarkedArticles,
  onSelectArticle,
  onNavigate
}) => {
  return (
    <div className="space-y-5">
      {/* Greeting Box */}
      <div className="p-5 bg-[#0B2345] text-white rounded border border-[#07172E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#FFCC29] uppercase tracking-wider block mb-1">
            ÁREA DO LEITOR O PATRIOTA
          </span>
          <h2 className="font-serif text-2xl font-bold">
            Olá, {currentUser.name}!
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
            Bem-vindo ao seu ambiente personalizado. Aqui você gerencia sua assinatura, acessa notícias salvas e configura seus alertas editoriais.
          </p>
        </div>

        <div className="shrink-0">
          <span className="bg-[#16803C] text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider inline-block">
            Status: Ativo
          </span>
        </div>
      </div>

      {/* Quick Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="p-4 rounded border border-[#D9DEE7] bg-[#F7F8FA]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#5D6673]">Plano Atual</span>
            <Sparkles className="w-4 h-4 text-[#0B5FFF]" />
          </div>
          <div className="text-lg font-black text-[#0B2345] uppercase">
            {currentUser.subscription.plan}
          </div>
          <button
            onClick={() => onNavigate('assinatura')}
            className="text-[11px] font-bold text-[#0B5FFF] hover:underline mt-2 inline-block cursor-pointer"
          >
            Gerenciar ou alterar plano →
          </button>
        </div>

        <div className="p-4 rounded border border-[#D9DEE7] bg-[#F7F8FA]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#5D6673]">Notícias Salvas</span>
            <Bookmark className="w-4 h-4 text-[#16803C]" />
          </div>
          <div className="text-lg font-black text-[#0B2345]">
            {currentUser.bookmarks.length} Matérias
          </div>
          <button
            onClick={() => onNavigate('favoritos')}
            className="text-[11px] font-bold text-[#0B5FFF] hover:underline mt-2 inline-block cursor-pointer"
          >
            Ver lista de leitura →
          </button>
        </div>

        <div className="p-4 rounded border border-[#D9DEE7] bg-[#F7F8FA]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#5D6673]">Membro Desde</span>
            <ShieldCheck className="w-4 h-4 text-[#FFCC29]" />
          </div>
          <div className="text-lg font-black text-[#0B2345]">
            {currentUser.createdAt}
          </div>
          <span className="text-[11px] text-[#5D6673] mt-2 inline-block">
            Conta verificada por e-mail
          </span>
        </div>
      </div>

      {/* Recent Bookmarks on Dashboard */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-[#D9DEE7] pb-2">
          <h3 className="font-serif text-base font-bold text-[#0B2345]">
            Suas Notícias Salvas Recentemente
          </h3>
          <button
            onClick={() => onNavigate('favoritos')}
            className="text-xs font-bold text-[#0B5FFF] hover:underline cursor-pointer"
          >
            Ver todas ({currentUser.bookmarks.length})
          </button>
        </div>

        {bookmarkedArticles.length === 0 ? (
          <p className="text-xs text-[#5D6673] italic py-4">
            Você ainda não salvou nenhuma notícia. Clique no ícone de marcador nas reportagens para ler depois.
          </p>
        ) : (
          <div className="divide-y divide-[#D9DEE7]">
            {bookmarkedArticles.slice(0, 3).map((art) => (
              <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#0B5FFF] uppercase block mb-0.5">
                    {art.kicker}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#0B2345] hover:text-[#0B5FFF] cursor-pointer" onClick={() => onSelectArticle(art)}>
                    {art.title}
                  </h4>
                </div>
                <button
                  onClick={() => onSelectArticle(art)}
                  className="text-xs font-bold text-[#0B2345] hover:text-[#0B5FFF] shrink-0 cursor-pointer"
                >
                  Ler Matéria →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
