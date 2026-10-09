import React, { useState } from 'react';
import { Article, CategorySlug, CategoryDetail } from '../../types';
import { 
  AlertTriangle, 
  Search, 
  Home, 
  ArrowRight, 
  Compass, 
  Clock 
} from 'lucide-react';

interface NotFoundPageViewProps {
  categories: CategoryDetail[];
  recentArticles: Article[];
  onNavigateHome: () => void;
  onSelectCategory: (cat: CategorySlug) => void;
  onSelectArticle: (article: Article) => void;
  onSearch: (term: string) => void;
}

export const NotFoundPageView: React.FC<NotFoundPageViewProps> = ({
  categories,
  recentArticles,
  onNavigateHome,
  onSelectCategory,
  onSelectArticle,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Error 404 Box */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-8 md:p-12 text-center shadow-xs mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 text-[#0B2345] mb-6">
            <span className="font-serif text-3xl font-black text-[#0B2345]">404</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-black text-[#0B2345] mb-3">
            Página Não Encontrada
          </h1>

          <p className="text-sm md:text-base text-[#5D6673] max-w-xl mx-auto leading-relaxed mb-8">
            O endereço que você tentou acessar pode ter sido atualizado, renomeado ou não está mais disponível temporariamente no acervo de O Patriota.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2 mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar notícias no portal..."
              className="flex-1 text-xs border border-[#D9DEE7] px-4 py-3 rounded-lg focus:outline-none focus:border-[#0B5FFF]"
            />
            <button
              type="submit"
              className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-6 py-3 rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar</span>
            </button>
          </form>

          {/* Home Button */}
          <div>
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold px-6 py-3 rounded-lg transition cursor-pointer shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>Voltar para a Página Inicial</span>
            </button>
          </div>
        </div>

        {/* Explore Categories */}
        <div className="bg-white border border-[#D9DEE7] rounded-xl p-6 md:p-8 shadow-xs mb-10">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EAECEF]">
            <Compass className="w-5 h-5 text-[#0B5FFF]" />
            <h2 className="font-serif font-bold text-lg text-[#0B2345]">
              Navegue pelas Principais Editorias
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.filter(c => c.active).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(cat.slug)}
                className="p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#EAECEF] border border-[#EAECEF] text-xs font-bold text-[#0B2345] text-left transition flex items-center justify-between group cursor-pointer"
              >
                <span>{cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#0B5FFF]" />
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Recent Articles */}
        {recentArticles.length > 0 && (
          <div className="bg-white border border-[#D9DEE7] rounded-xl p-6 md:p-8 shadow-xs">
            <h2 className="font-serif font-bold text-lg text-[#0B2345] mb-4 pb-3 border-b border-[#EAECEF]">
              Notícias Recentes Recomendadas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentArticles.slice(0, 4).map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="flex gap-4 p-3 rounded-lg hover:bg-[#F8FAFC] transition cursor-pointer group border border-transparent hover:border-[#EAECEF]"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-24 h-20 rounded object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block mb-1">
                      {art.category.toUpperCase()}
                    </span>
                    <h3 className="font-serif text-xs font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <span className="text-[10px] text-[#717E8E] mt-1 block">
                      {art.publishedAt.split('às')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
