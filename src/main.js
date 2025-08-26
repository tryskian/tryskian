import './style.css'
import { gsap } from 'gsap'

class HorizontalPortfolio {
  constructor() {
    this.container = document.querySelector('.container')
    this.sections = document.querySelectorAll('.section')
    
    this.currentSection = 0
    this.totalSections = this.sections.length
    this.isAnimating = false
    
    // Smooth scrolling properties
    this.lastScrollTime = 0
    this.scrollCooldown = 200 // Reduce cooldown for better responsiveness
    
    this.init()
  }
  
  init() {
    this.setupInitialState()
    this.bindEvents()
  }
  
  setupInitialState() {
    // Set initial position
    gsap.set(this.container, { x: 0 })
    
    // Force exact section dimensions
    const viewportWidth = Math.floor(window.innerWidth)
    this.sections.forEach((section) => {
      section.style.width = `${viewportWidth}px`
      section.style.minWidth = `${viewportWidth}px`
      section.style.maxWidth = `${viewportWidth}px`
      section.style.flexBasis = `${viewportWidth}px`
    })
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
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
  }
  
  handleWheel(e) {
    e.preventDefault()
    
    if (this.isAnimating) return
    
    // More responsive scrolling - reduced debouncing
    const now = Date.now()
    if (now - this.lastScrollTime < this.scrollCooldown) {
      return
    }
    
    const delta = e.deltaY || e.deltaX
    const threshold = 25 // Lower threshold for more responsive scrolling
    
    if (Math.abs(delta) > threshold) {
      this.lastScrollTime = now
      
      if (delta > 0) {
        this.prevSection()
      } else {
        this.nextSection()
      }
    }
  }
  
  handleTouch() {
    if (this.isAnimating) return
    
    const threshold = 50
    const diff = this.touchStartX - this.touchEndX
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSection()
      } else {
        this.prevSection()
      }
    }
  }
  
  handleKeyDown(e) {
    if (this.isAnimating) return
    
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault()
        this.nextSection()
        break
      case 'ArrowLeft':
        e.preventDefault()
        this.prevSection()
        break
    }
  }
  
  nextSection() {
    if (this.currentSection < this.totalSections - 1) {
      this.goToSection(this.currentSection + 1)
    }
  }
  
  prevSection() {
    if (this.currentSection > 0) {
      this.goToSection(this.currentSection - 1)
    }
  }
  
  goToSection(index) {
    if (index === this.currentSection || this.isAnimating || index < 0 || index >= this.totalSections) return
    
    this.isAnimating = true
    this.currentSection = index
    
    // Calculate position with exact viewport precision
    const viewportWidth = Math.floor(window.innerWidth)
    const targetX = -index * viewportWidth
    
    console.log(`Going to section ${index}/${this.totalSections-1}, targetX: ${targetX}, viewport: ${viewportWidth}`) // Debug log
    
    // Force exact positioning before animation
    this.sections.forEach((section, i) => {
      section.style.width = `${viewportWidth}px`
      section.style.minWidth = `${viewportWidth}px`
      section.style.maxWidth = `${viewportWidth}px`
    })
    
    // Smooth but more responsive animation
    gsap.to(this.container, {
      x: targetX,
      duration: 1.0, // Slightly faster duration
      ease: "power2.inOut", 
      onComplete: () => {
        this.isAnimating = false
        // Force pixel-perfect positioning
        gsap.set(this.container, { 
          x: targetX,
          force3D: true // Ensure GPU acceleration
        })
      }
    })
    
    this.updateActiveSection(index)
  }
  
  updateActiveSection(index) {
    // Section is now active - could add any active state logic here if needed
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new HorizontalPortfolio()
  
  // Handle window resize with debouncing
  let resizeTimeout
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    
    resizeTimeout = setTimeout(() => {
      const viewportWidth = Math.floor(window.innerWidth)
      const targetX = -portfolio.currentSection * viewportWidth
      gsap.set(portfolio.container, { 
        x: targetX,
        force3D: true
      })
    }, 100)
  })
})
