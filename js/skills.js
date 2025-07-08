/**
 * Skills controller for skill bars and tooltips
 */
class SkillsController {
    constructor() {
        this.skillBars = new Map();
        this.tooltips = new Map();
    }

    async init() {
        this.initializeSkillBars();
        this.initializeTooltips();
    }

    initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        skillBars.forEach(bar => {
            const width = bar.style.width;
            this.skillBars.set(bar, {
                element: bar,
                targetWidth: width,
                animated: false
            });
        });
    }

    initializeTooltips() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.showTooltip(e));
            item.addEventListener('mouseleave', (e) => this.hideTooltip(e));
        });
    }

    animateSkills(section) {
        if (section.id !== 'skills') return;

        const skillBars = section.querySelectorAll('.skill-bar');
        
        skillBars.forEach((bar, index) => {
            const barData = this.skillBars.get(bar);
            if (!barData || barData.animated) return;

            // Reset and animate
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 0.8s ease';
                bar.style.width = barData.targetWidth;
                barData.animated = true;
                
                // Add bounce effect
                setTimeout(() => {
                    const item = bar.closest('.skill-item');
                    if (item) {
                        item.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                        }, 100);
                    }
                }, 400);
            }, index * 100 + 200);
        });
    }

    showTooltip(event) {
        const item = event.currentTarget;
        const source = item.dataset.source;
        
        if (!source) return;

        const tooltip = Utils.createElement('div', 'tooltip', `Source: ${source}`);
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-primary);
            color: var(--background);
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            border: 1px solid var(--border);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = item.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
        });
        
        this.tooltips.set(item, tooltip);
    }

    hideTooltip(event) {
        const item = event.currentTarget;
        const tooltip = this.tooltips.get(item);
        
        if (!tooltip) return;

        tooltip.style.opacity = '0';
        
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
            this.tooltips.delete(item);
        }, 300);
    }

    destroy() {
        this.skillBars.clear();
        this.tooltips.forEach(tooltip => {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
        });
        this.tooltips.clear();
    }
}