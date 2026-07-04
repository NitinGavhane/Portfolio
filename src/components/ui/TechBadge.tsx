interface TechBadgeProps {
  name: string;
  index?: number;
  isVisible?: boolean;
}

const TechBadge = ({ name, index = 0, isVisible = true }: TechBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-primary)] text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] ${
      isVisible ? 'animate-fade-in-up' : 'opacity-0'
    }`}
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    {name}
  </span>
);

export default TechBadge;
