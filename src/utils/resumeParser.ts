/**
 * resumeParser.ts — Resume Parser Interface with Groq AI Support
 */

import { CampusProfile, createEmptyCanonicalProfile } from '../types/canonicalProfile';
import { validateExtractionQuality, sanitizeAndValidateProfile } from '../resume/validate/validateExtraction';
import { normalizeResumeText } from '../resume/normalize/normalizeResumeText';
import { segmentSections, DetectedSections } from '../resume/sections/sectionDetector';
import { parsePersonalSection } from '../resume/parsers/parsePersonal';
import { parseEducationSection } from '../resume/parsers/parseEducation';
import { parseExperienceSection } from '../resume/parsers/parseExperience';
import { parseProjectsSection } from '../resume/parsers/parseProjects';
import { parseStructuredSkills } from '../resume/parsers/parseSkills';
import { parseCertificationsSection } from '../resume/parsers/parseCertifications';
import { parseSocialsSection } from '../resume/parsers/parseSocials';
import { evaluateProfileCompleteness, ProfileCompletenessResult } from '../resume/completeness/profileCompleteness';
import { extractResumeWithGroq } from '../resume/ai/groqExtractor';

export interface ParseResult {
  profile: CampusProfile;
  rawText: string;
  extractedSections: Record<string, string>;
  detectedSections: DetectedSections;
  confidenceScores: Record<string, number>;
  qualityValid?: boolean;
  qualityWarning?: string;
  completeness: ProfileCompletenessResult;
  unclassifiedContent: string[];
  extractionMethod?: string;
}

export async function parseResumeTextAsync(rawText: string, fileName = 'resume.pdf'): Promise<ParseResult> {
  let profile = createEmptyCanonicalProfile();
  profile.resume = {
    fileName,
    extractedText: rawText,
    parsedAt: Date.now()
  };

  if (!rawText || rawText.trim().length === 0) {
    return {
      profile,
      rawText: '',
      extractedSections: {},
      detectedSections: { HEADER_CONTACT: { name: 'HEADER_CONTACT', canonicalName: 'HEADER_CONTACT', startLine: 0, endLine: 0, lines: [], content: '' }, allSections: {}, sectionRanges: {}, detectedSectionNames: [] },
      confidenceScores: {},
      qualityValid: false,
      qualityWarning: "We couldn't read any text from this resume file.",
      completeness: evaluateProfileCompleteness(profile),
      unclassifiedContent: [],
      extractionMethod: 'FAILED'
    };
  }

  const normalizedText = normalizeResumeText(rawText);

  // 1. Primary AI Extraction with Groq
  try {
    const groqRes = await extractResumeWithGroq(normalizedText, fileName);
    if (groqRes.success && groqRes.profile) {
      const detectedSections = segmentSections(normalizedText);
      return {
        profile: groqRes.profile,
        rawText: normalizedText,
        extractedSections: detectedSections.allSections,
        detectedSections,
        confidenceScores: {},
        qualityValid: true,
        completeness: evaluateProfileCompleteness(groqRes.profile),
        unclassifiedContent: [],
        extractionMethod: `GROQ_AI_${groqRes.modelUsed || 'default'}`
      };
    }
  } catch (e) {
    console.warn('[resumeParser] Groq extraction failed, using fallback:', e);
  }

  // 2. Deterministic Fallback
  return parseResumeText(rawText, fileName);
}

export function parseResumeText(rawText: string, fileName = 'resume.pdf'): ParseResult {
  let profile = createEmptyCanonicalProfile();
  profile.resume = {
    fileName,
    extractedText: rawText,
    parsedAt: Date.now()
  };

  if (!rawText || rawText.trim().length === 0) {
    return {
      profile,
      rawText: '',
      extractedSections: {},
      detectedSections: { HEADER_CONTACT: { name: 'HEADER_CONTACT', canonicalName: 'HEADER_CONTACT', startLine: 0, endLine: 0, lines: [], content: '' }, allSections: {}, sectionRanges: {}, detectedSectionNames: [] },
      confidenceScores: {},
      qualityValid: false,
      qualityWarning: "We couldn't read any text from this resume file.",
      completeness: evaluateProfileCompleteness(profile),
      unclassifiedContent: [],
      extractionMethod: 'FAILED'
    };
  }

  // 1. QUALITY GATE
  const quality = validateExtractionQuality(rawText);
  if (!quality.usable) {
    return {
      profile,
      rawText,
      extractedSections: {},
      detectedSections: { HEADER_CONTACT: { name: 'HEADER_CONTACT', canonicalName: 'HEADER_CONTACT', startLine: 0, endLine: 0, lines: [], content: '' }, allSections: {}, sectionRanges: {}, detectedSectionNames: [] },
      confidenceScores: {},
      qualityValid: false,
      qualityWarning: quality.warning,
      completeness: evaluateProfileCompleteness(profile),
      unclassifiedContent: [],
      extractionMethod: 'FAILED'
    };
  }

  // 2. TEXT NORMALIZATION
  const normalizedText = normalizeResumeText(rawText);

  // 3. SECTION BOUNDARIES
  const detectedSections = segmentSections(normalizedText);

  // 4. SECTION-SPECIFIC PARSING
  const { personal, confidenceScores } = parsePersonalSection(detectedSections);
  profile.personal = { ...profile.personal, ...personal };

  profile.education = parseEducationSection(detectedSections.EDUCATION?.content || '');
  profile.experience = parseExperienceSection(detectedSections.EXPERIENCE?.content || '');
  profile.projects = parseProjectsSection(detectedSections.PROJECTS?.content || '');

  const structuredSkills = parseStructuredSkills(detectedSections.SKILLS?.content || '');
  profile.skills = structuredSkills.entries;

  profile.certifications = parseCertificationsSection(detectedSections.CERTIFICATIONS?.content || '');

  const linksText = [detectedSections.HEADER_CONTACT?.content || '', detectedSections.LINKS?.content || ''].join('\n');
  const social = parseSocialsSection(linksText || normalizedText);
  profile.social = { ...profile.social, ...social };

  // 5. SANITIZATION & ANTI-DUPLICATION
  profile = sanitizeAndValidateProfile(profile, normalizedText);

  return {
    profile,
    rawText: normalizedText,
    extractedSections: detectedSections.allSections,
    detectedSections,
    confidenceScores,
    qualityValid: true,
    completeness: evaluateProfileCompleteness(profile),
    unclassifiedContent: [],
    extractionMethod: 'DETERMINISTIC_SECTION_BOUNDED'
  };
}
