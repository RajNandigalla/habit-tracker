import { useCallback } from 'react';

/**
 * specific hook to handle the circular reveal animation for theme toggling.
 * It clones the current root, places it on top, switches the actual theme underneath,
 * and then animates a clip-path to reveal the new theme.
 */
export const useThemeTransition = (onToggleTheme: () => void) => {
  const handleThemeToggle = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      // Prevent default behavior if it's a form element or link
      e.preventDefault();

      const root = document.getElementById('root');
      if (!root) {
        onToggleTheme();
        return;
      }

      // 1. Clone Current State (OLD theme)
      // The clone represents the state *before* the toggle.
      const clone = root.cloneNode(true) as HTMLElement;

      // 2. Setup Clone Styling
      // We position it fixed exactly over the viewport to act as the "old layer"
      const rect = root.getBoundingClientRect();
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      // We put the clone at z-index 0.
      clone.style.zIndex = '0';
      clone.style.overflow = 'hidden';
      // Disable interaction on the clone
      clone.style.pointerEvents = 'none';
      clone.id = 'root-clone';

      // 3. Prepare Real Root (NEW state)
      // The real root will change theme immediately.
      // We set it to z-index 10 to sit *on top* of the clone.
      // We will clip it to 0 initially, then expand the clip.
      root.style.position = 'relative';
      root.style.zIndex = '10';

      // Calculate the radius for the circular reveal
      // It needs to be large enough to cover the furthest corner from the click
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // 4. Append Clone to Body
      document.body.appendChild(clone);

      // 5. TOGGLE State
      // This switches the React state, causing the real root to re-render with the NEW theme.
      onToggleTheme();

      // 6. Animate Real Root
      // The real root (New Theme) is revealed over the clone (Old Theme)
      const animation = root.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 500,
          easing: 'ease-in',
          fill: 'forwards',
        }
      );

      animation.onfinish = () => {
        // Cleanup
        if (document.body.contains(clone)) {
          document.body.removeChild(clone);
        }
        // Reset root styles
        root.style.zIndex = '';
        root.style.position = '';
        root.style.clipPath = '';
        animation.cancel();
      };
    },
    [onToggleTheme]
  );

  return handleThemeToggle;
};
