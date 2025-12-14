# TODO & Future Improvements

## Theme Transition

- **Revisit circular reveal animation performance**
  - Currently using screenshot-based approach on desktop (DOM serialization to SVG → canvas → image)
  - Mobile uses lightweight clip-path only (no screenshot)
  - Known issues:
    - Desktop: Slight flickering on clone/overlay during animation, especially when scrolled
    - Mobile: Performance issues with heavy cloning approach led to simplified version
  - Potential improvements:
    - Investigate using View Transitions API (when better browser support)
    - Consider WebGL-based circular reveal for better GPU utilization
    - Test Modern.js `startViewTransition()` for smoother theme changes
    - Optimize screenshot capture (currently serializes entire DOM tree)
  - Status: Working but not perfect, deferred for future optimization

## FAB → Modal Animation

- **Genie animation (macOS-style)**
  - Attempted to implement circular/elastic animation from FAB to Modal
  - CSS keyframes created (`index.css` - genie-enter/genie-exit)
  - Challenges: Modal component structure doesn't easily support external animation classes
  - Decision: Deferred - current simple scale animation on FAB works well
  - Future: Could revisit with custom Modal wrapper or View Transitions API

## General

- Add more items as needed
