/**
 * manifestNormalizer.ts — CampusCV Universal Manifest Normalizer
 *
 * Normalizes manifest representations from various ZIP formats (string array vs object array)
 * into a single canonical ManifestRecord interface consumed by the editor engine.
 */

export interface NormalizedManifestSection {
  id: string;
  name: string;
  component: string;
  description?: string;
}

export interface HeaderBehaviorMetadata {
  enabled: boolean;
  sticky: boolean;
  top: number;
  zIndex: number;
}

export interface RuntimeCapabilityMetadata {
  javascript: boolean;
  animations: boolean;
  scrollEffects: boolean;
  smoothScroll: boolean;
  interactions: boolean;
  responsiveBehavior: boolean;
}

export interface NormalizedManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: string;
  supportsDarkMode: boolean;
  entry: string;
  sections: NormalizedManifestSection[];
  header?: HeaderBehaviorMetadata;
  runtime?: RuntimeCapabilityMetadata;
  themeConfig?: Record<string, any>;
}

export function normalizeManifest(rawManifest: any): NormalizedManifest {
  if (!rawManifest || typeof rawManifest !== 'object') {
    return {
      id: 'default',
      name: 'Default Portfolio',
      version: '1.0.0',
      author: 'CampusCV',
      description: 'Default portfolio manifest',
      category: 'General',
      supportsDarkMode: true,
      entry: 'src/App.jsx',
      sections: [],
      header: { enabled: true, sticky: true, top: 0, zIndex: 100 }
    };
  }

  const id = rawManifest.id || rawManifest.templateId || 'template';
  const name = rawManifest.name || id;
  const version = rawManifest.version || '1.0.0';
  const author = rawManifest.author || 'CampusCV';
  const description = rawManifest.description || '';
  const category = rawManifest.category || 'General';
  const supportsDarkMode = Boolean(rawManifest.supportsDarkMode);
  const entry = rawManifest.entry || rawManifest.entryFile || 'src/App.jsx';

  // Header Behavior Metadata parsing
  const rawHeader = rawManifest.header;
  const header: HeaderBehaviorMetadata = {
    enabled: rawHeader?.enabled !== false,
    sticky: rawHeader?.sticky !== false,
    top: typeof rawHeader?.top === 'number' ? rawHeader.top : 0,
    zIndex: typeof rawHeader?.zIndex === 'number' ? rawHeader.zIndex : 100
  };

  // Runtime Capabilities Metadata parsing
  const rawRuntime = rawManifest.runtime;
  const runtime: RuntimeCapabilityMetadata = {
    javascript: rawRuntime?.javascript !== false,
    animations: rawRuntime?.animations !== false,
    scrollEffects: rawRuntime?.scrollEffects !== false,
    smoothScroll: rawRuntime?.smoothScroll !== false,
    interactions: rawRuntime?.interactions !== false,
    responsiveBehavior: rawRuntime?.responsiveBehavior !== false
  };

  let rawSections = rawManifest.sections || rawManifest.sectionList || [];
  if (!Array.isArray(rawSections)) {
    rawSections = [];
  }

  const normalizedSections: NormalizedManifestSection[] = rawSections.map((sec: any, idx: number) => {
    if (typeof sec === 'string') {
      const secId = sec.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      return {
        id: secId || `section-${idx}`,
        name: sec,
        component: sec
      };
    }
    if (typeof sec === 'object' && sec !== null) {
      const secId = (sec.id || sec.name || sec.component || `section-${idx}`).toLowerCase().replace(/[^a-z0-9_-]/g, '');
      return {
        id: secId,
        name: sec.name || sec.id || `Section ${idx + 1}`,
        component: sec.component || sec.name || sec.id || 'Section',
        description: sec.description
      };
    }
    return {
      id: `section-${idx}`,
      name: `Section ${idx + 1}`,
      component: 'Section'
    };
  });

  return {
    id,
    name,
    version,
    author,
    description,
    category,
    supportsDarkMode,
    entry,
    sections: normalizedSections,
    header,
    runtime,
    themeConfig: rawManifest.themeConfig
  };
}
