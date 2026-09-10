/**
 * SemanticFieldDetector.ts — Universal Semantic & Placeholder Field Detector
 *
 * Inspects DOM elements and JSX trees for semantic clues:
 * attributes (data-cv-field, id, className), text content, placeholders, href, src, alt.
 */

export interface DetectionResult {
  field: string;
  confidence: number;
  source: 'EXPLICIT' | 'MANIFEST' | 'AUTO_DETECTED' | 'DEMO_PLACEHOLDER';
  targetPath?: string;
  originalValue?: string;
}

const DEMO_NAMES = new Set([
  'alex morgan', 'alex rivera', 'john doe', 'jane smith',
  'sarah jenkins', 'david miller', 'alexander wang', 'priya sharma',
  'your name', 'your name here', 'demo name', 'sample user'
]);

const DEMO_TITLES = new Set([
  'product designer', 'software developer', 'software engineer',
  'ui/ux designer', 'full stack developer', 'data scientist',
  'computer science student', 'frontend engineer', 'creative director'
]);

const DEMO_EMAILS = new Set([
  'demo@example.com', 'alex@rivera.com', 'hello@example.com',
  'john@example.com', 'user@example.com'
]);

/**
 * Detects explicit data-cv-field or data-field attributes on an element.
 */
export function detectExplicitBinding(el: HTMLElement): DetectionResult | null {
  const explicit =
    el.getAttribute('data-cv-field') ||
    el.getAttribute('data-cv') ||
    el.getAttribute('data-field') ||
    el.getAttribute('data-editable');

  if (explicit && explicit.trim()) {
    const field = explicit.trim();
    return {
      field,
      confidence: 1.0,
      source: 'EXPLICIT',
      originalValue: el.innerText || el.getAttribute('href') || (el as HTMLImageElement).src || ''
    };
  }
  return null;
}

/**
 * Evaluates semantic field candidates and confidence for a given DOM element.
 */
