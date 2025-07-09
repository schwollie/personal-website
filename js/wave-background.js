/**
 * Wave Background Controller
 * Handles the creation and management of animated wave background
 */

class WaveBackgroundController {
    constructor() {
        this.waveContainer = null;
        this.isInitialized = false;
        this.resizeTimeout = null;
        this.intersectionObserver = null;
    }

    /**
     * Initialize the wave background
     * @param {string|HTMLElement} targetSelector - CSS selector or DOM element where waves should be added
     */
    init(targetSelector = '.hero-section') {
        if (this.isInitialized) {
            console.warn('Wave background already initialized');
            return;
        }

        const target = typeof targetSelector === 'string' 
            ? document.querySelector(targetSelector) 
            : targetSelector;

        if (!target) {
            console.error('Wave background target not found:', targetSelector);
            return;
        }

        this.createWaveBackground(target);
        this.setupIntersectionObserver();
        this.setupResponsiveHandling();
        this.isInitialized = true;

        console.log('Wave background initialized successfully');
    }

    /**
     * Create the wave background structure
     * @param {HTMLElement} target - Target element to add waves to
     */
    createWaveBackground(target) {
        // Ensure target has relative positioning
        const targetStyle = window.getComputedStyle(target);
        if (targetStyle.position === 'static') {
            target.style.position = 'relative';
        }

        // Create wave container
        this.waveContainer = document.createElement('div');
        this.waveContainer.className = 'wave-background';
        this.waveContainer.setAttribute('aria-hidden', 'true');

        // Create 5 wave layers for varied animation
        for (let i = 1; i <= 5; i++) {
            const waveLayer = document.createElement('div');
            waveLayer.className = 'wave-layer';
            waveLayer.style.animationDelay = `${(i - 1) * 0.5}s`;
            this.waveContainer.appendChild(waveLayer);
        }

        // Insert at the beginning of target to ensure it's behind content
        target.insertBefore(this.waveContainer, target.firstChild);
    }

    /**
     * Setup intersection observer for performance optimization
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            return; // Fallback for older browsers
        }

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === this.waveContainer) {
                    this.toggleAnimations(entry.isIntersecting);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        if (this.waveContainer) {
            this.intersectionObserver.observe(this.waveContainer);
        }
    }

    /**
     * Toggle wave animations based on visibility
     * @param {boolean} isVisible - Whether the waves are visible
     */
    toggleAnimations(isVisible) {
        if (!this.waveContainer) return;

        const waveLayers = this.waveContainer.querySelectorAll('.wave-layer');
        waveLayers.forEach(layer => {
            if (isVisible) {
                layer.style.animationPlayState = 'running';
            } else {
                layer.style.animationPlayState = 'paused';
            }
        });
    }

    /**
     * Setup responsive handling
     */
    setupResponsiveHandling() {
        const handleResize = () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }

            this.resizeTimeout = setTimeout(() => {
                this.updateWavePositioning();
            }, 150);
        };

        window.addEventListener('resize', handleResize);
        
        // Also listen for orientation changes on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateWavePositioning();
            }, 300);
        });
    }

    /**
     * Update wave positioning for different screen sizes
     */
    updateWavePositioning() {
        if (!this.waveContainer) return;

        const waveLayers = this.waveContainer.querySelectorAll('.wave-layer');
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust wave positioning based on viewport
        waveLayers.forEach((layer, index) => {
            // Reset any custom positioning
            layer.style.transform = '';
            
            // Add subtle adjustments for very wide or very narrow screens
            if (viewportWidth > 1920) {
                layer.style.transform = 'scale(1.1)';
            } else if (viewportWidth < 480) {
                layer.style.transform = 'scale(0.9)';
            }
        });
    }

    /**
     * Update wave theme based on current theme
     * @param {string} theme - 'light' or 'dark'
     */
    updateTheme(theme) {
        if (!this.waveContainer) return;

        const body = document.body;
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
        }
    }

    /**
     * Destroy the wave background and clean up
     */
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }

        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }

        if (this.waveContainer && this.waveContainer.parentNode) {
            this.waveContainer.parentNode.removeChild(this.waveContainer);
        }

        this.waveContainer = null;
        this.isInitialized = false;

        console.log('Wave background destroyed');
    }

    /**
     * Reinitialize waves (useful for dynamic content changes)
     * @param {string|HTMLElement} targetSelector - Target for wave background
     */
    reinit(targetSelector) {
        this.destroy();
        setTimeout(() => {
            this.init(targetSelector);
        }, 100);
    }
}

// Create global instance
window.WaveBackground = new WaveBackgroundController();

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.WaveBackground.init('.hero-section');
    });
} else {
    // DOM is already loaded
    window.WaveBackground.init('.hero-section');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaveBackgroundController;
}
