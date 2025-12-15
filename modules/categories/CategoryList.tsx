import React from 'react';
import map from 'lodash/map';
import includes from 'lodash/includes';
import { Category } from '../../types';
import { Button } from '../../core';
import { Edit2, Trash2, Check } from 'lucide-react';
import { cn } from '../../utils';
import { getColorValue } from '../../utils';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onArchive: (category: Category) => void;
  onSelect?: (categoryId: string) => void;
  selectedCategoryIds?: string[];
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onArchive,
  onSelect,
  selectedCategoryIds = [],
}) => {
  const isSelectionMode = !!onSelect;

  return (
    <div className="grid grid-cols-1 gap-3 pb-4">
      {map(categories, cat => {
        const isSelected = includes(selectedCategoryIds, cat.id);
        const colorValue = getColorValue(cat.color || 'indigo-600');

        return (
          <div
            key={cat.id}
            onClick={() => {
              if (onSelect) onSelect(cat.id);
            }}
            className={cn(
              'group relative flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 border',
              isSelectionMode
                ? isSelected
                  ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:translate-y-[-1px]'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl text-xl shadow-inner transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${colorValue}15`,
                  color: colorValue,
                }}
              >
                {cat.icon || '🏷️'}
              </div>

              <div className="flex flex-col">
                <span
                  className={cn(
                    'font-bold text-sm transition-colors',
                    isSelected
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-800 dark:text-slate-100'
                  )}
                >
                  {cat.label}
                </span>

                {cat.isDefault && !isSelectionMode && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                    • Built-in
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center">
              {isSelectionMode ? (
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all',
                    isSelected
                      ? 'bg-indigo-500 border-indigo-500 scale-100'
                      : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                  )}
                >
                  <Check
                    className={cn(
                      'w-3.5 h-3.5 text-white transition-opacity',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                    strokeWidth={3}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 translate-x-2 md:group-hover:translate-x-0">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600"
                    onClick={e => {
                      e.stopPropagation();
                      onEdit(cat);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {!cat.isDefault && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"
                      onClick={e => {
                        e.stopPropagation();
                        onArchive(cat);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
