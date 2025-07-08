/**
 * UI controller for general UI interactions and theme management
 */
class UIController {
    constructor() {
        this.theme = 'light';
    }

    async init() {
        this.initializeTheme();
        this.initializeExternalLinks();
    }

    initializeTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    initializeExternalLinks() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('.external-link');
            if (link) {
                this.handleExternalLink(link);
            }
        });
    }

    handleExternalLink(link) {
        link.classList.add('loading');
        
        setTimeout(() => {
            link.classList.remove('loading');
        }, 2000);
    }

    destroy() {
        // Nothing to cleanup for UI controller
    }
}