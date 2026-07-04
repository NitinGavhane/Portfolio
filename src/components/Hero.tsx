import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import SchedulingModal from './scheduling/SchedulingModal';

const SERVICES = [
  'Web Application Development',
  'Security & QA Auditing',
  'Technical Writing',
  'Strategic Tech Consulting',
];

const CREDENTIALS = [
  {
    icon: '⬡',
    title: 'Bugcrowd Hall of Fame',
    desc: 'Recognised by Dell, Mastercard & 5 others for vulnerability research',
  },
  {
    icon: '◈',
    title: '1000+ Security Issues',
    desc: 'Reported across Fortune 500 & leading tech organisations',
  },
  {
    icon: '◉',
    title: 'Full-Stack Projects',
    desc: 'React, Node.js, TypeScript, Firebase — end-to-end delivery',
  },
  {
    icon: '◎',
    title: 'Published Author',
    desc: 'Angular Developer\'s Handbook & technical articles on Medium',
  },
];

const Hero = () => {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [currentService, setCurrentService] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentService((p) => (p + 1) % SERVICES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="min-h-screen flex flex-col bg-[var(--bg-primary)] pt-16 sm:pt-20">

      {/* ── MAIN HERO ─────────────────────────────────────────────── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 sm:px-8 grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center py-16 lg:py-24">

        {/* Left — text */}
        <div className="animate-fade-in-up">
          {/* Rotating service label */}
          <p className="editorial-label mb-6">
            <span
              key={currentService}
              className="inline-block animate-fade-in"
            >
              {SERVICES[currentService]}
            </span>
          </p>

          {/* Big serif headline */}
          <h1 className="editorial-heading text-[2.8rem] sm:text-[3.8rem] lg:text-[4.6rem] xl:text-[5.2rem] text-[var(--text-primary)] mb-8 max-w-2xl">
            Nitin Gavhane
          </h1>

          {/* Body */}
          <p className="editorial-body max-w-lg mb-10">
            Full-Stack Developer, Security Researcher & Tech Consultant.
            I partner with companies to ship scalable web applications,
            harden their security posture, and make smarter technology decisions.
            builds secure digital products for growing businesses.
          </p>

          {/* Social links — jonnyczar "Behance — LinkedIn — Medium" style */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10">
            {[
              { label: 'GitHub', href: 'https://github.com/NitinGavhane' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nitinsgavhane/' },
              { label: 'Twitter', href: 'https://x.com/NitinGavhane_' },
              { label: 'Medium', href: 'https://nitingavhane.medium.com/' },
            ].map((link, i, arr) => (
              <span key={link.label} className="flex items-center gap-4">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </a>
                {i < arr.length - 1 && (
                  <span className="text-[var(--border-secondary)] select-none">—</span>
                )}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsSchedulingOpen(true)}
              className="btn-primary group"
            >
              Book a Strategy Call
              <ArrowRight size={15} className="ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="btn-outline"
            >
              Our Services
            </button>
          </div>
        </div>

        {/* Right — B&W portrait */}
        <div
          className="hidden lg:block flex-shrink-0 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="relative w-72 xl:w-80">
            <img
              src="https://ucarecdn.com/b9b8e370-4abd-4d5d-ae15-16eebcfd5ded/51412436"
              alt="Nitin Gavhane"
              className="w-full aspect-[3/4] object-cover object-top"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* ── CREDENTIAL STRIP (jonnyczar bottom strip) ─────────────── */}
      <div className="border-t border-[var(--border-primary)]">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border-primary)]">
            {CREDENTIALS.map((c, i) => (
              <div
                key={i}
                className="px-6 py-8 animate-fade-in-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <span className="block text-2xl mb-3 text-[var(--text-muted)] select-none" aria-hidden>
                  {c.icon}
                </span>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1 leading-snug">
                  {c.title}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SchedulingModal isOpen={isSchedulingOpen} onClose={() => setIsSchedulingOpen(false)} />
    </section>
  );
};

export default Hero;