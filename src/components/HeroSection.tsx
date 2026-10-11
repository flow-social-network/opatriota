import React, { useState } from 'react';
import { Article } from '../types';
import { ArticleImage } from './ArticleImage';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MessageSquare, 
  Clock, 
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

  // Lead political and featured articles for carousel
  const carouselArticles = articles.filter(
    (a) => a.category === 'politica' || a.category === 'brasil' || a.priority === 'alta'
  ).slice(0, 4);

  const currentLead = carouselArticles[activeSlide] || articles[0];

  // Real-time breaking news items
  const breakingNews = [
    { time: '14:32', title: 'Congresso analisa pacote para reduzir custo do trabalho e gerar empregos', slug: 'congresso-avanca-em-propostas-para-gerar-empregos-e-reduzir-o-custo-do-trabalho' },
    { time: '13:15', title: 'Flávio Bolsonaro participa de encontro com lideranças no Rio Grande do Sul', slug: 'art-rs-1' },
    { time: '12:48', title: 'Dólar fecha em queda e bolsa tem alta com expectativa de reformas', slug: 'mercado-reage-positivamente-a-novas-medidas-economicas' },
    { time: '11:05', title: 'STF retoma julgamentos de temas econômicos relevantes', slug: 'congresso-avanca-em-propostas-para-gerar-empregos-e-reduzir-o-custo-do-trabalho' },
    { time: '10:44', title: 'Ministério da Saúde amplia atendimento no SUS em regiões Norte e Nordeste', slug: 'art-4' },
    { time: '09:21', title: 'Câmara aprova marco de energia renovável', slug: 'art-2' },
  ];

  // Featured videos list matching reference design
  const featuredVideo = {
    title: 'Flávio Bolsonaro fala sobre segurança e desenvolvimento no Sul',
    duration: '4:15',
    channel: 'O Patriota Brasil',
    views: '12 mil visualizações',
    timeAgo: '2 dias atrás',
    thumbnail: '/images/hero_congresso.jpg',
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
        
        {/* COLUMN 1: Main Visual Lead Carousel (~45% / 5.5 cols -> lg:col-span-5 xl:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col">
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

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Slide anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

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

                {/* Carousel indicator dots */}
                <div className="flex items-center gap-1.5">
                  {carouselArticles.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                      aria-label={`Ir para slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeSlide ? 'w-5 bg-[#FFCC29]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Últimas Notícias (~27% / 3 cols -> lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-white border border-[#D9DEE7] rounded-lg p-4 flex-1 flex flex-col justify-between shadow-2xs">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#0B2345]">
                <h2 className="font-serif text-base font-black text-[#0B2345] tracking-tight">
                  Últimas Notícias
                </h2>
                <button
                  onClick={() => onNavigateCategory && onNavigateCategory('todos')}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B5FFF] hover:text-[#0B2345] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>VER TODAS</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Timestamped List */}
              <ul className="space-y-3.5 text-xs divide-y divide-[#F1F3F5]">
                {breakingNews.map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => {
                      const found = articles.find(a => a.slug === item.slug) || articles[idx % articles.length];
                      if (found) onSelectArticle(found);
                    }}
                    className={`group cursor-pointer flex items-start gap-2.5 ${idx > 0 ? 'pt-3' : ''}`}
                  >
                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                      <span className="font-bold text-[#DC2626] text-[11px] font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[#17202A] group-hover:text-[#0B5FFF] transition-colors leading-snug font-medium line-clamp-2">
                      {item.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom link */}
            <div className="pt-3 border-t border-[#F1F3F5] text-center">
              <button
                onClick={() => onNavigateCategory && onNavigateCategory('todos')}
                className="text-xs font-bold text-[#0B5FFF] hover:underline cursor-pointer"
              >
                Ver mais notícias →
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Vídeos em Destaque (~28% / 3 cols -> lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col">
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
              <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-black mb-3 group cursor-pointer border border-[#D9DEE7]">
                <ArticleImage
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-black/60 group-hover:bg-[#DC2626] text-white flex items-center justify-center transition-all shadow-md group-hover:scale-110">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {featuredVideo.duration}
                </span>
              </div>

              <h3 className="font-serif text-xs font-bold text-[#0B2345] leading-snug mb-1 hover:text-[#0B5FFF] transition-colors cursor-pointer line-clamp-2">
                {featuredVideo.title}
              </h3>
              <p className="text-[10px] text-[#5D6673] mb-3">
                {featuredVideo.channel} • {featuredVideo.views} • {featuredVideo.timeAgo}
              </p>

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
