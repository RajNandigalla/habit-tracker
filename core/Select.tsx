import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
} from 'react';
import ReactDOM from 'react-dom';
import { useOnClickOutside } from 'usehooks-ts';
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../icons';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  id?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: any) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  id: providedId,
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  required = false,
}) => {
  const autoId = useId();
  const id = providedId || autoId;
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

  const showSearch = useMemo(() => options.length > 10, [options.length]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery) {
      return options;
    }
    return options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
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

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, filteredOptions, updatePosition]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  // Fix: Explicitly type generic to HTMLElement to handle mixed ref types (button and div)
  useOnClickOutside<HTMLElement>([buttonRef, dropdownRef], closeDropdown);

  const selectedOption = useMemo(() => options.find(opt => opt.value === value), [options, value]);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    closeDropdown();
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  };

  const baseClasses =
    'w-full text-left px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-100 transition-colors duration-200 text-base disabled:opacity-50';

  const DropdownContent = (
    <div
      ref={dropdownRef}
      style={dropdownStyles}
      className={`fixed bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 flex focus:outline-none transition-opacity duration-150 ${dropdownPlacement.startsWith('top') ? 'flex-col-reverse' : 'flex-col'}`}
      role="listbox"
    >
      {showSearch && (
        <div
          className={`p-2 ${dropdownPlacement.startsWith('top') ? 'border-t' : 'border-b'} border-slate-200 dark:border-slate-700`}
        >
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-base dark:text-white dark:placeholder-slate-500"
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      )}
      <div className="max-h-52 overflow-auto">
        {filteredOptions.length > 0 ? (
          filteredOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className="w-full text-left flex items-center justify-between px-3 py-2 text-base text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              role="option"
              aria-selected={value === option.value}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && (
                <CheckIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-base text-center text-slate-500 dark:text-slate-400">
            No results found
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <button
        id={id}
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`${baseClasses} flex items-center justify-between`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && ReactDOM.createPortal(DropdownContent, document.body)}
    </div>
  );
};

export default Select;
