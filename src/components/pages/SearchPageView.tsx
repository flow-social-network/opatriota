import React, { useState, useMemo } from 'react';
import { Article, CategorySlug } from '../../types';
import { CategoryDetail } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  ArrowRight, 
  X, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

interface SearchPageViewProps {
  initialQuery: string;
  articles: Article[];
  categories: CategoryDetail[];
  onSelectArticle: (article: Article) => void;
  onNavigateHome: () => void;
}

const ITEMS_PER_PAGE = 8;

export const SearchPageView: React.FC<SearchPageViewProps> = ({
  initialQuery,
  articles,
  categories,
  onSelectArticle,
  onNavigateHome
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'todos' | 'hoje' | 'semana' | 'mes'>('todos');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filteredResults = useMemo(() => {
    return articles.filter((art) => {
      // Must be published
      if (art.editorialStatus !== 'PUBLICADA') return false;

      // Text query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesSub = art.subtitle?.toLowerCase().includes(q);
        const matchesContent = art.content?.toLowerCase().includes(q);
        const matchesAuthor = art.author?.toLowerCase().includes(q);
        const matchesTag = art.tags?.some(t => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesSub && !matchesContent && !matchesAuthor && !matchesTag) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'todos' && art.category !== selectedCategory) {
        return false;
      }

      // Timeframe filter (simplistic match for demo/real data)
      if (selectedTimeframe === 'hoje') {
        if (!art.publishedAt.toLowerCase().includes('08 de outubro') && !art.publishedAt.toLowerCase().includes('hoje')) {
          return false;
        }
      }

      return true;
    });
  }, [articles, query, selectedCategory, selectedTimeframe]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSelectedTimeframe('todos');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* Breadcrumbs Bar */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Pesquisa Editorial' }
            ]}
          />
          <span className="text-xs text-[#5D6673]">
            {filteredResults.length} {filteredResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 pt-8">
        
        {/* Search Input Box */}
        <div className="bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-8 mb-8 shadow-xs">
          <h1 className="font-serif text-2xl md:text-3xl font-black text-[#0B2345] mb-2">
            Pesquisar no Acervo de O Patriota
          </h1>
          <p className="text-xs md:text-sm text-[#5D6673] mb-6">
            Consulte reportagens, análises de conjuntura, notas legislativas e checagens documentais em tempo real.
          </p>

          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#5D6673] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Digite termos de busca, nomes de autoridades, números de leis ou temas..."
              className="w-full pl-12 pr-10 py-3.5 bg-[#F8FAFC] border border-[#D9DEE7] rounded-lg text-sm text-[#0B2345] focus:outline-none focus:border-[#0B5FFF] focus:bg-white shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Limpar pesquisa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="mt-6 pt-5 border-t border-[#EAECEF] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-[#0B2345] flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtrar por:
              </span>

              {/* Category Select */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#D9DEE7] rounded px-3 py-1.5 text-xs text-[#0B2345] focus:outline-none cursor-pointer"
              >
                <option value="todos">Todas as Editorias</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Timeframe Select */}
              <select
                value={selectedTimeframe}
                onChange={(e) => {
                  setSelectedTimeframe(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#D9DEE7] rounded px-3 py-1.5 text-xs text-[#0B2345] focus:outline-none cursor-pointer"
              >
                <option value="todos">Todo o Período</option>
                <option value="hoje">Publicadas Hoje</option>
                <option value="semana">Últimos 7 dias</option>
                <option value="mes">Últimos 30 dias</option>
              </select>

              {(selectedCategory !== 'todos' || selectedTimeframe !== 'todos') && (
                <button
                  onClick={handleResetFilters}
                  className="text-[#0B5FFF] hover:underline font-semibold cursor-pointer"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="text-xs text-[#717E8E]">
              Exibindo página <strong className="text-[#0B2345]">{currentPage}</strong> de {totalPages}
            </div>
          </div>
        </div>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-[#D9DEE7] rounded-lg p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#F1F3F5] text-[#5D6673] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0B2345] mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-xs md:text-sm text-[#5D6673] leading-relaxed mb-6">
              Não encontramos nenhuma matéria correspondente a <strong>"{query}"</strong> com os filtros selecionados. Tente usar palavras-chave mais genéricas ou remover os filtros de editoria.
            </p>
            <button
              onClick={() => {
                setQuery('');
                handleResetFilters();
              }}
              className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-4 py-2.5 rounded transition cursor-pointer"
            >
              Ver Todas as Notícias do Portal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedResults.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-white border border-[#D9DEE7] rounded-lg p-5 md:p-6 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col md:flex-row gap-5 group"
              >
                <div className="md:w-56 h-36 shrink-0 rounded overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                      <span className="font-bold text-[#0B5FFF] uppercase tracking-wider">
                        {art.category.toUpperCase()}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[#717E8E]">{art.publishedAt}</span>
                    </div>

                    <h2 className="font-serif text-lg md:text-xl font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition leading-snug mb-2">
                      {art.title}
                    </h2>

                    <p className="text-xs md:text-sm text-[#5D6673] line-clamp-2 leading-relaxed mb-3">
                      {art.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between text-xs text-[#717E8E]">
                    <span>Por <strong className="text-[#0B2345]">{art.author}</strong></span>
                    <span className="text-[#0B5FFF] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Acessar matéria <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t border-[#D9DEE7] flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded bg-white border border-[#D9DEE7] text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 inline" /> Anterior
                </button>
                <span className="text-xs text-[#5D6673] px-3 font-semibold">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded bg-white border border-[#D9DEE7] text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Próxima <ChevronRight className="w-4 h-4 inline" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
