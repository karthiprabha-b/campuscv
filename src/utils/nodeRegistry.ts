/**
 * nodeRegistry.ts — Universal Node Discovery & Single Source of Truth Registry
 *
 * Automatically discovers, classifies, and registers all meaningful DOM elements in any
 * arbitrary uploaded or built-in template WITHOUT requiring hardcoded template attributes.
 *
 * Uses a WeakMap (elementNodeMap) and Map (nodeRegistryMap) for zero-latency node lookup.
 */

import { classifyDOMNode, isMeaningfulContainer, UniversalNodeType } from './nodeClassifierEngine';
import { calculateContainerScore } from './universalNodeGraph';
import { getClassName } from './CanvasDOMScanner';

export interface NodeRecord {
  nodeId: string;
  parentId: string | null;
  sectionId: string;
  type: UniversalNodeType;
  level: 1 | 2 | 3;
  label: string;
  tagName: string;
  el: HTMLElement;
  containerKey: string;
  isContainer: boolean;
}

// In-Memory Fast Lookup Maps
export const elementNodeMap = new WeakMap<HTMLElement, NodeRecord>();
export const nodeRegistryMap = new Map<string, NodeRecord>();

/**
 * Detects section ID from element or ancestors.
 */
export function getSectionIdFromDOM(el: HTMLElement, rootEl: HTMLElement): string {
  let curr: HTMLElement | null = el;
  while (curr && curr !== rootEl.parentElement) {
    const id = (curr.id || '').toLowerCase();
    const cvSection = (curr.getAttribute('data-cv-section') || '').toLowerCase();
    const dataSec = (curr.getAttribute('data-section') || curr.getAttribute('data-campus-section') || '').toLowerCase();
    const classes = getClassName(curr).toLowerCase();

    if (cvSection) return cvSection.replace(/[^a-z0-9_-]/g, '');
    if (dataSec) return dataSec.replace(/[^a-z0-9_-]/g, '');

    const knownSections = [
      'hero', 'home', 'intro', 'about', 'skills', 'specialties', 'services',
      'projects', 'portfolio', 'experience', 'timeline', 'work', 'education',
      'academic', 'certifications', 'awards', 'publications', 'research',
      'contact', 'footer', 'stats', 'gallery', 'testimonials', 'achievements', 'header', 'nav'
    ];

    for (const sec of knownSections) {
      if (id === sec || id.includes(sec) || classes.includes(`${sec}-section`) || classes.includes(`section-${sec}`)) {
        return sec;
      }
    }

    if (['SECTION', 'HEADER', 'FOOTER', 'NAV'].includes(curr.tagName.toUpperCase())) {
      return (id || curr.tagName.toLowerCase()).replace(/[^a-z0-9_-]/g, '');
    }

    curr = curr.parentElement;
  }
  return 'main';
}

/**
 * Detects container context / repeated sibling index.
 */
export function getContainerKeyFromDOM(el: HTMLElement, rootEl: HTMLElement): string {
  let curr: HTMLElement | null = el.parentElement;
  while (curr && curr !== rootEl.parentElement) {
    const tag = curr.tagName.toUpperCase();
    const classes = getClassName(curr).toLowerCase();

    if (['SECTION', 'HEADER', 'FOOTER', 'NAV', 'MAIN'].includes(tag)) {
      return 'root';
    }

    if (tag === 'ARTICLE' || tag === 'LI' || isMeaningfulContainer(curr) || classes.includes('card') || classes.includes('item') || classes.includes('project') || classes.includes('timeline')) {
      let idx = 0;
      let sib: Element | null = curr.previousElementSibling;
      while (sib) {
        if (sib.tagName === curr.tagName || (getClassName(sib) && getClassName(sib) === getClassName(curr))) {
          idx++;
        }
        sib = sib.previousElementSibling;
      }
      const prefix = tag === 'LI' ? 'li' : (tag === 'ARTICLE' ? 'article' : 'card');
      return `${prefix}:${idx}`;
    }

    curr = curr.parentElement;
  }
  return 'root';
}

/**
 * Detects repeated sibling structures and promotes siblings into collection-item containers.
 */
