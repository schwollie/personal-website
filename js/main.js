/**
 * Main application controller
 * Handles initialization and coordination of all modules
 */
class WebsiteController {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.lastViewportWidth = window.innerWidth;
        this.resizeTimeout = null;
        // Bind methods to maintain context
        this.handleViewportChange = this.handleViewportChange.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Initialize modules in order
            this.modules.animations = new AnimationController();
            this.modules.sections = new SectionController();
            this.modules.skills = new SkillsController();
            this.modules.education = new EducationController();
            this.modules.experience = new ExperienceController();
            this.modules.engagement = new EngagementController();
            this.modules.ui = new UIController();

            // Start all modules
            await Promise.all([
                this.modules.animations.init(),
                this.modules.sections.init(),
                this.modules.skills.init(),
                this.modules.education.init(),
                this.modules.experience.init(),
                this.modules.engagement.init(),
                this.modules.ui.init()
            ]);

            this.initializeResponsiveHandling();
            this.isInitialized = true;
            console.log('Website initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize website:', error);
        }
    }

    initializeResponsiveHandling() {
        window.addEventListener('resize', this.onResize);
    }

    onResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(this.handleViewportChange, 250);
    }

    handleViewportChange() {
        const currentWidth = window.innerWidth;
        const widthDifference = Math.abs(currentWidth - this.lastViewportWidth);
        
        // If viewport width changed significantly (more than 50px), reload sections
        if (widthDifference > 50) {
            console.log('Significant viewport change detected, reloading sections...');
            this.reloadSections();
            this.lastViewportWidth = currentWidth;
        }
    }

    async reloadSections() {
        try {
            // Close all expanded sections first
            if (this.modules.sections) {
                this.modules.sections.sections.forEach((sectionData, id) => {
                    if (sectionData.isExpanded) {
                        this.modules.sections.closeSection(id);
                    }
                });
            }

            // Wait a bit for sections to close
            await new Promise(resolve => setTimeout(resolve, 300));

            // Reinitialize content modules
            const contentModules = ['skills', 'education', 'experience', 'engagement'];
            
            for (const moduleName of contentModules) {
                const module = this.modules[moduleName];
                if (module && module.init) {
                    await module.init();
                }
            }
            
            console.log('Sections reloaded successfully');
        } catch (error) {
            console.error('Failed to reload sections:', error);
        }
    }

    destroy() {
        // Clear any pending timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        // Remove event listeners
        window.removeEventListener('resize', this.onResize);

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
    window.websiteController = new WebsiteController();
    window.websiteController.init();
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