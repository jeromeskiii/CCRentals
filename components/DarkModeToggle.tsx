/**
 * Dark Mode Toggle Button
 * 
 * Features:
 * - Smooth transitions between states
 * - Respects system preference
 * - Shows current state with icons
 * - Accessible with keyboard support
 */

import React, { useCallback } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

interface DarkModeToggleProps {
  variant?: 'icon' | 'button' | 'compact';
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  variant = 'icon',
  className = '',
}) => {
  const { isDark, toggle, systemPreference } = useDarkMode();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggle();
  }, [toggle]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }, [toggle]);

  // Icon-only variant (default)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`relative p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Current: ${systemPreference} mode. Click to switch.`}
      >
        <span className="sr-only">
          {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        </span>
        
        {/* Sun icon (shown in dark mode) */}
        <svg
          className={`w-5 h-5 transition-all duration-300 ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100 text-amber-400' 
              : 'opacity-0 -rotate-90 scale-50 text-amber-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        {/* Moon icon (shown in light mode) */}
        <svg
          className={`absolute top-2 left-2 w-5 h-5 transition-all duration-300 ${
            !isDark 
              ? 'opacity-100 rotate-0 scale-100 text-slate-700' 
              : 'opacity-0 rotate-90 scale-50 text-slate-700'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    );
  }

  // Button variant with text
  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-foreground font-medium">Light Mode</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <span className="text-foreground font-medium">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Compact variant (icon + small indicator)
  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative w-10 h-10 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Background track */}
        <div 
          className={`w-6 h-6 rounded-full transition-all duration-300 ${
            isDark 
              ? 'translate-y-[-4px] bg-slate-700' 
              : 'translate-y-[4px] bg-amber-400'
          }`}
        />
      </div>
      
      {/* Small sun icon */}
      <svg
        className={`absolute top-1 left-1 w-3 h-3 transition-all duration-300 ${
          isDark ? 'opacity-0' : 'opacity-100 text-amber-500'
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" />
      </svg>
      
      {/* Small moon icon */}
      <svg
        className={`absolute bottom-1 right-1 w-3 h-3 transition-all duration-300 ${
          isDark ? 'opacity-100 text-slate-300' : 'opacity-0'
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
      </svg>
    </button>
  );
};

export default DarkModeToggle;
