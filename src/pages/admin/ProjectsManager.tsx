import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, ExternalLink, Github } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { Project } from '../../lib/supabaseSchema';

const emptyForm = {
  title: '',
  year: '',
  category: '',
  description: '',
  technologies: '', // comma-separated in the form
  github_url: '',
  live_url: '',
  image_url: '',
  featured: true,
  sort_order: 0,
};

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    if (data) setProjects(data);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    refresh();
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: projects.length });
  };

  const startEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      year: p.year,
      category: p.category,
      description: p.description,
      technologies: (p.technologies || []).join(', '),
      github_url: p.github_url,
      live_url: p.live_url,
      image_url: p.image_url,
      featured: p.featured,
      sort_order: p.sort_order,
    });
  };

  const handleSave = async () => {
    if (!form.title) { setError('Title is required.'); return; }
    if (!isSupabaseConfigured) { setError('Supabase not configured.'); return; }
    setSaving(true); setError('');

    const record = {
      title: form.title,
      year: form.year,
      category: form.category,
      description: form.description,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      github_url: form.github_url,
      live_url: form.live_url,
      image_url: form.image_url,
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    const { error: err } = editing
      ? await supabase.from('projects').update(record).eq('id', editing.id)
      : await supabase.from('projects').insert(record);

    setSaving(false);
    if (err) { setError(err.message); return; }
    await refresh();
    setEditing(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    await refresh();
    if (editing?.id === id) { setEditing(null); setForm(emptyForm); }
  };

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-8">Projects</h1>
        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)]">Configure your .env file with Supabase credentials to manage projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">Projects</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">{projects.length} projects · shown on your portfolio</p>
        </div>
        <button onClick={startNew} className="btn-primary text-xs py-2 px-4">
          <Plus size={13} className="mr-1.5" /> Add Project
        </button>
      </div>

      {error && <div className="mb-6 p-3 border border-red-200 bg-red-50 text-xs text-red-600">{error}</div>}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* List */}
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No projects yet. Add your first one →</p>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                onClick={() => startEdit(p)}
                className={`p-4 border transition-colors cursor-pointer ${
                  editing?.id === p.id ? 'border-[var(--text-primary)]' : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {p.title} <span className="text-[var(--text-muted)] font-normal">· {p.year}</span>
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!p.featured && (
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">Hidden</span>
                    )}
                    {p.live_url && p.live_url !== '#' && <ExternalLink size={12} className="text-[var(--text-muted)]" />}
                    {p.github_url && <Github size={12} className="text-[var(--text-muted)]" />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-4">
          <p className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">
            {editing ? 'Edit Project' : 'New Project'}
          </p>
          <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="input-minimal" placeholder="Project title" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
              className="input-minimal" placeholder="Year (e.g. 2025)" />
            <input type="text" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="input-minimal" placeholder="Category (e.g. Full-Stack)" />
          </div>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3} className="input-minimal resize-none" placeholder="Short description" />
          <div>
            <input type="text" value={form.technologies} onChange={(e) => setForm((p) => ({ ...p, technologies: e.target.value }))}
              className="input-minimal" placeholder="Technologies, comma-separated (React, Node.js, …)" />
            <p className="text-[10px] text-[var(--text-muted)] mt-1">Separate each technology with a comma.</p>
          </div>
          <input type="text" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
            className="input-minimal" placeholder="Image URL (e.g. projects_images/1.png or https://…)" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.live_url} onChange={(e) => setForm((p) => ({ ...p, live_url: e.target.value }))}
              className="input-minimal" placeholder="Live URL" />
            <input type="text" value={form.github_url} onChange={(e) => setForm((p) => ({ ...p, github_url: e.target.value }))}
              className="input-minimal" placeholder="GitHub URL" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="w-4 h-4" />
              Show on portfolio
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] ml-auto">
              Order
              <input type="number" value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="input-minimal w-20 py-1.5" />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4">
              <Save size={13} className="mr-1.5" /> {saving ? 'Saving…' : editing ? 'Update' : 'Add Project'}
            </button>
            {editing && (
              <button onClick={() => handleDelete(editing.id)} className="btn-outline text-xs py-2 px-4 text-red-500">
                <Trash2 size={13} className="mr-1.5" /> Delete
              </button>
            )}
            {editing && (
              <button onClick={startNew} className="btn-outline text-xs py-2 px-4">Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsManager;
