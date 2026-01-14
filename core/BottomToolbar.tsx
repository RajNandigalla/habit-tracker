import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListTodo, Swords, Trophy, BookText, BarChartBig } from 'lucide-react';
import { cn } from '../utils';

interface BottomToolbarProps {
  className?: string;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const ToolbarNavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all duration-200 active:scale-95',
          isActive
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        )
      }
      aria-label={label}
    >
      {({ isActive }) => (
        <div
          className={cn(
            'p-2 rounded-xl transition-all duration-200',
            isActive
              ? 'bg-indigo-100 dark:bg-indigo-900/30'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          {icon}
        </div>
      )}
    </NavLink>
  );
};

export const BottomToolbar: React.FC<BottomToolbarProps> = ({ className }) => {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg',
        'pb-safe md:hidden',
        className
      )}
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around px-2 py-1">
        <ToolbarNavItem to="/" icon={<ListTodo size={24} />} label="Habits" />
        <ToolbarNavItem to="/challenges" icon={<Swords size={24} />} label="Challenges" />
        <ToolbarNavItem to="/achievements" icon={<Trophy size={24} />} label="Achievements" />
        <ToolbarNavItem to="/journal" icon={<BookText size={24} />} label="Journal" />
        <ToolbarNavItem to="/progress" icon={<BarChartBig size={24} />} label="Progress" />
      </div>
    </nav>
  );
};

export default BottomToolbar;
