/**
 * Skills controller for skill bars and tooltips
 */
class SkillsController {
    constructor() {
        this.skillBars = new Map();
        this.tooltips = new Map();
        this.skillsData = null;
    }

    async init() {
        await this.loadSkillsData();
        await this.renderSkills();
        this.initializeSkillBars();
        this.initializeTooltips();
    }

    async loadSkillsData() {
        try {
            const response = await fetch('data/skills.json');
            this.skillsData = await response.json();
        } catch (error) {
            console.error('Failed to load skills data:', error);
            this.skillsData = { skillCategories: [] };
        }
    }

    async renderSkills() {
        if (!this.skillsData) return;

        const container = document.getElementById('skills-container');
        if (!container) return;

        container.innerHTML = '';

        // Sort categories: Programming Languages, Technologies, Languages
        const categoryOrder = ['programming', 'technologies', 'languages'];
        const sortedCategories = this.skillsData.skillCategories.sort((a, b) => {
            const aIndex = categoryOrder.indexOf(a.categoryId);
            const bIndex = categoryOrder.indexOf(b.categoryId);
            return aIndex - bIndex;
        });

        sortedCategories.forEach(category => {
            const categoryElement = this.createSkillCategory(category);
            container.appendChild(categoryElement);
        });
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
        
        // Add language-skill class for language category
        if (categoryId === 'languages') {
            skillDiv.className = 'skill-item language-skill';
        } else {
            skillDiv.className = 'skill-item';
        }
        
        skillDiv.setAttribute('data-source', skill.source);

        // Skill name
        const nameSpan = document.createElement('span');
        nameSpan.className = 'skill-name';
        nameSpan.textContent = skill.name;
        skillDiv.appendChild(nameSpan);

        // For languages, add both percentage bar and skill level label
        if (categoryId === 'languages') {
            // Add percentage bar for languages too
            const levelDiv = document.createElement('div');
            levelDiv.className = 'skill-level';
            
            const barDiv = document.createElement('div');
            barDiv.className = 'skill-bar';
            barDiv.style.width = `${skill.percentage}%`;
            levelDiv.appendChild(barDiv);
            skillDiv.appendChild(levelDiv);

            // Add skill level label if available
            if (skill.skillLevel) {
                const labelSpan = document.createElement('span');
                labelSpan.className = 'skill-level-label';
                labelSpan.textContent = skill.skillLevel;
                skillDiv.appendChild(labelSpan);
            }
        } else {
            // For programming and technologies, just show percentage bar
            const levelDiv = document.createElement('div');
            levelDiv.className = 'skill-level';
            
            const barDiv = document.createElement('div');
            barDiv.className = 'skill-bar';
            barDiv.style.width = `${skill.percentage}%`;
            levelDiv.appendChild(barDiv);
            skillDiv.appendChild(levelDiv);
        }

        return skillDiv;
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