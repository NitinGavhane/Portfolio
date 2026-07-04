import { ArrowUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isBlog = location.pathname.startsWith('/blog');

  const columns = {
    'Quick Links': [
      { name: 'Services',     href: isBlog ? '/#services' : '#services' },
      { name: 'Work',         href: isBlog ? '/#projects' : '#projects' },
      { name: 'Achievements', href: isBlog ? '/#achievements' : '#achievements' },
      { name: 'Blog',         href: '/blog' },
      { name: 'Contact',      href: isBlog ? '/#contact' : '#contact' },
    ],
    'Resources': [
      { name: 'Blog',          href: '/blog' },
      { name: 'About',         href: '/about' },
      { name: 'eBooks',        href: isBlog ? '/#ebooks' : '#ebooks' },
      { name: 'Privacy Policy',href: '/privacy-policy' },
      { name: 'Terms',         href: '/terms' },
      { name: 'Disclaimer',    href: '/disclaimer' },
    ],
    'Services': [
      { name: 'Web App Development',   href: isBlog ? '/#web-development' : '#web-development' },
      { name: 'QA & Security Auditing',href: isBlog ? '/#qa-testing' : '#qa-testing' },
      { name: 'Technical Writing',     href: isBlog ? '/#content-writing' : '#content-writing' },
      { name: 'Tech Advisory',         href: isBlog ? '/#consulting' : '#consulting' },
    ],
  };

  const scrollToTop = () => {
    if (isBlog) {
      window.location.href = '/';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">

        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
          <div>
            <Link to="/" className="font-sans text-sm font-medium text-[var(--text-primary)] mb-4 inline-block">
              nitingavhane<span className="opacity-30">.com</span>
            </Link>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed max-w-xs mb-6">
              Full-Stack Developer & Tech Consultant delivering secure web applications, QA auditing, technical content, and strategic advisory for growing businesses.
            </p>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span>Built with React & TypeScript</span>
            </div>
          </div>

          {Object.entries(columns).map(([cat, links]) => (
            <div key={cat}>
              <p className="editorial-label mb-5">{cat}</p>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.href}
                      className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[var(--border-primary)]">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Nitin Gavhane. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
          >
            Back to top
            <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
