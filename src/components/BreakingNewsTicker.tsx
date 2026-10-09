import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../types';

interface BreakingNewsTickerProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  articles,
  onSelectArticle
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tickerItems = [
    {
      time: '14:32',
      text: 'Congresso analisa pacote para reduzir custo do trabalho e gerar empregos',
      article: articles[0]
    },
    {
      time: '13:15',
      text: 'Operação nacional reforça combate ao crime organizado',
      article: articles[2]
    },
    {
      time: '12:48',
      text: 'Farmácia Popular atendeu 24 milhões de brasileiros em 2026',
      article: articles[3]
    },
    {
      time: '11:20',
      text: 'PIB mostra sinais de recuperação e reforça expectativa de crescimento',
      article: articles[1]
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tickerItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tickerItems.length - 1 ? 0 : prev + 1));
  };

  // Auto advance ticker every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border-b border-[#D9DEE7] py-2 px-4 shadow-2xs select-none">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          {/* Red Badge */}
          <span className="bg-[#B42318] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider rounded-xs shrink-0 shadow-xs">
            ÚLTIMAS NOTÍCIAS
          </span>

          {/* Desktop full view: 3 headlines separated by bars */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-[#17202A] overflow-hidden">
            {tickerItems.slice(0, 3).map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-[#B42318] font-bold font-mono text-[11px]">{item.time}</span>
                  <button
                    onClick={() => item.article && onSelectArticle(item.article)}
                    className="hover:text-[#0B5FFF] transition-colors truncate max-w-md text-left font-medium cursor-pointer"
                  >
                    {item.text}
                  </button>
                </div>
                {idx < 2 && <span className="text-[#D9DEE7] font-light">|</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile / Tablet ticker view */}
          <div className="lg:hidden flex items-center gap-2 truncate">
            <span className="text-[#B42318] font-bold font-mono text-[11px]">{tickerItems[currentIndex].time}</span>
            <button
              onClick={() => tickerItems[currentIndex].article && onSelectArticle(tickerItems[currentIndex].article)}
              className="hover:text-[#0B5FFF] transition-colors truncate text-left font-medium cursor-pointer"
            >
              {tickerItems[currentIndex].text}
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1 shrink-0 text-[#5D6673]">
          <button
            onClick={handlePrev}
            aria-label="Notícia anterior"
            className="p-1 hover:text-[#0B2345] hover:bg-[#F1F3F5] rounded transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próxima notícia"
            className="p-1 hover:text-[#0B2345] hover:bg-[#F1F3F5] rounded transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
