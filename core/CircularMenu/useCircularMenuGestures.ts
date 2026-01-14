import { useRef, useEffect, useCallback } from 'react';

interface GestureHandlers {
  onPressMove: (x: number, y: number) => void;
  onPressEnd: (x: number, y: number) => void;
  openMenu: () => void;
  hitTest: (x: number, y: number) => void;
}

export const useCircularMenuGestures = (
  toggleRef: React.RefObject<HTMLButtonElement>,
  handlers: GestureHandlers,
  LONG_PRESS_DURATION: number,
  isOpenRef: React.RefObject<boolean>,
  activeItemRef: React.RefObject<string | null>,
  currentModeRef: React.RefObject<'pointer' | 'touch' | 'mouse' | null>,
  listenersRef: React.RefObject<{ move: (e: Event) => void; end: (e: Event) => void } | null>
) => {
  const pressTimerRef = useRef<number | null>(null);

  const detachMoveEndListeners = useCallback(() => {
    const mode = currentModeRef.current;
    const listeners = listenersRef.current;
    if (!listeners) return;

    if (mode === 'pointer') {
      window.removeEventListener('pointermove', listeners.move);
      window.removeEventListener('pointerup', listeners.end);
      window.removeEventListener('pointercancel', listeners.end);
    }

    if (mode === 'touch') {
      window.removeEventListener('touchmove', listeners.move);
      window.removeEventListener('touchend', listeners.end);
      window.removeEventListener('touchcancel', listeners.end);
    }

    if (mode === 'mouse') {
      window.removeEventListener('mousemove', listeners.move);
      window.removeEventListener('mouseup', listeners.end);
    }

    listenersRef.current = null;
    currentModeRef.current = null;
  }, [currentModeRef, listenersRef]);

  const endPress = useCallback(() => {
    // Cancel any pending long-press check
    if (pressTimerRef.current) {
      cancelAnimationFrame(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    detachMoveEndListeners(); // Ensure listeners are detached when press ends
  }, [detachMoveEndListeners]);

  const beginPress = useCallback(
    (mode: 'pointer' | 'touch' | 'mouse', startX: number, startY: number) => {
      if (pressTimerRef.current || isOpenRef.current) return;

      currentModeRef.current = mode;

      // Use timestamp-based detection instead of setTimeout
      const pressStartTime = Date.now();
      let rafId: number;

      const checkLongPress = () => {
        const elapsed = Date.now() - pressStartTime;

        if (elapsed >= LONG_PRESS_DURATION) {
          pressTimerRef.current = null;
          handlers.openMenu();
          handlers.hitTest(startX, startY);
        } else {
          rafId = requestAnimationFrame(checkLongPress);
          pressTimerRef.current = rafId;
        }
      };

      rafId = requestAnimationFrame(checkLongPress);
      pressTimerRef.current = rafId;

      let moveListener: (e: Event) => void;
      let endListener: (e: Event) => void;

      if (mode === 'pointer') {
        moveListener = (ev: Event) => {
          const e = ev as PointerEvent;
          e.preventDefault();
          handlers.onPressMove(e.clientX, e.clientY);
        };
        endListener = (ev: Event) => {
          const e = ev as PointerEvent;
          e.preventDefault();
          endPress(); // Call endPress to clear RAF
          handlers.onPressEnd(e.clientX, e.clientY);
        };
        window.addEventListener('pointermove', moveListener, { passive: false });
        window.addEventListener('pointerup', endListener, { passive: false });
        window.addEventListener('pointercancel', endListener, { passive: false });
      } else if (mode === 'touch') {
        moveListener = (ev: Event) => {
          const e = ev as TouchEvent;
          e.preventDefault();
          if (e.touches.length === 0) return;
          const touch = e.touches[0];
          handlers.onPressMove(touch.clientX, touch.clientY);
        };
        endListener = (ev: Event) => {
          const e = ev as TouchEvent;
          e.preventDefault();
          if (e.changedTouches.length === 0) return;
          const touch = e.changedTouches[0];
          endPress(); // Call endPress to clear RAF
          handlers.onPressEnd(touch.clientX, touch.clientY);
        };
        window.addEventListener('touchmove', moveListener, { passive: false });
        window.addEventListener('touchend', endListener, { passive: false });
        window.addEventListener('touchcancel', endListener, { passive: false });
      } else if (mode === 'mouse') {
        moveListener = (ev: Event) => {
          const e = ev as MouseEvent;
          e.preventDefault();
          handlers.onPressMove(e.clientX, e.clientY);
        };
        endListener = (ev: Event) => {
          const e = ev as MouseEvent;
          e.preventDefault();
          endPress(); // Call endPress to clear RAF
          handlers.onPressEnd(e.clientX, e.clientY);
        };
        window.addEventListener('mousemove', moveListener, { passive: false });
        window.addEventListener('mouseup', endListener, { passive: false });
      }

      listenersRef.current = { move: moveListener, end: endListener };
    },
    [LONG_PRESS_DURATION, currentModeRef, endPress, handlers, isOpenRef, listenersRef] // Re-added dependencies for correctness
  );

  useEffect(() => {
    const el = toggleRef.current;
    if (!el) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      beginPress('pointer', e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      e.preventDefault();
      beginPress('touch', t.clientX, t.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      beginPress('mouse', e.clientX, e.clientY);
    };

    const handleContextMenu = (e: Event) => e.preventDefault();

    if (window.PointerEvent) {
      el.addEventListener('pointerdown', handlePointerDown, { passive: false });
    } else {
      el.addEventListener('touchstart', handleTouchStart, { passive: false });
      el.addEventListener('mousedown', handleMouseDown);
    }
    el.addEventListener('contextmenu', handleContextMenu);

    return () => {
      if (window.PointerEvent) {
        el.removeEventListener('pointerdown', handlePointerDown);
      } else {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('mousedown', handleMouseDown);
      }
      el.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [beginPress, toggleRef]);

  return { detachMoveEndListeners, pressTimerRef };
};
