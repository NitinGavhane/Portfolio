interface HallOfFameBadgeProps {
  name: string;
  index?: number;
  isVisible?: boolean;
}

const HallOfFameBadge = ({ name, index = 0, isVisible = true }: HallOfFameBadgeProps) => (
  <span
    className={`px-5 py-2.5 border border-[var(--border-primary)] text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] hover:border-[var(--border-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 ${
      isVisible ? 'animate-fade-in-up' : 'opacity-0'
    }`}
    style={{ animationDelay: `${index * 0.06}s` }}
  >
    {name}
  </span>
);

export default HallOfFameBadge;
