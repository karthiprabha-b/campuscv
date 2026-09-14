/**
 * universalNodeEngine.ts — Universal Editable Node Engine for CampusCV
 *
 * Enables 100% visual editability for ANY uploaded React portfolio template
 * WITHOUT modifying template source files (JSX/CSS) or writing manual section mappings.
 *
 * Concept:
 *   Uploaded template -> Render normally -> Discover visible editable nodes ->
 *   Assign stable deterministic Node IDs -> Canvas Overlay & Click Selection ->
 *   Inspector -> Edit -> contentOverrides / styleOverrides / imageOverrides -> Save to SQLite -> Publish.
 */

import { getClassName } from './CanvasDOMScanner';
import { UniversalBindingEngine } from '../lib/binding/UniversalBindingEngine';
import { discoverTemplateSections } from './templateSectionRegistry';
import { formatNormalizedDateRange } from './dateFormatters';

export interface EditableNode {
  nodeId: string;
  type: 'text' | 'image' | 'link' | 'button' | 'section' | 'container';
  tag: string;
  sectionId: string;
  containerKey: string;
  index: number;
  currentValue: string;
  currentSrc?: string;
  currentHref?: string;
  currentStyles: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    display?: string;
  };
  // Universal Collection Item Context
  collection?: string;
  itemId?: string;
  collectionIndex?: number;
  field?: string;
  el?: HTMLElement;
}

const EDITABLE_TAGS = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'P', 'SPAN', 'SMALL', 'STRONG', 'B',
  'A', 'BUTTON', 'IMG', 'LI', 'LABEL',
  'SECTION', 'HEADER', 'FOOTER', 'MAIN', 'NAV', 'ARTICLE', 'DIV'
]);

/**
 * Detects the section ID for a given element based on section containers or headings.
 */
export function detectNodeSectionId(el: HTMLElement): string {
  let current: HTMLElement | null = el;
  const docBody = typeof document !== 'undefined' ? document.body : null;
  while (current && current !== docBody) {
    const id = (current.id || '').toLowerCase();
    const dataSec = (current.getAttribute('data-section') || '').toLowerCase();
    const classes = getClassName(current).toLowerCase();

    if (dataSec) return dataSec.replace(/[^a-z0-9_-]/g, '');

    const knownSections = [
      'hero', 'home', 'intro', 'about', 'skills', 'specialties', 'services',
      'projects', 'portfolio', 'experience', 'timeline', 'work', 'education',
      'academic', 'certifications', 'awards', 'publications', 'research',
      'contact', 'footer', 'stats', 'gallery', 'testimonials', 'achievements', 'interests'
    ];

    for (const sec of knownSections) {
      if (
        id.includes(sec) ||
        classes.includes(sec) ||
        classes.includes(`${sec}-section`) ||
        classes.includes(`section-${sec}`)
      ) {
        return sec === 'home' || sec === 'intro' ? 'hero' : sec;
      }
    }

    if (current.tagName === 'SECTION' || current.tagName === 'HEADER' || current.tagName === 'FOOTER' || current.tagName === 'NAV') {
      const tagSec = current.tagName.toLowerCase();
      if (id) return id.replace(/[^a-z0-9_-]/g, '');
      return tagSec;
    }

    current = current.parentElement;
  }
  return 'main';
}

/**
 * Detects the runtime collection item context (e.g. collection: 'projects', itemId: 'project-2', index: 1).
 */
export function detectCollectionContext(el: HTMLElement): { collection?: string; itemId?: string; collectionIndex?: number; field?: string } {
  let current: HTMLElement | null = el;
  const docBody = typeof document !== 'undefined' ? document.body : null;

  while (current && current !== docBody) {
    const colAttr = current.getAttribute('data-cv-collection') || current.getAttribute('data-collection');
    const itemAttr = current.getAttribute('data-cv-item-id') || current.getAttribute('data-item-id') || current.getAttribute('data-cv-item');
    const idxAttr = current.getAttribute('data-cv-index') || current.getAttribute('data-index');
    const fieldAttr = current.getAttribute('data-cv-field') || current.getAttribute('data-field');

    // 1. data-cv path matching (e.g. projects.items[1].image or projects.items[1] or experience[0].role)
    const cvAttr = current.getAttribute('data-cv') || '';
    const cvMatch = cvAttr.match(/^([a-zA-Z0-9_]+)(?:\.items)?\[(\d+)\](?:\.([a-zA-Z0-9_]+))?$/);

    if (cvMatch) {
      const collection = cvMatch[1];
      const collectionIndex = parseInt(cvMatch[2], 10);
      const field = cvMatch[3] || fieldAttr || undefined;
      return {
        collection,
        itemId: itemAttr || `${collection}-${collectionIndex + 1}`,
        collectionIndex,
        field
      };
    }

    if (colAttr || itemAttr || idxAttr) {
      return {
        collection: colAttr || undefined,
        itemId: itemAttr || undefined,
        collectionIndex: idxAttr !== null && idxAttr !== undefined ? parseInt(idxAttr, 10) : undefined,
        field: fieldAttr || undefined
      };
    }

    // 2. data-node-id pattern (e.g. image:projects:card:1:img:0)
    const nodeAttr = current.getAttribute('data-node-id') || '';
    const cardMatch = nodeAttr.match(/:([a-zA-Z0-9_]+):card:(\d+):([a-zA-Z0-9_]+)/);
    if (cardMatch) {
      const collection = cardMatch[1];
      const collectionIndex = parseInt(cardMatch[2], 10);
      return {
        collection,
        itemId: `${collection}-${collectionIndex + 1}`,
        collectionIndex,
        field: cardMatch[3] === 'img' ? 'image' : undefined
      };
    }

    if (current.tagName === 'SECTION' || current.tagName === 'HEADER' || current.tagName === 'FOOTER' || current.tagName === 'NAV') {
      break;
    }
    current = current.parentElement;
  }
  return {};
}

/**
 * Detects repeated card/container context (e.g. card:0, list:1).
 * Returns 'root' for elements that are direct children of a named section
 * (e.g. <h1> inside hero-grid inside <section id="hero">) — these are not cards.
 */
export function detectContainerContext(el: HTMLElement): { containerKey: string; containerIndex: number } {
  let current: HTMLElement | null = el;

  while (current && current !== document.body) {
    const tag = current.tagName.toUpperCase();
    const id = (current.id || '').toLowerCase();
    const classes = getClassName(current).toLowerCase();

    // 1. Check if the element or ancestor has explicit data-cv containing an index like projects.items[2]
    const cvAttr = current.getAttribute('data-cv') || '';
    const cvMatch = cvAttr.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]/) || cvAttr.match(/([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (cvMatch) {
      const idx = parseInt(cvMatch[2], 10);
      return { containerKey: `card:${idx}`, containerIndex: idx };
    }

    // 2. Check if the element has an explicit data-node-id containing container:section:card:X
    const nodeAttr = current.getAttribute('data-node-id') || '';
    const nodeMatch = nodeAttr.match(/card:(\d+)/) || nodeAttr.match(/:(\d+):/);
    if (nodeMatch) {
      const idx = parseInt(nodeMatch[1], 10);
      return { containerKey: `card:${idx}`, containerIndex: idx };
    }

    // Stop at section boundaries — element is in root context.
    if (tag === 'SECTION' || tag === 'HEADER' || tag === 'FOOTER' || tag === 'NAV' || tag === 'MAIN') {
      return { containerKey: 'root', containerIndex: 0 };
    }

    // A named div that acts as a section root — root context.
    if (tag === 'DIV' && id) {
      const knownSections = [
        'hero', 'home', 'intro', 'about', 'skills', 'specialties', 'services',
        'projects', 'portfolio', 'experience', 'timeline', 'work', 'education',
        'academic', 'certifications', 'contact', 'footer', 'stats'
      ];
      if (knownSections.some(s => id === s || id === `section-${s}` || id === `${s}-section`)) {
        return { containerKey: 'root', containerIndex: 0 };
      }
    }

    // A true repeating card or list item (AVOID matching group-hover pseudo classes)
    const classList = classes.split(/\s+/);
    const hasExactGroup = classList.includes('group') || classList.includes('group/item');
    const isExplicitCard =
      tag === 'LI' ||
      tag === 'ARTICLE' ||
      tag === 'FIGURE' ||
      classes.includes('card') ||
      classes.includes('project-item') ||
      classes.includes('timeline-item') ||
      classes.includes('experience-item') ||
      classes.includes('skill-item') ||
      classes.includes('education-item') ||
      classes.includes('cert-item') ||
      (hasExactGroup && (classes.includes('card') || classes.includes('border') || classes.includes('rounded')));

    if (isExplicitCard && current.parentElement) {
      const siblings = Array.from(current.parentElement.children).filter((sibling) => {
        const sTag = sibling.tagName;
        const sClasses = getClassName(sibling as HTMLElement).toLowerCase();
        const sClassList = sClasses.split(/\s+/);
        const sHasExactGroup = sClassList.includes('group') || sClassList.includes('group/item');
        return (
          sTag === tag ||
          sTag === 'ARTICLE' ||
          sTag === 'LI' ||
          sClasses.includes('card') ||
          sHasExactGroup
        );
      });

      if (siblings.length > 1) {
        const idx = siblings.indexOf(current);
        const containerIndex = idx >= 0 ? idx : 0;
        const prefix = tag === 'LI' ? 'li' : 'card';
        return { containerKey: `${prefix}:${containerIndex}`, containerIndex };
      }
    }
    current = current.parentElement;
  }
  return { containerKey: 'root', containerIndex: 0 };
}

/**
 * Deterministically generates a stable, unique Node ID for an element.
 * Format: [type]:[sectionId]:[containerKey]:[tag]:[index]
 * Example: text:hero:root:h1:0, section:hero:root:section:0, img:about:card:0:img:0
 */
export function generateNodeId(el: HTMLElement, type: string, tag: string, sectionId: string, containerKey: string, tagIndex: number): string {
  return `${type}:${sectionId}:${containerKey}:${tag}:${tagIndex}`;
}

/**
 * Resolves effective template root element across main window document and active iframe containers.
 */
export function getEffectiveTemplateRoot(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById('template-root') || document.querySelector('[data-template-root="true"]') as HTMLElement | null;
  if (el) return el;

  const iframes = Array.from(document.querySelectorAll('iframe')) as HTMLIFrameElement[];
  for (const iframe of iframes) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        el = doc.getElementById('template-root') || doc.querySelector('#campuscv-iframe-root') as HTMLElement | null;
        if (el) return el;
      }
    } catch (e) { }
  }
  return null;
}

