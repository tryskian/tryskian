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
    this.setupLightbox()
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
  
  setupLightbox() {
    // Mock project data (replace with your real project data)
    this.projects = [
      {
        id: 'proj1',
        title: 'Global Recognition Platform',
        description: 'A global recognition platform reimagined through immersive identity and spatial storytelling—culminating in a custom-designed 3D trophy that honored legacy through form.',
        images: [
          'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600',
          'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=600',
          'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=600'
        ]
      },
      {
        id: 'proj2',
        title: 'Digital Experience Project',
        description: 'An innovative digital experience that bridges the gap between traditional design and modern technology.',
        images: [
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600',
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600',
          'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600'
        ]
      },
      {
        id: 'archive',
        title: 'Selected Works Archive',
        description: 'An evolving showcase of creative experiments, client collaborations, and passion projects.',
        images: [
          'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600',
          'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=600'
        ]
      }
    ]
    
    this.currentProject = null
    this.currentImageIndex = 0
    
    // Get lightbox elements
    this.lightbox = document.getElementById('lightbox')
    this.lightboxImg = document.getElementById('lightbox-img')
    this.lightboxTitle = document.getElementById('lightbox-title')
    this.lightboxDescription = document.getElementById('lightbox-description')
    this.lightboxClose = document.getElementById('lightbox-close')
    this.lightboxDots = document.getElementById('lightbox-dots')
    
    // Add click listeners to placeholder images
    this.setupImageClickListeners()
    
    // Lightbox controls
    this.lightboxClose.addEventListener('click', () => this.closeLightbox())
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (this.lightbox.classList.contains('active')) {
        switch(e.key) {
          case 'Escape':
            this.closeLightbox()
            break
          case 'ArrowLeft':
            this.prevImage()
            break
          case 'ArrowRight':
            this.nextImage()
            break
        }
      }
    })
  }
  
  setupImageClickListeners() {
    // Project 1 images
    const proj1Images = document.querySelectorAll('.proj-1 .placeholder-image')
    proj1Images.forEach((img, index) => {
      img.addEventListener('click', () => this.openLightbox('proj1', index))
    })
    
    // Project 2 images  
    const proj2Images = document.querySelectorAll('.proj-2 .placeholder-image')
    proj2Images.forEach((img, index) => {
      img.addEventListener('click', () => this.openLightbox('proj2', index))
    })
    
    // Archive images
    const archiveImages = document.querySelectorAll('.archive .placeholder-image')
    archiveImages.forEach((img, index) => {
      img.addEventListener('click', () => this.openLightbox('archive', index))
    })
  }
  
  openLightbox(projectId, imageIndex = 0) {
    this.currentProject = this.projects.find(p => p.id === projectId)
    this.currentImageIndex = imageIndex
    
    if (this.currentProject) {
      this.updateLightboxContent()
      this.lightbox.classList.add('active')
      document.body.style.overflow = 'hidden'
    }
  }
  
  closeLightbox() {
    this.lightbox.classList.remove('active')
    document.body.style.overflow = ''
    this.currentProject = null
    this.currentImageIndex = 0
  }
  
  prevImage() {
    if (this.currentProject && this.currentProject.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex > 0 
        ? this.currentImageIndex - 1 
        : this.currentProject.images.length - 1
      this.updateLightboxContent()
    }
  }
  
  nextImage() {
    if (this.currentProject && this.currentProject.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex < this.currentProject.images.length - 1
        ? this.currentImageIndex + 1 
        : 0
      this.updateLightboxContent()
    }
  }
  
  updateLightboxContent() {
    if (this.currentProject) {
      this.lightboxImg.src = this.currentProject.images[this.currentImageIndex]
      this.lightboxTitle.textContent = this.currentProject.title
      this.lightboxDescription.textContent = this.currentProject.description
      
      // Update dots
      this.updateLightboxDots()
    }
  }
  
  updateLightboxDots() {
    if (!this.currentProject) return
    
    // Clear existing dots
    this.lightboxDots.innerHTML = ''
    
    // Create dots for each image
    this.currentProject.images.forEach((_, index) => {
      const dot = document.createElement('div')
      dot.className = `lightbox-dot ${index === this.currentImageIndex ? 'active' : ''}`
      dot.addEventListener('click', () => {
        this.currentImageIndex = index
        this.updateLightboxContent()
      })
      this.lightboxDots.appendChild(dot)
    })
    
    // Hide dots if only one image
    if (this.currentProject.images.length <= 1) {
      this.lightboxDots.style.display = 'none'
    } else {
      this.lightboxDots.style.display = 'flex'
    }
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
