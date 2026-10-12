import React from 'react';
import { AdSlotConfig, AdSenseGlobalConfig, AdSlotPosition } from '../../types';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

interface AdSlotProps {
  position: AdSlotPosition;
  adSlots: AdSlotConfig[];
  adsense: AdSenseGlobalConfig;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ position, adSlots, adsense, className = '' }) => {
  const slot = adSlots.find((item) => item.position === position);
  if (!slot || !slot.active) return null;

  if (slot.platform === 'adsense') {
    const publisherId = String(adsense.publisherId || '').trim();
    const slotId = String(slot.slotId || '').trim();
    if (!adsense.enabled || adsense.testMode || !publisherId || !/^ca-pub-\d+$/.test(publisherId) || !/^\d+$/.test(slotId)) {
      return null;
    }

    return (
      <aside aria-label="Publicidade" className={`my-6 w-full ${className}`}>
        <div className="mx-auto w-full max-w-[1360px] px-4">
          <div className="mb-1.5 px-1 text-[9px] font-bold uppercase tracking-widest text-[#8C9BAE]">PUBLICIDADE</div>
          <div style={{ minHeight: `${slot.height}px` }} className="w-full overflow-hidden">
            <ins
              className="adsbygoogle"
              style={{ display: 'block', minHeight: `${slot.height}px`, width: '100%' }}
              data-ad-client={publisherId}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </aside>
    );
  }

  if (slot.platform === 'direct' && String(slot.customHtml || '').trim()) {
    const safeHtml = sanitizeHtml(String(slot.customHtml));
    if (!safeHtml.trim()) return null;
    return (
      <aside aria-label="Publicidade" className={`my-6 w-full ${className}`}>
        <div className="mx-auto w-full max-w-[1360px] px-4">
          <div className="mb-1.5 px-1 text-[9px] font-bold uppercase tracking-widest text-[#8C9BAE]">PUBLICIDADE</div>
          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </div>
      </aside>
    );
  }

  // Empty, test or incomplete ad slots never render fabricated public ad content.
  return null;
};
