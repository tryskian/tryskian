import './style.css'
import { gsap } from 'gsap'

class HorizontalPortfolio {
  constructor() {
    this.container = document.querySelector('.container')
    this.sections = document.querySelectorAll('.section')
    
    this.currentSection = 0
    this.totalSections = this.sections.length
    this.isAnimating = false
    
    // L-shaped section positioning (visual only)
    this.positions = {
      0: { x: 0, y: 0 },       // hero (top-left)
      1: { x: -100, y: 0 },    // what-i-do (horizontal right)
      2: { x: -100, y: -100 }, // proj-1 (vertical down)
      3: { x: -100, y: -200 }, // proj-2 (vertical down)
      4: { x: -100, y: -300 }, // archive (vertical down)
      5: { x: -200, y: -300 }, // about (horizontal right)
      6: { x: -300, y: -300 }  // say-hi (horizontal right)
    }
    
    // Smooth scrolling properties
    this.lastScrollTime = 0
    this.scrollCooldown = 1400
    
    this.init()
  }
  
  init() {
    this.setupInitialState()
    this.bindEvents()
  }
  
  setupInitialState() {
    // Force exact 100vw widths on all sections
    this.sections.forEach(section => {
      section.style.width = '100vw'
      section.style.height = '100vh'
      section.style.position = 'absolute'
    })
    
    // Set initial position to hero section
    gsap.set(this.container, { x: 0, y: 0 })
  }
  
  bindEvents() {
    // Wheel event for scrolling
    window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false })
    
    // Touch events for mobile
    this.touchStartX = 0
    this.touchEndX = 0
    
    window.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].clientX
    }, { passive: true })
    
    window.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX
      this.handleTouch()
    }, { passive: true })
    
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault()
          this.navigateNext()
          break
        case 'ArrowUp':
          e.preventDefault()
          this.navigatePrevious()
          break
      }
    })
    
    // Resize handler
    let resizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.setupInitialState()
        this.navigateToSection(this.currentSection)
      }, 250)
    })
  }
  
  handleWheel(e) {
    e.preventDefault()
    
    const now = Date.now()
    if (now - this.lastScrollTime < this.scrollCooldown || this.isAnimating) {
      return
    }
    
    // Add threshold to prevent small scroll events from triggering navigation
    const delta = e.deltaY
    const threshold = 50
    
    console.log(`Scroll detected - deltaY: ${delta}, threshold: ${threshold}`)
    
    if (Math.abs(delta) < threshold) {
      console.log('Scroll too small, ignoring')
      return
    }
    
    this.lastScrollTime = now
    
    // Inverted scroll direction - scroll down goes to lower section numbers
    if (delta > 0) {
      console.log('Scroll DOWN detected -> navigatePrevious() (to lower section)')
      this.navigatePrevious() // Scroll down goes to previous section (s1 direction)
    } else {
      console.log('Scroll UP detected -> navigateNext() (to higher section)')
      this.navigateNext() // Scroll up goes to next section (s7 direction)
    }
  }
  
  handleTouch() {
    const diff = this.touchStartX - this.touchEndX
    const threshold = 50
    
    if (Math.abs(diff) < threshold) return
    
    if (diff > 0) {
      // Swipe left -> next in L-pattern
      this.navigateNext()
    } else {
      // Swipe right -> previous in L-pattern
      this.navigatePrevious()
    }
  }
  
  navigateNext() {
    console.log('navigateNext called, current:', this.currentSection, 'total:', this.totalSections)
    if (this.isAnimating) {
      console.log('Animation in progress, skipping')
      return
    }
    
    if (this.currentSection < this.totalSections - 1) {
      console.log('Moving from section', this.currentSection, 'to', this.currentSection + 1)
      this.navigateToSection(this.currentSection + 1)
    } else {
      console.log('Already at last section')
    }
  }
  
  navigatePrevious() {
    console.log('navigatePrevious called, current:', this.currentSection)
    if (this.isAnimating) {
      console.log('Animation in progress, skipping')
      return
    }
    
    if (this.currentSection > 0) {
      console.log('Moving from section', this.currentSection, 'to', this.currentSection - 1)
      this.navigateToSection(this.currentSection - 1)
    } else {
      console.log('Already at first section')
    }
  }
  
  navigateToSection(sectionIndex) {
    if (sectionIndex === this.currentSection || this.isAnimating) return
    
    if (sectionIndex < 0 || sectionIndex >= this.totalSections) return
    
    this.isAnimating = true
    this.currentSection = sectionIndex
    const targetPosition = this.positions[sectionIndex]
    
    console.log(`Going to section ${sectionIndex + 1}/${this.totalSections}`)
    
    gsap.to(this.container, {
      x: `${targetPosition.x}vw`,
      y: `${targetPosition.y}vh`,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        this.isAnimating = false
      }
    })
  }
}

// Initialize the portfolio
new HorizontalPortfolio()
