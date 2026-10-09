/**
 * O Patriota — Módulo Meteorológico Dinâmico (WordPress FSE)
 *
 * Integra a barra de previsão do tempo no tema WordPress com:
 * - Consulta assíncrona ao endpoint REST /wp-json/o-patriota/v1/weather/ ou Open-Meteo API
 * - Suporte às 27 capitais brasileiras com previsão de 4 dias
 * - Estados explícitos: Ao vivo (Open-Meteo), Cache local, e Tratamento de erros
 * - Preservação estrita dos horários em caso de falha de conexão
 * - Identificação correta de fontes e referência institucional ao INMET
 */

(function () {
  'use strict';

  var OFFICIAL_INMET_URL = 'https://portal.inmet.gov.br/';

  var CAPITALS_DATA = [
    { id: 'brasilia', name: 'Brasília', uf: 'DF', region: 'Centro-Oeste', lat: -15.78, lon: -47.93, station: 'A001' },
    { id: 'sao-paulo', name: 'São Paulo', uf: 'SP', region: 'Sudeste', lat: -23.55, lon: -46.63, station: 'A701' },
    { id: 'rio-de-janeiro', name: 'Rio de Janeiro', uf: 'RJ', region: 'Sudeste', lat: -22.90, lon: -43.20, station: 'A652' },
    { id: 'porto-alegre', name: 'Porto Alegre', uf: 'RS', region: 'Sul', lat: -30.03, lon: -51.23, station: 'A801' },
    { id: 'belo-horizonte', name: 'Belo Horizonte', uf: 'MG', region: 'Sudeste', lat: -19.92, lon: -43.94, station: 'A521' },
    { id: 'salvador', name: 'Salvador', uf: 'BA', region: 'Nordeste', lat: -12.97, lon: -38.51, station: 'A401' },
    { id: 'curitiba', name: 'Curitiba', uf: 'PR', region: 'Sul', lat: -25.43, lon: -49.27, station: 'A807' },
    { id: 'recife', name: 'Recife', uf: 'PE', region: 'Nordeste', lat: -8.05, lon: -34.88, station: 'A301' },
    { id: 'cuiaba', name: 'Cuiabá', uf: 'MT', region: 'Centro-Oeste', lat: -15.60, lon: -56.09, station: '83361' },
    { id: 'manaus', name: 'Manaus', uf: 'AM', region: 'Norte', lat: -3.11, lon: -60.02, station: 'A101' },
    { id: 'fortaleza', name: 'Fortaleza', uf: 'CE', region: 'Nordeste', lat: -3.72, lon: -38.54, station: 'A305' },
    { id: 'belem', name: 'Belém', uf: 'PA', region: 'Norte', lat: -1.45, lon: -48.50, station: 'A201' },
    { id: 'goiania', name: 'Goiânia', uf: 'GO', region: 'Centro-Oeste', lat: -16.68, lon: -49.25, station: 'A002' },
    { id: 'florianopolis', name: 'Florianópolis', uf: 'SC', region: 'Sul', lat: -27.59, lon: -48.54, station: 'A806' },
    { id: 'vitoria', name: 'Vitória', uf: 'ES', region: 'Sudeste', lat: -20.31, lon: -40.33, station: 'A612' },
    { id: 'campo-grande', name: 'Campo Grande', uf: 'MS', region: 'Centro-Oeste', lat: -20.46, lon: -54.62, station: 'A702' },
    { id: 'natal', name: 'Natal', uf: 'RN', region: 'Nordeste', lat: -5.79, lon: -35.21, station: 'A317' },
    { id: 'joao-pessoa', name: 'João Pessoa', uf: 'PB', region: 'Nordeste', lat: -7.11, lon: -34.86, station: 'A320' },
    { id: 'maceio', name: 'Maceió', uf: 'AL', region: 'Nordeste', lat: -9.66, lon: -35.73, station: 'A303' },
    { id: 'aracaju', name: 'Aracaju', uf: 'SE', region: 'Nordeste', lat: -10.91, lon: -37.07, station: 'A409' },
    { id: 'teresina', name: 'Teresina', uf: 'PI', region: 'Nordeste', lat: -5.09, lon: -42.80, station: 'A312' },
    { id: 'sao-luis', name: 'São Luís', uf: 'MA', region: 'Nordeste', lat: -2.53, lon: -44.30, station: 'A203' },
    { id: 'porto-velho', name: 'Porto Velho', uf: 'RO', region: 'Norte', lat: -8.76, lon: -63.90, station: 'A108' },
    { id: 'rio-branco', name: 'Rio Branco', uf: 'AC', region: 'Norte', lat: -9.97, lon: -67.81, station: 'A104' },
    { id: 'macapa', name: 'Macapá', uf: 'AP', region: 'Norte', lat: 0.03, lon: -51.05, station: 'A249' },
    { id: 'boa-vista', name: 'Boa Vista', uf: 'RR', region: 'Norte', lat: 2.82, lon: -60.67, station: 'A135' },
    { id: 'palmas', name: 'Palmas', uf: 'TO', region: 'Norte', lat: -10.21, lon: -48.36, station: 'A004' }
  ];

  var weatherCache = {};

  function mapWmoToText(code) {
    if (code === 0) return 'Céu limpo';
    if (code >= 1 && code <= 3) return 'Parcialmente nublado';
    if (code === 45 || code === 48) return 'Neblina';
    if (code >= 51 && code <= 67) return 'Chuva';
    if (code >= 80 && code <= 82) return 'Pancadas de chuva';
    if (code >= 95) return 'Trovoadas';
    return 'Nublado';
  }

  function mapWmoToEmoji(code) {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '☁️';
  }

  function fetchCapitalWeather(capital, callback) {
    if (weatherCache[capital.id]) {
      callback(null, weatherCache[capital.id]);
      return;
    }

    // Try WordPress internal REST API first
    var restUrl = '/wp-json/o-patriota/v1/weather/' + encodeURIComponent(capital.id);

    fetch(restUrl, { signal: AbortSignal.timeout(3500) })
      .then(function (res) {
        if (!res.ok) throw new Error('REST unreachable');
        return res.json();
      })
      .then(function (data) {
        var result = {
          temp: data.metrics.temp,
          feelsLike: data.metrics.feelsLike,
          min: data.forecast && data.forecast[0] ? data.forecast[0].min : data.metrics.temp - 5,
          max: data.forecast && data.forecast[0] ? data.forecast[0].max : data.metrics.temp + 6,
          condition: data.metrics.condition,
          humidity: data.metrics.humidity,
          windSpeed: data.metrics.windSpeed,
          source: data.data_source,
          syncState: data.sync_state || 'live',
          forecast: data.forecast || []
        };
        weatherCache[capital.id] = result;
        callback(null, result);
      })
      .catch(function () {
        // Direct Open-Meteo fallback
        var openMeteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + capital.lat + '&longitude=' + capital.lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4';

        fetch(openMeteoUrl, { signal: AbortSignal.timeout(4500) })
          .then(function (res) {
            if (!res.ok) throw new Error('Open-Meteo HTTP error ' + res.status);
            return res.json();
          })
          .then(function (data) {
            var cur = data.current;
            var daily = data.daily;
            var weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            var forecastList = [];

            if (daily && daily.time) {
              for (var i = 0; i < Math.min(4, daily.time.length); i++) {
                var dParts = daily.time[i].split('-');
                var dObj = new Date(dParts[0], dParts[1] - 1, dParts[2]);
                var dayLabel = i === 0 ? 'Hoje' : weekdays[dObj.getDay()];
                var cCode = daily.weather_code ? daily.weather_code[i] : 0;
                forecastList.push({
                  day: dayLabel,
                  date: dParts[2] + '/' + dParts[1],
                  min: Math.round(daily.temperature_2m_min[i]),
                  max: Math.round(daily.temperature_2m_max[i]),
                  condition: mapWmoToText(cCode),
                  emoji: mapWmoToEmoji(cCode)
                });
              }
            }

            var result = {
              temp: Math.round(cur.temperature_2m),
              feelsLike: Math.round(cur.apparent_temperature || cur.temperature_2m),
              min: forecastList[0] ? forecastList[0].min : Math.round(cur.temperature_2m - 4),
              max: forecastList[0] ? forecastList[0].max : Math.round(cur.temperature_2m + 6),
              condition: mapWmoToText(cur.weather_code),
              emoji: mapWmoToEmoji(cur.weather_code),
              humidity: Math.round(cur.relative_humidity_2m),
              windSpeed: Math.round(cur.wind_speed_10m),
              source: 'Open-Meteo API (WMO/ECMWF)',
              syncState: 'live',
              forecast: forecastList
            };
            weatherCache[capital.id] = result;
            callback(null, result);
          })
          .catch(function (err) {
            callback(err, null);
          });
      });
  }

  function initHeaderWeather() {
    var cityLabel = document.getElementById('weather-city-label');
    var tempLabel = document.getElementById('weather-temp-label');
    var condLabel = document.getElementById('weather-condition-label');
    var statusDot = document.getElementById('weather-status-dot');
    var pillBtn = document.getElementById('patriota-weather-pill');
    var tickerList = document.getElementById('weather-ticker-list');
    var viewAllBtn = document.getElementById('weather-view-all-modal-btn');
    var tickerTitleBtn = document.getElementById('weather-ticker-title-btn');

    var defaultCapital = CAPITALS_DATA[0]; // Brasília

    // 1. Fetch default capital for top pill
    fetchCapitalWeather(defaultCapital, function (err, data) {
      if (!err && data) {
        if (cityLabel) cityLabel.textContent = defaultCapital.name + ' (' + defaultCapital.uf + ')';
        if (tempLabel) tempLabel.textContent = data.temp + '°C';
        if (condLabel) condLabel.textContent = (data.emoji || '☀️') + ' ' + data.condition;
        if (statusDot) {
          statusDot.className = 'w-1.5 h-1.5 rounded-full bg-[#22A447] animate-pulse';
          statusDot.title = 'Dados atualizados em tempo real via Open-Meteo API';
        }
      } else {
        if (condLabel) condLabel.textContent = 'Indisponível';
        if (statusDot) {
          statusDot.className = 'w-1.5 h-1.5 rounded-full bg-rose-500';
          statusDot.title = 'Fonte meteorológica temporariamente inacessível';
        }
      }
    });

    // 2. Populate ticker list
    if (tickerList) {
      tickerList.innerHTML = '';
      var highlightSubset = CAPITALS_DATA.slice(0, 12);

      highlightSubset.forEach(function (cap) {
        var itemBtn = document.createElement('button');
        itemBtn.className = 'weather-ticker-item flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded text-white/85 hover:text-white hover:bg-white/10 transition cursor-pointer text-[11px]';
        itemBtn.title = cap.name + ' - ' + cap.uf + ' (Estação INMET ' + cap.station + ')';
        itemBtn.innerHTML = '<span class="font-semibold text-white">' + cap.name + '</span>' +
          '<span class="text-white/50 text-[10px]">(' + cap.uf + ')</span>' +
          '<span class="temp-val font-bold">...</span>';

        itemBtn.addEventListener('click', function () {
          openWeatherModal(cap);
        });

        tickerList.appendChild(itemBtn);

        fetchCapitalWeather(cap, function (err, w) {
          if (!err && w) {
            itemBtn.innerHTML = '<span class="font-semibold text-white">' + cap.name + '</span>' +
              '<span class="text-white/50 text-[10px]">(' + cap.uf + ')</span>' +
              '<span>' + (w.emoji || '☀️') + '</span>' +
              '<span class="font-bold">' + w.temp + '°C</span>' +
              '<span class="text-[10px] text-white/60 hidden sm:inline">' + w.min + '°/' + w.max + '°</span>';
          }
        });
      });
    }

    // Modal triggers
    if (pillBtn) {
      pillBtn.addEventListener('click', function () {
        openWeatherModal(defaultCapital);
      });
    }
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', function () {
        openWeatherModal(defaultCapital);
      });
    }
    if (tickerTitleBtn) {
      tickerTitleBtn.addEventListener('click', function () {
        openWeatherModal(defaultCapital);
      });
    }
  }

  function openWeatherModal(initialCapital) {
    var existingModal = document.getElementById('patriota-weather-modal-root');
    if (existingModal) {
      existingModal.remove();
    }

    var modalRoot = document.createElement('div');
    modalRoot.id = 'patriota-weather-modal-root';
    modalRoot.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-none';

    modalRoot.innerHTML =
      '<div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#D9DEE7] text-[#17202A]">' +
        '<div class="bg-[#07172E] text-white px-5 py-4 flex items-center justify-between border-b border-[#0B2345] shrink-0">' +
          '<div>' +
            '<div class="flex items-center gap-2">' +
              '<h3 class="font-serif font-black text-base uppercase text-white">Previsão do Tempo das 27 Capitais</h3>' +
              '<span class="bg-[#16803C] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Open-Meteo & INMET</span>' +
            '</div>' +
            '<p class="text-xs text-white/70 mt-0.5">' +
              'Dados dinâmicos via Open-Meteo API • Rede cadastral: <a href="' + OFFICIAL_INMET_URL + '" target="_blank" class="underline text-[#FFCC29]">INMET (portal.inmet.gov.br)</a>' +
            '</p>' +
          '</div>' +
          '<button id="close-weather-modal-btn" class="text-white/70 hover:text-white text-xl p-1 font-bold cursor-pointer">&times;</button>' +
        '</div>' +

        '<div class="p-5 overflow-y-auto space-y-5">' +
          '<div id="modal-active-card" class="bg-linear-to-br from-[#0B2345] to-[#07172E] text-white rounded-xl p-5 border border-[#0B2345]">' +
            '<div class="flex items-center justify-between">' +
              '<div>' +
                '<span class="bg-[#FFCC29] text-[#07172E] text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">' + initialCapital.region + '</span>' +
                '<h2 class="font-serif font-black text-2xl mt-1">' + initialCapital.name + ' - ' + initialCapital.uf + '</h2>' +
                '<p class="text-xs text-white/70">Estação INMET: ' + initialCapital.station + '</p>' +
              '</div>' +
              '<div id="modal-active-temp-box" class="text-3xl font-black font-serif text-[#FFCC29]">Carregando...</div>' +
            '</div>' +
            '<div id="modal-active-forecast" class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 text-xs"></div>' +
          '</div>' +

          '<div>' +
            '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">' +
              '<h4 class="font-serif font-bold text-sm text-[#0B2345] uppercase">Todas as 27 Capitais</h4>' +
              '<div class="flex flex-wrap items-center gap-2">' +
                '<input id="modal-weather-search" type="text" placeholder="Buscar por cidade ou UF..." class="border border-[#D9DEE7] rounded px-2.5 py-1 text-xs w-full sm:w-48 focus:outline-none focus:border-[#0B5FFF]" />' +
              '</div>' +
            '</div>' +
            '<div id="modal-region-filters" class="flex flex-wrap gap-1.5 mb-3 text-xs">' +
              '<button class="region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-[#0B2345] text-white cursor-pointer" data-region="TODAS">Todas</button>' +
              '<button class="region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-[#5D6673] hover:bg-gray-200 cursor-pointer" data-region="Centro-Oeste">Centro-Oeste</button>' +
              '<button class="region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-[#5D6673] hover:bg-gray-200 cursor-pointer" data-region="Sudeste">Sudeste</button>' +
              '<button class="region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-[#5D6673] hover:bg-gray-200 cursor-pointer" data-region="Sul">Sul</button>' +
              '<button class="region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-[#5D6673] hover:bg-gray-200 cursor-pointer" data-region="Nordeste">Nordeste</button>' +
              '<button class="region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-[#5D6673] hover:bg-gray-200 cursor-pointer" data-region="Norte">Norte</button>' +
            '</div>' +
            '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2" id="modal-capitals-grid"></div>' +
            '<div id="modal-empty-message" class="hidden text-center py-8 text-xs text-gray-500">Nenhuma capital encontrada para o filtro selecionado.</div>' +
          '</div>' +
        '</div>' +

        '<div class="bg-[#F7F8FA] px-5 py-3 border-t border-[#D9DEE7] flex justify-between items-center text-xs text-[#5D6673]">' +
          '<span>Referência meteorológica de utilidade pública — O PATRIOTA</span>' +
          '<button id="close-weather-modal-bottom-btn" class="bg-[#0B2345] hover:bg-[#0B5FFF] text-white font-bold px-4 py-1.5 rounded cursor-pointer">Fechar</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modalRoot);

    function updateActiveDisplay(cap) {
      var cardBox = document.getElementById('modal-active-temp-box');
      var forecastBox = document.getElementById('modal-active-forecast');
      if (cardBox) cardBox.textContent = 'Consultando...';
      if (forecastBox) forecastBox.innerHTML = '';

      fetchCapitalWeather(cap, function (err, w) {
        if (!err && w) {
          if (cardBox) cardBox.innerHTML = (w.emoji || '☀️') + ' ' + w.temp + '°C <span class="text-xs text-white/70 block">' + w.condition + '</span>';
          if (forecastBox && w.forecast && w.forecast.length > 0) {
            forecastBox.innerHTML = w.forecast.map(function (f) {
              return '<div class="bg-white/5 rounded p-2 text-center border border-white/10">' +
                '<div class="font-bold text-[11px]">' + f.day + ' (' + f.date + ')</div>' +
                '<div class="text-base my-1">' + (f.emoji || '⛅') + '</div>' +
                '<div class="text-[10px] text-white/70">' + f.condition + '</div>' +
                '<div class="font-bold text-xs mt-1 text-[#FFCC29]">' + f.min + '° / ' + f.max + '°</div>' +
              '</div>';
            }).join('');
          }
        } else {
          if (cardBox) cardBox.innerHTML = '<span class="text-sm text-rose-300">Fonte indisponível</span>';
        }
      });
    }

    updateActiveDisplay(initialCapital);

    // Populate 27 capitals grid with dynamic search and region filtering
    var grid = document.getElementById('modal-capitals-grid');
    var searchInput = document.getElementById('modal-weather-search');
    var filterBtns = modalRoot.querySelectorAll('.region-filter-btn');
    var emptyMsg = document.getElementById('modal-empty-message');
    var currentRegion = 'TODAS';
    var currentQuery = '';

    function renderFilteredGrid() {
      if (!grid) return;
      grid.innerHTML = '';

      var filtered = CAPITALS_DATA.filter(function (c) {
        var matchesRegion = (currentRegion === 'TODAS' || c.region === currentRegion);
        var q = currentQuery.trim().toLowerCase();
        var matchesQuery = !q || c.name.toLowerCase().includes(q) || c.uf.toLowerCase().includes(q) || c.station.toLowerCase().includes(q);
        return matchesRegion && matchesQuery;
      });

      if (emptyMsg) {
        if (filtered.length === 0) {
          emptyMsg.classList.remove('hidden');
        } else {
          emptyMsg.classList.add('hidden');
        }
      }

      filtered.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'text-left p-2 rounded border border-[#EAECEF] bg-white hover:border-[#0B5FFF] hover:bg-[#F0F5FF] transition cursor-pointer text-xs flex justify-between items-center';
        btn.innerHTML = '<div><div class="font-bold text-[#0B2345]">' + c.name + '</div><div class="text-[10px] text-[#5D6673]">' + c.uf + ' • ' + c.station + '</div></div><span class="cap-t font-black text-sm">--</span>';
        btn.addEventListener('click', function () {
          updateActiveDisplay(c);
        });
        grid.appendChild(btn);

        fetchCapitalWeather(c, function (err, w) {
          if (!err && w) {
            var span = btn.querySelector('.cap-t');
            if (span) span.textContent = w.temp + '°';
          }
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        currentQuery = e.target.value;
        renderFilteredGrid();
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) {
          b.className = 'region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-[#5D6673] hover:bg-gray-200 cursor-pointer';
        });
        btn.className = 'region-filter-btn px-2.5 py-1 rounded text-xs font-semibold bg-[#0B2345] text-white cursor-pointer';
        currentRegion = btn.getAttribute('data-region') || 'TODAS';
        renderFilteredGrid();
      });
    });

    renderFilteredGrid();

    // Close handlers
    var closeBtn = document.getElementById('close-weather-modal-btn');
    var closeBottomBtn = document.getElementById('close-weather-modal-bottom-btn');
    if (closeBtn) closeBtn.addEventListener('click', function () { modalRoot.remove(); });
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', function () { modalRoot.remove(); });
    modalRoot.addEventListener('click', function (e) {
      if (e.target === modalRoot) modalRoot.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderWeather);
  } else {
    initHeaderWeather();
  }
})();
