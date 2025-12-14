import React, { useState, useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon } from '../icons';
import { useScrollAwareFab } from '../hooks/useScrollAwareFab';

interface FABProps {
  onClick: () => void;
  ariaLabel: string;
  isParentOpen: boolean;
}

const FAB = forwardRef<HTMLButtonElement, FABProps>(({ onClick, ariaLabel, isParentOpen }, ref) => {
  const isFabVisible = useScrollAwareFab();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // When the modal closes, reset the FAB's animation state
    // so it can animate in again.
    if (!isParentOpen) {
      setIsAnimatingOut(false);
    }
  }, [isParentOpen]);

  const handleClick = () => {
    setIsAnimatingOut(true);
    // Delay opening the modal to allow the animation to play
    setTimeout(() => {
      onClick();
    }, 200); // This duration should match the scale-out animation
  };

  const fabButton = (
    <button
      ref={ref}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`fixed bottom-20 right-6 z-40 md:hidden w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 ${
        isFabVisible ? 'translate-y-0' : 'translate-y-40'
      } ${isAnimatingOut ? 'scale-0' : 'scale-100 hover:scale-110 active:scale-95'}`}
    >
      <PlusIcon className="w-7 h-7" />
    </button>
  );

  // Render FAB in portal to ensure it's on top of everything
  return createPortal(fabButton, document.body);
});

FAB.displayName = 'FAB';

export default FAB;
