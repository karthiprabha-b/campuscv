/**
 * domIntegrityChecker.ts — CampusCV DOM Integrity Verifier
 *
 * Compares rendered DOM node counts between Admin Preview (mode="preview") and Editor Canvas (mode="editor").
 * Verifies that Editor mode DOES NOT remove template DOM nodes or simplify the template.
 */

export interface DOMStats {
  mode: string;
  sections: number;
  divs: number;
  images: number;
  headings: number;
  paragraphs: number;
  buttons: number;
  anchors: number;
  cvNodes: number;
}

export function captureDOMStats(container: HTMLElement | null, mode: string = 'unknown'): DOMStats {
  if (!container) {
    return {
      mode,
      sections: 0,
      divs: 0,
      images: 0,
      headings: 0,
      paragraphs: 0,
      buttons: 0,
      anchors: 0,
      cvNodes: 0
    };
  }

  return {
    mode,
    sections: container.querySelectorAll('section, [data-cv-section]').length,
    divs: container.querySelectorAll('div').length,
    images: container.querySelectorAll('img').length,
    headings: container.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
    paragraphs: container.querySelectorAll('p').length,
    buttons: container.querySelectorAll('button').length,
    anchors: container.querySelectorAll('a').length,
    cvNodes: container.querySelectorAll('[data-cv-field], [data-cv-item], [data-cv-collection], [data-cv-container], [data-cv-section]').length
  };
}

export function compareDOMStats(adminStats: DOMStats, editorStats: DOMStats): {
  isMatch: boolean;
  mismatches: string[];
} {
  const mismatches: string[] = [];

  if (editorStats.sections < adminStats.sections) {
    mismatches.push(`Sections count reduced: Admin ${adminStats.sections} vs Editor ${editorStats.sections}`);
  }

  if (editorStats.headings < adminStats.headings) {
    mismatches.push(`Headings count reduced: Admin ${adminStats.headings} vs Editor ${editorStats.headings}`);
  }

  if (editorStats.images < adminStats.images) {
    mismatches.push(`Images count reduced: Admin ${adminStats.images} vs Editor ${editorStats.images}`);
  }

  if (editorStats.anchors < adminStats.anchors) {
    mismatches.push(`Anchors count reduced: Admin ${adminStats.anchors} vs Editor ${editorStats.anchors}`);
  }

  console.log('[DOM INTEGRITY CHECK]', {
    adminStats,
    editorStats,
    isMatch: mismatches.length === 0,
    mismatches
  });

  return {
    isMatch: mismatches.length === 0,
    mismatches
  };
}
