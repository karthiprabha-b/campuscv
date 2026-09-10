/**
 * templateHeaderNormalizer.ts — Universal Template Sticky Header Runtime
 *
 * Normalizes sticky header behavior for all CampusCV templates (created & uploaded).
 *
 * Architecture:
 * 1. Dynamically detects template header/navigation element (<header>, <nav>, [data-section-id="header"], .header, .navbar, etc.).
 * 2. Reads behavior metadata ({ sticky: true, top: 0, zIndex: 100 }).
 * 3. Tracks parent/viewport scroll container position at 60fps via requestAnimationFrame.
 * 4. Applies smooth sticky transform offset so header remains pinned to top of screen viewport while scrolling.
 * 5. Preserves 100% of uploaded design, typography, spacing, colors, buttons, logos, and mobile menu interactions.
 */

export interface HeaderConfig {
  enabled?: boolean;
  sticky?: boolean;
  top?: number;
  zIndex?: number;
}

/**
 * Dynamically discovers the primary header or navigation element inside a template container.
 */
export function findHeaderElement(root: HTMLElement): HTMLElement | null {
  if (!root) return null;

  // 1. Explicit section identifier
  const explicit = root.querySelector<HTMLElement>(
    '[data-section-id="header"], [data-section-id="navbar"], [data-section-id="navigation"], [data-section-type="header"], [data-section-type="navbar"], [data-section-type="navigation"]'
  );
  if (explicit) return explicit;

  // 2. Semantic HTML5 <header> or <nav>
  const semanticHeader = root.querySelector<HTMLElement>('header');
  if (semanticHeader) return semanticHeader;

  const semanticNav = root.querySelector<HTMLElement>('nav');
  if (semanticNav) return semanticNav;

  // 3. Class name based match (.header, .navbar, .site-header, .navigation, .top-header)
  const classMatch = root.querySelector<HTMLElement>(
    '.header, .navbar, .site-header, .navigation, .top-header, .main-header, .nav-header, .header-container'
  );
  if (classMatch) return classMatch;

  // 4. Role navigation or top child
  const roleNav = root.querySelector<HTMLElement>('[role="navigation"], [role="banner"]');
  if (roleNav) return roleNav;

  // 5. First direct section/div child if it looks like a header (contains nav or logo)
  const firstChild = root.firstElementChild as HTMLElement | null;
  if (firstChild && (firstChild.querySelector('nav, a[href="/"], img, svg, button') || firstChild.id.toLowerCase().includes('header') || firstChild.className.toLowerCase().includes('header'))) {
    return firstChild;
  }

  return null;
}

/**
 * Attaches real-time scroll tracking normalization to keep header sticky relative to screen viewport.
 * Uses native CSS position: sticky / fixed without artificial translateY displacement.
 */
export function attachStickyHeaderNormalizer(
  targetDoc: Document,
  rootElement: HTMLElement,
  config: HeaderConfig = {}
): () => void {
  if (!targetDoc || !rootElement) return () => {};

  const enabled = config.enabled !== false;
  const sticky = config.sticky !== false;
  const topOffset = typeof config.top === 'number' ? config.top : 0;
  const zIndex = typeof config.zIndex === 'number' ? config.zIndex : 100;

  if (!enabled || !sticky) {
    return () => {};
  }

  const headerEl = findHeaderElement(rootElement);
  if (!headerEl) {
    console.log('[HEADER NORMALIZER] No header element detected in template root.');
    return () => {};
  }

  const win = targetDoc.defaultView || window;
  const computedStyle = win.getComputedStyle(headerEl);
  const currentPos = computedStyle.position;

  // Detect transformed ancestor
  let transformedAncestor = false;
  let curr = headerEl.parentElement;
  while (curr && curr !== targetDoc.body) {
    const cs = win.getComputedStyle(curr);
    if (cs.transform && cs.transform !== 'none') {
      transformedAncestor = true;
      break;
    }
    curr = curr.parentElement;
  }

  console.log('[TEMPLATE SCROLL]', {
    Header: headerEl.tagName.toLowerCase() + (headerEl.className ? `.${headerEl.className.split(' ').join('.')}` : ''),
    HeaderPosition: currentPos,
    HeaderParent: headerEl.parentElement?.tagName.toLowerCase() || 'none',
    ActualScrollContainer: typeof window !== 'undefined' && win === window ? 'window' : 'iframe-window',
    ScrollContainerOverflow: win.getComputedStyle(targetDoc.body || rootElement).overflowY,
    TransformedAncestor: transformedAncestor,
    StickyTop: `${topOffset}px`
  });

  // Respect original template CSS 100% untouched — DO NOT force position: sticky or top: 0
  // The uploaded template's own CSS, Tailwind classes, and JavaScript control 100% of header layout and scrolling.

  // Ensure ancestor wrappers up to html documentElement do not clip template sticky/fixed header
  let parent = headerEl.parentElement;
  const modifiedParents: Array<{ el: HTMLElement; origOverflow: string; origContain: string }> = [];

  while (parent && parent !== targetDoc.documentElement) {
    const parentStyle = win.getComputedStyle(parent);
    const hasClippingOverflow =
      parentStyle.overflow === 'hidden' ||
      parentStyle.overflowY === 'hidden' ||
      parentStyle.overflowX === 'hidden' ||
      parentStyle.overflowX === 'clip';

    if (hasClippingOverflow) {
      modifiedParents.push({
        el: parent,
        origOverflow: parent.style.overflow,
        origContain: parent.style.contain
      });
      parent.style.overflow = 'visible';
    }

    if (parentStyle.contain && parentStyle.contain !== 'none') {
      parent.style.contain = 'none';
    }

    parent = parent.parentElement;
  }

  // Return cleanup function
  return () => {
    modifiedParents.forEach(({ el, origOverflow, origContain }) => {
      if (el && el.isConnected) {
        el.style.overflow = origOverflow;
        el.style.contain = origContain;
      }
    });
  };
}
