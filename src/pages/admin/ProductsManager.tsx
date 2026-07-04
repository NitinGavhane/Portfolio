import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { DigitalProduct } from '../../lib/supabaseSchema';

const ProductsManager = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [editing, setEditing] = useState<DigitalProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.from('digital_products').select('*').order('created_at').then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

  const emptyForm = {
    title: '', description: '', cover_image_url: '',
    rating: 0, pages: 0, downloads: 0, price: '', purchase_url: '',
  };

  const [form, setForm] = useState(emptyForm);

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const startEdit = (p: DigitalProduct) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, cover_image_url: p.cover_image_url,
      rating: p.rating, pages: p.pages, downloads: p.downloads, price: p.price, purchase_url: p.purchase_url,
    });
  };

  const handleSave = async () => {
    if (!form.title) { setError('Title is required.'); return; }
    if (!isSupabaseConfigured) { setError('Supabase not configured.'); return; }
    setSaving(true); setError('');

    if (editing) {
      const { error: err } = await supabase.from('digital_products').update(form).eq('id', editing.id);
      if (err) setError(err.message);
    } else {
      const { error: err } = await supabase.from('digital_products').insert(form);
      if (err) setError(err.message);
    }
    setSaving(false);
    const { data } = await supabase.from('digital_products').select('*').order('created_at');
    if (data) setProducts(data);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('digital_products').delete().eq('id', id);
    const { data } = await supabase.from('digital_products').select('*').order('created_at');
    if (data) setProducts(data);
    if (editing?.id === id) { setEditing(null); setForm(emptyForm); }
  };

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-8">Digital Products</h1>
        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)]">Configure your .env file with Supabase credentials to manage products.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">Digital Products</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">{products.length} products</p>
        </div>
        <button onClick={startNew} className="btn-primary text-xs py-2 px-4">
          <Plus size={13} className="mr-1.5" /> Add Product
        </button>
      </div>

      {error && <div className="mb-6 p-3 border border-red-200 bg-red-50 text-xs text-red-600">{error}</div>}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No products yet.</p>
          ) : (
            products.map(p => (
              <div key={p.id} className="p-4 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-colors cursor-pointer" onClick={() => startEdit(p)}>
                <p className="text-sm font-medium text-[var(--text-primary)]">{p.title}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{p.price} · {p.downloads} downloads</p>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-4">
          <p className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-wider">
            {editing ? 'Edit Product' : 'New Product'}
          </p>
          <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="input-minimal" placeholder="Product title" />
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={3} className="input-minimal resize-none" placeholder="Description" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              className="input-minimal" placeholder="Price" />
            <input type="number" value={form.pages || ''} onChange={e => setForm(p => ({ ...p, pages: Number(e.target.value) }))}
              className="input-minimal" placeholder="Pages" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.downloads || ''} onChange={e => setForm(p => ({ ...p, downloads: Number(e.target.value) }))}
              className="input-minimal" placeholder="Downloads" />
            <input type="number" value={form.rating || ''} onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}
              className="input-minimal" placeholder="Rating" step="0.1" />
          </div>
          <input type="text" value={form.cover_image_url} onChange={e => setForm(p => ({ ...p, cover_image_url: e.target.value }))}
            className="input-minimal" placeholder="Cover image URL" />
          <input type="text" value={form.purchase_url} onChange={e => setForm(p => ({ ...p, purchase_url: e.target.value }))}
            className="input-minimal" placeholder="Purchase URL" />
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4">
              <Save size={13} className="mr-1.5" /> {saving ? 'Saving...' : 'Save'}
            </button>
            {editing && (
              <button onClick={() => handleDelete(editing.id)} className="btn-outline text-xs py-2 px-4 text-red-500">
                <Trash2 size={13} className="mr-1.5" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManager;
