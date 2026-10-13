import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  MoreHorizontal 
} from 'lucide-react';

export interface FacebookPostData {
  id: string;
  authorName: string;
  timeAgo: string;
  text: string;
  imageUrl: string;
  likes: string;
  comments: string;
  shares: string;
  postUrl: string;
}

interface FacebookPostsSectionProps {
  posts?: { href: string }[];
}

export const FacebookPostsSection: React.FC<FacebookPostsSectionProps> = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // High-fidelity feed matching reference design and real URLs
  const facebookFeed: FacebookPostData[] = [
    {
      id: 'fb-paulista',
      authorName: 'O Patriota Brasil',
      timeAgo: 'há 1 hora',
      text: 'Polícia e Metrô divergem sobre danos após ato pró-Lula na Avenida Paulista. PM registrou tumulto e depredação na dispersão; Metrô diz não ter registros de danos.',
      imageUrl: 'https://scontent.fpoa13-1.fna.fbcdn.net/v/t39.30808-6/844461567_122099510319508218_8962011006668968197_n.jpg?stp=dst-jpg_tt6&cstp=mx1084x714&ctp=p180x540&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hDk0EMtW1w8Q7kNvwFC6Gmx&_nc_oc=AdqonzhRXaH0YEa_3rh9RgNOglth0gqj4oy_K84Za5Zq4v-y0RRjDXxEzruuj_wn8Y7QS8_6MQh0IvbX5uLI8elu&_nc_zt=23&_nc_ht=scontent.fpoa13-1.fna&_nc_gid=4gd88Wwt0riEFMkkB1x-Og&_nc_ss=7b2a8&oh=00_AQND8s6qsaTfjM1AClRbjITi00yqbfKZw8otE2Uxys0_7Q&oe=6AD2CE25',
      likes: '2,4 mil',
      comments: '580',
      shares: '240',
      postUrl: '/noticia/policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista',
    },
    {
      id: 'fb-1',
      authorName: 'O Patriota Brasil',
      timeAgo: 'há 2 horas',
      text: 'Flávio Bolsonaro segue forte na agenda do Sul. Encontros com lideranças e apoio popular marcam os eventos.',
      imageUrl: '/images/news_seguranca.jpg',
      likes: '1,2 mil',
      comments: '340',
      shares: '120',
      postUrl: posts?.[0]?.href || 'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0ioDvAMSiCPtxaDsJBRg6ya5WRRCSJmFfunhtKuqFQrtD9sWwXDpAbJxWNypWPaLBl',
    },
    {
      id: 'fb-2',
      authorName: 'O Patriota Brasil',
      timeAgo: 'há 5 horas',
      text: 'Câmara avança com novas regras de transparência nos gastos públicos.',
      imageUrl: '/images/hero_congresso.jpg',
      likes: '980',
      comments: '210',
      shares: '87',
      postUrl: posts?.[1]?.href || 'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0Fqt3KAQvb95mAd6wCB4gxi94S8SVpaqPGszcgG7ARV7f5QBcedoA8con1DP47bW9l',
    },
    {
      id: 'fb-3',
      authorName: 'O Patriota Brasil',
      timeAgo: 'há 8 horas',
      text: 'Dólar recua e Bolsa fecha em alta com expectativa de reformas no Brasil.',
      imageUrl: '/images/news_economia.jpg',
      likes: '750',
      comments: '180',
      shares: '64',
      postUrl: posts?.[2]?.href || 'https://www.facebook.com/opatriota.news.brasil/posts/pfbid0GD4saUqCh61z6Dcp6XwvwUdR7Vhpn13Xsx6xjrs64nSU4VMHtrxBS7iHMfKV38eHl',
    },
    {
      id: 'fb-4',
      authorName: 'O Patriota Brasil',
      timeAgo: 'há 12 horas',
      text: 'Brasil amplia acordos comerciais na América do Sul e fortalece parcerias estratégicas.',
      imageUrl: '/images/news_porto.jpg',
      likes: '680',
      comments: '142',
      shares: '51',
      postUrl: posts?.[3]?.href || 'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02rLcGppFvtK6hzDtHQxozL1p8V8Vj8LoH2G4CPH5t4PxcmZgKTCYoBZeoPH8yQ1pLl',
    },
    {
      id: 'fb-5',
      authorName: 'O Patriota Brasil',
      timeAgo: 'há 1 dia',
      text: 'STF retoma julgamentos de temas econômicos e de segurança pública.',
      imageUrl: '/images/news_opiniao.jpg',
      likes: '820',
      comments: '260',
      shares: '80',
      postUrl: posts?.[4]?.href || 'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02h79kw8nw6BN5rbB4HWVWgPLn9sKEQNzdMLZNVNJ5ES4cenmJNTmg39C7ET91kj8ol',
    },
    {
      id: 'fb-6',
      authorName: 'O Patriota Brasil',
      timeAgo: 'há 1 dia',
      text: 'Ministério da Saúde amplia atendimentos e infraestrutura hospitalar.',
      imageUrl: '/images/news_saude.jpg',
      likes: '620',
      comments: '160',
      shares: '48',
      postUrl: posts?.[5]?.href || 'https://www.facebook.com/opatriota.news.brasil/posts/pfbid02T7PkYhr8X3XxQ1viCBrbWTJxR6soiT9arJtfeZkDHvVkAnumjcuE9hHkAKE9otejl',
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? facebookFeed.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= facebookFeed.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="my-8 select-none" aria-label="Publicações do Facebook">
      <div className="bg-white border border-[#D9DEE7] rounded-xl p-4 shadow-2xs">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#F1F3F5]">
          {/* Left: FB Logo + Title + Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-black text-[#0B2345] tracking-tight">
                  O Patriota no Facebook
                </h3>
              </div>
              <p className="text-xs text-[#5D6673]">
                Acompanhe nossas principais publicações
              </p>
            </div>
          </div>

          {/* Right: Link + Arrows */}
          <div className="flex items-center gap-3">
            <a 
              href="https://www.facebook.com/opatriota.news.brasil/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B5FFF] hover:text-[#0B2345] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>VER PÁGINA</span>
              <span className="text-xs">→</span>
            </a>

            <div className="flex items-center gap-1 border-l border-[#D9DEE7] pl-3">
              <button 
                onClick={handlePrev}
                aria-label="Publicação anterior"
                className="w-7 h-7 rounded border border-[#D9DEE7] hover:border-[#0B5FFF] hover:bg-slate-50 flex items-center justify-center text-[#0B2345] transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                aria-label="Próxima publicação"
                className="w-7 h-7 rounded border border-[#D9DEE7] hover:border-[#0B5FFF] hover:bg-slate-50 flex items-center justify-center text-[#0B2345] transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Fila horizontal rotativa para manter a seção compacta e liberar espaço para publicidade abaixo */}
        <div className="flex w-full gap-3.5 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:thin]">
          {facebookFeed.map((post, idx) => (
            <article 
              key={post.id}
              onClick={() => {
                if (post.postUrl.startsWith('/')) {
                  window.location.href = post.postUrl;
                } else {
                  window.open(post.postUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className="w-[min(260px,82vw)] shrink-0 snap-start bg-white border border-[#D9DEE7] rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#1877F2] transition-all duration-300 group cursor-pointer"
            >
              <div>
                {/* Card Header: Avatar + Page Name + Time + Menu */}
                <div className="p-3 pb-2 flex items-center justify-between border-b border-[#F8FAFC]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0B2345] border border-[#CBD5E1] flex items-center justify-center text-white shrink-0 font-bold text-[9px]">
                      OP
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[11px] text-[#0B2345] truncate leading-tight">
                        {post.authorName}
                      </h4>
                      <span className="text-[10px] text-[#64748B] block leading-tight">
                        {post.timeAgo}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); }} 
                    aria-label="Opções"
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Thumbnail Image */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={post.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Card Text Content */}
                <div className="p-3">
                  <p className="text-[11px] text-[#1E293B] leading-snug line-clamp-3 font-normal group-hover:text-[#1877F2] transition-colors">
                    {post.text}
                  </p>
                </div>
              </div>

              {/* Card Footer: Metrics (Likes, Comments, Shares) */}
              <div className="p-2.5 pt-2 border-t border-[#F1F5F9] bg-[#FAFCFF] flex items-center justify-between text-[10px] text-[#64748B]">
                <div className="flex items-center gap-1 font-semibold text-[#1877F2]">
                  <ThumbsUp className="w-3 h-3 fill-current" />
                  <span>{post.likes}</span>
                </div>

                <div className="flex items-center gap-2 text-[#64748B]">
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="w-3 h-3" />
                    <span>{post.comments}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Share2 className="w-3 h-3" />
                    <span>{post.shares}</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacebookPostsSection;
