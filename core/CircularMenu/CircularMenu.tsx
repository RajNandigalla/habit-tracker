import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Plus } from 'lucide-react';
import { cn } from '../../utils';
import { useCircularMenuGestures } from './useCircularMenuGestures';

export interface CircularAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
  color?: string;
}

interface CircularMenuProps {
  actions: CircularAction[];
  mainIcon?: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  ariaLabel?: string;
  className?: string;
}

const triggerHaptic = (kind: 'open' | 'change' | 'select') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const patterns = { open: 15, change: 8, select: [10, 40, 20] as number[] };
    navigator.vibrate(patterns[kind]);
  }
};

const getItemStyle = (
  index: number,
  total: number,
  actions: CircularAction[],
  activeItemId: string | null,
  isOpen: boolean
): React.CSSProperties => {
  const r = 120;
  const startAngle = -173;
  const endAngle = -97;
  const step = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
  const angle = startAngle + step * index;

  const rad = angle * (Math.PI / 180);
  const tx = Math.cos(rad) * r;
  const ty = Math.sin(rad) * r;
  const delay = 0.02 + index * 0.06;

  const isActive = activeItemId === actions[index].id;
  const scale = isActive ? 1.18 : isOpen ? 1 : 0;

  return {
    '--tx': `${tx}px`,
    '--ty': `${ty}px`,
    '--scale': scale,
    transform: `translate(var(--tx), var(--ty)) scale(var(--scale))`,
    transitionDelay: `${delay}s`,
    zIndex: isActive ? 30 : 10,
  } as React.CSSProperties;
};

export const CircularMenu: React.FC<CircularMenuProps> = ({
  actions,
  mainIcon = <Plus className="w-7 h-7" />,
  onOpenChange,
  ariaLabel = 'Menu',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isPressing, setIsPressing] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const activeItemRef = useRef<string | null>(null);
  const isOpenRef = useRef(false);
  const currentModeRef = useRef<'pointer' | 'touch' | 'mouse' | null>(null);
  const listenersRef = useRef<{ move: (e: Event) => void; end: (e: Event) => void } | null>(null);

  const LONG_PRESS_DURATION = 450;

  useEffect(() => {
    activeItemRef.current = activeItemId;
  }, [activeItemId]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    setIsPressing(false);
    triggerHaptic('open');
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setActiveItemId(null);
  }, []);

  const hitTest = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    const itemEl = el?.closest('[data-circular-id]');
    const newItemId = itemEl?.getAttribute('data-circular-id') || null;

    if (newItemId !== activeItemRef.current) {
      setActiveItemId(newItemId);
      if (newItemId) {
        triggerHaptic('change');
      }
    }
  }, []);

  const onPressMove = useCallback(
    (x: number, y: number) => {
      if (!isOpenRef.current) return;
      hitTest(x, y);
    },
    [hitTest]
  );

  const onPressEnd = useCallback(
    (x: number, y: number) => {
      setIsPressing(false);

      if (isOpenRef.current) {
        if (activeItemRef.current) {
          const action = actions.find(a => a.id === activeItemRef.current);
          if (action) {
            triggerHaptic('select');
            action.onSelect();
          }
        }
        closeMenu();
      }

      detachMoveEndListeners();
    },
    [actions, closeMenu]
  );

  const { detachMoveEndListeners, pressTimerRef } = useCircularMenuGestures(
    toggleRef,
    { onPressMove, onPressEnd, openMenu, hitTest },
    LONG_PRESS_DURATION,
    { current: isOpenRef.current },
    activeItemRef,
    currentModeRef,
    listenersRef
  );

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, [pressTimerRef]);

  const activeLabel = actions.find(a => a.id === activeItemId)?.label;

  return ReactDOM.createPortal(
    <>
      <div
        className={cn(
          'fixed inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(0,0,0,0.3),rgba(0,0,0,0.65))] z-50 pointer-events-none transition-opacity duration-250 ease-out touch-none',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        )}
      />

      <div
        className={cn(
          'fixed left-[10%] top-1/2 -translate-y-1/2 text-[clamp(42px,8vw,72px)] font-bold tracking-[0.15em] uppercase text-white/90 pointer-events-none transition-opacity duration-180 ease-out z-[51]',
          isOpen && activeLabel ? 'opacity-100' : 'opacity-0'
        )}
      >
        {activeLabel}
      </div>

      <div
        className={cn(
          'fixed right-8 bottom-8 w-[260px] h-[260px] pointer-events-none z-[60] transition-all duration-220 ease-[cubic-bezier(0.22,0.61,0.36,1)] touch-none',
          isOpen ? 'opacity-100 scale-100' : 'opacity-90 scale-92',
          isPressing && !isOpen && 'scale-90 opacity-100'
        )}
      >
        {actions.map((action, i) => {
          const isActive = activeItemId === action.id;
          return (
            <button
              key={action.id}
              data-circular-id={action.id}
              className={cn(
                'absolute right-0 bottom-0 w-[70px] h-[70px] rounded-full border-none outline-none flex items-center justify-center text-[26px] shadow-[0_10px_25px_rgba(0,0,0,0.35)] origin-center transition-all duration-[280ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]',
                isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                isActive
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
              )}
              style={getItemStyle(i, actions.length, actions, activeItemId, isOpen)}
            >
              {action.icon}
            </button>
          );
        })}

        <button
          ref={toggleRef}
          aria-label={ariaLabel}
          className={cn(
            'absolute right-0 bottom-0 w-[70px] h-[70px] rounded-full border-none outline-none cursor-pointer flex items-center justify-center text-[26px] z-20 pointer-events-auto shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition-all duration-[280ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] overflow-visible bg-indigo-600 text-white',
            isPressing && 'scale-90 shadow-[0_6px_18px_rgba(0,0,0,0.4)]',
            className
          )}
          style={{
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
          }}
        >
          <div
            className={cn(
              'absolute inset-[-14px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.45),rgba(79,70,229,0))] opacity-0 scale-70 transition-all duration-220 ease-out -z-10 pointer-events-none',
              (isPressing || isOpen) && 'opacity-100 scale-100'
            )}
          />
          <div className={cn('transition-transform duration-350 ease-out', isOpen && 'rotate-45')}>
            <span className="pointer-events-none block">{mainIcon}</span>
          </div>
        </button>
      </div>
    </>,
    document.body
  );
};
