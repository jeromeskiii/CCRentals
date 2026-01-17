/**
 * Dark Mode Hook - Persisted theme preference with system fallback
 * 
 * Features:
 * - localStorage persistence
 * - System preference detection (prefers-color-scheme)
 * - SSR safe (handles hydration)
 * - Prevents flash of wrong theme
 */

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface DarkModeReturn {
  isDark: boolean;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
  systemPreference: 'light' | 'dark';
}

// Get stored theme or null if not set
function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage might be unavailable
  }
  return null;
}

// Get system preference
function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document
function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useDarkMode(): DarkModeReturn {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Get system preference
    const systemPref = getSystemPreference();
    setSystemPreference(systemPref);
    
    // Get stored preference or use system
    const stored = getStoredTheme();
    const theme: Theme = stored || systemPref;
    
    setIsDark(theme === 'dark');
    applyTheme(theme);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
      
      // Only update if user hasn't set a preference
      if (!getStoredTheme()) {
        const newTheme = e.matches ? 'dark' : 'light';
        setIsDark(newTheme === 'dark');
        applyTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggle = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    
    setIsDark(!isDark);
    applyTheme(newTheme);
    
    // Persist preference
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // localStorage might be unavailable
    }
  }, [isDark]);

  const setTheme = useCallback((theme: Theme) => {
    setIsDark(theme === 'dark');
    applyTheme(theme);
    
    // Persist preference
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // localStorage might be unavailable
    }
  }, []);

  // Return light/dark based on state, not mounted status
  // This prevents hydration mismatch while still being correct
  const effectiveIsDark = mounted ? isDark : systemPreference === 'dark';

  return {
    isDark: effectiveIsDark,
    toggle,
    setTheme,
    systemPreference,
  };
}

// Hook for components that need to know current theme (SSR safe)
export function useTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const stored = getStoredTheme();
    const systemPref = getSystemPreference();
    setTheme(stored || systemPref);
  }, []);
  
  return theme;
}

export default useDarkMode;
