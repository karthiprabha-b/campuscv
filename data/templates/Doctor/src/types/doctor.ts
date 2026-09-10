export interface CredentialBadge {
  label: string;
  detail: string;
  verified: boolean;
}

export interface StatItem {
  value: string;
  numericValue?: number;
  suffix?: string;
  label: string;
  subtext: string;
}

export interface Specialization {
  id: string;
  title: string;
  badge?: string;
  icon: string; // key identifier for icon rendering
  shortDescription: string;
  detailedDescription: string;
  conditionsTreated: string[];
  commonProcedures: string[];
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  institution: string;
  location: string;
  period: string;
  isCurrent?: boolean;
  department: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
  honors?: string;
  description?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  authority: string;
  year: string;
  credentialId?: string;
  status: "Active" | "Lifetime";
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  category: "Award" | "Research" | "Leadership" | "Recognition";
  description: string;
  badge?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  journal: string;
  year: string;
  volume?: string;
  category: string;
  doi?: string;
  link?: string;
  abstract: string;
  citations?: number;
}

export interface TestimonialItem {
  id: string;
  patientName: string;
  treatmentCategory: string;
  rating: number;
  date: string;
  verifiedPatient: boolean;
  quote: string;
}

export interface ClinicLocation {
  name: string;
  facilityType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateZip: string;
  phone: string;
  emergencyPhone?: string;
  email: string;
  mapEmbedUrl: string;
  hours: {
    days: string;
    time: string;
  }[];
}

export interface DoctorProfile {
  name: string;
  honorific: string;
  primaryTitle: string;
  secondaryTitle: string;
  registrationNumber: string;
  council: string;
  tagline: string;
  shortBio: string;
  fullBio: string[];
  medicalPhilosophy: {
    quote: string;
    authorAttribution: string;
  };
  heroPortrait: string;
  aboutPortrait: string;
  secondaryPortrait?: string;
  stats: StatItem[];
  keyCredentials: string[];
  languages: string[];
  consultationTypes: {
    type: string;
    duration: string;
    description: string;
    isAvailable: boolean;
  }[];
  specializations: Specialization[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  publications: PublicationItem[];
  testimonials: TestimonialItem[];
  clinic: ClinicLocation;
  socialLinks: {
    platform: string;
    url: string;
    handle: string;
  }[];
}
