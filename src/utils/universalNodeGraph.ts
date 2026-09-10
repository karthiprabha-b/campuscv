/**
 * universalNodeGraph.ts — Master Universal Semantic Node Graph Builder
 *
 * Implements 100% template-independent DOM introspection, container score calculation,
 * repeated sibling collection detection, and 3-Level Universal Hierarchy:
 *   Level 1: ELEMENT (text, heading, paragraph, image, button, link, badge, icon, divider) — BLUE (#3B82F6)
 *   Level 2: COMPONENT / CONTAINER (card, collection-item, container, group, grid) — PURPLE (#8B5CF6)
 *   Level 3: SECTION (hero, about, projects, experience, education, skills, contact) — AMBER (#F59E0B)
 */

import { getClassName } from './CanvasDOMScanner';

export interface SemanticNode {
  id: string;
  parentId: string | null;
  sectionId: string;
  containerKey: string;
  type:
    | 'section'
    | 'container'
    | 'collection'
    | 'collection-item'
    | 'text'
    | 'heading'
    | 'paragraph'
    | 'image'
    | 'button'
    | 'link'
    | 'icon'
    | 'divider'
    | 'badge'
    | 'list'
    | 'list-item'
    | 'custom';
  level: 1 | 2 | 3;
  color: string;
  semanticRole?: string;
  confidence?: number;
  binding?: string;
  bindingPath?: string;
  editable: boolean;
  deletable: boolean;
  movable: boolean;
  duplicatable: boolean;
  children: SemanticNode[];
  styles: Record<string, string>;
  source: 'template' | 'added' | 'cloned';
  el?: HTMLElement;
  text?: string;
  src?: string;
  href?: string;
  tagName: string;
  hasBlockChildren: boolean;
  label: string;
  containerScore?: number;
}

const LEAF_TEXT_TAGS = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'P', 'SPAN', 'SMALL', 'STRONG', 'EM', 'B', 'I',
  'LABEL', 'SUB', 'SUP', 'TIME', 'BLOCKQUOTE'
]);

/**
 * Calculates container score (0 - 100) to filter useless wrapper divs.
 * Requires containerScore >= 35 to expose as a selectable container node.
 */
export function calculateContainerScore(el: HTMLElement): number {
  let score = 0;
  const tag = el.tagName.toUpperCase();
  const classes = getClassName(el).toLowerCase();
  const id = (el.id || '').toLowerCase();

  // 1. Semantic HTML
  if (['ARTICLE', 'SECTION', 'HEADER', 'FOOTER', 'NAV', 'MAIN', 'ASIDE'].includes(tag)) {
    score += 25;
  }

  // 2. Class & ID Semantic Hints
  const cardKeywords = ['card', 'item', 'project', 'timeline', 'experience', 'education', 'skill', 'article'];
  if (cardKeywords.some(k => classes.includes(k) || id.includes(k))) {
    score += 30;
  }

  // 3. Repeated Sibling Structure
  if (el.parentElement) {
    const sibs = Array.from(el.parentElement.children).filter(c => c.tagName === tag);
    if (sibs.length >= 2) {
      score += 25;
    }
  }

  // 4. Computed Styles (Flex/Grid, Padding, Radius, Border, Shadow)
  if (typeof window !== 'undefined') {
    try {
      const comp = window.getComputedStyle(el);
      if (comp.display === 'flex' || comp.display === 'grid') score += 15;
      if (comp.borderStyle !== 'none' && comp.borderWidth !== '0px') score += 10;
      if (comp.borderRadius !== '0px' && comp.borderRadius !== '0%') score += 10;
      if (comp.boxShadow !== 'none') score += 10;
      if (comp.padding !== '0px') score += 5;
    } catch (e) {}
  }

  // 5. Descendant Elements
  const elementChildren = Array.from(el.children).filter(c =>
    !['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEMPLATE'].includes(c.tagName.toUpperCase())
  );
  if (elementChildren.length >= 2) score += 15;

  return score;
}

