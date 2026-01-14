import React from 'react';
import Button from '../Button';
import { ScrollColumn } from './ScrollColumn';

interface TimePickerContentProps {
  hour: number;
  minute: number;
  period: string;
  hours: number[];
  minutes: number[];
  periods: string[];
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
  onPeriodChange: (p: string) => void;
  onClear: (e: React.MouseEvent) => void;
  onDone: () => void;
}

export const TimePickerContent: React.FC<TimePickerContentProps> = ({
  hour,
  minute,
  period,
  hours,
  minutes,
  periods,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onClear,
  onDone,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Header Labels matching Grid Layout */}
      <div className="grid grid-cols-3 gap-2 mb-2 w-full">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
          Hr
        </span>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
          Min
        </span>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
          Am/Pm
        </span>
      </div>

      {/* Selection Wheels */}
      <div className="relative h-48 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden mb-4">
        {/* Selection Highlight Bar */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-8 bg-indigo-100/50 dark:bg-indigo-900/30 border-y border-indigo-200 dark:border-indigo-800 pointer-events-none z-0"></div>

        <div className="grid grid-cols-3 h-full relative z-10">
          <ScrollColumn options={hours} value={hour} onChange={onHourChange} />
          <ScrollColumn
            options={minutes}
            value={minute}
            onChange={onMinuteChange}
            format={v => v.toString().padStart(2, '0')}
          />
          <ScrollColumn options={periods} value={period} onChange={onPeriodChange} />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onClear}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
        >
          Clear Time
        </button>
        <Button size="sm" onClick={onDone} className="px-6">
          Done
        </Button>
      </div>
    </div>
  );
};

export default TimePickerContent;
