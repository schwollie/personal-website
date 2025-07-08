// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality with proper timing
    setTimeout(() => {
        initializeAnimations();
        initializeScrollEffects();
        initializeSkillBars();
        initializeTooltips();
        initializeThemeToggle();
    }, 100);
    
    console.log('Website initialized successfully!');
});

// Initialize entrance animations - improved stability
function initializeAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.classList.add('visible');
                entry.target.dataset.animated = 'true';
                animateSkillBars(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll effects - reduced intensity
function initializeScrollEffects() {
    let lastScrollTop = 0;
    let ticking = false;
    
    const updateScrollEffects = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Subtle parallax effect for hero section
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Update last scroll position
        lastScrollTop = scrollTop;
        ticking = false;
    };
    
    const requestScrollUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// Initialize skill bar animations - prevent jumping
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.dataset.targetWidth = width;
        // Don't reset to 0% initially to prevent jumping
    });
}

// Animate skill bars when section becomes visible
function animateSkillBars(section) {
    if (section.id === 'skills') {
        const skillBars = section.querySelectorAll('.skill-bar');
        
        skillBars.forEach((bar, index) => {
            // Reset and animate
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 0.8s ease';
                bar.style.width = bar.dataset.targetWidth;
                bar.parentElement.parentElement.classList.add('animate');
            }, index * 100 + 200); // Add delay to prevent jumping
        });
    }
}

// Initialize tooltips for skill items
function initializeTooltips() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', showTooltip);
        item.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const item = event.currentTarget;
    const source = item.dataset.source;
    
    if (source) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = `Source: ${source}`;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-primary);
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = item.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        
        // Fade in tooltip
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        item.tooltip = tooltip;
    }
}

function hideTooltip(event) {
    const item = event.currentTarget;
    if (item.tooltip) {
        item.tooltip.style.opacity = '0';
        setTimeout(() => {
            if (item.tooltip && document.body.contains(item.tooltip)) {
                document.body.removeChild(item.tooltip);
            }
            item.tooltip = null;
        }, 300);
    }
}

// Initialize theme toggle (for future dark mode implementation)
function initializeThemeToggle() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);
    
    function handleThemeChange(e) {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    }
}

// Smooth scroll for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading states for external links
document.addEventListener('click', function(event) {
    if (event.target.matches('.external-link') || event.target.closest('.external-link')) {
        const link = event.target.matches('.external-link') ? event.target : event.target.closest('.external-link');
        link.classList.add('loading');
        
        // Remove loading state after a delay
        setTimeout(() => {
            link.classList.remove('loading');
        }, 2000);
    }
});

// Error handling for missing images
document.addEventListener('error', function(event) {
    if (event.target.tagName === 'IMG') {
        event.target.style.display = 'none';
        console.warn('Image failed to load:', event.target.src);
    }
}, true);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}