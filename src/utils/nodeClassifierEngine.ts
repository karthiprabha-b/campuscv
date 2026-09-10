/**
 * nodeClassifierEngine.ts — Universal DOM Node Classification & Hit-Testing Engine
 *
 * Implements 100% template-agnostic classification for arbitrary DOM nodes:
 *   - 'section' (Level 3): <section>, <header>, <footer>, <main>, <nav>
 *   - 'collection-item' / 'card' (Level 2): <article>, .card, .item, .project, repeated sibling cards
 *   - 'container' (Level 2): <div> with display flex/grid, padding, radius, border, or child elements
 *   - 'collection' (Level 2): Container wrapping repeated collection items
 *   - 'text' (Level 1): <h1>-<h6>, <p>, <span>, <label>, <li> (without container children)
 *   - 'image' (Level 1): <img>, <picture>
 *   - 'button' (Level 1): <button>, role="button"
 *   - 'link' (Level 1): <a>
 *   - 'icon' (Level 1): <svg>, <i>
 */

import { getClassName } from './CanvasDOMScanner';

export type UniversalNodeType =
  | 'section'
  | 'collection'
  | 'collection-item'
  | 'container'
  | 'text'
  | 'image'
  | 'button'
  | 'link'
  | 'icon'
  | 'ignore';

export interface ClassifiedNodeResult {
  type: UniversalNodeType;
  level: 1 | 2 | 3;
  label: string;
  isContainer: boolean;
}

export interface MeaningfulContainerAnalysis {
  isContainer: boolean;
  reason: string;
}

/**
 * Universal heuristic to determine if a DOM node is a meaningful visual/logical container with diagnostic reasoning.
 */
