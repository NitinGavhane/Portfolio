/**
 * Single source of truth for site-wide metadata.
 * Used by SEO tags, structured data, sitemap, and legal pages.
 */

const envUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const siteConfig = {
  // Canonical origin, no trailing slash. Override with VITE_SITE_URL at build time.
  url: (envUrl && envUrl.replace(/\/$/, '')) || 'https://nitingavhane.com',

  name: 'Nitin Gavhane',
  brand: 'nitingavhane.com',
  title: 'Nitin Gavhane — Web Development, Security & Tech Consulting',
  description:
    'Nitin Gavhane is a Full-Stack Developer and Tech Consultant building secure web applications, providing QA auditing, technical writing, and strategic advisory for growing businesses.',
  jobTitle: 'Full-Stack Developer & Tech Consultant',
  locale: 'en_US',
  language: 'en',

  author: {
    name: 'Nitin Gavhane',
    email: 'nitin.gavhane.dev@gmail.com',
    location: 'Maharashtra, India',
  },

  // Used for og:image fallback and Person/Organization structured data.
  ogImage: '/MN.png',

  social: {
    github: 'https://github.com/NitinGavhane',
    linkedin: 'https://www.linkedin.com/in/nitinsgavhane/',
    twitter: 'https://x.com/NitinGavhane_',
    twitterHandle: '@NitinGavhane_',
  },

  // Google AdSense publisher id, e.g. "ca-pub-1234567890123456".
  // Set VITE_ADSENSE_CLIENT in .env; leave blank to disable ads entirely.
  adsenseClient: (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) || '',
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return siteConfig.url + (path.startsWith('/') ? path : `/${path}`);
}
