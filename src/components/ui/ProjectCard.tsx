import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Project } from '../../lib/projectsData';

interface ProjectCardProps {
  project: Project;
  index?: number;
  isVisible?: boolean;
}

const ProjectCard = ({ project, index = 0, isVisible = true }: ProjectCardProps) => (
  <div
    className={`group border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-all duration-300 hover:shadow-card overflow-hidden ${
      isVisible ? 'animate-fade-in-up' : 'opacity-0'
    }`}
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="aspect-video overflow-hidden border-b border-[var(--border-primary)]">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="tag">{project.category}</span>
        <span className="text-xs text-[var(--text-muted)]">{project.year}</span>
      </div>
      <h3 className="font-serif text-xl text-[var(--text-primary)] mb-2">{project.title}</h3>
      <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.technologies.map((t) => (
          <span key={t} className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 border border-[var(--border-primary)]">
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs py-2 px-4"
        >
          <ExternalLink size={12} className="mr-1.5" />
          Live Site
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline text-xs py-2 px-4"
        >
          <ArrowRight size={12} className="mr-1.5" />
          GitHub
        </a>
      </div>
    </div>
  </div>
);

export default ProjectCard;
