import { ElementRegistration, ElementType, DetectedSection } from '../context/EditorContext';
import { isMeaningfulContainer } from './nodeClassifierEngine';

// ─────────────────────────────────────────────────────────────────────────────
// Heuristic field-path resolution
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_ID_MAP: Record<string, string> = {
  hero: 'hero',
  home: 'hero',
  intro: 'hero',
  about: 'about',
  bio: 'about',
  skills: 'skills',
  skill: 'skills',
  tech: 'skills',
  stack: 'skills',
  specialties: 'specialties',
  specialty: 'specialties',
  services: 'specialties',
  service: 'specialties',
  projects: 'projects',
  project: 'projects',
  portfolio: 'projects',
  experience: 'experience',
  timeline: 'experience',
  work: 'experience',
  education: 'education',
  academic: 'education',
  certifications: 'certifications',
  certificates: 'certifications',
  contact: 'contact',
  footer: 'footer',
  achievements: 'achievements',
  awards: 'awards',
  publications: 'publications',
  testimonials: 'testimonials',
  gallery: 'gallery',
  stats: 'stats',
};

const SECTION_ICON_MAP: Record<string, string> = {
  hero: '🏠',
  about: '👤',
  skills: '⚡',
  specialties: '✨',
  projects: '💻',
  experience: '💼',
  education: '🎓',
  certifications: '🏆',
  contact: '📬',
  footer: '📄',
  achievements: '🥇',
  awards: '🏅',
  publications: '📚',
  testimonials: '💬',
  gallery: '🖼️',
  stats: '📊',
};

const SECTION_LABEL_MAP: Record<string, string> = {
  hero: 'Hero',
  about: 'About',
  skills: 'Skills',
  specialties: 'Specialties',
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  contact: 'Contact',
  footer: 'Footer',
  achievements: 'Achievements',
  awards: 'Awards',
  publications: 'Publications',
  testimonials: 'Testimonials',
  gallery: 'Gallery',
  stats: 'Stats',
};

/**
 * Safely extracts class names as a string from any Element (HTML or SVG).
 * Handles HTML elements (className is string) and SVG elements (className is SVGAnimatedString).
 */
export function getClassName(el: Element | HTMLElement | null | undefined): string {
  if (!el) return '';
  const cn = (el as any).className;
  if (typeof cn === 'string') return cn;
  if (cn && typeof cn === 'object' && 'baseVal' in cn && typeof cn.baseVal === 'string') {
    return cn.baseVal;
  }
  if (typeof el.getAttribute === 'function') {
    return el.getAttribute('class') || '';
  }
  return '';
}

export function detectSectionId(el: HTMLElement): string {
  let current: HTMLElement | null = el;
  while (current) {
    const id = (current.id || '').toLowerCase();
    const classes = getClassName(current).toLowerCase();
    const dataSection = current.getAttribute('data-section') || '';

    const raw = id || dataSection || '';
    for (const key of Object.keys(SECTION_ID_MAP)) {
      if (raw.includes(key) || classes.includes(key + '-section') || classes.includes('section-' + key)) {
        return SECTION_ID_MAP[key];
      }
    }
    if (current.tagName === 'SECTION') {
      for (const key of Object.keys(SECTION_ID_MAP)) {
        if (classes.includes(key)) return SECTION_ID_MAP[key];
      }
    }
    current = current.parentElement;
  }
  return 'general';
}

function detectListIndex(el: HTMLElement): number | undefined {
  const dataIndex = el.getAttribute('data-index');
  if (dataIndex !== null) return parseInt(dataIndex);

  let current: HTMLElement | null = el.parentElement;
  let idx = 0;
  let sibling: Element | null = el.previousElementSibling;
  while (sibling) {
    idx++;
    sibling = sibling.previousElementSibling;
  }
  return idx;
}

