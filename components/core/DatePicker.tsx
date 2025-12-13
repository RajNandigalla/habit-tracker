import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '../icons';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import Button from './Button';
import useIsMobile from '../../hooks/useIsMobile';
import Modal from './Modal';

interface DatePickerProps {
  id?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  disabled?: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const YearView: React.FC<{
  viewDate: Date;
  stagedValue: string;
  handleYearClick: (year: number) => void;
}> = ({ viewDate, stagedValue, handleYearClick }) => {
  const yearGridRef = useRef<HTMLDivElement>(null);

  const currentNavYear = viewDate.getFullYear();
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
      const timer = setTimeout(() => {
        selectedYearElement.scrollIntoView({ block: 'center', behavior: 'auto' });
      }, 0);
      return () => clearTimeout(timer);
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

const DatePickerContent: React.FC<{
  viewDate: Date;
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
  renderDayView: () => React.ReactElement;
  showActions: boolean;
  formattedStagedDate: string | null;
  isMobile: boolean;
}> = ({
  viewDate,
  stagedValue,
  currentView,
  animationClass,
  handlePrev,
  handleNext,
  handleHeaderClick,
  renderDayView,
  handleYearClick,
  handleSet,
  handleCancel,
  handleClear,
  showActions,
  formattedStagedDate,
  isMobile,
}) => {
  const headerTitle = useMemo(() => {
    const year = viewDate.getFullYear();
    if (currentView === 'day') return `${MONTH_NAMES[viewDate.getMonth()]} ${year}`;
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
          <div key={`${viewDate.getFullYear()}-${viewDate.getMonth()}`} className={animationClass}>
            {renderDayView()}
          </div>
        )}
        {currentView === 'year' && (
          <div key={Math.floor(viewDate.getFullYear() / 100)} className={animationClass}>
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

export const DatePicker: React.FC<DatePickerProps> = ({
  id = 'date-picker',
  value,
  onChange,
  disabled = false,
}) => {
  const isMobile = useIsMobile();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // For desktop popover

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isModalOpen = searchParams.get('datePickerFor') === id; // For mobile modal
  const isOpen = isMobile ? isModalOpen : isPopoverOpen;

  const [viewDate, setViewDate] = useState(() => new Date());
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
    } else {
      setIsPopoverOpen(false);
    }
  }, [isMobile, location.search, navigate]);

  useEffect(() => {
    if (isOpen) {
      const initialDate =
        value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + 'T00:00:00') : new Date();
      setViewDate(initialDate);
      setStagedValue(value);
      setCurrentView('day');
    }
  }, [isOpen, value]);

  useEffect(() => {
    if (isOpen && !isMobile) {
      const positionTimer = setTimeout(() => {
        updatePosition();
      }, 0);

      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        clearTimeout(positionTimer);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setDropdownStyles(prev => ({ ...prev, opacity: 0, pointerEvents: 'none' }));
    }
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
    } else {
      setIsPopoverOpen(true);
    }
  };

  const handleDayClick = useCallback(
    (day: number) => {
      const newDate = new Date(Date.UTC(viewDate.getFullYear(), viewDate.getMonth(), day));
      const newDateString = newDate.toISOString().split('T')[0];
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
    if (currentView === 'day') {
      setAnimationClass('animate-slide-in-from-left');
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    } else {
      setAnimationClass('animate-slide-in-from-left');
      setViewDate(new Date(viewDate.getFullYear() - 100, viewDate.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (currentView === 'day') {
      setAnimationClass('animate-slide-in-from-right');
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    } else {
      setAnimationClass('animate-slide-in-from-right');
      setViewDate(new Date(viewDate.getFullYear() + 100, viewDate.getMonth(), 1));
    }
  };

  const handleHeaderClick = () => {
    if (currentView === 'day') {
      setAnimationClass('animate-fade-in-fast');
      setCurrentView('year');
    }
  };

  const handleYearClick = (year: number) => {
    setAnimationClass('animate-fade-in-fast');
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setCurrentView('day');
  };

  const formattedValue = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return 'Select a date';
  }, [value]);

  const formattedStagedDate = useMemo(() => {
    if (stagedValue && /^\d{4}-\d{2}-\d{2}$/.test(stagedValue)) {
      return new Date(stagedValue + 'T00:00:00').toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return null;
  }, [stagedValue]);

  const jumpToStagedDate = () => {
    if (stagedValue) {
      const stagedDate = new Date(stagedValue + 'T00:00:00');
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
          className="text-lg font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          {formattedStagedDate}
        </button>
      );
    }
    return formattedStagedDate || 'Select Date';
  }, [isMobile, formattedStagedDate]);

  const renderDayView = useCallback(() => {
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let stagedDateObj: Date | null = null;
    if (stagedValue && /^\d{4}-\d{2}-\d{2}$/.test(stagedValue)) {
      stagedDateObj = new Date(stagedValue + 'T00:00:00');
    }

    const grid = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="w-9 h-9" />);
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        stagedDateObj?.getFullYear() === currentYear &&
        stagedDateObj?.getMonth() === currentMonth &&
        stagedDateObj?.getDate() === day;
      const isToday =
        today.getFullYear() === currentYear &&
        today.getMonth() === currentMonth &&
        today.getDate() === day;

      grid.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
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
          {DAY_NAMES.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 place-items-center">{grid}</div>
      </>
    );
  }, [viewDate, stagedValue, handleDayClick]);

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
        <CalendarIcon className="w-5 h-5 text-slate-400" />
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
            handleSet={handleSet}
            handleCancel={handleClose}
            handleClear={handleClear}
            renderDayView={renderDayView}
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
              handleSet={handleSet}
              handleCancel={handleClose}
              handleClear={handleClear}
              renderDayView={renderDayView}
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
