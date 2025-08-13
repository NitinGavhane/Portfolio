import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';

const ThemeToggle = () => {
  const { isDark, toggleTheme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const handleThemeSelect = (themeId: string) => {
    if (themeId === 'system') {
      // Remove saved preference and use system default
      try {
        localStorage.removeItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      } catch (error) {
        console.warn('Could not access localStorage or system preferences');
      }
    } else {
      setTheme(themeId as 'light' | 'dark');
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Simple Toggle Button */}
      <button
        onClick={toggleTheme}
        className="group relative p-3 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-500 hover:scale-110 hover:shadow-2xl"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <div className="relative w-6 h-6 overflow-hidden">
          <Sun 
            size={24} 
            className={`absolute inset-0 text-amber-500 transition-all duration-700 transform ${
              isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          <Moon 
            size={24} 
            className={`absolute inset-0 text-blue-400 transition-all duration-700 transform ${
              isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-500 ${
          isDark 
            ? 'bg-blue-400/20 group-hover:bg-blue-400/30' 
            : 'bg-amber-500/20 group-hover:bg-amber-500/30'
        }`}></div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 bg-white/20 scale-0 rounded-full transition-transform duration-300 group-active:scale-150 group-active:opacity-0 ${
            isDark ? 'bg-blue-400/30' : 'bg-amber-500/30'
          }`}></div>
        </div>
      </button>

      {/* Advanced Dropdown (Hidden by default, can be enabled) */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl shadow-luxury overflow-hidden z-50">
          <div className="p-2">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = 
                (option.id === 'dark' && isDark) || 
                (option.id === 'light' && !isDark);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleThemeSelect(option.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{option.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;