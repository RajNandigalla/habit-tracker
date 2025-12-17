import React from 'react';
import { dayjs, Dayjs, DAYS_OF_WEEK } from '../../utils';

interface DayViewProps {
  viewDate: Dayjs;
  stagedValue: string;
  onDayClick: (day: number) => void;
}

export const DayView: React.FC<DayViewProps> = ({ viewDate, stagedValue, onDayClick }) => {
  const currentYear = viewDate.year();
  const currentMonth = viewDate.month();
  const firstDayOfMonth = viewDate.startOf('month').day();
  const daysInMonth = viewDate.daysInMonth();

  let stagedDateObj: Dayjs | null = null;
  if (stagedValue && /^\d{4}-\d{2}-\d{2}$/.test(stagedValue)) {
    stagedDateObj = dayjs(stagedValue);
  }

  const grid = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    grid.push(<div key={`empty-${i}`} className="w-9 h-9" />);
  }

  const today = dayjs();
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected =
      stagedDateObj?.year() === currentYear &&
      stagedDateObj?.month() === currentMonth &&
      stagedDateObj?.date() === day;
    const isToday =
      today.year() === currentYear && today.month() === currentMonth && today.date() === day;

    grid.push(
      <button
        key={day}
        onClick={() => onDayClick(day)}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-semibold transition-colors
                      ${
                        isSelected
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                          : isToday
                            ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-500'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
      >
        {day}
      </button>
    );
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center text-base text-slate-500 dark:text-slate-400 mb-2">
        {DAYS_OF_WEEK.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 place-items-center">{grid}</div>
    </>
  );
};

export default DayView;
