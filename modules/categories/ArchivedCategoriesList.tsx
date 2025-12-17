import React, { useState } from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import { Category } from '../../types';
import { Button } from '../../core';
import { Archive, RefreshCw } from 'lucide-react';

interface ArchivedCategoriesListProps {
  archivedCategories: Category[];
  onRestore: (categoryId: string) => void;
}

export const ArchivedCategoriesList: React.FC<ArchivedCategoriesListProps> = ({
  archivedCategories,
  onRestore,
}) => {
  const [showArchived, setShowArchived] = useState(false);
  const count = size(archivedCategories);

  if (count === 0) {
    return null;
  }

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors w-full"
      >
        <Archive className="w-4 h-4" />
        {showArchived ? 'Hide Archived' : 'Show Archived'}
        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </button>

      {showArchived && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {map(archivedCategories, cat => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 opacity-70"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg grayscale">{cat.icon || '🏷️'}</span>
                <span className="text-sm font-medium text-slate-500 line-through">{cat.label}</span>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => onRestore(cat.id)}
                title="Restore"
              >
                <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
