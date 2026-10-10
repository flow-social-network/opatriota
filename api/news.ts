type FeedItem = {
  title: string;
  link: string;
  summary: string;
  publishedAt: string | null;
  imageUrl: string | null;
  source: "Agência Brasil";
};

const FEED_URL = "https://agenciabrasil.ebc.com.br/rss.xml";
const escapeXml = (value: string) => value
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

const tag = (xml: string, name: string) => {
  const re = new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + name + ">", "i");
  const match = xml.match(re);
  return match ? escapeXml(match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ")) : "";
};

function parseItems(xml: string): FeedItem[] {
  const blocks = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) || [];
  return blocks.slice(0, 12).map((block) => {
    const title = tag(block, "title");
    const link = tag(block, "link");
    const description = tag(block, "description");
    const pubDate = tag(block, "pubDate");
    const mediaMatch = block.match(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*?(?:url|href)=["']([^"']+)["'][^>]*>/i);
    const htmlImage = description.match(/<img\b[^>]*src=["']([^"']+)["']/i);
    let imageUrl = mediaMatch?.[1] || htmlImage?.[1] || null;
    if (imageUrl) {
      imageUrl = escapeXml(imageUrl);
      try {
        const parsed = new URL(imageUrl);
        if (parsed.protocol !== "https:" || !/(^|\.)agenciabrasil\.ebc\.com\.br$/.test(parsed.hostname)) imageUrl = null;
      } catch { imageUrl = null; }
    }
    let publishedAt: string | null = null;
    if (pubDate) {
      const date = new Date(pubDate);
      if (!Number.isNaN(date.getTime())) publishedAt = date.toISOString();
    }
    let safeLink = "";
    try {
      const parsed = new URL(link);
      if (parsed.protocol === "https:" && parsed.hostname === "agenciabrasil.ebc.com.br") safeLink = parsed.toString();
    } catch {}
    return {
      title: title.slice(0, 240),
      link: safeLink,
      summary: description.slice(0, 420),
      publishedAt,
      imageUrl,
      source: "Agência Brasil" as const,
    };
  }).filter(item => item.title && item.link);
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const response = await fetch(FEED_URL, {
      headers: { "User-Agent": "OPatriotaNews/1.0 (+https://opatriota.com.br)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return res.status(502).json({ error: "A fonte de notícias está temporariamente indisponível." });
    const xml = await response.text();
    const items = parseItems(xml);
    return res.status(200).json({ source: "Agência Brasil", sourceUrl: "https://agenciabrasil.ebc.com.br/", updatedAt: new Date().toISOString(), items });
  } catch {
    return res.status(502).json({ error: "Não foi possível consultar o feed de notícias." });
  }
}
