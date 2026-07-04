import { siteConfig, absoluteUrl } from './siteConfig';

/** Person + WebSite graph for the homepage (E-A-T signals). */
export function personAndSiteJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
      jobTitle: siteConfig.jobTitle,
      email: `mailto:${siteConfig.author.email}`,
      image: absoluteUrl(siteConfig.ogImage),
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.author.location,
      },
      sameAs: [
        siteConfig.social.github,
        siteConfig.social.linkedin,
        siteConfig.social.twitter,
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.brand,
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
    },
  ];
}

/** Blog listing collection page. */
export function blogCollectionJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} — Blog`,
    url: absoluteUrl('/blog'),
    description: 'Articles on web development, security, AI, and technology strategy.',
    inLanguage: siteConfig.language,
    author: { '@type': 'Person', name: siteConfig.name, url: siteConfig.url },
  };
}

interface ArticleInput {
  title: string;
  description: string;
  slug: string;
  image?: string;
  published?: string;
  modified?: string;
}

/** Article + BreadcrumbList for a single blog post. */
export function articleJsonLd(a: ArticleInput) {
  const url = absoluteUrl(`/blog/${a.slug}`);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.description,
      image: a.image ? absoluteUrl(a.image) : absoluteUrl(siteConfig.ogImage),
      url,
      mainEntityOfPage: url,
      datePublished: a.published,
      dateModified: a.modified || a.published,
      inLanguage: siteConfig.language,
      author: { '@type': 'Person', name: siteConfig.name, url: siteConfig.url },
      publisher: {
        '@type': 'Person',
        name: siteConfig.name,
        logo: { '@type': 'ImageObject', url: absoluteUrl(siteConfig.ogImage) },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
        { '@type': 'ListItem', position: 3, name: a.title, item: url },
      ],
    },
  ];
}
