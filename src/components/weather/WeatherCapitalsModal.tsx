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
  AlertTriangle,
  AlertCircle,
  XCircle,
  Gauge,
  Clock,
  Info,
  Radio,
  BookOpen
} from 'lucide-react';
import { 
  CapitalWeather, 
  BRAZIL_CAPITALS_WEATHER, 
  OFFICIAL_INMET_URL,
  WEATHER_METADATA_INFO,
  fetchLiveCapitalWeather,
  getSyncStateMeta,
  formatSyncTimestamp,
  WeatherSyncState
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
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

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
    setSyncFeedback(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncFeedback(null);

    // Update active capital to loading state visually
    setActiveCapital(prev => ({
      ...prev,
      syncState: 'loading'
    }));

    const result = await fetchLiveCapitalWeather(activeCapital);

    if (result.isSuccess && result.updatedCapital) {
      const updated = result.updatedCapital;
      setCapitals(prev => prev.map(c => c.id === activeCapital.id ? updated : c));
      setActiveCapital(updated);
      onSelectCapital(updated);
      setSyncFeedback({
        type: 'success',
        message: `Dados atualizados com sucesso via Open-Meteo API às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`
      });
    } else {
      // STRICT REQUIREMENT: NEVER update lastSuccessfulSync on failure!
      // Preserve historical timestamp and previous data.
      const preservedCapital: CapitalWeather = {
        ...activeCapital,
        syncState: result.state,
        syncError: result.errorMessage || 'Falha de comunicação com a fonte externa.'
      };
      setCapitals(prev => prev.map(c => c.id === activeCapital.id ? preservedCapital : c));
      setActiveCapital(preservedCapital);
      setSyncFeedback({
        type: 'error',
        message: `Falha na consulta: ${result.errorMessage || 'Fonte externa indisponível'}. O registro da última consulta bem-sucedida (${formatSyncTimestamp(activeCapital.lastSuccessfulSync)}) foi preservado intacto.`
      });
    }

    setIsRefreshing(false);
  };

  const filteredCapitals = capitals.filter(c => {
    const matchesRegion = selectedRegion === 'Todas' || c.region === selectedRegion;
    const matchesSearch = searchQuery.trim() === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.uf.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.inmetStationCode.toLowerCase().includes(searchQuery.toLowerCase());
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

  const getUvLevel = (uv: number): { label: string; color: string } => {
    if (uv <= 2) return { label: 'Baixo', color: 'text-emerald-400' };
    if (uv <= 5) return { label: 'Moderado', color: 'text-yellow-400' };
    if (uv <= 7) return { label: 'Alto', color: 'text-amber-400' };
    if (uv <= 10) return { label: 'Muito Alto', color: 'text-orange-400' };
    return { label: 'Extremo', color: 'text-rose-400' };
  };

  const syncMeta = getSyncStateMeta(activeCapital.syncState);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fade-in select-none">
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-[#D9DEE7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#07172E] text-white px-5 py-4 flex items-center justify-between border-b border-[#0B2345] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#0B2345] flex items-center justify-center border border-white/10 shrink-0">
              <Sun className="w-6 h-6 text-[#FFCC29]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif font-black text-base sm:text-lg tracking-wide uppercase text-white">
                  PREVISÃO DO TEMPO DINÂMICA DAS 27 CAPITAIS
                </h2>
                <span className="bg-[#16803C] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  MODELO ABERTO & REDE INMET
                </span>
              </div>
              <p className="text-xs text-white/75 flex flex-wrap items-center gap-2 mt-0.5">
                <span>Dados em tempo real:</span>
                <strong className="text-[#FFCC29]">Open-Meteo API (WMO/ECMWF)</strong>
                <span>•</span>
                <span>Referência Institucional de Estações:</span>
                <a 
                  href={OFFICIAL_INMET_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#FFCC29] hover:underline flex items-center gap-1 font-bold"
                  title="Visitar portal oficial do INMET — Instituto Nacional de Meteorologia"
                >
                  INMET (portal.inmet.gov.br)
                  <ExternalLink className="w-3 h-3 text-[#FFCC29]" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDocumentation(prev => !prev)}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
              title="Ver Dicionário de Variáveis e Transparência Editorial"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FFCC29]" />
              <span>{showDocumentation ? 'Ocultar Fontes' : 'Fontes & Metadados'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1.5 rounded hover:bg-white/10 transition cursor-pointer"
              aria-label="Fechar modal de meteorologia"
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

            {/* Explicit State Status Banner */}
            <div className="mb-4">
              {activeCapital.syncState === 'live' && (
                <div className="bg-[#16803C]/20 border border-[#16803C] rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-[#22A447]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22A447]" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider">Dados Atualizados em Tempo Real</span>
                    <span className="mx-1.5">•</span>
                    <span>Fonte externa: <strong>Open-Meteo API (WMO/ECMWF)</strong> sincronizada às {formatSyncTimestamp(activeCapital.lastSuccessfulSync)}.</span>
                  </div>
                </div>
              )}

              {activeCapital.syncState === 'cached' && (
                <div className="bg-amber-500/15 border border-amber-500/40 rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-amber-300">
                  <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider">Dados em Cache Local / Histórico</span>
                    <span className="mx-1.5">•</span>
                    <span>Registro obtido anteriormente em <strong>{formatSyncTimestamp(activeCapital.lastSuccessfulSync)}</strong>. Valores preservados da última consulta bem-sucedida.</span>
                  </div>
                </div>
              )}

              {activeCapital.syncState === 'loading' && (
                <div className="bg-blue-500/15 border border-blue-500/40 rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-blue-300">
                  <RefreshCw className="w-4 h-4 shrink-0 text-blue-400 animate-spin" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider">Sincronizando com Serviço Meteorológico</span>
                    <span className="mx-1.5">•</span>
                    <span>Consultando coordenadas geográficas ({activeCapital.lat}, {activeCapital.lon})...</span>
                  </div>
                </div>
              )}

              {activeCapital.syncState === 'source_unavailable' && (
                <div className="bg-rose-500/20 border border-rose-500/50 rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider">Fonte Externa Indisponível</span>
                    <span className="mx-1.5">•</span>
                    <span>O serviço de previsão não respondeu. Exibindo dados locais preservados de <strong>{formatSyncTimestamp(activeCapital.lastSuccessfulSync)}</strong>.</span>
                  </div>
                </div>
              )}

              {activeCapital.syncState === 'data_unavailable' && (
                <div className="bg-slate-500/20 border border-slate-500/50 rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-slate-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider">Dados Indisponíveis</span>
                    <span className="mx-1.5">•</span>
                    <span>Nenhuma medição encontrada para estas coordenadas. Exibindo base cadastral histórica ({formatSyncTimestamp(activeCapital.lastSuccessfulSync)}).</span>
                  </div>
                </div>
              )}

              {activeCapital.syncState === 'error' && (
                <div className="bg-rose-600/20 border border-rose-600/60 rounded-lg p-2.5 flex items-center gap-2.5 text-xs text-rose-300">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <div className="flex-1">
                    <span className="font-bold uppercase tracking-wider">Erro na Consulta</span>
                    <span className="mx-1.5">•</span>
                    <span>{activeCapital.syncError || 'Falha de comunicação'}. <strong>Atenção:</strong> O horário da última consulta bem-sucedida foi mantido ({formatSyncTimestamp(activeCapital.lastSuccessfulSync)}).</span>
                  </div>
                </div>
              )}

              {syncFeedback && syncFeedback.type === 'error' && (
                <div className="mt-2 bg-rose-950/80 border border-rose-700 rounded-md p-2 text-xs text-rose-200">
                  {syncFeedback.message}
                </div>
              )}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              {/* Capital Info & Temp */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="bg-[#FFCC29] text-[#07172E] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                    {activeCapital.region}
                  </span>
                  <span className="bg-white/15 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    Estação INMET: {activeCapital.inmetStationCode}
                  </span>
                  <span className="text-xs text-white/70">
                    {activeCapital.inmetStation}
                  </span>
                </div>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-wide">
                  {activeCapital.fullName}
                </h3>
                <p className="text-sm text-[#FFCC29] font-medium mt-1 flex flex-wrap items-center gap-2">
                  <span>{activeCapital.condition}</span>
                  <span>•</span>
                  <span>Sensação térmica de {activeCapital.feelsLike}°C</span>
                  <span>•</span>
                  <span className="text-white/60 text-xs font-mono">Fuso: {activeCapital.timezone}</span>
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
                <Droplets className="w-5 h-5 text-[#60A5FA] shrink-0" />
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
                <Gauge className="w-5 h-5 text-purple-300 shrink-0" />
                <div>
                  <div className="text-white/60 text-[11px]">Pressão Superfície</div>
                  <div className="font-bold text-white text-sm">{activeCapital.pressure} hPa</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#FFCC29] shrink-0" />
                <div>
                  <div className="text-white/60 text-[11px]">Índice UV Máximo</div>
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>UV {activeCapital.uvIndex}</span>
                    <span className={`text-[10px] font-medium ${getUvLevel(activeCapital.uvIndex).color}`}>
                      ({getUvLevel(activeCapital.uvIndex).label})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Day Forecast Grid */}
            <div className="pt-5">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FFCC29]" />
                  Previsão Numérica Estendida de 4 Dias (WMO/ECMWF)
                </span>
                <span className="text-[10px] text-white/60 lowercase">
                  projeção diária oficial
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeCapital.forecast.map((fc, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-center flex flex-col items-center justify-between hover:bg-white/10 transition"
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
                <span>Último registro válido: {formatSyncTimestamp(activeCapital.lastSuccessfulSync)}</span>
                <span className="text-white/40">•</span>
                <span className="text-[#FFCC29]">{activeCapital.dataSource}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-3.5 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs shadow-xs"
                  title="Consultar Open-Meteo API para atualizar medições desta capital"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FFCC29]' : ''}`} />
                  <span>{isRefreshing ? 'Consultando Open-Meteo...' : 'Atualizar Dados'}</span>
                </button>

                <a
                  href={OFFICIAL_INMET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#16803C] hover:bg-[#22A447] text-white font-bold px-3.5 py-1.5 rounded transition flex items-center gap-1.5 text-xs shadow-xs"
                  title="Visitar portal do Instituto Nacional de Meteorologia"
                >
                  <span>Portal Oficial INMET</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Collapsible / Expandable Transparency and Documentation Panel */}
          {showDocumentation && (
            <div className="bg-[#F7F8FA] border border-[#D9DEE7] rounded-xl p-5 text-xs text-[#17202A] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#0B5FFF]" />
                  <h4 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wide">
                    Transparência Editorial e Fontes de Dados
                  </h4>
                </div>
                <button 
                  onClick={() => setShowDocumentation(false)}
                  className="text-[#5D6673] hover:text-[#0B2345] text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3.5 rounded-lg border border-[#D9DEE7]">
                  <div className="font-bold text-[#0B2345] mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#16803C]" />
                    Origem dos Dados em Tempo Real
                  </div>
                  <p className="text-[11px] text-[#5D6673] leading-relaxed">
                    As condições meteorológicas em tempo real e a previsão de 4 dias são processadas via <strong>Open-Meteo API</strong>, integrando os modelos globais de alta resolução ECMWF e WMO (Organização Meteorológica Mundial). Atualização de hora em hora com resolução espacial de 0.1°.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-[#D9DEE7]">
                  <div className="font-bold text-[#0B2345] mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0B5FFF]" />
                    Referência Institucional — INMET
                  </div>
                  <p className="text-[11px] text-[#5D6673] leading-relaxed">
                    Os identificadores e coordenadas de cada capital têm como referência o cadastro oficial de Estações Meteorológicas do <strong>INMET (Instituto Nacional de Meteorologia - MAPA)</strong>. O link para o portal institucional é mantido para consulta pública sem implicar endosso governamental ao jornal.
                  </p>
                </div>
              </div>

              {/* Dicionário de Variáveis Table */}
              <div>
                <h5 className="font-bold text-[#0B2345] text-xs mb-2 uppercase tracking-wider">
                  Dicionário de Variáveis e Sensores
                </h5>
                <div className="overflow-x-auto border border-[#D9DEE7] rounded-lg bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#F1F3F5] text-[#0B2345] border-b border-[#D9DEE7]">
                      <tr>
                        <th className="py-2 px-3 font-bold">Variável</th>
                        <th className="py-2 px-3 font-bold">Unidade</th>
                        <th className="py-2 px-3 font-bold">Sensor / Método</th>
                        <th className="py-2 px-3 font-bold">Precisão</th>
                        <th className="py-2 px-3 font-bold">Frequência</th>
                        <th className="py-2 px-3 font-bold">Fonte Primária</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAECEF]">
                      {WEATHER_METADATA_INFO.fieldsDocumentation.map((item, i) => (
                        <tr key={i} className="hover:bg-[#F8FAFC]">
                          <td className="py-2 px-3 font-semibold text-[#17202A]">{item.field}</td>
                          <td className="py-2 px-3 font-mono text-[#5D6673]">{item.unit}</td>
                          <td className="py-2 px-3 text-[#5D6673]">{item.sensor}</td>
                          <td className="py-2 px-3 text-[#5D6673]">{item.precision}</td>
                          <td className="py-2 px-3 text-[#5D6673]">{item.freq}</td>
                          <td className="py-2 px-3 font-medium text-[#0B2345]">{item.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Capital Selector & Filter Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9DEE7]">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-[#0B2345] uppercase tracking-wider">
                  TODAS AS 27 CAPITAIS BRASILEIRAS
                </h4>
                <span className="text-xs text-[#5D6673]">({filteredCapitals.length} de 27 exibidas)</span>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#5D6673] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar cidade, UF ou código (ex: A001)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F8FA] border border-[#D9DEE7] rounded focus:outline-none focus:border-[#0B5FFF]"
                />
              </div>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#5D6673] font-medium mr-1 text-[11px]">Filtrar por Região:</span>
              {[
                { label: 'Todas (27)', key: 'Todas' },
                { label: 'Centro-Oeste (4)', key: 'Centro-Oeste' },
                { label: 'Sudeste (4)', key: 'Sudeste' },
                { label: 'Sul (3)', key: 'Sul' },
                { label: 'Nordeste (9)', key: 'Nordeste' },
                { label: 'Norte (7)', key: 'Norte' }
              ].map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    selectedRegion === key
                      ? 'bg-[#0B2345] text-white shadow-2xs'
                      : 'bg-[#F1F3F5] text-[#404B5A] hover:bg-[#E2E6EC]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 27 Capitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2">
              {filteredCapitals.map((cap) => {
                const isSelected = cap.id === activeCapital.id;
                const capSyncMeta = getSyncStateMeta(cap.syncState);
                return (
                  <button
                    key={cap.id}
                    onClick={() => handleSelect(cap)}
                    className={`text-left p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0B5FFF] bg-[#F0F5FF] shadow-xs ring-2 ring-[#0B5FFF]'
                        : 'border-[#EAECEF] bg-white hover:border-[#B4C4DB] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-[#0B2345] truncate">
                        {cap.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-[#5D6673] px-1 py-0.2 bg-[#F1F3F5] rounded">
                          {cap.uf}
                        </span>
                        <span 
                          className="w-1.5 h-1.5 rounded-full shrink-0" 
                          style={{ backgroundColor: capSyncMeta.indicatorColor }}
                          title={`Estado: ${capSyncMeta.label}`}
                        />
                      </div>
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

                    <div className="text-[9px] text-[#8C95A3] mt-1 font-mono flex items-center justify-between">
                      <span>INMET {cap.inmetStationCode}</span>
                      <span className="text-[8px] uppercase">{cap.region.slice(0, 3)}</span>
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
            <span>Todas as 27 capitais federativas monitoradas</span>
            <span>•</span>
            <a 
              href={OFFICIAL_INMET_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0B5FFF] hover:underline font-bold flex items-center gap-1"
            >
              portal.inmet.gov.br
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDocumentation(prev => !prev)}
              className="sm:hidden text-xs text-[#0B5FFF] font-semibold underline cursor-pointer"
            >
              {showDocumentation ? 'Ocultar Fontes' : 'Fontes & Metadados'}
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold px-6 py-1.5 rounded transition cursor-pointer text-xs shadow-xs"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
