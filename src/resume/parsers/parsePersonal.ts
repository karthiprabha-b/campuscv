/**
 * parsePersonal.ts — Personal Information Parser
 *
 * Strictly scoped to HEADER_CONTACT and SUMMARY sections:
 * - Extracted name, title, email, phone, location from HEADER_CONTACT
 * - Extracted summary ONLY from SUMMARY section (leaves "" if absent)
 * - Zero full-document text dump or combining
 */

import { PersonalDetails } from '../../types/canonicalProfile';
import { validateFullName, validateEmail, validatePhone } from '../validate/validateFields';
import { DetectedSections } from '../sections/sectionDetector';

const TITLE_REGEX = /\b(?:Software Developer|Software Engineer|Frontend Developer|Frontend Engineer|Backend Developer|Backend Engineer|Full Stack Developer|Full Stack Engineer|Data Engineer|Data Scientist|AI Engineer|AI Developer|AI Practitioner|Systems Engineer|Cloud Engineer|Cloud Architect|Solutions Architect|DevOps Engineer|Mobile Developer|iOS Developer|Android Developer|Product Manager|Product Designer|UI\/UX Designer|UX Researcher|Web Developer|Student|Undergraduate|Graduate|Intern|Architect|Analyst|Consultant|Specialist|Lead|Co-founder|Founder|Manager|Director|Freelance|Freelancer|Developer)\b/i;

export function parsePersonalSection(
  sections: DetectedSections
): { personal: PersonalDetails; confidenceScores: Record<string, number> } {
  const confidenceScores: Record<string, number> = {};
  const personal: PersonalDetails = {
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    profilePhoto: '',
    summary: ''
  };

  const headerText = sections.HEADER_CONTACT?.content || '';
  const headerLines = sections.HEADER_CONTACT?.lines || [];

  if (headerText) {
    // 1. Email Extraction from header
    const email = validateEmail(headerText);
    if (email) {
      personal.email = email;
      confidenceScores['personal.email'] = 0.98;
    }

    // 2. Phone Extraction from header
    const phone = validatePhone(headerText);
    if (phone) {
      personal.phone = phone;
      confidenceScores['personal.phone'] = 0.94;
    }

    // 3. Name & Headline Extraction from top header lines
    for (let i = 0; i < Math.min(6, headerLines.length); i++) {
      const line = headerLines[i].trim();
      if (!line) continue;

      // Skip pure email / phone lines
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(line)) continue;
      if (/^(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(line)) continue;

      // Case A: Delimited line with name and headline (e.g. "Karthikeyan Prabakaran | AI Web Developer")
      const delimiters = [/[-–—|]/, /[•●]/];
      let foundDelimited = false;

      for (const delim of delimiters) {
        if (delim.test(line)) {
          const parts = line.split(delim).map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            const nameRes = validateFullName(parts[0]);
            if (nameRes.name && !personal.fullName) {
              personal.fullName = nameRes.name;
              confidenceScores['personal.fullName'] = nameRes.confidence;

              const candidateTitle = parts.slice(1).join(' | ').trim()
                .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
                .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '')
                .replace(/https?:\/\/\S+/g, '')
                .trim();

              if (candidateTitle.length >= 2 && candidateTitle.length <= 150) {
                personal.headline = candidateTitle;
                confidenceScores['personal.headline'] = 0.88;
              }
              foundDelimited = true;
              break;
            }
          }
        }
      }

      if (foundDelimited && personal.fullName) break;

      // Case B: Direct line full name
      if (!personal.fullName) {
        const directRes = validateFullName(line);
        if (directRes.name) {
          personal.fullName = directRes.name;
          confidenceScores['personal.fullName'] = directRes.confidence;
        }
      }
    }

    // 4. Headline fallback from header lines if not delimited
    if (!personal.headline && headerLines.length > 1) {
      for (let i = 0; i < Math.min(5, headerLines.length); i++) {
        const line = headerLines[i].trim();
        if (line === personal.fullName) continue;
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(line)) continue;
        if (line.includes('@') && line.includes('.com') && !TITLE_REGEX.test(line)) continue;

        if (TITLE_REGEX.test(line) && line.length <= 150) {
          const cleanTitle = line
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
            .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '')
            .replace(/https?:\/\/\S+/g, '')
            .trim();

          if (cleanTitle.length >= 3) {
            personal.headline = cleanTitle;
            confidenceScores['personal.headline'] = 0.85;
            break;
          }
        }
      }
    }

    // 5. Location Extraction from header
    const locationMatch = headerText.match(/\b([A-Z][a-zA-Z\s.-]+,\s*[A-Z][a-zA-Z\s.-]+(?:\s*,\s*[A-Z][a-zA-Z\s.-]+)?)\b/);
    if (locationMatch) {
      const locParts = locationMatch[1].split(',').map(p => p.trim());
      if (locParts.length >= 1) personal.city = locParts[0];
      if (locParts.length >= 2) personal.state = locParts[1];
      if (locParts.length >= 3) personal.country = locParts[2];
      confidenceScores['personal.location'] = 0.80;
    }
  }

  // 6. Summary Extraction: ONLY from SUMMARY section
  const summaryContent = sections.SUMMARY?.content || '';
  if (summaryContent) {
    const cleanSummary = summaryContent
      .split('\n')
      .map(l => l.trim())
      .filter(l => {
        if (!l) return false;
        if (l === personal.fullName || l === personal.headline) return false;
        if (l.includes('@') || /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(l)) return false;
        if (/^(?:Profile|Summary|About Me|Objective|Professional Summary)$/i.test(l)) return false;
        return true;
      })
      .join(' ')
      .trim();

    if (cleanSummary.length > 0) {
      personal.summary = cleanSummary.slice(0, 600);
      confidenceScores['personal.summary'] = 0.90;
    }
  }

  return { personal, confidenceScores };
}
