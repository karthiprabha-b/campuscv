/**
 * universalDoubleClickEngine.ts — Universal Double Click & Selection Read-Only Engine
 *
 * Core Rule:
 *   CLICKING OR DOUBLE-CLICKING AN ELEMENT MUST NEVER MUTATE DOM OR ALTER TEMPLATE LAYOUT.
 *   Selection must be READ-ONLY.
 *
 * Rules:
 *   1. Containers (DIV, ARTICLE, SECTION, MAIN, HEADER, FOOTER, NAV, UL, OL, GRID) are NEVER made contentEditable.
 *   2. Double-clicking a container selects the container ONLY. Zero DOM mutation.
 *   3. Double-clicking an image opens image controls/upload dialog. Zero DOM mutation.
 *   4. Double-clicking a leaf text element (H1-H6, P, SPAN, LABEL, BUTTON, A, LI) with zero container children
 *      enters inline text editing for that leaf element ONLY.
 */

export interface DoubleClickActionResult {
  type: 'SELECT_ONLY' | 'IMAGE_CONTROLS' | 'INLINE_TEXT_EDIT';
  isContentEditable: boolean;
  targetNodeId?: string;
}

export function safeCanBeContentEditable(target: any): boolean {
  if (!target || !target.tagName) return false;

  const tag = target.tagName.toUpperCase();

  // 1. Strictly forbid structural container tags from contentEditable
  const CONTAINER_TAGS = /^(DIV|ARTICLE|SECTION|MAIN|HEADER|FOOTER|NAV|UL|OL|FORM|GRID|TABLE|TR|TD|BODY|HTML)$/i;
  if (CONTAINER_TAGS.test(tag)) {
    return false;
  }

  // 2. Only permit safe leaf text tags
  const LEAF_TEXT_TAGS = /^(H[1-6]|P|SPAN|LABEL|BUTTON|A|LI|STRONG|EM|SMALL|B|I)$/i;
  if (!LEAF_TEXT_TAGS.test(tag)) {
    return false;
  }

  // 3. Forbid elements with nested structural child containers
  if (typeof target.querySelector === 'function') {
    const hasStructuralChildren = target.querySelector('div, article, section, img, svg, ul, ol, table, header, footer, nav, form') !== null;
    if (hasStructuralChildren) {
      return false;
    }
  }

  return true;
}

export function handleUniversalDoubleClick(target: any): DoubleClickActionResult {
  if (!target || !target.tagName) {
    return { type: 'SELECT_ONLY', isContentEditable: false };
  }

  const tag = target.tagName.toUpperCase();

  // Image double click -> image controls
  if (tag === 'IMG') {
    return { type: 'IMAGE_CONTROLS', isContentEditable: false };
  }

  // Leaf text double click -> inline edit mode
  if (safeCanBeContentEditable(target)) {
    return { type: 'INLINE_TEXT_EDIT', isContentEditable: true };
  }

  // Container or any structural element -> select container ONLY (zero DOM mutation)
  return { type: 'SELECT_ONLY', isContentEditable: false };
}
