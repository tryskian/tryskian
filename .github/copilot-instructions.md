# GitHub Copilot Instructions

## Architecture Overview

This is a **single-page horizontal scroll portfolio** using GSAP and Vite. The core pattern is a fixed viewport (`.viewport`) containing a wide flex container (`.container`) that slides horizontally via GSAP transforms.

**Critical Architecture Points:**
- **Fixed Viewport**: `.viewport` creates a 100vw×100vh mask to prevent section bleedthrough
- **Wide Flex Container**: `.container` is 800vw wide (8 sections × 100vw each) positioned absolutely
- **Section Positioning**: Each `.section` is exactly 100vw×100vh with `flex-shrink: 0` to prevent compression
- **Transform-Based Movement**: GSAP translates the container via `transform: translateX()` for hardware acceleration

## Key Files & Responsibilities

- **`src/main.js`**: HorizontalPortfolio class handles all scroll/touch/keyboard navigation
- **`src/style.css`**: Critical viewport masking and exact section sizing (see `.viewport` and `.section` rules)
- **`index.html`**: 8 hardcoded sections with `data-bg` attributes and `.section-N` classes

## Development Patterns

**Scroll Direction Logic (Inverted):**
```js
if (delta > 0) {
  this.prevSection()  // Scroll down goes to previous (left)
} else {
  this.nextSection()  // Scroll up goes to next (right)
}
```

**Section Management:**
- Always call `setupInitialState()` to force exact `100vw` widths on sections
- Use `Math.floor(window.innerWidth)` for pixel-perfect positioning
- Maintain `this.currentSection` index and validate bounds before animation

**Critical CSS Pattern:**
```css
.section {
  width: 100vw !important;
  flex-shrink: 0 !important;
  flex-basis: 100vw !important;
}
```

## Development Workflow

```bash
npm run dev    # Vite dev server on :5173
npm run build  # Production build to dist/
```

**Debugging Commands:**
- Check console for "Going to section X/Y" logs during navigation
- Inspect `.container` transform values in DevTools
- Verify section widths match viewport exactly

## Project-Specific Conventions

1. **Section Count**: Hardcoded to 8 everywhere - update HTML, CSS color classes (.section-1 through .section-8), and container width (800vw)
2. **Color System**: Each section has both `.section-N` CSS class and `data-bg` attribute (currently unused)
3. **Animation Blocking**: `this.isAnimating` prevents concurrent animations - always reset in `onComplete`
4. **Resize Handling**: Debounced resize recalculates positioning without re-animation

## Integration Points

- **Netlify**: Auto-deploys from main branch (empty netlify.toml relies on defaults)
- **GSAP**: Only uses core GSAP, no ScrollTrigger despite imports
- **Touch Events**: Uses `{ passive: true }` for performance on mobile

## Common Pitfalls

- **Section Width Drift**: Sections can lose exact 100vw sizing - always re-enforce in `setupInitialState()`
- **Transform Precision**: Use `Math.floor()` for pixel-perfect positioning
- **Animation State**: Forgetting to set `this.isAnimating = false` breaks navigation
- **Viewport Overflow**: Missing `.viewport` wrapper causes horizontal scrollbars
