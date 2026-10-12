import { useEffect } from 'react';
import { CANONICAL_ORIGIN, getCanonicalUrl, toAbsoluteUrl } from '../config/siteDomain';

export interface SeoMetadataOptions {
  title?: string;
  description?: string;
  pathname?: string;
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const DEFAULT_TITLE = 'O Patriota — Portal Jornalístico';
const DEFAULT_DESC =
  'Portal jornalístico profissional de notícias, análise, opinião e checagem de fatos por um Brasil mais forte.';
const DEFAULT_IMAGE = `${CANONICAL_ORIGIN}/images/hero_congresso.jpg`;

export function useSeoMetadata(options: SeoMetadataOptions) {
  useEffect(() => {
    // 1. Title
    const title = options.title ? `${options.title} — O Patriota` : DEFAULT_TITLE;
    document.title = title;

    // 2. Canonical URL
    const canonical = options.canonicalUrl 
      ? options.canonicalUrl 
      : getCanonicalUrl(options.pathname || window.location.pathname);

    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // 3. Meta description
    const desc = options.description || DEFAULT_DESC;
    setMetaTag('name', 'description', desc);

    // 4. OpenGraph
    setMetaTag('property', 'og:title', options.title || DEFAULT_TITLE);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:type', options.type || 'website');
    setMetaTag('property', 'og:image', options.imageUrl ? toAbsoluteUrl(options.imageUrl) : DEFAULT_IMAGE);

    // 5. Twitter
    setMetaTag('name', 'twitter:title', options.title || DEFAULT_TITLE);
    setMetaTag('name', 'twitter:description', desc);
    setMetaTag('name', 'twitter:image', options.imageUrl ? toAbsoluteUrl(options.imageUrl) : DEFAULT_IMAGE);

    // 6. Article JSON-LD if applicable
    let scriptTag: HTMLScriptElement | null = null;
    if (options.type === 'article' && options.articleMeta) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: options.title,
        description: desc,
        image: [options.imageUrl ? toAbsoluteUrl(options.imageUrl) : DEFAULT_IMAGE],
        datePublished: options.articleMeta.publishedTime,
        dateModified: options.articleMeta.modifiedTime || options.articleMeta.publishedTime,
        author: [
          {
            '@type': 'Person',
            name: options.articleMeta.author || 'Redação O Patriota',
          },
        ],
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'O Patriota',
          url: CANONICAL_ORIGIN,
          logo: {
            '@type': 'ImageObject',
            url: `${CANONICAL_ORIGIN}/pwa-icon-512.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical,
        },
      };

      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.id = 'article-json-ld';
      scriptTag.text = JSON.stringify(jsonLd);
      document.head.appendChild(scriptTag);
    }

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [
    options.title,
    options.description,
    options.pathname,
    options.canonicalUrl,
    options.imageUrl,
    options.type,
    options.articleMeta?.publishedTime,
    options.articleMeta?.modifiedTime,
    options.articleMeta?.author,
    options.articleMeta?.section,
  ]);
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
