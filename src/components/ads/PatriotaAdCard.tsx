import React from 'react';

const AD_IMAGES = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-00-16-6DTm9nLNSzMKkrZARFcCLlBkVkzjCV.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-01-29-PzaqgAsLWQBLYvwC094hNzJ8b0ks1n.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-01-46-iwnW540Zy8qZlQtPx2KNmYNhSReD0g.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-02-01-2DPF4Gz8upiR3trq1kPdXQwYfSHBTx.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-04-36-FyUXHPeXdEWc0dsgRGaCfKIfGIz5fC.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-04-54-WmB3xFFlgWPObVKQErU04rdhNxiyGx.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-05-05-Uw2LCtYP2WZKoHqmL5ZHrHgshgNgZG.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-05-16-ZcxWsqZNmIxxR1tog4QucuVmsJJ289.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-05-25-dAi7IcVxVpNDh2RGoWtzgyZXs8B2YC.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20tela%20de%202026-10-12%2021-17-21-eiQvJFBrhdBP65VBteXaBulrZKI2XX.png',
] as const;

interface PatriotaAdCardProps {
  variant?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
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
        className={`block w-full object-contain ${variant === 8 ? 'h-20 sm:h-24 lg:h-28 bg-[#0B2345]' : 'h-auto object-cover'}`}
        loading="lazy"
      />
    </a>
  );
}

export const patriotaAdImages = AD_IMAGES;
