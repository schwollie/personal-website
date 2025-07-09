/**
 * UI controller for general UI interactions and theme management
 */
class UIController {
    constructor() {
        this.theme = 'light';
    }

    async init() {
        this.initializeTheme();
        this.initializeThemeToggle();
        this.initializeExternalLinks();
    }

    initializeTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(initialTheme);
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Set initial icon
        this.updateThemeIcon();

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        if (this.theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
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