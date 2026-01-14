import { useCallback, useRef, useEffect } from 'react';

/**
 * Hook to announce messages to screen readers via a live region.
 * Uses a global element with id 'aria-live-announcer' (must be present in App).
 */
export const useAnnouncer = () => {
  const rafIdRef = useRef<number | undefined>(undefined);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('aria-live-announcer');
    if (!announcer) return;

    // Clear previous RAF loop
    if (rafIdRef.current !== undefined) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Clear and reset aria-live
    announcer.textContent = '';
    announcer.setAttribute('aria-live', priority);

    // Double rAF ensures screen reader picks up the change
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        announcer.textContent = message;

        // Auto-clear after 3 seconds using RAF loop
        const clearStartTime = Date.now();

        const checkClear = () => {
          const elapsed = Date.now() - clearStartTime;

          if (elapsed >= 3000) {
            if (announcer.textContent === message) {
              announcer.textContent = '';
            }
            rafIdRef.current = undefined;
          } else {
            rafIdRef.current = requestAnimationFrame(checkClear);
          }
        };

        rafIdRef.current = requestAnimationFrame(checkClear);
      });
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== undefined) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return { announce };
};
