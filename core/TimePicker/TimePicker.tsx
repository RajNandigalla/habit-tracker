import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Clock } from 'lucide-react';
import { cn } from '../../utils';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import Modal from '../Modal';
import { TimePickerContent } from './TimePickerContent';

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

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  disabled,
  className,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
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
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
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

  const updateStaged = (key: keyof typeof stagedValue, val: number | string) => {
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
