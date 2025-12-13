import orderBy from 'lodash/orderBy';
import React from 'react';
import { Card, Show } from '../../core';
import { BarChart2, Trophy } from 'lucide-react';
import { Habit } from '../../types';
import { cn } from '../../utils';

const HabitPerformanceChart: React.FC<{ habits: Habit[] }> = ({ habits }) => {
  // Sort habits by completion count (descending)
  const sortedHabits = orderBy(habits, [h => h.completedDates.length], ['desc']);
  const maxCompletions = sortedHabits[0]?.completedDates.length || 1;

  return (
    <Card className="p-6 h-full">
      <h3 className="text-md font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Habit Performance
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Ranking your habits by total completions
      </p>

      <div className="space-y-4">
        <Show
          when={sortedHabits.length === 0}
          fallback={
            <>
              {sortedHabits.map(habit => {
                const percentage = Math.round((habit.completedDates.length / maxCompletions) * 100);
                return (
                  <div key={habit.id} className="group">
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span className="text-slate-700 dark:text-slate-300 truncate pr-4">
                        {habit.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                        {habit.completedDates.length}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out md:group-hover:bg-indigo-600"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </>
          }
        >
          <div className="text-center py-8 text-slate-400 italic">No habits to display yet.</div>
        </Show>
      </div>
    </Card>
  );
};

export default HabitPerformanceChart;