/**
 * Scans root element and discovers all visible editable nodes deterministically.
 */
export function discoverEditableNodes(rootEl: HTMLElement, templateId: string = 'template'): EditableNode[] {

  if (!rootEl) return [];

  const nodes: EditableNode[] = [];
  const tagCounters: Record<string, number> = {};

  const elements = Array.from(rootEl.querySelectorAll('*')) as HTMLElement[];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const tag = el.tagName.toUpperCase();

    if (
      tag === 'SCRIPT' ||
      tag === 'STYLE' ||
      tag === 'SVG' ||
      tag === 'PATH' ||
      tag === 'CIRCLE' ||
      tag === 'RECT' ||
      tag === 'LINE' ||
      tag === 'NOSCRIPT' ||
      tag === 'HEAD' ||
      tag === 'TEMPLATE' ||
      el.closest('[data-campuscv-ignore-editor]') !== null ||
      el.closest('.campuscv-editor-ui') !== null
    ) {
      continue;
    }
    if (!EDITABLE_TAGS.has(tag)) continue;

    const style = typeof window !== 'undefined' ? window.getComputedStyle(el) : (el as any).style || {};
    if (style.display === 'none' && !el.hasAttribute('data-node-id')) continue;
    if (style.visibility === 'hidden' || style.opacity === '0') continue;

    let type: 'text' | 'image' | 'link' | 'button' | 'section' | 'container' = 'container';
    if (tag === 'IMG') type = 'image';
    else if (tag === 'A') type = 'link';
    else if (tag === 'BUTTON' || el.getAttribute('role') === 'button') type = 'button';
    else if (tag === 'SECTION' || tag === 'HEADER' || tag === 'FOOTER' || tag === 'NAV' || tag === 'MAIN') type = 'section';
    else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'SMALL', 'STRONG', 'B', 'EM', 'I', 'U', 'LI', 'LABEL'].includes(tag)) {
      type = 'text';
    }

    if (tag === 'DIV' || tag === 'ARTICLE' || tag === 'SECTION' || tag === 'HEADER' || tag === 'FOOTER' || tag === 'NAV' || tag === 'MAIN') {
      // Wrapper containers must NEVER be text nodes or steal leaf text clicks
      continue;
    }

    if (type === 'text') {
      const hasBlockChildren = Array.from(el.children).some(child =>
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'DIV', 'SECTION', 'ARTICLE'].includes(child.tagName.toUpperCase())
      );
      if (hasBlockChildren) continue;
      const text = el.innerText ? el.innerText.trim() : '';
      if (!text) continue;
    }

    const sectionId = detectNodeSectionId(el);
    const { containerKey } = detectContainerContext(el);
    const counterKey = `${sectionId}:${containerKey}:${tag.toLowerCase()}`;
    const tagIndex = tagCounters[counterKey] || 0;
    tagCounters[counterKey] = tagIndex + 1;

    // If element already has an explicit data-node-id, preserve it; otherwise generate unique ID
    const explicitNodeId = el.getAttribute('data-node-id');
    const nodeId = explicitNodeId || generateNodeId(el, type, tag.toLowerCase(), sectionId, containerKey, tagIndex);

    el.setAttribute('data-node-id', nodeId);
    el.setAttribute('data-node-type', type);

    const currentNode: EditableNode = {
      nodeId,
      type,
      tag: tag.toLowerCase(),
      sectionId,
      containerKey,
      index: tagIndex,
      currentValue: el.innerText ? el.innerText.trim() : '',
      currentSrc: tag === 'IMG' ? (el as HTMLImageElement).src : undefined,
      currentHref: tag === 'A' ? (el as HTMLAnchorElement).href : undefined,
      currentStyles: {
        color: style.color,
        backgroundColor: style.backgroundColor,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        textAlign: style.textAlign,
        borderRadius: style.borderRadius,
        padding: style.padding,
        margin: style.margin,
        display: style.display,
      },
      el
    };

    nodes.push(currentNode);
  }

  return nodes;
}

/**
 * Universal Content & Style Override Resolver.
 */
export function resolveContent(nodeId: string, originalValue: string, portfolio: any): string {
  if (!portfolio || !portfolio.contentOverrides) return originalValue;
  const override = portfolio.contentOverrides[nodeId];
  if (override === undefined || override === null) return originalValue;
  const val = typeof override === 'string' ? override : override.value;
  return val !== undefined ? val : originalValue;
}

/**
 * Normalizes a node ID by trying alternate containerKey variants.
 * Returns candidate IDs to try, in priority order.
 */
function resolveNodeIdCandidates(nodeId: string): string[] {
  const candidates: string[] = [nodeId];
  const parts = nodeId.split(':');

  if (parts.length === 5) {
    // Format: type:sectionId:root:tag:tagIndex
    const [type, sectionId, containerKey, tag, tagIndex] = parts;
    if (containerKey === 'root') {
      // Try card:0 variant (6 parts) — ONLY card:0
      candidates.push(`${type}:${sectionId}:card:0:${tag}:${tagIndex}`);
    }
  } else if (parts.length === 6) {
    // Format: type:sectionId:card:N:tag:tagIndex  OR  type:sectionId:li:N:tag:tagIndex
    const [type, sectionId, containerPrefix, containerIdx, tag, tagIndex] = parts;
    // IMPORTANT: Only fall back to root if containerIdx === '0'!
    // For card:1, card:2, card:3, DO NOT fall back to root!
    if ((containerPrefix === 'card' || containerPrefix === 'li') && containerIdx === '0') {
      candidates.push(`${type}:${sectionId}:root:${tag}:${tagIndex}`);
    }
  }

  return candidates;
}


/**
 * Resolves a DOM element for a given nodeId with fallback normalization.
 * Tries the exact nodeId first. If not found, tries alternate containerKey variants.
 * This handles stale DB data from prior code versions.
 */
function resolveOverrideElement(rootEl: HTMLElement, nodeId: string): HTMLElement | null {
  // 1. Exact match (fastest path)
  const exact = rootEl.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement | null;
  if (exact) return exact;

  // 2. Normalized fallback — try all candidate IDs
  const candidates = resolveNodeIdCandidates(nodeId);
  for (const candidate of candidates) {
    if (candidate === nodeId) continue; // already tried
    const el = rootEl.querySelector(`[data-node-id="${candidate}"]`) as HTMLElement | null;
    if (el) {
      return el;
    }
  }

  return null;
}

