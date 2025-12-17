import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/Store';
import { usePreferences } from '../../context/PreferencesProvider';
import {
  MoonIcon,
  SunIcon,
  TypeIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MenuIcon,
} from '../../icons';
import { Menu, LayoutGrid } from 'lucide-react';
import Modal from '../../core/Modal';
import { ThemeSelector } from './ThemeSelector';
import { FontSizeAdjuster } from './FontSizeAdjuster';

interface AppearanceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

type AppearanceView = 'main' | 'theme' | 'font';

export const AppearanceBottomSheet: React.FC<AppearanceBottomSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { preferences, setFontSize } = useStore();
  const { toggleDarkMode, toggleMobileBottomNav } = usePreferences();
  const [currentView, setCurrentView] = useState<AppearanceView>('main');

  // Font Size Preview Logic
  const [tempFontSize, setTempFontSize] = useState(preferences.fontSize);
  const minFont = 12;
  const maxFont = 16;
  const step = 0.5;

  // Sync temp state when opening or when preferences change externally
  useEffect(() => {
    if (isOpen) {
      setTempFontSize(preferences.fontSize);
      setCurrentView('main');
    }
  }, [isOpen, preferences.fontSize]);

  const applyFontSize = () => {
    setFontSize(tempFontSize);
    navigateTo('main');
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const navigateTo = (view: AppearanceView) => {
    const newDirection = view === 'main' ? -1 : 1;
    setPage([page + newDirection, newDirection]);
    setCurrentView(view);
  };

  const ModalTitle = (
    <div className="flex items-center gap-2">
      {currentView !== 'main' && (
        <button
          onClick={() => navigateTo('main')}
          aria-label="Go back to appearance settings"
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      )}
      <span>
        {currentView === 'main' && 'Appearance'}
        {currentView === 'theme' && 'Theme'}
        {currentView === 'font' && 'Font Size'}
      </span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ModalTitle}
      size="lg"
      className="max-h-[80vh] flex flex-col"
    >
      <div className="w-full overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          {currentView === 'main' && (
            <motion.div
              key="main"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="space-y-2 bg-white dark:bg-slate-900 min-h-[240px]"
            >
              {/* Theme Option */}
              <button
                onClick={() => navigateTo('theme')}
                aria-label="Open theme settings"
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {preferences.darkMode ? (
                      <MoonIcon className="w-5 h-5" />
                    ) : (
                      <SunIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">Theme</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {preferences.darkMode ? 'Dark Mode' : 'Light Mode'}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors" />
              </button>

              {/* Font Size Option */}
              <button
                onClick={() => navigateTo('font')}
                aria-label="Open font size settings"
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">Font Size</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {preferences.fontSize}px
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors" />
              </button>

              {/* Mobile Navigation Toggle (Mobile Only) */}
              <button
                onClick={toggleMobileBottomNav}
                aria-label="Toggle mobile navigation style"
                className="md:hidden w-full flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    {preferences.useMobileBottomNav ? (
                      <LayoutGrid className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">Navigation</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {preferences.useMobileBottomNav ? 'Bottom Toolbar' : 'Side Menu'}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors" />
              </button>
            </motion.div>
          )}

          {currentView === 'theme' && (
            <ThemeSelector
              darkMode={preferences.darkMode}
              onToggle={toggleDarkMode}
              direction={direction}
              slideVariants={slideVariants}
            />
          )}

          {currentView === 'font' && (
            <FontSizeAdjuster
              tempFontSize={tempFontSize}
              currentFontSize={preferences.fontSize}
              onTempChange={setTempFontSize}
              onApply={applyFontSize}
              direction={direction}
              slideVariants={slideVariants}
              minFont={minFont}
              maxFont={maxFont}
              step={step}
            />
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
