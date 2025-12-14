import React, { useState, useRef, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { clsx } from 'clsx';
import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import size from 'lodash/size';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { CheckIcon, ChevronDownIcon, SearchIcon, X } from 'lucide-react';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  icon?: string;
  color?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
  searchPlaceholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select options',
  className = '',
  disabled = false,
  maxDisplay = 3,
  searchPlaceholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPlacement, setDropdownPlacement] = useState('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
  });

  const showSearch = useMemo(() => size(options) > 6, [options]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery) {
      return options;
    }
    return filter(options, option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, showSearch]);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current || !dropdownRef.current) return;

    const buttonWidth = buttonRef.current.offsetWidth;
    computePosition(buttonRef.current, dropdownRef.current, {
      placement: 'bottom-start',
      strategy: 'fixed',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
    }).then(({ x, y, strategy, placement }) => {
      setDropdownStyles({
        position: strategy,
        left: `${x}px`,
        top: `${y}px`,
        width: `${buttonWidth}px`,
        opacity: 1,
        pointerEvents: 'auto',
        zIndex: 9999,
      });
      setDropdownPlacement(placement);
    });
  }, []);

  // Handle dropdown opening/closing and setup event listeners
  // useLayoutEffect ensures positioning happens before paint
  useLayoutEffect(() => {
    if (!isOpen) {
      setDropdownStyles({
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0,
        pointerEvents: 'none',
      });
      return;
    }

    // Position immediately after dropdown is mounted
    updatePosition();

    // Focus search input if needed
    if (showSearch) {
      searchInputRef.current?.focus();
    }

    // Listen for scroll and resize events
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition, showSearch]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, filteredOptions, updatePosition]);

  // Update position when selected items change (button size changes)
  // useLayoutEffect runs synchronously after DOM mutations but before paint
  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [value, isOpen, updatePosition]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  useOnClickOutside<HTMLElement>([buttonRef, dropdownRef], closeDropdown);

  const selectedOptions = useMemo(
    () => filter(options, opt => includes(value, opt.value)),
    [options, value]
  );

  const handleToggleOption = (optionValue: string | number) => {
    if (includes(value, optionValue)) {
      onChange(filter(value, v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveOption = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(filter(value, v => v !== optionValue));
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  };

  const displayedOptions = useMemo(() => {
    if (size(selectedOptions) <= maxDisplay) {
      return selectedOptions;
    }
    return selectedOptions.slice(0, maxDisplay);
  }, [selectedOptions, maxDisplay]);

  const remainingCount = size(selectedOptions) - maxDisplay;

  const DropdownContent = (
    <div
      ref={dropdownRef}
      style={dropdownStyles}
      className={clsx(
        'fixed bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 flex focus:outline-none transition-opacity duration-150',
        dropdownPlacement.startsWith('top') ? 'flex-col-reverse' : 'flex-col'
      )}
      role="listbox"
      aria-multiselectable="true"
    >
      {showSearch && (
        <div
          className={clsx(
            'p-2',
            dropdownPlacement.startsWith('top') ? 'border-t' : 'border-b',
            'border-slate-200 dark:border-slate-700'
          )}
        >
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm dark:text-white dark:placeholder-slate-500"
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      )}
      <div className="max-h-60 overflow-auto">
        {size(filteredOptions) > 0 ? (
          map(filteredOptions, option => {
            const isSelected = includes(value, option.value);
            return (
              <button
                key={option.value}
                onClick={() => handleToggleOption(option.value)}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                role="option"
                aria-selected={isSelected}
              >
                {option.icon && <span className="text-base">{option.icon}</span>}
                <span className="flex-1 truncate">{option.label}</span>
                {isSelected && (
                  <CheckIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                )}
              </button>
            );
          })
        ) : (
          <div className="px-3 py-4 text-sm text-center text-slate-500 dark:text-slate-400">
            No results found
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={clsx('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
          {size(value) > 0 && (
            <span className="ml-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
              {size(value)} selected
            </span>
          )}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          'w-full text-left px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-100 transition-colors duration-200 min-h-[42px]',
          disabled && 'opacity-50 cursor-not-allowed',
          'flex items-center justify-between gap-2'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex-1 flex items-center gap-1.5 flex-wrap min-h-[26px]">
          {size(selectedOptions) > 0 ? (
            <>
              {map(displayedOptions, option => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                >
                  {option.icon && <span className="text-sm">{option.icon}</span>}
                  <span className="truncate max-w-[120px]">{option.label}</span>
                  <span
                    onClick={e => handleRemoveOption(option.value, e)}
                    className="flex-shrink-0 hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRemoveOption(option.value, e as any);
                      }
                    }}
                    aria-label={`Remove ${option.label}`}
                  >
                    <X size={12} />
                  </span>
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  +{remainingCount} more
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDownIcon
          className={clsx(
            'w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && ReactDOM.createPortal(DropdownContent, document.body)}
    </div>
  );
};

export default MultiSelect;
