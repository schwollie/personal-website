/**
 * Education controller for timeline rendering and animations
 */
class EducationController {
    constructor() {
        this.educationData = null;
    }

    /**
     * Calculate current semester based on start date (April 1st = new semester every 6 months)
     * @param {number} startYear - Year when studies started
     * @param {number} startMonth - Month when studies started (1-12)
     * @returns {string} Formatted semester string (e.g., "2nd Semester")
     */
    calculateSemester(startYear, startMonth) {
        const now = new Date();
        const startDate = new Date(startYear, startMonth - 1, 1); // Month is 0-indexed
        
        // Calculate months elapsed
        const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 
                            + (now.getMonth() - startDate.getMonth());
        
        // Each semester is 6 months, starting from April 1st
        const semester = Math.floor(monthsElapsed / 6) + 1;
        
        // Format with ordinal suffix
        const ordinal = this.getOrdinalSuffix(semester);
        return `${semester}${ordinal} Semester`;
    }

    /**
     * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
     */
    getOrdinalSuffix(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    }

    async init() {
        console.log('EducationController initializing...');
        await this.loadEducationData();
        await this.renderEducation();
        console.log('EducationController initialized successfully');
    }

    async loadEducationData() {
        try {
            console.log('Loading education data...');
            const response = await fetch('data/education.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.educationData = await response.json();
            console.log('Education data loaded:', this.educationData);
        } catch (error) {
            console.error('Failed to load education data:', error);
            this.educationData = { educationItems: [] };
        }
    }

    async renderEducation() {
        if (!this.educationData || !this.educationData.educationItems || this.educationData.educationItems.length === 0) {
            console.error('No education data available');
            return;
        }

        const container = document.getElementById('education-container');
        if (!container) {
            console.error('Education container not found');
            return;
        }

        console.log('Rendering education to container:', container);
        container.innerHTML = '';

        const timeline = document.createElement('div');
        timeline.className = 'timeline';

        this.educationData.educationItems.forEach((item, index) => {
            const timelineItem = this.createTimelineItem(item, index);
            timeline.appendChild(timelineItem);
        });

        container.appendChild(timeline);
        console.log('Education rendered successfully');
    }

    createTimelineItem(item, index) {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.opacity = '0';
        timelineItem.style.transform = 'translateX(-30px)';

        const timelineDate = document.createElement('div');
        timelineDate.className = 'timeline-date';
        timelineDate.textContent = `${item.startDate} - ${item.endDate}`;

        const timelineContent = document.createElement('div');
        timelineContent.className = 'timeline-content';

        const title = document.createElement('h3');
        title.textContent = item.degree;

        const institution = document.createElement('p');
        institution.className = 'institution';
        institution.textContent = item.institution;

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description;

        timelineContent.appendChild(title);
        timelineContent.appendChild(institution);

        // Add grade/status if available
        if (item.grade) {
            const grade = document.createElement('p');
            grade.className = 'grade';
            grade.textContent = `Grade: ${item.grade}`;
            timelineContent.appendChild(grade);
        }

        if (item.gpa) {
            const gpa = document.createElement('p');
            gpa.className = 'gpa';
            gpa.textContent = `GPA: ${item.gpa}`;
            timelineContent.appendChild(gpa);
        }

        // Calculate semester dynamically if semesterStartYear is provided
        if (item.semesterStartYear && item.semesterStartMonth) {
            const status = document.createElement('p');
            status.className = 'status';
            status.textContent = this.calculateSemester(item.semesterStartYear, item.semesterStartMonth);
            timelineContent.appendChild(status);
        } else if (item.status) {
            const status = document.createElement('p');
            status.className = 'status';
            status.textContent = item.status;
            timelineContent.appendChild(status);
        }

        if (item.thesis) {
            const thesis = document.createElement('div');
            thesis.className = 'thesis';
            
            const thesisHeader = document.createElement('div');
            thesisHeader.className = 'thesis-header';
            
            const thesisTitle = document.createElement('p');
            thesisTitle.className = 'thesis-title';
            thesisTitle.innerHTML = `<strong>Thesis:</strong> ${item.thesis.title}`;
            
            thesisHeader.appendChild(thesisTitle);
            
            // Add thesis link if available
            if (item.thesis.file) {
                const thesisLink = document.createElement('a');
                thesisLink.href = item.thesis.file;
                thesisLink.target = '_blank';
                thesisLink.className = 'thesis-link';
                thesisLink.innerHTML = '<i class="fas fa-external-link-alt"></i>';
                thesisLink.setAttribute('aria-label', 'Open thesis PDF');
                thesisHeader.appendChild(thesisLink);
            }
            
            thesis.appendChild(thesisHeader);
            
            if (item.thesis.grade) {
                const thesisGrade = document.createElement('p');
                thesisGrade.className = 'thesis-grade';
                thesisGrade.textContent = `Thesis Grade: ${item.thesis.grade}`;
                thesis.appendChild(thesisGrade);
            }
            
            timelineContent.appendChild(thesis);
        }

        timelineContent.appendChild(description);

        timelineItem.appendChild(timelineDate);
        timelineItem.appendChild(timelineContent);

        return timelineItem;
    }

    animateEducation(section) {
        const items = section.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }

    resetEducationAnimation(section) {
        const items = section.querySelectorAll('.timeline-item');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = '';
        });
    }

    destroy() {
        // Cleanup if needed
    }
}
