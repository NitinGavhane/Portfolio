// Prints an upsert SQL statement for one static blog post, ready to paste into
// the Supabase SQL Editor (no service key needed).
//
// Usage: node scripts/post-to-sql.mjs <slug>
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const slugArg = process.argv[2];
if (!slugArg) {
  console.error('Usage: node scripts/post-to-sql.mjs <slug>');
  process.exit(1);
}

const src = readFileSync(join(root, 'src/lib/blogPosts.ts'), 'utf8');
const match = src.match(/export const blogPosts[^=]*=\s*(\[[\s\S]*\]);\s*$/);
if (!match) throw new Error('Could not locate blogPosts array');
const posts = new Function(`return ${match[1]}`)();

const p = posts.find((x) => x.slug === slugArg);
if (!p) {
  console.error(`No post with slug "${slugArg}". Available: ${posts.map((x) => x.slug).join(', ')}`);
  process.exit(1);
}

const q = (s) => `'${String(s ?? '').replace(/'/g, "''")}'`;
const iso = (d) => (d ? new Date(d).toISOString() : new Date().toISOString());

const sql = `INSERT INTO blog_posts (title, slug, content, excerpt, category, image_url, read_time, published, created_at, updated_at)
VALUES (
  ${q(p.title)},
  ${q(p.slug)},
  ${q(p.content)},
  ${q(p.excerpt)},
  ${q(p.category)},
  ${q(p.image || '')},
  ${q(p.readTime)},
  true,
  ${q(iso(p.date))},
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title      = EXCLUDED.title,
  content    = EXCLUDED.content,
  excerpt    = EXCLUDED.excerpt,
  category   = EXCLUDED.category,
  image_url  = EXCLUDED.image_url,
  read_time  = EXCLUDED.read_time,
  published  = EXCLUDED.published,
  updated_at = NOW();`;

console.log(sql);
