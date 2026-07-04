import { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SchedulingModal from './scheduling/SchedulingModal';

const SERVICES = [
  'Web Application Development',
  'Security & QA Auditing',
  'Technical Writing',
  'Strategic Tech Consulting',
];

const Profile = () => {
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
    <section
      id="profile"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] pt-16 sm:pt-20"
    >
      {/* Background decorative element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-[var(--bg-secondary)] rounded-full blur-3xl opacity-40 dark:opacity-20" />
        <div className="absolute bottom-1/4 right-0 w-40 sm:w-56 lg:w-80 h-40 sm:h-56 lg:h-80 bg-[var(--bg-tertiary)] rounded-full blur-3xl opacity-30 dark:opacity-10" />
      </div>

      {/* Curved sides container */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--bg-secondary)] rounded-[3rem] sm:rounded-[6rem] py-12 sm:py-16 lg:py-20 px-6 sm:px-10 lg:px-16 shadow-lg border border-[var(--border-primary)]">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left - Profile Photo */}
            <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                <div className="w-full h-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-2 border-[var(--border-primary)] shadow-lg">
                  <img
                    src="https://ucarecdn.com/b9b8e370-4abd-4d5d-ae15-16eebcfd5ded/51412436"
                    alt="Nitin Gavhane"
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </div>
                {/* Decorative dot */}
                <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-[var(--text-primary)] flex items-center justify-center text-[var(--bg-primary)] text-sm font-bold">
                  ✦
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="flex-1 text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="editorial-label mb-4">
                <span key={currentService} className="inline-block animate-fade-in">
                  {SERVICES[currentService]}
                </span>
              </p>

              <h1 className="editorial-heading text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] text-[var(--text-primary)] mb-4 leading-tight">
                Nitin Gavhane
              </h1>

              <p className="editorial-body max-w-lg mx-auto lg:mx-0 mb-8">
                Full-Stack Developer, Security Researcher & Tech Consultant.
                I partner with companies to ship scalable web applications,
                harden their security posture, and make smarter technology decisions.
              </p>

              {/* Social links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 mb-8">
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
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
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
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-breathe">
        <ChevronDown size={20} className="text-[var(--text-muted)]" />
      </div>

      <SchedulingModal isOpen={isSchedulingOpen} onClose={() => setIsSchedulingOpen(false)} />
    </section>
  );
};

export default Profile;