export function analyzeMeaningfulContainer(el: HTMLElement | null): MeaningfulContainerAnalysis {
  if (!el || !el.tagName) return { isContainer: false, reason: 'No element or tagName' };
  const tag = el.tagName.toUpperCase();
  const classes = getClassName(el).toLowerCase();
  const id = (el.id || '').toLowerCase();

  // Ignored tags
  if (['SCRIPT', 'STYLE', 'LINK', 'META', 'HEAD', 'NOSCRIPT', 'SVG', 'PATH', 'IFRAME', 'TEMPLATE'].includes(tag)) {
    return { isContainer: false, reason: `Ignored system tag <${tag.toLowerCase()}>` };
  }

  // Ignored editor UI chrome
  if (
    el.closest('[data-campuscv-ignore-editor]') !== null ||
    el.closest('.campuscv-editor-ui') !== null ||
    el.closest('.floating-toolbar') !== null ||
    el.hasAttribute('data-toolbar')
  ) {
    return { isContainer: false, reason: 'Editor UI chrome element' };
  }

  // 0. Explicit LEAF node override — highest priority, checked BEFORE any visual signals.
  //    Elements tagged as leaf types (text/button/image) or leaf text tags must NEVER be classified as containers
  //    even if they have background-color, border-radius, padding, flex, etc.
  const nodeId = el.getAttribute('data-node-id') || '';
  const isExplicitLeaf =
    nodeId.startsWith('text:') ||
    nodeId.startsWith('button:') ||
    nodeId.startsWith('image:') ||
    el.hasAttribute('data-cv-field') ||
    el.hasAttribute('data-edit-key');
  if (isExplicitLeaf) {
    return { isContainer: false, reason: `Explicit leaf node (${nodeId || el.getAttribute('data-cv-field') || el.getAttribute('data-edit-key')})` };
  }

  const LEAF_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'LABEL', 'STRONG', 'EM', 'SMALL', 'B', 'I', 'TIME', 'A', 'BUTTON'];
  if (LEAF_TAGS.includes(tag) && !el.querySelector('div, article, section, img, ul, ol, table')) {
    return { isContainer: false, reason: `Leaf semantic tag <${tag.toLowerCase()}> without container children` };
  }

  // 1. Explicit dataset attributes (highest authority: data-cv-*, data-edit-key, data-campus-*)
  const cvSec = el.getAttribute('data-cv-section');
  const cvCol = el.getAttribute('data-cv-collection');
  const cvItem = el.getAttribute('data-cv-item');
  const cvContainer = el.getAttribute('data-cv-container');
  const cvField = el.getAttribute('data-cv-field');
  const cvElement = el.getAttribute('data-cv-element');
  const editKey = el.getAttribute('data-edit-key');
  const explicitType = el.getAttribute('data-campus-node-type') || el.getAttribute('data-node-type') || el.getAttribute('data-cv-type');

  if (cvSec || cvCol || cvItem || cvContainer) {
    return { isContainer: true, reason: `Explicit data-cv container attribute (${cvSec ? 'section' : cvCol ? 'collection' : cvItem ? 'item' : 'container'})` };
  }

  if (cvElement && ['container', 'column', 'row', 'card', 'stat', 'navigation'].includes(cvElement)) {
    return { isContainer: true, reason: `Explicit data-cv-element="${cvElement}"` };
  }

  if (editKey) {
    return { isContainer: false, reason: `Explicit data-edit-key="${editKey}" text/field attribute` };
  }

  if (explicitType === 'section' || explicitType === 'container' || explicitType === 'card' || explicitType === 'collection-item' || explicitType === 'collection') {
    return { isContainer: true, reason: `Explicit dataset attribute data-node-type="${explicitType}"` };
  }

  // 2. Semantic container tags
  if (['SECTION', 'HEADER', 'FOOTER', 'NAV', 'MAIN', 'ARTICLE', 'FIGURE', 'ASIDE', 'UL', 'OL', 'LI'].includes(tag)) {
    return { isContainer: true, reason: `Semantic container tag <${tag.toLowerCase()}>` };
  }

  // 3. Known keywords (only for container-capable elements like DIV)
  if (['DIV', 'ARTICLE', 'LI', 'ASIDE', 'MAIN'].includes(tag)) {
    const containerKeywords = [
      'card', 'project', 'timeline', 'experience', 'education',
      'specialty', 'service', 'cert', 'showcase',
      'feature', 'box', 'column', 'block', 'tile', 'panel', 'wrapper', 'container', 'row'
    ];
    const matchedKeyword = containerKeywords.find(k => classes.includes(k) || id.includes(k));
    if (matchedKeyword) {
      return { isContainer: true, reason: `Class or ID matched keyword "${matchedKeyword}"` };
    }
  }

  // 4. Repeated sibling structure
  if (el.parentElement && ['DIV', 'LI', 'ARTICLE'].includes(tag)) {
    const parent = el.parentElement;
    const sameTagSiblings = Array.from(parent.children).filter(c => c.tagName === tag);
    if (sameTagSiblings.length >= 2) {
      return { isContainer: true, reason: `Parent has ${sameTagSiblings.length} repeated <${tag.toLowerCase()}> siblings` };
    }
  }

  // 5. Visual styling signals (only on DIVs with children)
  if (tag === 'DIV' && typeof window !== 'undefined') {
    try {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const hasBg = bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgba(0,0,0,0)';
      const hasBorder = style.borderStyle !== 'none' && style.borderWidth !== '0px';
      const hasRadius = style.borderRadius !== '0px' && style.borderRadius !== '0%';
      const hasShadow = style.boxShadow !== 'none' && style.boxShadow !== '';
      const padTop = parseFloat(style.paddingTop) || 0;
      const padLeft = parseFloat(style.paddingLeft) || 0;
      const hasPadding = padTop >= 4 || padLeft >= 4;
      const isFlexOrGrid = style.display === 'flex' || style.display === 'grid' || style.display === 'inline-grid';

      if (hasBg && el.children.length > 0) return { isContainer: true, reason: `Has background-color (${bg}) with children` };
      if (hasBorder && el.children.length > 0) return { isContainer: true, reason: `Has border (${style.borderStyle} ${style.borderWidth}) with children` };
      if (hasRadius && el.children.length > 0) return { isContainer: true, reason: `Has border-radius (${style.borderRadius}) with children` };
      if (hasShadow && el.children.length > 0) return { isContainer: true, reason: `Has box-shadow with children` };
      if (hasPadding && isFlexOrGrid && el.children.length > 0) return { isContainer: true, reason: `Has padding and layout with children` };
    } catch (e) {}
  }

  // 6. Contains element children (Structural container rule)
  const children = Array.from(el.children).filter(c => !['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEMPLATE'].includes(c.tagName.toUpperCase()));
  if (['DIV', 'ARTICLE', 'SECTION', 'UL', 'OL', 'TABLE'].includes(tag) && children.length >= 1) {
    return { isContainer: true, reason: `Structural <${tag.toLowerCase()}> containing ${children.length} child element(s)` };
  }

  return { isContainer: false, reason: `Leaf <${tag.toLowerCase()}> with zero child elements` };
}

export function isMeaningfulContainer(el: HTMLElement | null): boolean {
  return analyzeMeaningfulContainer(el).isContainer;
}

