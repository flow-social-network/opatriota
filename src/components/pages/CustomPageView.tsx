import React from 'react';
import { InstitutionalPage } from '../../types';
import { Breadcrumbs } from './Breadcrumbs';
import { ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

interface CustomPageViewProps {
  page: InstitutionalPage;
  onNavigateHome: () => void;
  onNavigatePage: (slug: string) => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({
  page,
  onNavigateHome,
  onNavigatePage
}) => {
  return (
    <article className="min-h-screen bg-[#F7F8FA] pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-[#D9DEE7] py-2.5">
        <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between">
          <Breadcrumbs
            onNavigateHome={onNavigateHome}
            items={[
              { label: 'Páginas' },
              { label: page.title }
            ]}
          />
          <span className="text-xs text-[#5D6673]">
            Atualizado: {page.updatedAt}
          </span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 pt-8">
        {/* Header */}
        <header className="bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-10 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#0B2345] text-white text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
              {page.badge || 'PÁGINA OFICIAL'}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#0B2345] mb-3">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-base text-[#5D6673] leading-relaxed max-w-3xl">
              {page.subtitle}
            </p>
          )}
        </header>

        {/* Content Body */}
        <main className="bg-white border border-[#D9DEE7] rounded-lg p-6 md:p-10 shadow-xs">
          {page.featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden border border-[#EAECEF]">
              <img
                src={page.featuredImage}
                alt={page.title}
                className="w-full h-72 md:h-96 object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-slate max-w-none
              prose-headings:font-serif prose-headings:text-[#0B2345] 
              prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3
              prose-p:text-sm prose-p:text-[#2D3748] prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-[#0B2345]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </main>
      </div>
    </article>
  );
};
