import { supabase, isSupabaseConfigured } from './supabase';
import { blogPosts as staticPosts } from './blogPosts';
import type { BlogPost } from './supabaseSchema';

function toBlogPost(p: (typeof staticPosts)[number]): BlogPost {
  return {
    id: p.slug,
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: p.excerpt,
    category: p.category,
    image_url: p.image || '',
    read_time: p.readTime,
    published: true,
    created_at: p.date,
    updated_at: p.date,
  };
}

const staticAsPosts = (): BlogPost[] => staticPosts.map(toBlogPost);

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return staticAsPosts();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Fall back to bundled posts if the DB is unreachable or has no content,
  // so the blog is never empty (important for readers and AdSense review).
  if (error || !data || data.length === 0) return staticAsPosts();
  return data;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (data) return data;
  }
  const post = staticPosts.find((p) => p.slug === slug);
  return post ? toBlogPost(post) : null;
}

export async function getCategories(): Promise<string[]> {
  const fallback = ['All', ...new Set(staticPosts.map((p) => p.category))].sort((a, b) =>
    a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)
  );

  if (!isSupabaseConfigured) return fallback;

  const { data, error } = await supabase.from('blog_posts').select('category').eq('published', true);
  if (error || !data || data.length === 0) return fallback;

  const cats = [...new Set(data.map((d) => d.category))];
  return ['All', ...cats.sort()];
}
