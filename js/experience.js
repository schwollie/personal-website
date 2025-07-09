/**
 * Experience controller for experience cards rendering and animations
 */
class ExperienceController {
    constructor() {
        this.experienceData = null;
    }

    async init() {
        console.log('ExperienceController initializing...');
        await this.loadExperienceData();
        await this.renderExperience();
        console.log('ExperienceController initialized successfully');
    }

    async loadExperienceData() {
        try {
            console.log('Loading experience data...');
            const response = await fetch('data/experience.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.experienceData = await response.json();
            console.log('Experience data loaded:', this.experienceData);
        } catch (error) {
            console.error('Failed to load experience data:', error);
            this.experienceData = { experienceItems: [] };
        }
    }

    async renderExperience() {
        if (!this.experienceData || !this.experienceData.experienceItems || this.experienceData.experienceItems.length === 0) {
            console.error('No experience data available');
            return;
        }

        const container = document.getElementById('experience-container');
        if (!container) {
            console.error('Experience container not found');
            return;
        }

        console.log('Rendering experience to container:', container);
        container.innerHTML = '';

        const experienceGrid = document.createElement('div');
        experienceGrid.className = 'experience-grid';

        this.experienceData.experienceItems.forEach((item, index) => {
            const experienceCard = this.createExperienceCard(item, index);
            experienceGrid.appendChild(experienceCard);
        });

        container.appendChild(experienceGrid);
        console.log('Experience rendered successfully');
    }

    createExperienceCard(item, index) {
        const card = document.createElement('div');
        card.className = 'experience-card';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(20px)';

        // Company logo (placeholder or actual if available)
        const logo = document.createElement('div');
        logo.className = 'company-logo';
        if (item.companyLogo) {
            const logoImg = document.createElement('img');
            logoImg.src = item.companyLogo;
            logoImg.alt = `${item.company} logo`;
            logo.appendChild(logoImg);
        } else {
            logo.innerHTML = '<i class="fas fa-building"></i>';
        }

        const details = document.createElement('div');
        details.className = 'experience-details';

        const title = document.createElement('h3');
        title.textContent = item.position;

        const company = document.createElement('p');
        company.className = 'company';
        company.textContent = item.company;

        const duration = document.createElement('p');
        duration.className = 'duration';
        duration.innerHTML = `<i class="fas fa-calendar"></i> ${item.startDate} - ${item.endDate}`;

        if (item.location) {
            const location = document.createElement('p');
            location.className = 'location';
            location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.location}`;
            details.appendChild(location);
        }

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description;

        details.appendChild(title);
        details.appendChild(company);
        details.appendChild(duration);
        details.appendChild(description);

        // Add technologies used
        if (item.technologies && item.technologies.length > 0) {
            const skillsUsed = document.createElement('div');
            skillsUsed.className = 'skills-used';
            
            const skillsLabel = document.createElement('p');
            skillsLabel.textContent = 'Technologies:';
            skillsUsed.appendChild(skillsLabel);

            const skillsList = document.createElement('div');
            skillsList.className = 'skills-list';

            item.technologies.forEach(tech => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = tech;
                skillsList.appendChild(skillTag);
            });

            skillsUsed.appendChild(skillsList);
            details.appendChild(skillsUsed);
        }

        // Add achievements if available
        if (item.achievements && item.achievements.length > 0) {
            const achievements = document.createElement('div');
            achievements.className = 'achievements';
            
            const achievementsLabel = document.createElement('p');
            achievementsLabel.textContent = 'Key Achievements:';
            achievements.appendChild(achievementsLabel);

            const achievementsList = document.createElement('ul');
            item.achievements.forEach(achievement => {
                const achievementItem = document.createElement('li');
                achievementItem.textContent = achievement;
                achievementsList.appendChild(achievementItem);
            });

            achievements.appendChild(achievementsList);
            details.appendChild(achievements);
        }

        card.appendChild(logo);
        card.appendChild(details);

        return card;
    }

    animateExperience(section) {
        const cards = section.querySelectorAll('.experience-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, index * 200);
        });
    }

    resetExperienceAnimation(section) {
        const cards = section.querySelectorAll('.experience-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9) translateY(20px)';
            card.style.transition = '';
        });
    }

    destroy() {
        // Cleanup if needed
    }
}
