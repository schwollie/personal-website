/**
 * Animation controller for scroll-based and entrance animations
 */
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.reducedMotion = false;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        this.checkMotionPreferences();
        this.initializeObservers();
        this.initializeParallax();
        this.initializeHeroAnimations();
        
        this.isInitialized = true;
    }

    checkMotionPreferences() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = prefersReducedMotion.matches;
        
        if (this.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            document.documentElement.classList.toggle('reduced-motion', e.matches);
        });
    }

    initializeObservers() {
        // Counter observer for hero stats
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Section visibility observer
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSection(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.observers.set('counter', counterObserver);
        this.observers.set('section', sectionObserver);

        // Observe elements
        setTimeout(() => this.observeElements(), 100);
    }

    observeElements() {
        // Observe hero stats for counter animation
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            this.observers.get('counter').observe(heroStats);
        }

        // Observe sections for visibility animations
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            this.observers.get('section').observe(section);
        });
    }

    initializeHeroAnimations() {
        // Trigger hero stats animation immediately
        setTimeout(() => {
            const heroStats = document.querySelector('.hero-stats');
            if (heroStats) {
                this.animateCounters(heroStats);
            }
        }, 1000);
    }

    animateCounters(container) {
        if (container.dataset.animated || this.reducedMotion) return;

        const counters = container.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            if (!counter.dataset.animated) {
                this.animateNumber(counter);
                counter.dataset.animated = 'true';
            }
        });

        container.dataset.animated = 'true';
    }

    animateNumber(element) {
        const targetValue = element.dataset.count || element.textContent;
        const target = parseFloat(targetValue);

        if (isNaN(target)) {
            element.textContent = targetValue;
            return;
        }

        const duration = parseInt(element.dataset.duration) || 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };
        
        updateNumber();
    }

    animateSection(section) {
        if (section.dataset.animated || this.reducedMotion) return;
        
        section.classList.add('visible');
        section.dataset.animated = 'true';
    }

    initializeParallax() {
        if (this.reducedMotion) return;

        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const hero = document.querySelector('.hero-section');
            if (hero) {
                const rate = scrolled * -0.3;
                hero.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
            
            // Profile ring rotation
            const profileRing = document.querySelector('.profile-ring');
            if (profileRing) {
                const rotation = scrolled * 0.2;
                profileRing.style.transform = `rotate(${rotation}deg)`;
            }
            
            ticking = false;
        };
        
        const requestParallaxUpdate = Utils.debounce(() => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, 16);
        
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        this.parallaxHandler = requestParallaxUpdate;
    }

    triggerAnimation(element, animationType) {
        if (this.reducedMotion) return;
        
        switch (animationType) {
            case 'fadeIn':
                this.animateSection(element);
                break;
            case 'pulse':
                element.style.animation = 'pulse 0.6s ease';
                break;
        }
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        if (this.parallaxHandler) {
            window.removeEventListener('scroll', this.parallaxHandler);
        }
        
        this.isInitialized = false;
    }
}