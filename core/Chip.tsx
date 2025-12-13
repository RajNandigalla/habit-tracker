import React from 'react';
import { cn } from '../utils';

interface ChipProps {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ onClick, isActive, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 text-sm font-bold rounded-full transition-all duration-300 ease-spring whitespace-nowrap active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 select-none',
        isActive
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700',
        className
      )}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};

export default Chip;
