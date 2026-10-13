import React, { useState } from 'react';
import { Article } from '../types';
import { ArticleImage } from './ArticleImage';
import { 
  Play, 
  Calendar, 
  MessageSquare,
  Video,
  ArrowRight 
} from 'lucide-react';

interface HeroSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigateCategory?: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  onSelectArticle,
  onNavigateCategory,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlayingFeaturedVideo, setIsPlayingFeaturedVideo] = useState(false);

  // Lead political and featured articles for carousel
  const carouselArticles = articles.filter(
    (a) => a.category === 'politica' || a.category === 'brasil' || a.priority === 'alta'
  ).slice(0, 4);

  const currentLead = carouselArticles[activeSlide] || articles[0];

  // Featured videos list matching reference design
  const featuredVideo = {
    title: 'PROTESTAR É DIREITO, VANDALISMO NÃO!',
    duration: 'Editorial Oficial',
    channel: 'O Patriota Brasil',
    views: 'Em Destaque',
    timeAgo: 'Hoje',
    thumbnail: 'https://img.youtube.com/vi/IACLb9V3d6U/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/IACLb9V3d6U',
    slug: 'protestar-e-direito-vandalismo-nao',
  };

  const sideVideos = [
    {
      id: 'v-1',
      title: 'Carreata de apoio a Flávio Bolsonaro reúne milhares no Rio Grande do Sul',
      duration: '3:42',
      views: '8,4 mil visualizações',
      timeAgo: '3 dias atrás',
      thumbnail: '/images/news_seguranca.jpg',
    },
    {
      id: 'v-2',
      title: 'Entrevista exclusiva: Flávio Bolsonaro analisa cenário político',
      duration: '5:20',
      views: '6,2 mil visualizações',
      timeAgo: '4 dias atrás',
      thumbnail: '/images/news_opiniao.jpg',
    },
    {
      id: 'v-3',
      title: 'O agronegócio e o futuro do Brasil',
      duration: '6:10',
      views: '4,8 mil visualizações',
      timeAgo: '4 dias atrás',
      thumbnail: '/images/news_infraestrutura.jpg',
    },
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === 0 ? carouselArticles.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev === carouselArticles.length - 1 ? 0 : prev + 1));
  };

  if (!currentLead) return null;

  return (
    <section className="mb-10 select-none" aria-label="Destaques Principais">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Destaque visual principal ocupa o espaço liberado pela coluna duplicada de últimas notícias. */}
        <div className="lg:col-span-8 flex flex-col">
          <div 
            onClick={() => onSelectArticle(currentLead)}
            className="relative group overflow-hidden rounded-lg border border-[#D9DEE7] bg-[#0B2345] cursor-pointer shadow-sm flex-1 min-h-[420px] xl:min-h-[460px] flex flex-col justify-end"
          >
            {/* Background Article Image */}
            <ArticleImage
              src={currentLead.imageUrl}
              alt={currentLead.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07172E] via-[#07172E]/60 to-transparent" />



            {/* Content Overlay at Bottom */}
            <div className="relative z-10 p-5 sm:p-6 text-white">
              {/* Category Badge */}
              <div className="mb-3">
                <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded shadow-xs">
                  {currentLead.kicker || 'POLÍTICA'}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl xl:text-3xl font-bold leading-snug mb-2 text-white group-hover:text-[#FFCC29] transition-colors">
                {currentLead.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2 mb-4 font-normal">
                {currentLead.subtitle}
              </p>

              {/* Meta: Date & Comments & Carousel Dots */}
              <div className="flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/20">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-white/60" />
                    8 de outubro de 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-white/60" />
                    120 comentários
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Vídeos em destaque ocupam a coluna lateral restante. */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white border border-[#D9DEE7] rounded-lg p-4 flex-1 flex flex-col justify-between shadow-2xs">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#DC2626]">
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#DC2626]" />
                  <h2 className="font-serif text-base font-black text-[#0B2345] tracking-tight">
                    Vídeos em destaque
                  </h2>
                </div>
                <button
                  onClick={() => onNavigateCategory && onNavigateCategory('todos')}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B5FFF] hover:text-[#0B2345] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>VER TODOS</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Main Video Box */}
              <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-black mb-3 border border-[#D9DEE7] shadow-xs">
                {isPlayingFeaturedVideo ? (
                  <iframe
                    src={`${featuredVideo.embedUrl}?autoplay=1`}
                    title={featuredVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div
                    onClick={() => setIsPlayingFeaturedVideo(true)}
                    className="relative w-full h-full group cursor-pointer"
                  >
                    <ArticleImage
                      src={featuredVideo.thumbnail}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-[#DC2626] text-white flex items-center justify-center transition-all shadow-lg group-hover:scale-110">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                    {/* Duration Badge */}
                    <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {featuredVideo.duration}
                    </span>
                    <span className="absolute top-2 left-2 bg-[#DC2626] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      VÍDEO EM DESTAQUE
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  onClick={() => {
                    const videoArticle = articles.find(a => a.slug === featuredVideo.slug);
                    if (videoArticle) onSelectArticle(videoArticle);
                  }}
                  className="font-serif text-xs font-bold text-[#0B2345] leading-snug hover:text-[#0B5FFF] transition-colors cursor-pointer line-clamp-2"
                >
                  {featuredVideo.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#5D6673] mb-2.5">
                <span>{featuredVideo.channel} • {featuredVideo.timeAgo}</span>
                <button
                  onClick={() => {
                    const videoArticle = articles.find(a => a.slug === featuredVideo.slug);
                    if (videoArticle) onSelectArticle(videoArticle);
                  }}
                  className="text-[#0B5FFF] font-bold hover:underline cursor-pointer"
                >
                  Ler matéria →
                </button>
              </div>

              {/* Secondary Video Thumbnails */}
              <div className="space-y-2.5 pt-2 border-t border-[#F1F3F5]">
                {sideVideos.map((video) => (
                  <div key={video.id} className="flex gap-2.5 items-start group cursor-pointer">
                    <div className="relative w-20 aspect-[16/9] rounded overflow-hidden bg-black shrink-0 border border-[#D9DEE7]">
                      <ArticleImage
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-bold px-1 py-0.2 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-[11px] font-bold text-[#0B2345] leading-tight line-clamp-2 group-hover:text-[#0B5FFF] transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[9px] text-[#5D6673] mt-0.5">
                        {video.views} • {video.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
