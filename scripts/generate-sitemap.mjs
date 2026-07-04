// Generates public/sitemap.xml from static routes + blog post slugs.
// Runs automatically before `npm run build` (see package.json prebuild).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://nitingavhane.com').replace(/\/$/, '');

// Static routes with change frequency + priority.
const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/disclaimer', changefreq: 'yearly', priority: '0.3' },
];

// Extract slug + date from the static blog data.
function readPosts() {
  try {
    const src = readFileSync(join(root, 'src/lib/blogPosts.ts'), 'utf8');
    const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
    const dates = [...src.matchAll(/date:\s*'([^']+)'/g)].map((m) => m[1]);
    return slugs.map((slug, i) => ({ slug, date: dates[i] }));
  } catch {
    return [];
  }
}

const today = new Date().toISOString().slice(0, 10);

const urls = [
  ...staticRoutes.map(
    (r) =>
      `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
  ),
  ...readPosts().map(
    (p) =>
      `  <url>\n    <loc>${SITE_URL}/blog/${p.slug}</loc>\n    <lastmod>${p.date || today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
  '\n'
)}\n</urlset>\n`;

writeFileSync(join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml generated with ${urls.length} URLs for ${SITE_URL}`);