function isSameImageSrc(imgEl: HTMLImageElement | null, newSrc: string | null | undefined): boolean {
  if (!imgEl || !newSrc) return true;
  const currentAttr = imgEl.getAttribute('src');
  const boundAttr = imgEl.getAttribute('data-bound-src');
  if (boundAttr === newSrc || currentAttr === newSrc || imgEl.src === newSrc) return true;
  try {
    const base = typeof window !== 'undefined' ? window.location.href : 'http://localhost';
    const a = new URL(imgEl.src, base).href;
    const b = new URL(newSrc, base).href;
    if (a === b) return true;
  } catch (e) {}
  return false;
}

function safeSetImageSrc(imgEl: HTMLImageElement | null, newSrc: string | null | undefined): boolean {
  if (!imgEl || !newSrc) return false;
  if (isSameImageSrc(imgEl, newSrc)) return false;
  imgEl.setAttribute('data-bound-src', newSrc);
  imgEl.src = newSrc;
  return true;
}

/**
 * Applies a content/image/link/button override to a target element.
 */
function applyContentOverrideToElement(targetEl: HTMLElement, override: any, nodeId?: string, portfolioData?: any): void {
  const overrideObj = typeof override === 'object' && override !== null ? (override as any) : {};
  const type = typeof override === 'object' && override !== null ? overrideObj.type : 'text';
  const src = typeof override === 'object' && override !== null ? (overrideObj.src || overrideObj.url) : null;
  const val = typeof override === 'string' ? override : overrideObj.value;

  const isImageTarget = type === 'image' || Boolean(src) || targetEl.tagName === 'IMG' || (
    typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/') || val.startsWith('data:image/')) &&
    (targetEl.tagName === 'IMG' || Boolean(targetEl.querySelector('img')))
  );

  if (isImageTarget) {
    const finalSrc = src || val;
    if (finalSrc) {
      if (targetEl.tagName === 'IMG') {
        const imgEl = targetEl as HTMLImageElement;
        safeSetImageSrc(imgEl, finalSrc);
        if (overrideObj.alt) imgEl.alt = overrideObj.alt;
      } else {
        const childImg = targetEl.querySelector('img') as HTMLImageElement | null;
        if (childImg) {
          safeSetImageSrc(childImg, finalSrc);
          if (overrideObj.alt) childImg.alt = overrideObj.alt;
        }
      }
    }
  } else if (type === 'link' || targetEl.tagName === 'A') {
    if (overrideObj.text && targetEl.innerText !== overrideObj.text) targetEl.innerText = overrideObj.text;
    if (overrideObj.href) (targetEl as HTMLAnchorElement).href = overrideObj.href;
  } else if (type === 'button') {
    if (overrideObj.label && targetEl.innerText !== overrideObj.label) targetEl.innerText = overrideObj.label;
    if (overrideObj.url && targetEl.tagName === 'A') (targetEl as HTMLAnchorElement).href = overrideObj.url;
  } else if (val !== undefined && val !== null) {
    // If element contains an img tag, do not overwrite innerText as it would destroy the img DOM node
    if (targetEl.querySelector('img') && !targetEl.querySelector('p, span, h1, h2, h3, h4, h5, h6, a, button')) {
      return;
    }

    const originalText = targetEl.innerText ? targetEl.innerText.trim() : '';
    const isExplicitTemplateBinding = Boolean(
      targetEl.getAttribute('data-cv-field') ||
      targetEl.getAttribute('data-cv') ||
      targetEl.getAttribute('data-field') ||
      targetEl.getAttribute('data-editable')
    );

    const isDisplayHeadline = (
      targetEl.tagName === 'H1' ||
      targetEl.classList.contains('font-heading') ||
      Boolean(targetEl.closest('#hero h1, .hero h1'))
    );

    // Safeguard marketing display headlines:
    // Skip stale/generic single-word name overrides on long multi-line display headlines
    const isStaleNameOnHeadline = isDisplayHeadline && !isExplicitTemplateBinding && originalText.length > 25 && String(val).length < 20;

    if (!isStaleNameOnHeadline) {
      const hasAnimationStructure = Boolean(targetEl.querySelector('.letter, .word, .txt-fx'));
      if (hasAnimationStructure && originalText === String(val).trim()) {
        // Text is already matching; preserve the letter-split DOM structure for smooth animation
      } else if (targetEl.innerText !== String(val)) {
        targetEl.innerText = String(val);
      }
    }
  }
}

function normalizeSocialUrl(platform: string, rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  if (platform === 'email') {
    const cleanMail = trimmed.replace(/^mailto:/i, '').trim();
    return `mailto:${cleanMail}`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^\/\//.test(trimmed)) {
    return `https:${trimmed}`;
  }
  return `https://${trimmed}`;
}

function detectSemanticSocialPlatform(anchorEl: HTMLAnchorElement): string | null {
  const href = (anchorEl.getAttribute('href') || '').toLowerCase();
  const text = (anchorEl.innerText || anchorEl.textContent || '').toLowerCase();
  const aria = (anchorEl.getAttribute('aria-label') || anchorEl.getAttribute('title') || '').toLowerCase();
  const classes = (anchorEl.className && typeof anchorEl.className === 'string' ? anchorEl.className : '').toLowerCase();
  const id = (anchorEl.id || '').toLowerCase();

  const combined = `${href} ${text} ${aria} ${classes} ${id}`;

  const svgIcons = Array.from(anchorEl.querySelectorAll('svg, i, span'));
  let iconText = '';
  for (const icon of svgIcons) {
    const iconClass = (icon.className && typeof icon.className === 'string' ? icon.className : '').toLowerCase();
    const iconData = (icon.getAttribute('data-icon') || icon.getAttribute('title') || '').toLowerCase();
    iconText += ` ${iconClass} ${iconData}`;
  }

  const fullCombined = `${combined} ${iconText}`;

  if (fullCombined.includes('linkedin')) return 'linkedin';
  if (fullCombined.includes('dribbble')) return 'dribbble';
  if (fullCombined.includes('behance')) return 'behance';
  if (fullCombined.includes('github')) return 'github';
  if (fullCombined.includes('instagram')) return 'instagram';
  if (fullCombined.includes('twitter') || fullCombined.includes('x.com') || fullCombined.includes('twitter-icon')) return 'twitter';
  if (href.startsWith('mailto:') || fullCombined.includes('mailto:') || fullCombined.includes('email') || fullCombined.includes('envelope')) return 'email';
  if (fullCombined.includes('website') || fullCombined.includes('portfolio') || fullCombined.includes('globe')) return 'website';

  return null;
}

function resolveUserSocialUrl(platform: string, portfolioData: any): string {
  if (!portfolioData) return '';

  if (platform === 'email') {
    return (
      portfolioData.email ||
      portfolioData.personal?.email ||
      portfolioData.profile?.email ||
      portfolioData.ownerEmail ||
      portfolioData.canonicalProfile?.personal?.email ||
      ''
    );
  }

  const socials = portfolioData.socials || portfolioData.social || portfolioData.socialLinks || {};

  if (platform === 'linkedin') return socials.linkedin || portfolioData.canonicalProfile?.social?.linkedin || '';
  if (platform === 'dribbble') return socials.dribbble || (portfolioData.canonicalProfile?.social as any)?.dribbble || '';
  if (platform === 'behance') return socials.behance || (portfolioData.canonicalProfile?.social as any)?.behance || '';
  if (platform === 'github') return socials.github || portfolioData.canonicalProfile?.social?.github || '';
  if (platform === 'instagram') return socials.instagram || (portfolioData.canonicalProfile?.social as any)?.instagram || '';
  if (platform === 'twitter') return socials.twitter || socials.x || portfolioData.canonicalProfile?.social?.twitter || '';
  if (platform === 'website') return socials.website || socials.url || (portfolioData.canonicalProfile?.social as any)?.website || '';

  return socials[platform] || '';
}

function bindSocialLinks(rootEl: HTMLElement, portfolioData: any, auditLog: any): void {
  const anchors = Array.from(rootEl.querySelectorAll('a')) as HTMLAnchorElement[];
  const unresolved: HTMLAnchorElement[] = [];

  for (const anchor of anchors) {
    const platform = detectSemanticSocialPlatform(anchor);
    if (!platform) {
      const parentSec = anchor.closest('#contact, #footer, .social, .socials, .contact, nav');
      const hasIcon = anchor.querySelector('svg, i, img') !== null;
      if (parentSec || hasIcon) {
        unresolved.push(anchor);
      }
      continue;
    }

    const originalHref = anchor.getAttribute('href') || '';
    const userUrl = resolveUserSocialUrl(platform, portfolioData);

    if (userUrl && userUrl.trim().length > 0) {
      const boundHref = normalizeSocialUrl(platform, userUrl);
      if (boundHref && anchor.href !== boundHref) {
        anchor.href = boundHref;
        anchor.setAttribute('href', boundHref);
      }

      if (auditLog && auditLog.social) {
        const auditPlatformKey = platform === 'linkedin' ? 'LinkedIn' : (platform === 'behance' ? 'Behance' : (platform === 'dribbble' ? 'Dribbble' : (platform === 'email' ? 'Email' : platform.charAt(0).toUpperCase() + platform.slice(1))));
        if (auditLog.social[auditPlatformKey]) {
          auditLog.social[auditPlatformKey] = {
            original: originalHref,
            bound: boundHref,
            working: true
          };
        }
      }
    }
  }
}

