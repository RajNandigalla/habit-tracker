import React from 'react';
import { cn } from '../../utils';
import { HeatmapData } from './types';

const HeatmapGrid: React.FC<{ data: HeatmapData[] }> = ({ data }) => {
  // Determine max completions in a single day to normalize colors
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Helper to get color intensity
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-slate-200 dark:bg-slate-700'; // Increased visibility for empty state
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-indigo-300 dark:bg-indigo-900';
    if (intensity <= 0.5) return 'bg-indigo-400 dark:bg-indigo-800';
    if (intensity <= 0.75) return 'bg-indigo-500 dark:bg-indigo-600';
    return 'bg-indigo-600 dark:bg-indigo-500';
  };

  return (
    <div className="flex flex-wrap gap-1 md:gap-1.5 justify-start md:justify-center">
      {data.map(day => (
        <div
          key={day.date}
          title={`${formatDate(day.date)}: ${day.count} habits`}
          className={cn(
            'w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all md:hover:scale-125 cursor-default',
            getColorClass(day.count)
          )}
        />
      ))}
    </div>
  );
};

export default HeatmapGrid;
