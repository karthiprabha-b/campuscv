export interface HeroData {
  smallLabel: string;
  headline: string;
  highlightText: string;
  intro: string;
  summary: string;
  name: string;
  title: string;
  avatarUrl: string;
  badgeYears: string;
  badgeLabel: string;
  badgeSatisfaction: string;
  socials: {
    linkedin: string;
    github: string;
    twitter: string;
    dribbble: string;
  };
}

export interface Metric {
  id: string;
  number: number;
  suffix: string;
  label: string;
  description: string;
  iconName: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  detailedPoints: string[];
  iconName: string;
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number;
  }[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  location: string;
  description: string;
  honors?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  type: string;
  duration: string;
  location: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  impactMetrics: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  photoUrl: string;
  review: string;
  rating: number;
  type: 'Client' | 'Mentor' | 'Manager' | 'Professor' | string;
}

export interface ExecutivePortfolioData {
  name: string;
  title: string;
  roleLabel: string;
  hero: HeroData;
  metrics: Metric[];
  about: {
    story: string;
    mission: string;
    values: string[];
    educationShort: string;
    location: string;
    availability: string;
    languages: string[];
    expertise: string[];
  };
  services: Service[];
  skills: SkillCategory[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: Project[];
  testimonials: Testimonial[];
}
