/**
 * validateFields.ts — Strict Field Validation & Confidence Scoring
 *
 * Enforces rigorous field validation to extract clean names, emails, phones, and URLs.
 */

const REJECTED_NAME_PATTERNS = [
  /\bPDF[-_.\d]*/i,
  /\bDOCX?[-_.\d]*/i,
  /\bRESUME\b/i,
  /\bCURRICULUM\s*VITAE\b/i,
  /\bCV\b/i,
  /\bPAGE\s*\d+/i,
  /http/i,
  /www\./i,
  /@/,
  /\b(EDUCATION|EXPERIENCE|EMPLOYMENT|PROJECTS|SKILLS|CERTIFICATIONS|SUMMARY|ABOUT|CONTACT|STREAM|OBJ|XREF|TRAILER|DECLARATION|OBJECTIVE)\b/i
];

/**
 * Validates extracted full name candidate string.
 * Returns clean name if valid, or empty string "" if candidate is suspicious/corrupted.
 */
export function validateFullName(candidate: string): { name: string; confidence: number } {
  if (!candidate || typeof candidate !== 'string') {
    return { name: '', confidence: 0 };
  }

  // Strip common label prefixes like "Name:", "Full Name:"
  let trimmed = candidate
    .replace(/^(?:Name|Full Name|Candidate Name|Contact)\s*:\s*/i, '')
    .trim();

  // Strip emails, phone numbers, and URLs if mixed into candidate string
  trimmed = trimmed
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
    .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[-–—|•●]/g, ' ')
    .trim();

  // 1. Length bounds (2 to 50 characters)
  if (trimmed.length < 2 || trimmed.length > 50) {
    return { name: '', confidence: 0 };
  }

  // 2. Reject blacklisted patterns
  for (let i = 0; i < REJECTED_NAME_PATTERNS.length; i++) {
    const pattern = REJECTED_NAME_PATTERNS[i];
    if (pattern.test(trimmed)) {
      return { name: '', confidence: 0 };
    }
  }

  // 3. Must contain at least 2 alphabetic characters
  const alphaMatch = trimmed.match(/[a-zA-Z]/g);
  if (!alphaMatch || alphaMatch.length < 2) {
    return { name: '', confidence: 0 };
  }

  // 4. Reject single-char token fragmentation (e.g. "f i E y y")
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const singleCharTokens = tokens.filter(t => t.length === 1 && !/^[A-Z]\.?$/i.test(t));
  if (tokens.length >= 3 && singleCharTokens.length >= tokens.length / 2) {
    return { name: '', confidence: 0 };
  }

  // 5. Reject if tokens look like a sentence / description (e.g. "Seeking a challenging role in...")
  if (/^(?:seeking|motivated|experienced|passionate|enthusiastic|dedicated|results-oriented|looking for|to obtain)\b/i.test(trimmed)) {
    return { name: '', confidence: 0 };
  }

  // Clean remaining unwanted symbols, leaving alphabetic chars, spaces, hyphens, dots, and apostrophes
  const cleaned = trimmed
    .replace(/[^a-zA-Z\s.'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length < 2 || !/[a-zA-Z]{2,}/.test(cleaned)) {
    return { name: '', confidence: 0 };
  }

  return {
    name: cleaned,
    confidence: 0.92
  };
}

/**
 * Validates email address.
 */
export function validateEmail(candidate: string): string {
  if (!candidate) return '';
  const match = candidate.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase().trim() : '';
}

/**
 * Validates phone number.
 */
export function validatePhone(candidate: string): string {
  if (!candidate) return '';
  const match = candidate.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0].trim() : '';
}

/**
 * Validates URL string.
 */
export function validateUrl(candidate: string): string {
  if (!candidate) return '';
  const trimmed = candidate.trim();
  if (/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(trimmed)) {
    return trimmed;
  }
  if (/^(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+[^\s]*$/i.test(trimmed)) {
    return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  }
  return '';
}
