import React, { useState } from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ src, alt, className = '', fallbackClassName = '' }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <div role="img" aria-label={`${alt} — imagem indisponível`} className={`flex items-center justify-center bg-[#0B2345] text-center text-xs font-semibold text-white/80 ${fallbackClassName || className}`}><span>Imagem indisponível</span></div>;
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
};
