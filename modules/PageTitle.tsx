import React from 'react';
import { cn } from '../utils';

interface PageTitleProps {
  title: string;
  description: string;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, description, className }) => {
  return (
    <div className={cn('px-1', className)}>
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-1 text-base text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
};
