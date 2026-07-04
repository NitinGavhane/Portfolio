import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Settings } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import MediumEditor from '../../components/admin/MediumEditor';
import AdSenseChecklist from '../../components/admin/AdSenseChecklist';

const CATEGORIES = ['AI', 'Security', 'Dev', 'Strategy'];

const BlogEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditing = !!slug;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Dev',
    image_url: '',
    read_time: '5 min read',
    published: false,
  });

  useEffect(() => {
    if (isEditing && isSupabaseConfigured) {
      supabase.from('blog_posts').select('*').eq('slug', slug).single().then(({ data }) => {
        if (data) setForm(data);
      });
    }
  }, [slug, isEditing]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  };

  const handleContentChange = (content: string) => {
    setForm(prev => ({ ...prev, content }));
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      setError('Title and content are required.');
      return;
    }
    if (!isSupabaseConfigured) {
      setError('Supabase not configured. Add your .env file first.');
      return;
    }
    setSaving(true);
    setError('');

    const record = {
      title: form.title,
      slug: form.slug,
      content: form.content,
      excerpt: form.excerpt,
      category: form.category,
      image_url: form.image_url,
      read_time: form.read_time,
      published: form.published,
    };

    if (isEditing) {
      const { error: err } = await supabase.from('blog_posts').update(record).eq('slug', slug);
      if (err) setError(err.message);
    } else {
      const { error: err } = await supabase.from('blog_posts').insert(record);
      if (err) setError(err.message);
    }
    setSaving(false);
    if (!error) navigate('/admin/blogs');
  };

  const handleDelete = async () => {
    if (!isEditing || !isSupabaseConfigured) return;
    if (!confirm('Delete this post permanently?')) return;
    const { error: err } = await supabase.from('blog_posts').delete().eq('slug', slug);
    if (err) setError(err.message);
    else navigate('/admin/blogs');
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[var(--bg-primary)] z-10 py-3 -mx-8 px-8 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/blogs')} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs text-[var(--text-muted)]">{isEditing ? 'Editing' : 'New Story'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 transition-colors ${showSettings ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            title="Post settings"
          >
            <Settings size={16} />
          </button>
          {isEditing && (
            <button onClick={handleDelete} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors" title="Delete">
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 text-xs font-medium text-[var(--bg-primary)] bg-[var(--text-primary)] hover:opacity-90 transition-opacity rounded-full">
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 border border-red-200 bg-red-50 text-xs text-red-600 rounded-sm">{error}</div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-8 p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-sm">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Slug</label>
              <input type="text" value={form.slug}
                onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
                placeholder="post-slug" />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Category</label>
              <select value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Read Time</label>
              <input type="text" value={form.read_time}
                onChange={e => setForm(p => ({ ...p, read_time: e.target.value }))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
                placeholder="5 min read" />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Featured Image URL</label>
              <input type="text" value={form.image_url}
                onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
                placeholder="https://..." />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block mb-1.5">Excerpt</label>
              <input type="text" value={form.excerpt}
                onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] px-3 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)]"
                placeholder="Card description" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="published" checked={form.published}
                onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                className="w-4 h-4" />
              <label htmlFor="published" className="text-sm text-[var(--text-secondary)]">Published</label>
            </div>
          </div>

          <div className="mt-6">
            <AdSenseChecklist
              title={form.title}
              content={form.content}
              excerpt={form.excerpt}
              imageUrl={form.image_url}
              slug={form.slug}
            />
          </div>
        </div>
      )}

      {/* Editor area - Medium style */}
      <div className="min-h-[70vh]">
        {/* Featured image preview */}
        {form.image_url && (
          <div className="max-w-[680px] mx-auto mb-8">
            <div className="relative">
              <img src={form.image_url} alt="" className="w-full max-h-[400px] object-cover rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <button onClick={() => setForm(p => ({ ...p, image_url: '' }))}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="max-w-[680px] mx-auto mb-4">
          <textarea
            ref={titleRef}
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Title"
            rows={1}
            className="w-full bg-transparent font-serif text-[42px] leading-[1.15] text-[var(--text-primary)] outline-none resize-none overflow-hidden placeholder:text-[var(--text-muted)]"
            style={{ minHeight: '1.15em' }}
          />
        </div>

        {/* Content blocks */}
        <MediumEditor
          initialContent={form.content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default BlogEditor;
