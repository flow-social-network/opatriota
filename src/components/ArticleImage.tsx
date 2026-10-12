import React, { useState } from 'react';

interface ArticleImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ 
  src, 
  fallbackSrc, 
  alt, 
  className = '', 
  fallbackClassName = '' 
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  // If prop changes, reset
  React.useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setFailed(true);
    }
  };

  if (failed || !currentSrc) {
    return (
      <div 
        role="img" 
        aria-label={`${alt} — imagem indisponível`} 
        className={`flex items-center justify-center bg-[#0B2345] text-center text-xs font-semibold text-white/80 ${fallbackClassName || className}`}
      >
        <span>Imagem indisponível</span>
      </div>
    );
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className} 
      onError={handleError} 
    />
  );
};
