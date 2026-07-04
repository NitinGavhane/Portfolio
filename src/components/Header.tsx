import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { id: 'services',      label: 'Services' },
  { id: 'projects',      label: 'Work' },
  { id: 'achievements',  label: 'Security' },
  { id: 'blog',          label: 'Blog', isRoute: true },
  { id: 'contact',       label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith('/blog');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
      const docH  = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isBlogPage) return;
    const ids = ['hero', ...navLinks.filter(l => !l.isRoute).map((l) => l.id)];
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [isBlogPage]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    if (isBlogPage) {
      window.location.href = '/#' + id;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 theme-transition ${
          isScrolled
            ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-primary)]'
            : 'bg-transparent'
        }`}
        style={{ transition: 'background 0.35s ease, border-color 0.35s ease' }}
      >
        <nav className="max-w-6xl mx-auto px-6 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">

          <Link
            to="/"
            aria-label="Go to top"
            className="group flex items-center gap-0"
          >
            <span className="font-sans text-sm font-semibold tracking-tight text-[var(--text-primary)] transition-opacity duration-200 group-hover:opacity-50">
              nitingavhane
            </span>
            <span className="font-sans text-sm font-semibold tracking-tight text-[var(--text-muted)] transition-opacity duration-200 group-hover:opacity-30">
              .com
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.isRoute) {
                const isActive = location.pathname.startsWith('/blog');
                return (
                  <Link
                    key={link.id}
                    to="/blog"
                    className={`
                      relative px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase
                      transition-colors duration-200
                      ${isActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                      }
                    `}
                  >
                    {link.label}
                    <span
                      className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2
                        w-1 h-1 rounded-full bg-[var(--text-primary)]
                        transition-all duration-300
                        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                      `}
                    />
                  </Link>
                );
              }
              const isActive = !isBlogPage && activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`
                    relative px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase
                    transition-colors duration-200
                    ${isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }
                  `}
                >
                  {link.label}
                  <span
                    className={`
                      absolute bottom-0 left-1/2 -translate-x-1/2
                      w-1 h-1 rounded-full bg-[var(--text-primary)]
                      transition-all duration-300
                      ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `}
                  />
                </button>
              );
            })}

            <span className="w-px h-4 bg-[var(--border-secondary)] mx-2 opacity-50" />

            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--bg-primary)] bg-[var(--text-primary)] hover:opacity-90 transition-opacity duration-200"
            >
              Book a Call
            </button>

            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen
                ? <X size={20} strokeWidth={1.5} />
                : <Menu size={20} strokeWidth={1.5} />
              }
            </button>
          </div>
        </nav>

        <div
          className="absolute bottom-0 left-0 h-px bg-[var(--text-primary)] opacity-20 transition-none"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        <div
          className="absolute inset-0 bg-[var(--bg-primary)]"
          onClick={() => setIsMenuOpen(false)}
        />

        <div className={`
          relative h-full flex flex-col justify-between px-8 pt-28 pb-12
          transform transition-transform duration-500 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-6'}
        `}>
          <nav className="flex flex-col gap-0">
            {navLinks.map((link, i) => {
              if (link.isRoute) {
                const isActive = location.pathname.startsWith('/blog');
                return (
                  <Link
                    key={link.id}
                    to="/blog"
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      group flex items-center justify-between
                      w-full py-5 border-b border-[var(--border-primary)]
                      text-left transition-all duration-200
                      ${isActive
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                      }
                    `}
                    style={{
                      transitionDelay: isMenuOpen ? `${i * 55}ms` : '0ms',
                      opacity: isMenuOpen ? 1 : 0,
                      transform: isMenuOpen ? 'translateX(0)' : 'translateX(16px)',
                      transition: `opacity 0.4s ease ${i * 55}ms, transform 0.4s ease ${i * 55}ms, color 0.2s ease`,
                    }}
                  >
                    <span className="font-serif text-3xl sm:text-4xl leading-none tracking-tight">
                      {link.label}
                    </span>
                    {isActive && (
                      <span className="editorial-label text-[var(--text-muted)]">current</span>
                    )}
                  </Link>
                );
              }
              const isActive = !isBlogPage && activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`
                    group flex items-center justify-between
                    w-full py-5 border-b border-[var(--border-primary)]
                    text-left transition-all duration-200
                    ${isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                  style={{
                    transitionDelay: isMenuOpen ? `${i * 55}ms` : '0ms',
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(16px)',
                    transition: `opacity 0.4s ease ${i * 55}ms, transform 0.4s ease ${i * 55}ms, color 0.2s ease`,
                  }}
                >
                  <span className="font-serif text-3xl sm:text-4xl leading-none tracking-tight">
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="editorial-label text-[var(--text-muted)]">current</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div
            className="flex items-center justify-between"
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.4s ease ${navLinks.length * 55 + 60}ms, transform 0.4s ease ${navLinks.length * 55 + 60}ms`,
            }}
          >
            <p className="editorial-label">nitingavhane.com</p>
            <p className="editorial-label">{new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
