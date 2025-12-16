import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dayjs, cn } from '../../utils';

interface WeeklyCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  currentDate?: string; // For reference (today), defaults to now
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  onSelectDate,
  currentDate = dayjs().format('YYYY-MM-DD'),
}) => {
  // Derive the start of the week for the currently selected date
  const startOfWeek = useMemo(() => {
    return dayjs(selectedDate).startOf('week');
  }, [selectedDate]);

  // Generate the 7 days
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.add(i, 'day');
      return {
        date: date.format('YYYY-MM-DD'),
        dayName: date.format('ddd'), // Corrected format: "Sun", "Mon", etc.
        dayNumber: date.format('D'),
        isToday: date.format('YYYY-MM-DD') === currentDate,
        isSelected: date.format('YYYY-MM-DD') === selectedDate,
      };
    });
  }, [startOfWeek, selectedDate, currentDate]);

  const handlePrevWeek = () => {
    // onSelectDate(dayjs(selectedDate).subtract(1, 'week').startOf('week').format('YYYY-MM-DD'));
    // User requested animations previously, assuming they are still wanted or were lost in revert?
    // The user revert removed state. I should probably re-add it if I can, but user said "Just add day names for time being".
    // I will stick to the minimum request first to avoid conflict, but the width fix is important.
    onSelectDate(dayjs(selectedDate).subtract(1, 'week').startOf('week').format('YYYY-MM-DD'));
  };

  const handleNextWeek = () => {
    onSelectDate(dayjs(selectedDate).add(1, 'week').startOf('week').format('YYYY-MM-DD'));
  };

  const handleJumpToToday = () => {
    onSelectDate(currentDate);
  };

  const showTodayButton = useMemo(() => {
    return !days.some(day => day.isToday);
  }, [days]);

  const currentMonthYear = startOfWeek.format('MMM YYYY');

  return (
    <div className="w-full mb-6 md:max-w-lg md:mx-auto relative">
      {/* Search/Filter toggle would go here if needed, keeping relative for positioning */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-4 px-2">
        <div className="flex justify-start">
          <button
            onClick={handlePrevWeek}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-6 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-500/30">
          <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-100">
            {currentMonthYear}
          </h3>
        </div>

        <div className="flex justify-end items-center gap-2">
          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Action Bar - "Jump to Today" */}
      <AnimatePresence>
        {showTodayButton && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex justify-center overflow-hidden py-1"
          >
            <button
              onClick={handleJumpToToday}
              className="px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-2 shadow-sm my-0.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
              Return to Today
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Days Strip */}
      <div className="grid grid-cols-7 gap-1 md:gap-3">
        {days.map(day => (
          <button
            key={day.date}
            onClick={() => onSelectDate(day.date)}
            className={cn(
              'flex flex-col items-center justify-center py-3 rounded-[20px] transition-all duration-300 relative group',
              day.isSelected
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-110 z-10'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
            )}
          >
            <span
              className={cn(
                'text-xs font-medium mb-1',
                day.isSelected ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {day.dayName}
            </span>
            <span
              className={cn(
                'text-lg font-bold',
                day.isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-300'
              )}
            >
              {day.dayNumber}
            </span>

            {/* Today Dot Indicator (if not selected) */}
            {day.isToday && !day.isSelected && (
              <div className="absolute bottom-1.5 w-1 h-1 bg-indigo-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
