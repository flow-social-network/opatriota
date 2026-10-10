import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ src, alt, className = '', fallbackClassName = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={`${alt} — imagem indisponível`}
        className={`flex items-center justify-center gap-2 bg-slate-100 text-center text-[11px] font-medium text-slate-500 ${fallbackClassName || className}`}
      >
        <ImageOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Imagem não disponível</span>
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} onError={() => setFailed(true)} />;
};
