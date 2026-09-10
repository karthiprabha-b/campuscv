/**
 * templateSectionRegistry.ts — Universal Template Section Registry Engine (Phase 12)
 *
 * Enforces the 3-tier section architecture:
 *   1. TEMPLATE CAPABILITY (existsInTemplate): Uploaded template defines possible sections.
 *   2. USER ACTIVATION (active): Section is activated via onboarding data OR explicit editor '+ Add Section'.
 *   3. CURRENT CONTENT VISIBILITY (visible): Section is visible publicly ONLY if active AND itemCount > 0.
 */

export interface TemplateSectionRecord {
  id: string;
  label: string;
  dataKey?: string;
  existsInTemplate: boolean;
  onboardingActivated: boolean;
  active: boolean;
  repeatable: boolean;
  itemCount: number;
  visible: boolean;
  activationSource: 'onboarding' | 'editor' | 'none';
  selector: string;
  element?: HTMLElement | null;
}

export const KNOWN_SECTION_MAPPINGS: Array<{
  id: string;
  label: string;
  dataKey: string;
  selectors: string[];
  repeatable: boolean;
}> = [
  {
    id: 'hero',
    label: 'Hero & Intro',
    dataKey: 'hero',
    selectors: ['#hero', '.hero', '[data-section="hero"]', '#intro', '.intro'],
    repeatable: false
  },
  {
    id: 'about',
    label: 'About Me',
    dataKey: 'about',
    selectors: ['#about', '.about', '[data-section="about"]'],
    repeatable: false
  },
  {
    id: 'projects',
    label: 'Projects',
    dataKey: 'projects',
    selectors: ['#projects', '.projects', '[data-section="projects"]', '#work', '.work', '#portfolio', '.portfolio'],
    repeatable: true
  },
  {
    id: 'experience',
    label: 'Experience',
    dataKey: 'experience',
    selectors: ['#experience', '.experience', '[data-section="experience"]', '#work-experience', '#career'],
    repeatable: true
  },
  {
    id: 'education',
    label: 'Education',
    dataKey: 'education',
    selectors: ['#education', '.education', '[data-section="education"]', '#academic', '#degrees'],
    repeatable: true
  },
  {
    id: 'skills',
    label: 'Skills & Tech',
    dataKey: 'skills',
    selectors: ['#skills', '.skills', '[data-section="skills"]', '#tech-stack', '#technologies'],
    repeatable: true
  },
  {
    id: 'certifications',
    label: 'Certifications & Awards',
    dataKey: 'certifications',
    selectors: ['#certifications', '.certifications', '[data-section="certifications"]', '#awards', '#certificates'],
    repeatable: true
  },
  {
    id: 'services',
    label: 'Services',
    dataKey: 'services',
    selectors: ['#services', '.services', '[data-section="services"]', '#offerings'],
    repeatable: true
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    dataKey: 'testimonials',
    selectors: ['#testimonials', '.testimonials', '[data-section="testimonials"]', '#reviews', '#clients'],
    repeatable: true
  },
  {
    id: 'contact',
    label: 'Contact & Social',
    dataKey: 'contact',
    selectors: ['#contact', '.contact', '[data-section="contact"]', '#footer-contact', 'footer'],
    repeatable: false
  }
];

/**
 * Checks if user provided meaningful non-empty content during onboarding for a section.
 */
export function isOnboardingActivated(portfolioData: any, dataKey?: string): boolean {
  if (!portfolioData || !dataKey) return false;

  if (dataKey === 'hero' || dataKey === 'contact') {
    return true;
  }

  if (dataKey === 'about') {
    return Boolean(portfolioData.aboutMe || portfolioData.about?.description || portfolioData.profile?.summary);
  }

  let list: any = portfolioData[dataKey];
  if (dataKey === 'experience' && (!list || !Array.isArray(list))) {
    list = portfolioData.timeline;
  }
  if (dataKey === 'education' && (!list || !Array.isArray(list))) {
    list = portfolioData.timeline;
  }

  return Array.isArray(list) && list.length > 0;
}

/**
 * Calculates current item count for a given dataKey from portfolio payload.
 */
export function getSectionItemCount(portfolioData: any, dataKey?: string): number {
  if (!portfolioData || !dataKey) return 0;

  if (dataKey === 'hero' || dataKey === 'contact' || dataKey === 'about') {
    return isOnboardingActivated(portfolioData, dataKey) ? 1 : 0;
  }

  let list: any = portfolioData[dataKey];
  if (dataKey === 'experience' && (!list || !Array.isArray(list))) {
    list = portfolioData.timeline;
  }
  if (dataKey === 'education' && (!list || !Array.isArray(list))) {
    list = portfolioData.timeline;
  }

  if (Array.isArray(list)) {
    return list.length;
  }
  return 0;
}

/**
 * Discovers and builds the normalized Template Section Registry for a template DOM container.
 */
export function discoverTemplateSections(
  rootEl: HTMLElement | null,
  portfolioData: any = {}
): TemplateSectionRecord[] {
  const safeData = portfolioData || {};
  const mode = safeData.renderMode || safeData.mode || 'published';
  const resolvedTemplateId = safeData.templateId || safeData.layoutStyle || safeData.id || '';
  const isPublishedOrPreview = mode === 'published' || mode === 'preview';
  const activatedSections: string[] = Array.isArray(safeData.activatedSections)
    ? safeData.activatedSections
    : (Array.isArray(safeData.sections) ? safeData.sections : []);

  const records: TemplateSectionRecord[] = [];

  KNOWN_SECTION_MAPPINGS.forEach((mapping) => {
    let foundEl: HTMLElement | null = null;
    let matchedSelector = mapping.selectors[0];

    if (rootEl) {
      for (const sel of mapping.selectors) {
        const el = rootEl.querySelector(sel) as HTMLElement | null;
        if (el) {
          foundEl = el;
          matchedSelector = sel;
          break;
        }
      }
    }

    // 1. Template Capability (existsInTemplate)
    const existsInTemplate = rootEl ? Boolean(foundEl) : true;

    // 2. Onboarding Activation vs Editor Activation
    const onboardingActivated = isOnboardingActivated(safeData, mapping.dataKey);
    const editorActivated = activatedSections.includes(mapping.id) || activatedSections.includes(mapping.dataKey);

    const active = existsInTemplate && (onboardingActivated || editorActivated);

    const activationSource: 'onboarding' | 'editor' | 'none' = onboardingActivated
      ? 'onboarding'
      : (editorActivated ? 'editor' : 'none');

    // 3. Item Count & Visibility
    const itemCount = getSectionItemCount(safeData, mapping.dataKey);

    const isVisible = isPublishedOrPreview
      ? active && (mapping.repeatable ? itemCount > 0 : onboardingActivated)
      : active;

    const record: TemplateSectionRecord = {
      id: mapping.id,
      label: mapping.label,
      dataKey: mapping.dataKey,
      existsInTemplate,
      onboardingActivated,
      active,
      repeatable: mapping.repeatable,
      itemCount,
      visible: isVisible,
      activationSource,
      selector: matchedSelector,
      element: foundEl
    };

    records.push(record);
  });

  return records;
}
