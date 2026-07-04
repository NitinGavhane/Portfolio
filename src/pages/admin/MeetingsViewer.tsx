import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface SupabaseBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
}

const MeetingsViewer = () => {
  const [bookings, setBookings] = useState<SupabaseBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setBookings(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-8">Booked Meetings</h1>
        <div className="p-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <p className="text-sm text-[var(--text-secondary)]">Configure your .env file with Supabase credentials to view meetings.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">Booked Meetings</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">{bookings.length} total</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 uppercase tracking-wider transition-colors ${
                filter === f
                  ? 'text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="p-12 border border-[var(--border-primary)] text-center">
          <p className="text-sm text-[var(--text-tertiary)]">No bookings found.</p>
        </div>
      ) : (
        <div className="border border-[var(--border-primary)] divide-y divide-[var(--border-primary)]">
          {filtered.map(b => (
            <div key={b.id} className="px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{b.name}</p>
                <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium ${
                  b.status === 'confirmed'
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                    : 'text-red-500 bg-red-50 border border-red-200'
                }`}>
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">{b.email}{b.phone ? ` · ${b.phone}` : ''}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                {b.date} at {b.time} · {b.duration}min
              </p>
              {b.purpose && <p className="text-xs text-[var(--text-muted)] mt-1">{b.purpose}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingsViewer;
