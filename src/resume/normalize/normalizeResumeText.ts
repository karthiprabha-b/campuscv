/**
 * normalizeResumeText.ts — Text Cleaning & Semantic Normalization Layer
 *
 * Implements:
 * 1. Split URL repairing (e.g. "https://github.com/user-\ngif/repo" -> "https://github.com/user-gif/repo")
 * 2. Wrapped PDF line normalization (joining continuation lines to bullet points or paragraph titles)
 * 3. Bullet marker standardization
 * 4. Common OCR heading typo correction
 */

export function normalizeResumeText(text: string): string {
  if (!text) return '';

  let cleaned = text
    // 1. Standardize line endings & strip null bytes / invisible control chars
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/[\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

    // 2. Normalize smart quotes and unicode hyphens
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')

    // 3. Remove page numbers & repeated headers/footers
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
    .replace(/\bPage\s*\d+(?:\s*of\s*\d+)?\b/gi, '')

    // 4. REPAIR SPLIT URLs (e.g., "https://github.com/user-\ngif/repo" -> "https://github.com/user-gif/repo")
    .replace(/(https?:\/\/[^\s\n]+-)\n([a-zA-Z0-9_\-\/]+)/gi, '$1$2')
    .replace(/(https?:\/\/[^\s\n]+\/)\n([a-zA-Z0-9_\-\/]+)/gi, '$1$2')
    .replace(/(GitHub:\s*https?:\/\/[^\s\n]+-)\n([a-zA-Z0-9_\-\/]+)/gi, '$1$2')

    // 5. Fix broken PDF hyphenated line wraps: "Intel-\nligence" -> "Intelligence"
    .replace(/([a-zA-Z]+)-\n([a-zA-Z]+)/g, '$1$2');

  // 6. Line-by-line processing
  const lines = cleaned.split('\n').map(line => {
    let l = line.replace(/[ \t]+/g, ' ').trim();

    // Fix accidental letter-spacing (e.g. "K A R T H I K E Y A N" -> "KARTHIKEYAN")
    if (/^(?:[A-Z]\s+){3,}[A-Z]$/.test(l)) {
      l = l.replace(/\s+/g, '');
    }

    // Fix common OCR heading typos
    l = l
      .replace(/^SK1LLS$/i, 'SKILLS')
      .replace(/^SKlLLS$/i, 'SKILLS')
      .replace(/^EXPERlENCE$/i, 'EXPERIENCE')
      .replace(/^EXPER1ENCE$/i, 'EXPERIENCE')
      .replace(/^EDUCATlON$/i, 'EDUCATION')
      .replace(/^EDUCAT1ON$/i, 'EDUCATION')
      .replace(/^PROJEClS$/i, 'PROJECTS')
      .replace(/^CERTlFICATIONS$/i, 'CERTIFICATIONS');

    return l;
  });

  // 7. Reconstruct wrapped PDF lines within bullets & paragraphs
  const reconstructedLines: string[] = [];
  let currentBullet: string | null = null;

  lines.forEach(l => {
    if (!l) {
      if (currentBullet) {
        reconstructedLines.push(currentBullet);
        currentBullet = null;
      }
      return;
    }

    const isHeading = /^(PROFILE|SUMMARY|OBJECTIVE|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROJECTS|KEY PROJECTS|FEATURED PROJECTS|EDUCATION|ACADEMIC BACKGROUND|TECHNICAL SKILLS|SKILLS|CERTIFICATIONS|CERTIFICATES|LANGUAGES|PUBLICATIONS|ACHIEVEMENTS)$/i.test(l);
    const isBullet = /^[•●▪◦·*–—\-]\s*/.test(l);
    const isUrl = /^https?:\/\//i.test(l) || /^GitHub:\s*https?:\/\//i.test(l);
    const isTechPrefix = /^(?:Tech & Keywords|Technologies|Tech Stack|Built with|Tools|Stack)\s*:/i.test(l);

    if (isHeading || isUrl || isTechPrefix) {
      if (currentBullet) {
        reconstructedLines.push(currentBullet);
        currentBullet = null;
      }
      reconstructedLines.push(l);
    } else if (isBullet) {
      if (currentBullet) {
        reconstructedLines.push(currentBullet);
      }
      currentBullet = l;
    } else {
      if (currentBullet) {
        // Append continuation line to current bullet
        currentBullet += ' ' + l;
      } else {
        reconstructedLines.push(l);
      }
    }
  });

  if (currentBullet) {
    reconstructedLines.push(currentBullet);
  }

  return reconstructedLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Helper to split text into clean non-empty lines preserving line boundaries.
 */
export function getNormalizedLines(text: string): string[] {
  return normalizeResumeText(text)
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}
