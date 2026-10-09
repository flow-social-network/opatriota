import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigateHome: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigateHome }) => {
  return (
    <nav aria-label="Navegação estrutural" className="py-2.5 text-xs text-[#5D6673] flex items-center flex-wrap gap-1.5 select-none">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-[#0B2345] transition cursor-pointer font-medium"
        title="Voltar para a página inicial"
      >
        <Home className="w-3.5 h-3.5 text-[#0B2345]" />
        <span>Início</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-[#A0AAB8]" />
            {isLast || !item.onClick ? (
              <span className={`font-semibold ${isLast ? 'text-[#0B2345] truncate max-w-[280px] md:max-w-md' : 'text-[#5D6673]'}`}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-[#0B2345] transition cursor-pointer font-medium"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
