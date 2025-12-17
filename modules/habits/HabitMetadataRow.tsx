import React from 'react';
import { Habit } from '../../types';
import { cn } from '../../utils';
import { Flame, RotateCcw, Clock, ShieldBan, Repeat } from 'lucide-react';
import { Show } from '../../core';
import { useStore } from '../../context/Store';

interface HabitMetadataRowProps {
  habit: Habit;
  isCompletedSelectedDate: boolean;
  weeklyStats: { current: number; target: number } | null;
}

export const HabitMetadataRow: React.FC<HabitMetadataRowProps> = ({
  habit,
  isCompletedSelectedDate,
  weeklyStats,
}) => {
  const { categories } = useStore();
  const isNegative = habit.habitType === 'negative';

  // Resolve categories for display
  const displayCats: { label: string; icon?: string }[] = [];
  if (habit.categoryIds && habit.categoryIds.length > 0) {
    habit.categoryIds.forEach(id => {
      const cat = categories.find(c => c.id === id);
      if (cat) displayCats.push(cat);
    });
  }

  return (
    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 overflow-hidden mt-0.5">
      {/* Time Badge - Visible if set */}
      {habit.reminderTime && (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" />
          <span>{habit.reminderTime}</span>
        </div>
      )}

      {/* Streak Display */}
      <span className={cn('flex items-center gap-1', isCompletedSelectedDate && 'opacity-75')}>
        <Show
          when={isNegative}
          fallback={
            <>
              <Flame
                className={cn(
                  'w-3.5 h-3.5 transition-colors',
                  habit.streak > 0 && !isCompletedSelectedDate
                    ? 'text-orange-500 fill-orange-500'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              />
              {habit.streak} streak
            </>
          }
        >
          <ShieldBan
            className={cn(
              'w-3.5 h-3.5',
              isCompletedSelectedDate ? 'text-red-500' : 'text-green-500'
            )}
          />
          {habit.streak} days clean
        </Show>
      </span>

      {/* Weekly Stats */}
      {weeklyStats && (
        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
          <Repeat className="w-3 h-3" />
          {weeklyStats.current} / {weeklyStats.target} this week
        </span>
      )}

      {/* Category Chips */}
      <div className="hidden sm:flex gap-1 overflow-x-auto no-scrollbar">
        {displayCats.length > 0 &&
          displayCats.slice(0, 2).map((cat, i) => (
            <span
              key={i}
              className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded whitespace-nowrap',
                isCompletedSelectedDate
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              )}
            >
              <span>{cat.icon}</span> {cat.label}
            </span>
          ))}
        {/* Show count if more than 2 categories */}
        {(habit.categoryIds?.length || 0) > 2 && (
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded text-slate-500 dark:text-slate-400">
            +{habit.categoryIds!.length - 2}
          </span>
        )}
      </div>
    </div>
  );
};

export default HabitMetadataRow;
