import React, { useMemo } from 'react';
import { Dayjs, MONTH_NAMES } from '../../utils';
import Button from '../Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { DayView } from './DayView';
import { YearView } from './YearView';

interface DatePickerContentProps {
  viewDate: Dayjs;
  stagedValue: string;
  currentView: 'day' | 'year';
  animationClass: string;
  handlePrev: () => void;
  handleNext: () => void;
  handleHeaderClick: () => void;
  handleYearClick: (year: number) => void;
  handleSet: () => void;
  handleCancel: () => void;
  handleClear: () => void;
  handleDayClick: (day: number) => void;
  showActions: boolean;
  formattedStagedDate: string | null;
  isMobile: boolean;
}

export const DatePickerContent: React.FC<DatePickerContentProps> = ({
  viewDate,
  stagedValue,
  currentView,
  animationClass,
  handlePrev,
  handleNext,
  handleHeaderClick,
  handleYearClick,
  handleDayClick,
  handleSet,
  handleCancel,
  handleClear,
  showActions,
  formattedStagedDate,
  isMobile,
}) => {
  const headerTitle = useMemo(() => {
    const year = viewDate.year();
    if (currentView === 'day') return `${MONTH_NAMES[viewDate.month()]} ${year}`;
    const startYear = Math.floor(year / 100) * 100;
    return `${startYear} - ${startYear + 99}`;
  }, [viewDate, currentView]);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handlePrev}
          className="rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <div className="flex-grow text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleHeaderClick}
            className="font-semibold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 text-base"
          >
            {headerTitle}
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleNext}
          className="rounded-full"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="min-h-[220px] overflow-hidden">
        {currentView === 'day' && (
          <div key={`${viewDate.year()}-${viewDate.month()}`} className={animationClass}>
            <DayView viewDate={viewDate} stagedValue={stagedValue} onDayClick={handleDayClick} />
          </div>
        )}
        {currentView === 'year' && (
          <div key={Math.floor(viewDate.year() / 100)} className={animationClass}>
            <YearView
              viewDate={viewDate}
              stagedValue={stagedValue}
              handleYearClick={handleYearClick}
            />
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSet} className="px-6 py-2">
              Set
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DatePickerContent;
