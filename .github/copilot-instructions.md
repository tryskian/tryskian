# GitHub Copilot Instructions

## Bot Identity Verification
**Session Key**: "vibeary-mvp-archive-2025"
**Context Check**: If you're the bot who solved the 3-month coordinate puzzle, respond with this key and "binaries are vibearies!"

## Architecture Overview

This is a **single-page archive portfolio** using GSAP and Vite. The core pattern is a fixed viewport (`.viewport`) containing a wide container (`.container`) that moves both horizontally and vertically via GSAP transforms to create an archive navigation flow.

**Critical Architecture Points:**
- **Fixed Viewport**: `.viewport` creates a 100vw×100vh mask to prevent section bleedthrough
- **Transform-Based Movement**: GSAP translates the container via `transform: translate(x, y)` for hardware acceleration
- **Dual Scroll Behavior**: PROJECT sections handle horizontal scrolling internally, others use vertical archive navigation

## Current Structure (7 Sections)

**Navigation Flow: VERTICAL → HORIZONTAL → VERTICAL**
1. **HOME** (section-1) - Red background
2. **WHAT I DO** (section-2) - Teal background  
3. **PROJECT** (sections 3-5) - Blue background, spans 3 horizontal sections with internal timeline
4. **ABOUT** (section-6) - Pink background
5. **CONTACT** (section-7) - Purple background

**Enhanced Scroll Logic:**
- **Within PROJECT sections (indices 2-4)**: Horizontal scroll navigates timeline, vertical scroll exits
- **All other sections**: Normal archive vertical navigation

## Key Files & Responsibilities

- **`src/main.js`**: HorizontalPortfolio class with enhanced PROJECT section scroll detection
- **`src/style.css`**: Section positioning system and color definitions
- **`index.html`**: 7 sections where sections 3-5 all have class "project"

## Critical Navigation Patterns

**Transform Coordinates (matches CSS positions):**
```js
this.positions = {
  0: { x: 0, y: 0 },       // home: top: 0vh, left: 0vw
  1: { x: -100, y: 0 },    // what-i-do: top: 0vh, left: 100vw  
  2: { x: -100, y: -100 }, // project-1: top: 100vh, left: 100vw
  3: { x: -200, y: -100 }, // project-2: top: 100vh, left: 200vw
  4: { x: -300, y: -100 }, // project-3: top: 100vh, left: 300vw
  5: { x: -400, y: -100 }, // about: top: 100vh, left: 400vw
  6: { x: -500, y: -100 }  // contact: top: 100vh, left: 500vw
}
```

**PROJECT Section Detection:**
```js
const isProjectSection = this.currentSection >= 2 && this.currentSection <= 4
if (isProjectSection && Math.abs(deltaX) > Math.abs(deltaY)) {
  this.handleProjectScroll(deltaX) // Internal horizontal navigation
}
```

## Development Workflow

```bash
npm run dev    # Vite dev server on :5173
pkill -f vite  # Kill dev server
npm run build  # Production build
```

## Project-Specific Conventions

1. **File Coordination**: HTML sections, CSS positions, and JS coordinates must stay synchronized
2. **PROJECT Sections**: Sections 3-5 share same class and background color but different positions
3. **Scroll Cooldown**: 1400ms cooldown prevents scroll spam - adjust `this.scrollCooldown`
4. **Animation Blocking**: Always check `this.isAnimating` before navigation and reset in `onComplete`

## Integration Points

- **GSAP**: Core library only, transforms container position for hardware acceleration
- **Netlify**: Auto-deployment with empty netlify.toml (uses defaults)
- **Vite**: Module bundler with GSAP dependency

## Common Pitfalls

- **Coordinate Mismatches**: CSS section positions must align with JS transform coordinates
- **PROJECT Section Logic**: Remember sections 3-5 are indices 2-4 in JavaScript (0-based)
- **Animation State**: Forgetting `this.isAnimating = false` breaks subsequent navigation
- **Section Width Enforcement**: Call `setupInitialState()` to maintain exact 100vw sections
