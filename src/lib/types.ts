export interface Skill {
  name: string;
  source: string;
  skillLevel: string | null;
}

export interface SkillCategory {
  categoryName: string;
  categoryId: string;
  skills: Skill[];
}

export interface SkillsData {
  skillCategories: SkillCategory[];
}

export interface Thesis {
  title: string;
  grade?: string;
  file?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
  grade?: string | null;
  gpa?: string;
  status?: string;
  semesterStartYear?: number;
  semesterStartMonth?: number;
  thesis?: Thesis | null;
}

export interface EducationData {
  educationItems: EducationItem[];
}

export interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location?: string;
  description: string;
  technologies?: string[];
  achievements?: string[];
  companyLogo?: string;
}

export interface ExperienceData {
  experienceItems: ExperienceItem[];
}

export interface EngagementItem {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  website?: string | null;
  type?: string;
  icon?: string;
}

export interface EngagementData {
  engagementItems: EngagementItem[];
}
