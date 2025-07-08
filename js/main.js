/**
 * Main application controller
 * Handles initialization and coordination of all modules
 */
class WebsiteController {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Initialize modules in order
            this.modules.animations = new AnimationController();
            this.modules.sections = new SectionController();
            this.modules.skills = new SkillsController();
            this.modules.ui = new UIController();

            // Start all modules
            await Promise.all([
                this.modules.animations.init(),
                this.modules.sections.init(),
                this.modules.skills.init(),
                this.modules.ui.init()
            ]);

            this.isInitialized = true;
            console.log('Website initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize website:', error);
        }
    }

    destroy() {
        Object.values(this.modules).forEach(module => {
            if (module.destroy) module.destroy();
        });
        this.modules = {};
        this.isInitialized = false;
    }
}

// Global utilities
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.websiteController = new WebsiteController();
        window.websiteController.init();
    }, 100);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

// Error handling for missing images
document.addEventListener('error', (event) => {
    if (event.target.tagName === 'IMG') {
        event.target.style.display = 'none';
        console.warn('Image failed to load:', event.target.src);
    }
}, true);