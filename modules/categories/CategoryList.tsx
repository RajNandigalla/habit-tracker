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
    <div className="space-y-2 pr-1">
      {map(categories, cat => {
        const isSelected = includes(selectedCategoryIds, cat.id);

        return (
          <div
            key={cat.id}
            onClick={() => {
              if (onSelect) onSelect(cat.id);
            }}
            className={cn(
              'group flex items-center justify-between p-3 rounded-lg border border-transparent transition-all',
              isSelectionMode
                ? 'cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700'
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full bg-opacity-10 text-lg"
                style={{ backgroundColor: getColorValue(cat.color || 'indigo-600') + '20' }}
              >
                {cat.icon || '🏷️'}
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{cat.label}</span>
              {isSelected && <Check className="w-4 h-4 text-indigo-500 ml-2" />}
              {cat.isDefault && !isSelectionMode && (
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>

            <div
              className={cn(
                'flex items-center gap-1 transition-opacity',
                isSelectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              {isSelectionMode ? (
                <div className="text-xs text-indigo-600 font-medium px-2">
                  {isSelected ? 'Selected' : 'Select'}
                </div>
              ) : (
                <>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation();
                      onEdit(cat);
                    }}
                  >
                    <Edit2 className="w-4 h-4 text-slate-400 hover:text-indigo-500" />
                  </Button>
                  {!cat.isDefault && (
                    <Button
                      size="icon-sm"
                      variant="danger-ghost"
                      onClick={e => {
                        e.stopPropagation();
                        onArchive(cat);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
