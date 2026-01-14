import React from 'react';
import { Habit } from '../../types';
import { HeatmapGrid, HeatmapData } from '../progress';
import dayjs from 'dayjs';

interface HabitStatsProps {
  habit: Habit;
  stats: {
    totalCompletions: number;
    longestStreak: number;
  };
}

export const HabitStats: React.FC<HabitStatsProps> = ({ habit, stats }) => {
  const heatmapData: HeatmapData[] = React.useMemo(() => {
    const days = 105;
    const data: HeatmapData[] = [];
    const todayObj = dayjs();

    for (let i = days - 1; i >= 0; i--) {
      const date = todayObj.subtract(i, 'day').format('YYYY-MM-DD');
      const isCompleted = habit.completedDates.includes(date);
      data.push({
        date,
        count: isCompleted ? 1 : 0,
      });
    }
    return data;
  }, [habit.completedDates]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/10 rounded-3xl">
          <div className="text-3xl font-extrabold text-orange-500 dark:text-orange-400 mb-1">
            {habit.streak}
          </div>
          <div className="text-[10px] font-bold text-orange-400/70 dark:text-orange-300 uppercase tracking-widest">
            {habit.habitType === 'negative' ? 'Days Free' : 'Current'}
          </div>
        </div>
        {habit.habitType === 'positive' && (
          <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-3xl">
            <div className="text-3xl font-extrabold text-blue-500 dark:text-blue-400 mb-1">
              {stats.longestStreak}
            </div>
            <div className="text-[10px] font-bold text-blue-400/70 dark:text-blue-300 uppercase tracking-widest">
              Longest
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl">
          <div className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 mb-1">
            {stats.totalCompletions}
          </div>
          <div className="text-[10px] font-bold text-emerald-400/70 dark:text-emerald-300 uppercase tracking-widest">
            {habit.habitType === 'negative' ? 'Incidents' : 'Total'}
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="pt-2">
        <div className="flex items-baseline justify-between mb-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide opacity-80 flex items-center gap-2">
            Recent Activity
          </h4>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Last 15 Weeks
          </span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-center overflow-x-auto">
          <HeatmapGrid data={heatmapData} />
        </div>
      </div>
    </div>
  );
};

export default HabitStats;
