import React from 'react';
import ReactDOM from 'react-dom';
import { clsx } from 'clsx';
import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import size from 'lodash/size';
import { CheckIcon, SearchIcon } from 'lucide-react';
import { MultiSelectOption } from './MultiSelect';

interface MultiSelectDropdownProps {
  dropdownRef: React.RefObject<HTMLDivElement>;
  dropdownStyles: React.CSSProperties;
  dropdownPlacement: string;
  showSearch: boolean;
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  filteredOptions: MultiSelectOption[];
  value: Array<string | number>;
  onToggleOption: (value: string | number) => void;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  dropdownRef,
  dropdownStyles,
  dropdownPlacement,
  showSearch,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  searchInputRef,
  filteredOptions,
  value,
  onToggleOption,
}) => {
  const content = (
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
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm dark:text-white dark:placeholder-slate-500"
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
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
                onClick={() => onToggleOption(option.value)}
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

  return ReactDOM.createPortal(content, document.body);
};

export default MultiSelectDropdown;
