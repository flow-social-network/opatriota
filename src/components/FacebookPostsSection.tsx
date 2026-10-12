import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FacebookPostLink {
  href: string;
}

interface FacebookPostsSectionProps {
  posts?: FacebookPostLink[];
}

function isFacebookPostUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      ['facebook.com', 'www.facebook.com', 'm.facebook.com'].includes(url.hostname.toLowerCase()) &&
      /\/(posts|permalink|photo|videos)\//i.test(url.pathname);
  } catch {
    return false;
  }
}

export const FacebookPostsSection: React.FC<FacebookPostsSectionProps> = ({ posts = [] }) => {
  const validPosts = posts.filter((post) => isFacebookPostUrl(post.href));

  return (
    <section className="my-8 rounded-xl border border-[#D9DEE7] bg-white p-4 sm:p-6" aria-labelledby="facebook-posts-title">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="facebook-posts-title" className="text-lg font-bold text-[#0B2345]">Publicações do Facebook</h2>
        <a href="https://www.facebook.com/opatriota.news.brasil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B5FFF] hover:underline">
          Página do jornal <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {validPosts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#CBD5E0] bg-[#F8FAFC] p-4 text-sm leading-6 text-[#52677A]">
          A integração de publicações do Facebook ainda não está conectada a uma fonte de dados configurada. Não exibimos publicações, imagens nem métricas simuladas.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {validPosts.map((post, index) => (
            <article key={post.href} className="min-w-0 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
              <iframe
                title={`Publicação ${index + 1} do Facebook`}
                src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(post.href)}&show_text=true&width=500`}
                width="100%"
                height="560"
                style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
              <p className="px-3 pb-3 text-xs text-[#64748B]">
                Se a publicação não puder ser incorporada, <a href={post.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0B5FFF] underline">abra-a no Facebook</a>.
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
