import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const ProfileEditor = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', photo_url: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;
    supabase.from('admin_profiles').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) setForm({ name: data.name, bio: data.bio, photo_url: data.photo_url });
    });
  }, [user]);

  const handleSave = async () => {
    if (!isSupabaseConfigured || !user) return;
    setSaving(true);
    const { error } = await supabase.from('admin_profiles').update(form).eq('id', user.id);
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-8">My Profile</h1>
        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)]">Configure your .env file with Supabase credentials to edit your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">My Profile</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">{user?.email}</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4">
          <Save size={13} className="mr-1.5" /> {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      <div className="max-w-lg space-y-5">
        <div>
          <label className="editorial-label block mb-1.5">Name</label>
          <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="input-minimal" placeholder="Your name" />
        </div>
        <div>
          <label className="editorial-label block mb-1.5">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={4} className="input-minimal resize-none" placeholder="Short bio" />
        </div>
        <div>
          <label className="editorial-label block mb-1.5">Photo URL</label>
          <input type="text" value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))}
            className="input-minimal" placeholder="https://..." />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
