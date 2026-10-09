import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  ChevronRight, 
  ExternalLink,
  Radio,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { 
  CapitalWeather, 
  BRAZIL_CAPITALS_WEATHER, 
  OFFICIAL_INMET_URL,
  getSyncStateMeta
} from '../../data/weatherData';

interface WeatherBarProps {
  onOpenModal: (capitalId?: string) => void;
  selectedCapital: CapitalWeather;
}

export const WeatherBar: React.FC<WeatherBarProps> = ({
  onOpenModal,
  selectedCapital
}) => {
  // Highlighted capitals for the compact bar
  const highlightIds = [
    'brasilia', 
    'sao-paulo', 
    'rio-de-janeiro', 
    'porto-alegre', 
    'belo-horizonte', 
    'salvador', 
    'curitiba', 
    'recife', 
    'cuiaba', 
    'manaus', 
    'fortaleza', 
    'belem',
    'goiania'
  ];

  const highlightedCapitals = highlightIds
    .map(id => BRAZIL_CAPITALS_WEATHER.find(c => c.id === id))
    .filter((c): c is CapitalWeather => !!c);

  const renderIcon = (code: CapitalWeather['code'], className = "w-3.5 h-3.5") => {
    switch (code) {
      case 'clear':
        return <Sun className={`${className} text-[#FFCC29] fill-[#FFCC29]`} />;
      case 'partly-cloudy':
        return <CloudSun className={`${className} text-[#FFCC29]`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-300`} />;
      case 'rain':
        return <CloudRain className={`${className} text-[#60A5FA]`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-amber-400`} />;
      default:
        return <Sun className={`${className} text-[#FFCC29]`} />;
    }
  };

  const syncMeta = getSyncStateMeta(selectedCapital.syncState);

  return (
    <div className="bg-[#0B2345] text-white border-b border-[#07172E] text-xs py-1.5 px-4 shadow-2xs select-none">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-3 overflow-hidden">
        
        {/* INMET Institutional Reference & Modal Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={OFFICIAL_INMET_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Portal Oficial do INMET (portal.inmet.gov.br) — Referência Institucional de Estações Meteorológicas"
            className="flex items-center gap-1.5 bg-[#16803C] hover:bg-[#22A447] text-white font-black text-[10px] tracking-wider px-2 py-0.5 rounded transition cursor-pointer shadow-2xs"
          >
            <span>INMET</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-90" />
          </a>

          <button
            onClick={() => onOpenModal()}
            className="text-[11px] font-bold text-[#FFCC29] hover:underline flex items-center gap-1 cursor-pointer"
            title="Abrir painel meteorológico das 27 capitais brasileiras"
          >
            <span>PREVISÃO DAS CAPITAIS:</span>
          </button>

          {/* Sync State Badge */}
          <div 
            className={`hidden lg:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${syncMeta.badgeBg} ${syncMeta.badgeText}`}
            title={`Estado: ${syncMeta.label} — ${syncMeta.description}`}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse" 
              style={{ backgroundColor: syncMeta.indicatorColor }} 
            />
            <span>{selectedCapital.syncState === 'live' ? 'Ao Vivo (Open-Meteo)' : syncMeta.label}</span>
          </div>
        </div>

        {/* Horizontal Scrolling Capitals Ticker */}
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar scroll-smooth text-[11px] py-0.5">
          {highlightedCapitals.map((cap) => {
            const isSelected = cap.id === selectedCapital.id;
            return (
              <button
                key={cap.id}
                onClick={() => onOpenModal(cap.id)}
                className={`flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded transition cursor-pointer ${
                  isSelected 
                    ? 'bg-white/20 text-[#FFCC29] font-bold ring-1 ring-[#FFCC29]/50' 
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
                title={`${cap.fullName} • Estação INMET: ${cap.inmetStationCode || cap.inmetStation} • Fonte: ${cap.dataSource}`}
              >
                <span className="font-semibold text-white">{cap.name}</span>
                <span className="text-white/50 text-[10px]">({cap.uf})</span>
                {renderIcon(cap.code)}
                <span className="font-bold">{cap.temp}°C</span>
                <span className="text-[10px] text-white/60 hidden sm:inline">
                  {cap.min}°/{cap.max}°
                </span>
              </button>
            );
          })}
        </div>

        {/* View All Button & Source Attribution */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenModal()}
            className="shrink-0 text-[11px] font-bold text-white/90 hover:text-white hover:underline flex items-center gap-1 pl-2 border-l border-white/20 cursor-pointer hidden sm:flex"
            title="Ver tabela e previsão de 4 dias de todas as 27 capitais do Brasil"
          >
            <span>Todas as 27</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

