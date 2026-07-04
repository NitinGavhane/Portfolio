import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Calendar, Eye, MousePointerClick, BookOpenCheck, BarChart3, FolderGit2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface StatRow {
  slug: string;
  views: number;
  reads: number;
  clicks: number;
  last_event: string | null;
  title: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState({ posts: 0, projects: 0, products: 0, bookings: 0 });
  const [rows, setRows] = useState<StatRow[]>([]);
  const [analyticsReady, setAnalyticsReady] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('digital_products').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id', { count: 'exact', head: true }),
    ]).then(([posts, projects, products, bookings]) => {
      setStats({
        posts: posts.count ?? 0,
        projects: projects.count ?? 0,
        products: products.count ?? 0,
        bookings: bookings.count ?? 0,
      });
    });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const [statsRes, postsRes] = await Promise.all([
        supabase.rpc('get_blog_stats'),
        supabase.from('blog_posts').select('slug, title'),
      ]);
      if (statsRes.error) {
        setAnalyticsReady(false);
        return;
      }
      const titles = new Map<string, string>((postsRes.data || []).map((p) => [p.slug, p.title]));
      const merged: StatRow[] = (statsRes.data || []).map((r: Omit<StatRow, 'title'>) => ({
        ...r,
        views: Number(r.views) || 0,
        reads: Number(r.reads) || 0,
        clicks: Number(r.clicks) || 0,
        title: titles.get(r.slug) || r.slug,
      }));
      merged.sort((a, b) => b.views - a.views);
      setRows(merged);
      setAnalyticsReady(true);
    })();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-2">Dashboard</h1>
        <p className="text-sm text-[var(--text-tertiary)] mb-8">Welcome to the admin panel.</p>
        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)]">
            Configure your <code className="text-xs bg-[var(--bg-tertiary)] px-1">.env</code> file with Supabase credentials to get started.
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Blog Posts', value: stats.posts, icon: FileText, link: '/admin/blogs', color: 'text-blue-500' },
    { label: 'Projects', value: stats.projects, icon: FolderGit2, link: '/admin/projects', color: 'text-rose-500' },
    { label: 'Digital Products', value: stats.products, icon: BookOpen, link: '/admin/products', color: 'text-emerald-500' },
    { label: 'Booked Meetings', value: stats.bookings, icon: Calendar, link: '/admin/meetings', color: 'text-amber-500' },
  ];

  const totals = rows.reduce(
    (acc, r) => ({ views: acc.views + r.views, reads: acc.reads + r.reads, clicks: acc.clicks + r.clicks }),
    { views: 0, reads: 0, clicks: 0 }
  );

  const analyticsCards = [
    { label: 'Total Views', value: totals.views, icon: Eye, color: 'text-blue-500' },
    { label: 'Total Reads', value: totals.reads, icon: BookOpenCheck, color: 'text-emerald-500' },
    { label: 'Total Clicks', value: totals.clicks, icon: MousePointerClick, color: 'text-violet-500' },
  ];

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

  return (
    <div>
      <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-1">Dashboard</h1>
      <p className="text-sm text-[var(--text-tertiary)] mb-10">Overview of your site.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, link, color }) => (
          <Link
            key={label}
            to={link}
            className="p-6 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-colors group"
          >
            <Icon size={20} className={`${color} mb-3`} strokeWidth={1.5} />
            <p className="font-serif text-3xl text-[var(--text-primary)] mb-1">{value}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
          </Link>
        ))}
      </div>

      {/* ── Blog analytics ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 mb-5">
        <BarChart3 size={18} className="text-[var(--text-muted)]" strokeWidth={1.5} />
        <h2 className="font-serif text-xl text-[var(--text-primary)]">Blog Analytics</h2>
      </div>

      {analyticsReady === false && (
        <div className="p-6 border border-amber-200 bg-amber-50 rounded-sm mb-10">
          <p className="text-sm font-medium text-amber-800 mb-1">Analytics not set up yet</p>
          <p className="text-sm text-amber-700">
            Run <code className="text-xs bg-amber-100 px-1 rounded">scripts/analytics-schema.sql</code> once in your
            Supabase SQL Editor to create the tracking table. Views, reads, and clicks will appear here automatically.
          </p>
        </div>
      )}

      {analyticsReady && (
        <>
          <div className="grid sm:grid-cols-3 gap-5 mb-6">
            {analyticsCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="p-6 border border-[var(--border-primary)]">
                <Icon size={20} className={`${color} mb-3`} strokeWidth={1.5} />
                <p className="font-serif text-3xl text-[var(--text-primary)] mb-1">{value.toLocaleString()}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
              </div>
            ))}
          </div>

          {rows.length === 0 ? (
            <div className="p-8 border border-[var(--border-primary)] text-center mb-10">
              <p className="text-sm text-[var(--text-tertiary)]">
                No blog activity recorded yet. Visits to your posts will show up here.
              </p>
            </div>
          ) : (
            <div className="border border-[var(--border-primary)] rounded-sm overflow-x-auto mb-10">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-[var(--border-primary)] text-[var(--text-muted)]">
                    <th className="text-left font-medium px-5 py-3 text-xs uppercase tracking-wider">Post</th>
                    <th className="text-right font-medium px-4 py-3 text-xs uppercase tracking-wider">Views</th>
                    <th className="text-right font-medium px-4 py-3 text-xs uppercase tracking-wider">Reads</th>
                    <th className="text-right font-medium px-4 py-3 text-xs uppercase tracking-wider">Clicks</th>
                    <th className="text-right font-medium px-4 py-3 text-xs uppercase tracking-wider">Read %</th>
                    <th className="text-right font-medium px-5 py-3 text-xs uppercase tracking-wider">Last</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                  {rows.map((r) => (
                    <tr key={r.slug} className="hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="px-5 py-3 max-w-[280px]">
                        <Link
                          to={`/blog/${r.slug}`}
                          target="_blank"
                          className="text-[var(--text-primary)] hover:underline line-clamp-1"
                        >
                          {r.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">{r.views.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">{r.reads.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--text-secondary)]">{r.clicks.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--text-tertiary)]">
                        {r.views ? Math.round((r.reads / r.views) * 100) : 0}%
                      </td>
                      <td className="px-5 py-3 text-right text-[var(--text-muted)] whitespace-nowrap">{fmtDate(r.last_event)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-3 mb-3">
          <Eye size={16} className="text-[var(--text-muted)]" strokeWidth={1.5} />
          <p className="text-sm font-medium text-[var(--text-primary)]">Quick Links</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/blog" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] underline underline-offset-3">View Blog →</Link>
          <Link to="/" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] underline underline-offset-3">View Site →</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
