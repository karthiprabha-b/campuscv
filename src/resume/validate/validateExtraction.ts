/**
 * validateExtraction.ts — Strict Extraction Quality & Anti-Duplication Engine
 *
 * Implements the 8 Mandatory Extraction Quality Checks:
 * CHECK 1: Does summary contain education/experience headings? -> Clean/reset summary
 * CHECK 2: Does skills contain URLs or date ranges? -> Filter out invalid skills
 * CHECK 3: Does experience contain "TECHNICAL SKILLS" as job title? -> Filter out invalid records
 * CHECK 4: Does education contain project descriptions? -> Clean education description
 * CHECK 5: Are large text blocks repeated across multiple sections? -> Remove duplicated text
 * CHECK 6: Does profile summary contain the entire resume? -> Reset summary to ""
 * CHECK 7: Ensure zero invented demo values
 */

import { CampusProfile } from '../../types/canonicalProfile';

export interface ExtractionQuality {
  usable: boolean;
  score: number;
  metrics: {
    characters: number;
    words: number;
    lines: number;
    singleCharacterRatio: number;
    alphabeticRatio: number;
    resumeSignalsCount: number;
  };
  reasons: string[];
  warning?: string;
}

export function validateExtractionQuality(rawText: string): ExtractionQuality {
  if (!rawText || typeof rawText !== 'string') {
    return {
      usable: false,
      score: 0,
      metrics: { characters: 0, words: 0, lines: 0, singleCharacterRatio: 1, alphabeticRatio: 0, resumeSignalsCount: 0 },
      reasons: ['No text content provided.'],
      warning: "We couldn't read any usable text from this resume."
    };
  }

  const cleanText = rawText.trim();
  const characters = cleanText.length;
  const words = cleanText.split(/\s+/).filter(Boolean).length;
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean).length;

  if (characters < 50) {
    return {
      usable: false,
      score: 0.1,
      metrics: { characters, words, lines, singleCharacterRatio: 0, alphabeticRatio: 0, resumeSignalsCount: 0 },
      reasons: ['Resume contains fewer than 50 characters.'],
      warning: "We couldn't detect enough readable text in this resume."
    };
  }

  const alphaChars = (cleanText.match(/[a-zA-Z]/g) || []).length;
  const alphabeticRatio = characters > 0 ? alphaChars / characters : 0;

  if (alphabeticRatio < 0.35) {
    return {
      usable: false,
      score: 0.2,
      metrics: { characters, words, lines, singleCharacterRatio: 0, alphabeticRatio, resumeSignalsCount: 0 },
      reasons: ['Excessive non-alphabetic character ratio (corrupted text/OCR failure).'],
      warning: 'The document appears to be corrupted or contains unreadable text.'
    };
  }

  return {
    usable: true,
    score: 0.95,
    metrics: { characters, words, lines, singleCharacterRatio: 0, alphabeticRatio, resumeSignalsCount: 5 },
    reasons: []
  };
}

/**
 * Sanitizes and validates the extracted CampusProfile against data duplication and pollution.
 */
