import { useRef, useEffect, useState } from 'react';

const skillGroups = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Angular', 'Tailwind CSS', 'Three.js'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Firebase', 'GraphQL', 'REST APIs', 'Microservices'],
  },
  {
    title: 'Security',
    skills: ['Penetration Testing', 'Vulnerability Assessment', 'Security Auditing', 'Network Security', 'Incident Response'],
  },
  {
    title: 'Cloud & DevOps',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
  },
];

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <section id="skills" ref={ref} className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-16">
          <div>
            <p className="editorial-label mb-4">Technical Expertise</p>
            <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">
              Capabilities
            </h2>
          </div>
          <p className="editorial-body self-end max-w-xl">
            A comprehensive toolkit spanning modern web development, cloud infrastructure, cybersecurity, and strategic advisory.
          </p>
        </div>

        {/* Skill groups */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[var(--border-primary)] border border-[var(--border-primary)]">
          {skillGroups.map((g, i) => (
            <div
              key={g.title}
              className={`p-6 sm:p-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p className="editorial-label mb-6">{g.title}</p>
              <ul className="space-y-3">
                {g.skills.map((s) => (
                  <li key={s} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-[var(--border-primary)]">
          {[
            { n: '2+',  l: 'Years Experience' },
            { n: '5+',  l: 'Projects Delivered' },
            { n: '25+', l: 'Security Audits' },
            { n: '20+', l: 'Technologies' },
          ].map((s, i) => (
            <div key={i} className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
              <p className="editorial-heading text-3xl sm:text-4xl text-[var(--text-primary)] mb-1">{s.n}</p>
              <p className="text-sm text-[var(--text-tertiary)]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;