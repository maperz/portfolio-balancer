/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: EffectiveTheme;
  setThemePreference: (theme: Theme) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Initialize with saved theme preference or default to system
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolioBalancerTheme');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme as Theme;
      }
    }
    return 'system';
  });
  
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    // Initialize effective theme immediately
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolioBalancerTheme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // If system or no saved theme, get system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Function to get system preference
  const getSystemTheme = (): EffectiveTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Function to apply theme to document
  const applyTheme = (themeToApply: EffectiveTheme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (themeToApply === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Apply initial theme immediately on mount
  useEffect(() => {
    applyTheme(effectiveTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update effective theme and apply it when theme preference changes
  useEffect(() => {
    let newEffectiveTheme: EffectiveTheme;
    
    if (theme === 'system') {
      newEffectiveTheme = getSystemTheme();
    } else {
      newEffectiveTheme = theme;
    }
    
    setEffectiveTheme(newEffectiveTheme);
    applyTheme(newEffectiveTheme);
    
    // Save theme preference
    localStorage.setItem('portfolioBalancerTheme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = getSystemTheme();
        setEffectiveTheme(systemTheme);
        applyTheme(systemTheme);
      }
    };
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setThemePreference = (newTheme: Theme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemePreference(themes[nextIndex]);
  };

  const value: ThemeContextValue = {
    theme, // user preference: 'light', 'dark', 'system'
    effectiveTheme, // actual applied theme: 'light' or 'dark'
    setThemePreference,
    toggleTheme,
    isSystemTheme: theme === 'system',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
