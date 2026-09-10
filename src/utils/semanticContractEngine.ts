/**
 * semanticContractEngine.ts — CampusCV Lightweight Semantic Editor Contract Engine
 *
 * Implements authoritative data-cv-* contract parsing and priority resolution:
 *   1. data-cv-field       (Level 1 Leaf: title, description, image, link, company, date, etc.)
 *   2. data-cv-item        (Level 2 Item/Card: project, experience, education, skill, etc.)
 *   3. data-cv-collection  (Level 2 Collection Grid: projects, experience, education, skills, etc.)
 *   4. data-cv-section     (Level 3 Section Scope: hero, about, projects, experience, contact, etc.)
 *   5. Heuristic fallback  (For legacy/external unannotated DOM nodes)
 */

export interface SemanticContractInfo {
  hasContract: boolean;
  contractType: 'field' | 'item' | 'collection' | 'section' | 'none';
  sectionId: string | null;
  collectionName: string | null;
  itemType: string | null;
  itemId: string | null;
  fieldName: string | null;
  priority: number; // 4 = field (highest), 3 = item, 2 = collection, 1 = section, 0 = fallback
}

/**
 * Parses data-cv-* attributes from a DOM element.
 */
export function parseSemanticContract(el: HTMLElement | null): SemanticContractInfo {
  if (!el || !el.getAttribute) {
    return {
      hasContract: false,
      contractType: 'none',
      sectionId: null,
      collectionName: null,
      itemType: null,
      itemId: null,
      fieldName: null,
      priority: 0
    };
  }

  const cvField = el.getAttribute('data-cv-field');
  const cvItem = el.getAttribute('data-cv-item');
  const cvId = el.getAttribute('data-cv-id');
  const cvCollection = el.getAttribute('data-cv-collection');
  const cvSection = el.getAttribute('data-cv-section');

  // Ancestor section resolution helper
  const findAncestorSection = (node: HTMLElement): string | null => {
    let curr: HTMLElement | null = node;
    while (curr) {
      const sec = curr.getAttribute('data-cv-section') || curr.getAttribute('data-section') || curr.getAttribute('data-campus-section');
      if (sec) return sec;
      if (curr.id && ['hero', 'about', 'projects', 'experience', 'skills', 'contact', 'education'].includes(curr.id.toLowerCase())) {
        return curr.id.toLowerCase();
      }
      curr = curr.parentElement;
    }
    return null;
  };

  const sectionId = cvSection || findAncestorSection(el) || 'main';

  // 1. data-cv-field (Level 1 Leaf Node)
  if (cvField) {
    return {
      hasContract: true,
      contractType: 'field',
      sectionId,
      collectionName: cvCollection || null,
      itemType: cvItem || null,
      itemId: cvId || null,
      fieldName: cvField,
      priority: 4
    };
  }

  // 2. data-cv-item (Level 2 Card / Repeated Item)
  if (cvItem || cvId) {
    return {
      hasContract: true,
      contractType: 'item',
      sectionId,
      collectionName: cvCollection || null,
      itemType: cvItem || 'item',
      itemId: cvId || null,
      fieldName: null,
      priority: 3
    };
  }

  // 3. data-cv-collection (Level 2 Collection Grid)
  if (cvCollection) {
    return {
      hasContract: true,
      contractType: 'collection',
      sectionId,
      collectionName: cvCollection,
      itemType: null,
      itemId: null,
      fieldName: null,
      priority: 2
    };
  }

  // 4. data-cv-section (Level 3 Section Scope)
  if (cvSection) {
    return {
      hasContract: true,
      contractType: 'section',
      sectionId: cvSection,
      collectionName: null,
      itemType: null,
      itemId: null,
      fieldName: null,
      priority: 1
    };
  }

  return {
    hasContract: false,
    contractType: 'none',
    sectionId: null,
    collectionName: null,
    itemType: null,
    itemId: null,
    fieldName: null,
    priority: 0
  };
}

/**
 * Resolves the highest priority contract node from a composedPath array.
 */
export function resolveContractFromPath(path: HTMLElement[]): { element: HTMLElement; contract: SemanticContractInfo } | null {
  if (!Array.isArray(path) || path.length === 0) return null;

  let bestMatch: { element: HTMLElement; contract: SemanticContractInfo } | null = null;

  for (const node of path) {
    if (!node || !node.getAttribute) continue;
    const contract = parseSemanticContract(node as HTMLElement);

    if (contract.hasContract) {
      if (!bestMatch || contract.priority > bestMatch.contract.priority) {
        bestMatch = { element: node as HTMLElement, contract };
      }
    }
  }

  return bestMatch;
}
