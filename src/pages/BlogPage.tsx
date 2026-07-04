import { useState, useEffect, useRef } from 'react';
import { getAllPosts, getCategories } from '../lib/blogService';
import BlogPostCard from '../components/ui/BlogPostCard';
import CTAStrip from '../components/ui/CTAStrip';
import AdSense from '../components/AdSense';
import Seo from '../components/Seo';
import { blogCollectionJsonLd } from '../lib/structuredData';
import type { BlogPost } from '../lib/supabaseSchema';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllPosts().then(setPosts);
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.05 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      <Seo
        title="Blog"
        description="Articles on web development, application security, AI, and technology strategy by Nitin Gavhane."
        path="/blog"
        jsonLd={blogCollectionJsonLd()}
      />
      <div className="border-b border-[var(--border-primary)]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-24 sm:pt-28 pb-6">
          <h1 className="font-serif text-4xl sm:text-5xl text-[var(--text-primary)] mb-2">Blog</h1>
          <p className="text-sm text-[var(--text-tertiary)]">
            Thoughts on web development, security, AI, and strategy.
          </p>
        </div>
        <div ref={ref} className="max-w-5xl mx-auto px-6 sm:px-8 pb-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm transition-colors duration-200 rounded-full ${
                  activeCategory === cat
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-[var(--bg-primary)]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
          {filtered.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No articles found in this category.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-14">
              {filtered.map((post, i) => (
                <BlogPostCard key={post.slug} post={{
                  slug: post.slug,
                  title: post.title,
                  date: post.created_at?.split('T')[0] || '',
                  readTime: post.read_time,
                  category: post.category,
                  excerpt: post.excerpt,
                  image: post.image_url,
                }} index={i} isVisible={isVisible} />
              ))}
            </div>
          )}

          <div className="mt-16">
            <AdSense slot="1234567890" format="horizontal" />
          </div>
        </div>
      </section>

      <CTAStrip />
    </>
  );
};

export default BlogPage;
