import React, { useRef, useEffect } from 'react';
import { Dayjs } from '../../utils';

interface YearViewProps {
  viewDate: Dayjs;
  stagedValue: string;
  handleYearClick: (year: number) => void;
}

export const YearView: React.FC<YearViewProps> = ({ viewDate, stagedValue, handleYearClick }) => {
  const yearGridRef = useRef<HTMLDivElement>(null);

  const currentNavYear = viewDate.year();
  const startYear = Math.floor(currentNavYear / 100) * 100;
  const years = Array.from({ length: 100 }, (_, i) => startYear + i);

  const selectedYearValue = stagedValue ? parseInt(stagedValue.substring(0, 4), 10) : null;

  useEffect(() => {
    const yearToScroll =
      selectedYearValue && selectedYearValue >= startYear && selectedYearValue < startYear + 100
        ? selectedYearValue
        : currentNavYear;

    const selector = `[data-year="${yearToScroll}"]`;
    const selectedYearElement = yearGridRef.current?.querySelector(selector);

    if (selectedYearElement) {
      const rafId = requestAnimationFrame(() => {
        selectedYearElement.scrollIntoView({ block: 'center', behavior: 'auto' });
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [viewDate, stagedValue, startYear, currentNavYear, selectedYearValue]);

  return (
    <div
      ref={yearGridRef}
      className="grid grid-cols-4 gap-y-1 gap-x-2 py-2 h-[220px] overflow-y-auto pr-2"
    >
      {years.map(year => {
        const isSelected = year === selectedYearValue;

        return (
          <button
            key={year}
            data-year={year}
            onClick={() => handleYearClick(year)}
            className={`p-2 rounded-md text-base text-center 
                            ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                                : 'font-normal text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
};

export default YearView;
