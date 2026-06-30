"use client";

import ExpandableSection, {
  SectionsProvider,
} from "@/components/ui/ExpandableSection";
import EducationSection, {
  animateEducation,
} from "@/components/sections/EducationSection";
import ExperienceSection, {
  animateExperience,
} from "@/components/sections/ExperienceSection";
import SkillsSection, { animateSkills } from "@/components/sections/SkillsSection";
import EngagementSection, {
  animateEngagement,
} from "@/components/sections/EngagementSection";
import educationData from "@/data/education.json";
import experienceData from "@/data/experience.json";
import skillsData from "@/data/skills.json";
import engagementData from "@/data/engagement.json";
import type {
  EducationData,
  ExperienceData,
  SkillsData,
  EngagementData,
} from "@/lib/types";

export default function SectionsAccordion() {
  return (
    <SectionsProvider>
      <main className="main-content">
        <div className="container">
          <ExpandableSection
            id="education"
            title="Education"
            icon="fas fa-graduation-cap"
            onAnimate={animateEducation}
          >
            <EducationSection data={educationData as EducationData} />
          </ExpandableSection>

          <ExpandableSection
            id="experience"
            title="Work Experience"
            icon="fas fa-briefcase"
            onAnimate={animateExperience}
          >
            <ExperienceSection data={experienceData as ExperienceData} />
          </ExpandableSection>

          <ExpandableSection
            id="skills"
            title="Skills & Technologies"
            icon="fas fa-code"
            onAnimate={animateSkills}
          >
            <SkillsSection data={skillsData as SkillsData} />
          </ExpandableSection>

          <ExpandableSection
            id="engagement"
            title="Engagement & Social"
            icon="fas fa-heart"
            onAnimate={animateEngagement}
          >
            <EngagementSection data={engagementData as EngagementData} />
          </ExpandableSection>
        </div>
      </main>
    </SectionsProvider>
  );
}
