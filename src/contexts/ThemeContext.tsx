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
  const [isDark, setIsDark] = useState(true);
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
          localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
        }
      } catch (error) {
        // Fallback if localStorage is not available
        console.warn('localStorage not available, using default theme');
        setIsDark(true);
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
      } catch (error) {
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
    } catch (error) {
      console.warn('Could not save theme preference to localStorage');
    }
    
    // Update CSS custom properties for immediate theme application
    updateCSSVariables(newIsDark);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const updateCSSVariables = (dark: boolean) => {
    const root = document.documentElement;
    
    if (dark) {
      // Dark theme variables
      root.style.setProperty('--bg-primary', '#020617');
      root.style.setProperty('--bg-secondary', '#0f172a');
      root.style.setProperty('--bg-tertiary', '#1e293b');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--text-tertiary', '#94a3b8');
      root.style.setProperty('--border-primary', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--border-secondary', 'rgba(255, 255, 255, 0.2)');
    } else {
      // Light theme variables
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#334155');
      root.style.setProperty('--text-tertiary', '#64748b');
      root.style.setProperty('--border-primary', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--border-secondary', 'rgba(0, 0, 0, 0.2)');
    }
  };

  // Update CSS variables when theme changes
  useEffect(() => {
    if (isInitialized) {
      updateCSSVariables(isDark);
    }
  }, [isDark, isInitialized]);

  // Prevent flash of unstyled content
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
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