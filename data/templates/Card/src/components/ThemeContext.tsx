'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AccentColor = 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose';

export interface AccentClassSet {
  text: string;
  bg: string;
  border: string;
  glow: string;
  gradient: string;
  badge: string;
}

interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentClass: AccentClassSet;
}

const ACCENT_CLASSES: Record<AccentColor, AccentClassSet> = {
  violet: {
    text: 'text-violet-400',
    bg: 'bg-violet-500',
    border: 'border-violet-500/30 hover:border-violet-400/60',
    glow: 'from-violet-600/20 via-purple-600/10 to-transparent',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  },
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    glow: 'from-cyan-600/20 via-blue-600/10 to-transparent',
    gradient: 'from-cyan-400 via-teal-500 to-blue-500',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    glow: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    glow: 'from-amber-600/20 via-orange-600/10 to-transparent',
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500',
    border: 'border-rose-500/30 hover:border-rose-400/60',
    glow: 'from-rose-600/20 via-pink-600/10 to-transparent',
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  },
};

const DEFAULT_THEME_VALUE: ThemeContextType = {
  isDark: true,
  toggleDark: () => {},
  accent: 'violet',
  setAccent: () => {},
  accentClass: ACCENT_CLASSES.violet,
};

const ThemeContext = createContext<ThemeContextType>(DEFAULT_THEME_VALUE);

export function ThemeProvider({ 
  children,
  initialAccent = 'violet'
}: { 
  children: React.ReactNode;
  initialAccent?: AccentColor;
}) {
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccent] = useState<AccentColor>(initialAccent);

  useEffect(() => {
    if (initialAccent && ACCENT_CLASSES[initialAccent]) {
      setAccent(initialAccent);
    }
  }, [initialAccent]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  const value: ThemeContextType = {
    isDark,
    toggleDark,
    accent,
    setAccent,
    accentClass: ACCENT_CLASSES[accent] || ACCENT_CLASSES.violet,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return DEFAULT_THEME_VALUE;
  }
  return context;
}
