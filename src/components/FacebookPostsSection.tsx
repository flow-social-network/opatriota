import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FacebookPostsSectionProps {
  posts: {
    href: string;
    width?: number;
    height?: number;
  }[];
}

export const FacebookPostsSection: React.FC<FacebookPostsSectionProps> = ({ posts }) => {
  const visiblePosts = posts
    .filter((post) => {
      try {
        const url = new URL(post.href);
        return url.protocol === 'https:' && url.hostname === 'www.facebook.com';
      } catch {
        return false;
      }
    })
    .slice(0, 3);

  if (visiblePosts.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="facebook-posts-heading">
      <div className="flex flex-col gap-2 border-b-2 border-[#0B2345] pb-3 mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0B5FFF]">Nas redes</p>
          <h2 id="facebook-posts-heading" className="font-serif text-2xl sm:text-3xl font-black text-[#0B2345]">
            O Patriota no Facebook
          </h2>
        </div>
        <a
          href="https://www.facebook.com/opatriota.news.brasil"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5FFF] hover:underline"
        >
          Ver página completa <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <article key={post.href} className="min-w-0 overflow-hidden rounded-lg border border-[#D9DEE7] bg-white">
            <iframe
              title="Publicação de O Patriota no Facebook"
              src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(post.href)}&show_text=true&width=500`}
              loading="lazy"
              width="500"
              height={post.height ?? 420}
              style={{ border: 'none', overflow: 'hidden', width: '100%', minHeight: 320 }}
              scrolling="no"
              frameBorder="0"
              allow="encrypted-media; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="border-t border-[#EAECEF] px-3 py-2 text-right">
              <a href={post.href} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#0B5FFF] hover:underline">
                Abrir publicação original
              </a>
            </div>
          </article>
        ))}
      </div>
      {posts.length > visiblePosts.length && (
        <p className="mt-3 text-xs text-[#717E8E]">
          A mostrar {visiblePosts.length} publicações para manter a página leve. Consulte a página do Facebook para ver as restantes.
        </p>
      )}
    </section>
  );
};
