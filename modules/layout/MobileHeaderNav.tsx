import React from 'react';
import { Activity, Settings2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils';
import { PaletteIcon } from '../../icons';

interface MobileHeaderNavProps {
  className?: string;
}

export const MobileHeaderNav: React.FC<MobileHeaderNavProps> = ({ className }) => {
  const location = useLocation();

  return (
    <header
      className={cn(
        'z-40 shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 transition-colors md:hidden',
        'pt-[max(0.75rem,env(safe-area-inset-top))]',
        className
      )}
    >
      <div className="w-full mx-auto flex items-center justify-between">
        {/* Left: Settings */}
        <Link
          to="/settings"
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200"
          aria-label="Settings"
        >
          <Settings2 className="h-5 w-5" />
        </Link>

        {/* Center: App Name */}
        <div className="flex items-center gap-2">
          <div className="flex w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center text-white shadow-lg shadow-indigo-600/20 dark:shadow-indigo-900/20">
            <Activity className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            TickOff
          </h1>
        </div>

        {/* Right: Appearance */}
        <Link
          to="/settings/appearance"
          state={{ background: location }}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200"
          aria-label="Appearance settings"
        >
          <PaletteIcon className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
};

export default MobileHeaderNav;
