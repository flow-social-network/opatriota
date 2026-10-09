import React from 'react';
import { AdSlotConfig, AdSenseGlobalConfig, AdSlotPosition } from '../../types';
import { Megaphone, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdSlotProps {
  position: AdSlotPosition;
  adSlots: AdSlotConfig[];
  adsense: AdSenseGlobalConfig;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  position,
  adSlots,
  adsense,
  className = ''
}) => {
  const slot = adSlots.find(s => s.position === position);

  // If slot not configured or deactivated by the admin, collapse with ZERO DOM waste/empty space
  if (!slot || !slot.active) {
    return null;
  }

  const isRealAdSenseActive = adsense.enabled && adsense.publisherId && !adsense.testMode && slot.platform === 'adsense';

  return (
    <aside 
      aria-label={`Espaço publicitário: ${slot.name}`}
      className={`w-full my-6 select-none ${className}`}
    >
      <div className="max-w-[1360px] mx-auto px-4">
        {/* Subtle label conforming to Brazilian advertising standards (CONAR) */}
        <div className="flex items-center justify-between text-[9px] font-bold text-[#8C9BAE] uppercase tracking-widest mb-1.5 px-1">
          <span>PUBLICIDADE</span>
          <span className="hidden sm:inline font-mono text-[8px] text-[#A0AEC0]">{slot.format.replace('_', ' ').toUpperCase()}</span>
        </div>

        {isRealAdSenseActive ? (
          /* Live Google AdSense Container */
          <div 
            style={{ minHeight: `${slot.height}px` }}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded overflow-hidden flex items-center justify-center"
          >
            <ins 
              className="adsbygoogle"
              style={{ display: 'block', minHeight: `${slot.height}px`, width: '100%' }}
              data-ad-client={adsense.publisherId}
              data-ad-slot={slot.slotId || '1234567890'}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          /* High-fidelity editorial placeholder banner in test/demo mode (avoids CLS layout shift) */
          <div 
            style={{ minHeight: `${slot.height}px` }}
            className="w-full bg-gradient-to-r from-[#0B2345]/5 via-[#0B2345]/10 to-[#0B2345]/5 border border-[#D9DEE7] rounded-lg flex flex-col items-center justify-center p-4 text-center group hover:border-[#0B5FFF] transition"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B2345] mb-1">
              <Megaphone className="w-3.5 h-3.5 text-[#FFCC29]" />
              <span>{slot.demoTitle || slot.name}</span>
            </div>
            <p className="text-[11px] text-[#5D6673] max-w-lg leading-relaxed">
              Anuncie para leitores qualificados e tomadores de decisão em todo o Brasil. Espaço gerenciado pela Central de Publicidade de O Patriota.
            </p>
            <div className="mt-2.5 flex items-center gap-3 text-[10px] font-semibold text-[#0B5FFF]">
              <span className="bg-white px-2.5 py-0.5 rounded border border-[#D9DEE7] text-[#17202A]">
                Dimensões: {slot.width}x{slot.height}px
              </span>
              <span className="hover:underline flex items-center gap-1 cursor-pointer">
                <span>Comercial & Mídia Kit</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
