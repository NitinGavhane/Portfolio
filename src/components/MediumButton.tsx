import React from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';

interface MediumButtonProps {
  url: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const MediumButton: React.FC<MediumButtonProps> = ({ 
  url, 
  className = '', 
  variant = 'primary',
  size = 'md',
  children = 'Read on Medium'
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate URL
    if (!url || !isValidMediumUrl(url)) {
      console.error('Invalid Medium URL provided:', url);
      // You could show a toast notification here
      return;
    }

    try {
      // Open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open Medium article:', error);
      // Fallback: try direct navigation
      window.location.href = url;
    }
  };

  const isValidMediumUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'medium.com' || urlObj.hostname.endsWith('.medium.com');
    } catch {
      return false;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-glow';
      case 'secondary':
        return 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30';
      case 'outline':
        return 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white';
      default:
        return 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-glow';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const isValidUrl = isValidMediumUrl(url);

  if (!isValidUrl) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 cursor-not-allowed opacity-50 bg-red-500/20 border border-red-500/30 text-red-400 ${getSizeStyles()} ${className}`}
        title="Invalid Medium URL"
      >
        <AlertCircle size={14} className="mr-1" />
        <span>Invalid URL</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 hover:scale-105 ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      title="Read full article on Medium"
    >
      <span className="flex items-center justify-center">
        {children}
        <ExternalLink size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
      </span>
    </button>
  );
};

export default MediumButton;