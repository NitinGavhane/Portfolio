import { Code2 } from 'lucide-react';
import { TECH_ICON_PATHS } from '../../lib/techIconPaths';

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

interface TechIconProps {
  name: string;
  size?: number;
}

/**
 * Renders a technology's brand logo (monochrome) inside a small chip, with the
 * name as a tooltip. Unknown technologies fall back to a generic code glyph.
 */
const TechIcon = ({ name, size = 15 }: TechIconProps) => {
  const path = TECH_ICON_PATHS[normalize(name)];
  return (
    <span
      title={name}
      aria-label={name}
      role="img"
      className="w-7 h-7 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] transition-colors group-hover:border-[var(--border-secondary)]"
    >
      {path ? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={path} />
        </svg>
      ) : (
        <Code2 size={size} strokeWidth={1.75} />
      )}
    </span>
  );
};

export default TechIcon;