export function resolveFieldPath(el: HTMLElement, sectionId?: string, tagName?: string, index?: number): string {
  // 1. Check direct data-cv attribute on el itself (Highest Priority Authoritative Contract)
  const directCv = el.getAttribute('data-cv');
  if (directCv) {
    const itemMatch = directCv.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]\.(.+)/);
    if (itemMatch) {
      return `${itemMatch[1]}[${itemMatch[2]}].${itemMatch[3]}`;
    }
    const directArrayMatch = directCv.match(/([a-zA-Z0-9_]+)\[(\d+)\]\.(.+)/);
    if (directArrayMatch) {
      return directCv;
    }
    const directIndexMatch = directCv.match(/([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (directIndexMatch) {
      return directCv;
    }
    const itemIndexMatch = directCv.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]/);
    if (itemIndexMatch) {
      return `${itemIndexMatch[1]}[${itemIndexMatch[2]}]`;
    }
    if (!directCv.startsWith('el-')) return directCv;
  }

  // 2. Direct data-field / data-edit-key / data-cv-field on el itself
  const directField = el.getAttribute('data-field') ||
    el.getAttribute('data-edit-key') ||
    el.getAttribute('data-cv-field') ||
    el.getAttribute('data-portly-field');
  if (directField && !directField.startsWith('el-')) return directField;

  // 3. Explicit data-node-id on el itself
  const directNodeId = el.getAttribute('data-node-id') || el.getAttribute('data-campus-node-id') || '';
  if (directNodeId) {
    const skillMatch = directNodeId.match(/text:skills:items:(\d+):([a-zA-Z0-9_]+)/);
    if (skillMatch) return `skills[${skillMatch[1]}].${skillMatch[2] === 'name' ? 'name' : (skillMatch[2] === 'exp' ? 'experience' : skillMatch[2])}`;

    const heroTechMatch = directNodeId.match(/text:hero:tech:(\d+)/);
    if (heroTechMatch) return `skills[${heroTechMatch[1]}]`;

    const statMatch = directNodeId.match(/text:about:card:(\d+):(value|label)/);
    if (statMatch) return `stats[${statMatch[1]}].${statMatch[2]}`;

    const statContainerMatch = directNodeId.match(/container:about:card:(\d+):stat/);
    if (statContainerMatch) return `stats[${statContainerMatch[1]}]`;

    const heroYearsVal = directNodeId.includes('hero:root:div:years_val');
    if (heroYearsVal) return 'profile.yearsOfExperience';
    const heroYearsLbl = directNodeId.includes('hero:root:div:years_lbl');
    if (heroYearsLbl) return 'hero.stats[0].label';
    const heroProjVal = directNodeId.includes('hero:root:div:projects_val');
    if (heroProjVal) return 'profile.projectsCompleted';
    const heroProjLbl = directNodeId.includes('hero:root:div:projects_lbl');
    if (heroProjLbl) return 'hero.stats[1].label';
    const heroCsatVal = directNodeId.includes('hero:root:div:csat_val');
    if (heroCsatVal) return 'hero.stats[2].value';
    const heroCsatLbl = directNodeId.includes('hero:root:div:csat_lbl');
    if (heroCsatLbl) return 'hero.stats[2].label';

    const heroGreeting = directNodeId.includes('hero:root:span:greeting');
    if (heroGreeting) return 'hero.greeting';
    const heroNickname = directNodeId.includes('hero:root:span:nickname');
    if (heroNickname) return 'profile.nickname';

    if (directNodeId.includes('about:badge:role')) return 'hero.role';
    if (directNodeId.includes('about:badge:location')) return 'hero.location';
    if (directNodeId.includes('about:root:eyebrow')) return 'about.eyebrow';
    if (directNodeId.includes('about:root:h2') || directNodeId.includes('about:root:headline')) return 'about.headline';
    if (directNodeId.includes('about:root:p') || directNodeId.includes('about:root:p:lead')) return 'about.description';
    if (directNodeId.includes('about:root:span:domain')) return 'about.domain';
    if (directNodeId.includes('about:root:span:coffee')) return 'about.coffee';
    if (directNodeId.includes('about:root:span:status')) return 'about.status';
    if (directNodeId.includes('about:root:span:location')) return 'about.location';
    if (directNodeId.includes('about:root:img')) return 'about.avatarUrl';

    if (directNodeId.includes('hero:root:badge')) return 'hero.availability';
    if (directNodeId.includes('hero:root:name') || directNodeId.includes('hero:root:h1')) return 'profile.name';
    if (directNodeId.includes('hero:root:role') || directNodeId.includes('hero:root:p:role') || directNodeId.includes('hero:root:h2')) return 'profile.headline';
    if (directNodeId.includes('hero:root:p:bio') || directNodeId.includes('hero:root:p')) return 'hero.description';
    if (directNodeId.includes('hero:root:btn')) return 'hero.ctaText';
    if (directNodeId.includes('hero:root:img')) return 'profile.photo';

    if (directNodeId.includes('contact:root:h2')) return 'contact.headline';
    if (directNodeId.includes('contact:root:p:desc')) return 'contact.subheadline';
    if (directNodeId.includes('contact:root:a:email')) return 'contact.email';
    if (directNodeId.includes('contact:root:span:location')) return 'contact.location';
    if (directNodeId.includes('contact:root:span:timezone')) return 'contact.timezone';
    if (directNodeId.includes('contact:root:span:availability')) return 'contact.availability';

    const projMatch = directNodeId.match(/text:(?:projects|portfolio):(?:card|items):(\d+):([a-zA-Z0-9_]+)/);
    if (projMatch) return `projects[${projMatch[1]}].${projMatch[2] === 'h3' || projMatch[2] === 'title' ? 'title' : (projMatch[2] === 'p' || projMatch[2] === 'desc' ? 'description' : projMatch[2])}`;

    const projImgMatch = directNodeId.match(/image:(?:projects|portfolio):(?:card|items):(\d+):([a-zA-Z0-9_]+)/);
    if (projImgMatch) return `projects[${projImgMatch[1]}].image`;

    const expMatch = directNodeId.match(/text:experience:(?:card|items|period|role|company|location):(\d+)(?::([a-zA-Z0-9_]+))?/);
    if (expMatch) {
      const subKey = expMatch[2] || (directNodeId.includes(':period:') ? 'period' : (directNodeId.includes(':role:') ? 'role' : (directNodeId.includes(':company:') ? 'company' : (directNodeId.includes(':location:') ? 'location' : 'title'))));
      return `experience[${expMatch[1]}].${subKey}`;
    }

    const eduMatch = directNodeId.match(/text:education:(?:card|items|period|institution|degree|grade):(\d+)(?::([a-zA-Z0-9_]+))?/);
    if (eduMatch) {
      const subKey = eduMatch[2] || (directNodeId.includes(':institution:') ? 'institution' : (directNodeId.includes(':degree:') ? 'degree' : (directNodeId.includes(':period:') ? 'period' : (directNodeId.includes(':grade:') ? 'grade' : 'degree'))));
      return `education[${eduMatch[1]}].${subKey === 'field' ? 'fieldOfStudy' : subKey}`;
    }

    const certMatch = directNodeId.match(/text:(?:certificates|certifications):(?:card|items|date|issuer|title):(\d+)(?::([a-zA-Z0-9_]+))?/);
    if (certMatch) {
      const subKey = certMatch[2] || (directNodeId.includes(':issuer:') ? 'issuer' : (directNodeId.includes(':date:') ? 'issueDate' : 'name'));
      return `certifications[${certMatch[1]}].${subKey}`;
    }
  }

  // 4. Closest ancestor data-cv or data-field mapping with smart child resolution
  const ancestorCvEl = el.closest('[data-cv]:not([data-cv^="el-"])') as HTMLElement | null;
  if (ancestorCvEl) {
    const cvAttr = ancestorCvEl.getAttribute('data-cv') || '';
    if (cvAttr.includes('[]')) {
      const parentItem = el.closest('[data-cv*="["]') as HTMLElement | null;
      const parentCv = parentItem?.getAttribute('data-cv') || '';
      const match = parentCv.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]/) || parentCv.match(/([a-zA-Z0-9_]+)\[(\d+)\]/);
      if (match) {
        const [, col, idxStr] = match;
        const sub = cvAttr.split('[]')[1]?.replace(/^\./, '') || 'image';
        return `${col}[${idxStr}].${sub}`;
      }
    }

    const itemMatch = cvAttr.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]\.(.+)/);
    if (itemMatch) {
      return `${itemMatch[1]}[${itemMatch[2]}].${itemMatch[3]}`;
    }

    // If the ancestor is an item container (e.g. data-cv="skills.items[0]" or data-cv="projects.items[0]")
    const itemContainerMatch = cvAttr.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]/) || cvAttr.match(/([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (itemContainerMatch && ancestorCvEl !== el) {
      const [, colName, idxStr] = itemContainerMatch;
      const tag = el.tagName.toUpperCase();
      const classes = getClassName(el).toLowerCase();

      if (tag === 'IMG') return `${colName}[${idxStr}].image`;
      if (tag === 'A') return `${colName}[${idxStr}].link`;
      if (['H1', 'H2', 'H3', 'H4'].includes(tag) || classes.includes('title')) {
        if (colName === 'experience') return `${colName}[${idxStr}].role`;
        if (colName === 'education') return `${colName}[${idxStr}].degree`;
        return `${colName}[${idxStr}].title`;
      }
      if (tag === 'P' || classes.includes('desc') || classes.includes('description')) {
        if (colName === 'experience') return `${colName}[${idxStr}].description`;
        if (colName === 'certifications') return `${colName}[${idxStr}].issuer`;
        return `${colName}[${idxStr}].description`;
      }
      if (tag === 'SPAN') {
        if (colName === 'skills') return `skills[${idxStr}]`;
        if (colName === 'experience') return `${colName}[${idxStr}].period`;
        if (colName === 'education') return `${colName}[${idxStr}].institution`;
        return `${colName}[${idxStr}].name`;
      }
      return `${colName}[${idxStr}]`;
    }

    if (ancestorCvEl === el && !cvAttr.startsWith('el-')) {
      const itemOnlyMatch = cvAttr.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]/);
      if (itemOnlyMatch) return `${itemOnlyMatch[1]}[${itemOnlyMatch[2]}]`;
      return cvAttr;
    }
  }

  const ancestor = el.closest('[data-field]:not([data-field^="el-"]), [data-edit-key]') as HTMLElement | null;
  if (ancestor) {
    const f = ancestor.getAttribute('data-field') || ancestor.getAttribute('data-edit-key');
    if (f) return f;
  }

  const sec = sectionId || detectSectionId(el);
  const tag = (tagName || el.tagName).toUpperCase();
  const classes = getClassName(el).toLowerCase();
  let idx = index;
  if (idx === undefined) {
    const container = el.closest('li, [class*="card"], [class*="project"], [class*="timeline"], [class*="experience-item"], [class*="cert"], [class*="stat"], [class*="badge"]');
    if (container) {
      idx = detectListIndex(container as HTMLElement);
    } else {
      idx = detectListIndex(el);
    }
  }
  if (idx === undefined) idx = 0;

  // Detect if element resides within a collection container (card, list-item, etc.)
  const hasContainer = !!el.closest('li, [class*="card"], [class*="project"], [class*="timeline"], [class*="experience-item"], [class*="cert"], [class*="stat"], [class*="badge"]');

  // Specific section mappings
  if (sec === 'navbar' || sec === 'header' || sec === 'nav') {
    if (tag === 'A' || tag === 'SPAN' || tag === 'H1' || tag === 'DIV' || classes.includes('brand') || classes.includes('logo')) {
      return 'navigation.brandName';
    }
  }

  if (sec === 'hero') {
    if (tag === 'H1' || tag === 'H2') return 'hero.title';
    if (tag === 'H3' || tag === 'H4') return 'hero.subtitle';
    if (tag === 'P') return 'hero.description';
    if (tag === 'IMG') return 'profile.photo';
  }

  if (sec === 'about') {
    if (classes.includes('stat') || el.closest('[class*="stat"]') || el.closest('[data-cv-collection*="stat"]')) {
      if (classes.includes('label')) return `stats[${idx}].label`;
      return `stats[${idx}].value`;
    }
    if (tag === 'H1' || tag === 'H2') return 'about.title';
    if (tag === 'H3' || tag === 'H4') return 'about.subtitle';
    if (tag === 'P') return 'about.description';
    if (tag === 'IMG') return 'profile.photo';
  }

  if (sec === 'specialties' || sec === 'services') {
    if (hasContainer) {
      if (tag === 'H3' || tag === 'H4' || classes.includes('title')) return `specialties[${idx}].title`;
      if (tag === 'P' || tag === 'SPAN' || classes.includes('desc') || classes.includes('description')) return `specialties[${idx}].description`;
      if (classes.includes('num') || classes.includes('icon')) return `specialties[${idx}].num`;
      return `specialties[${idx}].title`;
    } else {
      if (tag === 'H1' || tag === 'H2') return 'specialtiesHeading';
      if (tag === 'P') return 'specialtiesSubheading';
    }
  }

  if (sec === 'skills') {
    if (hasContainer || tag === 'SPAN' || tag === 'LI') {
      return `skills[${idx}]`;
    } else {
      if (tag === 'H1' || tag === 'H2') return 'skillsHeading';
      if (tag === 'P') return 'skillsSubheading';
    }
  }

  if (sec === 'projects') {
    if (hasContainer) {
      if (tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4' || classes.includes('title')) return `projects[${idx}].title`;
      if (tag === 'P' || classes.includes('desc') || classes.includes('description')) return `projects[${idx}].description`;
      if (tag === 'IMG' || classes.includes('img') || classes.includes('image')) return `projects[${idx}].image`;
      if (tag === 'A' || classes.includes('link')) return `projects[${idx}].link`;
      return `projects[${idx}].title`;
    } else {
      if (tag === 'H1' || tag === 'H2') return 'projectsHeading';
      if (tag === 'P') return 'projectsSubheading';
    }
  }

  if (sec === 'experience' || sec === 'education' || sec === 'work' || sec === 'timeline') {
    if (hasContainer) {
      if (tag === 'H3' || tag === 'H4' || classes.includes('title')) return `timeline[${idx}].title`;
      if (tag === 'P' || classes.includes('desc') || classes.includes('description')) return `timeline[${idx}].desc`;
      if (tag === 'SPAN' || tag === 'H5' || tag === 'H6' || classes.includes('company') || classes.includes('subtitle') || classes.includes('school') || classes.includes('date')) return `timeline[${idx}].subtitle`;
      return `timeline[${idx}].title`;
    } else {
      if (tag === 'H1' || tag === 'H2') return 'timelineHeading';
      if (tag === 'P') return 'timelineSubheading';
    }
  }

  if (sec === 'certifications') {
    if (tag === 'H3' || tag === 'H4') return `certifications[${idx}].name`;
    if (tag === 'P') return `certifications[${idx}].issuer`;
    if (tag === 'SPAN' || classes.includes('year') || classes.includes('date') || classes.includes('badge')) return `certifications[${idx}].date`;
  }

  if (sec === 'contact' || classes.includes('contact')) {
    if (classes.includes('banner') || el.closest('[class*="banner"]')) {
      if (tag === 'H2' || tag === 'H1') return 'collaborate.heading';
      if (tag === 'P') return 'collaborate.text';
    }
    if (tag === 'H1' || tag === 'H2') return 'contact.title';
    if (tag === 'P') return 'contact.subtitle';
  }

  if (sec === 'stats') {
    if (tag === 'H2' || tag === 'H3' || classes.includes('value')) return `stats[${idx}].value`;
    if (tag === 'P' || tag === 'SPAN' || classes.includes('label')) return `stats[${idx}].label`;
  }

  if (sec === 'contact' || sec === 'footer') {
    if (tag === 'A') {
      const href = (el.getAttribute('href') || '').toLowerCase();
      if (href.includes('github')) return 'social.github';
      if (href.includes('linkedin')) return 'social.linkedin';
      if (href.includes('twitter') || href.includes('x.com')) return 'social.twitter';
      if (href.includes('mailto:')) return 'social.email';
    }
    if (tag === 'H1' || tag === 'H2') return 'contactHeading';
    if (tag === 'P') return 'contactSubheading';
  }

  // Universal tag-based fallbacks across all layouts
  if (tag === 'H1' || tag === 'H2') return 'profile.name';
  if (tag === 'H3' || tag === 'H4') return 'profile.headline';
  if (tag === 'P') return 'profile.about';
  if (tag === 'IMG') return 'profile.photo';

  return 'profile.name';
}

