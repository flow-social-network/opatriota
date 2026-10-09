import React, { useState } from 'react';
import { LiveSourceNews } from '../LiveSourceNews';
import { Article, CategorySlug } from '../../types';
import { CategoryDetail } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bookmark, 
  Share2,
  Lock,
  Sparkles
} from 'lucide-react';

interface CategoryPageViewProps {
  category: CategoryDetail;
  articles: Article[];
  allCategories: CategoryDetail[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (cat: CategorySlug) => void;
  onNavigateHome: () => void;
  onSearch: (term: string) => void;
}

const ITEMS_PER_PAGE = 6;

export const CategoryPageView: React.FC<CategoryPageViewProps> = ({
  category,
  articles,
  allCategories,
  onSelectArticle,
  onSelectCategory,
  onNavigateHome,
  onSearch
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInternal, setSearchInternal] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filter published articles for this category
  const categoryArticles = articles.filter(
    (a) => a.category === category.slug && a.editorialStatus === 'PUBLICADA'
  );

  // If there are articles, separate the featured headline and the rest
  const featuredArticle = categoryArticles.length > 0 ? categoryArticles[0] : null;
  const remainingArticles = categoryArticles.length > 1 ? categoryArticles.slice(1) : [];

  // Pagination calculation
  const totalPages = Math.ceil(remainingArticles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = remainingArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Popular articles (articles with 'alta' priority or latest)
  const popularArticles = articles
    .filter((a) => a.priority === 'alta' && a.editorialStatus === 'PUBLICADA')
    .slice(0, 4);

  // Related categories
  const relatedCategories = allCategories
    .filter((c) => c.slug !== category.slug && c.active)
    .slice(0, 5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* 1. Breadcrumbs Bar */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Editorias' },
              { label: category.name }
            ]}
          />
          <span className="text-xs text-[#5D6673] hidden sm:inline">
            Total de reportagens: <strong className="text-[#0B2345]">{categoryArticles.length}</strong>
          </span>
        </div>
      </div>

      {/* 2. Category Header Banner */}
      <header className="bg-linear-to-r from-[#0B2345] to-[#07172E] text-white py-10 border-b-4 border-[#FFCC29] relative overflow-hidden">
        {category.bannerImage && (
          <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
            <img 
              src={category.bannerImage} 
              alt={category.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="max-w-[1360px] mx-auto px-4 relative z-10">
          <div className="inline-block bg-[#FFCC29] text-[#07172E] text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded mb-3">
            EDITORIA OFICIAL
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            {category.name}
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-3xl leading-relaxed">
            {category.description}
          </p>
          {category.introText && (
            <p className="text-xs text-[#E2E8F0] mt-2 italic max-w-2xl">
              {category.introText}
            </p>
          )}
        </div>
      </header>

      {/* Notícias externas atualizadas também nas páginas de editoria */}
      <div className="max-w-[1360px] mx-auto px-4">
        <LiveSourceNews />
      </div>

      {/* 3. Main Content Grid */}
      <div className="max-w-[1360px] mx-auto px-4 py-8">
        {categoryArticles.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-[#D9DEE7] rounded-lg p-12 text-center max-w-2xl mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-full bg-[#F1F3F5] text-[#0B2345] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#5D6673]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0B2345] mb-2">
              Nenhuma matéria publicada nesta editoria no momento
            </h2>
            <p className="text-sm text-[#5D6673] mb-6 leading-relaxed">
              Nossa redação está em processo de apuração para novas reportagens na seção de <strong>{category.name}</strong>. Enquanto isso, consulte as últimas notícias de outras áreas ou faça uma pesquisa.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchInternal.trim()) onSearch(searchInternal);
              }}
              className="flex gap-2 max-w-md mx-auto mb-6"
            >
              <input
                type="text"
                placeholder="Buscar notícias no portal..."
                value={searchInternal}
                onChange={(e) => setSearchInternal(e.target.value)}
                className="flex-1 text-xs border border-[#D9DEE7] px-3 py-2 rounded focus:outline-none focus:border-[#0B5FFF]"
              />
              <button
                type="submit"
                className="bg-[#0B2345] hover:bg-[#0B5FFF] text-white text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
              >
                Pesquisar
              </button>
            </form>
            <div className="pt-4 border-t border-[#EAECEF] flex flex-wrap justify-center gap-2">
              <span className="text-xs text-[#5D6673] self-center mr-2">Outras editorias:</span>
              {relatedCategories.map((rc) => (
                <button
                  key={rc.slug}
                  onClick={() => onSelectCategory(rc.slug)}
                  className="bg-[#F1F3F5] hover:bg-[#E2E6EC] text-[#0B2345] text-xs font-medium px-3 py-1.5 rounded transition cursor-pointer"
                >
                  {rc.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Primary Articles Column (8 cols) */}
            <main className="lg:col-span-8 space-y-8">
              
              {/* Featured Headline Card (Notícia principal em destaque) */}
              {featuredArticle && (
                <article 
                  onClick={() => onSelectArticle(featuredArticle)}
                  className="bg-white border border-[#D9DEE7] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="relative h-72 md:h-96 overflow-hidden">
                    <img 
                      src={featuredArticle.imageUrl} 
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-[#0B2345] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded shadow-sm">
                        DESTAQUE DA EDITORIA
                      </span>
                      {featuredArticle.accessLevel !== 'aberto' && (
                        <span className="bg-[#FFCC29] text-[#07172E] text-[10px] font-black uppercase px-2.5 py-1 rounded flex items-center gap-1 shadow-sm">
                          <Lock className="w-3 h-3" />
                          {featuredArticle.accessLevel === 'premium' ? 'PREMIUM' : 'ASSINANTE'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 text-xs text-[#717E8E] mb-2">
                      <span className="font-bold text-[#0B5FFF] uppercase tracking-wider">
                        {featuredArticle.kicker || category.name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.readTimeMinutes} min de leitura
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[#0B2345] group-hover:text-[#0B5FFF] transition leading-tight mb-3">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-sm md:text-base text-[#404B5A] leading-relaxed mb-4">
                      {featuredArticle.subtitle}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#5D6673] pt-4 border-t border-[#EAECEF]">
                      <div className="flex items-center gap-2">
                        <span>Por <strong className="text-[#0B2345]">{featuredArticle.author}</strong></span>
                        <span>•</span>
                        <span>{featuredArticle.publishedAt}</span>
                      </div>
                      <span className="text-[#0B5FFF] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ler matéria completa <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              )}

              {/* Grid of Remaining Articles */}
              {remainingArticles.length > 0 && (
                <section>
                  <div className="flex items-center justify-between border-b-2 border-[#0B2345] pb-2 mb-6">
                    <h3 className="font-serif font-bold text-lg text-[#0B2345] uppercase tracking-wider">
                      Mais Notícias de {category.name}
                    </h3>
                    <span className="text-xs text-[#717E8E]">
                      Página {currentPage} de {totalPages}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedArticles.map((article) => (
                      <article
                        key={article.id}
                        onClick={() => onSelectArticle(article)}
                        className="bg-white border border-[#D9DEE7] rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col group"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                          />
                          {article.accessLevel !== 'aberto' && (
                            <span className="absolute top-2 right-2 bg-[#FFCC29] text-[#07172E] text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              {article.accessLevel === 'premium' ? 'PREMIUM' : 'ASSINANTE'}
                            </span>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block mb-1.5">
                              {article.kicker || category.name}
                            </span>
                            <h4 className="font-serif text-base font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition line-clamp-2 leading-snug mb-2">
                              {article.title}
                            </h4>
                            <p className="text-xs text-[#5D6673] line-clamp-3 leading-relaxed mb-4">
                              {article.subtitle}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#EAECEF] flex items-center justify-between text-[11px] text-[#717E8E]">
                            <span>{article.author}</span>
                            <span>{article.readTimeMinutes} min</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <nav 
                      aria-label="Paginação da categoria"
                      className="mt-8 pt-6 border-t border-[#D9DEE7] flex items-center justify-center gap-2"
                    >
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-bold transition ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-[#D9DEE7] text-[#0B2345] hover:bg-[#F1F3F5] cursor-pointer'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                      </button>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded text-xs font-bold transition cursor-pointer ${
                              currentPage === pageNum
                                ? 'bg-[#0B2345] text-white shadow-xs'
                                : 'bg-white border border-[#D9DEE7] text-[#0B2345] hover:bg-[#F1F3F5]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-3 py-2 rounded text-xs font-bold transition ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-[#D9DEE7] text-[#0B2345] hover:bg-[#F1F3F5] cursor-pointer'
                        }`}
                      >
                        Próxima
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </nav>
                  )}
                </section>
              )}

            </main>

            {/* Sidebar Column (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* Popular News in Portal */}
              <div className="bg-white border border-[#D9DEE7] rounded-lg p-5 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EAECEF] mb-4">
                  <TrendingUp className="w-4 h-4 text-[#16803C]" />
                  <h3 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider">
                    Mais Lidas do Portal
                  </h3>
                </div>
                <div className="space-y-4">
                  {popularArticles.map((art, idx) => (
                    <div
                      key={art.id}
                      onClick={() => onSelectArticle(art)}
                      className="flex gap-3 group cursor-pointer pb-3 border-b border-[#F1F3F5] last:border-b-0 last:pb-0"
                    >
                      <span className="font-serif text-2xl font-black text-[#D9DEE7] group-hover:text-[#0B5FFF] transition w-6 text-center shrink-0">
                        0{idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-[#0B5FFF] uppercase tracking-wider block">
                          {art.category.toUpperCase()}
                        </span>
                        <h4 className="text-xs font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition leading-snug line-clamp-2">
                          {art.title}
                        </h4>
                        <span className="text-[10px] text-[#717E8E] mt-1 block">
                          {art.author}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Categories Navigation */}
              <div className="bg-white border border-[#D9DEE7] rounded-lg p-5 shadow-xs">
                <h3 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider pb-3 border-b border-[#EAECEF] mb-3">
                  Navegue por Outras Editorias
                </h3>
                <div className="space-y-1.5">
                  {allCategories
                    .filter((c) => c.active)
                    .map((cat) => {
                      const isCurrent = cat.slug === category.slug;
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => onSelectCategory(cat.slug)}
                          className={`w-full text-left py-2 px-3 rounded text-xs transition flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? 'bg-[#0B2345] text-white font-bold'
                              : 'text-[#404B5A] hover:bg-[#F1F3F5] hover:text-[#0B2345]'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] opacity-75">
                            {articles.filter((a) => a.category === cat.slug).length} matérias
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Newsletter Callout */}
              <div className="bg-linear-to-br from-[#0B2345] to-[#07172E] text-white p-6 rounded-lg border border-[#0B2345]">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#FFCC29] block mb-1">
                  BOLETIM DIÁRIO
                </span>
                <h4 className="font-serif font-bold text-base mb-2">
                  Receba as Notícias de {category.name}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Cadastre-se gratuitamente para receber os destaques diários apurados pela nossa redação direto na sua caixa de entrada.
                </p>
                {newsletterSubscribed ? (
                  <div className="p-3 bg-[#16803C]/20 border border-[#22A447] text-white rounded text-xs text-center font-medium">
                    ✓ Inscrição confirmada na newsletter com sucesso!
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setNewsletterSubscribed(true);
                    }}
                    className="space-y-2"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Seu melhor e-mail"
                      className="w-full text-xs bg-white text-[#17202A] px-3 py-2.5 rounded focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold py-2.5 rounded transition cursor-pointer"
                    >
                      INSCREVER-SE GRÁTIS
                    </button>
                  </form>
                )}
              </div>

            </aside>

          </div>
        )}
      </div>
    </div>
  );
};
