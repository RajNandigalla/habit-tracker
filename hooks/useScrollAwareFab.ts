import { throttle } from 'lodash';
import { useState, useEffect, useRef } from 'react';

/**
 * A hook to determine if a Floating Action Button (FAB) should be visible based on scroll direction.
 * @param {number} threshold - The number of pixels the user must scroll before the visibility changes. Defaults to 20.
 * @param {number} throttleDelay - The minimum time in milliseconds between scroll event handler executions. Defaults to 100.
 * @returns {boolean} - Whether the FAB should be visible.
 */
export const useScrollAwareFab = (threshold = 20, throttleDelay = 100) => {
  const [isFabVisible, setIsFabVisible] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    // The core scroll logic is wrapped in lodash's throttle function.
    // This creates a new function that will only be called at most once every `throttleDelay` milliseconds.
    const throttledScrollHandler = throttle(
      () => {
        const currentScrollY = window.scrollY;

        // Always show if at the top of the page
        if (currentScrollY <= 10) {
          setIsFabVisible(true);
          lastScrollY.current = currentScrollY;
          return;
        }

        // Don't do anything if the scroll distance is less than the threshold
        if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
          return;
        }

        // Hide if scrolling down, show if scrolling up
        setIsFabVisible(currentScrollY < lastScrollY.current);

        // Update the last scroll position for the next event
        lastScrollY.current = currentScrollY;
      },
      throttleDelay,
      {
        leading: true, // Fire on the leading edge of the timeout
        trailing: true, // Fire on the trailing edge of the timeout
      }
    );

    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });

    // Cleanup function: remove the event listener and cancel any pending throttled calls.
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      throttledScrollHandler.cancel();
    };
  }, [threshold, throttleDelay]);

  return isFabVisible;
};
