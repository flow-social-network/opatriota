import React from 'react';

const AD_IMAGES = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-00-16-6DTm9nLNSzMKkrZARFcCLlBkVkzjCV.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-01-29-PzaqgAsLWQBLYvwC094hNzJ8b0ks1n.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-01-46-iwnW540Zy8qZlQtPx2KNmYNhSReD0g.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-02-01-2DPF4Gz8upiR3trq1kPdXQwYfSHBTx.png',
] as const;

interface PatriotaAdCardProps {
  variant?: 0 | 1 | 2 | 3;
  className?: string;
}

export function PatriotaAdCard({ variant = 0, className = '' }: PatriotaAdCardProps) {
  return (
    <a
      href="/anuncie"
      aria-label="Anuncie no O Patriota"
      className={`group block overflow-hidden rounded-lg border border-[#D9DEE7] bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <img
        src={AD_IMAGES[variant]}
        alt="Anuncie sua marca no O Patriota"
        className="block h-auto w-full object-cover"
        loading="lazy"
      />
    </a>
  );
}

export const patriotaAdImages = AD_IMAGES;
