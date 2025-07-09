/**
 * Section controller for expandable sections
 * Handles all section toggle functionality
 */
class SectionController {
    constructor() {
        this.sections = new Map();
        this.animationDelay = 150;
    }

    async init() {
        this.initializeSections();
        this.attachEventListeners();
        this.setupUrlHandling();
    }

    initializeSections() {
        const sections = document.querySelectorAll('.expandable-section');
        
        sections.forEach(section => {
            section.classList.remove('expanded');
            const content = section.querySelector('.section-content');
            const header = section.querySelector('.section-header');
            
            if (content) {
                content.style.display = 'none';
                content.style.opacity = '0';
            }
            
            if (header) {
                header.setAttribute('aria-expanded', 'false');
                header.setAttribute('tabindex', '0');
                header.setAttribute('role', 'button');
            }

            this.sections.set(section.id, {
                element: section,
                content,
                header,
                isExpanded: false
            });
        });
    }

    attachEventListeners() {
        this.sections.forEach((sectionData) => {
            if (sectionData.header) {
                // Click handler
                sectionData.header.addEventListener('click', () => {
                    this.toggleSection(sectionData.element.id);
                });

                // Keyboard handler
                sectionData.header.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this.toggleSection(sectionData.element.id);
                    }
                });
            }
        });
    }

    setupUrlHandling() {
        // Handle URL hash on load
        window.addEventListener('load', () => {
            const hash = window.location.hash.substring(1);
            if (hash && this.sections.has(hash)) {
                setTimeout(() => {
                    this.openSection(hash);
                }, 500);
            }
        });
    }

    toggleSection(sectionId) {
        const sectionData = this.sections.get(sectionId);
        if (!sectionData) return;

        if (sectionData.isExpanded) {
            this.closeSection(sectionId);
        } else {
            this.openSection(sectionId);
        }
    }

    openSection(sectionId) {
        const sectionData = this.sections.get(sectionId);
        if (!sectionData || sectionData.isExpanded) return;

        // Close other sections first with smooth transition
        const openSections = [];
        this.sections.forEach((data, id) => {
            if (id !== sectionId && data.isExpanded) {
                openSections.push(id);
            }
        });

        // Close other sections smoothly
        openSections.forEach(id => this.closeSection(id));

        const { element, content, header } = sectionData;
        
        // Wait a bit for other sections to start closing, then open this one
        setTimeout(() => {
            element.classList.add('expanded');
            sectionData.isExpanded = true;

            if (content) {
                content.style.display = 'block';
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }

            if (header) {
                header.querySelector('.toggle-icon').classList.add('fa-chevron-up');
                header.querySelector('.toggle-icon').classList.remove('fa-chevron-down');
                header.setAttribute('aria-expanded', 'true');
            }

            // Update URL
            this.updateUrl(sectionId);

            // Smooth scroll to the section after content is visible
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 200);

            // Trigger animations
            setTimeout(() => {
                this.triggerSectionAnimations(element);
            }, 300);
        }, openSections.length > 0 ? 150 : 0);
    }

    closeSection(sectionId) {
        const sectionData = this.sections.get(sectionId);
        if (!sectionData || !sectionData.isExpanded) return;

        const { element, content, header } = sectionData;
        
        element.classList.remove('expanded');
        sectionData.isExpanded = false;

        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';
            content.style.maxHeight = '0px';
            
            setTimeout(() => {
                if (!sectionData.isExpanded) {
                    content.style.display = 'none';
                }
            }, 300);
        }

        if (header) {
            header.setAttribute('aria-expanded', 'false');
            const icon = header.querySelector('.toggle-icon');
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    }

    triggerSectionAnimations(section) {
        const animators = {
            education: () => window.websiteController?.modules.education?.animateEducation(section),
            experience: () => window.websiteController?.modules.experience?.animateExperience(section),
            skills: () => window.websiteController?.modules.skills?.animateSkills(section),
            engagement: () => window.websiteController?.modules.engagement?.animateEngagement(section)
        };

        const animator = animators[section.id];
        if (animator) {
            animator();
        }
    }

    updateUrl(sectionId) {
        if (history.replaceState) {
            history.replaceState(null, null, `#${sectionId}`);
        }
    }

    destroy() {
        this.sections.clear();
    }
}