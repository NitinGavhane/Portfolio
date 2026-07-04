import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
          // Use saved preference
          setIsDark(savedTheme === 'dark');
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDark(prefersDark);
          // Save the initial preference
          // Default to light for professional appearance regardless of system
          localStorage.setItem('theme', 'light');
          setIsDark(false);
        }
      } catch {
        // Fallback if localStorage is not available — default to light
        console.warn('localStorage not available, using default theme');
        setIsDark(false);
      }
      
      setIsInitialized(true);
    };

    initializeTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      try {
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
          setIsDark(e.matches);
        }
      } catch {
        // Fallback if localStorage is not available
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const setTheme = (theme: 'light' | 'dark') => {
    const newIsDark = theme === 'dark';
    setIsDark(newIsDark);
    
    try {
      localStorage.setItem('theme', theme);
    } catch {
      console.warn('Could not save theme preference to localStorage');
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Keep the `.dark` class on <html> in sync so Tailwind `dark:` variants and the
  // monochrome editorial tokens in index.css (the single source of truth) both apply.
  useEffect(() => {
    if (isInitialized) {
      const root = document.documentElement;
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    }
  }, [isDark, isInitialized]);

  // Prevent flash of unstyled content
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      <div className={`${isDark ? 'dark' : 'light'} transition-colors duration-500`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};