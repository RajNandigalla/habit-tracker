import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div 
      className={twMerge(clsx(
        'rounded-xl bg-white p-4 shadow-sm border border-slate-100 transition-all duration-300 ease-ios md:hover:shadow-md will-change-transform',
        'dark:bg-slate-800 dark:border-slate-700/50'
      ), className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;