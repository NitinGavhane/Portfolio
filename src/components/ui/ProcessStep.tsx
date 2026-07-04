interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  index?: number;
  isVisible?: boolean;
}

const ProcessStep = ({ number, title, description, index = 0, isVisible = true }: ProcessStepProps) => (
  <div
    className={`p-8 ${
      isVisible ? 'animate-fade-in-up' : 'opacity-0'
    }`}
    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
  >
    <span className="block font-serif text-4xl text-[var(--text-muted)] mb-5">{number}</span>
    <h3 className="font-medium text-base text-[var(--text-primary)] mb-2">{title}</h3>
    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed">{description}</p>
  </div>
);

export default ProcessStep;
