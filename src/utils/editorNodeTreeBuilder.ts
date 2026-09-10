/**
 * editorNodeTreeBuilder.ts — Universal CampusCV Editor Node Tree & Target Resolution
 *
 * Converts DOM elements in any official or uploaded template into a single normalized EditorNode tree.
 * Implements target-first closest matching ancestor selection starting from event.target.
 */

import { parseSemanticContract } from './semanticContractEngine';
import { getClassName } from './CanvasDOMScanner';

export type EditorNodeKind =
  | 'section'
  | 'container'
  | 'collection'
  | 'item'
  | 'text'
  | 'image'
  | 'button'
  | 'link'
  | 'badge'
  | 'icon';

export interface EditorNode {
  id: string;
  kind: EditorNodeKind;
  sectionId: string;
  parentId: string | null;
  children: EditorNode[];
  domElement: HTMLElement;
  dataPath?: string;
  editable: boolean;
  deletable: boolean;
  label: string;
}

/**
 * Priority order for target resolution:
 *   1. FIELD / ELEMENT (text, image, button, link) — Priority 5
 *   2. ITEM (repeated card/item) — Priority 4
 *   3. CONTAINER (structural wrapper) — Priority 3
 *   4. COLLECTION (collection grid/list) — Priority 2
 *   5. SECTION (section scope) — Priority 1
 */
const KIND_PRIORITY: Record<EditorNodeKind, number> = {
  text: 5,
  image: 5,
  button: 5,
  link: 5,
  badge: 5,
  icon: 5,
  item: 4,
  container: 3,
  collection: 2,
  section: 1
};

/**
 * Target-First Resolution:
 * Resolves the CLOSEST selectable element starting from event.target up the DOM tree.
 */
export function resolveEditorTarget(target: HTMLElement | null): HTMLElement | null {
  if (!target || !target.closest) return null;

  // 1. Target-First: If target itself is a leaf text, image, button, or link element
  const tag = target.tagName.toUpperCase();
  if (['IMG', 'BUTTON', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'SMALL', 'STRONG', 'B', 'EM', 'I', 'U', 'LI', 'LABEL'].includes(tag)) {
    return target;
  }

  // 2. Search closest matching element with explicit data-cv-* contract attributes
  const match = target.closest<HTMLElement>(`
    [data-cv-field],
    [data-cv-element],
    [data-cv-type],
    [data-cv-item],
    [data-cv-id],
    [data-cv-container],
    [data-cv-collection]
  `);

  if (match) return match;

  return target.closest<HTMLElement>('article, section, header, footer, nav, div') || target;
}

/**
 * Infers the EditorNodeKind for a DOM element.
 */
export function classifyElementKind(el: HTMLElement): EditorNodeKind {
  const contract = parseSemanticContract(el);

  if (contract.hasContract) {
    if (contract.contractType === 'field') {
      const tag = el.tagName.toUpperCase();
      if (tag === 'IMG' || el.getAttribute('data-cv-type') === 'image') return 'image';
      if (tag === 'BUTTON' || el.getAttribute('data-cv-type') === 'button') return 'button';
      if (tag === 'A' || el.getAttribute('data-cv-type') === 'link') return 'link';
      return 'text';
    }
    if (contract.contractType === 'item') return 'item';
    if (contract.contractType === 'collection') return 'collection';
    if (contract.contractType === 'section') return 'section';
  }

  const cvElement = el.getAttribute('data-cv-element');
  if (cvElement) {
    if (['button', 'cta'].includes(cvElement)) return 'button';
    if (['image', 'portrait', 'avatar'].includes(cvElement)) return 'image';
    if (['link'].includes(cvElement)) return 'link';
    if (['container', 'card', 'box'].includes(cvElement)) return 'container';
  }

  const tag = el.tagName.toUpperCase();
  if (tag === 'SECTION' || el.getAttribute('data-cv-section') || el.id === 'hero' || el.id === 'work' || el.id === 'projects' || el.id === 'about' || el.id === 'experience' || el.id === 'skills' || el.id === 'contact') {
    return 'section';
  }
  if (tag === 'IMG') return 'image';
  if (tag === 'BUTTON') return 'button';
  if (tag === 'A') return 'link';
  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'B', 'STRONG', 'I', 'EM'].includes(tag)) return 'text';
  if (tag === 'ARTICLE' || el.getAttribute('data-cv-item')) return 'item';
  if (el.getAttribute('data-cv-collection')) return 'collection';

  const classes = getClassName(el).toLowerCase();
  if (classes.includes('grid') || classes.includes('collection') || classes.includes('list')) return 'collection';
  if (classes.includes('card') || classes.includes('item')) return 'item';

  return 'container';
}

/**
 * Builds a single EditorNode instance from a DOM element.
 */
export function createEditorNode(el: HTMLElement, parentNode: EditorNode | null = null): EditorNode {
  const kind = classifyElementKind(el);
  const contract = parseSemanticContract(el);

  let sectionId = contract.sectionId || parentNode?.sectionId || 'main';
  if (kind === 'section') {
    sectionId = el.getAttribute('data-cv-section') || el.id || 'section';
  }

  const cvId = el.getAttribute('data-cv-id') || el.getAttribute('data-node-id') || el.id;
  const fieldName = contract.fieldName || el.getAttribute('data-cv-field');
  const tag = el.tagName.toLowerCase();

  let id = cvId || `${kind}:${sectionId}:${fieldName || tag}`;
  if (parentNode) {
    id = `${parentNode.id}>${id}`;
  }

  const label = fieldName ? fieldName.toUpperCase() : (el.getAttribute('data-cv-item') || kind).toUpperCase();

  return {
    id,
    kind,
    sectionId,
    parentId: parentNode ? parentNode.id : null,
    children: [],
    domElement: el,
    dataPath: fieldName ? `${sectionId}.${fieldName}` : undefined,
    editable: kind === 'text' || kind === 'image' || kind === 'button' || kind === 'link',
    deletable: kind !== 'section',
    label
  };
}

/**
 * Builds the complete EditorNode tree starting from a container.
 */
export function buildEditorNodeTree(rootEl: HTMLElement): EditorNode {
  const rootNode = createEditorNode(rootEl, null);

  const traverse = (parentEl: HTMLElement, parentNode: EditorNode) => {
    const children = Array.from(parentEl.children) as HTMLElement[];
    for (const childEl of children) {
      if (
        ['SCRIPT', 'STYLE', 'SVG', 'PATH', 'IFRAME', 'NOSCRIPT'].includes(childEl.tagName.toUpperCase()) ||
        childEl.closest('.campuscv-editor-ui') !== null
      ) {
        continue;
      }

      const childNode = createEditorNode(childEl, parentNode);
      parentNode.children.push(childNode);
      traverse(childEl, childNode);
    }
  };

  traverse(rootEl, rootNode);
  return rootNode;
}
