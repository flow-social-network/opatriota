import React, { useEffect, useState } from 'react';
import { api } from '../../services/apiClient';

type PublishedAd = { id: string; title: string; imageUrl: string; destinationUrl: string; placement: string };
import { AdPosition, AdSpaceConfig, GoogleAdSenseConfig } from '../../types';

interface AdBannerProps {
  position: AdPosition;
  adSpace?: AdSpaceConfig;
  adSenseConfig?: GoogleAdSenseConfig;
  className?: string;
  onNavigateAdvertise?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  position,
  adSpace,
  adSenseConfig,
  className = '',
  onNavigateAdvertise
}) => {
  const [publishedAd, setPublishedAd] = useState<PublishedAd | null>(null);
  const placement = position === 'HOME_TOP_BANNER' ? 'top_banner' : position.includes('SIDEBAR') ? 'sidebar' : position === 'HOME_PRE_FOOTER' ? 'bottom_banner' : 'middle_banner';

  useEffect(() => {
    let active = true;
    void api.get<PublishedAd[]>(`/advertising/ads?placement=${placement}`, { timeoutMs: 8000 }).then((items) => {
      if (active) setPublishedAd(items[0] || null);
    }).catch(() => { if (active) setPublishedAd(null); });
    return () => { active = false; };
  }, [placement]);

  useEffect(() => {
    if (publishedAd) void api.post('/advertising/events', { advertisementId: publishedAd.id, eventType: 'impression', placement }).catch(() => undefined);
  }, [publishedAd, placement]);

  // If ad position not found or explicitly deactivated, do not render anything
  if (!adSpace || !adSpace.active) {
    return null;
  }

  // Determine size styling based on recommended dimensions
  const getDimensionClasses = () => {
    switch (adSpace.dimensions) {
      case '300x250':
        return 'w-[300px] h-[250px] max-w-full';
      case '728x90':
        return 'w-full max-w-[728px] h-[90px] sm:h-[90px]';
      case '970x250':
        return 'w-full max-w-[970px] min-h-[90px] sm:min-h-[140px] md:min-h-[250px]';
      default:
        return 'w-full max-w-4xl min-h-[90px]';
    }
  };

  const isLiveAdSense = adSpace.platform === 'adsense' && adSenseConfig?.enabled;

  return (
    <aside 
      aria-label={`Publicidade: ${adSpace.name}`}
      className={`my-4 flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Top Disclaimer Label (Exigência do Google AdSense e CONAR) */}
      <div className="flex items-center gap-2 mb-1 text-[9px] font-bold text-[#8C95A6] uppercase tracking-wider">
        <span>PUBLICIDADE</span>
        <span>•</span>
        <span>{isLiveAdSense ? 'ANÚNCIO GOOGLE' : 'ESPAÇO RESERVADO'}</span>
      </div>

      {/* Ad Container Box */}
      <div className={`relative bg-[#F1F3F5] border border-dashed border-[#CBD5E1] rounded overflow-hidden flex flex-col items-center justify-center text-center p-3 transition-colors ${getDimensionClasses()}`}>
        {publishedAd ? (
          <a href={publishedAd.destinationUrl} target="_blank" rel="noopener noreferrer sponsored" className="block h-full w-full" onClick={() => { void api.post('/advertising/events', { advertisementId: publishedAd.id, eventType: 'click', placement }); }}>
            <img src={publishedAd.imageUrl} alt={publishedAd.title} className="h-full w-full object-cover" loading="lazy" />
          </a>
        ) : isLiveAdSense ? (
          <div className="w-full h-full flex items-center justify-center">
            {/* Live Google AdSense Block */}
            <ins 
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client={adSenseConfig.publisherId}
              data-ad-slot={adSpace.adSlotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : adSpace.platform === 'custom' && adSpace.customBannerUrl ? (
          /* Custom direct advertiser banner */
          <a 
            href={adSpace.customLinkUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full h-full block"
          >
            <img 
              src={adSpace.customBannerUrl} 
              alt={adSpace.customAltText || adSpace.name}
              className="w-full h-full object-cover" 
            />
          </a>
        ) : (
          /* Demo & Reserved Space Presentation */
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="font-serif font-black text-[#0B2345] text-xs sm:text-sm tracking-wide mb-0.5">
              O PATRIOTA BRASIL
            </span>
            <span className="text-[10px] text-[#5D6673] font-medium leading-tight mb-2">
              Espaço publicitário para marcas que apoiam a liberdade e o desenvolvimento do país.
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold bg-[#E2E8F0] text-[#475569] px-2 py-0.5 rounded">
                {adSpace.dimensions}
              </span>
              <button 
                onClick={onNavigateAdvertise}
                className="text-[9px] font-bold text-white bg-[#0B2345] hover:bg-[#0B5FFF] px-2.5 py-0.5 rounded transition cursor-pointer"
              >
                Anuncie Conosco
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