export function detectElementSemanticField(el: HTMLElement): DetectionResult | null {
  // 1. Explicit Check First
  const explicit = detectExplicitBinding(el);
  if (explicit) return explicit;

  const tag = el.tagName.toUpperCase();
  const text = (el.innerText || el.textContent || '').trim();
  const lowerText = text.toLowerCase();

  const href = (el.getAttribute('href') || '').toLowerCase();
  const src = tag === 'IMG' ? ((el as HTMLImageElement).src || '').toLowerCase() : '';
  const alt = (el.getAttribute('alt') || '').toLowerCase();
  const title = (el.getAttribute('title') || '').toLowerCase();

  const classes = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
  const id = (el.id || '').toLowerCase();

  // Detect Section Container Context
  let current: HTMLElement | null = el.parentElement;
  let sectionContext = 'root';
  while (current && current.tagName !== 'BODY') {
    const secId = (current.id || current.getAttribute('data-section') || '').toLowerCase();
    const secClass = (current.className && typeof current.className === 'string' ? current.className : '').toLowerCase();

    if (current.tagName === 'SECTION' || current.tagName === 'HEADER' || current.tagName === 'FOOTER' || secId || secClass) {
      const combinedSec = `${secId} ${secClass}`;
      if (combinedSec.includes('hero') || combinedSec.includes('home') || combinedSec.includes('intro')) {
        sectionContext = 'hero';
        break;
      }
      if (combinedSec.includes('about')) {
        sectionContext = 'about';
        break;
      }
      if (combinedSec.includes('contact') || combinedSec.includes('footer')) {
        sectionContext = 'contact';
        break;
      }
      if (combinedSec.includes('projects') || combinedSec.includes('portfolio') || combinedSec.includes('work')) {
        sectionContext = 'projects';
        break;
      }
      if (combinedSec.includes('experience') || combinedSec.includes('timeline')) {
        sectionContext = 'experience';
        break;
      }
      if (combinedSec.includes('education') || combinedSec.includes('academic')) {
        sectionContext = 'education';
        break;
      }
    }
    current = current.parentElement;
  }

  // 2. Social Links Detection (Anchor `a`)
  if (tag === 'A' || href) {
    if (href.startsWith('mailto:') || DEMO_EMAILS.has(lowerText) || lowerText.includes('@example.com')) {
      return { field: 'email', confidence: 0.98, source: 'DEMO_PLACEHOLDER', originalValue: href || text };
    }
    if (href.includes('linkedin.com') || classes.includes('linkedin') || id.includes('linkedin') || lowerText.includes('linkedin')) {
      return { field: 'socials.linkedin', confidence: 0.98, source: 'AUTO_DETECTED', originalValue: href };
    }
    if (href.includes('github.com') || classes.includes('github') || id.includes('github') || lowerText.includes('github')) {
      return { field: 'socials.github', confidence: 0.98, source: 'AUTO_DETECTED', originalValue: href };
    }
    if (href.includes('dribbble.com') || classes.includes('dribbble') || id.includes('dribbble') || lowerText.includes('dribbble')) {
      return { field: 'socials.dribbble', confidence: 0.98, source: 'AUTO_DETECTED', originalValue: href };
    }
    if (href.includes('behance.net') || classes.includes('behance') || id.includes('behance') || lowerText.includes('behance')) {
      return { field: 'socials.behance', confidence: 0.98, source: 'AUTO_DETECTED', originalValue: href };
    }
    if (href.includes('instagram.com') || classes.includes('instagram') || id.includes('instagram') || lowerText.includes('instagram')) {
      return { field: 'socials.instagram', confidence: 0.98, source: 'AUTO_DETECTED', originalValue: href };
    }
    if (href.includes('twitter.com') || href.includes('x.com') || classes.includes('twitter') || id.includes('twitter') || lowerText.includes('twitter')) {
      return { field: 'socials.twitter', confidence: 0.98, source: 'AUTO_DETECTED', originalValue: href };
    }
    if (href.includes('facebook.com') || classes.includes('facebook') || id.includes('facebook')) {
      return { field: 'socials.facebook', confidence: 0.95, source: 'AUTO_DETECTED', originalValue: href };
    }
    if (href.includes('youtube.com') || classes.includes('youtube') || id.includes('youtube')) {
      return { field: 'socials.youtube', confidence: 0.95, source: 'AUTO_DETECTED', originalValue: href };
    }
  }

  // 3. Profile Image Detection (`img`)
  if (tag === 'IMG') {
    const isAvatarContext =
      sectionContext === 'hero' || sectionContext === 'about' ||
      classes.includes('avatar') || classes.includes('profile') || classes.includes('portrait') || classes.includes('photo') ||
      alt.includes('avatar') || alt.includes('profile') || alt.includes('portrait') || alt.includes('alex') ||
      id.includes('avatar') || id.includes('profile') || id.includes('portrait') ||
      src.includes('portrait') || src.includes('avatar') || src.includes('profile') || src.includes('alex');

    if (isAvatarContext) {
      return { field: 'profileImage', confidence: 0.98, source: 'AUTO_DETECTED', originalValue: src };
    }
  }

  // 4. Email Text Detection
  if (DEMO_EMAILS.has(lowerText) || lowerText.includes('@example.com') || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
    return { field: 'email', confidence: 0.98, source: 'DEMO_PLACEHOLDER', originalValue: text };
  }

  // 5. Phone Number Detection
  if (/^\+?[0-9\s\-()]{7,20}$/.test(text) && (classes.includes('phone') || id.includes('phone') || sectionContext === 'contact')) {
    return { field: 'phone', confidence: 0.95, source: 'AUTO_DETECTED', originalValue: text };
  }

  // 6. Name Placeholder Detection (in Hero/Profile context)
  if (sectionContext === 'hero' || sectionContext === 'about') {
    if (DEMO_NAMES.has(lowerText)) {
      return { field: 'name', confidence: 0.96, source: 'DEMO_PLACEHOLDER', originalValue: text };
    }
    if ((tag === 'H1' || classes.includes('name') || id.includes('name')) && text.length > 2 && text.length < 50) {
      return { field: 'name', confidence: 0.94, source: 'AUTO_DETECTED', originalValue: text };
    }
  }

  // 7. Role / Headline Placeholder Detection
  if (sectionContext === 'hero' || sectionContext === 'about') {
    if (DEMO_TITLES.has(lowerText)) {
      return { field: 'headline', confidence: 0.96, source: 'DEMO_PLACEHOLDER', originalValue: text };
    }
    if ((tag === 'H2' || tag === 'H3' || classes.includes('role') || classes.includes('headline') || classes.includes('subtitle')) && text.length > 3 && text.length < 80) {
      return { field: 'headline', confidence: 0.92, source: 'AUTO_DETECTED', originalValue: text };
    }
  }

  // 8. Bio / Summary Detection
  if ((sectionContext === 'hero' || sectionContext === 'about') && tag === 'P' && text.length > 30) {
    return { field: 'bio', confidence: 0.90, source: 'AUTO_DETECTED', originalValue: text };
  }

  return null;
}
