import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Clock } from 'lucide-react';
import { cn } from '../utils';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import useIsMobile from '../hooks/useIsMobile';
import Modal from './Modal';
import Button from './Button';

interface TimePickerProps {
  value: string; // "HH:mm" 24h format
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

// Helper to convert 24h "HH:mm" to { hour, minute, period }
const parseTime = (value: string) => {
  if (!value) return { hour: 12, minute: 0, period: 'AM' };
  const [h, m] = value.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return { hour: 12, minute: 0, period: 'AM' };

  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return { hour, minute: m, period };
};

// Helper to convert { hour, minute, period } to 24h "HH:mm"
const formatTimeObj = (hour: number, minute: number, period: string) => {
  let h = hour;
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const ScrollColumn: React.FC<{
  options: (number | string)[];
  value: number | string;
  onChange: (val: any) => void;
  format?: (val: any) => string;
}> = ({ options, value, onChange, format }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add a small delay to ensure the DOM is ready and layout is calculated,
    // especially when rendering inside Modals or Portals with transitions.
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const selectedEl = containerRef.current.querySelector(`[data-selected="true"]`);
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="h-48 overflow-y-auto no-scrollbar snap-y snap-mandatory scroll-py-[80px] relative text-center"
    >
      <div className="py-[80px]">
        {' '}
        {/* Padding to center the first/last items */}
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
                  : 'text-base text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
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

const TimePickerContent: React.FC<TimePickerContentProps> = ({
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
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
          Hr
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
          Min
        </span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
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
          className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
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

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  disabled,
  className,
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Internal state for staged changes
  const [stagedValue, setStagedValue] = useState(parseTime(value));

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10...
  const periods = ['AM', 'PM'];

  const updatePosition = useCallback(() => {
    if (!buttonRef.current || !dropdownRef.current) return;
    computePosition(buttonRef.current, dropdownRef.current, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    }).then(({ x, y, strategy }) => {
      setDropdownStyles({
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
        width: '280px',
        opacity: 1,
        pointerEvents: 'auto',
      });
    });
  }, []);

  useEffect(() => {
    // Sync internal state when prop value changes
    setStagedValue(parseTime(value));
  }, [value]);

  useEffect(() => {
    if (!isOpen || isMobile) {
      setDropdownStyles(prev => ({ ...prev, opacity: 0, pointerEvents: 'none' }));
      return;
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, isMobile, updatePosition]);

  useOnClickOutside<HTMLElement>([buttonRef, dropdownRef], () => {
    if (!isMobile) setIsOpen(false);
  });

  const handleOpen = () => {
    if (disabled) return;
    // Reset staged value to current value on open
    setStagedValue(parseTime(value));
    if (isMobile) {
      setIsMobileModalOpen(true);
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMobileModalOpen(false);
  };

  const handleDone = () => {
    const timeString = formatTimeObj(stagedValue.hour, stagedValue.minute, stagedValue.period);
    onChange(timeString);
    handleClose();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    handleClose();
  };

  // Staged Change Handlers
  const updateStaged = (key: keyof typeof stagedValue, val: any) => {
    setStagedValue(prev => ({ ...prev, [key]: val }));
  };

  const displayValue = value ? (
    (() => {
      const { hour, minute, period } = parseTime(value);
      return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
    })()
  ) : (
    <span className="text-slate-400 font-normal">Set time</span>
  );

  const pickerContent = (
    <TimePickerContent
      hour={stagedValue.hour}
      minute={stagedValue.minute}
      period={stagedValue.period}
      hours={hours}
      minutes={minutes}
      periods={periods}
      onHourChange={h => updateStaged('hour', h)}
      onMinuteChange={m => updateStaged('minute', m)}
      onPeriodChange={p => updateStaged('period', p)}
      onClear={handleClear}
      onDone={handleDone}
    />
  );

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 transition-colors',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className="font-medium text-base truncate">{displayValue}</span>
        <Clock className="w-5 h-5 text-slate-400" />
      </button>

      {isMobile ? (
        <Modal
          isOpen={isMobileModalOpen}
          onClose={handleClose}
          title="Select Time"
          center
          size="sm"
        >
          {pickerContent}
        </Modal>
      ) : (
        isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyles}
            className="z-50 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 transition-opacity duration-150"
          >
            {pickerContent}
          </div>,
          document.body
        )
      )}
    </div>
  );
};

export default TimePicker;