export const SAFE_AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F2EEE9" />
      <stop offset="100%" stop-color="#E5E0D8" />
    </linearGradient>
    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#999999" />
      <stop offset="100%" stop-color="#666666" />
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bgGrad)" />
  <circle cx="200" cy="190" r="70" fill="url(#avatarGrad)" opacity="0.85" />
  <path d="M 90 420 C 90 310, 310 310, 310 420 Z" fill="url(#avatarGrad)" opacity="0.85" />
</svg>
`)}`;

export function resolveProfileImage({
  userImg,
  originalSrc,
  renderMode,
  templateId
}: {
  userImg?: string;
  originalSrc?: string;
  renderMode: string;
  templateId?: string;
}): { url: string; source: 'user' | 'template-fallback' | 'placeholder' | 'none' } {
  const hasUserImg = typeof userImg === 'string' && userImg.trim().length > 0;

  if (hasUserImg) {
    return { url: userImg.trim(), source: 'user' };
  }

  // When user has no profile photo, ALWAYS return SAFE_AVATAR_PLACEHOLDER.
  // NEVER use originalSrc (template demo photograph / Maya Kapoor) as a fallback!
  return { url: SAFE_AVATAR_PLACEHOLDER, source: 'placeholder' };
}

function bindProfileImages(rootEl: HTMLElement, portfolioData: any, auditLog: any): void {
  const images = Array.from(rootEl.querySelectorAll('img')) as HTMLImageElement[];
  if (images.length === 0) return;

  let profileImgEl: HTMLImageElement | null = null;

  for (const img of images) {
    const parentSec = img.closest('#hero, #about, #intro, #home, .hero, .about, .profile, .intro') as HTMLElement | null;
    const classes = (img.className && typeof img.className === 'string' ? img.className : '').toLowerCase();
    const alt = (img.alt || '').toLowerCase();
    const id = (img.id || '').toLowerCase();
    const src = (img.src || '').toLowerCase();

    if (
      parentSec ||
      classes.includes('avatar') || classes.includes('profile') || classes.includes('portrait') || classes.includes('photo') || classes.includes('user') || classes.includes('author') ||
      alt.includes('avatar') || alt.includes('profile') || alt.includes('portrait') || alt.includes('photo') || alt.includes('alex') || alt.includes('user') ||
      id.includes('avatar') || id.includes('profile') || id.includes('portrait') ||
      src.includes('portrait') || src.includes('avatar') || src.includes('profile') || src.includes('alex')
    ) {
      profileImgEl = img;
      break;
    }
  }

  if (!profileImgEl && images.length > 0) {
    const firstHeroImg = rootEl.querySelector('#hero img, header img, section:first-of-type img') as HTMLImageElement | null;
    if (firstHeroImg) profileImgEl = firstHeroImg;
  }

  if (profileImgEl) {
    const originalSrc = profileImgEl.getAttribute('data-original-src') || profileImgEl.src;
    if (!profileImgEl.hasAttribute('data-original-src')) {
      profileImgEl.setAttribute('data-original-src', originalSrc);
    }

    const nodeId = profileImgEl.getAttribute('data-node-id') || 'image:hero:root:img:0';
    const explicitOverride =
      portfolioData.contentOverrides?.[nodeId]?.src ||
      (typeof portfolioData.contentOverrides?.[nodeId] === 'string' ? portfolioData.contentOverrides?.[nodeId] : '') ||
      portfolioData.imageOverrides?.[nodeId];

    const explicitSrc = typeof explicitOverride === 'object' && explicitOverride !== null ? (explicitOverride as any).src : explicitOverride;

    const resolvedUserImg =
      (typeof explicitSrc === 'string' && explicitSrc.trim().length > 0 ? explicitSrc.trim() : '') ||
      portfolioData.profileImage ||
      portfolioData.avatar ||
      portfolioData.photo ||
      portfolioData.image ||
      portfolioData.avatarUrl ||
      portfolioData.personal?.profilePhoto ||
      portfolioData.profile?.avatarUrl ||
      portfolioData.profile?.photo ||
      portfolioData.profile?.image ||
      portfolioData.profile?.profileImage ||
      portfolioData.hero?.avatarUrl ||
      portfolioData.hero?.profileImage ||
      portfolioData.about?.avatarUrl ||
      portfolioData.about?.image ||
      portfolioData.images?.profileImage ||
      '';

    const renderMode = portfolioData.renderMode || portfolioData.mode || 'preview';
    const templateId = portfolioData.templateId || portfolioData.layoutStyle || '';

    const resolved = resolveProfileImage({
      userImg: resolvedUserImg,
      originalSrc,
      renderMode,
      templateId
    });

    safeSetImageSrc(profileImgEl, resolved.url);
    profileImgEl.style.objectFit = 'cover';

    if (auditLog) {
      auditLog.profileImage = {
        source: resolved.source,
        resolvedUrl: resolved.url.startsWith('data:') ? 'SAFE_SVG_PLACEHOLDER' : resolved.url,
        demoFallback: resolved.source === 'template-fallback'
      };
    }
  }
}

/**
 * Universal Master Override Application Engine.
 * Applies ALL content, image, text, link, button, style, background, typography, and visibility overrides to DOM elements.
 * Handles stale DB data by normalizing containerKey variants (card:N ↔ root) via resolveOverrideElement.
 */
