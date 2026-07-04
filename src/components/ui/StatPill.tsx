interface StatPillProps {
  value: string;
  label: string;
  index?: number;
  isVisible?: boolean;
}

const StatPill = ({ value, label, index = 0, isVisible = true }: StatPillProps) => (
  <div
    className={`p-6 border border-[var(--border-primary)] text-center ${
      isVisible ? 'animate-fade-in-up' : 'opacity-0'
    }`}
    style={{ animationDelay: `${index * 0.08}s` }}
  >
    <p className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] mb-1">{value}</p>
    <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
  </div>
);

export default StatPill;
