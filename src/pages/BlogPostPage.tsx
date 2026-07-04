import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '../lib/blogService';
import AdSense from '../components/AdSense';
import CTAStrip from '../components/ui/CTAStrip';
import PostContent from '../components/ui/PostContent';
import Seo from '../components/Seo';
import { articleJsonLd } from '../lib/structuredData';
import { trackBlogEvent } from '../lib/analytics';
import type { BlogPost } from '../lib/supabaseSchema';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0 });
    setPost(null);
    setNotFound(false);
    getPostBySlug(slug).then(data => {
      if (data) {
        setPost(data);
        trackBlogEvent(data.slug, 'view');
      } else {
        setNotFound(true);
      }
    });
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Count a "read" once the visitor reaches ~85% of the article or dwells 30s.
  useEffect(() => {
    if (!post) return;
    const s = post.slug;
    const timer = setTimeout(() => trackBlogEvent(s, 'read'), 30000);
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 100;
      if (pct >= 85) trackBlogEvent(s, 'read');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [post]);

  if (notFound) {
    return (
      <section className="pt-28 sm:pt-36 pb-20 bg-[var(--bg-primary)] min-h-screen">
        <Seo title="Post not found" path={`/blog/${slug ?? ''}`} noindex />
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <h1 className="font-serif text-4xl text-[var(--text-primary)] mb-4">Post not found</h1>
          <p className="text-[var(--text-tertiary)] mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn-outline">
            <ArrowLeft size={15} className="mr-2" /> Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="pt-28 sm:pt-36 pb-20 bg-[var(--bg-primary)] min-h-screen">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.image_url || undefined}
        type="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        jsonLd={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          image: post.image_url || undefined,
          published: post.created_at,
          modified: post.updated_at,
        })}
      />
      {/* Reading progress bar */}
      <div className="fixed top-16 sm:top-[72px] left-0 right-0 h-0.5 z-40 bg-[var(--border-primary)]">
        <div
          className="h-full bg-[var(--text-primary)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article>
        {/* Featured image */}
        {post.image_url && (
          <div className="w-full max-h-[480px] overflow-hidden bg-[var(--bg-secondary)]">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              style={{ maxHeight: '480px' }}
            />
          </div>
        )}

        {/* Article header — clear the fixed navbar when there's no featured image */}
        <header
          className={`max-w-[680px] mx-auto px-6 sm:px-8 pb-8 ${
            post.image_url ? 'pt-12 sm:pt-16' : 'pt-24 sm:pt-32'
          }`}
        >
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mb-4">
            <Link to="/blog" className="hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft size={14} className="inline mr-1" />
              Back
            </Link>
            <span>·</span>
            <span>{post.category}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[var(--text-primary)] leading-[1.15] tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-xs font-medium text-[var(--text-muted)]">
              NG
            </div>
            <div>
              <span className="font-medium text-[var(--text-primary)]">Nitin Gavhane</span>
              <span className="mx-2">·</span>
              <span>{post.created_at?.split('T')[0]}</span>
              <span className="mx-2">·</span>
              <span>{post.read_time}</span>
            </div>
          </div>
        </header>

        {/* Article body */}
        <div className="max-w-[680px] mx-auto px-6 sm:px-8 pb-16">
          <PostContent content={post.content} />

          {/* AdSense */}
          <div className="my-12 pt-8 border-t border-[var(--border-primary)]">
            <AdSense slot="0987654321" format="horizontal" />
          </div>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-[var(--border-primary)] flex items-center justify-between">
            <Link to="/blog" className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft size={14} className="inline mr-1" /> Back to Blog
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </article>

      <CTAStrip />
    </>
  );
};

export default BlogPostPage;
