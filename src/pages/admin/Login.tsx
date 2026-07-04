import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin');
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="max-w-md w-full px-8 py-12 border border-[var(--border-primary)]">
          <h1 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Admin Login</h1>
          <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)]">
            <p className="font-medium mb-2">Supabase not configured.</p>
            <p>Create a <code className="text-xs bg-[var(--bg-tertiary)] px-1">.env</code> file in the project root with:</p>
            <pre className="mt-2 text-xs p-3 bg-[var(--bg-tertiary)] overflow-x-auto">
VITE_SUPABASE_URL=https://your-project.supabase.co{"\n"}
VITE_SUPABASE_ANON_KEY=your-anon-key
            </pre>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Get these from your Supabase project dashboard → Settings → API.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="max-w-sm w-full px-8 py-12 border border-[var(--border-primary)]">
        <h1 className="font-serif text-2xl text-[var(--text-primary)] mb-1">Admin Login</h1>
        <p className="text-xs text-[var(--text-muted)] mb-8">Sign in to manage your site</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="editorial-label block mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input-minimal" placeholder="admin@example.com" required
            />
          </div>
          <div>
            <label className="editorial-label block mb-1.5">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="input-minimal" placeholder="••••••••" required
            />
          </div>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
