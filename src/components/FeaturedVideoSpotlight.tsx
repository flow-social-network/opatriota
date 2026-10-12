import React, { useState } from 'react';
import { 
  Video, 
  Share2, 
  MessageSquare, 
  ArrowRight, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Scale
} from 'lucide-react';
import type { Article } from '../types';

interface FeaturedVideoSpotlightProps {
  onSelectArticle: (article: Article) => void;
  article?: Article;
}

export const FeaturedVideoSpotlight: React.FC<FeaturedVideoSpotlightProps> = ({
  onSelectArticle,
  article
}) => {
  const [copied, setCopied] = useState(false);

  const videoUrl = "https://www.youtube.com/embed/IACLb9V3d6U";
  const videoTitle = "PROTESTAR É DIREITO, VANDALISMO NÃO!";

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = article ? `${window.location.origin}/noticia/${article.slug}` : 'https://www.youtube.com/watch?v=IACLb9V3d6U';
    if (navigator.share) {
      navigator.share({
        title: videoTitle,
        text: 'A liberdade de manifestação é um direito fundamental. Mas destruir o patrimônio público não pode ser tratado como algo normal.',
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleGoToArticle = () => {
    if (article) {
      onSelectArticle(article);
    }
  };

  return (
    <section 
      className="mb-12 select-none bg-gradient-to-br from-[#071322] via-[#0B2345] to-[#0A1A30] rounded-xl text-white p-5 sm:p-7 shadow-lg border border-[#163660] relative overflow-hidden"
      aria-label="Vídeo em Destaque na Home"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFCC29]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/15 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#DC2626] flex items-center justify-center text-white shadow-xs">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#FFCC29]">
                EDITORIAL EM VÍDEO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
              <span className="text-[10px] text-white/70 font-mono">DESTAQUE EXCLUSIVO</span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-black text-white tracking-tight">
              Análise Multimídia O Patriota
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition border border-white/15 cursor-pointer"
            title="Compartilhar vídeo e editorial"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#48BB78]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link copiado!' : 'Compartilhar'}</span>
          </button>
          {article && (
            <button
              onClick={handleGoToArticle}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <span>Ler Matéria</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Video Embed (left) + Editorial Text (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
        {/* Left Column: 16:9 Video Embed */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black shadow-2xl border border-white/20 group">
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title={videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/70 mt-3 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#16803C]" />
              <span className="font-semibold text-white/90">Transmissão Oficial</span>
              <span>•</span>
              <span>O Patriota Brasil no YouTube</span>
            </div>
            <a 
              href="https://www.youtube.com/watch?v=IACLb9V3d6U" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#FFCC29] transition flex items-center gap-1 font-medium"
            >
              <span>Abrir no YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Column: Editorial Manifesto & Call to Action */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#FF8585] text-[10px] font-bold uppercase tracking-wider mb-2.5">
              <Scale className="w-3 h-3" />
              <span>Posicionamento Editorial</span>
            </div>

            <h3 
              onClick={handleGoToArticle}
              className="font-serif text-xl sm:text-2xl font-black text-white hover:text-[#FFCC29] transition-colors leading-snug cursor-pointer mb-3"
            >
              {videoTitle}
            </h3>

            {/* Editorial Body Text */}
            <div className="space-y-3 text-xs sm:text-sm text-white/90 leading-relaxed font-normal border-l-2 border-[#FFCC29] pl-3.5 bg-white/5 py-3 pr-3 rounded-r">
              <p className="font-semibold text-white">
                🇧🇷 A liberdade de manifestação é um direito fundamental. Mas destruir o patrimônio público não pode ser tratado como algo normal.
              </p>
              
              <p className="text-white/80 text-xs leading-relaxed">
                Após o ato pró-Lula na Avenida Paulista, a Polícia Militar relatou tumulto, pichações e depredação durante a dispersão dos manifestantes. O Metrô, por sua vez, afirmou não ter registros internos de danos nas estações da região.
              </p>

              <p className="text-white/80 text-xs leading-relaxed">
                Diante das versões divergentes, cobramos transparência, investigação e esclarecimentos. Se houve danos, os responsáveis devem ser identificados e responder por seus atos, conforme a lei.
              </p>

              <div className="pt-1 text-xs text-[#FFCC29] font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Nossa posição é clara: responsabilidade individual, provas e o mesmo critério para todos os campos políticos.</span>
              </div>
            </div>
          </div>

          {/* Interactive Question & Comments Box */}
          <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FFCC29]/20 text-[#FFCC29] flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs text-white font-medium leading-snug">
                  💬 Você concorda que o patrimônio público deve ser respeitado independentemente de quem organiza a manifestação?
                </p>
                <p className="text-[11px] text-[#FFCC29] mt-0.5">
                  Deixe sua opinião e participe do debate da comunidade!
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {article && (
                <button
                  onClick={handleGoToArticle}
                  className="flex-1 bg-[#16803C] hover:bg-[#22A447] text-white font-bold text-xs py-2 px-3 rounded transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Acessar Notícia & Comentar</span>
                </button>
              )}
            </div>
          </div>

          {/* Hashtags Footer */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'OPatriota',
              'Editorial',
              'LiberdadeDeManifestação',
              'Vandalismo',
              'PatrimônioPúblico',
              'PolíticaBrasileira',
              'Justiça',
              'Brasil'
            ].map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-white/70 bg-white/10 hover:bg-white/20 transition px-2 py-0.5 rounded cursor-default font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
