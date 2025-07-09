/**
 * Skills controller for skill bars and tooltips
 */
class SkillsController {
    constructor() {
        this.skillsData = null;
        this.activeTooltip = null;
        this.tooltipTimeout = null;
        // Bind methods to maintain context
        this.cleanupAllTooltips = this.cleanupAllTooltips.bind(this);
    }

    async init() {
        console.log('SkillsController initializing...');
        await this.loadSkillsData();
        await this.renderSkills();
        
        // Wait a bit for DOM to be updated, then initialize
        setTimeout(() => {
            this.initializeTooltips();
            console.log('SkillsController initialized successfully');
        }, 100);
    }

    async loadSkillsData() {
        try {
            console.log('Loading skills data...');
            const response = await fetch('data/skills.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.skillsData = await response.json();
            console.log('Skills data loaded:', this.skillsData);
        } catch (error) {
            console.error('Failed to load skills data:', error);
            this.skillsData = { skillCategories: [] };
        }
    }

    async renderSkills() {
        if (!this.skillsData || !this.skillsData.skillCategories || this.skillsData.skillCategories.length === 0) {
            console.error('No skills data available');
            return;
        }

        const container = document.getElementById('skills-container');
        if (!container) {
            console.error('Skills container not found');
            return;
        }

        console.log('Rendering skills to container:', container);
        container.innerHTML = '';

        // Sort categories: Programming Languages, Technologies, Languages
        const categoryOrder = ['programming', 'technologies', 'languages'];
        const sortedCategories = this.skillsData.skillCategories.sort((a, b) => {
            const aIndex = categoryOrder.indexOf(a.categoryId);
            const bIndex = categoryOrder.indexOf(b.categoryId);
            return aIndex - bIndex;
        });

        console.log('Sorted categories:', sortedCategories);

        sortedCategories.forEach(category => {
            const categoryElement = this.createSkillCategory(category);
            container.appendChild(categoryElement);
        });

        console.log('Skills rendered successfully');
    }

    createSkillCategory(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';

        const title = document.createElement('h3');
        title.textContent = category.categoryName;
        categoryDiv.appendChild(title);

        const skillsList = document.createElement('div');
        skillsList.className = 'skills-list';

        // Sort skills by percentage (descending)
        const sortedSkills = [...category.skills].sort((a, b) => b.percentage - a.percentage);

        sortedSkills.forEach(skill => {
            const skillElement = this.createSkillItem(skill, category.categoryId);
            skillsList.appendChild(skillElement);
        });

        categoryDiv.appendChild(skillsList);
        return categoryDiv;
    }

    createSkillItem(skill, categoryId) {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-item';
        skillDiv.setAttribute('data-source', skill.source);

        const skillHeaderDiv = document.createElement('div');
        skillHeaderDiv.className = 'skill-item-header';

        // Skill name
        const nameSpan = document.createElement('span');
        nameSpan.className = 'skill-name';
        nameSpan.textContent = skill.name;
        skillHeaderDiv.appendChild(nameSpan);

        // Add skill level label if available
        if (skill.skillLevel) {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'skill-level-label';
            labelSpan.textContent = skill.skillLevel;
            skillHeaderDiv.appendChild(labelSpan);
        }
        
        skillDiv.appendChild(skillHeaderDiv);

        const levelDiv = document.createElement('div');
        levelDiv.className = 'skill-level';
        
        const barDiv = document.createElement('div');
        barDiv.className = 'skill-bar';
        barDiv.style.width = '0%';
        barDiv.setAttribute('data-percentage', skill.percentage);
        levelDiv.appendChild(barDiv);
        skillDiv.appendChild(levelDiv);

        return skillDiv;
    }

    animateSkills(section) {
        const skillBars = section.querySelectorAll('.skill-bar');
        skillBars.forEach((skillBar, index) => {
            if (!skillBar.dataset.animated) {
                setTimeout(() => {
                    const percentage = skillBar.getAttribute('data-percentage');
                    skillBar.style.width = `${percentage}%`;
                    skillBar.dataset.animated = 'true';
                }, index * 50); // Stagger animation
            }
        });
    }

    resetSkillsAnimation(section) {
        const skillBars = section.querySelectorAll('.skill-bar');
        skillBars.forEach(skillBar => {
            skillBar.style.width = '0%';
            delete skillBar.dataset.animated;
        });
    }

    initializeTooltips() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.showTooltip(e));
            item.addEventListener('mouseleave', (e) => this.hideTooltip(e));
        });

        // Clean up tooltips on scroll and resize
        window.addEventListener('scroll', this.cleanupAllTooltips, { passive: true });
        window.addEventListener('resize', this.cleanupAllTooltips, { passive: true });
    }

    cleanupAllTooltips() {
        if (this.activeTooltip) {
            if (document.body.contains(this.activeTooltip)) {
                document.body.removeChild(this.activeTooltip);
            }
            this.activeTooltip = null;
        }
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }
    }

    showTooltip(event) {
        const item = event.currentTarget;
        const source = item.dataset.source;
        
        if (!source) return;

        // Immediately clean up any existing tooltips
        this.cleanupAllTooltips();

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
            transition: opacity 0.2s ease-in-out;
            border: 1px solid var(--border);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        `;
        
        document.body.appendChild(tooltip);
        this.activeTooltip = tooltip;
        
        const rect = item.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // Position tooltip with scroll offset
        let top = rect.top + scrollY - tooltip.offsetHeight - 5;
        let left = rect.left + scrollX;

        // Adjust if it goes off-screen
        if (top < scrollY) { // If tooltip is above the viewport
            top = rect.bottom + scrollY + 5;
        }
        if (left + tooltip.offsetWidth > window.innerWidth + scrollX) {
            left = rect.right + scrollX - tooltip.offsetWidth;
        }
        if (left < scrollX) {
            left = scrollX + 5;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        
        requestAnimationFrame(() => {
            if (this.activeTooltip === tooltip) {
                tooltip.style.opacity = '1';
            }
        });
    }

    hideTooltip(event) {
        if (this.activeTooltip) {
            this.activeTooltip.style.opacity = '0';
            this.tooltipTimeout = setTimeout(() => {
                this.cleanupAllTooltips();
            }, 200); // Matches the transition duration
        }
    }

    destroy() {
        // Clean up all tooltips and listeners
        this.cleanupAllTooltips();
        window.removeEventListener('scroll', this.cleanupAllTooltips);
        window.removeEventListener('resize', this.cleanupAllTooltips);
    }
}