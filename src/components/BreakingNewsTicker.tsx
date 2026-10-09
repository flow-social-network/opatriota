import React, { useEffect, useState } from 'react';
import { Activity, Pause, Play, Radio } from 'lucide-react';

export interface MarketTickerItem {
  symbol: string;
  label: string;
  value?: string;
  change?: string;
  status: 'indisponível' | 'último valor' | 'atualizado';
  source: string;
  observedAt?: string;
}

interface BreakingNewsTickerProps {
  items?: MarketTickerItem[];
  enabled?: boolean;
  speedSeconds?: number;
}

const defaultItems: MarketTickerItem[] = [
  { symbol: 'USD/BRL', label: 'Dólar comercial', status: 'indisponível', source: 'Fonte não configurada' },
  { symbol: 'EUR/BRL', label: 'Euro comercial', status: 'indisponível', source: 'Fonte não configurada' },
  { symbol: 'IBOVESPA', label: 'Índice B3', status: 'indisponível', source: 'Fonte não configurada' },
  { symbol: 'SELIC', label: 'Taxa básica', status: 'indisponível', source: 'Banco Central — aguardando integração' },
  { symbol: 'IPCA', label: 'Inflação acumulada', status: 'indisponível', source: 'IBGE — aguardando integração' },
];

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  items = defaultItems,
  enabled = true,
  speedSeconds = 42,
}) => {
  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (!enabled) return null;

  const renderItems = (copy = false) => items.map((item) => (
    <div key={`${item.symbol}-${copy ? 'copy' : 'primary'}`} className="market-ticker__item" aria-hidden={copy}>
      <span className="market-ticker__symbol">{item.symbol}</span>
      <span className="market-ticker__value">{item.value || '—'}</span>
      <span className={item.change ? 'market-ticker__change' : 'market-ticker__muted'}>
        {item.change || item.status}
      </span>
      <span className="sr-only">Fonte: {item.source}{item.observedAt ? `; observado em ${item.observedAt}` : ''}.</span>
    </div>
  ));

  return (
    <section className="market-ticker" aria-label="Mercados e indicadores econômicos">
      <div className="market-ticker__inner">
        <div className="market-ticker__label"><Activity aria-hidden="true" /> MERCADOS</div>
        <div className="market-ticker__viewport" aria-live="off">
          <div
            className="market-ticker__track"
            style={{
              ['--ticker-duration' as string]: `${Math.max(24, speedSeconds)}s`,
              animationPlayState: paused || prefersReducedMotion ? 'paused' : 'running',
            }}
          >
            <div className="market-ticker__set">{renderItems()}</div>
            <div className="market-ticker__set" aria-hidden="true">{renderItems(true)}</div>
          </div>
        </div>
        <button
          type="button"
          className="market-ticker__control"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Retomar movimento do ticker' : 'Pausar movimento do ticker'}
          title={paused ? 'Retomar ticker' : 'Pausar ticker'}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
        <span className="market-ticker__live"><Radio aria-hidden="true" /> Dados verificados</span>
      </div>
    </section>
  );
};

export default BreakingNewsTicker;
