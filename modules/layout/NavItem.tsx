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
        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
        isActive
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-800'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:translate-x-1'
      )
    }
  >
    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
      className: 'h-5 w-5',
    })}
    {label}
  </NavLink>
);
