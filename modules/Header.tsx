import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '../utils';
import { useNavigation } from '../context/NavigationContext';
import { MenuIcon, PaletteIcon } from '../icons';
import { AppearanceBottomSheet } from './settings/AppearanceBottomSheet';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ className, children }) => {
  const { toggleSideMenu } = useNavigation();
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'z-40 shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 md:px-6 transition-colors',
          className
        )}
      >
        <div className="w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={toggleSideMenu}
              className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center text-white shadow-lg shadow-indigo-600/20 dark:shadow-indigo-900/20">
                <Activity className="h-4 w-4" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                TickOff
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {children}

            <button
              onClick={() => setIsAppearanceOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors active:scale-95 duration-200"
              aria-label="Appearance settings"
            >
              <PaletteIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AppearanceBottomSheet isOpen={isAppearanceOpen} onClose={() => setIsAppearanceOpen(false)} />
    </>
  );
};
