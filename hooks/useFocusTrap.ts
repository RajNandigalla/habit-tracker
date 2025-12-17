import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container.
 * Useful for modals, dialogs, and other overlays that should capture focus.
 *
 * @param isActive - Whether the focus trap should be active
 * @returns Ref object to be attached to the container
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Store currently active element to restore later
      previousActiveElement.current = document.activeElement as HTMLElement;

      const focusableElementsSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

      const focusableElements = containerRef.current?.querySelectorAll(focusableElementsSelector);
      const firstElement = focusableElements?.[0] as HTMLElement;

      // Focus the first element inside the modal
      if (firstElement) {
        // slight delay to ensure render
        requestAnimationFrame(() => {
          firstElement.focus();
        });
      }

      const handleTabKey = (e: KeyboardEvent) => {
        if (!containerRef.current) return;

        const focusables = containerRef.current.querySelectorAll(focusableElementsSelector);
        const first = focusables[0] as HTMLElement;
        const last = focusables[focusables.length - 1] as HTMLElement;

        if (e.key === 'Tab') {
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            // Tab
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }

        // Close on Escape
        // Note: Escape handling is usually done by parent component (Modal onClose)
      };

      const keyListener = (e: KeyboardEvent) => handleTabKey(e);

      document.addEventListener('keydown', keyListener);

      return () => {
        document.removeEventListener('keydown', keyListener);
        // Restore focus
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isActive]);

  return containerRef;
};
