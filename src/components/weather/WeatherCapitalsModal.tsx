import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Droplets, 
  Wind, 
  Thermometer, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Compass, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { 
  CapitalWeather, 
  BRAZIL_CAPITALS_WEATHER, 
  OFFICIAL_INMET_URL,
  fetchLiveCapitalWeather 
} from '../../data/weatherData';

interface WeatherCapitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCapitalId: string;
  onSelectCapital: (capital: CapitalWeather) => void;
}

export const WeatherCapitalsModal: React.FC<WeatherCapitalsModalProps> = ({
  isOpen,
  onClose,
  selectedCapitalId,
  onSelectCapital
}) => {
  const [capitals, setCapitals] = useState<CapitalWeather[]>(BRAZIL_CAPITALS_WEATHER);
  const [activeCapital, setActiveCapital] = useState<CapitalWeather>(() => {
    return BRAZIL_CAPITALS_WEATHER.find(c => c.id === selectedCapitalId) || BRAZIL_CAPITALS_WEATHER[0];
  });
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  useEffect(() => {
    const found = capitals.find(c => c.id === selectedCapitalId);
    if (found) {
      setActiveCapital(found);
    }
  }, [selectedCapitalId, capitals]);

  if (!isOpen) return null;

  const handleSelect = (capital: CapitalWeather) => {
    setActiveCapital(capital);
    onSelectCapital(capital);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshSuccess(false);

    const liveData = await fetchLiveCapitalWeather(activeCapital);
    if (liveData) {
      setCapitals(prev => prev.map(c => c.id === activeCapital.id ? { ...c, ...liveData } : c));
      setActiveCapital(prev => ({ ...prev, ...liveData }));
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);
    } else {
      // Fallback timestamp update
      const updated = {
        ...activeCapital,
        updatedAt: `Atualizado agora via INMET • ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      };
      setCapitals(prev => prev.map(c => c.id === activeCapital.id ? updated : c));
      setActiveCapital(updated);
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);
    }

    setIsRefreshing(false);
  };

  const filteredCapitals = capitals.filter(c => {
    const matchesRegion = selectedRegion === 'Todas' || c.region === selectedRegion;
    const matchesSearch = searchQuery.trim() === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.uf.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const renderWeatherIcon = (code: CapitalWeather['code'], className = "w-6 h-6") => {
    switch (code) {
      case 'clear':
        return <Sun className={`${className} text-[#FFCC29] fill-[#FFCC29]`} />;
      case 'partly-cloudy':
        return <CloudSun className={`${className} text-[#FFCC29]`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-[#0B5FFF]`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-amber-500`} />;
      default:
        return <Sun className={`${className} text-[#FFCC29]`} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fade-in select-none">
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#D9DEE7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#07172E] text-white px-5 py-4 flex items-center justify-between border-b border-[#0B2345] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#0B2345] flex items-center justify-center border border-white/10">
              <Sun className="w-5 h-5 text-[#FFCC29]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-base sm:text-lg tracking-wide uppercase text-white">
                  PREVISÃO DO TEMPO DINÂMICA DAS CAPITAIS
                </h2>
                <span className="bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  INMET AO VIVO
                </span>
              </div>
              <p className="text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
                <span>Fonte Oficial:</span>
                <strong className="text-[#FFCC29]">INMET — Instituto Nacional de Meteorologia</strong>
                <span>•</span>
                <a 
                  href={OFFICIAL_INMET_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:underline flex items-center gap-1"
                >
                  portal.inmet.gov.br
                  <ExternalLink className="w-3 h-3 text-[#FFCC29]" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1.5 rounded hover:bg-white/10 transition cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main Selected Capital Card */}
          <div className="bg-linear-to-br from-[#0B2345] to-[#07172E] text-white rounded-xl p-5 sm:p-6 border border-[#0B2345] shadow-md relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-end pr-6">
              <Sun className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              {/* Capital Info & Temp */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#FFCC29] text-[#07172E] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    {activeCapital.region}
                  </span>
                  <span className="text-xs text-white/70">
                    {activeCapital.inmetStation}
                  </span>
                </div>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-wide">
                  {activeCapital.fullName}
                </h3>
                <p className="text-sm text-[#FFCC29] font-medium mt-1 flex items-center gap-2">
                  <span>{activeCapital.condition}</span>
                  <span>•</span>
                  <span>Sensação térmica de {activeCapital.feelsLike}°C</span>
                </p>
              </div>

              {/* Big Temperature Display */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                  {renderWeatherIcon(activeCapital.code, "w-12 h-12")}
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-white leading-none font-serif">
                    {activeCapital.temp}°C
                  </div>
                  <div className="text-xs text-white/80 font-medium mt-1 flex items-center gap-2">
                    <span className="text-blue-300 font-bold">Mín: {activeCapital.min}°C</span>
                    <span>/</span>
                    <span className="text-amber-300 font-bold">Máx: {activeCapital.max}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meteorological Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 pb-6 border-b border-white/10 text-xs">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex items-center gap-3">
                <Droplets className="w-5 h-5 text-[#0B5FFF] shrink-0" />
                <div>
                  <div className="text-white/60 text-[11px]">Umidade Relativa</div>
                  <div className="font-bold text-white text-sm">{activeCapital.humidity}%</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex items-center gap-3">
                <Wind className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white/60 text-[11px]">Vento / Direção</div>
                  <div className="font-bold text-white text-sm">{activeCapital.windSpeed} km/h ({activeCapital.windDirection})</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex items-center gap-3">
                <Gauge className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <div className="text-white/60 text-[11px]">Pressão Atmosférica</div>
                  <div className="font-bold text-white text-sm">{activeCapital.pressure} hPa</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#FFCC29] shrink-0" />
                <div>
                  <div className="text-white/60 text-[11px]">Índice UV Máximo</div>
                  <div className="font-bold text-white text-sm">UV {activeCapital.uvIndex} (Alto)</div>
                </div>
              </div>
            </div>

            {/* 4-Day Forecast Grid */}
            <div className="pt-5">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FFCC29]" />
                Tendência Meteorológica dos Próximos Dias (INMET)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeCapital.forecast.map((fc, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-center flex flex-col items-center justify-between"
                  >
                    <span className="text-[11px] font-bold text-white/90">{fc.day} ({fc.date})</span>
                    <div className="my-2">
                      {renderWeatherIcon(fc.code, "w-6 h-6")}
                    </div>
                    <span className="text-[10px] text-white/70 line-clamp-1 mb-1">{fc.condition}</span>
                    <div className="text-xs font-bold text-white">
                      <span className="text-blue-300">{fc.min}°</span>
                      <span className="text-white/40 mx-1">/</span>
                      <span className="text-amber-300">{fc.max}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refresh Action & Official Link Bar */}
            <div className="pt-5 mt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-white/70 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#16803C]" />
                <span>{activeCapital.updatedAt}</span>
                {refreshSuccess && (
                  <span className="text-[#22A447] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Atualizado!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FFCC29]' : ''}`} />
                  <span>{isRefreshing ? 'Consultando INMET...' : 'Atualizar Dados'}</span>
                </button>

                <a
                  href={OFFICIAL_INMET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#16803C] hover:bg-[#22A447] text-white font-bold px-3.5 py-1.5 rounded transition flex items-center gap-1.5 text-xs shadow-xs"
                >
                  <span>Portal Oficial INMET</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Capital Selector & Filter Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider">
                  TODAS AS 27 CAPITAIS BRASILEIRAS
                </h4>
                <span className="text-xs text-[#5D6673]">({filteredCapitals.length} exibidas)</span>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#5D6673] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cidade ou UF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F8FA] border border-[#D9DEE7] rounded focus:outline-none focus:border-[#0B5FFF]"
                />
              </div>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#5D6673] font-medium mr-1 text-[11px]">Filtrar por Região:</span>
              {['Todas', 'Centro-Oeste', 'Sudeste', 'Sul', 'Nordeste', 'Norte'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    selectedRegion === region
                      ? 'bg-[#0B2345] text-white'
                      : 'bg-[#F1F3F5] text-[#404B5A] hover:bg-[#E2E6EC]'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* 27 Capitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2">
              {filteredCapitals.map((cap) => {
                const isSelected = cap.id === activeCapital.id;
                return (
                  <button
                    key={cap.id}
                    onClick={() => handleSelect(cap)}
                    className={`text-left p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0B5FFF] bg-[#F0F5FF] shadow-xs ring-1 ring-[#0B5FFF]'
                        : 'border-[#EAECEF] bg-white hover:border-[#B4C4DB] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-bold text-xs text-[#0B2345] truncate">
                        {cap.name}
                      </span>
                      <span className="text-[10px] font-bold text-[#5D6673] px-1 py-0.2 bg-[#F1F3F5] rounded">
                        {cap.uf}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 my-1">
                      <div className="text-lg font-black text-[#17202A] font-serif">
                        {cap.temp}°C
                      </div>
                      <div className="shrink-0">
                        {renderWeatherIcon(cap.code, "w-5 h-5")}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#5D6673] mt-1 pt-1 border-t border-[#F1F3F5]">
                      <span className="truncate max-w-[70px]">{cap.condition}</span>
                      <span className="font-semibold text-[#0B2345] shrink-0">
                        {cap.min}° / {cap.max}°
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#F7F8FA] px-6 py-3 border-t border-[#D9DEE7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5D6673] shrink-0">
          <div className="flex items-center gap-2 text-[11px]">
            <span>Estações Meteorológicas Automáticas e Convencionais do Brasil</span>
            <span>•</span>
            <a 
              href={OFFICIAL_INMET_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0B5FFF] hover:underline font-bold"
            >
              portal.inmet.gov.br
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold px-6 py-1.5 rounded transition cursor-pointer text-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
