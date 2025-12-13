import React from 'react';
import { Card } from '../../core';
import { BarChart2, Check, Flame, Trophy } from 'lucide-react';
import { GlobalStats } from './types';

const GlobalStatsGrid: React.FC<{ stats: GlobalStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="flex flex-col items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50">
        <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400 mb-2">
          <BarChart2 className="h-5 w-5" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {stats.completionRate}%
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
          30-Day Rate
        </div>
      </Card>

      <Card className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50">
        <div className="p-2 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 mb-2">
          <Check className="h-5 w-5" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {stats.totalCompletions}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
          Total Checks
        </div>
      </Card>

      <Card className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/50">
        <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-400 mb-2">
          <Flame className="h-5 w-5" />
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {stats.longestStreak}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
          Best Streak
        </div>
      </Card>

      <Card className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50">
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400 mb-2">
          <Trophy className="h-5 w-5" />
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-full px-2">
          {stats.bestDay || '-'}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-center">
          Best Day
        </div>
      </Card>
    </div>
  );
};

export default GlobalStatsGrid;
