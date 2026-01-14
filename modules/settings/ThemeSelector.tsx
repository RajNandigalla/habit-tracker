import React from 'react';
import { motion, Variant } from 'framer-motion';
import { MoonIcon, SunIcon, CheckIcon } from '../../icons';
import { cn } from '../../utils';

type SlideVariants = {
  enter: Variant;
  center: Variant;
  exit: Variant;
};

interface ThemeSelectorProps {
  darkMode: boolean;
  onToggle: () => void;
  direction: number;
  slideVariants: SlideVariants;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  darkMode,
  onToggle,
  direction,
  slideVariants,
}) => {
  return (
    <motion.div
      key="theme"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
      className="space-y-3 bg-white dark:bg-slate-900 min-h-[240px]"
    >
      {/* Light Mode Button */}
      <button
        onClick={() => darkMode && onToggle()}
        aria-label="Switch to light mode"
        className={cn(
          'w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200',
          !darkMode
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
            : 'border-slate-200 dark:border-slate-800'
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <SunIcon className="w-5 h-5" />
          </div>
          <span
            className={cn(
              'font-semibold',
              !darkMode
                ? 'text-indigo-700 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-300'
            )}
          >
            Light Mode
          </span>
        </div>
        {!darkMode && (
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        )}
      </button>

      {/* Dark Mode Button */}
      <button
        onClick={() => !darkMode && onToggle()}
        aria-label="Switch to dark mode"
        className={cn(
          'w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200',
          darkMode
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
            : 'border-slate-200 dark:border-slate-800'
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
            <MoonIcon className="w-5 h-5" />
          </div>
          <span
            className={cn(
              'font-semibold',
              darkMode
                ? 'text-indigo-700 dark:text-indigo-300'
                : 'text-slate-700 dark:text-slate-300'
            )}
          >
            Dark Mode
          </span>
        </div>
        {darkMode && (
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        )}
      </button>
    </motion.div>
  );
};

export default ThemeSelector;
