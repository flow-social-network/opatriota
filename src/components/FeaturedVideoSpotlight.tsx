import React, { useState } from 'react';
import { Video, Share2, ArrowRight, Check, ExternalLink } from 'lucide-react';
import type { Article } from '../types';

interface FeaturedVideoSpotlightProps {
  onSelectArticle: (article: Article) => void;
  article?: Article;
}

function getSafeEmbedUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    const validHost = ['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'player.vimeo.com'].includes(host);
    const validPath = host === 'player.vimeo.com' ? /^\/video\//.test(url.pathname) : /^\/embed\//.test(url.pathname);
    return validHost && validPath ? url.toString() : null;
  } catch {
    return null;
  }
}

export const FeaturedVideoSpotlight: React.FC<FeaturedVideoSpotlightProps> = ({
  onSelectArticle,
  article,
}) => {
  const [copied, setCopied] = useState(false);
  const videoUrl = getSafeEmbedUrl(article?.videoEmbedUrl);

  if (!article || !videoUrl) return null;

  const articleUrl = `${window.location.origin}/noticia/${encodeURIComponent(article.slug)}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.subtitle || article.title,
          url: articleUrl,
        });
      } else {
        await navigator.clipboard.writeText(articleUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Não foi possível compartilhar a matéria em vídeo.', error);
    }
  };

  return (
    <section
      className="relative mb-12 overflow-hidden rounded-xl border border-[#163660] bg-gradient-to-br from-[#071322] via-[#0B2345] to-[#0A1A30] p-5 text-white shadow-lg sm:p-7"
      aria-label="Vídeo em destaque"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#FFCC29]/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#DC2626]/10 blur-3xl" />

      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DC2626] text-white">
            <Video className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FFCC29]">Editorial em vídeo</p>
            <h2 className="font-serif text-lg font-black tracking-tight sm:text-xl">{article.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex items-center gap-1.5 rounded border border-white/15 bg-white/10 px-3 py-1.5 font-medium text-white transition hover:bg-white/20"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#48BB78]" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? 'Link copiado' : 'Compartilhar matéria'}</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectArticle(article)}
            className="flex items-center gap-1.5 rounded bg-[#DC2626] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#B91C1C]"
          >
            Ler matéria <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col lg:col-span-7">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/20 bg-black shadow-2xl">
            <iframe
              className="h-full w-full"
              src={videoUrl}
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 px-1 text-[11px] text-white/70">
            <span>{article.sourceName ? `Fonte: ${article.sourceName}` : 'O Patriota Brasil'}</span>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-medium hover:text-[#FFCC29]">
              Abrir vídeo <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <span className="inline-flex rounded border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            {article.kicker || article.category}
          </span>
          {article.subtitle && <p className="text-sm leading-relaxed text-white/90">{article.subtitle}</p>}
          <div className="border-l-2 border-[#FFCC29] bg-white/5 py-3 pl-3.5 pr-3 text-xs leading-relaxed text-white/80">
            <p>Leia a matéria completa para consultar o contexto, as informações publicadas e as fontes identificadas pela redação.</p>
          </div>
          <button type="button" onClick={() => onSelectArticle(article)} className="text-sm font-bold text-[#FFCC29] hover:underline">
            Abrir a matéria completa →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVideoSpotlight;
