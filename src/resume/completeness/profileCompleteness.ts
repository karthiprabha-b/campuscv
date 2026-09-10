/**
 * profileCompleteness.ts — Section-by-Section Profile Completeness Evaluator
 *
 * Evaluates profile completeness per section without enforcing missing sections.
 * Students with 0 experience and 3 projects are fully valid.
 */

import { CampusProfile } from '../../types/canonicalProfile';

export interface SectionStatus {
  name: string;
  isComplete: boolean;
  itemCount: number;
  label: string;
}

export interface ProfileCompletenessResult {
  overallScore: number; // 0 to 100
  isValidForTemplate: boolean;
  sections: Record<string, SectionStatus>;
  summaryText: string;
}

export function evaluateProfileCompleteness(profile: CampusProfile): ProfileCompletenessResult {
  if (!profile) {
    return {
      overallScore: 0,
      isValidForTemplate: false,
      sections: {},
      summaryText: 'Profile data is empty.'
    };
  }

  const personalComplete = Boolean(profile.personal?.fullName && (profile.personal?.email || profile.personal?.phone));
  const educationCount = profile.education?.length || 0;
  const experienceCount = profile.experience?.length || 0;
  const projectsCount = profile.projects?.length || 0;
  const skillsCount = profile.skills?.length || 0;
  const certificationsCount = profile.certifications?.length || 0;
  const socialCount = [profile.social?.github, profile.social?.linkedin, profile.social?.portfolio].filter(Boolean).length;

  const sections: Record<string, SectionStatus> = {
    personal: {
      name: 'Personal',
      isComplete: personalComplete,
      itemCount: personalComplete ? 1 : 0,
      label: personalComplete ? '✓ Extracted' : 'Incomplete'
    },
    education: {
      name: 'Education',
      isComplete: educationCount > 0,
      itemCount: educationCount,
      label: educationCount > 0 ? `✓ ${educationCount} entry` : 'Not provided'
    },
    experience: {
      name: 'Experience',
      isComplete: experienceCount > 0,
      itemCount: experienceCount,
      label: experienceCount > 0 ? `✓ ${experienceCount} entry` : 'Optional (0)'
    },
    projects: {
      name: 'Projects',
      isComplete: projectsCount > 0,
      itemCount: projectsCount,
      label: projectsCount > 0 ? `✓ ${projectsCount} project` : 'Not provided'
    },
    skills: {
      name: 'Skills',
      isComplete: skillsCount > 0,
      itemCount: skillsCount,
      label: skillsCount > 0 ? `✓ ${skillsCount} skill` : 'Not provided'
    },
    certifications: {
      name: 'Certifications',
      isComplete: certificationsCount > 0,
      itemCount: certificationsCount,
      label: certificationsCount > 0 ? `✓ ${certificationsCount} cert` : 'Optional (0)'
    },
    social: {
      name: 'Links',
      isComplete: socialCount > 0,
      itemCount: socialCount,
      label: socialCount > 0 ? `✓ ${socialCount} link` : 'Optional (0)'
    }
  };

  // Score calculation: Personal (30%), Education (25%), Projects/Experience (25%), Skills (20%)
  let score = 0;
  if (personalComplete) score += 30;
  if (educationCount > 0) score += 25;
  if (projectsCount > 0 || experienceCount > 0) score += 25;
  if (skillsCount > 0) score += 20;

  const isValidForTemplate = personalComplete && (educationCount > 0 || projectsCount > 0 || experienceCount > 0 || skillsCount > 0);

  return {
    overallScore: Math.min(100, score),
    isValidForTemplate,
    sections,
    summaryText: `Profile completeness: ${score}%`
  };
}
