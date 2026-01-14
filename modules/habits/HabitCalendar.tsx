import React from 'react';
import { Habit } from '../../types';
import dayjs, { Dayjs } from 'dayjs';
import { cn, getTodayISO } from '../../utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface HabitCalendarProps {
  habit: Habit;
  viewDate: Dayjs;
  onViewDateChange: (date: Dayjs) => void;
}

export const HabitCalendar: React.FC<HabitCalendarProps> = ({
  habit,
  viewDate,
  onViewDateChange,
}) => {
  const today = getTodayISO();

  const renderCalendar = () => {
    const currentMonth = viewDate;
    const daysInMonth = currentMonth.daysInMonth();
    const startOfMonth = currentMonth.startOf('month');
    const startDay = startOfMonth.day(); // 0-6
    const days = [];

    // Empty slots for start of month
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} />);

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i).format('YYYY-MM-DD');
      const isCompleted = habit.completedDates.includes(date);
      const isToday = date === today;
      const isNegative = habit.habitType === 'negative';

      const isBadDay = isNegative && isCompleted;
      const isGoodDay = !isNegative && isCompleted;

      days.push(
        <div key={date} className="flex items-center justify-center aspect-square">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center text-base font-medium transition-all duration-200',
              isBadDay
                ? 'bg-red-500 text-white shadow-sm'
                : isGoodDay
                  ? 'text-white shadow-sm scale-100'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 scale-95',
              isToday &&
                !isCompleted &&
                'ring-2 ring-indigo-500 text-indigo-600 font-extrabold bg-indigo-50 dark:bg-indigo-900/20'
            )}
            style={{ backgroundColor: isGoodDay ? habit.color : undefined }}
          >
            {i}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide opacity-80 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Monthly
        </h4>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => onViewDateChange(viewDate.subtract(1, 'month'))}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold w-24 text-center text-slate-700 dark:text-slate-200 select-none">
            {viewDate.format('MMMM YYYY')}
          </span>
          <button
            onClick={() => onViewDateChange(viewDate.add(1, 'month'))}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div
            key={d}
            className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
    </div>
  );
};

export default HabitCalendar;
