import React, { useState } from 'react';
import { Article, AuthorDetail } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  Mail, 
  Globe, 
  Twitter, 
  Linkedin, 
  Clock, 
  Calendar, 
  FileText, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AuthorPageViewProps {
  author: AuthorDetail;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigateHome: () => void;
}

const ITEMS_PER_PAGE = 6;

export const AuthorPageView: React.FC<AuthorPageViewProps> = ({
  author,
  articles,
  onSelectArticle,
  onNavigateHome
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter articles written by this author (match by author name or authorId)
  const normalizedAuthorName = author.name.trim().toLocaleLowerCase('pt-BR');
  const authorArticles = articles.filter(
    (article) => article.author.trim().toLocaleLowerCase('pt-BR') === normalizedAuthorName ||
      article.authorId === author.id
  );

  const totalPages = Math.ceil(authorArticles.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = authorArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Redação & Autores' },
              { label: author.name }
            ]}
          />
          <span className="text-xs text-[#5D6673] hidden sm:inline">
            Publicações registradas: <strong className="text-[#0B2345]">{authorArticles.length}</strong>
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 pt-8">
        
        {/* Author Bio Card */}
        <header className="bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-10 mb-8 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative shrink-0">
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#0B2345] shadow-md"
            />

          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="bg-[#0B2345] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                {author.role}
              </span>
              {author.credentials && (
                <span className="text-xs text-[#5D6673] bg-[#F1F3F5] px-2.5 py-1 rounded border border-[#E2E6EC]">
                  {author.credentials}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-black text-[#0B2345] mb-3">
              {author.name}
            </h1>

            <p className="text-sm md:text-base text-[#404B5A] leading-relaxed max-w-3xl mb-3">
              {author.bio}
            </p>
            <p className="text-xs text-[#717E8E] max-w-3xl mb-6">
              Este é um perfil editorial do O Patriota. A sua existência, por si só, não constitui credencial oficial nem comprova registro profissional externo.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-4 border-t border-[#EAECEF]">
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="flex items-center gap-1.5 text-[#0B5FFF] hover:underline font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{author.email}</span>
                </a>
              )}
              {author.social?.twitter && (
                <a
                  href={author.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#5D6673] hover:text-[#0B2345]"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter / X</span>
                </a>
              )}
              {author.social?.linkedin && (
                <a
                  href={author.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#5D6673] hover:text-[#0B2345]"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Author Articles Section */}
        <section>
          <div className="flex items-center justify-between border-b-2 border-[#0B2345] pb-3 mb-6">
            <h2 className="font-serif font-bold text-xl text-[#0B2345] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0B5FFF]" />
              Matérias e Reportagens de {author.name}
            </h2>
            <span className="text-xs text-[#717E8E]">
              {authorArticles.length} {authorArticles.length === 1 ? 'matéria publicada' : 'matérias publicadas'}
            </span>
          </div>

          {authorArticles.length === 0 ? (
            <div className="bg-white border border-[#D9DEE7] rounded-lg p-10 text-center text-sm text-[#5D6673]">
              Nenhum artigo publicado no momento por este autor.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="bg-white border border-[#D9DEE7] rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col group"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#0B2345] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {article.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#0B2345] group-hover:text-[#0B5FFF] transition line-clamp-2 leading-snug mb-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[#5D6673] line-clamp-3 leading-relaxed mb-4">
                        {article.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EAECEF] flex items-center justify-between text-[11px] text-[#717E8E]">
                      <span>{article.publishedAt.split('às')[0]}</span>
                      <span className="text-[#0B5FFF] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ler <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
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
        </section>

      </div>
    </div>
  );
};
