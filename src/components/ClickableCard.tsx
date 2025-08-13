import React, { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
  disableCardClick?: boolean; // New prop to disable card-level clicking
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
  disableCardClick = false // Default to false for backward compatibility
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { isDark } = useTheme();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if button was clicked or card click is disabled
    if ((e.target as HTMLElement).closest('.card-button') || disableCardClick) {
      return;
    }
    
    e.preventDefault();
    openUrl();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
    openUrl();
  };

  const openUrl = () => {
    if (!url) return;
    
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open URL:', error);
      window.location.href = url;
    }
  };

  const getVariantStyles = () => {
    const baseStyles = `group relative ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300`;
    
    // Only add cursor-pointer and hover effects if card click is enabled
    const interactiveStyles = !disableCardClick ? 'cursor-pointer' : '';
    const hoverStyles = !disableCardClick ? 'hover:scale-105' : '';
    
    switch (variant) {
      case 'blog':
        return `${baseStyles} ${interactiveStyles} ${hoverStyles} ${isDark ? 'hover:bg-white/10 hover:border-white/20' : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-xl'}`;
      case 'project':
        return `${baseStyles} ${interactiveStyles} ${hoverStyles} ${isDark ? 'hover:bg-white/8 hover:border-primary-500/30' : 'hover:bg-gray-50 hover:border-primary-500/30 hover:shadow-xl'} hover:shadow-glow`;
      case 'ebook':
        return `${baseStyles} ${interactiveStyles} ${hoverStyles} ${isDark ? 'hover:bg-white/8 hover:border-accent-500/30' : 'hover:bg-gray-50 hover:border-accent-500/30 hover:shadow-xl'}`;
      default:
        return `${baseStyles} ${interactiveStyles} ${hoverStyles} ${isDark ? 'hover:bg-white/10 hover:border-white/20' : 'hover:bg-gray-50 hover:border-gray-300 hover:shadow-xl'}`;
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'ai': 'from-purple-500 to-violet-500',
      'development': 'from-blue-500 to-cyan-500',
      'database': 'from-green-500 to-emerald-500',
      'frontend': 'from-orange-500 to-red-500',
      'backend': 'from-indigo-500 to-purple-500',
      'security': 'from-red-500 to-pink-500',
      'tutorial': 'from-yellow-500 to-orange-500',
      'cybersecurity': 'from-red-500 to-pink-500',
    };
    
    const lowerCat = cat?.toLowerCase() || '';
    for (const [key, color] of Object.entries(colors)) {
      if (lowerCat.includes(key)) {
        return color;
      }
    }
    return 'from-gray-500 to-gray-600';
  };

  return (
    <article
      className={`${getVariantStyles()} ${className}`}
      onClick={!disableCardClick ? handleCardClick : undefined}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      role={!disableCardClick ? "button" : undefined}
      tabIndex={!disableCardClick ? 0 : undefined}
      onKeyDown={!disableCardClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openUrl();
        }
      } : undefined}
      aria-label={!disableCardClick ? `Read more about ${title}` : undefined}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 transition-opacity duration-300 ${
        isCardHovered && !disableCardClick ? 'opacity-100' : 'opacity-0'
      }`}></div>
      
      {/* Image Section */}
      {image && (
        <div className="relative h-32 overflow-hidden">
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isCardHovered && !disableCardClick ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-dark-900/80 via-transparent to-transparent' : 'bg-gradient-to-t from-white/80 via-transparent to-transparent'} transition-colors duration-300`}></div>
          
          {/* Category Badge */}
          {category && (
            <div className="absolute bottom-3 left-3">
              <div className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(category)} text-white text-xs font-medium rounded-full`}>
                {category}
              </div>
            </div>
          )}

          {/* External Link Indicator */}
          <div className={`absolute top-3 right-3 p-1.5 ${isDark ? 'bg-black/50' : 'bg-white/80'} backdrop-blur-sm rounded-full ${isDark ? 'text-white' : 'text-gray-900'} transition-all duration-300 ${
            isCardHovered && !disableCardClick ? 'scale-110' : 'scale-100'
          }`}>
            <ExternalLink size={12} />
          </div>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-sm transition-opacity duration-300 ${
            isCardHovered && !disableCardClick ? 'opacity-100' : 'opacity-0'
          }`}></div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 relative z-10">
        <h3 className={`text-lg font-bold mb-2 transition-all duration-300 line-clamp-2 ${
          isCardHovered && !disableCardClick
            ? 'text-transparent bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text' 
            : `${isDark ? 'text-white' : 'text-gray-900'}`
        }`}>
          {title}
        </h3>
        
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3 leading-relaxed line-clamp-3 transition-colors duration-300`}>
          {description}
        </p>

        {/* Metadata */}
        {metadata && (
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} mb-4 transition-colors duration-300`}>
            {metadata.date && (
              <span className="flex items-center">
                📅 {metadata.date}
              </span>
            )}
            {metadata.readTime && (
              <span className="flex items-center">
                ⏱️ {metadata.readTime}
              </span>
            )}
            {metadata.author && (
              <span className="flex items-center">
                👤 {metadata.author}
              </span>
            )}
          </div>
        )}

        {/* Custom Children Content */}
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}

        {/* CTA Button */}
        <button
          className="card-button group/btn relative w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg transition-all duration-300 overflow-hidden"
          onClick={handleButtonClick}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          style={{
            transform: isButtonHovered ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isButtonHovered ? '0 0 20px rgba(14, 165, 233, 0.5)' : 'none'
          }}
        >
          {/* Button Background Animation */}
          <div className={`absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 transition-opacity duration-300 ${
            isButtonHovered ? 'opacity-100' : 'opacity-0'
          }`}></div>
          
          {/* Button Content */}
          <span className="relative z-10 flex items-center justify-center text-sm">
            {buttonText}
            <ArrowRight 
              size={14} 
              className={`ml-1 transition-transform duration-300 ${
                isButtonHovered ? 'translate-x-1' : 'translate-x-0'
              }`} 
            />
          </span>

          {/* Shimmer Effect */}
          <div className={`absolute inset-0 bg-white/20 transition-all duration-500 ${
            isButtonHovered ? 'animate-shimmer' : ''
          }`}></div>
        </button>
      </div>

      {/* Card Hover Indicator - Only show if card click is enabled */}
      {!disableCardClick && (
        <div className={`absolute top-2 left-2 w-2 h-2 bg-primary-500 rounded-full transition-all duration-300 ${
          isCardHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-60'
        }`}></div>
      )}
    </article>
  );
};

export default ClickableCard;