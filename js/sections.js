// Section toggle functionality
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const isExpanded = section.classList.contains('expanded');
    
    // Toggle the clicked section
    if (isExpanded) {
        closeSection(section);
    } else {
        // Close all other sections first
        document.querySelectorAll('.section.expanded').forEach(openSection => {
            if (openSection.id !== sectionId) {
                closeSection(openSection);
            }
        });
        openSection(section);
    }
}

function openSection(section) {
    section.classList.add('expanded');
    const content = section.querySelector('.section-content');
    const icon = section.querySelector('.toggle-icon');
    
    if (content) {
        content.style.display = 'block';
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 10);
    }
    
    if (icon) {
        icon.style.transform = 'rotate(180deg)';
    }
    
    // Trigger specific animations based on section
    setTimeout(() => {
        triggerSectionAnimations(section);
    }, 100);
    
    // Update aria-expanded
    const header = section.querySelector('.section-header');
    if (header) {
        header.setAttribute('aria-expanded', 'true');
    }
}

function closeSection(section) {
    section.classList.remove('expanded');
    const content = section.querySelector('.section-content');
    const icon = section.querySelector('.toggle-icon');
    
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            // Check again in case it was re-opened quickly
            if (!section.classList.contains('expanded')) {
                content.style.display = 'none';
            }
        }, 300);
    }
    
    if (icon) {
        icon.style.transform = 'rotate(0deg)';
    }
    
    // Update aria-expanded
    const header = section.querySelector('.section-header');
    if (header) {
        header.setAttribute('aria-expanded', 'false');
    }
}

function triggerSectionAnimations(section) {
    const sectionId = section.id;
    
    switch (sectionId) {
        case 'education':
            animateTimeline(section);
            break;
        case 'experience':
            animateExperienceCards(section);
            break;
        case 'skills':
            animateSkillBars(section);
            break;
        case 'engagement':
            animateEngagementCards(section);
            break;
    }
}

function animateTimeline(section) {
    const timelineItems = section.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 150);
    });
}

function animateExperienceCards(section) {
    const cards = section.querySelectorAll('.experience-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        }, index * 200);
    });
}

function animateSkillBars(section) {
    const skillItems = section.querySelectorAll('.skill-item');
    const skillBars = section.querySelectorAll('.skill-bar');
    
    // Reset all bars
    skillBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.dataset.targetWidth = targetWidth;
        bar.style.width = '0%';
    });
    
    // Animate bars
    skillItems.forEach((item, index) => {
        const bar = item.querySelector('.skill-bar');
        
        setTimeout(() => {
            bar.style.transition = 'width 0.8s ease';
            bar.style.width = bar.dataset.targetWidth;
            
            // Add bounce effect
            setTimeout(() => {
                item.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 100);
            }, 400);
        }, index * 100);
    });
}

function animateEngagementCards(section) {
    const cards = section.querySelectorAll('.engagement-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'rotateY(15deg) translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'rotateY(0deg) translateY(0)';
        }, index * 150);
    });
}

// Initialize section states
document.addEventListener('DOMContentLoaded', function() {
    // Close all sections initially and set proper states
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
        }
    });
    
    // Add click listeners to section headers
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
        // This is the only event listener needed.
        // The onclick attribute in the HTML should be removed.
        header.addEventListener('click', function() {
            const sectionId = this.parentElement.id;
            toggleSection(sectionId);
        });
        
        // Add keyboard support
        header.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const sectionId = this.parentElement.id;
                toggleSection(sectionId);
            }
        });
        
        // Make headers focusable
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
    });
    
    // Update aria-expanded attributes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const section = mutation.target;
                const header = section.querySelector('.section-header');
                const isExpanded = section.classList.contains('expanded');
                
                if (header) {
                    header.setAttribute('aria-expanded', isExpanded.toString());
                }
            }
        });
    });
    
    // Observe all sections for class changes
    sections.forEach(section => {
        observer.observe(section, { attributes: true, attributeFilter: ['class'] });
    });
});

// Auto-expand sections based on URL hash
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const section = document.getElementById(hash);
        if (section && section.classList.contains('section')) {
            setTimeout(() => {
                toggleSection(hash);
            }, 500);
        }
    }
});

// Update URL hash when sections are opened
function updateUrlHash(sectionId) {
    if (history.replaceState) {
        history.replaceState(null, null, `#${sectionId}`);
    }
}

// Add this to the openSection function
const originalOpenSection = openSection;
openSection = function(section) {
    originalOpenSection(section);
    updateUrlHash(section.id);
};