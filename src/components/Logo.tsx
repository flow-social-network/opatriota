import React from 'react';
import { SiteIdentityConfig } from '../types';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'compact' | 'icon' | 'footer';
  identityConfig?: SiteIdentityConfig;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'full',
  identityConfig
}) => {
  // 1. FOOTER VARIANT (Tailored for dark blue #07172E background)
  if (variant === 'footer') {
    // Custom image for footer
    if (identityConfig?.footerLogoType === 'custom_image' && identityConfig.footerLogoUrl) {
      return (
        <div className={`flex flex-col items-start ${className}`}>
          <img
            src={identityConfig.footerLogoUrl}
            alt={identityConfig.footerLogoAlt || 'O Patriota Brasil'}
            style={{ maxWidth: `${identityConfig.footerLogoWidth || 280}px` }}
            className="h-auto object-contain mb-2"
          />
          <p className="text-[10px] text-[#FFCC29] font-bold uppercase tracking-widest">
            {identityConfig.slogan || 'INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE'}
          </p>
        </div>
      );
    }

    // Reuse header custom image if selected
    if (
      identityConfig?.footerLogoType === 'same_as_header' && 
      identityConfig.headerLogoType === 'custom_image' && 
      identityConfig.headerLogoUrl
    ) {
      return (
        <div className={`flex flex-col items-start ${className}`}>
          <img
            src={identityConfig.headerLogoUrl}
            alt={identityConfig.footerLogoAlt || 'O Patriota Brasil'}
            style={{ maxWidth: `${identityConfig.footerLogoWidth || 280}px` }}
            className="h-auto object-contain mb-2"
          />
          <p className="text-[10px] text-[#FFCC29] font-bold uppercase tracking-widest">
            {identityConfig.slogan || 'INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE'}
          </p>
        </div>
      );
    }

    // Default SVG / Vector for dark footer
    return (
      <div className={`flex flex-col items-start text-left select-none ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          {/* Circular mini emblem */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B3B7B] to-[#07172E] p-1 border border-[#FFCC29] shadow-sm flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              <circle cx="50" cy="50" r="42" fill="#0B3B7B" />
              <polygon points="50,18 80,50 50,82 20,50" fill="#FFCC29" />
              <circle cx="50" cy="50" r="18" fill="#07172E" />
              <path d="M35 50 Q 50 44 65 50" stroke="#FFFFFF" strokeWidth="3" fill="none" />
              <circle cx="48" cy="53" r="1.5" fill="#FFFFFF" />
              <circle cx="53" cy="48" r="1.2" fill="#FFFFFF" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-2xl md:text-3xl font-black text-white tracking-wide block leading-none">
              O PATRIOTA
            </span>
            <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#FFCC29] block mt-0.5">
              BRASIL
            </span>
          </div>
        </div>

        <p className="text-[10px] text-[#FFCC29] font-bold tracking-widest uppercase mt-1 leading-snug">
          {identityConfig?.slogan || 'INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE'}
        </p>
      </div>
    );
  }

  // 2. ICON ONLY VARIANT
  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#0B3B7B] to-[#07172E] p-2 shadow-md border border-[#2563EB]/40 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="38" fill="#0B3B7B" stroke="#FFCC29" strokeWidth="2" />
          <path d="M12 50 Q 50 15 88 50 Q 50 85 12 50" fill="#16803C" opacity="0.85" />
          <polygon points="50,22 78,50 50,78 22,50" fill="#FFCC29" />
          <circle cx="50" cy="50" r="16" fill="#0B2345" />
          <path d="M36 50 Q 50 44 64 50" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          <text x="50" y="66" textAnchor="middle" fill="#FFFFFF" fontFamily="Georgia, serif" fontSize="56" fontWeight="bold" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
            O
          </text>
        </svg>
      </div>
    );
  }

  // 3. HEADER CUSTOM IMAGE (if configured)
  if (identityConfig?.headerLogoType === 'custom_image' && identityConfig.headerLogoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <img
          src={identityConfig.headerLogoUrl}
          alt={identityConfig.headerLogoAlt || 'O Patriota'}
          style={{ maxWidth: `${identityConfig.headerLogoWidth || 320}px` }}
          className="h-auto object-contain mb-2"
        />
        <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#5D6673] mb-1.5">
          {identityConfig.slogan || 'INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE'}
        </p>
        <div className="w-28 sm:w-36 h-1 flex rounded-full overflow-hidden shadow-xs">
          <div className="flex-1 bg-[#16803C]" />
          <div className="flex-1 bg-[#FFCC29]" />
          <div className="flex-1 bg-[#0B5FFF]" />
        </div>
      </div>
    );
  }

  // 4. FULL OFFICIAL VECTOR EMBLEM (Standard)
  const sloganText = identityConfig?.slogan || 'INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE';

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Painted Brush Flag Emblem */}
      <div className="relative w-64 md:w-80 h-14 md:h-16 flex items-center justify-center mb-1">
        <svg viewBox="0 0 320 80" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="flagGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16803C" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#16803C" />
              <stop offset="75%" stopColor="#16803C" />
              <stop offset="100%" stopColor="#16803C" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="flagYellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCC29" stopOpacity="0" />
              <stop offset="30%" stopColor="#FFCC29" />
              <stop offset="70%" stopColor="#FFCC29" />
              <stop offset="100%" stopColor="#FFCC29" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Green brush arc stroke */}
          <path
            d="M 20,48 C 80,10 240,10 300,48 C 260,20 60,20 20,48 Z"
            fill="url(#flagGreen)"
          />
          <path
            d="M 50,44 C 110,18 210,18 270,44 C 230,26 90,26 50,44 Z"
            fill="#16803C"
          />
          {/* Yellow brush stroke */}
          <path
            d="M 40,52 C 100,28 220,28 280,52 C 230,36 90,36 40,52 Z"
            fill="url(#flagYellow)"
          />
          {/* Brazil globe center */}
          <g transform="translate(160, 36)">
            {/* Celestial sphere */}
            <circle cx="0" cy="0" r="16" fill="#0B2345" stroke="#FFFFFF" strokeWidth="1" />
            {/* Ordem e Progresso white band */}
            <path d="M -15,1 Q 0,-6 15,1" stroke="#FFFFFF" strokeWidth="2.8" fill="none" />
            <text x="0" y="-1" textAnchor="middle" fill="#16803C" fontSize="3.2" fontWeight="bold" letterSpacing="0.4">
              ORDEM E PROGRESSO
            </text>
            {/* Stars */}
            <circle cx="-5" cy="5" r="0.8" fill="#FFFFFF" />
            <circle cx="0" cy="8" r="0.9" fill="#FFFFFF" />
            <circle cx="6" cy="4" r="0.7" fill="#FFFFFF" />
            <circle cx="-2" cy="-8" r="0.6" fill="#FFFFFF" />
            <circle cx="8" cy="9" r="0.6" fill="#FFFFFF" />
            <circle cx="-8" cy="8" r="0.6" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* Brand Title: O PATRIOTA */}
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0B2345] leading-none mb-2 drop-shadow-sm">
        O PATRIOTA
      </h1>

      {/* Sub-slogan: NOTÍCIA • ANÁLISE • OPINIÃO • BRASIL • SEMPRE */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#0B2345] mb-2 border-t border-b border-[#D9DEE7] py-1.5 w-full max-w-xl">
        <span>NOTÍCIA</span>
        <span className="text-[#FFCC29] text-sm">•</span>
        <span>ANÁLISE</span>
        <span className="text-[#FFCC29] text-sm">•</span>
        <span>OPINIÃO</span>
        <span className="text-[#FFCC29] text-sm">•</span>
        <span>BRASIL</span>
        <span className="text-[#FFCC29] text-sm">•</span>
        <span>SEMPRE</span>
      </div>

      {/* Main Slogan: INFORMAÇÃO COM LIBERDADE POR UM BRASIL MAIS FORTE. */}
      <p className="text-[9px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#5D6673] mb-1.5">
        {sloganText}
      </p>

      {/* Brazilian Flag Color Bar */}
      <div className="w-28 sm:w-36 h-1 flex rounded-full overflow-hidden shadow-xs">
        <div className="flex-1 bg-[#16803C]" />
        <div className="flex-1 bg-[#FFCC29]" />
        <div className="flex-1 bg-[#0B5FFF]" />
      </div>
    </div>
  );
};