function classifyElementType(el: HTMLElement): ElementType {
  const tag = el.tagName.toUpperCase();
  const classes = getClassName(el).toLowerCase();

  if (tag === 'IMG') return 'image';
  if (tag === 'BUTTON') return 'button';
  if (tag === 'A') return 'link';
  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) return 'heading';
  if (tag === 'P' || tag === 'SPAN') {
    // Could be stat value, badge label, etc.
    if (classes.includes('badge') || classes.includes('tag') || classes.includes('chip')) return 'badge';
    return 'text';
  }

  // Detect card-like containers
  if (
    tag === 'ARTICLE' ||
    classes.includes('card') ||
    classes.includes('project') ||
    classes.includes('timeline') ||
    classes.includes('experience-item') ||
    classes.includes('cert') ||
    isMeaningfulContainer(el)
  ) return 'card';

  // Lists
  if (tag === 'LI' || classes.includes('skill') || classes.includes('list-item')) return 'list';

  // Sections
  if (tag === 'SECTION' || classes.includes('section')) return 'section';

  return 'unknown';
}

function resolveElementLabel(el: HTMLElement, type: ElementType, sectionId: string): string {
  const nodeId = el.getAttribute('data-node-id') || '';
  const cv = el.getAttribute('data-cv') || '';

  if (nodeId.includes(':value:') || cv.endsWith('.value')) return 'Metric / Stat Number';
  if (nodeId.includes(':label:') || cv.endsWith('.label')) return 'Metric / Stat Label';
  if (nodeId.includes(':eyebrow:') || cv.endsWith('.eyebrow')) return 'Section Eyebrow';
  if (nodeId.includes(':role:') || cv === 'hero.role') return 'Role Badge';
  if (nodeId.includes(':location:') || cv === 'hero.location') return 'Location Badge';
  if (nodeId.includes(':badge:') || cv === 'hero.availability') return 'Availability Badge';
  if (nodeId.includes(':field:') || cv.endsWith('.fieldOfStudy')) return 'Field of Study';
  if (nodeId.includes(':degree:') || cv.endsWith('.degree')) return 'Degree';
  if (nodeId.includes(':institution:') || cv.endsWith('.institution')) return 'Institution / School';
  if (nodeId.includes(':company:') || cv.endsWith('.company')) return 'Company / Org';
  if (nodeId.includes(':period:') || cv.endsWith('.period') || cv.endsWith('.year')) return 'Timeline / Date';

  if (type === 'heading') return `${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Heading`;
  if (type === 'text') {
    if (sectionId === 'about' && (nodeId.includes(':p:') || cv === 'about.description' || cv === 'about.bio')) return 'Bio / Summary';
    if (sectionId === 'hero' && (nodeId.includes(':p:') || cv === 'hero.description')) return 'Hero Description';
    return el.textContent?.trim().slice(0, 24) || 'Paragraph Text';
  }
  if (type === 'image') return 'Image';
  if (type === 'button') return el.textContent?.trim().slice(0, 20) || 'Button';
  if (type === 'link') return el.textContent?.trim().slice(0, 20) || 'Link';
  if (type === 'card') return 'Card';
  if (type === 'list') return 'List Item';
  if (type === 'section') return SECTION_LABEL_MAP[sectionId] || 'Section';
  if (type === 'badge') return 'Badge';
  return 'Element';
}

