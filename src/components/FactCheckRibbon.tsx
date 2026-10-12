import React from 'react';
import { FactCheckItem } from '../types';

interface FactCheckRibbonProps {
  factChecks: FactCheckItem[];
  onOpenFactCheck: (item: FactCheckItem) => void;
  onOpenHub: () => void;
}

const advertisingImageUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-SfOIYweBNElCz1bnft0hyvpAiftNuB.png';

export const FactCheckRibbon: React.FC<FactCheckRibbonProps> = () => (
  <section className="mb-14 select-none" aria-label="Espaço publicitário">
    <div className="w-full overflow-hidden rounded border border-[#D9DEE7] bg-[#061A35] shadow-xs">
      <img
        src={advertisingImageUrl}
        alt="Anuncie no O Patriota e alcance um público qualificado"
        className="block h-auto w-full object-contain"
      />
    </div>
  </section>
);

FactCheckRibbon.displayName = 'FactCheckRibbon';