export function applyPortfolioOverrides(
  rootEl: HTMLElement,
  portfolioData: any = {}
): void {
  if (!rootEl || !portfolioData) return;

  const contentOverrides = portfolioData.contentOverrides || {};
  const styleOverrides = portfolioData.styleOverrides || {};
  const imageOverrides = portfolioData.imageOverrides || {};
  const deletedNodes = portfolioData.deletedNodes || {};

  const mergedContent = { ...contentOverrides, ...imageOverrides };

  // Initialize Data Binding Audit Log Object
  const auditLog: any = {
    templateId: portfolioData.templateId || portfolioData.layoutStyle || '',
    profileImage: {
      source: 'portfolio.profileImage',
      resolvedUrl: portfolioData.profileImage || portfolioData.avatarUrl || 'N/A',
      demoFallback: false
    },
    social: {
      LinkedIn: { original: 'N/A', bound: 'N/A', working: true },
      Behance: { original: 'N/A', bound: 'N/A', working: true },
      Dribbble: { original: 'N/A', bound: 'N/A', working: true },
      Email: { original: 'N/A', bound: 'N/A', working: true }
    }
  };

  // 1. Reset any elements previously marked deleted that are no longer in deletedNodes (e.g. after Undo / Redo)
  const allPotentiallyHidden = Array.from(rootEl.querySelectorAll('[data-node-deleted="true"], [data-node-id]')) as HTMLElement[];
  for (const el of allPotentiallyHidden) {
    const nodeId = el.getAttribute('data-node-id');
    if (!nodeId || deletedNodes[nodeId] !== true) {
      if (el.getAttribute('data-node-deleted') === 'true' || el.style.display === 'none' || el.style.visibility === 'hidden') {
        el.removeAttribute('data-node-deleted');
        el.style.removeProperty('display');
        el.style.removeProperty('visibility');
        el.style.removeProperty('pointer-events');
      }
    }
  }

  // 2. Apply Deleted Nodes Overrides
  Object.entries(deletedNodes).forEach(([nodeId, isDeleted]) => {
    if (!nodeId) return;
    const targetEl = resolveOverrideElement(rootEl, nodeId);
    if (!targetEl) return;

    if (isDeleted === true) {
      const tag = targetEl.tagName.toUpperCase();
      const isBlockLevel = ['SECTION', 'DIV', 'HEADER', 'FOOTER', 'NAV', 'MAIN', 'ARTICLE', 'UL', 'OL', 'LI'].includes(tag);
      if (isBlockLevel) {
        targetEl.style.setProperty('display', 'none', 'important');
      } else {
        targetEl.style.setProperty('visibility', 'hidden', 'important');
        targetEl.style.setProperty('pointer-events', 'none', 'important');
      }
      targetEl.setAttribute('data-node-deleted', 'true');
    } else {
      targetEl.removeAttribute('data-node-deleted');
      targetEl.style.removeProperty('display');
      targetEl.style.removeProperty('visibility');
      targetEl.style.removeProperty('pointer-events');
    }
  });

  // 3. Apply Content & Image Overrides
  Object.entries(mergedContent).forEach(([nodeId, override]) => {
    if (override === undefined || override === null) return;
    if (deletedNodes[nodeId] === true) return; // Skip if deleted
    const targetEl = resolveOverrideElement(rootEl, nodeId);
    if (!targetEl) return;
    applyContentOverrideToElement(targetEl, override, nodeId, portfolioData);
  });

  // 4. Apply Style & Visibility Overrides
  Object.entries(styleOverrides).forEach(([nodeId, styles]) => {
    if (!styles || typeof styles !== 'object') return;
    if (deletedNodes[nodeId] === true) return; // Skip if deleted
    const targetEl = resolveOverrideElement(rootEl, nodeId);
    if (!targetEl) return;

    Object.entries(styles).forEach(([prop, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        try {
          if (cssProp === 'background-color' || cssProp === 'background') {
            targetEl.style.setProperty('background-color', String(val), 'important');
            targetEl.style.setProperty('background', String(val), 'important');
          } else {
            targetEl.style.setProperty(cssProp, String(val), 'important');
          }
        } catch (e) {
          (targetEl.style as any)[prop] = val;
        }
      }
    });
  });

  // 4.5 Apply Semantic data-cv Bindings
  const resolveBindingValue = (fieldPath: string): any => {
    if (!fieldPath) return undefined;
    // Normalize array access like projects.items[1].title or projects[1].title -> projects.1.title
    const normalizedPath = fieldPath
      .replace(/items\[(\d+)\]/g, '$1')
      .replace(/\[(\d+)\]/g, '.$1')
      .replace(/\.+/g, '.');

    const parts = normalizedPath.split('.');
    if (parts[0] === 'hero' || parts[0] === 'profile' || parts[0] === 'personal' || parts[0] === 'personalInfo' || parts[0] === 'basics') {
      if (['name', 'fullName', 'brand'].includes(parts[1])) {
        const rawHeroName = portfolioData.hero?.name;
        const isPlName = rawHeroName && (rawHeroName.includes('ANUSHKA') || rawHeroName.includes('Anushka') || rawHeroName === 'Portfolio' || rawHeroName === 'PORTFOLIO');
        return (!isPlName && rawHeroName) || portfolioData.name || portfolioData.fullName || portfolioData.profile?.fullName || portfolioData.profile?.name || portfolioData.personal?.fullName || portfolioData.personal?.name || portfolioData.basics?.name || undefined;
      }
      if (['role', 'headline', 'title', 'tagline'].includes(parts[1])) {
        const rawHeroTitle = portfolioData.hero?.title;
        const isPlTitle = rawHeroTitle && (rawHeroTitle.includes('UI/UX Designer &') || rawHeroTitle.includes('UI/UX Designer'));
        return (!isPlTitle && rawHeroTitle) || portfolioData.headline || portfolioData.title || portfolioData.profile?.headline || portfolioData.personal?.headline || portfolioData.role || portfolioData.basics?.label || undefined;
      }
      if (['description', 'bio', 'summary', 'about'].includes(parts[1])) {
        return portfolioData.hero?.description || portfolioData.profile?.summary || portfolioData.profile?.bio || portfolioData.bio || portfolioData.summary || portfolioData.aboutMe || portfolioData.personal?.summary || undefined;
      }
      if (['location', 'city', 'address'].includes(parts[1])) {
        return portfolioData.location || portfolioData.hero?.location || portfolioData.profile?.location || portfolioData.personalInfo?.location || portfolioData.personal?.location || portfolioData.basics?.location?.city || portfolioData.basics?.location?.address || portfolioData.basics?.location || portfolioData.city || portfolioData.address || undefined;
      }
    }
    if (parts.length === 1 && (parts[0] === 'name' || parts[0] === 'fullName')) {
      const rawHeroName = portfolioData.hero?.name;
      const isPlName = rawHeroName && (rawHeroName.includes('ANUSHKA') || rawHeroName.includes('Anushka') || rawHeroName === 'Portfolio' || rawHeroName === 'PORTFOLIO');
      return (!isPlName && rawHeroName) || portfolioData.name || portfolioData.fullName || portfolioData.profile?.fullName || portfolioData.profile?.name || undefined;
    }
    let curr: any = portfolioData;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (curr && typeof curr === 'object') {
        if (p in curr && curr[p] !== undefined && curr[p] !== '') {
          curr = curr[p];
        } else if (Array.isArray(curr) && !isNaN(Number(p))) {
          curr = curr[Number(p)];
        } else if (['year', 'period', 'duration', 'date', 'dates', 'years'].includes(p) && typeof curr === 'object') {
          const s = curr.startDate || curr.startYear || curr.start || curr.from || '';
          const e = curr.endDate || curr.endYear || curr.graduationYear || curr.end || curr.to || '';
          curr = (s && e && s !== e) ? `${s} – ${e}` : (s || e || curr.year || curr.period || curr.duration || undefined);
        } else if (['degree', 'qualification', 'title'].includes(p) && typeof curr === 'object') {
          curr = curr.degree || curr.qualification || curr.title || curr.degreeTitle || undefined;
        } else if (['institution', 'school', 'university', 'college'].includes(p) && typeof curr === 'object') {
          curr = curr.institution || curr.school || curr.university || curr.college || undefined;
        } else if (['field', 'fieldOfStudy', 'specialization', 'department', 'major'].includes(p) && typeof curr === 'object') {
          curr = curr.fieldOfStudy || curr.field || curr.specialization || curr.department || curr.major || undefined;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    }
    return curr;
  };

  const boundElements = Array.from(rootEl.querySelectorAll('[data-cv], [data-cv-field], [data-field], [data-editable]')) as HTMLElement[];
  for (const el of boundElements) {
    let fieldPath = el.getAttribute('data-cv') || el.getAttribute('data-cv-field') || el.getAttribute('data-field') || el.getAttribute('data-editable');
    if (!fieldPath) continue;
    if (!fieldPath.includes('.') && !fieldPath.includes('[')) {
      const colCtx = detectCollectionContext(el);
      if (colCtx.collection && colCtx.collectionIndex !== undefined) {
        fieldPath = `${colCtx.collection}[${colCtx.collectionIndex}].${fieldPath}`;
      } else if (fieldPath === 'image' || fieldPath === 'photo' || fieldPath === 'avatar') {
        continue;
      }
    }
    const boundVal = resolveBindingValue(fieldPath);
    if (boundVal !== undefined && boundVal !== null) {
      if (typeof boundVal === 'string' && boundVal.trim().length === 0) continue;
      applyContentOverrideToElement(el, boundVal);
    }
  }

  // Check if rootEl contains a React-managed template root
  const isReactTemplate = rootEl.querySelector('[data-campuscv-template]') !== null || 
    rootEl.querySelector('.campuscv-template-root') !== null ||
    (portfolioData as any)?.__IS_REACT_TEMPLATE__ === true;

  if (!isReactTemplate) {
    // 4.6 Bind Profile Images (For pure HTML templates)
    bindProfileImages(rootEl, portfolioData, auditLog);

    // 4.7 Bind Social Links to Anchors
    bindSocialLinks(rootEl, portfolioData, auditLog);

    // 4.8 Universal Automatic Binding Engine Orchestration
    UniversalBindingEngine.bindPortfolioToDOM(rootEl, portfolioData);

    // 4.85 Final Override Enforcement: Re-apply explicit content/image overrides so user edits take precedence over auto-binding
    Object.entries(mergedContent).forEach(([nodeId, override]) => {
      if (override === undefined || override === null) return;
      if (deletedNodes[nodeId] === true) return;
      const targetEl = resolveOverrideElement(rootEl, nodeId);
      if (!targetEl) return;
      applyContentOverrideToElement(targetEl, override, nodeId, portfolioData);
    });

    // 4.9 Content-Driven Section Visibility Rules
    applySectionVisibilityRules(rootEl, portfolioData);

    // 5. Apply Section Reordering for static HTML templates
    const sectionOrder = portfolioData.sectionOrder || [];
    if (Array.isArray(sectionOrder) && sectionOrder.length > 0) {
      reorderDOMSections(rootEl, sectionOrder);
    }
  }

  // 6. Render Dynamically Added Elements (Headings, Text, Buttons, Images)
  const addedElements = portfolioData.addedElements || [];
  if (Array.isArray(addedElements) && addedElements.length > 0) {
    addedElements.forEach((elem: any) => {
      if (!elem || !elem.id) return;
      let existing = rootEl.querySelector(`[data-added-element-id="${elem.id}"]`) as HTMLElement | null;
      if (!existing) {
        const tag = elem.type === 'heading' ? 'h3' : (elem.type === 'button' ? 'button' : (elem.type === 'image' ? 'img' : 'p'));
        existing = document.createElement(tag);
        existing.setAttribute('data-added-element-id', elem.id);
        existing.setAttribute('data-node-id', elem.id);
        existing.setAttribute('data-node-type', elem.type || 'text');
        existing.className = 'custom-added-element px-4 py-2 my-2 transition-all cursor-pointer';

        let parentEl: HTMLElement | null = null;
        if (elem.parentNodeId) {
          parentEl = resolveOverrideElement(rootEl, elem.parentNodeId);
        }
        if (!parentEl) {
          parentEl = rootEl.querySelector('section, main, div') || rootEl;
        }
        parentEl.appendChild(existing);
      }

      if (elem.type === 'image') {
        (existing as HTMLImageElement).src = elem.src || elem.content || '';
      } else {
        existing.innerText = elem.content || elem.value || '';
      }
      if (elem.style && typeof elem.style === 'object') {
        Object.entries(elem.style).forEach(([k, v]) => {
          (existing!.style as any)[k] = v;
        });
      }
    });
  }

  // 7. Apply Content-Driven Section Visibility Rules
  applySectionVisibilityRules(rootEl, portfolioData);
}



export function reorderDOMSections(rootEl: HTMLElement, sectionOrder: string[] = []): void {
  if (!rootEl || !Array.isArray(sectionOrder) || sectionOrder.length < 2) return;

  // React templates handle section ordering natively in JSX via data.sectionOrder / data.sections.
  // We should NEVER manipulate the DOM node tree (e.g. appendChild) on React-managed templates
  // as it breaks React fiber reconciliation and causes removeChild / NotFoundError crashes.
  const isReactManaged = Boolean(
    rootEl.querySelector('[data-campuscv-template], [data-template-id], .card-deck-template-root, .uploaded-template-runner, .template-runtime-root, .campuscv-template-root') ||
    rootEl.closest('[data-campuscv-template], [data-template-id], .uploaded-template-runner, .template-runtime-root, .campuscv-template-root') ||
    rootEl.getAttribute('data-template-id') ||
    rootEl.getAttribute('data-campuscv-template') ||
    rootEl.classList.contains('uploaded-template-runner') ||
    rootEl.classList.contains('campuscv-template-root')
  );

  if (isReactManaged) {
    return;
  }

  // Collect all section candidate DOM elements for static HTML previews
  const allSectionEls = Array.from(
    rootEl.querySelectorAll('section, [data-cv-section], [data-section], [data-section-id], #hero, #home, #intro, #about, #projects, #experience, #education, #skills, #certifications, #achievements, #interests, #publications, #awards, #contact, #footer, #process, #testimonial, .custom-added-section')
  ) as HTMLElement[];

  if (allSectionEls.length < 2) return;

  // Filter out nested child sections (keep top-level section containers)
  const topSections = allSectionEls.filter((el) => {
    return !allSectionEls.some((parent) => parent !== el && parent.contains(el));
  });

  const normalizeSecKey = (k: string): string => {
    const s = String(k || '').toLowerCase().trim();
    if (s === 'home' || s === 'intro' || s === 'header') return 'hero';
    if (s === 'bio' || s === 'aboutme' || s === 'about-me') return 'about';
    if (s === 'certificates' || s === 'certificate' || s === 'certifications' || s === 'certification' || s === 'awards' || s === 'achievements' || s === 'credentials') return 'certifications';
    if (s === 'timeline' || s === 'work' || s === 'employment' || s === 'experience' || s === 'job' || s === 'jobs') return 'experience';
    if (s === 'academics' || s === 'academic' || s === 'qualification' || s === 'qualifications' || s === 'education') return 'education';
    if (s === 'portfolio' || s === 'works' || s === 'project' || s === 'projects') return 'projects';
    if (s === 'tech' || s === 'stack' || s === 'tools' || s === 'technologies' || s === 'skill' || s === 'skills') return 'skills';
    if (s === 'workflow' || s === 'process') return 'process';
    if (s === 'testimonial' || s === 'testimonials' || s === 'reviews' || s === 'review') return 'testimonials';
    if (s === 'social' || s === 'socials' || s === 'contact' || s === 'getintouch') return 'contact';
    if (s === 'services' || s === 'specialties') return 'services';
    return s;
  };

  const matchesSection = (el: HTMLElement, secId: string) => {
    const rawId = (el.id || '').toLowerCase().trim();
    const rawNodeAttr = (el.getAttribute('data-node-id') || '').toLowerCase().trim();
    const rawSecAttr = (
      el.getAttribute('data-cv-section') ||
      el.getAttribute('data-section') ||
      el.getAttribute('data-section-id') ||
      ''
    ).toLowerCase().trim();

    const targetKey = normalizeSecKey(secId);
    const idKey = normalizeSecKey(rawId);
    const secKey = normalizeSecKey(rawSecAttr);

    if (idKey === targetKey && idKey !== '') return true;
    if (secKey === targetKey && secKey !== '') return true;
    if (rawId === secId.toLowerCase().trim() && rawId !== '') return true;
    if (rawSecAttr === secId.toLowerCase().trim() && rawSecAttr !== '') return true;

    if (rawNodeAttr && (
      rawNodeAttr.includes(`section:${targetKey}:`) ||
      rawNodeAttr.includes(`:${targetKey}:`) ||
      rawNodeAttr.includes(`section:${secId.toLowerCase().trim()}:`) ||
      rawNodeAttr.includes(`:${secId.toLowerCase().trim()}:`)
    )) return true;

    if (idKey && targetKey && (idKey.includes(targetKey) || targetKey.includes(idKey))) return true;
    if (secKey && targetKey && (secKey.includes(targetKey) || targetKey.includes(secKey))) return true;

    return false;
  };

  // Map sectionOrder IDs to actual DOM elements
  const orderedEls: HTMLElement[] = [];
  const remainingEls = [...topSections];

  for (const secId of sectionOrder) {
    const foundIdx = remainingEls.findIndex((el) => matchesSection(el, secId));
    if (foundIdx !== -1) {
      orderedEls.push(remainingEls[foundIdx]);
      remainingEls.splice(foundIdx, 1);
    }
  }

  // Ensure hero section stays at the top (index 0) if unlisted in sectionOrder
  const heroIdxInRemaining = remainingEls.findIndex((el) => matchesSection(el, 'hero'));
  if (heroIdxInRemaining !== -1) {
    const heroEl = remainingEls.splice(heroIdxInRemaining, 1)[0];
    orderedEls.unshift(heroEl);
  }

  orderedEls.push(...remainingEls);

  // Apply CSS order safely without reparenting
  orderedEls.forEach((el, idx) => {
    el.style.order = String(idx);
    if (el.parentElement) {
      const parentEl = el.parentElement;
      const comp = window.getComputedStyle(parentEl);
      if (comp.display !== 'flex' && comp.display !== 'grid') {
        parentEl.style.display = 'flex';
        parentEl.style.flexDirection = 'column';
      }
    }
  });
}

function getTopLevelSectionWrapper(el: HTMLElement, rootEl: HTMLElement): HTMLElement | null {
  let curr: HTMLElement | null = el;
  while (curr && curr.parentElement && curr.parentElement !== rootEl) {
    curr = curr.parentElement;
  }
  return curr;
}

/**
 * Backward compatibility alias for applyPortfolioOverrides.
 */
export function applyNodeOverrides(
  rootEl: HTMLElement,
  contentOverrides: Record<string, any> = {},
  styleOverrides: Record<string, any> = {}
): void {
  applyPortfolioOverrides(rootEl, { contentOverrides, styleOverrides });
}

/**
 * Strips all engine-assigned node attributes and engine-set display:none overrides
 * from the template DOM. Call this before re-running discoverEditableNodes so that
 * node IDs are deterministically re-assigned from a clean state (important on
 * undo/redo when the deleted-nodes map changes).
 */
export function resetDOMNodeAttributes(rootEl: HTMLElement): void {
  if (!rootEl) return;
  // Restore elements that were hidden by the deletion engine
  const deletedEls = Array.from(rootEl.querySelectorAll('[data-node-deleted="true"]')) as HTMLElement[];
  for (const el of deletedEls) {
    el.removeAttribute('data-node-deleted');
    el.style.removeProperty('display');
    el.style.removeProperty('visibility');
    el.style.removeProperty('pointer-events');
  }
  // Clear only selection highlight attributes
  const selectedEls = Array.from(rootEl.querySelectorAll('[data-node-selected="true"]')) as HTMLElement[];
  for (const el of selectedEls) {
    el.removeAttribute('data-node-selected');
  }
}

/**
 * Shared Override Runtime: Attaches a high-performance MutationObserver to reconcile DOM text, image & style mutations
 * with portfolio.contentOverrides, portfolio.imageOverrides and portfolio.styleOverrides dynamically in BOTH Editor Mode and Public Mode (/p/[username]).
 *
 * IMPORTANT: Accepts a `getPortfolioData` GETTER function (not a snapshot) so the MutationObserver
 * callback always reads the *current* portfolio state rather than the stale closure captured at
 * mount time. This is the fix for the undo/redo/delete UI regression.
 */
let activeObserver: any = null;

export function attachNodeOverrideObserver(
  rootEl: HTMLElement,
  getPortfolioData: (() => any) | any,
  templateId: string = 'template'
): () => void {
  if (!rootEl || typeof window === 'undefined' || !(window as any).MutationObserver) {
    return () => { };
  }

  // Support both legacy direct-object and new getter-function signatures
  const getData: () => any = typeof getPortfolioData === 'function'
    ? getPortfolioData
    : () => getPortfolioData;

  const currentData = getData();
  const renderMode = currentData?.renderMode || currentData?.mode;
  // In published mode (/username or /p/username), do not attach persistent MutationObserver.
  // Overrides are already applied statically on mount. A persistent observer causes hover/Tailwind flicker loops.
  if (renderMode === 'published' || currentData?.isEditMode === false) {
    return () => { };
  }

  if (activeObserver) {
    try { activeObserver.disconnect(); } catch (e) { }
    activeObserver = null;
  }

  // runReconciliation only applies overrides - node ID discovery is done once on template init,
  // not on every DOM mutation. Calling discoverEditableNodes here would:
  //   1. Re-assign data-node-id attributes, triggering more mutations → observer re-fires
  //   2. Be unnecessarily expensive on every DOM mutation
  // Re-entrant guard: prevents observer from firing while applyPortfolioOverrides
  // is itself mutating the DOM, which would otherwise create an infinite callback loop
  // that pins the main thread at 100% CPU and causes "Page Unresponsive".
  let isReconciling = false;

  const runReconciliation = () => {
    if (!rootEl || isReconciling) return;
    isReconciling = true;
    try {
      applyPortfolioOverrides(rootEl, getData());
    } finally {
      isReconciling = false;
    }
  };

  runReconciliation();

  // Track rAF id so it can be cancelled on cleanup — prevents stale rAF from a
  // previous render firing AFTER the next render's immediate runReconciliation
  // and overwriting the correct (newer) portfolio state.
  let rafId: number | null = null;
  if (typeof requestAnimationFrame !== 'undefined') {
    rafId = requestAnimationFrame(() => {
      rafId = null;
      runReconciliation();
    });
  }

  // Debounce timer: coalesce rapid DOM mutations (e.g. React reconciliation bursts)
  // into a single reconciliation call rather than one per mutation record.
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const ObserverClass = (window as any).MutationObserver;
  const observer = new ObserverClass((mutations: any[]) => {
    if (isReconciling) return; // Skip mutations caused by our own reconciliation

    let shouldSync = false;
    for (const m of mutations) {
      if (m.type === 'childList' || m.type === 'characterData') {
        shouldSync = true;
        break;
      }
      if (m.type === 'attributes') {
        const attr = m.attributeName;
        if (attr && ['src', 'href', 'data-node-id', 'data-field', 'data-edit-key', 'alt'].includes(attr)) {
          shouldSync = true;
          break;
        }
      }
    }

    if (shouldSync) {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        observer.disconnect();
        runReconciliation();
        try {
          observer.observe(rootEl, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['src', 'href', 'data-node-id', 'data-field', 'data-edit-key', 'alt']
          });
        } catch (e) { }
      }, 50);
    }
  });

  try {
    observer.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'data-node-id', 'data-field', 'data-edit-key', 'alt']
    });
    activeObserver = observer;
  } catch (e) { }

  return () => {
    // Cancel pending rAF to prevent stale data from overwriting newer render
    if (rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    // Cancel any pending debounced reconciliation
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    try { observer.disconnect(); } catch (e) { }
    if (activeObserver === observer) activeObserver = null;
  };
}

