import React from 'react';
import { Button } from '../../core';
import { cn } from '../../utils';

interface ActionRowProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  isDanger?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ActionRow: React.FC<ActionRowProps> = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
  isDanger,
  disabled,
  isLoading,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
    <div className="flex items-start gap-4">
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg',
          isDanger
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3
          className={cn(
            'font-semibold',
            isDanger ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'
          )}
        >
          {title}
        </h3>
        <p className="text-base text-slate-500 dark:text-slate-400 leading-snug">{description}</p>
      </div>
    </div>
    <div className="flex-shrink-0">
      <Button
        variant={isDanger ? 'danger' : 'secondary'}
        size="sm"
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
      >
        {buttonText}
      </Button>
    </div>
  </div>
);

export default ActionRow;
