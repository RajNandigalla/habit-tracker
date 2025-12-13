import React from 'react';
import { Button } from '../../core';
import { Sparkles } from 'lucide-react';

interface EmptyJournalStateProps {
  onCreateEntry: () => void;
}

export const EmptyJournalState: React.FC<EmptyJournalStateProps> = ({ onCreateEntry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-900/30 rounded-full blur-xl"></div>
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-900/10">
          <Sparkles className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Start Your Journal</h3>
      <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-md mx-auto leading-relaxed">
        Documenting your journey boosts success rates by 40%. Record your first milestone, thought,
        or feeling today.
      </p>
      <Button
        size="lg"
        onClick={onCreateEntry}
        className="hidden md:inline-flex px-8 shadow-xl shadow-indigo-600/20 dark:shadow-indigo-900/20"
      >
        Write First Entry
      </Button>
    </div>
  );
};