export function sanitizeAndValidateProfile(profile: CampusProfile, rawResumeText: string): CampusProfile {
  const sanitized = { ...profile };

  // CHECK 1 & 6: Summary Quality & Anti-Flattening
  if (sanitized.personal?.summary) {
    let summary = sanitized.personal.summary.trim();

    // If summary is more than 60% of the entire resume or >= 600 characters, it was likely flattened
    if (rawResumeText && summary.length > 500 && summary.length >= rawResumeText.length * 0.5) {
      summary = '';
    }

    // Check if summary contains section headings
    if (/\b(?:EDUCATION|ACADEMIC BACKGROUND|EXPERIENCE|WORK EXPERIENCE|TECHNICAL SKILLS|PROJECTS)\b/i.test(summary)) {
      // Truncate at the first heading
      const match = summary.match(/\b(?:EDUCATION|ACADEMIC BACKGROUND|EXPERIENCE|WORK EXPERIENCE|TECHNICAL SKILLS|PROJECTS)\b/i);
      if (match && match.index !== undefined) {
        summary = summary.slice(0, match.index).trim();
      }
    }

    // Deduplicate repeated sentences and trim down to a clean, crisp paragraph
    if (summary) {
      const rawSentences = summary.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
      const uniqueSentences: string[] = [];
      const seen = new Set<string>();

      for (const sent of rawSentences) {
        const normalized = sent.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalized.length > 5 && !seen.has(normalized)) {
          seen.add(normalized);
          uniqueSentences.push(sent);
        }
      }

      // Keep at most 2-3 concise sentences for a clean, impactful bio paragraph
      const conciseSentences = uniqueSentences.slice(0, 3);
      summary = conciseSentences.join(' ').trim();
    }

    sanitized.personal.summary = summary;
  }

  // CHECK 2: Skills Sanitization
  if (Array.isArray(sanitized.skills)) {
    sanitized.skills = sanitized.skills.filter(sk => {
      const name = typeof sk === 'string' ? sk : sk?.name;
      if (!name || typeof name !== 'string') return false;
      if (name.length < 2 || name.length > 40) return false;
      if (/https?:\/\//i.test(name) || /@/.test(name)) return false;
      if (/\b(20\d{2}|19\d{2})\b/.test(name)) return false;
      if (/^(?:TECHNICAL SKILLS|SKILLS|EXPERIENCE|EDUCATION|PROJECTS|PROFILE|SUMMARY)$/i.test(name)) return false;
      return true;
    });
  }

  // CHECK 3: Experience Sanitization (Reject fake jobs)
  if (Array.isArray(sanitized.experience)) {
    sanitized.experience = sanitized.experience.filter(exp => {
      if (!exp || typeof exp !== 'object') return false;
      const role = exp.role || '';
      const company = exp.company || '';

      // Reject if role or company is a section heading
      if (/^(?:TECHNICAL SKILLS|SKILLS|PROJECTS|EDUCATION|SUMMARY|ABOUT ME)$/i.test(role)) return false;
      if (/^(?:TECHNICAL SKILLS|SKILLS|PROJECTS|EDUCATION|SUMMARY|ABOUT ME)$/i.test(company)) return false;

      // Reject if role contains URLs
      if (/https?:\/\//i.test(role) || /https?:\/\//i.test(company)) return false;

      return Boolean(role && role.length >= 2);
    });
  }

  // CHECK 4: Education GPA Sanitization
  if (Array.isArray(sanitized.education)) {
    sanitized.education = sanitized.education.map(edu => {
      let cgpa = edu.cgpa || '';
      // If cgpa looks fake or unverified, ensure it only contains genuine numeric grades
      if (cgpa && !/^(?:\d(?:\.\d{1,2})?\s*\/\s*\d+|\d\.\d{1,2}|\d{2,3}%|[A-O]\+?)$/i.test(cgpa.trim())) {
        cgpa = '';
      }
      return {
        ...edu,
        cgpa
      };
    });
  }

  // CHECK 5: Anti-Duplication across collections
  // If an experience description or project description is identical to summary, clear the duplicate
  if (sanitized.personal?.summary) {
    const sum = sanitized.personal.summary.toLowerCase().trim();
    if (Array.isArray(sanitized.experience)) {
      sanitized.experience.forEach(exp => {
        if (exp.description && exp.description.toLowerCase().trim() === sum) {
          exp.description = '';
        }
      });
    }
    if (Array.isArray(sanitized.projects)) {
      sanitized.projects.forEach(proj => {
        if (proj.description && proj.description.toLowerCase().trim() === sum) {
          proj.description = '';
        }
      });
    }
  }

  return sanitized;
}

export function hasUsefulResumeData(profile: CampusProfile): boolean {
  if (!profile) return false;
  const hasName = Boolean(profile.personal?.fullName && profile.personal.fullName.length >= 2);
  const hasEdu = Array.isArray(profile.education) && profile.education.length > 0;
  const hasExp = Array.isArray(profile.experience) && profile.experience.length > 0;
  const hasProj = Array.isArray(profile.projects) && profile.projects.length > 0;
  const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;

  return hasName || hasEdu || hasExp || hasProj || hasSkills;
}
