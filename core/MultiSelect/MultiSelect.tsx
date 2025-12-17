import React, { useState, useRef, useMemo, useLayoutEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import size from 'lodash/size';
import { useOnClickOutside } from 'usehooks-ts';
import { ChevronDownIcon, X } from 'lucide-react';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { MultiSelectDropdown } from './MultiSelectDropdown';

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

    updatePosition();

    if (showSearch) {
      searchInputRef.current?.focus();
    }

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition, showSearch]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [value, isOpen, filteredOptions, updatePosition]);

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
      return;
    }
    onChange([...value, optionValue]);
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
            'w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <MultiSelectDropdown
          dropdownRef={dropdownRef}
          dropdownStyles={dropdownStyles}
          dropdownPlacement={dropdownPlacement}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
          filteredOptions={filteredOptions}
          value={value}
          onToggleOption={handleToggleOption}
        />
      )}
    </div>
  );
};

export default MultiSelect;
