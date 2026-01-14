import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarIcon } from '../../icons';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import Modal from '../Modal';
import { cn, dayjs, Dayjs } from '../../utils';
import { DatePickerContent } from './DatePickerContent';

interface DatePickerProps {
  id?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id = 'date-picker',
  value,
  onChange,
  disabled = false,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // For desktop popover

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isModalOpen = searchParams.get('datePickerFor') === id; // For mobile modal
  const isOpen = isMobile ? isModalOpen : isPopoverOpen;

  // Initialize with Dayjs
  const [viewDate, setViewDate] = useState<Dayjs>(() => dayjs());
  const [stagedValue, setStagedValue] = useState(value);
  const [currentView, setCurrentView] = useState<'day' | 'year'>('day');
  const [animationClass, setAnimationClass] = useState('');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
  });

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
        width: '320px', // Adjusted for padding
        opacity: 1,
        pointerEvents: 'auto',
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (isMobile) {
      const params = new URLSearchParams(location.search);
      params.delete('datePickerFor');
      navigate({ search: params.toString() }, { replace: true });
      return;
    }
    setIsPopoverOpen(false);
  }, [isMobile, location.search, navigate]);

  useEffect(() => {
    if (isOpen) {
      const initialDate = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? dayjs(value) : dayjs();
      setViewDate(initialDate);
      setStagedValue(value);
      setCurrentView('day');
    }
  }, [isOpen, value]);

  useLayoutEffect(() => {
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
  }, [isOpen, isMobile, currentView, updatePosition]);

  useOnClickOutside<HTMLElement>([buttonRef, dropdownRef], () => {
    if (!isMobile) {
      handleClose();
    }
  });

  const handleOpen = () => {
    if (disabled) return;
    if (isMobile) {
      const params = new URLSearchParams(location.search);
      params.set('datePickerFor', id);
      navigate({ search: params.toString() }, { replace: true });
      return;
    }
    setIsPopoverOpen(true);
  };

  const handleDayClick = useCallback(
    (day: number) => {
      // Create new date preserving current view year/month but setting specific day
      const newDate = viewDate.set('date', day);
      const newDateString = newDate.format('YYYY-MM-DD');
      setStagedValue(newDateString);
      if (!isMobile) {
        onChange(newDateString);
        handleClose();
      }
    },
    [viewDate, isMobile, onChange, handleClose]
  );

  const handleSet = () => {
    onChange(stagedValue);
    handleClose();
  };

  const handleClear = () => {
    onChange('');
    handleClose();
  };

  const handlePrev = () => {
    setAnimationClass('animate-slide-in-from-left');
    if (currentView === 'day') {
      setViewDate(viewDate.subtract(1, 'month'));
      return;
    }
    setViewDate(viewDate.subtract(100, 'year'));
  };

  const handleNext = () => {
    setAnimationClass('animate-slide-in-from-right');
    if (currentView === 'day') {
      setViewDate(viewDate.add(1, 'month'));
      return;
    }
    setViewDate(viewDate.add(100, 'year'));
  };

  const handleHeaderClick = () => {
    if (currentView === 'day') {
      setAnimationClass('animate-fade-in-fast');
      setCurrentView('year');
    }
  };

  const handleYearClick = (year: number) => {
    setAnimationClass('animate-fade-in-fast');
    setViewDate(viewDate.year(year));
    setCurrentView('day');
  };

  const formattedValue = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return dayjs(value).format('MMM D, YYYY');
    }
    return 'Select a date';
  }, [value]);

  const formattedStagedDate = useMemo(() => {
    if (stagedValue && /^\d{4}-\d{2}-\d{2}$/.test(stagedValue)) {
      return dayjs(stagedValue).format('ddd, MMM D, YYYY');
    }
    return null;
  }, [stagedValue]);

  const jumpToStagedDate = () => {
    if (stagedValue) {
      const stagedDate = dayjs(stagedValue);
      setViewDate(stagedDate);
      setCurrentView('day');
      setAnimationClass('animate-fade-in-fast');
    }
  };

  const modalTitleElement = useMemo(() => {
    if (isMobile && formattedStagedDate) {
      return (
        <button
          onClick={jumpToStagedDate}
          className="text-md font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          {formattedStagedDate}
        </button>
      );
    }
    return formattedStagedDate || 'Select Date';
  }, [isMobile, formattedStagedDate]);

  return (
    <div className="relative">
      <button
        id={id}
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-100 disabled:opacity-50"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className="truncate">{formattedValue}</span>
        <CalendarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      </button>

      {isMobile ? (
        <Modal isOpen={isModalOpen} onClose={handleClose} title={modalTitleElement} center>
          <DatePickerContent
            viewDate={viewDate}
            stagedValue={stagedValue}
            currentView={currentView}
            animationClass={animationClass}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleHeaderClick={handleHeaderClick}
            handleYearClick={handleYearClick}
            handleDayClick={handleDayClick}
            handleSet={handleSet}
            handleCancel={handleClose}
            handleClear={handleClear}
            showActions={isMobile}
            formattedStagedDate={formattedStagedDate}
            isMobile={isMobile}
          />
        </Modal>
      ) : (
        isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyles}
            className="z-50 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-4 transition-opacity duration-150"
          >
            <DatePickerContent
              viewDate={viewDate}
              stagedValue={stagedValue}
              currentView={currentView}
              animationClass={animationClass}
              handlePrev={handlePrev}
              handleNext={handleNext}
              handleHeaderClick={handleHeaderClick}
              handleYearClick={handleYearClick}
              handleDayClick={handleDayClick}
              handleSet={handleSet}
              handleCancel={handleClose}
              handleClear={handleClear}
              showActions={isMobile}
              formattedStagedDate={formattedStagedDate}
              isMobile={isMobile}
            />
          </div>,
          document.body
        )
      )}
    </div>
  );
};

export default DatePicker;