export function detectNodeType(el: HTMLElement): SemanticNode['type'] {
  const tag = el.tagName.toUpperCase();

  if (tag === 'IMG') return 'image';
  if (tag === 'A') return 'link';
  if (tag === 'BUTTON' || el.getAttribute('role') === 'button') return 'button';
  if (tag === 'HR') return 'divider';
  if (tag === 'SVG' || tag === 'I') return 'icon';
  if (['SECTION', 'HEADER', 'FOOTER', 'NAV', 'MAIN'].includes(tag)) return 'section';

  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) return 'heading';
  if (tag === 'P') return 'paragraph';

  const classes = getClassName(el).toLowerCase();

  if (tag === 'LI') return 'list-item';
  if (tag === 'UL' || tag === 'OL') return 'list';

  const isCard = classes.includes('card') ||
    classes.includes('item') ||
    classes.includes('project') ||
    classes.includes('timeline') ||
    classes.includes('article');

  if (isCard) return 'collection-item';

  const containerScore = calculateContainerScore(el);
  if (containerScore >= 35) {
    return 'container';
  }

  if (LEAF_TEXT_TAGS.has(tag)) return 'text';

  const elementChildren = Array.from(el.children).filter(c =>
    !['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEMPLATE'].includes(c.tagName.toUpperCase())
  );
  if (elementChildren.length === 0 && el.innerText && el.innerText.trim().length > 0) {
    return 'text';
  }

  return 'container';
}

export function getNodeLevelAndColor(type: SemanticNode['type']): { level: 1 | 2 | 3; color: string } {
  switch (type) {
    case 'section':
      return { level: 3, color: '#F59E0B' }; // Level 3: Section (Amber)
    case 'container':
    case 'collection':
    case 'collection-item':
    case 'list':
      return { level: 2, color: '#8B5CF6' }; // Level 2: Component/Container (Purple)
    default:
      return { level: 1, color: '#3B82F6' }; // Level 1: Leaf Element (Blue)
  }
}

export function generateFriendlyNodeLabel(el: HTMLElement, type: SemanticNode['type'], sectionId: string): string {
  const tag = el.tagName.toUpperCase();
  const text = (el.innerText || '').trim();
  const classes = getClassName(el).toLowerCase();
  const id = (el.id || '').toLowerCase();

  if (type === 'section') {
    return (sectionId || id || tag).toUpperCase();
  }

  if (type === 'collection-item') {
    if (sectionId === 'projects') return 'Project Card';
    if (sectionId === 'experience' || sectionId === 'work') return 'Experience Item';
    if (sectionId === 'education') return 'Education Card';
    if (sectionId === 'skills') return 'Skill Group';
    return 'Card Container';
  }

  if (type === 'container' || type === 'collection') {
    if (classes.includes('grid')) return 'Grid Layout';
    if (classes.includes('nav')) return 'Navigation Bar';
    if (classes.includes('hero')) return 'Hero Container';
    return 'Container';
  }

  if (text.length > 0) {
    return text.length > 24 ? `${text.substring(0, 24)}...` : text;
  }

  if (type === 'image') return 'Image';
  if (type === 'button') return 'Button';
  if (type === 'link') return 'Link';
  if (type === 'heading') return 'Heading';
  if (type === 'paragraph') return 'Paragraph';

  return tag;
}

export function extractElementStyles(el: HTMLElement): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const comp = window.getComputedStyle(el);
    return {
      color: comp.color || '',
      backgroundColor: comp.backgroundColor || '',
      fontSize: comp.fontSize || '',
      fontWeight: comp.fontWeight || '',
      fontFamily: comp.fontFamily || '',
      textAlign: comp.textAlign || '',
      borderRadius: comp.borderRadius || '',
      padding: comp.padding || '',
      margin: comp.margin || '',
      display: comp.display || '',
      flexDirection: comp.flexDirection || '',
      gap: comp.gap || '',
      border: comp.border || '',
      boxShadow: comp.boxShadow || '',
      width: comp.width || '',
      height: comp.height || ''
    };
  } catch (e) {
    return {};
  }
}

/**
 * Builds a complete hierarchical SemanticNode Graph from a rendered template DOM root.
 */
