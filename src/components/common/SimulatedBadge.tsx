import React from 'react';
import { Sparkles } from 'lucide-react';

interface SimulatedBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const SimulatedBadge: React.FC<SimulatedBadgeProps> = ({ className = '', size = 'sm' }) => {
  return (
    <span
      title="This is a prototype simulation check, not an official government verification."
      className={`inline-flex items-center gap-1 font-semibold tracking-wide uppercase rounded-full border border-sky-300 bg-sky-50 text-sky-800 ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${className}`}
    >
      <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5 text-sky-600' : 'w-3 h-3 text-sky-600'} />
      <span>Simulated</span>
    </span>
  );
};
