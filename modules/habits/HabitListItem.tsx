import React, { useState } from 'react';
import { Habit } from '../../types';
import { cn, getTodayISO, isHabitScheduledForDate, calculateWeeklyProgress } from '../../utils';
import {
  Check,
  Flame,
  Timer,
  Crown,
  Trash2,
  BarChart2,
  Bell,
  Repeat,
  ShieldBan,
  Skull,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Button, Show } from '../../core';
import { useStore } from '../../context/Store';
import HabitDetailsModal, { HabitActionProps } from './HabitDetailsModal';

const HabitListItem: React.FC<{ habit: Habit } & HabitActionProps> = ({
  habit,
  toggleHabitCompletion,
  onFocus,
}) => {
  const { updateHabit, deleteHabit } = useStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'view' | 'edit' | 'delete'>('view');

  const today = getTodayISO();
  const isCompletedToday = habit.completedDates.includes(today);

  const isChallenge = !!habit.challengeId;
  const isNegative = habit.habitType === 'negative';
  const isScheduledToday = isHabitScheduledForDate(habit, today);
  const weeklyStats = calculateWeeklyProgress(habit);

  const handleFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFocus) onFocus(habit);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHabitCompletion(habit.id, today);
  };

  const handleStats = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInitialMode('view');
    setDetailsOpen(true);
  };

  const handleQuickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setInitialMode('delete');
    setDetailsOpen(true);
  };

  return (
    <>
      <div
        onClick={() => {
          setInitialMode('view');
          setDetailsOpen(true);
        }}
        className={cn(
          'group relative flex items-center p-3 bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 ease-ios cursor-pointer shadow-sm md:hover:shadow-md active:scale-[0.99]',
          isCompletedToday
            ? isNegative
              ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/50'
              : 'border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-900/30'
            : 'border-slate-200 dark:border-slate-700 md:hover:border-indigo-300 dark:md:hover:border-indigo-700',
          !isScheduledToday && !isCompletedToday && 'opacity-70 grayscale-[0.5]'
        )}
      >
        {/* Checkbox / Action Area */}
        <div className="flex-shrink-0 mr-3">
          <button
            onClick={handleToggle}
            disabled={!isScheduledToday && !isCompletedToday && habit.frequency !== 'weekly'}
            className={cn(
              'w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 ease-spring border-2 relative overflow-hidden',
              isNegative
                ? isCompletedToday
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 md:hover:border-red-400 dark:md:hover:border-red-500'
                : isCompletedToday
                  ? 'bg-green-500 border-green-500 text-white scale-100'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-transparent md:hover:border-indigo-400 dark:md:hover:border-indigo-500 md:hover:bg-indigo-50 dark:md:hover:bg-indigo-900/10 active:scale-90'
            )}
            title={isNegative ? 'Log Incident' : 'Complete Habit'}
          >
            <Show
              when={isNegative}
              fallback={
                <Check
                  className={cn(
                    'w-4 h-4 transition-transform duration-300 ease-spring',
                    isCompletedToday ? 'scale-100' : 'scale-0'
                  )}
                  strokeWidth={3}
                />
              }
            >
              <Show
                when={isCompletedToday}
                fallback={<Skull className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />}
              >
                <AlertCircle className="w-4 h-4" />
              </Show>
            </Show>
          </button>
        </div>

        {/* Content Area */}
        <div className={cn('flex-grow min-w-0')}>
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={cn(
                'font-bold text-base truncate transition-all duration-300',
                isCompletedToday
                  ? 'text-slate-500 dark:text-slate-400'
                  : 'text-slate-900 dark:text-white',
                isNegative &&
                  isCompletedToday &&
                  'text-red-600 dark:text-red-400 decoration-red-300'
              )}
            >
              {habit.name}
            </h3>

            {/* Visual Badges */}
            <div
              className={cn(
                'w-2 h-2 rounded-full flex-shrink-0 transition-all',
                isCompletedToday ? 'opacity-50 grayscale' : ''
              )}
              style={{ backgroundColor: habit.color }}
              title={habit.category}
            />

            {isChallenge && (
              <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 animate-pulse" />
            )}

            {habit.reminderTime && !isCompletedToday && isScheduledToday && (
              <Bell className="h-3 w-3 text-slate-400" />
            )}

            {!isScheduledToday && !isCompletedToday && habit.frequency !== 'weekly' && (
              <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 rounded">
                Rest Day
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className={cn('flex items-center gap-1', isCompletedToday && 'opacity-75')}>
              <Show
                when={isNegative}
                fallback={
                  <>
                    <Flame
                      className={cn(
                        'w-3.5 h-3.5 transition-colors',
                        habit.streak > 0 && !isCompletedToday
                          ? 'text-orange-500 fill-orange-500'
                          : 'text-slate-400'
                      )}
                    />
                    {habit.streak} streak
                  </>
                }
              >
                <ShieldBan
                  className={cn(
                    'w-3.5 h-3.5',
                    isCompletedToday ? 'text-red-500' : 'text-green-500'
                  )}
                />
                {habit.streak} days clean
              </Show>
            </span>

            {weeklyStats && (
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <Repeat className="w-3 h-3" />
                {weeklyStats.current} / {weeklyStats.target} this week
              </span>
            )}

            <span
              className={cn(
                'hidden sm:inline-block px-1.5 py-0.5 rounded',
                isCompletedToday
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              )}
            >
              {habit.category}
            </span>
          </div>
        </div>

        {/* Actions Area */}
        <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative z-20">
          {!isNegative && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleFocus}
              title="Start Focus Timer"
              className="hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            >
              <Timer className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleStats}
            title="View Stats"
            className="hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
          <button
            onClick={handleQuickDelete}
            title="Delete Habit"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Chevron Indicator */}
        <div className="lg:hidden ml-2 text-slate-400 dark:text-slate-600">
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>

      <HabitDetailsModal
        habit={habit}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onUpdate={updateHabit}
        onDelete={deleteHabit}
        onFocus={onFocus}
        initialMode={initialMode}
      />
    </>
  );
};

export default HabitListItem;
