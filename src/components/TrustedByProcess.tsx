import { useRef, useEffect, useState } from 'react';

const orgs = [
  'Dell', 'Mastercard', 'Under Armour', 'TripAdvisor',
  'Indeed', 'Etsy', 'Cloudways',
];

const process = [
  { n: '01', title: 'Discovery', body: 'A free 30-minute call to understand your goals, constraints, and current technical landscape.' },
  { n: '02', title: 'Strategy',  body: 'A tailored plan — stack, timeline, team structure and milestones — delivered before a single line of code.' },
  { n: '03', title: 'Build',     body: 'Agile sprints with weekly demos and transparent progress. You stay in control throughout.' },
  { n: '04', title: 'Launch',    body: 'Deployment, QA sign-off, and post-launch support. On time, on budget, built to scale.' },
];

const TrustedByProcess = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="trusted" ref={ref} className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Trusted By */}
        <div className="mb-20 sm:mb-28">
          <p className="editorial-label mb-8 text-center">Recognised by teams at</p>
          <div className="flex flex-wrap justify-center gap-3">
            {orgs.map((org, i) => (
              <span
                key={org}
                className={`px-5 py-2 border border-[var(--border-primary)] text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] hover:border-[var(--border-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {org}
              </span>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--text-muted)] mt-5">
            Via 1000+ security disclosures on the Bugcrowd platform
          </p>
        </div>

        {/* Process */}
        <div>
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-14">
            <div>
              <p className="editorial-label mb-4">How We Work</p>
              <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">Our Process</h2>
            </div>
            <p className="editorial-body self-end max-w-xl">
              A proven four-step framework that keeps every engagement transparent, on time, and client-focused.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border-primary)] border border-[var(--border-primary)]">
            {process.map((s, i) => (
              <div
                key={s.n}
                className={`p-6 sm:p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                <span className="block font-serif text-4xl text-[var(--text-muted)] mb-5">{s.n}</span>
                <h3 className="font-medium text-base text-[var(--text-primary)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedByProcess;
