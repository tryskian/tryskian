import './style.css'
import { gsap } from 'gsap'

class LShapePortfolio {
  constructor() {
    this.container = document.querySelector('.container')
    this.sections = document.querySelectorAll('.section')
    this.navItems = document.querySelectorAll('.nav-item')
    
    this.currentSection = 0
    this.totalSections = this.sections.length
    this.isAnimating = false
    
    // L-shape navigation zones
    this.verticalZone = [0, 1, 2, 3, 4] // sections 1-5
    this.horizontalZone = [4, 5, 6, 7] // sections 5-8 (5 is shared)
    
    // Smooth scrolling properties
    this.lastScrollTime = 0
    this.scrollCooldown = 200
    
    this.init()
  }
  
  init() {
    this.setupInitialState()
    this.bindEvents()
    this.updateNavigation()
  }
  
  setupInitialState() {
    // Set initial position to section 1
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
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    
    // Navigation dots click
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const sectionIndex = parseInt(e.currentTarget.dataset.section)
        this.goToSection(sectionIndex)
      })
    })
  }
  
  handleWheel(e) {
    e.preventDefault()
    
    if (this.isAnimating) return
    
    const now = Date.now()
    if (now - this.lastScrollTime < this.scrollCooldown) {
      return
    }
    
    const delta = e.deltaY || e.deltaX
    const threshold = 25
    
    if (Math.abs(delta) > threshold) {
      this.lastScrollTime = now
      
      if (delta > 0) {
        this.nextSection()
      } else {
        this.prevSection()
      }
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
      case 'ArrowDown':
      case ' ':
        e.preventDefault()
        this.nextSection()
        break
      case 'ArrowUp':
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
    
    const viewportWidth = Math.floor(window.innerWidth)
    const viewportHeight = Math.floor(window.innerHeight)
    
    let targetX = 0
    let targetY = 0
    
    // Reverse-L positioning logic
    switch(index) {
      case 0: // hero
        targetX = 0
        targetY = 0
        break
      case 1: // what i do
        targetX = -viewportWidth
        targetY = 0
        break
      case 2: // proj 1
        targetX = -viewportWidth
        targetY = -viewportHeight
        break
      case 3: // proj 2
        targetX = -viewportWidth
        targetY = -2 * viewportHeight
        break
      case 4: // archive
        targetX = -viewportWidth
        targetY = -3 * viewportHeight
        break
      case 5: // about
        targetX = -2 * viewportWidth
        targetY = -3 * viewportHeight
        break
      case 6: // say hi
        targetX = -3 * viewportWidth
        targetY = -3 * viewportHeight
        break
    }
    
    console.log(`Going to section ${index}, targetX: ${targetX}, targetY: ${targetY}`)
    
    // Animate to new position
    gsap.to(this.container, {
      x: targetX,
      y: targetY,
      duration: 1.0,
      ease: "power2.inOut", 
      onComplete: () => {
        this.isAnimating = false
      }
    })
    
    this.updateNavigation()
  }
  
  updateNavigation() {
    this.navItems.forEach((item, index) => {
      if (index === this.currentSection) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }
  
  updateActiveSection(index) {
    // Section is now active - could add any active state logic here if needed
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new LShapePortfolio()
  
  // Handle window resize with debouncing
  let resizeTimeout
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    
    resizeTimeout = setTimeout(() => {
      // Recalculate current position after resize
      portfolio.goToSection(portfolio.currentSection)
    }, 100)
  })
})
