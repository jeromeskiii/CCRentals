import React from 'react';
import { THEME } from '../../lib/theme';

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full max-w-7xl mx-auto p-6 ${className}`} style={{ fontFamily: THEME.fonts.body, backgroundColor: THEME.colors.paper, color: THEME.colors.ink }}>
    {children}
  </div>
);

export const SectionHeader = ({ title, meta }: { title: string; meta?: string }) => (
  <div className="flex items-end justify-between border-b border-stone-400 pb-2 mb-6 uppercase tracking-wider">
    <h2 className="text-3xl font-light italic" style={{ fontFamily: THEME.fonts.heading }}>{title}</h2>
    {meta && <span className="text-xs font-bold font-mono text-stone-500 mb-1">{meta}</span>}
  </div>
);
