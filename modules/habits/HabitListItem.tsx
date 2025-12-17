import React from 'react';
import { Habit } from '../../types';
import { cn, getTodayISO, isHabitScheduledForDate, calculateWeeklyProgress } from '../../utils';
import {
  Check,
  Flame,
  Timer,
  Crown,
  Trash2,
  BarChart2,
  Skull,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Button, Show } from '../../core';
import { useStore } from '../../context/Store';
import { HabitActionProps } from './HabitDetailsModal';
import { HabitMetadataRow } from './HabitMetadataRow';
import { useAnnouncer } from '../../hooks/useAnnouncer';
import { useNavigate, useLocation } from 'react-router-dom';

const HabitListItem: React.FC<{ habit: Habit; selectedDate?: string } & HabitActionProps> = ({
  habit,
  toggleHabitCompletion,
  selectedDate = getTodayISO(),
}) => {
  const { categories } = useStore();
  const { announce } = useAnnouncer();
  const navigate = useNavigate();
  const location = useLocation();

  const isCompletedSelectedDate = habit.completedDates.includes(selectedDate);

  const isChallenge = !!habit.challengeId;
  const isNegative = habit.habitType === 'negative';
  const isScheduledForDate = isHabitScheduledForDate(habit, selectedDate);
  const isScheduledToday = isHabitScheduledForDate(habit, getTodayISO());

  // Simplified logic for "active" styling - use selected date
  const isActiveForView = isScheduledForDate;

  const weeklyStats = calculateWeeklyProgress(habit);

  const handleFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/focus/${habit.id}`, { state: { background: location } });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHabitCompletion(habit.id, selectedDate);
    const wasCompleted = habit.completedDates.includes(selectedDate);
    const status = wasCompleted ? 'incomplete' : 'complete';
    announce(`${habit.name} marked as ${status}`);
  };

  const handleStats = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/habit/${habit.id}`, { state: { background: location } });
  };

  const handleQuickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/habit/${habit.id}`, { state: { background: location, mode: 'delete' } });
  };

  return (
    <>
      <button
        onClick={() => {
          navigate(`/habit/${habit.id}`, { state: { background: location } });
        }}
        aria-label={`View details for ${habit.name}`}
        className={cn(
          'group relative flex items-center p-3 bg-white dark:bg-slate-800 rounded-3xl border transition-all duration-300 ease-ios cursor-pointer shadow-xs md:hover:shadow-md active:scale-[0.99] w-full text-left transform-gpu will-change-transform',
          isCompletedSelectedDate
            ? isNegative
              ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/50'
              : 'border-slate-200 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-900/30'
            : 'border-slate-200 dark:border-slate-700 md:hover:border-indigo-300 dark:md:hover:border-indigo-700',
          !isActiveForView && !isCompletedSelectedDate && 'opacity-70 grayscale-[0.5]'
        )}
      >
        {/* Checkbox / Action Area */}
        <div
          className="flex-shrink-0 mr-3 pl-2 flex items-center cursor-pointer self-stretch"
          onClick={handleToggle}
        >
          <button
            type="button"
            disabled={!isActiveForView && !isCompletedSelectedDate && habit.frequency !== 'weekly'}
            aria-label={
              isNegative ? `Log incident for ${habit.name}` : `Mark ${habit.name} as complete`
            }
            className={cn(
              'w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ease-spring border-2 relative overflow-hidden pointer-events-none',
              isNegative
                ? isCompletedSelectedDate
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 md:hover:border-red-400 dark:md:hover:border-red-500'
                : isCompletedSelectedDate
                  ? 'bg-green-500 border-green-500 text-white scale-100'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-transparent md:hover:border-indigo-400 dark:md:hover:border-indigo-500 md:hover:bg-indigo-50 dark:md:hover:bg-indigo-900/10 active:scale-90'
            )}
          >
            <Show
              when={isNegative}
              fallback={
                <Check
                  className={cn(
                    'w-4 h-4 transition-transform duration-300 ease-spring',
                    isCompletedSelectedDate ? 'scale-100' : 'scale-0'
                  )}
                  strokeWidth={3}
                />
              }
            >
              <Show
                when={isCompletedSelectedDate}
                fallback={<Skull className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />}
              >
                <AlertCircle className="w-4 h-4" />
              </Show>
            </Show>
          </button>
        </div>

        {/* Content Area */}
        <div className={cn('flex-grow min-w-0 flex flex-col gap-1')}>
          {/* Row 1: Title & Badges */}
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                'font-bold text-base truncate transition-all duration-300',
                isCompletedSelectedDate
                  ? 'text-slate-500 dark:text-slate-400'
                  : 'text-slate-900 dark:text-white',
                isNegative &&
                  isCompletedSelectedDate &&
                  'text-red-600 dark:text-red-400 decoration-red-300'
              )}
            >
              {habit.name}
            </h3>

            {/* Visual Badges - show primary category color */}
            <div
              className={cn(
                'w-2 h-2 rounded-full flex-shrink-0 transition-all',
                isCompletedSelectedDate ? 'opacity-50 grayscale' : ''
              )}
              style={{ backgroundColor: habit.color }}
            />

            {isChallenge && (
              <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 animate-pulse" />
            )}

            {!isActiveForView && !isCompletedSelectedDate && habit.frequency !== 'weekly' && (
              <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 rounded">
                Rest Day
              </span>
            )}
          </div>

          {/* Row 2: Description (if exists) */}
          {habit.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 font-medium">
              {habit.description}
            </p>
          )}

          {/* Row 3: Metadata (Time + Stats) */}
          <HabitMetadataRow
            habit={habit}
            isCompletedSelectedDate={isCompletedSelectedDate}
            weeklyStats={weeklyStats}
          />
        </div>

        {/* Actions Area */}
        <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative z-20">
          {!isNegative && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleFocus}
              aria-label={`Start focus timer for ${habit.name}`}
              className="hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            >
              <Timer className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleStats}
            aria-label={`View stats for ${habit.name}`}
            className="hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
          <button
            onClick={handleQuickDelete}
            aria-label={`Delete ${habit.name}`}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Chevron Indicator */}
        <div className="lg:hidden ml-2 text-slate-500 dark:text-slate-500">
          <ChevronRight className="w-6 h-6" strokeWidth={2} />
        </div>
      </button>
    </>
  );
};

export default HabitListItem;
