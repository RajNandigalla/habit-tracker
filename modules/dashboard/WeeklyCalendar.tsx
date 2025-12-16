import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dayjs, cn } from '../../utils';

interface WeeklyCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  currentDate?: string;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  onSelectDate,
  currentDate = dayjs().format('YYYY-MM-DD'),
}) => {
  // Track direction for animation: 1 = Next (Slide Left), -1 = Prev (Slide Right)
  const [direction, setDirection] = React.useState(0);

  // Generate Current Week Days
  const days = useMemo(() => {
    const startOfWeek = dayjs(selectedDate).startOf('week');
    return Array.from({ length: 7 }).map((_, i) => {
      const date = startOfWeek.add(i, 'day');
      return {
        date: date.format('YYYY-MM-DD'),
        dayName: date.format('ddd'),
        dayNumber: date.format('D'),
        isToday: date.format('YYYY-MM-DD') === currentDate,
        isSelected: date.format('YYYY-MM-DD') === selectedDate,
      };
    });
  }, [selectedDate, currentDate]);

  const currentMonthYear = dayjs(selectedDate).startOf('week').format('MMM YYYY');
  // Only show "Today" if the selected date is NOT in the same week as the current date
  const showTodayButton = !dayjs(currentDate).isSame(selectedDate, 'week');

  const handlePrevWeek = () => {
    setDirection(-1);
    onSelectDate(dayjs(selectedDate).subtract(1, 'week').startOf('week').format('YYYY-MM-DD'));
  };

  const handleNextWeek = () => {
    setDirection(1);
    onSelectDate(dayjs(selectedDate).add(1, 'week').startOf('week').format('YYYY-MM-DD'));
  };

  const handleJumpToToday = () => {
    // Determine direction based on whether today is before or after selected
    const dir = dayjs(currentDate).isAfter(selectedDate) ? 1 : -1;
    setDirection(dir);
    onSelectDate(currentDate);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="w-full mb-6 max-w-lg mx-auto">
      {/* Header Row: Date < > Today */}
      <div className="flex items-center justify-between mb-4 px-1">
        {/* Date (Left) */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentMonthYear}</h3>

        {/* Controls (Right) */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {showTodayButton && (
              <motion.div
                layout
                initial={{ width: 0, opacity: 0, scale: 0.8 }}
                animate={{ width: 'auto', opacity: 1, scale: 1 }}
                exit={{ width: 0, opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="overflow-hidden"
              >
                <button
                  onClick={handleJumpToToday}
                  className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  Today
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handlePrevWeek}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 active:scale-90 transition-all text-slate-600 dark:text-slate-400"
            aria-label="Previous Week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNextWeek}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 active:scale-90 transition-all text-slate-600 dark:text-slate-400"
            aria-label="Next Week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="relative overflow-hidden p-2">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={dayjs(selectedDate).startOf('week').format('YYYY-MM-DD')}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="grid grid-cols-7 gap-1 md:gap-3"
          >
            {days.map(day => (
              <div
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={cn(
                  'flex flex-col items-center justify-center py-3 rounded-[20px] transition-all duration-300 relative group cursor-pointer select-none',
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
                {day.isToday && !day.isSelected && (
                  <div className="absolute bottom-1.5 w-1 h-1 bg-indigo-500 rounded-full" />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
