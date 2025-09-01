# GitHub Copilot Instructions

## Architecture Overview

This is a **single-page L-shaped navigation portfolio** using GSAP and Vite. The core pattern is a fixed viewport (`.viewport`) containing a wide container (`.container`) that moves both horizontally and vertically via GSAP transforms to create an L-shaped navigation flow.

**Critical Architecture Points:**
- **Fixed Viewport**: `.viewport` creates a 100vw×100vh mask to prevent section bleedthrough
- **L-Shaped Layout**: Sections are positioned in an L-shape pattern with specific x/y coordinates
- **Section Positioning**: Each `.section` is exactly 100vw×100vh positioned absolutely within container
- **Transform-Based Movement**: GSAP translates the container via `transform: translate(x, y)` for hardware acceleration

## L-Shaped Navigation Flow

The navigation is **linear through 5 sections** but with **L-shaped visual positioning**:
1. **home** (section 1)
2. **what i do** (section 2) 
3. **project** (sections 3-5) - **spans 3 horizontal sections with draggable timeline**
4. **about** (section 6)
5. **contact** (section 7)

**Project Section Special Behavior:**
- **Horizontal scroll/drag**: Navigate through project timeline within sections 3-5
- **Vertical scroll**: Exit project area to next/previous main sections

**Scroll down** = Next section (1→2→3→6→7)  
**Scroll up** = Previous section (7→6→3→2→1)

## Key Files & Responsibilities

- **`src/main.js`**: HorizontalPortfolio class handles L-shaped navigation with both x/y transforms
- **`src/style.css`**: Critical viewport masking and section positioning (see `.viewport` and `.section` rules)
- **`index.html`**: 7 sections with `data-bg` attributes, where sections 3-5 create the horizontal project timeline

## Development Patterns

**Scroll Direction Logic (Normal - WORKING VERSION):**
```js
if (delta > 0) {
  this.navigateNext()  // Scroll down: section 1→2→3→4→5→6→7
} else {
  this.navigatePrevious()  // Scroll up: section 7→6→5→4→3→2→1
}
```

**L-Shaped Visual Positioning (with 3-section project span):**
```js
const positions = {
  0: { x: 0, y: 0 },       // home (top-left)
  1: { x: -100, y: 0 },    // what-i-do (horizontal right)
  2: { x: -100, y: -100 }, // project-1 (vertical down)
  3: { x: -100, y: -200 }, // project-2 (vertical down) 
  4: { x: -100, y: -300 }, // project-3 (vertical down)
  5: { x: -200, y: -300 }, // about (horizontal right)
  6: { x: -300, y: -300 }  // contact (horizontal right)
}
```

**Section Management:**
- Always call `setupInitialState()` to force exact `100vw` widths on sections
- Use `Math.floor(window.innerWidth)` for pixel-perfect positioning
- Maintain `this.currentSection` index and validate bounds before animation
- Follow linear progression (1→2→3→4→5→6→7) with L-shaped visual layout

**Critical CSS Pattern:**
```css
.section {
  width: 100vw !important;
  height: 100vh !important;
  position: absolute;
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

1. **Section Count**: Hardcoded to 7 everywhere - update HTML, CSS color classes (.section-1 through .section-7), and positioning coordinates
2. **L-Shape Layout**: Sections positioned in specific x/y coordinates, not linear arrangement
3. **Navigation Flow**: Follows L-pattern: horizontal → vertical → horizontal, not simple next/prev
4. **Animation Blocking**: `this.isAnimating` prevents concurrent animations - always reset in `onComplete`
5. **Resize Handling**: Debounced resize recalculates positioning without re-animation

## Integration Points

- **Netlify**: Auto-deploys from main branch (empty netlify.toml relies on defaults)
- **GSAP**: Only uses core GSAP, no ScrollTrigger despite imports
- **Touch Events**: Uses `{ passive: true }` for performance on mobile

## Common Pitfalls

- **Section Width Drift**: Sections can lose exact 100vw sizing - always re-enforce in `setupInitialState()`
- **Transform Precision**: Use `Math.floor()` for pixel-perfect positioning
- **Animation State**: Forgetting to set `this.isAnimating = false` breaks navigation
- **Viewport Overflow**: Missing `.viewport` wrapper causes horizontal scrollbars
- **L-Pattern Breaks**: Navigation must follow L-shape flow, not linear prev/next logic
