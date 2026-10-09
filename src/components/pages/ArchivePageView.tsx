import React, { useState, useMemo } from 'react';
import { Article, CategorySlug } from '../../types';
import { CategoryDetail, AuthorDetail } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  Archive, 
  Calendar, 
  Filter, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ArchivePageViewProps {
  articles: Article[];
  categories: CategoryDetail[];
  authors: AuthorDetail[];
  onSelectArticle: (article: Article) => void;
  onNavigateHome: () => void;
}

const ITEMS_PER_PAGE = 8;

export const ArchivePageView: React.FC<ArchivePageViewProps> = ({
  articles,
  categories,
  authors,
  onSelectArticle,
  onNavigateHome
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('todos');
  const [selectedCat, setSelectedCat] = useState<string>('todos');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const months = [
    { value: 'todos', label: 'Todos os Meses' },
    { value: 'outubro', label: 'Outubro' },
    { value: 'setembro', label: 'Setembro' },
    { value: 'agosto', label: 'Agosto' },
    { value: 'julho', label: 'Julho' },
    { value: 'junho', label: 'Junho' },
    { value: 'maio', label: 'Maio' },
    { value: 'abril', label: 'Abril' },
    { value: 'marco', label: 'Março' },
    { value: 'fevereiro', label: 'Fevereiro' },
    { value: 'janeiro', label: 'Janeiro' }
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (art.editorialStatus !== 'PUBLICADA') return false;

      // Year check
      if (selectedYear !== 'todos') {
        if (!art.publishedAt.includes(selectedYear)) return false;
      }

      // Month check
      if (selectedMonth !== 'todos') {
        if (!art.publishedAt.toLowerCase().includes(selectedMonth)) return false;
      }

      // Category check
      if (selectedCat !== 'todos') {
        if (art.category !== selectedCat) return false;
      }

      // Author check
      if (selectedAuthor !== 'todos') {
        if (!art.author.toLowerCase().includes(selectedAuthor.toLowerCase())) return false;
      }

      return true;
    });
  }, [articles, selectedYear, selectedMonth, selectedCat, selectedAuthor]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* Breadcrumbs Bar */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Arquivo Histórico' }
            ]}
          />
          <span className="text-xs text-[#5D6673]">
            Acervo: <strong className="text-[#0B2345]">{filteredArticles.length}</strong> matérias
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 pt-8">
        
        {/* Header Block */}
        <header className="bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-8 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#0B2345] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-[#FFCC29]" />
              MEMÓRIA EDITORIAL
            </span>
            <span className="text-xs text-[#5D6673]">Edições e publicações históricas</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-black text-[#0B2345] mb-2">
            Arquivo Completo de Matérias
          </h1>
          <p className="text-xs md:text-sm text-[#5D6673] mb-6">
            Navegue cronologicamente por ano, mês, editoria ou assinado por jornalista da equipe de O Patriota.
          </p>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-5 border-t border-[#EAECEF]">
            {/* Year */}
            <div>
              <label className="block text-[11px] font-bold text-[#0B2345] mb-1">Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-[#D9DEE7] rounded p-2 text-xs text-[#0B2345] focus:outline-none"
              >
                <option value="todos">Todos os Anos</option>
                <option value="2026">2026 (Ano Corrente)</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="block text-[11px] font-bold text-[#0B2345] mb-1">Mês</label>
              <select
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-[#D9DEE7] rounded p-2 text-xs text-[#0B2345] focus:outline-none"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-[#0B2345] mb-1">Editoria</label>
              <select
                value={selectedCat}
                onChange={(e) => { setSelectedCat(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-[#D9DEE7] rounded p-2 text-xs text-[#0B2345] focus:outline-none"
              >
                <option value="todos">Todas as Editorias</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-[11px] font-bold text-[#0B2345] mb-1">Autor / Repórter</label>
              <select
                value={selectedAuthor}
                onChange={(e) => { setSelectedAuthor(e.target.value); setCurrentPage(1); }}
                className="w-full bg-white border border-[#D9DEE7] rounded p-2 text-xs text-[#0B2345] focus:outline-none"
              >
                <option value="todos">Todos os Autores</option>
                {authors.map(a => (
                  <option key={a.id} value={a.name}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Results List */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white border border-[#D9DEE7] rounded-lg p-10 text-center text-sm text-[#5D6673]">
            Nenhuma reportagem encontrada para os filtros selecionados no arquivo.
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-white border border-[#D9DEE7] rounded-lg p-5 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col md:flex-row gap-5 items-center group"
              >
                <div className="w-full md:w-48 h-32 shrink-0 rounded overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 text-[11px]">
                    <span className="font-bold text-[#0B5FFF] uppercase tracking-wider">
                      {art.category.toUpperCase()}
                    </span>
                    <span>•</span>
                    <span className="text-[#717E8E]">{art.publishedAt}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition leading-snug mb-1">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#5D6673] line-clamp-2 mb-2">
                    {art.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#717E8E] pt-2 border-t border-[#F1F3F5]">
                    <span>Por <strong className="text-[#0B2345]">{art.author}</strong></span>
                    <span className="text-[#0B5FFF] font-bold flex items-center gap-1">
                      Ler no arquivo <ArrowRight className="w-3 h-3" />
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
