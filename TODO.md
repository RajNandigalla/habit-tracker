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

## UI Component Library Migration

- **Gradual migration to Radix UI**
  - Current: Custom implementations for Modal, Select, DatePicker, TimePicker, etc.
  - Benefits of Radix UI:
    - Better accessibility out-of-the-box (WAI-ARIA compliant)
    - Less maintenance (battle-tested, widely used)
    - Consistent behavior across all components
    - Works perfectly with Tailwind CSS (unstyled primitives)
    - Industry standard (used by shadcn/ui and many modern apps)
  - Migration approach:
    - Start with most complex components (Modal, Select, Dropdown)
    - Keep current styling, just replace the underlying logic
    - Test thoroughly on desktop, tablet, and mobile
  - Status: Planned for future, current components work well but Radix would reduce maintenance burden

## E2E Test Quality

- **Strengthen weak test assertions**
  - Current: ~160 weak assertions across test suite
  - Patterns to fix:
    - `expect(typeof X).toBe('boolean')` (110+ instances) - meaningless type checks
    - `expect(true).toBe(true)` (50+ instances) - always passes
    - `count >= 0` checks - always true
  - Impact: Tests pass but don't verify actual functionality
  - Files with most weak assertions:
    - `e2e/completion/*.spec.ts` (30+ weak checks)
    - `e2e/mood/mood-check-in.spec.ts` (7 typeof checks)
    - `e2e/mobile/mobile-ux-patterns.spec.ts` (8 weak patterns)
    - `e2e/challenges/challenges.spec.ts` (5 typeof checks)
  - Recommendation:
    - Replace with real assertions (`toBeVisible()`, `toHaveCount()`, state changes)
    - Or skip tests for non-existent features
  - Status: **All tests currently pass** (367 passing, 8 skipped), just not robust

- Add more items as needed
