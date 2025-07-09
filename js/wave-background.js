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
     * @returns {boolean} - True if initialization was successful
     */
    init(targetSelector = '.hero-section') {
        if (this.isInitialized) {
            console.warn('Wave background already initialized');
            return true;
        }

        const target = typeof targetSelector === 'string' 
            ? document.querySelector(targetSelector) 
            : targetSelector;

        if (!target) {
            console.error('Wave background target not found:', targetSelector);
            return false;
        }

        try {
            this.createWaveBackground(target);
            this.setupIntersectionObserver();
            this.setupResponsiveHandling();
            this.isInitialized = true;

            console.log('Wave background initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize wave background:', error);
            return false;
        }
        
    }

    /**
     * Create the wave background structure
     * @param {HTMLElement} target - Target element to add waves to
     */
    createWaveBackground(target) {
        if (this.waveContainer) {
            this.waveContainer.remove();
        }

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
        
        // Force visibility immediately after creation
        this.waveContainer.style.opacity = '1';
        
        console.log('Wave background created with', this.waveContainer.children.length, 'layers');
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

    /**
     * Wait for hero content to be ready before initializing waves
     * @param {string|HTMLElement} targetSelector - Target for wave background
     * @param {number} maxRetries - Maximum number of retry attempts
     * @returns {Promise<boolean>} - Promise resolving to initialization success
     */
    async waitForHeroAndInit(targetSelector = '.hero-section', maxRetries = 20) {
        if (this.isInitialized) {
            return true;
        }

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const target = typeof targetSelector === 'string' 
                ? document.querySelector(targetSelector) 
                : targetSelector;

            if (target) {
                // Check if hero has some content (not just empty)
                const heroContent = target.querySelector('.hero-content, .profile-container, .hero-title');
                if (heroContent) {
                    console.log(`Hero content ready after ${attempt + 1} attempts, initializing waves`);
                    return this.init(targetSelector);
                }
            }

            // Wait before next attempt
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.warn('Hero content not ready after maximum retries, initializing waves anyway');
        return this.init(targetSelector);
    }

    /**
     * Verify and fix wave background visibility
     */
    verifyAndFixVisibility() {
        if (!this.waveContainer) {
            console.warn('Wave container not found, attempting re-initialization');
            this.isInitialized = false;
            this.init('.hero-section');
            return;
        }

        // Ensure wave container is visible
        if (this.waveContainer.style.display === 'none') {
            console.log('Wave container was hidden, making it visible');
            this.waveContainer.style.display = '';
        }

        // Ensure opacity is correct
        if (this.waveContainer.style.opacity === '0') {
            console.log('Wave container opacity was 0, setting to 1');
            this.waveContainer.style.opacity = '1';
        }

        // Check if waves are actually in the DOM
        const parent = this.waveContainer.parentElement;
        if (!parent) {
            console.warn('Wave container is detached from DOM, re-appending');
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.insertBefore(this.waveContainer, heroSection.firstChild);
            }
        }
    }
}

// Create global instance
window.WaveBackground = new WaveBackgroundController();

// Multiple initialization strategies to ensure waves always appear
async function initializeWaveBackground() {
    // Use the robust initialization method that waits for hero content
    const success = await window.WaveBackground.waitForHeroAndInit('.hero-section');
    
    if (!success) {
        console.warn('Wave background initialization failed, attempting fallback');
        // Fallback to immediate initialization
        window.WaveBackground.init('.hero-section');
    }
}

// Initialize based on document state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWaveBackground);
} else {
    // DOM is already loaded
    initializeWaveBackground();
}

// Fallback initialization on window load (in case anything failed)
window.addEventListener('load', async () => {
    if (!window.WaveBackground.isInitialized) {
        console.log('Fallback wave background initialization on window load');
        await initializeWaveBackground();
    }
    
    // Additional check after a short delay to ensure visibility
    setTimeout(() => {
        if (window.WaveBackground.isInitialized) {
            window.WaveBackground.verifyAndFixVisibility();
        }
    }, 1000);
});

// Periodic check to ensure waves stay visible (every 5 seconds)
setInterval(() => {
    if (window.WaveBackground && window.WaveBackground.isInitialized) {
        window.WaveBackground.verifyAndFixVisibility();
    }
}, 5000);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaveBackgroundController;
}
