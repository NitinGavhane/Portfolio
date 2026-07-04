import React, { useState } from 'react';
import { ExternalLink, ArrowRight, Calendar, Clock, User } from 'lucide-react';

interface ClickableCardProps {
  url: string;
  title: string;
  description: string;
  image?: string;
  category?: string;
  metadata?: {
    date?: string;
    readTime?: string;
    author?: string;
  };
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'blog' | 'project' | 'ebook';
  children?: React.ReactNode;
  disableCardClick?: boolean; // Disable card-level clicking (button still works)
}

const ClickableCard: React.FC<ClickableCardProps> = ({
  url,
  title,
  description,
  image,
  category,
  metadata,
  buttonText = 'Read More',
  className = '',
  variant = 'default',
  children,
  disableCardClick = false,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  const openUrl = () => {
    if (!url) return;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open URL:', error);
      window.location.href = url;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.card-button') || disableCardClick) return;
    e.preventDefault();
    openUrl();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openUrl();
  };

  const interactive = !disableCardClick;

  return (
    <article
      data-variant={variant}
      className={`group relative flex flex-col bg-[var(--bg-primary)] border border-[var(--border-primary)] overflow-hidden transition-all duration-300 hover:border-[var(--border-secondary)] hover:shadow-card ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={interactive ? handleCardClick : undefined}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openUrl();
              }
            }
          : undefined
      }
      aria-label={interactive ? `Read more about ${title}` : undefined}
    >
      {/* Image */}
      {image && (
        <div className="relative h-40 overflow-hidden border-b border-[var(--border-primary)]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          {category && (
            <span className="absolute bottom-3 left-3 tag bg-[var(--bg-primary)]">
              {category}
            </span>
          )}
          {interactive && (
            <span className="absolute top-3 right-3 p-1.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)]">
              <ExternalLink size={12} />
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-[var(--text-primary)] mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Metadata */}
        {metadata && (
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] mb-4">
            {metadata.date && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {metadata.date}
              </span>
            )}
            {metadata.readTime && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {metadata.readTime}
              </span>
            )}
            {metadata.author && (
              <span className="flex items-center gap-1">
                <User size={11} />
                {metadata.author}
              </span>
            )}
          </div>
        )}

        {/* Custom children */}
        {children && <div className="mb-4">{children}</div>}

        {/* CTA */}
        <button
          className="card-button btn-primary w-full text-xs py-2.5 mt-auto group/btn"
          onClick={handleButtonClick}
        >
          {buttonText}
          <ArrowRight
            size={13}
            className="ml-1.5 transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        </button>
      </div>

      {/* Subtle hover indicator */}
      {interactive && (
        <span
          className={`absolute top-0 left-0 h-px bg-[var(--text-primary)] transition-all duration-300 ${
            isCardHovered ? 'w-full' : 'w-0'
          }`}
        />
      )}
    </article>
  );
};

export default ClickableCard;