export function buildUniversalNodeGraph(
  rootEl: HTMLElement,
  options: { templateId?: string } = {}
): SemanticNode[] {
  if (!rootEl) return [];

  const nodeMap = new Map<HTMLElement, SemanticNode>();
  const rootNodes: SemanticNode[] = [];
  const tagCounters: Record<string, number> = {};

  const getSectionId = (el: HTMLElement): string => {
    let curr: HTMLElement | null = el;
    while (curr && curr !== rootEl.parentElement) {
      const id = (curr.id || '').toLowerCase();
      const secAttr = (curr.getAttribute('data-section') || '').toLowerCase();
      const cls = getClassName(curr).toLowerCase();

      if (secAttr) return secAttr.replace(/[^a-z0-9_-]/g, '');

      const known = [
        'hero', 'home', 'intro', 'about', 'skills', 'services',
        'projects', 'portfolio', 'experience', 'timeline', 'work', 'education',
        'academic', 'certifications', 'contact', 'footer', 'stats', 'header', 'nav'
      ];
      for (const k of known) {
        if (id === k || id.includes(k) || cls.includes(`${k}-section`) || cls.includes(`section-${k}`)) {
          return k;
        }
      }

      if (['SECTION', 'HEADER', 'FOOTER', 'NAV'].includes(curr.tagName.toUpperCase())) {
        return (id || curr.tagName.toLowerCase()).replace(/[^a-z0-9_-]/g, '');
      }

      curr = curr.parentElement;
    }
    return 'main';
  };

  const getContainerKey = (el: HTMLElement): string => {
    let curr: HTMLElement | null = el.parentElement;
    while (curr && curr !== rootEl.parentElement) {
      const tag = curr.tagName.toUpperCase();
      const cls = (curr.className || '').toString().toLowerCase();

      if (['SECTION', 'HEADER', 'FOOTER', 'NAV', 'MAIN'].includes(tag)) {
        return 'root';
      }

      if (tag === 'LI' || cls.includes('card') || cls.includes('item') || cls.includes('project') || cls.includes('timeline')) {
        let idx = 0;
        let sib: Element | null = curr.previousElementSibling;
        while (sib) {
          if (sib.tagName === curr.tagName || (getClassName(sib) && getClassName(sib) === getClassName(curr))) {
            idx++;
          }
          sib = sib.previousElementSibling;
        }
        return `${tag === 'LI' ? 'li' : 'card'}:${idx}`;
      }

      curr = curr.parentElement;
    }
    return 'root';
  };

  const elements = Array.from(rootEl.querySelectorAll('*')) as HTMLElement[];

  for (const el of elements) {
    const tag = el.tagName.toUpperCase();
    if (
      ['STYLE', 'SCRIPT', 'LINK', 'META', 'NOSCRIPT', 'HEAD', 'TEMPLATE'].includes(tag) ||
      el.closest('[data-campuscv-ignore-editor]') !== null ||
      el.closest('.campuscv-editor-ui') !== null
    ) {
      continue;
    }

    const type = detectNodeType(el);
    const { level, color } = getNodeLevelAndColor(type);
    const sectionId = getSectionId(el);
    const containerKey = getContainerKey(el);
    const tagKey = tag.toLowerCase();

    const counterKey = `${sectionId}:${containerKey}:${tagKey}`;
    const tagIndex = tagCounters[counterKey] || 0;
    tagCounters[counterKey] = tagIndex + 1;

    const nodeId = `${type}:${sectionId}:${containerKey}:${tagKey}:${tagIndex}`;
    const label = generateFriendlyNodeLabel(el, type, sectionId);
    const containerScore = calculateContainerScore(el);

    el.setAttribute('data-campus-node-id', nodeId);
    el.setAttribute('data-campus-node-type', type);
    el.setAttribute('data-campus-section', sectionId);
    el.setAttribute('data-campus-level', String(level));

    const hasBlockChildren = Array.from(el.children).some(child =>
      ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'DIV', 'SECTION', 'UL', 'OL', 'ARTICLE'].includes(child.tagName.toUpperCase())
    );

    const node: SemanticNode = {
      id: nodeId,
      parentId: null,
      sectionId,
      containerKey,
      type,
      level,
      color,
      editable: true,
      deletable: true,
      movable: true,
      duplicatable: true,
      children: [],
      styles: extractElementStyles(el),
      source: 'template',
      el,
      text: el.innerText ? el.innerText.trim() : undefined,
      src: tag === 'IMG' ? (el as HTMLImageElement).src : undefined,
      href: tag === 'A' ? (el as HTMLAnchorElement).href : undefined,
      tagName: tagKey,
      hasBlockChildren,
      label,
      containerScore
    };

    nodeMap.set(el, node);
  }

  nodeMap.forEach((node, el) => {
    let parentEl = el.parentElement;
    let parentNode: SemanticNode | undefined;

    while (parentEl && parentEl !== rootEl.parentElement) {
      if (nodeMap.has(parentEl)) {
        parentNode = nodeMap.get(parentEl);
        break;
      }
      parentEl = parentEl.parentElement;
    }

    if (parentNode) {
      node.parentId = parentNode.id;
      parentNode.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

export function findNodeById(nodes: SemanticNode[], id: string): SemanticNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}
