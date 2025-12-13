// --- Global Scroll Lock Manager ---
// This centralized manager ensures that multiple components (modals, side menus, etc.)
// opening and closing in quick succession don't conflict with each other's
// scroll-locking effects.

let lockCount = 0;
let originalBodyStyle: {
  position: string;
  top: string;
  width: string;
  overflow: string;
  paddingRight: string;
} | null = null;
let scrollY = 0;

export const acquireScrollLock = () => {
  if (lockCount === 0) {
    // Save the original body styles and scroll position
    originalBodyStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply the lock styles
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Compensate for the scrollbar to prevent layout shifts
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  lockCount++;
};

export const releaseScrollLock = () => {
  lockCount--;
  // Only release the lock if this is the last active modal
  if (lockCount <= 0 && originalBodyStyle) {
    lockCount = 0; // Reset in case it went negative
    // Restore the original styles
    document.body.style.overflow = originalBodyStyle.overflow;
    document.body.style.position = originalBodyStyle.position;
    document.body.style.top = originalBodyStyle.top;
    document.body.style.width = originalBodyStyle.width;
    document.body.style.paddingRight = originalBodyStyle.paddingRight;

    // Restore the original scroll position
    window.scrollTo(0, scrollY);
    originalBodyStyle = null;
  }
};