const FIELD_MAPS: Record<string, Record<string, string[]>> = {
  certifications: {
    title: ['title', 'name', 'certification', 'certificateName', 'heading'],
    issuer: ['issuer', 'organization', 'provider', 'company', 'institution', 'subtitle'],
    year: ['year', 'date', 'issuedDate', 'period']
  },
  projects: {
    title: ['title', 'name', 'projectName', 'heading'],
    description: ['description', 'summary', 'details', 'text'],
    image: ['image', 'imageUrl', 'thumbnail', 'photo', 'src'],
    url: ['url', 'link', 'projectUrl', 'href'],
    category: ['category', 'tag', 'type']
  },
  experience: {
    role: ['role', 'position', 'title', 'jobTitle', 'heading'],
    company: ['company', 'organization', 'employer', 'subtitle'],
    startDate: ['startDate', 'from', 'start'],
    endDate: ['endDate', 'to', 'end', 'period'],
    description: ['description', 'summary', 'details']
  },
  education: {
    degree: ['degree', 'title', 'qualification', 'heading'],
    institution: ['institution', 'school', 'university', 'college', 'subtitle'],
    year: ['year', 'date', 'graduationYear', 'period']
  },
  skills: {
    name: ['name', 'skill', 'title', 'heading'],
    category: ['category', 'group']
  },
  services: {
    title: ['title', 'name', 'service', 'heading'],
    description: ['description', 'summary', 'details']
  }
};

