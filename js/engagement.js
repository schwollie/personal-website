/**
 * Engagement controller for engagement cards rendering and animations
 */
class EngagementController {
    constructor() {
        this.engagementData = null;
    }

    async init() {
        console.log('EngagementController initializing...');
        await this.loadEngagementData();
        await this.renderEngagement();
        console.log('EngagementController initialized successfully');
    }

    async loadEngagementData() {
        try {
            console.log('Loading engagement data...');
            const response = await fetch('data/engagement.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.engagementData = await response.json();
            console.log('Engagement data loaded:', this.engagementData);
        } catch (error) {
            console.error('Failed to load engagement data:', error);
            this.engagementData = { engagementItems: [] };
        }
    }

    async renderEngagement() {
        if (!this.engagementData || !this.engagementData.engagementItems || this.engagementData.engagementItems.length === 0) {
            console.error('No engagement data available');
            return;
        }

        const container = document.getElementById('engagement-container');
        if (!container) {
            console.error('Engagement container not found');
            return;
        }

        console.log('Rendering engagement to container:', container);
        container.innerHTML = '';

        const engagementGrid = document.createElement('div');
        engagementGrid.className = 'engagement-grid';

        this.engagementData.engagementItems.forEach((item, index) => {
            const engagementCard = this.createEngagementCard(item, index);
            engagementGrid.appendChild(engagementCard);
        });

        container.appendChild(engagementGrid);
        console.log('Engagement rendered successfully');
    }

    createEngagementCard(item, index) {
        const card = document.createElement('div');
        card.className = 'engagement-card';
        card.style.opacity = '0';
        card.style.transform = 'rotateY(15deg) translateY(20px)';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';

        const icon = document.createElement('i');
        icon.className = item.icon || 'fas fa-heart';
        
        const title = document.createElement('h3');
        title.textContent = item.organization;

        cardHeader.appendChild(icon);
        cardHeader.appendChild(title);

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const role = document.createElement('p');
        role.className = 'role';
        role.textContent = item.role;

        const duration = document.createElement('p');
        duration.className = 'duration';
        duration.textContent = `${item.startDate} - ${item.endDate}`;

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description;

        cardContent.appendChild(role);
        cardContent.appendChild(duration);
        cardContent.appendChild(description);

        // Add website link if available
        if (item.website) {
            const link = document.createElement('a');
            link.href = item.website;
            link.target = '_blank';
            link.className = 'external-link';
            link.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit Website';
            cardContent.appendChild(link);
        }

        card.appendChild(cardHeader);
        card.appendChild(cardContent);

        return card;
    }

    animateEngagement(section) {
        const cards = section.querySelectorAll('.engagement-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'rotateY(0deg) translateY(0)';
            }, index * 150);
        });
    }

    resetEngagementAnimation(section) {
        const cards = section.querySelectorAll('.engagement-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'rotateY(15deg) translateY(20px)';
            card.style.transition = '';
        });
    }

    destroy() {
        // Cleanup if needed
    }
}
