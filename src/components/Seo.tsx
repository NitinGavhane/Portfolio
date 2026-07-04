import { useEffect } from 'react';
import { siteConfig, absoluteUrl } from '../lib/siteConfig';

type JsonLd = Record<string, unknown>;

interface SeoProps {
  title?: string;
  description?: string;
  /** Site-relative path or absolute URL for the canonical link. */
  path?: string;
  /** Site-relative path or absolute URL for the social share image. */
  image?: string;
  type?: 'website' | 'article' | 'profile';
  /** Prevent indexing (used on admin / 404 pages). */
  noindex?: boolean;
  /** One or more JSON-LD structured-data objects. */
  jsonLd?: JsonLd | JsonLd[];
  /** ISO date strings for article metadata. */
  publishedTime?: string;
  modifiedTime?: string;
}

const MANAGED = 'data-seo-managed';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  // Reuse any existing tag (e.g. the static canonical in index.html) so we
  // never emit duplicates; create a managed one only if none exists.
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Imperative document-head manager for this SPA (no SSR / react-helmet dependency).
 * Renders nothing; sets title, meta, canonical and JSON-LD for the current route.
 */
const Seo = ({
  title,
  description = siteConfig.description,
  path = '/',
  image = siteConfig.ogImage,
  type = 'website',
  noindex = false,
  jsonLd,
  publishedTime,
  modifiedTime,
}: SeoProps) => {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  // Stable primitive key so the effect only re-runs when the data changes,
  // not on every render (jsonLd is a fresh object/array each render).
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', canonical);

    // Open Graph
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:site_name', siteConfig.brand);
    upsertMeta('property', 'og:locale', siteConfig.locale);

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertMeta('name', 'twitter:site', siteConfig.social.twitterHandle);

    if (type === 'article') {
      if (publishedTime) upsertMeta('property', 'article:published_time', publishedTime);
      if (modifiedTime) upsertMeta('property', 'article:modified_time', modifiedTime);
    }

    // JSON-LD structured data
    const scripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((block) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.setAttribute(MANAGED, '');
        s.text = JSON.stringify(block);
        document.head.appendChild(s);
        scripts.push(s);
      });
    }

    return () => {
      scripts.forEach((s) => s.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullTitle, description, canonical, imageUrl, type, noindex, jsonLdKey, publishedTime, modifiedTime]);

  return null;
};

export default Seo;