function resolveFieldValue(item: any, fieldKey: string): string | undefined {
  if (item === undefined || item === null) return undefined;
  if (typeof item === 'string') {
    return fieldKey === 'title' || fieldKey === 'name' ? item : undefined;
  }

  // If asking for year / date range, format deterministically using single source of truth
  if (fieldKey === 'year' || fieldKey === 'period' || fieldKey === 'dates' || fieldKey === 'duration') {
    const formattedRange = formatNormalizedDateRange({
      startDate: item.startDate || item.start || item.from,
      endDate: item.endDate || item.end || item.to,
      startYear: item.startYear,
      endYear: item.endYear,
      year: item.year || item.date || item.issuedDate || item.graduationYear,
      current: item.current,
      period: item.period || item.duration || item.dates
    });
    if (formattedRange) return formattedRange;
  }

  const aliasMap: Record<string, string[]> = {
    title: ['title', 'name', 'certification', 'certificateName', 'certName', 'heading', 'degree', 'role', 'projectName'],
    issuer: ['issuer', 'organization', 'provider', 'company', 'institution', 'school', 'subtitle', 'employer'],
    year: ['period', 'duration', 'dates', 'year', 'date', 'issuedDate', 'years', 'graduationYear', 'startDate', 'endDate'],
    description: ['description', 'summary', 'details', 'text', 'body'],
    image: ['image', 'imageUrl', 'thumbnail', 'photo', 'src', 'coverImage'],
    url: ['url', 'link', 'projectUrl', 'href', 'credentialUrl', 'liveUrl']
  };

  const aliases = aliasMap[fieldKey] || [fieldKey];
  for (const alias of aliases) {
    if (item[alias] !== undefined && item[alias] !== null) {
      const str = String(item[alias]).trim();
      if (str.length > 0 && str !== 'undefined' && str !== 'null') return str;
    }
  }

  return undefined;
}

