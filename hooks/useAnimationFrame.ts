import { useEffect } from 'react';

/**
 * Custom hook for triggering CSS transitions on mount.
 * Uses double requestAnimationFrame to ensure browser has a "before" state.
 *
 * @param callback - Function to execute after animation frames
 * @param deps - Dependencies array (like useEffect)
 *
 * @example
 * // Trigger CSS transition on mount
 * useAnimationFrame(() => {
 *   setIsVisible(true);
 * }, []);
 *
 * @why Double rAF?
 * - First rAF: Browser schedules callback before next paint
 * - Second rAF: Ensures callback runs AFTER layout/paint
 * - Result: CSS has a "before" state to transition from
 */
export const useAnimationFrame = (callback: () => void, deps: React.DependencyList) => {
  useEffect(() => {
    let rafId1: number;
    let rafId2: number;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        callback();
      });
    });

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAnimationFrame;
