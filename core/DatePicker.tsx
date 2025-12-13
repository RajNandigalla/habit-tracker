import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '../icons';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import Button from './Button';
import useIsMobile from '../hooks/useIsMobile';
import Modal from './Modal';
import { dayjs, Dayjs, MONTH_NAMES, DAYS_OF_WEEK } from '../utils'; // Use centralized dayjs

interface DatePickerProps {
  id?: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  disabled?: boolean;
}

const YearView: React.FC<{
  viewDate: Dayjs;
  stagedValue: string;
  handleYearClick: (year: number) => void;
}> = ({ viewDate, stagedValue, handleYearClick }) => {
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
            {renderDayView()}
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

  useEffect(() => {
    if (!isOpen || isMobile) {
      setDropdownStyles(prev => ({ ...prev, opacity: 0, pointerEvents: 'none' }));
      return;
    }

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
          className="text-lg font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          {formattedStagedDate}
        </button>
      );
    }
    return formattedStagedDate || 'Select Date';
  }, [isMobile, formattedStagedDate]);

  const renderDayView = useCallback(() => {
    const currentYear = viewDate.year();
    const currentMonth = viewDate.month(); // 0-11

    // Get first day of month (0-6, Sun-Sat)
    const firstDayOfMonth = viewDate.startOf('month').day();
    const daysInMonth = viewDate.daysInMonth();

    let stagedDateObj: Dayjs | null = null;
    if (stagedValue && /^\d{4}-\d{2}-\d{2}$/.test(stagedValue)) {
      stagedDateObj = dayjs(stagedValue);
    }

    const grid = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="w-9 h-9" />);
    }

    const today = dayjs();
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        stagedDateObj?.year() === currentYear &&
        stagedDateObj?.month() === currentMonth &&
        stagedDateObj?.date() === day;
      const isToday =
        today.year() === currentYear && today.month() === currentMonth && today.date() === day;

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
          {DAYS_OF_WEEK.map(
            (
              day // Changed from DAY_NAMES
            ) => (
              <div key={day}>{day}</div>
            )
          )}
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