// ─────────────────────────────────────────────────────────────────────────────
// NON-EDITABLE element filter
// ─────────────────────────────────────────────────────────────────────────────

const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'HEAD', 'META', 'LINK', 'SVG', 'PATH', 'NOSCRIPT']);

function isEditableCandidate(el: HTMLElement): boolean {
  const tag = el.tagName.toUpperCase();
  if (IGNORED_TAGS.has(tag)) return false;
  if (el.getAttribute('data-no-edit') === 'true') return false;
  if (getClassName(el).includes('uploaded-template-runner')) return false;
  if (el.closest('[data-no-edit="true"]')) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION SCANNER
// ─────────────────────────────────────────────────────────────────────────────

export function scanSections(containerEl: HTMLElement): DetectedSection[] {
  const found: DetectedSection[] = [];
  const seen = new Set<string>();

  const candidates = containerEl.querySelectorAll(
    'section, [id], [data-section], [class*="section"]'
  );

  let order = 0;
  candidates.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const id = (htmlEl.id || htmlEl.getAttribute('data-section') || '').toLowerCase();
    const classes = getClassName(htmlEl).toLowerCase();

    let mappedId = '';
    for (const key of Object.keys(SECTION_ID_MAP)) {
      if (id.includes(key) || classes.includes(key + '-section') || classes.includes('section-' + key)) {
        mappedId = SECTION_ID_MAP[key];
        break;
      }
    }

    if (!mappedId || seen.has(mappedId)) return;
    seen.add(mappedId);

    found.push({
      id: mappedId,
      label: SECTION_LABEL_MAP[mappedId] || mappedId,
      icon: SECTION_ICON_MAP[mappedId] || '📄',
      el: htmlEl,
      isVisible: true,
      order: order++,
    });
  });

  return found;
}

