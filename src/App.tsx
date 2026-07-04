import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ConsentProvider } from './contexts/ConsentContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import HomePage from './pages/HomePage';

// Public secondary pages — small, split out of the initial bundle.
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const About = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin panel — never loaded for public visitors.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const BlogList = lazy(() => import('./pages/admin/BlogList'));
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'));
const ProductsManager = lazy(() => import('./pages/admin/ProductsManager'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const MeetingsViewer = lazy(() => import('./pages/admin/MeetingsViewer'));
const ProfileEditor = lazy(() => import('./pages/admin/ProfileEditor'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <span className="text-sm text-[var(--text-muted)]">Loading…</span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ConsentProvider>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
                <Route path="/blog/:slug" element={<PublicLayout><BlogPostPage /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
                <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
                <Route path="/disclaimer" element={<PublicLayout><Disclaimer /></PublicLayout>} />

                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
                <Route path="/admin/blogs" element={<AdminLayout><BlogList /></AdminLayout>} />
                <Route path="/admin/blogs/new" element={<AdminLayout><BlogEditor /></AdminLayout>} />
                <Route path="/admin/blogs/edit/:slug" element={<AdminLayout><BlogEditor /></AdminLayout>} />
                <Route path="/admin/products" element={<AdminLayout><ProductsManager /></AdminLayout>} />
                <Route path="/admin/projects" element={<AdminLayout><ProjectsManager /></AdminLayout>} />
                <Route path="/admin/meetings" element={<AdminLayout><MeetingsViewer /></AdminLayout>} />
                <Route path="/admin/profile" element={<AdminLayout><ProfileEditor /></AdminLayout>} />

                <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
              </Routes>
            </Suspense>
            <CookieConsent />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  boxShadow: '0 4px 24px -4px rgba(0,0,0,0.12)',
                },
              }}
            />
          </ConsentProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-bg-primary theme-text-primary min-h-screen font-sans theme-transition">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default App;
