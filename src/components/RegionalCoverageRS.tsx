import React from 'react';
import { Article } from '../types';
import { Bookmark, ArrowRight } from 'lucide-react';

interface RegionalCoverageRSProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory?: (category: string) => void;
}

export const RegionalCoverageRS: React.FC<RegionalCoverageRSProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  // Matérias temáticas de referência da imagem anexada
  const referenceLeadArticle: Article = {
    id: 'lead-regional-1',
    slug: 'camara-avanca-com-projeto-de-corte-de-gastos',
    title: 'Câmara avança com projeto de corte de gastos',
    subtitle: 'Proposta segue para análise no Senado e divide opiniões entre governo e oposição.',
    kicker: 'POLÍTICA',
    category: 'politica',
    accessLevel: 'aberto',
    editorialStatus: 'PUBLICADA',
    content: 'A Câmara dos Deputados aprovou em votação expressiva o texto-base da proposta que estabelece novos limites e critérios para os gastos públicos.',
    author: 'Thiago Vasconcellos',
    authorRole: 'Correspondente Político em Brasília',
    sourceName: 'Agência Câmara e O Patriota',
    publishedAt: 'Há 3 horas',
    readTimeMinutes: 4,
    imageUrl: '/images/hero_congresso.jpg',
    imageCaption: 'Plenário da Câmara dos Deputados durante deliberação.',
    tags: ['Câmara dos Deputados', 'Política', 'Economia']
  };

  const referenceSecondaryArticles: Article[] = [
    {
      id: 'art-policia-metro-divergem-paulista',
      slug: 'policia-e-metro-divergem-sobre-danos-apos-ato-pro-lula-na-avenida-paulista',
      title: 'Polícia e Metrô divergem sobre danos após ato pró-Lula na Avenida Paulista',
      subtitle: 'A Secretaria da Segurança Pública afirma que a PM registrou tumulto, pichações e depredação durante a dispersão; o Metrô diz não ter registros internos de danos nas estações da região.',
      kicker: 'ELEIÇÕES 2026 & SEGURANÇA',
      category: 'politica',
      accessLevel: 'aberto',
      editorialStatus: 'PUBLICADA',
      content: 'Um ato da campanha do presidente Luiz Inácio Lula da Silva (PT), candidato à reeleição, terminou no domingo (11) na Avenida Paulista com versões diferentes sobre o que ocorreu na dispersão.',
      author: 'Redação O Patriota',
      authorRole: 'Reportagem Especial',
      sourceName: 'SSP-SP e Companhia do Metrô',
      imageCaption: 'Ato na Avenida Paulista e dispersão com relatos divergentes.',
      publishedAt: 'Há 2 horas',
      readTimeMinutes: 4,
      imageUrl: '/images/policia_metro_paulista.jpg',
      tags: ['Avenida Paulista', 'Polícia Militar', 'Metrô SP', 'Eleições 2026', 'Segurança']
    },
    {
      id: 'sec-regional-2',
      slug: 'stf-retoma-julgamento-sobre-marco-das-redes-sociais',
      title: 'STF retoma julgamento sobre marco das redes sociais',
      subtitle: 'Ministros analisam a responsabilidade de plataformas por conteúdos publicados por terceiros.',
      kicker: 'SEGURANÇA',
      category: 'seguranca',
      accessLevel: 'aberto',
      editorialStatus: 'PUBLICADA',
      content: 'O Supremo Tribunal Federal retomou nesta quinta-feira a deliberação sobre o regime de responsabilidade civil das plataformas digitais.',
      author: 'Redação Jurídica',
      authorRole: 'Repórter Judiciário',
      sourceName: 'Supremo Tribunal Federal',
      imageCaption: 'Sessão plenária de julgamentos do Supremo Tribunal Federal.',
      publishedAt: 'Há 5 horas',
      readTimeMinutes: 5,
      imageUrl: '/images/news_seguranca.jpg',
      tags: ['STF', 'Segurança', 'Tecnologia']
    },
    {
      id: 'sec-regional-3',
      slug: 'tensao-cresce-no-oriente-medio-apos-novos-ataques',
      title: 'Tensão cresce no Oriente Médio após novos ataques',
      subtitle: 'Comunidade internacional apela por cessar-fogo e reforça corredores de assistência humanitária.',
      kicker: 'MUNDO',
      category: 'mundo',
      accessLevel: 'aberto',
      editorialStatus: 'PUBLICADA',
      content: 'A escalada de tensões na região mobilizou diplomatas das Nações Unidas e governos aliados em busca de trégua.',
      author: 'Correspondente Internacional',
      authorRole: 'Analista de Relações Internacionais',
      sourceName: 'Agências Internacionais',
      imageCaption: 'Cobertura diplomática e geopolítica internacional.',
      publishedAt: 'Há 6 horas',
      readTimeMinutes: 4,
      imageUrl: '/images/news_opiniao.jpg',
      tags: ['Mundo', 'Internacional', 'Geopolítica']
    }
  ];

  // Identifica artigos reais do banco ou utiliza os dados fiéis à imagem de referência
  const mainLead = articles.find((article) => article.id === 'art-rs-zucco-flavio-porto-alegre' || article.tags?.includes('Rio Grande do Sul')) || referenceLeadArticle;
  const secondary1 = articles.find((article) => article.id === 'art-rs-zucco-flavio-porto-alegre') || referenceSecondaryArticles[1];
  const secondary2 = articles.find((article) => article.category === 'seguranca' && !article.tags?.includes('Eleições 2026')) || referenceSecondaryArticles[1];
  const secondary3 = articles.find((article) => article.category === 'brasil' && article.id !== 'art-rs-zucco-flavio-porto-alegre') || referenceSecondaryArticles[2];

  const secondaryList = [secondary1, secondary2, secondary3].filter((article, index, list) => list.findIndex((candidate) => candidate.id === article.id) === index);

  return (
    <section className="mb-12 select-none" aria-label="Cobertura Regional do Rio Grande do Sul">
      {/* Section Header fiel à Imagem 3 */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#16803C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16803C]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#16803C]">
              COBERTURA REGIONAL SUL
            </span>
            <span className="text-xs text-[#5D6673] hidden sm:inline">• Porto Alegre, Vale do Sinos, Serra & Interior</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#0B2345] tracking-tight mt-1">
            Rio Grande do Sul em Foco
          </h2>
        </div>

        {/* Link Ver todas → */}
        <button
          onClick={() => onSelectCategory?.('rio-grande-do-sul')}
          className="text-[#0284C7] hover:text-[#0369A1] font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid: 1 Featured Large Card com Overlay (Esquerda) + 3 Stacked Cards (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main Regional Lead (7 cols) - Card com imagem grande e texto sobreposto */}
        <article 
          onClick={() => onSelectArticle(mainLead)}
          className="lg:col-span-7 relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all min-h-[380px] sm:min-h-[420px] flex flex-col justify-end bg-slate-900 border border-[#D9DEE7]"
        >
          <img
            src={mainLead.imageUrl || '/images/hero_congresso.jpg'}
            alt={mainLead.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8 text-white">
            <span className="bg-[#0284C7] text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 uppercase tracking-wider rounded-md shadow-sm inline-block mb-3">
              {mainLead.kicker || 'POLÍTICA'}
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight mb-2.5 drop-shadow-sm group-hover:text-blue-200 transition-colors">
              {mainLead.title}
            </h3>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-3">
              {mainLead.subtitle}
            </p>
          </div>
        </article>

        {/* 3 Secondary Cards (5 cols) - Cards horizontais empilhados com ícone de Bookmark */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {secondaryList.map((art) => {
            const getKickerColor = (kicker?: string) => {
              if (kicker?.includes('ECONOMIA')) return 'text-[#16803C]';
              if (kicker?.includes('SEGURANÇA')) return 'text-[#EA580C]';
              if (kicker?.includes('ELEIÇÕES')) return 'text-[#DC2626]';
              if (kicker?.includes('POLÍTICA')) return 'text-[#0284C7]';
              if (kicker?.includes('MUNDO')) return 'text-[#0284C7]';
              return 'text-[#16803C]';
            };

            return (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-white border border-[#D9DEE7] rounded-xl p-3.5 flex gap-4 items-center group cursor-pointer hover:shadow-md hover:border-[#0284C7] transition-all flex-1"
              >
                {/* Thumbnail */}
                <div className="w-28 sm:w-32 h-20 sm:h-22 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-[#E2E8F0]">
                  <img
                    src={art.imageUrl || '/images/news_infraestrutura.jpg'}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Conteúdo textual */}
                <div className="flex-1 flex flex-col justify-between min-h-[76px]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black tracking-wider uppercase ${getKickerColor(art.kicker)}`}>
                        {art.kicker || 'NOTÍCIA'}
                      </span>
                      <Bookmark className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0B2345] transition-colors shrink-0" />
                    </div>

                    <h4 className="font-sans text-xs sm:text-[13px] font-bold text-[#0B2345] leading-snug group-hover:text-[#0284C7] transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                  </div>

                  <span className="text-[10px] text-[#8C9BAE] mt-1.5 block">
                    {art.publishedAt?.includes('às') ? 'Há 4 horas' : (art.publishedAt || 'Há 4 horas')}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
