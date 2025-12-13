import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils';

export const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    end={to === '/'}
    className={({ isActive }) =>
      cn(
        'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200',
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm relative overflow-hidden font-bold'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:ring-1 hover:ring-slate-200 dark:hover:ring-slate-700 hover:shadow-sm font-semibold'
      )
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
        )}
        <span
          className={cn(
            'transition-transform duration-300 group-hover:scale-110',
            isActive
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 group-hover:text-indigo-500'
          )}
        >
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: 'h-5 w-5',
          })}
        </span>
        <span
          className={
            isActive
              ? 'translate-x-1'
              : 'group-hover:translate-x-1 transition-transform duration-300'
          }
        >
          {label}
        </span>
      </>
    )}
  </NavLink>
);
