import { Link } from 'react-router-dom';
import { trackBlogEvent } from '../../lib/analytics';

interface CardPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  image?: string;
}

interface BlogPostCardProps {
  post: CardPost;
  index?: number;
  isVisible?: boolean;
}

const BlogPostCard = ({ post, index = 0, isVisible = true }: BlogPostCardProps) => (
  <Link
    to={`/blog/${post.slug}`}
    onClick={() => trackBlogEvent(post.slug, 'click')}
    className={`group block bg-[var(--bg-primary)] transition-all duration-300 ${
      isVisible ? 'animate-fade-in-up' : 'opacity-0'
    }`}
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    {post.image && (
      <div className="aspect-[2/1] overflow-hidden mb-4 bg-[var(--bg-secondary)]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>
    )}
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span className="text-[var(--text-tertiary)]">{post.category}</span>
        <span>·</span>
        <span>{post.date || ''}</span>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>
      <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] leading-snug group-hover:text-[var(--text-tertiary)] transition-colors duration-200">
        {post.title}
      </h2>
      <p className="text-sm text-[var(--text-tertiary)] leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>
    </div>
  </Link>
);

export default BlogPostCard;
