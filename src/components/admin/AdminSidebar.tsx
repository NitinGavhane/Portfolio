import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, Calendar, User, LogOut, FolderGit2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/blogs', icon: FileText, label: 'Blog Posts' },
  { to: '/admin/projects', icon: FolderGit2, label: 'Projects' },
  { to: '/admin/products', icon: BookOpen, label: 'Digital Products' },
  { to: '/admin/meetings', icon: Calendar, label: 'Booked Meetings' },
  { to: '/admin/profile', icon: User, label: 'My Profile' },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <aside className="w-56 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-[var(--border-primary)]">
        <NavLink to="/admin" className="font-sans text-sm font-semibold text-[var(--text-primary)]">
          nitingavhane<span className="text-[var(--text-muted)]">.com</span>
        </NavLink>
        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Admin</p>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-xs rounded-sm transition-colors duration-200 ${
                isActive
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`
            }
          >
            <Icon size={14} strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--border-primary)]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-sm transition-colors w-full"
        >
          <LogOut size={14} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
