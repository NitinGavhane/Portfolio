import { useRef, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const stats = [
  { value: '1000+', label: 'Security Issues Reported' },
  { value: 'Hall of Fame', label: 'Bugcrowd Recognition' },
  { value: '7', label: 'Organisations Recognised' },
  { value: '2+', label: 'Years of Research' },
];

const orgs = [
  'Dell', 'Mastercard', 'Under Armour', 'TripAdvisor', 'Indeed', 'Cloudways', 'Etsy',
];

const Achievements = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="achievements" ref={ref} className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-16">
          <div>
            <p className="editorial-label mb-4">Recognition</p>
            <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">
              Achievements
            </h2>
          </div>
          <p className="editorial-body self-end max-w-xl">
            Recognised for exceptional contributions in cybersecurity and vulnerability research across Fortune 500 organisations and leading tech companies.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border-primary)] border border-[var(--border-primary)] mb-16">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`p-6 sm:p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="editorial-heading text-3xl sm:text-4xl text-[var(--text-primary)] mb-2">
                {s.value}
              </p>
              <p className="text-sm text-[var(--text-tertiary)]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Hall of Fame */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-20 items-start">
          <div>
            <p className="editorial-label mb-4">Hall of Fame</p>
            <h3 className="editorial-heading text-3xl text-[var(--text-primary)] mb-5">
              Recognised by world-class organisations.
            </h3>
            <p className="editorial-body text-[var(--text-secondary)] mb-8">
              Over 1000+ security issues reported through the Bugcrowd platform, resulting in Hall of Fame recognition from seven leading global companies.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {orgs.map((org) => (
                <span key={org} className="tag">{org}</span>
              ))}
            </div>
            <a
              href="https://bugcrowd.com/NitinGavhane"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline inline-flex"
            >
              View Bugcrowd Profile
              <ExternalLink size={13} className="ml-2" />
            </a>
          </div>

          {/* Screenshot */}
          <div className="border border-[var(--border-primary)]">
            <button
              onClick={() => window.open('https://bugcrowd.com/NitinGavhane', '_blank', 'noopener,noreferrer')}
              className="group block w-full overflow-hidden relative"
              aria-label="View Bugcrowd Hall of Fame Profile"
            >
              <img
                src="/image.png"
                alt="Bugcrowd Hall of Fame – Nitin Gavhane"
                className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="btn-primary text-sm">
                  Open Profile <ExternalLink size={13} className="ml-1.5" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;