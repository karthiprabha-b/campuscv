export interface ProjectItem {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  year?: string;
  description: string;
  image?: string;
  caseStudyUrl?: string;
  technologies?: string[];
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  startDate?: string;
  endDate?: string;
  period?: string;
  description: string;
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  period?: string;
  details?: string;
}

export interface CertificationItem {
  id?: string;
  title: string;
  issuer?: string;
  year?: string;
}

export interface SocialLinkItem {
  name: string;
  url: string;
}

export interface PortfolioData {
  personal?: {
    name?: string;
    role?: string;
    location?: string;
    email?: string;
    availability?: string;
    profileImage?: string;
  };
  hero?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
  };
  about?: {
    headline?: string;
    bio?: string;
    avatarUrl?: string;
  };
  projects?: ProjectItem[];
  experience?: ExperienceItem[];
  skills?: (string | { name: string })[];
  tools?: (string | { name: string })[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  testimonial?: {
    quote?: string;
    clientName?: string;
    clientRole?: string;
  };
  socialLinks?: SocialLinkItem[];
}
