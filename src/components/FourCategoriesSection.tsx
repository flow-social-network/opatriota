import React from 'react';
import { Article } from '../types';
import { ArticleImage } from './ArticleImage';
import { ArrowRight, Calendar } from 'lucide-react';

interface FourCategoriesSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigateCategory: (category: string) => void;
}

export const FourCategoriesSection: React.FC<FourCategoriesSectionProps> = ({
  articles,
  onSelectArticle,
  onNavigateCategory,
}) => {
  const sections = [
    {
      category: 'brasil',
      title: 'Brasil',
      lead: {
        title: 'Governo anuncia plano de infraestrutura para o próximo ciclo',
        subtitle: 'Investimentos incluem estradas, portos e ferrovias em todo o país.',
        imageUrl: '/images/news_infraestrutura.jpg',
        date: '8 de outubro de 2026',
        slug: 'art-rs-1',
      },
      items: [
        {
          title: 'Produção agrícola cresce e reforça papel do Brasil no mercado global',
          date: '8 de outubro de 2026',
          imageUrl: '/images/news_porto.jpg',
          slug: 'art-rs-4',
        },
        {
          title: 'Ministério da Saúde amplia atendimento no SUS',
          date: '8 de outubro de 2026',
          imageUrl: '/images/news_saude.jpg',
          slug: 'art-4',
        },
      ],
    },
    {
      category: 'economia',
      title: 'Economia',
      lead: {
        title: 'Mercado reage positivamente a novas medidas econômicas',
        subtitle: 'Analistas apontam ambiente favorável para investimentos e crescimento.',
        imageUrl: '/images/news_economia.jpg',
        date: '8 de outubro de 2026',
        slug: 'art-2',
      },
      items: [
        {
          title: 'Dólar recua com expectativa de reformas no Brasil',
          date: '8 de outubro de 2026',
          imageUrl: '/images/news_economia.jpg',
          slug: 'art-2',
        },
        {
          title: 'Setores de serviços e agronegócio puxam crescimento',
          date: '8 de outubro de 2026',
          imageUrl: '/images/news_porto.jpg',
          slug: 'art-rs-2',
        },
      ],
    },
    {
      category: 'mundo',
      title: 'Mundo',
      lead: {
        title: 'Brasil amplia acordos comerciais na América do Sul',
        subtitle: 'Parcerias estratégicas fortalecem a posição do país no cenário internacional.',
        imageUrl: '/images/news_porto.jpg',
        date: '8 de outubro de 2026',
        slug: 'art-5',
      },
      items: [
        {
          title: 'Conflitos globais reacendem debate sobre segurança',
          date: '8 de outubro de 2026',
          imageUrl: '/images/news_seguranca.jpg',
          slug: 'art-3',
        },
        {
          title: 'EUA sinalizam nova fase nas relações com a América Latina',
          date: '8 de outubro de 2026',
          imageUrl: '/images/hero_congresso.jpg',
          slug: 'art-1',
        },
      ],
    },
    {
      category: 'politica',
      title: 'Política',
      lead: {
        title: 'Congresso avança em propostas para gerar empregos e reduzir o custo do trabalho',
        subtitle: 'Projeto prevê simplificação de regras e incentivos ao setor produtivo.',
        imageUrl: '/images/hero_congresso.jpg',
        date: '8 de outubro de 2026',
        slug: 'congresso-avanca-em-propostas-para-gerar-empregos-e-reduzir-o-custo-do-trabalho',
      },
      items: [
        {
          title: 'Senado analisa medidas contra privilégios',
          date: '8 de outubro de 2026',
          imageUrl: '/images/hero_congresso.jpg',
          slug: 'congresso-avanca-em-propostas-para-gerar-empregos-e-reduzir-o-custo-do-trabalho',
        },
        {
          title: 'Polícia e Metrô divergem sobre dispersão na Paulista',
          date: '12 de outubro de 2026',
          imageUrl: 'https://scontent.fpoa13-1.fna.fbcdn.net/v/t39.30808-6/844461567_122099510319508218_8962011006668968197_n.jpg?stp=dst-jpg_tt6&cstp=mx1084x714&ctp=p180x540&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hDk0EMtW1w8Q7kNvwFC6Gmx&_nc_oc=AdqonzhRXaH0YEa_3rh9RgNOglth0gqj4oy_K84Za5Zq4v-y0RRjDXxEzruuj_wn8Y7QS8_6MQh0IvbX5uLI8elu&_nc_zt=23&_nc_ht=scontent.fpoa13-1.fna&_nc_gid=4gd88Wwt0riEFMkkB1x-Og&_nc_ss=7b2a8&oh=00_AQND8s6qsaTfjM1AClRbjITi00yqbfKZw8otE2Uxys0_7Q&oe=6AD2CE25',
          slug: 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista',
        },
      ],
    },
  ];

  const handleItemClick = (slug: string) => {
    const article = articles.find((a) => a.slug === slug || a.id === slug) || articles[0];
    if (article) onSelectArticle(article);
  };

  return (
    <section className="mb-12 select-none" aria-label="Editorias Principais">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((sec) => (
          <div key={sec.category} className="bg-white border border-[#D9DEE7] rounded-lg p-4 flex flex-col justify-between shadow-2xs">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b-2 border-[#0B2345]">
                <h3 className="font-serif text-lg font-black text-[#0B2345] tracking-tight">
                  {sec.title}
                </h3>
                <button
                  onClick={() => onNavigateCategory(sec.category)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B5FFF] hover:text-[#0B2345] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>VER TODAS</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Lead Card */}
              <div 
                onClick={() => handleItemClick(sec.lead.slug)}
                className="group cursor-pointer mb-4"
              >
                <div className="relative aspect-[16/9] w-full rounded overflow-hidden bg-slate-100 mb-2.5 border border-[#D9DEE7]">
                  <ArticleImage
                    src={sec.lead.imageUrl}
                    alt={sec.lead.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#0B2345] leading-snug mb-1 group-hover:text-[#0B5FFF] transition-colors line-clamp-2">
                  {sec.lead.title}
                </h4>
                <p className="text-[11px] text-[#5D6673] leading-relaxed line-clamp-2 mb-2">
                  {sec.lead.subtitle}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#5D6673]">
                  <Calendar className="w-3 h-3 text-[#5D6673]/70" />
                  <span>{sec.lead.date}</span>
                </div>
              </div>

              {/* Sub-items List */}
              <div className="space-y-3 pt-3 border-t border-[#F1F3F5]">
                {sec.items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleItemClick(item.slug)}
                    className="flex gap-2.5 items-start group cursor-pointer"
                  >
                    <div className="w-16 h-12 rounded overflow-hidden bg-slate-100 shrink-0 border border-[#D9DEE7]">
                      <ArticleImage
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif text-[11px] font-bold text-[#0B2345] leading-tight line-clamp-2 group-hover:text-[#0B5FFF] transition-colors">
                        {item.title}
                      </h5>
                      <span className="text-[9px] text-[#5D6673] flex items-center gap-1 mt-1">
                        <Calendar className="w-2.5 h-2.5 text-[#5D6673]/70" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FourCategoriesSection;
