import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  link: string;
  index?: number;
  isVisible?: boolean;
}

const ServiceCard = ({ icon, title, description, link, index = 0, isVisible = true }: ServiceCardProps) => (
  <Link
    to={link}
    className={`group block p-8 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] transition-all duration-300 hover:shadow-card ${
      isVisible ? 'animate-fade-in-up' : 'opacity-0'
    }`}
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <span className="block text-3xl mb-5 text-[var(--text-muted)] select-none" aria-hidden>
      {icon}
    </span>
    <h3 className="font-serif text-xl text-[var(--text-primary)] mb-3 group-hover:opacity-70 transition-opacity">
      {title}
    </h3>
    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-5">
      {description}
    </p>
    <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-primary)] group-hover:gap-3 transition-all duration-200">
      Learn more <ArrowRight size={13} />
    </span>
  </Link>
);

export default ServiceCard;
