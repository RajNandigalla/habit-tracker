import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlusIcon, XIcon } from '../icons';
import { useScrollAwareFab } from '../../hooks/useScrollAwareFab';
import { acquireScrollLock, releaseScrollLock } from '../../utils/scrollLock';

export interface FabAction {
  id: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick: () => void;
  color?: string; // tailwind class for bg color
}

interface ExpandableFABProps {
  actions: FabAction[];
  mainIcon?: React.FC<{ className?: string }>;
  ariaLabel?: string;
  isParentOpen?: boolean;
}

const ExpandableFAB: React.FC<ExpandableFABProps> = ({
  actions,
  mainIcon: MainIcon = PlusIcon,
  ariaLabel = 'Menu',
  isParentOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const fabContainerRef = useRef<HTMLDivElement>(null);
  const isFabVisible = useScrollAwareFab();

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const longPressTimerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);
  const hoveredActionRef = useRef<string | null>(null);

  const actionButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    actionButtonRefs.current = actionButtonRefs.current.slice(0, actions.length);
  }, [actions.length]);

  useEffect(() => {
    if (isOpen) {
      acquireScrollLock();
      return () => {
        releaseScrollLock();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isParentOpen) {
      setIsAnimatingOut(false);
    }
  }, [isParentOpen]);

  const updateHoveredAction = useCallback((actionId: string | null) => {
    if (hoveredActionRef.current !== actionId) {
      if (actionId !== null) {
        navigator.vibrate?.(20);
      }
      hoveredActionRef.current = actionId;
      setHoveredAction(actionId);
    }
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isLongPress.current) return;

      let currentlyHovered: string | null = null;
      actionButtonRefs.current.forEach((buttonEl, index) => {
        if (buttonEl) {
          const rect = buttonEl.getBoundingClientRect();
          if (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
          ) {
            currentlyHovered = actions[index].id;
          }
        }
      });
      updateHoveredAction(currentlyHovered);
    },
    [actions, updateHoveredAction]
  );

  const handleTap = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (isLongPress.current) {
      if (hoveredActionRef.current) {
        const action = actions.find(a => a.id === hoveredActionRef.current);
        action?.onClick();
      }
      setIsOpen(false);
    }

    isLongPress.current = false;
    updateHoveredAction(null);

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [actions, handlePointerMove, updateHoveredAction]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Prevent context menu
      // e.preventDefault();
      isLongPress.current = false;
      hoveredActionRef.current = null;

      longPressTimerRef.current = window.setTimeout(() => {
        isLongPress.current = true;
        navigator.vibrate?.(50);
        setIsOpen(true);
        window.addEventListener('pointermove', handlePointerMove);
      }, 300);

      window.addEventListener('pointerup', handlePointerUp, { once: true });
    },
    [handlePointerMove, handlePointerUp]
  );

  // General cleanup effect
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Calculate rotation per item (arc distribution)
  // Distribute over 90 degrees (top-left quadrant relative to FAB)
  // But simplistic stack or fan is easier. Let's do a vertical stack or simple fan.
  // Original code used 225, 270, 315 degrees.
  const getRotation = (index: number, total: number) => {
    const startAngle = 225; // Bottom-Left-ish
    const endAngle = 315; // Top-Left-ish
    if (total === 1) return 270;
    const step = (endAngle - startAngle) / (total - 1);
    return startAngle + step * index;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-30 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        style={{ touchAction: isOpen ? 'none' : 'auto' }}
      />

      <div
        ref={fabContainerRef}
        className={`fixed bottom-20 right-6 z-40 md:hidden transition-transform duration-300 ease-in-out select-none ${
          isFabVisible ? 'translate-y-0' : 'translate-y-40'
        }`}
      >
        {/* Child Action Buttons */}
        <div className="absolute bottom-0 right-0 w-14 h-14 flex items-center justify-center">
          {actions.map((action, index) => {
            const rotation = getRotation(index, actions.length);
            return (
              <div
                key={action.id}
                className="absolute flex items-center gap-2"
                style={{
                  transform: isOpen
                    ? `rotate(${rotation}deg) translateY(-85px) rotate(-${rotation}deg)`
                    : 'scale(0)',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionDelay: isOpen ? `${index * 50}ms` : `0ms`,
                  pointerEvents: isOpen ? 'auto' : 'none',
                  // We want the label to be horizontal always, so we counter-rotate the container
                  // Actually the original implementation rotated the button itself.
                }}
              >
                <button
                  ref={el => {
                    actionButtonRefs.current[index] = el;
                  }}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-12 h-12 text-white rounded-full shadow-lg flex items-center justify-center transition-transform ${action.color || 'bg-indigo-500'} ${hoveredAction === action.id ? 'scale-125' : ''}`}
                  aria-label={action.label}
                >
                  <action.icon className="w-5 h-5" />
                </button>
                {/* Optional Label (Hidden for now to keep it clean like original, or can be added) */}
              </div>
            );
          })}
        </div>

        {/* Main FAB */}
        <button
          onClick={handleTap}
          onPointerDown={handlePointerDown}
          onContextMenu={e => e.preventDefault()}
          className={`relative w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 ${isAnimatingOut ? 'scale-0' : 'scale-100 md:hover:scale-110'}`}
          aria-label={isOpen ? 'Close menu' : ariaLabel}
          aria-expanded={isOpen}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <MainIcon
            className={`w-7 h-7 absolute transition-transform duration-200 ${isOpen ? 'rotate-45 scale-0' : 'rotate-0 scale-100'}`}
          />
          <XIcon
            className={`w-7 h-7 absolute transition-transform duration-200 ${isOpen ? 'rotate-0 scale-100' : '-rotate-45 scale-0'}`}
          />
        </button>
      </div>
    </>
  );
};

export default ExpandableFAB;