function bindItemFieldsToClone(clone: HTMLElement, item: any, sectionId: string): void {
  const titleVal = resolveFieldValue(item, 'title');
  const issuerVal = resolveFieldValue(item, 'issuer');
  const yearVal = resolveFieldValue(item, 'year');
  const descVal = resolveFieldValue(item, 'description');
  const imageVal = resolveFieldValue(item, 'image');
  const urlVal = resolveFieldValue(item, 'url');

  if (titleVal) {
    const titleEl = (clone.querySelector('h1, h2, h3, h4, h5, h6, strong, b, [class*="heading"], [class*="title"]') as HTMLElement | null) || clone;
    if (titleEl) {
      const span = titleEl.querySelector('span');
      if (span) span.textContent = titleVal;
      else titleEl.textContent = titleVal;
    }
  }

  if (issuerVal) {
    const issuerEl = (clone.querySelector('p, div.text-xs, div.text-sm, [class*="subtitle"], [class*="company"], [class*="issuer"]') as HTMLElement | null);
    if (issuerEl) {
      issuerEl.textContent = issuerVal;
    }
  }

  if (yearVal) {
    const yearEl = (clone.querySelector('time, span.rounded-full, span.px-3, span.date, .period, [class*="year"], [class*="date"]') as HTMLElement | null);
    if (yearEl) {
      yearEl.textContent = yearVal;
    }
  }

  if (descVal) {
    const descEl = (clone.querySelector('p.text-sm, p.text-base, div.description, [class*="description"]') as HTMLElement | null);
    if (descEl && descEl !== (clone.querySelector('h3, h2, h1') as any)) {
      descEl.textContent = descVal;
    }
  }

  if (imageVal) {
    const imgEl = clone.querySelector('img') as HTMLImageElement | null;
    if (imgEl) {
      safeSetImageSrc(imgEl, imageVal);
      if (titleVal) imgEl.alt = titleVal;
    }
  }

  if (urlVal) {
    const linkEl = clone.querySelector('a') as HTMLAnchorElement | null;
    if (linkEl) {
      linkEl.href = urlVal;
      if (!urlVal.startsWith('#') && !urlVal.startsWith('/')) {
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
      }
    }
  }

  if (typeof window !== 'undefined') {
    console.log('[DOM BIND]', {
      section: sectionId,
      field: 'title',
      value: titleVal,
      targetCount: 1
    });
  }
}

function isElementReactManaged(el: HTMLElement | null): boolean {
  if (!el) return false;
  const doc = el.ownerDocument || (typeof document !== 'undefined' ? document : null);
  if (!doc) return false;
  if (doc.getElementById('iframe-root') || doc.getElementById('template-root') || doc.getElementById('template-inner-wrapper')) {
    return true;
  }
  return Boolean(
    el.querySelector('[data-campuscv-template], [data-template-id], .uploaded-template-runner, .template-runtime-root, .campuscv-template-root') ||
    el.closest('[data-campuscv-template], [data-template-id], .uploaded-template-runner, .template-runtime-root, .campuscv-template-root') ||
    el.getAttribute('data-template-id') ||
    el.getAttribute('data-campuscv-template') ||
    el.classList.contains('uploaded-template-runner') ||
    el.classList.contains('campuscv-template-root')
  );
}

function renderRepeatableSectionItems(
  sectionEl: HTMLElement,
  record: any,
  portfolioData: any
): { renderedItems: number; renderedText: string[] } {
  const dataKey = record.dataKey || record.id;
  const userItems = Array.isArray(portfolioData[dataKey]) ? portfolioData[dataKey] : [];

  // React templates handle all card rendering and mapping natively via JSX.
  // Never perform raw DOM cloning, element hiding, or appendChild on React-managed components.
  if (isElementReactManaged(sectionEl)) {
    return { renderedItems: userItems.length, renderedText: [] };
  }

  // Preserve React-rendered alternating cards and independent image bindings
  const hasExistingDynamicCards = sectionEl.querySelectorAll('[data-cv*=".items["], [data-node-id*="card:"]').length > 1;
  if (hasExistingDynamicCards) {
    return { renderedItems: userItems.length, renderedText: [] };
  }

  let prototypeEl = sectionEl.querySelector('[data-prototype-card="true"]') as HTMLElement | null;
  let listContainer: HTMLElement | null = prototypeEl ? prototypeEl.parentElement : null;

  if (!prototypeEl || !listContainer) {
    const candidateCards = Array.from(sectionEl.querySelectorAll('article, .card, [class*="card"], li')) as HTMLElement[];
    if (candidateCards.length > 0) {
      prototypeEl = candidateCards[0];
      listContainer = prototypeEl.parentElement;
      prototypeEl.setAttribute('data-prototype-card', 'true');
    }
  }

  if (!listContainer || !prototypeEl) {
    return { renderedItems: 0, renderedText: [] };
  }

  // Remove previous cloned user nodes from listContainer
  const existingClones = Array.from(listContainer.querySelectorAll('[data-user-bound-node="true"]'));
  existingClones.forEach((el) => el.remove());

  if (userItems.length === 0) {
    return { renderedItems: 0, renderedText: [] };
  }

  // Capture clean prototype BEFORE hiding prototypeEl
  const cleanPrototype = prototypeEl.cloneNode(true) as HTMLElement;
  cleanPrototype.removeAttribute('data-prototype-card');
  cleanPrototype.removeAttribute('data-demo-node');
  cleanPrototype.removeAttribute('data-user-bound-node');
  cleanPrototype.style.removeProperty('display');

  // Hide template demo cards inside listContainer
  const demoCards = Array.from(listContainer.children).filter(
    child => child !== prototypeEl && !child.hasAttribute('data-user-bound-node')
  ) as HTMLElement[];

  prototypeEl.style.setProperty('display', 'none', 'important');
  prototypeEl.setAttribute('data-demo-node', 'true');

  demoCards.forEach((c) => {
    c.style.setProperty('display', 'none', 'important');
    c.setAttribute('data-demo-node', 'true');
  });

  const renderedText: string[] = [];

  // Clone clean prototype for each user item and append to listContainer
  userItems.forEach((item: any) => {
    if (!item) return;
    const clone = cleanPrototype.cloneNode(true) as HTMLElement;
    clone.style.removeProperty('display');
    clone.style.display = '';
    clone.setAttribute('data-user-bound-node', 'true');

    bindItemFieldsToClone(clone, item, record.id);

    const titleVal = resolveFieldValue(item, 'title');
    if (titleVal) renderedText.push(titleVal);

    listContainer!.appendChild(clone);
  });

  return { renderedItems: userItems.length, renderedText };
}

function renderNonRepeatableSectionItem(
  sectionEl: HTMLElement,
  record: any,
  portfolioData: any
): void {
  // If the section is inside an uploaded React template, React itself binds the props.
  // We only bind if explicit data-cv attributes exist and do not mutate raw p/h1 tags.
  if (isElementReactManaged(sectionEl)) {
    return;
  }
  if (record.id === 'about') {
    const aboutObj = portfolioData.about || {};
    const bioText = portfolioData.summary || portfolioData.bio || aboutObj.bio || aboutObj.summary || (typeof portfolioData.about === 'string' ? portfolioData.about : '');
    if (typeof bioText === 'string' && bioText.trim().length > 0) {
      const bioEl = sectionEl.querySelector('[data-cv="about.description"], .bio, .summary') as HTMLElement | null;
      if (bioEl && !bioEl.querySelector('p')) bioEl.textContent = bioText;
    }
  } else if (record.id === 'contact') {
    const contactObj = portfolioData.contact || {};
    const email = portfolioData.email || contactObj.email;
    const phone = portfolioData.phone || contactObj.phone;
    if (email) {
      const mailLink = sectionEl.querySelector('a[href^="mailto:"]') as HTMLAnchorElement | null;
      if (mailLink) {
        mailLink.href = `mailto:${email}`;
        mailLink.textContent = email;
      }
    }
    if (phone) {
      const phoneLink = sectionEl.querySelector('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (phoneLink) {
        phoneLink.href = `tel:${phone}`;
        phoneLink.textContent = phone;
      }
    }
  }
}

/**
 * Applies content-driven section visibility rules.
 * Empty sections (projects.length === 0, experience.length === 0, etc.) are hidden in published/preview mode,
 * but remain accessible in the editor for layer management.
 */
export function applySectionVisibilityRules(rootEl: HTMLElement, portfolioData: any = {}): void {
  if (!rootEl || !portfolioData) return;

  const mode = portfolioData.renderMode || portfolioData.mode || 'published';
  const isPublishedOrPreview = mode === 'published' || mode === 'preview';
  const templateId = portfolioData.templateId || portfolioData.layoutStyle || '';

  const sections = discoverTemplateSections(rootEl, portfolioData);

  sections.forEach((record) => {
    if (!record.element) return;
    const sectionEl = record.element;

    if (record.repeatable) {
      renderRepeatableSectionItems(sectionEl, record, portfolioData);
    } else {
      renderNonRepeatableSectionItem(sectionEl, record, portfolioData);
    }

    const explicitlyHidden = portfolioData.hiddenFields?.includes(record.id) ||
      portfolioData[`${record.id}.visible`] === false ||
      portfolioData[`${record.id}Visible`] === false ||
      portfolioData.deletedNodes?.[record.id] === true;

    if (explicitlyHidden) {
      sectionEl.style.setProperty('display', 'none', 'important');
      sectionEl.setAttribute('data-section-empty', 'true');
    } else {
      sectionEl.style.removeProperty('display');
      sectionEl.removeAttribute('data-section-empty');
    }
  });
}

