import React, { useState } from 'react';
import { cn } from '../utils';

interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  showValue?: boolean;
  formatValue?: (val: number) => string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  showValue = true,
  formatValue = v => v.toString(),
  leftIcon,
  rightIcon,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate percentage for positioning
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(parseFloat(e.target.value));
    }
  };

  return (
    <div
      className={cn(
        'w-full select-none touch-none',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Header Label & Value */}
      {(label || showValue) && (
        <div className="flex justify-between items-end mb-3">
          {label && (
            <label className="text-base font-bold text-slate-700 dark:text-slate-300 tracking-tight transition-colors">
              {label}
            </label>
          )}
          {showValue && (
            <div className="relative h-6 min-w-[3rem]">
              <span
                className={cn(
                  'absolute right-0 top-0 text-xs font-mono font-bold px-2 py-1 rounded-md text-center transition-all duration-300 ease-spring transform origin-right',
                  isDragging
                    ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30 -translate-y-1'
                    : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                )}
              >
                {formatValue(value)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        {leftIcon && (
          <div
            className={cn(
              'transition-colors duration-300',
              isDragging ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            {leftIcon}
          </div>
        )}

        <div
          className="relative w-full h-8 flex items-center group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Track Background */}
          <div
            className={cn(
              'absolute w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-all duration-300 ease-spring',
              // Grow track on hover/drag
              isDragging ? 'h-3 shadow-inner' : isHovered ? 'h-2.5' : 'h-1.5'
            )}
          ></div>

          {/* Active Track Progress */}
          <div
            className={cn(
              'absolute left-0 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-spring',
              isDragging ? 'h-3 shadow-lg shadow-indigo-500/20' : isHovered ? 'h-2.5' : 'h-1.5'
            )}
            style={{ width: `${percentage}%` }}
          ></div>

          {/* Native Range Input (Invisible overlay for interaction) */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerCancel={() => setIsDragging(false)}
            onBlur={() => setIsDragging(false)}
            disabled={disabled}
            className="absolute w-full h-full opacity-0 cursor-pointer z-30"
            aria-label={label}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
          />

          {/* Visual Thumb Container */}
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 pointer-events-none z-20',
              // Use standard transition for position when not dragging to create spring effect on click
              !isDragging && 'transition-[left] duration-300 ease-spring'
            )}
            style={{ left: `${percentage}%` }}
          >
            {/* Thumb Circle */}
            <div
              className={cn(
                'w-5 h-5 -ml-2.5 bg-white dark:bg-slate-800 border-[3px] border-indigo-500 dark:border-indigo-400 rounded-full shadow-lg relative flex items-center justify-center',
                'transition-all duration-300 ease-spring transform origin-center',
                isDragging
                  ? 'scale-125 border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                  : isHovered
                    ? 'scale-110'
                    : 'scale-100'
              )}
            >
              {/* Inner dot */}
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full bg-indigo-500 transition-all duration-300',
                  isDragging ? 'scale-0' : 'scale-100'
                )}
              />

              {/* Ripple/Glow Ring */}
              <div
                className={cn(
                  'absolute inset-0 -m-1 rounded-full border-2 border-indigo-500/30 transition-all duration-500',
                  isDragging ? 'scale-125 opacity-100 animate-pulse' : 'scale-50 opacity-0'
                )}
              />
            </div>
          </div>
        </div>

        {rightIcon && (
          <div
            className={cn(
              'transition-colors duration-300',
              isDragging ? 'text-indigo-500' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;
