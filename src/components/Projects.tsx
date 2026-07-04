import { useRef, useEffect, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { getProjects } from '../lib/projectsService';
import TechIcon from './ui/TechIcon';
import type { Project } from '../lib/supabaseSchema';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    // Runs again once projects load and the section mounts, so the ref is
    // actually attached (the early `return null` skips it on the first render).
    if (!ref.current) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section id="projects" ref={ref} className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)] py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] sm:rounded-[4rem] py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-12 shadow-lg border border-[var(--border-primary)]">
          {/* Header */}
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-12 sm:mb-16">
            <div>
              <p className="editorial-label mb-4">Selected Work</p>
              <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">Projects</h2>
            </div>
            <p className="editorial-body self-end max-w-xl">
              A selection of recent projects spanning full-stack development, security research, and creative web experiences.
            </p>
          </div>

          {/* Project cards — responsive grid, up to 4 per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((p, i) => (
              <article
                key={p.id}
                className={`group flex flex-col bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden hover:border-[var(--border-secondary)] hover:shadow-lift transition-all duration-300 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] bg-[var(--bg-tertiary)] overflow-hidden">
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 right-2.5 flex gap-2">
                    {p.live_url && p.live_url !== '#' && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} live site`}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-[#0a0a0a] hover:bg-white transition-all duration-200 shadow-md"
                        title="View Live"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${p.title} on GitHub`}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-[#0a0a0a] hover:bg-white transition-all duration-200 shadow-md"
                        title="GitHub"
                      >
                        <Github size={13} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    <span>{p.category}</span>
                    {p.year && <><span>·</span><span>{p.year}</span></>}
                  </div>
                  <h3 className="editorial-heading text-xl text-[var(--text-primary)] mb-2 leading-snug line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--text-tertiary)] leading-relaxed line-clamp-3 flex-1">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-4">
                    {(p.technologies ?? []).slice(0, 5).map((t) => (
                      <TechIcon key={t} name={t} />
                    ))}
                    {(p.technologies ?? []).length > 5 && (
                      <span className="w-7 h-7 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex items-center justify-center text-[10px] text-[var(--text-tertiary)]">
                        +{p.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;