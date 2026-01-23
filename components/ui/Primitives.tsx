import React from 'react';
import { THEME } from '../../lib/theme';

export const Card = ({
  children,
  className = '',
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) => (
  <div
    className={`border border-stone-400 bg-stone-50/50 backdrop-blur-sm relative overflow-hidden group ${className}`}
  >
    {/* Corner accents for industrial feel */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-stone-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-stone-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-stone-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-stone-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className={noPadding ? '' : 'p-5'}>{children}</div>
  </div>
);

export const Badge = ({ status, label }: { status: string; label?: string }) => {
  const styles: Record<string, string> = {
    active: 'border-orange-600 text-orange-700 bg-orange-50',
    verified: 'border-emerald-700 text-emerald-800 bg-emerald-50',
    pending: 'border-amber-600 text-amber-700 bg-amber-50',
    locked: 'border-stone-600 text-stone-600 bg-stone-100',
  };

  return (
    <span
      className={`px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono border ${styles[status] || styles.locked}`}
    >
      {label || status}
    </span>
  );
};

export const DataPoint = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase text-stone-500 tracking-wider mb-1">{label}</span>
    <span
      className={`text-sm ${mono ? 'font-mono' : 'font-medium'} border-l-2 border-stone-300 pl-3 -ml-3 hover:border-orange-500 hover:pl-3 transition-all duration-300`}
    >
      {value}
    </span>
  </div>
);
