import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils';

interface ScrollColumnProps {
  options: (number | string)[];
  value: number | string;
  onChange: (val: number | string) => void;
  format?: (val: number | string) => string;
}

export const ScrollColumn: React.FC<ScrollColumnProps> = ({ options, value, onChange, format }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      if (containerRef.current) {
        const selectedEl = containerRef.current.querySelector(`[data-selected="true"]`);
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="h-48 overflow-y-auto no-scrollbar snap-y snap-mandatory scroll-py-[80px] relative text-center"
    >
      <div className="py-[80px]">
        {options.map(opt => {
          const isSelected = opt === value;
          return (
            <button
              key={opt}
              type="button"
              data-selected={isSelected}
              onClick={e => {
                e.stopPropagation();
                onChange(opt);
              }}
              className={cn(
                'w-full h-8 flex items-center justify-center snap-center transition-all duration-200',
                isSelected
                  ? 'text-md font-bold text-indigo-600 dark:text-indigo-400 scale-110'
                  : 'text-base text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              )}
            >
              {format ? format(opt) : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollColumn;
