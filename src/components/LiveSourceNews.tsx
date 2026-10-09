import React, { useEffect, useState } from "react";
import { ExternalLink, Newspaper } from "lucide-react";
import { ArticleImage } from "./ArticleImage";

type FeedItem = {
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
  imageUrl: string | null;
  source: string;
};
type FeedResponse = { source: string; sourceUrl: string; updatedAt: string; items: FeedItem[] };

export const LiveSourceNews: React.FC = () => {
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/news", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("feed unavailable"); return response.json(); })
      .then((data: FeedResponse) => { setFeed(data); setError(false); })
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, []);

  if (!feed?.items?.length && !error) {
    return <section className="my-8 rounded-lg border border-[#D9DEE7] bg-white p-5 text-sm text-[#5D6673]">Consultando últimas notícias da Agência Brasil…</section>;
  }

  return (
    <section className="my-8" aria-labelledby="live-source-news-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b-2 border-[#0B2345] pb-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#16803C]"><Newspaper size={14}/> Feed de fonte externa</div>
          <h2 id="live-source-news-heading" className="font-serif text-2xl font-black text-[#0B2345]">Últimas notícias</h2>
          <p className="mt-1 text-xs text-[#5D6673]">Manchetes e resumos da Agência Brasil, com link para a publicação original.</p>
        </div>
        <a href="https://agenciabrasil.ebc.com.br/ultimas" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#0B2345] hover:text-[#16803C]">Ver todas na fonte <ExternalLink size={13}/></a>
      </div>
      {error && <p className="mb-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">O feed está temporariamente indisponível. As notícias editoriais do portal continuam disponíveis.</p>}
      {feed?.items?.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feed.items.slice(0, 6).map((item) => (
            <article key={item.link} className="overflow-hidden rounded-lg border border-[#D9DEE7] bg-white transition-shadow hover:shadow-md">
              {item.imageUrl ? <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={item.title}><ArticleImage src={item.imageUrl} alt={item.title} className="h-44 w-full object-cover" fallbackClassName="h-44 w-full"/></a> : <div className="flex h-16 items-center gap-2 bg-[#F1F3F5] px-4 text-xs font-semibold text-[#5D6673]"><Newspaper size={16}/> Agência Brasil</div>}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2 text-[10px] text-[#5D6673]"><span className="font-bold uppercase tracking-wide text-[#16803C]">{item.source}</span><span>{item.publishedAt ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(item.publishedAt)) : ""}</span></div>
                <h3 className="font-serif text-lg font-bold leading-snug text-[#0B2345]"><a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.title}</a></h3>
                {item.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#4B5563]">{item.summary}</p>}
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0B2345]">Ler na fonte <ExternalLink size={12}/></a>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      <p className="mt-3 text-[10px] text-[#6B7280]">Fonte: Agência Brasil. Imagens exibidas apenas quando fornecidas pelo feed; confira crédito e condições de reprodução antes de reutilização fora desta chamada com link.</p>
    </section>
  );
};