// ─────────────────────────────────────────────────────────────────────────────
// ELEMENT REGISTRY BUILDER
// ─────────────────────────────────────────────────────────────────────────────

const SCANNABLE_SELECTORS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'span', 'strong', 'em', 'small', 'b', 'i',
  'img',
  'button',
  'a',
  'li',
  'div',
  '[data-field]',
  '[data-edit-key]',
  '[class*="card"]',
  '[class*="skill"]',
  '[class*="project"]',
  '[class*="timeline"]',
  '[class*="cert"]',
  '[class*="stat"]',
  '[class*="badge"]',
].join(', ');

import { ValidationReport } from '../context/EditorContext';

export function buildElementRegistry(
  containerEl: HTMLElement,
  registerFn: (reg: ElementRegistration) => void,
  clearFn: () => void
): ValidationReport {
  clearFn();

  // Track index counters per section to give correct array indices
  const sectionIndexCounters: Record<string, Record<string, number>> = {};

  const elements = containerEl.querySelectorAll(SCANNABLE_SELECTORS);

  let scannedElementsCount = 0;
  let registeredCount = 0;
  let autoBoundCount = 0;
  let blockedElementsCount = 0;
  const missingRegistrations: string[] = [];

  elements.forEach((rawEl) => {
    const el = rawEl as HTMLElement;
    if (!isEditableCandidate(el)) return;

    scannedElementsCount++;

    // Unblock pointer events if pointer-events was disabled
    try {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.pointerEvents === 'none') {
        blockedElementsCount++;
      }
    } catch {
      // Ignore style evaluation errors on disconnected nodes
    }

    const tag = el.tagName.toUpperCase();
    const elementType = classifyElementType(el);
    const sectionId = detectSectionId(el);

    if (!sectionIndexCounters[sectionId]) {
      sectionIndexCounters[sectionId] = {};
    }
    const sectionCounters = sectionIndexCounters[sectionId];

    // Calculate index for array-type elements
    let index: number | undefined;
    if (['card', 'list'].includes(elementType) || ['LI', 'IMG'].includes(tag)) {
      const typeKey = elementType + tag;
      if (sectionCounters[typeKey] === undefined) sectionCounters[typeKey] = 0;
      index = sectionCounters[typeKey];
    }

    let fieldPath = resolveFieldPath(el, sectionId, tag, index);

    if (tag === 'IMG' || elementType === 'image') {
      if (!fieldPath || fieldPath.startsWith('general.') || fieldPath.includes('element')) {
        fieldPath = sectionId === 'projects' ? `projects[${index || 0}].image` : (sectionId === 'about' ? 'about.avatarUrl' : 'profileImage');
      }
    }

    // Increment counter after resolve
    if (index !== undefined) {
      const typeKey = elementType + tag;
      sectionCounters[typeKey] = (sectionCounters[typeKey] || 0) + 1;
    }

    const label = resolveElementLabel(el, elementType, sectionId);

    registerFn({
      el,
      fieldPath,
      elementType,
      sectionId,
      index,
      label,
    });

    registeredCount++;
  });

  const healthRatio = scannedElementsCount > 0
    ? `100% (${registeredCount}/${scannedElementsCount} fields registered)`
    : '100% (0 fields scanned)';

  return {
    scannedElementsCount,
    registeredCount,
    autoBoundCount,
    blockedElementsCount,
    healthRatio,
    missingRegistrations,
  };
}
