import React from 'react';
import { Button } from '../../core';
import { Sparkles } from 'lucide-react';

interface EmptyDashboardStateProps {
  onCreateHabit: () => void;
}

export const EmptyDashboardState: React.FC<EmptyDashboardStateProps> = ({ onCreateHabit }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-enter bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-900/30 rounded-full blur-xl group-hover:bg-indigo-500/30 dark:group-hover:bg-indigo-900/40 transition-all duration-1000"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/10 dark:shadow-indigo-900/10 border border-indigo-100 dark:border-slate-700">
          <Sparkles className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No habits yet</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed text-base">
        Your journey to success starts with a single step. Add your first habit to begin tracking
        your potential.
      </p>

      <Button
        onClick={onCreateHabit}
        size="lg"
        className="hidden md:inline-flex shadow-xl shadow-indigo-600/20 dark:shadow-indigo-900/20 px-8"
      >
        Create Habit
      </Button>
    </div>
  );
};
