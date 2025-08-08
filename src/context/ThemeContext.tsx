import React, { useEffect, useState, createContext, useContext } from 'react';
// Define theme types
type ThemeType = 'light' | 'dark' | 'system';
type ColorScheme = 'indigo' | 'blue' | 'green' | 'purple' | 'amber';
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  chartColors: string[];
}
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  themeColors: ThemeColors;
}
// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  colorScheme: 'indigo',
  setColorScheme: () => {},
  themeColors: {
    primary: 'from-indigo-500 to-purple-600',
    secondary: 'from-amber-500 to-yellow-600',
    accent: 'bg-indigo-500',
    background: 'bg-gray-900',
    cardBackground: 'bg-gray-800/50',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    chartColors: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  }
});
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  // Get initial theme from local storage or default to 'dark'
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme || 'dark';
  });
  // Get initial color scheme from local storage or default to 'indigo'
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
    return savedColorScheme || 'indigo';
  });
  // Define color schemes
  const colorSchemes: Record<ColorScheme, ThemeColors> = {
    indigo: {
      primary: 'from-indigo-500 to-purple-600',
      secondary: 'from-amber-500 to-yellow-600',
      accent: 'bg-indigo-500',
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800/50',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      chartColors: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
    },
    blue: {
      primary: 'from-blue-500 to-cyan-600',
      secondary: 'from-amber-500 to-yellow-600',
      accent: 'bg-blue-500',
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800/50',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      chartColors: ['#3b82f6', '#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    },
    green: {
      primary: 'from-emerald-500 to-green-600',
      secondary: 'from-blue-500 to-indigo-600',
      accent: 'bg-emerald-500',
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800/50',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      chartColors: ['#10b981', '#059669', '#3b82f6', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6']
    },
    purple: {
      primary: 'from-purple-500 to-violet-600',
      secondary: 'from-pink-500 to-rose-600',
      accent: 'bg-purple-500',
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800/50',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      chartColors: ['#8b5cf6', '#a855f7', '#6366f1', '#3b82f6', '#f59e0b', '#ef4444', '#10b981']
    },
    amber: {
      primary: 'from-amber-500 to-orange-600',
      secondary: 'from-blue-500 to-indigo-600',
      accent: 'bg-amber-500',
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800/50',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      chartColors: ['#f59e0b', '#f97316', '#3b82f6', '#6366f1', '#10b981', '#ef4444', '#8b5cf6']
    }
  };
  // Get current theme colors
  const themeColors = colorSchemes[colorScheme];
  // Set theme and save to local storage
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  // Set color scheme and save to local storage
  const setColorScheme = (newColorScheme: ColorScheme) => {
    setColorSchemeState(newColorScheme);
    localStorage.setItem('colorScheme', newColorScheme);
  };
  // Apply theme to document on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
    // Listen for system theme changes if using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        root.classList.toggle('dark', mediaQuery.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  return <ThemeContext.Provider value={{
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    themeColors
  }}>
      {children}
    </ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);