import React from 'react';
import { Button } from './Button';

import { twMerge } from 'tailwind-merge';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={twMerge(
        'relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 text-center animate-in fade-in zoom-in-95 duration-500 rounded-3xl',
        'bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl',
        'border border-white/20 dark:border-white/5',
        'shadow-2xl shadow-indigo-500/10 dark:shadow-black/20',
        className
      )}
    >
      {/* Ambient Background Glows */}
      <div
        className={twMerge(
          'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2',
          'w-64 h-64 rounded-full pointer-events-none',
          'bg-indigo-500/20 dark:bg-indigo-500/10 blur-[100px]'
        )}
      />
      <div
        className={twMerge(
          'absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2',
          'w-64 h-64 rounded-full pointer-events-none',
          'bg-fuchsia-500/20 dark:bg-fuchsia-500/10 blur-[100px]'
        )}
      />

      {/* Icon Container with Pulse Effect */}
      <div className="relative mb-8 group">
        <div
          className={twMerge(
            'absolute inset-0 rounded-full transition-all duration-700 opacity-50',
            'bg-indigo-500/20 dark:bg-indigo-400/20',
            'blur-2xl group-hover:blur-3xl animate-pulse-slow'
          )}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10 rounded-full animate-spin-slow"></div>

        <div
          className={twMerge(
            'relative inline-flex items-center justify-center w-24 h-24 rounded-full',
            'bg-gradient-to-b from-white to-indigo-50/50 dark:from-slate-800 dark:to-slate-900/50',
            'border border-white/50 dark:border-white/10',
            'shadow-lg shadow-indigo-500/10 backdrop-blur-sm',
            'group-hover:scale-110 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)'
          )}
        >
          <div className="scale-110 text-indigo-500 dark:text-indigo-400 drop-shadow-sm">
            {icon}
          </div>
        </div>
      </div>

      <h3
        className={twMerge(
          'text-md font-semibold bg-clip-text text-transparent',
          'bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300',
          'mb-0 tracking-tight'
        )}
      >
        {title}
      </h3>

      <p
        className={twMerge(
          'text-slate-600 dark:text-slate-400',
          'mt-0 mb-4 max-w-md mx-auto',
          'leading-relaxed text-base font-semibold'
        )}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className={twMerge(
            'relative z-10 hidden md:inline-flex px-4 py-2 transform transition-all',
            'shadow-xl shadow-indigo-500/20 dark:shadow-indigo-900/30',
            'hover:shadow-indigo-500/30 dark:hover:shadow-indigo-900/40 hover:-translate-y-0.5'
          )}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
