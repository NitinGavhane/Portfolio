// Seeds the Supabase `blog_posts` table from src/lib/blogPosts.ts.
// Existing rows with the same slug are updated (upsert on slug), so this is
// safe to re-run. Posts are inserted as published.
//
// Usage:
//   1. Add your Supabase SERVICE ROLE key to .env (never commit it):
//        SUPABASE_SERVICE_ROLE_KEY=eyJ...        (Dashboard → Settings → API)
//   2. npm run seed:blog
//
// The service role key bypasses Row Level Security, which is required to
// insert content non-interactively.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Minimal .env parser (Vite env is not available to plain node scripts).
function readEnv() {
  const env = { ...process.env };
  try {
    const raw = readFileSync(join(root, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* no .env file */
  }
  return env;
}

// Extract the exported blogPosts array from the TS source without a TS loader.
function loadStaticPosts() {
  const src = readFileSync(join(root, 'src/lib/blogPosts.ts'), 'utf8');
  const match = src.match(/export const blogPosts[^=]*=\s*(\[[\s\S]*\]);\s*$/);
  if (!match) throw new Error('Could not locate blogPosts array in blogPosts.ts');
  // The array is plain data (object + string/template literals) — valid JS.
  return new Function(`return ${match[1]}`)();
}

const env = readEnv();
const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing config. Ensure .env has VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n' +
      'Get the service role key from Supabase → Settings → API → service_role.'
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const posts = loadStaticPosts().map((p) => ({
  title: p.title,
  slug: p.slug,
  content: p.content,
  excerpt: p.excerpt,
  category: p.category,
  image_url: p.image || '',
  read_time: p.readTime,
  published: true,
  created_at: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const { data, error } = await supabase
  .from('blog_posts')
  .upsert(posts, { onConflict: 'slug' })
  .select('slug, published');

if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}

console.log(`Seeded ${data.length} post(s):`);
data.forEach((d) => console.log(`  • ${d.slug} (published: ${d.published})`));
