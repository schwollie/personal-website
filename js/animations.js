// Advanced animations and visual effects
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.reducedMotion = false;
        
        this.initializeIntersectionObservers();
        this.initializeParallaxEffects();
        this.initializePerformanceMonitoring();
    }
    
    initializeIntersectionObservers() {
        // Fade in animation observer
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateFadeIn(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Slide in animation observer
        const slideInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSlideIn(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -30px 0px'
        });
        
        // Counter animation observer
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.observers.set('fadeIn', fadeInObserver);
        this.observers.set('slideIn', slideInObserver);
        this.observers.set('counter', counterObserver);
        
        // Observe elements after DOM is ready
        setTimeout(() => {
            this.observeElements();
        }, 100);
    }
    
    observeElements() {
        // Elements for fade in animation
        const fadeElements = document.querySelectorAll('.section, .experience-card, .engagement-card');
        fadeElements.forEach(el => {
            this.observers.get('fadeIn').observe(el);
        });
        
        // Elements for slide in animation
        const slideElements = document.querySelectorAll('.timeline-item, .skill-category');
        slideElements.forEach(el => {
            this.observers.get('slideIn').observe(el);
        });
        
        // Elements with counters
        const counterElements = document.querySelectorAll('.stat-number, .skill-level');
        counterElements.forEach(el => {
            this.observers.get('counter').observe(el);
        });
    }
    
    animateFadeIn(element) {
        if (element.dataset.animated || this.reducedMotion) return;
        
        element.classList.add('visible');
        element.dataset.animated = 'true';
    }
    
    animateSlideIn(element) {
        if (element.dataset.animated || this.reducedMotion) return;
        
        element.classList.add('animate');
        element.dataset.animated = 'true';
    }
    
    animateCounters(element) {
        if (element.dataset.animated || this.reducedMotion) return;
        
        const counters = element.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            this.animateNumber(counter);
        });
        
        element.dataset.animated = 'true';
    }
    
    animateNumber(element) {
        const target = parseFloat(element.dataset.count) || parseFloat(element.textContent);
        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };
        
        updateNumber();
    }
    
    initializeParallaxEffects() {
        if (this.reducedMotion) return;
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax - subtle effect
            const hero = document.querySelector('.hero-section');
            if (hero) {
                const rate = scrolled * -0.1;
                hero.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
            
            // Profile image rotation - slower
            const profileRing = document.querySelector('.profile-ring');
            if (profileRing) {
                const rotation = scrolled * 0.2;
                profileRing.style.transform = `rotate(${rotation}deg)`;
            }
            
            ticking = false;
        };
        
        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        this.requestParallaxUpdate = requestParallaxUpdate;
    }
    
    initializePerformanceMonitoring() {
        // Monitor animation performance
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Reduce animation quality if FPS is too low
                if (fps < 30) {
                    this.reducedMotion = true;
                    document.documentElement.style.setProperty('--animation-duration', '0.1s');
                } else {
                    this.reducedMotion = false;
                    document.documentElement.style.setProperty('--animation-duration', '0.3s');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        if (window.requestAnimationFrame) {
            measureFPS();
        }
        
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            this.reducedMotion = true;
            document.documentElement.classList.add('reduced-motion');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            if (e.matches) {
                document.documentElement.classList.add('reduced-motion');
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        });
    }
    
    // Public methods for manual animation triggering
    triggerAnimation(element, animationType) {
        if (this.reducedMotion) return;
        
        switch (animationType) {
            case 'fadeIn':
                this.animateFadeIn(element);
                break;
            case 'slideIn':
                this.animateSlideIn(element);
                break;
            case 'pulse':
                element.style.animation = 'pulse 0.6s ease';
                break;
        }
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove event listeners
        if (this.requestParallaxUpdate) {
            window.removeEventListener('scroll', this.requestParallaxUpdate);
        }
    }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        window.animationController = new AnimationController();
    }, 100);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}