import React, { useState } from 'react';
import { Article } from '../types';
import { ArticleImage } from './ArticleImage';
import { Play, ChevronLeft, ChevronRight, Calendar, ArrowRight, Video } from 'lucide-react';

interface HeroSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigateCategory?: (category: string) => void;
}

function formatPublishedDate(value: string | undefined): string {
  if (!value) return 'Data não informada';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Data não informada' : date.toLocaleDateString('pt-BR');
}

function formatPublishedTime(value: string | undefined): string {
  if (!value) return '—:—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—:—'
    : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function safeVideoEmbedUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    const allowedHost = host === 'youtube.com' || host === 'www.youtube.com' ||
      host === 'youtube-nocookie.com' || host === 'www.youtube-nocookie.com' ||
      host === 'player.vimeo.com';
    if (!allowedHost || !/^\/(embed|video)\//.test(url.pathname) && host !== 'player.vimeo.com') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  onSelectArticle,
  onNavigateCategory,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const preferredLeads = articles.filter(
    (article) => ['politica', 'brasil'].includes(article.category) || article.priority === 'alta',
  );
  const carouselArticles = (preferredLeads.length ? preferredLeads : articles).slice(0, 4);
  const currentLead = carouselArticles[activeSlide] || carouselArticles[0];
  const latestArticles = [...articles]
    .sort((a, b) => {
      const dateA = Date.parse(a.publishedAt || '');
      const dateB = Date.parse(b.publishedAt || '');
      return (Number.isFinite(dateB) ? dateB : 0) - (Number.isFinite(dateA) ? dateA : 0);
    })
    .filter((article) => article.id !== currentLead?.id)
    .slice(0, 6);
  const videoArticles = articles
    .filter((article) => Boolean(article.videoEmbedUrl) || ['videos', 'podcast'].includes(article.category))
    .slice(0, 4);
  const featuredVideo = videoArticles[0];
  const featuredEmbedUrl = safeVideoEmbedUrl(featuredVideo?.videoEmbedUrl);

  const changeSlide = (direction: -1 | 1) => {
    if (carouselArticles.length < 2) return;
    setActiveSlide((current) => (current + direction + carouselArticles.length) % carouselArticles.length);
  };

  if (!currentLead) {
    return (
      <section className="mb-10 rounded-lg border border-dashed border-[#D9DEE7] bg-white p-8 text-center" aria-label="Destaques principais">
        <h1 className="font-serif text-xl font-bold text-[#0B2345]">O Patriota Brasil</h1>
        <p className="mt-2 text-sm text-[#5D6673]">Nenhuma matéria publicada no momento.</p>
      </section>
    );
  }

  return (
    <section className="mb-10" aria-label="Destaques principais">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col lg:col-span-6">
          <button
            type="button"
            onClick={() => onSelectArticle(currentLead)}
            className="group relative flex min-h-[360px] flex-1 flex-col justify-end overflow-hidden rounded-lg border border-[#D9DEE7] bg-[#0B2345] text-left shadow-sm sm:min-h-[420px] xl:min-h-[460px]"
            aria-label={`Ler matéria: ${currentLead.title}`}
          >
            <ArticleImage
              src={currentLead.imageUrl}
              alt={currentLead.title}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07172E] via-[#07172E]/60 to-transparent" />
            <div className="relative z-10 p-5 text-white sm:p-6">
              <span className="mb-3 inline-flex rounded bg-[#DC2626] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                {currentLead.kicker || currentLead.category}
              </span>
              <h1 className="mb-2 font-serif text-2xl font-bold leading-snug text-white transition-colors group-hover:text-[#FFCC29] sm:text-3xl">
                {currentLead.title}
              </h1>
              {currentLead.subtitle && (
                <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-white/85 sm:text-sm">{currentLead.subtitle}</p>
              )}
              <div className="flex items-center justify-between border-t border-white/20 pt-3 text-[11px] text-white/75">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatPublishedDate(currentLead.publishedAt)}
                </span>
                {carouselArticles.length > 1 && (
                  <span className="flex items-center gap-2">
                    <span>{activeSlide + 1}/{carouselArticles.length}</span>
                    <span className="flex gap-1">
                      <span
                        role="presentation"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/40"
                        onClick={(event) => { event.stopPropagation(); changeSlide(-1); }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </span>
                      <span
                        role="presentation"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/40"
                        onClick={(event) => { event.stopPropagation(); changeSlide(1); }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </span>
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>

        <div className="flex min-w-0 flex-col lg:col-span-3">
          <div className="flex-1 rounded-lg border border-[#D9DEE7] bg-white p-4 shadow-2xs">
            <div className="mb-3 flex items-center justify-between border-b-2 border-[#0B2345] pb-3">
              <h2 className="font-serif text-base font-black tracking-tight text-[#0B2345]">Últimas notícias</h2>
              {onNavigateCategory && (
                <button type="button" onClick={() => onNavigateCategory('todos')} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#0B5FFF]">
                  Ver todas <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            {latestArticles.length === 0 ? (
              <p className="py-4 text-xs text-[#5D6673]" role="status">Não há outras matérias publicadas.</p>
            ) : (
              <ul className="divide-y divide-[#F1F3F5]">
                {latestArticles.map((article) => (
                  <li key={article.id} className="py-3 first:pt-0 last:pb-0">
                    <button type="button" onClick={() => onSelectArticle(article)} className="group flex w-full items-start gap-2.5 text-left">
                      <span className="shrink-0 pt-0.5 font-mono text-[10px] font-bold text-[#DC2626]">{formatPublishedTime(article.publishedAt)}</span>
                      <span className="line-clamp-3 text-xs font-medium leading-snug text-[#17202A] group-hover:text-[#0B5FFF]">{article.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col lg:col-span-3">
          <div className="flex-1 rounded-lg border border-[#D9DEE7] bg-white p-4 shadow-2xs">
            <div className="mb-3 flex items-center gap-1.5 border-b-2 border-[#DC2626] pb-3">
              <Video className="h-4 w-4 text-[#DC2626]" aria-hidden="true" />
              <h2 className="font-serif text-base font-black tracking-tight text-[#0B2345]">Vídeos em destaque</h2>
            </div>
            {!featuredVideo ? (
              <p className="py-4 text-xs text-[#5D6673]" role="status">Nenhum vídeo publicado no momento.</p>
            ) : (
              <>
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded border border-[#D9DEE7] bg-black">
                  {playingVideoId === featuredVideo.id && featuredEmbedUrl ? (
                    <iframe
                      src={featuredEmbedUrl}
                      title={featuredVideo.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <button type="button" onClick={() => featuredEmbedUrl ? setPlayingVideoId(featuredVideo.id) : onSelectArticle(featuredVideo)} className="group relative h-full w-full">
                      <ArticleImage src={featuredVideo.imageUrl} alt={featuredVideo.title} className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DC2626] text-white shadow-lg">
                          <Play className="ml-0.5 h-6 w-6 fill-white" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => onSelectArticle(featuredVideo)} className="text-left font-serif text-sm font-bold leading-snug text-[#0B2345] hover:text-[#0B5FFF]">
                  {featuredVideo.title}
                </button>
                <div className="mt-2 space-y-2 border-t border-[#F1F3F5] pt-2">
                  {videoArticles.slice(1, 4).map((article) => (
                    <button key={article.id} type="button" onClick={() => onSelectArticle(article)} className="flex w-full items-start gap-2.5 text-left text-[11px] font-semibold text-[#0B2345] hover:text-[#0B5FFF]">
                      <ArticleImage src={article.imageUrl} alt="" className="h-12 w-20 shrink-0 rounded object-cover" />
                      <span className="line-clamp-2">{article.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
