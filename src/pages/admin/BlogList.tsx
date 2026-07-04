import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit3, Eye } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { BlogPost } from '../../lib/supabaseSchema';

const BlogList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  if (!isSupabaseConfigured) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">Blog Posts</h1>
        </div>
        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)]">Configure your .env file with Supabase credentials to manage blog posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">Blog Posts</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">{posts.length} posts</p>
        </div>
        <button onClick={() => navigate('/admin/blogs/new')} className="btn-primary text-xs py-2 px-4">
          <Plus size={13} className="mr-1.5" /> New Post
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="p-12 border border-[var(--border-primary)] text-center">
          <p className="text-sm text-[var(--text-tertiary)] mb-4">No blog posts yet.</p>
          <button onClick={() => navigate('/admin/blogs/new')} className="btn-outline text-xs">
            Create your first post
          </button>
        </div>
      ) : (
        <div className="border border-[var(--border-primary)] divide-y divide-[var(--border-primary)]">
          {posts.map(post => (
            <div key={post.id} className="flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium ${post.published ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-[var(--text-muted)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">{post.category}</span>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{post.title}</p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">{post.slug}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link to={`/blog/${post.slug}`} target="_blank" className="btn-outline text-xs py-1.5 px-2.5">
                  <Eye size={12} />
                </Link>
                <button onClick={() => navigate(`/admin/blogs/edit/${post.slug}`)} className="btn-outline text-xs py-1.5 px-2.5">
                  <Edit3 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
