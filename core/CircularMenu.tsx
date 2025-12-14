import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Plus } from 'lucide-react';
import { cn } from '../utils';

export interface CircularAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onSelect: () => void;
  color?: string;
  // Position offsets for "quarter circle" layout (top-left relative to button)
  // We'll calculate these or allow override
}

interface CircularMenuProps {
  actions: CircularAction[];
  mainIcon?: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  ariaLabel?: string;
  className?: string;
}

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

  // Refs for logic
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeItemRef = useRef<string | null>(null); // Sync with state for event handlers
  const isOpenRef = useRef(false); // Sync for event handlers
  const currentModeRef = useRef<'pointer' | 'touch' | 'mouse' | null>(null);

  // Constants from provided code
  const LONG_PRESS_DURATION = 450;

  useEffect(() => {
    activeItemRef.current = activeItemId;
  }, [activeItemId]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const triggerHaptic = (kind: 'open' | 'change' | 'select') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      switch (kind) {
        case 'open':
          navigator.vibrate(15);
          break;
        case 'change':
          navigator.vibrate(8);
          break;
        case 'select':
          navigator.vibrate([10, 40, 20]);
          break;
      }
    }
  };

  const openMenu = useCallback(() => {
    setIsOpen(true);
    setIsPressing(false); // Remove "pressing" state when it becomes "open"
    triggerHaptic('open');
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setActiveItemId(null);
  }, []);

  const hitTest = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    // Be careful with what we match. code says closest(".fab-item")
    // Our items will have data-action or data-id
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
      // Clear timer
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      setIsPressing(false);

      if (isOpenRef.current) {
        // Use last activeItem
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
    [actions, closeMenu] // References to stable functions
  );

  // We need to keep references to the specific listener instances to remove them
  const listenersRef = useRef<{
    move: (e: any) => void;
    end: (e: any) => void;
  } | null>(null);

  const detachMoveEndListeners = () => {
    const mode = currentModeRef.current;
    const listeners = listenersRef.current;
    if (!listeners) return;

    if (mode === 'pointer') {
      window.removeEventListener('pointermove', listeners.move);
      window.removeEventListener('pointerup', listeners.end);
      window.removeEventListener('pointercancel', listeners.end);
    } else if (mode === 'touch') {
      window.removeEventListener('touchmove', listeners.move);
      window.removeEventListener('touchend', listeners.end);
      window.removeEventListener('touchcancel', listeners.end);
    } else if (mode === 'mouse') {
      window.removeEventListener('mousemove', listeners.move);
      window.removeEventListener('mouseup', listeners.end);
    }

    listenersRef.current = null;
    currentModeRef.current = null;
  };

  const beginPress = useCallback(
    (mode: 'pointer' | 'touch' | 'mouse', startX: number, startY: number) => {
      if (pressTimerRef.current || isOpenRef.current) return;

      currentModeRef.current = mode;
      setIsPressing(true);

      pressTimerRef.current = setTimeout(() => {
        openMenu();
        // Immediately hit test at start pos
        hitTest(startX, startY);
      }, LONG_PRESS_DURATION);

      // Define listeners
      let moveListener: (e: any) => void;
      let endListener: (e: any) => void;

      if (mode === 'pointer') {
        moveListener = (ev: PointerEvent) => {
          ev.preventDefault();
          onPressMove(ev.clientX, ev.clientY);
        };
        endListener = (ev: PointerEvent) => {
          ev.preventDefault();
          onPressEnd(ev.clientX, ev.clientY);
        };
        window.addEventListener('pointermove', moveListener, { passive: false });
        window.addEventListener('pointerup', endListener, { passive: false });
        window.addEventListener('pointercancel', endListener, { passive: false });
      } else if (mode === 'touch') {
        moveListener = (ev: TouchEvent) => {
          ev.preventDefault();
          if (ev.touches.length === 0) return;
          const t = ev.touches[0];
          onPressMove(t.clientX, t.clientY);
        };
        endListener = (ev: TouchEvent) => {
          ev.preventDefault();
          if (ev.changedTouches.length === 0) return;
          const t = ev.changedTouches[0];
          onPressEnd(t.clientX, t.clientY);
        };
        window.addEventListener('touchmove', moveListener, { passive: false });
        window.addEventListener('touchend', endListener, { passive: false });
        window.addEventListener('touchcancel', endListener, { passive: false });
      } else {
        // mouse
        moveListener = (ev: MouseEvent) => {
          onPressMove(ev.clientX, ev.clientY);
        };
        endListener = (ev: MouseEvent) => {
          onPressEnd(ev.clientX, ev.clientY);
        };
        window.addEventListener('mousemove', moveListener);
        window.addEventListener('mouseup', endListener);
      }

      listenersRef.current = { move: moveListener, end: endListener };
    },
    [onPressMove, onPressEnd, openMenu, hitTest]
  );

  // Attach listeners to the toggle button
  useEffect(() => {
    const el = toggleRef.current;
    if (!el) return;

    // Pointer
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      beginPress('pointer', e.clientX, e.clientY);
    };

    // Touch
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      e.preventDefault();
      beginPress('touch', t.clientX, t.clientY);
    };

    // Mouse
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      beginPress('mouse', e.clientX, e.clientY);
    };

    if (window.PointerEvent) {
      el.addEventListener('pointerdown', handlePointerDown as any, { passive: false });
    } else {
      el.addEventListener('touchstart', handleTouchStart as any, { passive: false });
      el.addEventListener('mousedown', handleMouseDown as any);
    }

    // Context menu prevention
    const handleContextMenu = (e: Event) => e.preventDefault();
    el.addEventListener('contextmenu', handleContextMenu);

    return () => {
      if (window.PointerEvent) {
        el.removeEventListener('pointerdown', handlePointerDown as any);
      } else {
        el.removeEventListener('touchstart', handleTouchStart as any);
        el.removeEventListener('mousedown', handleMouseDown as any);
      }
      el.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [beginPress]);

  // Derived styles based on the example
  const activeLabel = actions.find(a => a.id === activeItemId)?.label;

  // Calculate item positions - Hardcoded offsets from the example for 3 items
  // .save { --tx: -120px; --ty: -15px; }
  // .send { --tx: -95px; --ty: -95px; }
  // .hide { --tx: -15px; --ty: -120px; }
  // We can calculate this dynamically or just map index
  const getItemStyle = (index: number, total: number) => {
    // The example uses specific quarter-circle logic
    // Let's approximate the example's spread
    // Radius appears to be ~120px based on offsets
    const r = 120;
    // Angles: -15 deg (x:-15, y:-120?? no wait, -120y is top)
    // The example coords:
    // hide: x:-15, y:-120 -> Angle ~ -97 deg (mostly up)
    // save: x:-120, y:-15 -> Angle ~ -173 deg (mostly left)
    // send: x:-95, y:-95 -> Angle ~ -135 deg (diagonal)

    // So range is -173 to -97 (Left to Top)
    const startAngle = -173;
    const endAngle = -97;
    const step = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
    const angle = startAngle + step * index; // index 0 = left?

    // The example has 'save' first in HTML -> index 0. '.save' has tx: -120, ty: -15 => LEFT
    // So index 0 = Left (-173)

    const rad = angle * (Math.PI / 180);
    const tx = Math.cos(rad) * r;
    const ty = Math.sin(rad) * r;

    // Delay calculation: 0.02, 0.08, 0.14 ... step 0.06
    const delay = 0.02 + index * 0.06;

    const isActive = activeItemId === actions[index].id;
    const scale = isActive ? 1.18 : isOpen ? 1 : 0;

    // If not open, we scale to 0. But in provided code, they also reset translate?
    // "transform: translate(var(--tx), var(--ty)) scale(var(--scale));"
    // default --scale is 0.

    return {
      '--tx': `${tx}px`,
      '--ty': `${ty}px`,
      '--scale': scale,
      transform: `translate(var(--tx), var(--ty)) scale(var(--scale))`,
      transitionDelay: `${delay}s`,
      // Active state styles
      backgroundColor: isActive ? '#e60023' : '#fff', // --accent-red
      color: isActive ? '#fff' : '#222',
      zIndex: isActive ? 30 : 10,
    } as React.CSSProperties;
  };

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        id="fabBackdrop"
        className={cn(
          'fixed inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(0,0,0,0.3),rgba(0,0,0,0.65))] z-50 pointer-events-none transition-opacity duration-250 ease-out touch-none',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        )}
      />

      {/* Label */}
      <div
        id="fabLabel"
        className={cn(
          'fixed left-[10%] top-1/2 -translate-y-1/2 text-[clamp(42px,8vw,72px)] font-bold tracking-[0.15em] uppercase text-white/90 pointer-events-none transition-opacity duration-180 ease-out z-[51]',
          isOpen && activeLabel ? 'opacity-100' : 'opacity-0'
        )}
      >
        {activeLabel}
      </div>

      {/* Menu Container */}
      <div
        id="fabMenu"
        className={cn(
          'fixed right-8 bottom-8 w-[260px] h-[260px] pointer-events-none z-[60] transition-all duration-220 ease-[cubic-bezier(0.22,0.61,0.36,1)] touch-none',
          isOpen ? 'opacity-100 scale-100' : 'opacity-90 scale-92',
          // Pressing effect from example
          isPressing && !isOpen && 'scale-90 opacity-100' // rough approx of .pressing logic
        )}
      >
        {/* Buttons */}
        {actions.map((action, i) => (
          <button
            key={action.id}
            data-circular-id={action.id}
            className={cn(
              'absolute right-0 bottom-0 w-[70px] h-[70px] rounded-full border-none outline-none flex items-center justify-center text-[26px] shadow-[0_10px_25px_rgba(0,0,0,0.35)] origin-center transition-all duration-[280ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]',
              isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            )}
            style={getItemStyle(i, actions.length)}
          >
            {action.icon}
          </button>
        ))}

        {/* Main Toggle */}
        <button
          ref={toggleRef}
          id="fabToggle"
          aria-label={ariaLabel}
          className={cn(
            'absolute right-0 bottom-0 w-[70px] h-[70px] rounded-full border-none outline-none cursor-pointer flex items-center justify-center text-[26px] z-20 pointer-events-auto shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition-all duration-[280ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] overflow-visible',
            // Example uses --fab-main: #39b54a (green), we can stick to indigo or use the user's color
            'bg-indigo-600 text-white',
            // Pressing scale on the button itself
            isPressing && 'scale-90 shadow-[0_6px_18px_rgba(0,0,0,0.4)]',
            className
          )}
          style={{
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
          }}
        >
          {/* Halo effect */}
          <div
            className={cn(
              'absolute inset-[-14px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.45),rgba(79,70,229,0))] opacity-0 scale-70 transition-all duration-220 ease-out -z-10 pointer-events-none',
              (isPressing || isOpen) && 'opacity-100 scale-100' // Approximation of hover/pressing state
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