export function promoteRepeatedSiblings(rootEl: HTMLElement): Map<HTMLElement, { isCollection: boolean; isItem: boolean; collectionIndex: number }> {
  const map = new Map<HTMLElement, { isCollection: boolean; isItem: boolean; collectionIndex: number }>();
  if (!rootEl) return map;

  const parents = Array.from(rootEl.querySelectorAll('*')) as HTMLElement[];

  for (const parent of parents) {
    const children = Array.from(parent.children).filter(c => {
      const tag = c.tagName.toUpperCase();
      return !['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEMPLATE', 'BR', 'HR'].includes(tag) &&
             !c.closest('.campuscv-editor-ui') &&
             !c.closest('.floating-toolbar');
    }) as HTMLElement[];

    if (children.length < 2) continue;

    // Group children by tagName or structural container pattern
    const groups = new Map<string, HTMLElement[]>();
    for (const child of children) {
      const tag = child.tagName.toUpperCase();
      const childCount = child.children.length;
      const key = `${tag}:${childCount > 0 ? 'container' : 'leaf'}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(child);
    }

    for (const [, group] of groups.entries()) {
      if (group.length >= 2) {
        map.set(parent, { isCollection: true, isItem: false, collectionIndex: 0 });
        group.forEach((item, idx) => {
          map.set(item, { isCollection: false, isItem: true, collectionIndex: idx });
        });
      }
    }
  }

  return map;
}

/**
 * Scans template root, discovers all meaningful elements, classifies them,
 * stamps data-campus-node-id attributes, and registers them in memory.
 */
export function discoverAndRegisterNodes(rootEl: HTMLElement | null, templateId: string = 'template'): NodeRecord[] {
  if (!rootEl) return [];

  nodeRegistryMap.clear();
  const records: NodeRecord[] = [];
  const tagCounters: Record<string, number> = {};

  const repeatedMap = promoteRepeatedSiblings(rootEl);
  const allElements = Array.from(rootEl.querySelectorAll('*')) as HTMLElement[];

  for (const el of allElements) {
    const tag = el.tagName.toUpperCase();

    // Ignore non-visual tags and editor UI chrome
    if (
      ['STYLE', 'SCRIPT', 'LINK', 'META', 'NOSCRIPT', 'HEAD', 'TEMPLATE', 'IFRAME'].includes(tag) ||
      el.closest('[data-campuscv-ignore-editor]') !== null ||
      el.closest('.campuscv-editor-ui') !== null ||
      el.closest('.floating-toolbar') !== null ||
      el.hasAttribute('data-toolbar')
    ) {
      continue;
    }

    let classification = classifyDOMNode(el);
    const repeatedInfo = repeatedMap.get(el);

    if (repeatedInfo?.isItem) {
      classification = { type: 'collection-item', level: 2, label: 'Card', isContainer: true };
    } else if (repeatedInfo?.isCollection) {
      classification = { type: 'collection', level: 2, label: 'Collection Grid', isContainer: true };
    }

    if (classification.type === 'ignore') continue;

    const sectionId = getSectionIdFromDOM(el, rootEl);
    const containerKey = getContainerKeyFromDOM(el, rootEl);
    const tagKey = tag.toLowerCase();

    const counterKey = `${classification.type}:${sectionId}:${containerKey}:${tagKey}`;
    const tagIndex = tagCounters[counterKey] || 0;
    tagCounters[counterKey] = tagIndex + 1;

    let nodeId = el.getAttribute('data-cv-id') || el.getAttribute('data-campus-node-id') || el.getAttribute('data-edit-key') || el.getAttribute('data-node-id');
    if (!nodeId) {
      nodeId = `${classification.type}:${sectionId}:${containerKey}:${tagKey}:${tagIndex}`;
      el.setAttribute('data-campus-node-id', nodeId);
    }

    el.setAttribute('data-campus-node-type', classification.type);
    el.setAttribute('data-campus-section', sectionId);
    el.setAttribute('data-campus-level', String(classification.level));

    const record: NodeRecord = {
      nodeId,
      parentId: null,
      sectionId,
      type: classification.type,
      level: classification.level,
      label: classification.label || tagKey,
      tagName: tagKey,
      el,
      containerKey,
      isContainer: classification.isContainer
    };

    elementNodeMap.set(el, record);
    nodeRegistryMap.set(nodeId, record);
    records.push(record);
  }

  // Resolve parentIds
  records.forEach(rec => {
    let parentEl = rec.el.parentElement;
    while (parentEl && parentEl !== rootEl.parentElement) {
      if (elementNodeMap.has(parentEl)) {
        rec.parentId = elementNodeMap.get(parentEl)!.nodeId;
        break;
      }
      parentEl = parentEl.parentElement;
    }
  });

  console.log(`[NODE DISCOVERY] Discovered & registered ${records.length} nodes for template '${templateId}'.`);
  return records;
}

/**
 * Instant Node Lookup for Hit-Testing.
 * Tries WeakMap first, then data attribute, then runtime classification fallback.
 */
export function getOrRegisterNode(el: HTMLElement | null, rootEl?: HTMLElement | null): NodeRecord | null {
  if (!el || !el.tagName) return null;

  // 1. WeakMap Fast Lookup
  if (elementNodeMap.has(el)) {
    return elementNodeMap.get(el)!;
  }

  // 2. DOM Attribute Lookup
  const nodeId = el.getAttribute('data-cv-id') || el.getAttribute('data-campus-node-id') || el.getAttribute('data-edit-key') || el.getAttribute('data-node-id');
  if (nodeId && nodeRegistryMap.has(nodeId)) {
    const rec = nodeRegistryMap.get(nodeId)!;
    elementNodeMap.set(el, rec);
    return rec;
  }

  // 3. Runtime Discovery Fallback
  const classification = classifyDOMNode(el);
  if (classification.type === 'ignore') return null;

  const sectionId = rootEl ? getSectionIdFromDOM(el, rootEl) : (el.getAttribute('data-campus-section') || 'main');
  const containerKey = rootEl ? getContainerKeyFromDOM(el, rootEl) : 'root';
  const tagKey = el.tagName.toLowerCase();
  const generatedId = nodeId || `${classification.type}:${sectionId}:${containerKey}:${tagKey}:0`;

  el.setAttribute('data-campus-node-id', generatedId);
  el.setAttribute('data-campus-node-type', classification.type);
  el.setAttribute('data-campus-section', sectionId);
  el.setAttribute('data-campus-level', String(classification.level));

  const record: NodeRecord = {
    nodeId: generatedId,
    parentId: null,
    sectionId,
    type: classification.type,
    level: classification.level,
    label: classification.label || tagKey,
    tagName: tagKey,
    el,
    containerKey,
    isContainer: classification.isContainer
  };

  elementNodeMap.set(el, record);
  nodeRegistryMap.set(generatedId, record);
  return record;
}
