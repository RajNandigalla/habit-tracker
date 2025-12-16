import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/Store';
import {
  MoonIcon,
  SunIcon,
  TypeIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
} from '../../icons';
import { cn } from '../../utils';
import Modal from '../../core/Modal';
import Slider from '../../core/Slider';
import Button from '../../core/Button';

interface AppearanceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

type AppearanceView = 'main' | 'theme' | 'font';

export const AppearanceBottomSheet: React.FC<AppearanceBottomSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { preferences, toggleDarkMode, setFontSize } = useStore();
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
          className="p-1 -ml-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
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
      bottomSheet
      className="max-h-[80vh] flex flex-col"
    >
      <motion.div
        className="relative overflow-hidden w-full"
        initial={false}
        animate={{ height: currentView === 'font' ? '50vh' : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <AnimatePresence initial={false} custom={direction}>
          {currentView === 'main' && (
            <motion.div
              key="main"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute inset-0 space-y-2 bg-white dark:bg-slate-900"
            >
              <button
                onClick={() => navigateTo('theme')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
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
                <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </button>

              <button
                onClick={() => navigateTo('font')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
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
                <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              </button>
            </motion.div>
          )}

          {currentView === 'theme' && (
            <motion.div
              key="theme"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute inset-0 space-y-3 bg-white dark:bg-slate-900"
            >
              <button
                onClick={() => preferences.darkMode && toggleDarkMode()}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200',
                  !preferences.darkMode
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-slate-200 dark:border-slate-800'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <SunIcon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      'font-semibold',
                      !preferences.darkMode
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    Light Mode
                  </span>
                </div>
                {!preferences.darkMode && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => !preferences.darkMode && toggleDarkMode()}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200',
                  preferences.darkMode
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
                    : 'border-slate-200 dark:border-slate-800'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
                    <MoonIcon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      'font-semibold',
                      preferences.darkMode
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    Dark Mode
                  </span>
                </div>
                {preferences.darkMode && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </motion.div>
          )}

          {currentView === 'font' && (
            <motion.div
              key="font"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="absolute inset-0 flex flex-col bg-white dark:bg-slate-900"
            >
              {/* Preview Text */}
              <div className="w-full flex-1 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-y-auto">
                <h3
                  className="font-bold mb-2 text-slate-900 dark:text-white transition-all duration-200"
                  style={{ fontSize: `${tempFontSize * 1.2}px` }}
                >
                  The Wizard of Oz
                </h3>
                <div className="space-y-4">
                  <p
                    className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
                    style={{ fontSize: `${tempFontSize}px` }}
                  >
                    Chapter XI: The Wonderful Emerald City of Oz
                  </p>
                  <p
                    className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
                    style={{ fontSize: `${tempFontSize}px` }}
                  >
                    Even with their eyes protected by the green spectacles, Dorothy and her friends
                    were at first dazzled by the brilliancy of the wonderful City. The streets were
                    lined with beautiful houses all built of green marble and studded everywhere
                    with sparkling emeralds.
                  </p>
                  <p
                    className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
                    style={{ fontSize: `${tempFontSize}px` }}
                  >
                    They walked over a pavement of the same green marble, and where the blocks were
                    joined together were rows of emeralds, set closely, and glittering in the
                    brightness of the sun. The window panes were of green glass; even the sky above
                    the City had a green tint, and the rays of the sun were green.
                  </p>
                  <p
                    className="text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-200"
                    style={{ fontSize: `${tempFontSize}px` }}
                  >
                    There were many people—men, women, and children—walking about, and these were
                    all dressed in green clothes and had greenish skins. They looked at Dorothy and
                    her strangely assorted company with wondering eyes, and the children all ran
                    away and hid behind their mothers when they saw the Lion.
                  </p>
                </div>
              </div>

              {/* Slider Container */}
              <div className="w-full space-y-6">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Font size
                  </span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                    {tempFontSize}px
                  </span>
                </div>
                <Slider
                  value={tempFontSize}
                  onChange={setTempFontSize}
                  min={minFont}
                  max={maxFont}
                  step={step}
                  showValue={false}
                  formatValue={v => `${v}px`}
                  leftIcon={
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Aa</span>
                  }
                  rightIcon={
                    <span className="text-xl font-bold text-slate-600 dark:text-slate-300">Aa</span>
                  }
                />

                <Button
                  onClick={applyFontSize}
                  className="w-full"
                  disabled={tempFontSize === preferences.fontSize}
                >
                  Apply Changes
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Modal>
  );
};