export function classifyDOMNode(el: HTMLElement | null): ClassifiedNodeResult {
  if (!el || !el.tagName) {
    return { type: 'ignore', level: 1, label: 'Element', isContainer: false };
  }

  const tag = el.tagName.toUpperCase();
  const classes = getClassName(el).toLowerCase();
  const id = (el.id || '').toLowerCase();

  // 1. Explicit dataset attributes (highest authority: data-cv-* and data-campus-*)
  const cvSec = el.getAttribute('data-cv-section');
  const cvCol = el.getAttribute('data-cv-collection');
  const cvItem = el.getAttribute('data-cv-item');
  const cvContainer = el.getAttribute('data-cv-container');
  const cvField = el.getAttribute('data-cv-field');
  const cvElement = el.getAttribute('data-cv-element');
  const cvType = el.getAttribute('data-cv-type');

  const editKey = el.getAttribute('data-edit-key');
  const targetField = cvField || editKey;

  if (cvSec) return { type: 'section', level: 3, label: 'Section', isContainer: true };
  if (cvCol) return { type: 'collection', level: 2, label: 'Collection', isContainer: true };
  if (cvItem) return { type: 'collection-item', level: 2, label: cvItem, isContainer: true };
  if (cvContainer) return { type: 'container', level: 2, label: cvContainer, isContainer: true };

  if (targetField) {
    if (cvType === 'image' || tag === 'IMG') return { type: 'image', level: 1, label: targetField, isContainer: false };
    if (cvType === 'link' || tag === 'A') return { type: 'link', level: 1, label: targetField, isContainer: false };
    if (cvType === 'button' || tag === 'BUTTON') return { type: 'button', level: 1, label: targetField, isContainer: false };
    return { type: 'text', level: 1, label: targetField, isContainer: false };
  }

  if (cvElement) {
    if (['container', 'column', 'row', 'card', 'stat', 'navigation'].includes(cvElement)) return { type: 'container', level: 2, label: cvElement, isContainer: true };
    if (cvElement === 'button') return { type: 'button', level: 1, label: 'Button', isContainer: false };
    if (cvElement === 'link' || cvElement === 'navigation-item') return { type: 'link', level: 1, label: 'Link', isContainer: false };
    if (cvElement === 'icon' || cvElement === 'shape') return { type: 'icon', level: 1, label: 'Icon', isContainer: false };
    if (cvElement === 'image') return { type: 'image', level: 1, label: 'Image', isContainer: false };
    return { type: 'text', level: 1, label: cvElement, isContainer: false };
  }

  const explicitType = el.getAttribute('data-campus-node-type') || el.getAttribute('data-node-type') || cvType;
  if (explicitType) {
    if (explicitType === 'section') return { type: 'section', level: 3, label: 'Section', isContainer: true };
    if (['collection-item', 'card'].includes(explicitType)) return { type: 'collection-item', level: 2, label: 'Card', isContainer: true };
    if (explicitType === 'collection') return { type: 'collection', level: 2, label: 'Collection', isContainer: true };
    if (explicitType === 'container') return { type: 'container', level: 2, label: 'Container', isContainer: true };
    if (['text', 'heading', 'paragraph'].includes(explicitType)) return { type: 'text', level: 1, label: 'Text', isContainer: false };
    if (explicitType === 'image') return { type: 'image', level: 1, label: 'Image', isContainer: false };
    if (explicitType === 'button') return { type: 'button', level: 1, label: 'Button', isContainer: false };
    if (explicitType === 'link') return { type: 'link', level: 1, label: 'Link', isContainer: false };
  }

  // 2. Section Tags (Level 3)
  if (['SECTION', 'HEADER', 'FOOTER', 'NAV', 'MAIN'].includes(tag)) {
    return { type: 'section', level: 3, label: tag, isContainer: true };
  }

  // 3. Leaf Elements (Level 1) — Direct Check
  if (tag === 'IMG') return { type: 'image', level: 1, label: 'Image', isContainer: false };
  if (tag === 'A') return { type: 'link', level: 1, label: 'Link', isContainer: false };
  if (tag === 'BUTTON' || el.getAttribute('role') === 'button') return { type: 'button', level: 1, label: 'Button', isContainer: false };
  if (tag === 'SVG' || tag === 'I') return { type: 'icon', level: 1, label: 'Icon', isContainer: false };

  // 4. Leaf Text Elements (Level 1) — Checked before generic card keywords to prevent text selection from being swallowed by containers
  const LEAF_TEXT_TAGS = /^(H[1-6]|P|SPAN|LABEL|LI|STRONG|EM|SMALL|B|I|TIME)$/i;
  if (LEAF_TEXT_TAGS.test(tag)) {
    const hasContainerChild = el.querySelector('div, article, section, img, svg, ul, ol, table') !== null;
    if (!hasContainerChild) {
      return { type: 'text', level: 1, label: tag.startsWith('H') ? 'Heading' : 'Text', isContainer: false };
    }
  }

  // 5. Level 2 Collection Items & Cards (<article>, .card, .project, .timeline, repeated siblings on DIVs)
  if (['ARTICLE', 'DIV'].includes(tag)) {
    const isCardKeyword = ['card', 'project', 'timeline', 'experience', 'education', 'article', 'showcase'].some(
      k => classes.includes(k) || id.includes(k)
    );
    if (tag === 'ARTICLE' || isCardKeyword) {
      return { type: 'collection-item', level: 2, label: 'Card', isContainer: true };
    }
  }

  // 6. Generic/Meaningful Containers (Level 2) — structural elements with children or container signals
  if (isMeaningfulContainer(el)) {
    return { type: 'container', level: 2, label: tag === 'LI' ? 'List Item' : 'Container', isContainer: true };
  }

  return { type: 'text', level: 1, label: tag, isContainer: false };
}
