import './style.css'
import { gsap } from 'gsap'

class HorizontalPortfolio {
  constructor() {
    this.container = document.querySelector('.container')
    this.sections = document.querySelectorAll('.section')
    
    this.currentSection = 0
    this.totalSections = this.sections.length
    this.isAnimating = false
    
    // L-shaped section positioning (matches CSS positions)
    this.positions = {
      0: { x: 0, y: 0 },       // home: top: 0vh, left: 0vw
      1: { x: -100, y: 0 },    // what-i-do: top: 0vh, left: 100vw  
      2: { x: -100, y: -100 }, // project-1: top: 100vh, left: 100vw
      3: { x: -200, y: -100 }, // project-2: top: 100vh, left: 200vw
      4: { x: -300, y: -100 }, // project-3: top: 100vh, left: 300vw
      5: { x: -400, y: -100 }, // about: top: 100vh, left: 400vw
      6: { x: -500, y: -100 }  // contact: top: 100vh, left: 500vw
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
    
    // Check if we're in the PROJECT sections (indices 2-4)
    const isProjectSection = this.currentSection >= 2 && this.currentSection <= 4
    
    // Add threshold to prevent small scroll events from triggering navigation
    const deltaY = e.deltaY
    const deltaX = e.deltaX
    const threshold = 50
    
    console.log(`Scroll detected - deltaY: ${deltaY}, deltaX: ${deltaX}, section: ${this.currentSection}`)
    
    if (isProjectSection) {
      // In PROJECT sections: horizontal scroll stays in sections 3-5, vertical scroll navigates out
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        // Horizontal scroll - handle project timeline navigation
        console.log('Project horizontal scroll:', deltaX > 0 ? 'right' : 'left')
        this.handleProjectScroll(deltaX)
        return
      }
    }
    
    // Regular vertical navigation for all sections (including project vertical scroll to exit)
    if (Math.abs(deltaY) < threshold) {
      console.log('Scroll too small, ignoring')
      return
    }
    
    this.lastScrollTime = now
    
    // Inverted scroll direction (your working version)
    if (deltaY > 0) {
      console.log('Scroll DOWN -> navigatePrevious() (to lower section)')
      this.navigatePrevious()
    } else {
      console.log('Scroll UP -> navigateNext() (to higher section)')  
      this.navigateNext()
    }
  }
  
  handleProjectScroll(deltaX) {
    // Handle horizontal scrolling within PROJECT sections (2-4)
    if (deltaX > 0 && this.currentSection < 4) {
      // Scroll right - move to next project section
      console.log('Project scroll right: section', this.currentSection, '→', this.currentSection + 1)
      this.navigateToSection(this.currentSection + 1)
    } else if (deltaX < 0 && this.currentSection > 2) {
      // Scroll left - move to previous project section  
      console.log('Project scroll left: section', this.currentSection, '→', this.currentSection - 1)
      this.navigateToSection(this.currentSection - 1)
    } else {
      console.log('Project horizontal scroll at boundary')
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

    // Navigation flow: 0→1→2→3→4→5→6 (vertical→horizontal→vertical)
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
    
    // Navigation flow: 6→5→4→3→2→1→0 (vertical→horizontal→vertical)
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
