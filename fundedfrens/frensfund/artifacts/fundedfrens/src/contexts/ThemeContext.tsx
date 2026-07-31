import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'mono';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('ff-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'mono') return stored;
    } catch {}
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'mono');
    root.classList.add(theme);
    try {
      localStorage.setItem('ff-theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => {
    const themes: Theme[] = ['dark', 'light', 'mono'];
    return themes[(themes.indexOf(prev) + 1) % themes.length];
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
