import React, { useState } from 'react';
import { InstitutionalPage } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  Calendar, 
  Clock, 
  Share2, 
  Check, 
  ArrowRight, 
  Printer, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface InstitutionalPageViewProps {
  page: InstitutionalPage;
  onNavigateHome: () => void;
  onNavigatePage: (slug: string) => void;
  onNavigateContact?: () => void;
}

export const InstitutionalPageView: React.FC<InstitutionalPageViewProps> = ({
  page,
  onNavigateHome,
  onNavigatePage,
  onNavigateContact
}) => {
  const [copied, setCopied] = useState(false);
  const [activeToc, setActiveToc] = useState<string>('');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    setActiveToc(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <article className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* Top Banner / Breadcrumb & Category Bar */}
      <div className="bg-white border-b border-[#D9DEE7] py-3">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Institucional', onClick: () => onNavigatePage('sobre-o-patriota') },
              { label: page.title }
            ]}
          />
          <div className="flex items-center gap-3 text-xs text-[#5D6673]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0B2345]" />
              Atualizado em: <strong className="text-[#0B2345]">{page.updatedAt}</strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1 hover:text-[#0B2345] transition cursor-pointer"
              title="Imprimir documento oficial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 bg-[#F1F3F5] hover:bg-[#E2E6EC] text-[#0B2345] px-2.5 py-1 rounded transition cursor-pointer font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#16803C]" />
                  <span className="text-[#16803C]">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="max-w-[1240px] mx-auto px-4 pt-8">
        {/* Header Block */}
        <header className="bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-[#0B2345] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFCC29]" />
              {page.badge}
            </span>
            <span className="text-xs text-[#5D6673]">
              Portal Oficial O Patriota
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#0B2345] tracking-tight leading-tight mb-4">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-base md:text-lg text-[#404B5A] leading-relaxed max-w-4xl border-l-4 border-[#0B5FFF] pl-4 italic">
              {page.subtitle}
            </p>
          )}

          <div className="mt-6 pt-6 border-t border-[#EAECEF] flex flex-wrap items-center justify-between text-xs text-[#5D6673] gap-4">
            <div className="flex items-center gap-4">
              <span>
                Responsável Editorial: <strong className="text-[#0B2345]">{page.author || 'Conselho Editorial'}</strong>
              </span>
              <span>•</span>
              <span>
                Documento de Registro Público: <strong className="text-[#16803C]">Vigente 2026</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] bg-[#F7F8FA] px-3 py-1 rounded border border-[#E2E6EC]">
              <span className="w-2 h-2 rounded-full bg-[#16803C]"></span>
              Texto oficial revisado pela Diretoria Jurídica & Editorial
            </div>
          </div>
        </header>

        {/* Content Layout: 2 Columns (Table of Contents + Document Body) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Index / TOC & Related Links (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 order-2 lg:order-1">
            
            {/* Table of Contents */}
            {page.toc && page.toc.length > 0 && (
              <div className="bg-white border border-[#D9DEE7] rounded-lg p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAECEF] mb-3">
                  <h3 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0B5FFF]" />
                    Índice do Documento
                  </h3>
                  <span className="text-[11px] text-[#717E8E]">{page.toc.length} seções</span>
                </div>
                <nav className="space-y-1 text-xs">
                  {page.toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left py-2 px-3 rounded transition flex items-center justify-between cursor-pointer ${
                        activeToc === item.id 
                          ? 'bg-[#0B2345] text-white font-semibold' 
                          : 'text-[#404B5A] hover:bg-[#F1F3F5] hover:text-[#0B2345]'
                      }`}
                    >
                      <span className="truncate pr-2">{item.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Related Institutional Links */}
            {page.relatedLinks && page.relatedLinks.length > 0 && (
              <div className="bg-white border border-[#D9DEE7] rounded-lg p-5 shadow-xs">
                <h3 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider pb-3 border-b border-[#EAECEF] mb-3">
                  Documentos Relacionados
                </h3>
                <div className="space-y-3">
                  {page.relatedLinks.map((link, idx) => {
                    const cleanSlug = link.url.replace(/^\/|\/$/g, '');
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (cleanSlug === 'contato') {
                            if (onNavigateContact) onNavigateContact();
                            else onNavigatePage('contato');
                          } else {
                            onNavigatePage(cleanSlug);
                          }
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left p-2.5 rounded border border-[#EAECEF] hover:border-[#0B5FFF] hover:bg-[#F8FAFF] transition group cursor-pointer block"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#0B2345] group-hover:text-[#0B5FFF]">
                          <span>{link.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {link.description && (
                          <p className="text-[11px] text-[#717E8E] mt-1 leading-normal">
                            {link.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Channel Callout */}
            <div className="bg-linear-to-br from-[#0B2345] to-[#07172E] text-white p-5 rounded-lg border border-[#0B2345]">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#FFCC29] block mb-1">
                OUVIDORIA & TRANSPARÊNCIA
              </span>
              <h4 className="font-serif font-bold text-base mb-2">
                Dúvidas ou Apontamentos?
              </h4>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Nossa redação acolhe manifestações públicas de correções, dúvidas editoriais e sugestões com prontidão.
              </p>
              <button
                onClick={() => {
                  if (onNavigateContact) onNavigateContact();
                  else onNavigatePage('contato');
                }}
                className="w-full bg-[#16803C] hover:bg-[#22A447] text-white text-xs font-bold py-2.5 px-4 rounded text-center transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Fale com a Redação</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </aside>

          {/* Right Column: Main Editorial Body (8 cols) */}
          <main className="lg:col-span-8 bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-10 shadow-xs order-1 lg:order-2">
            
            {/* Featured Image if present */}
            {page.featuredImage && (
              <div className="mb-8 overflow-hidden rounded-md border border-[#EAECEF]">
                <img
                  src={page.featuredImage}
                  alt={page.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="bg-[#F8FAFC] px-4 py-2 text-[11px] text-[#5D6673] border-t border-[#EAECEF]">
                  Fotografia documental institucional • Arquivo Oficial O Patriota
                </div>
              </div>
            )}

            {/* Render HTML content with custom typography */}
            <div 
              className="prose prose-slate max-w-none 
                prose-headings:font-serif prose-headings:text-[#0B2345] prose-headings:tracking-tight 
                prose-h2:text-xl prose-h2:font-bold prose-h2:border-b prose-h2:border-[#EAECEF] prose-h2:pb-2.5 prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-2
                prose-p:text-sm prose-p:text-[#2D3748] prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-sm prose-ul:text-[#2D3748] prose-ul:space-y-2 prose-ul:mb-4
                prose-li:leading-relaxed
                prose-strong:text-[#0B2345] prose-strong:font-bold
                prose-a:text-[#0B5FFF] prose-a:font-bold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 prose-a:bg-[#EFF6FF] prose-a:px-1 prose-a:py-0.5 prose-a:rounded hover:prose-a:text-white hover:prose-a:bg-[#0B5FFF] focus-within:prose-a:outline-2"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            {/* End of Document Seal */}
            <div className="mt-12 pt-8 border-t-2 border-[#D9DEE7] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8FAFC] p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B2345] text-white flex items-center justify-center font-bold text-sm">
                  OP
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#0B2345] uppercase tracking-wider">
                    O PATRIOTA — REGISTRO EDITORIAL
                  </h4>
                  <p className="text-[11px] text-[#5D6673]">
                    Publicação oficial em conformidade com as leis federais de imprensa e proteção de dados.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs text-[#0B5FFF] hover:text-[#0B2345] font-semibold underline cursor-pointer shrink-0"
              >
                Voltar ao topo ↑
              </button>
            </div>

          </main>

        </div>
      </div>
    </article>
  );
};
