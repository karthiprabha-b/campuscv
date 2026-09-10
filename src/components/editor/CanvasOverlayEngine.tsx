"use client";

/**
 * CanvasOverlayEngine — v2
 *
 * Invisible event-capture layer that sits over the template.
 * Responsibilities:
 *   1. Track mouse → resolve hovered element from registry → dispatch to context
 *   2. Track clicks → resolve selected element → dispatch to context
 *   3. Track double-clicks → activate inline text editing (contentEditable)
 *   4. Scan DOM after template renders (MutationObserver)
 *   5. Expose FloatingToolbar above the canvas
 *
 * What it does NOT do:
 *   - Never injects HTML into the template
 *   - Never modifies template CSS
 *   - Never adds buttons inside the template
 *
 * Visual highlights are drawn by EditorOverlay (position: fixed layer).
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useEditorContext, SelectedElement, ElementRegistration, ElementType } from '../../context/EditorContext';
import { buildElementRegistry, scanSections, detectSectionId, resolveFieldPath } from '../../utils/CanvasDOMScanner';
import { activateInlineEdit } from './InlineEditController';
import { handleImageUpload } from '../../utils/imageUploadStorage';
import FloatingToolbar from './FloatingToolbar';
import { handleUniversalDoubleClick } from '../../utils/universalDoubleClickEngine';
import { classifyDOMNode, isMeaningfulContainer, analyzeMeaningfulContainer } from '../../utils/nodeClassifierEngine';
import { discoverAndRegisterNodes, getOrRegisterNode, nodeRegistryMap } from '../../utils/nodeRegistry';
import { detectContainerContext, detectNodeSectionId, detectCollectionContext } from '../../utils/universalNodeEngine';
import { getClassName } from '../../utils/CanvasDOMScanner';
import { resolveContractFromPath } from '../../utils/semanticContractEngine';
import { resolveEditorTarget, classifyElementKind } from '../../utils/editorNodeTreeBuilder';

interface CanvasOverlayEngineProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  children?: React.ReactNode;
}

// Stable per-element ID
let _idCounter = 0;
function genElementId(el: HTMLElement): string {
  if (!(el as any).__editorId) {
    (el as any).__editorId = `ed-${++_idCounter}`;
  }
  return (el as any).__editorId;
}

export default function CanvasOverlayEngine({ canvasRef, children }: CanvasOverlayEngineProps) {
  const {
    isEditMode,
    elementRegistry,
    registerElement,
    clearRegistry,
    setSelectedElement,
    selectedNode,
    setSelectedNode,
    setHoveredElement,
    selectedElement,
    setDetectedSections,
    setInspectorMode,
    onFieldChange,
    isInlineEditing,
    setIsInlineEditing,
    setValidationReport,
    portfolioData,
  } = useEditorContext();

  const hoverRafRef = useRef<number>(0);
  const rescanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTouchScrollingRef = useRef<boolean>(false);
  const lastTouchScrollTimeRef = useRef<number>(0);

  const onCaptureClickRef = useRef<(e: MouseEvent) => void>(() => {});
  const onCaptureDblClickRef = useRef<(e: MouseEvent) => void>(() => {});
  const onTouchStartRef = useRef<(e: TouchEvent) => void>(() => {});
  const onTouchMoveRef = useRef<(e: TouchEvent) => void>(() => {});
  const onTouchEndRef = useRef<() => void>(() => {});

  // ── DOM Scanner ──────────────────────────────────────────────────────────

  const scanCanvas = useCallback(() => {
    const container = canvasRef.current;
    if (!container) return;

    const iframe = container.querySelector('iframe') as HTMLIFrameElement | null;
    const scanContainer = (iframe?.contentDocument?.body || container) as HTMLElement;

    // Discover, classify, and register nodes on universal template DOM
    discoverAndRegisterNodes(scanContainer, portfolioData?.templateId || 'template');

    const report = buildElementRegistry(scanContainer, registerElement, clearRegistry);
    if (setValidationReport) {
      setValidationReport(report);
    }
    const sections = scanSections(scanContainer);
    setDetectedSections(sections);
    console.log('[EDITOR_PIPELINE] DOM Scan complete:', {
      registeredElements: report.registeredCount,
      scannedElements: report.scannedElementsCount,
      autoBound: report.autoBoundCount,
      healthRatio: report.healthRatio,
      detectedSections: sections.length,
    });
  }, [canvasRef, registerElement, clearRegistry, setDetectedSections, setValidationReport, portfolioData?.templateId]);

  const isScannedRef = useRef(false);
  const scanCanvasRef = useRef(scanCanvas);
  scanCanvasRef.current = scanCanvas;

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    // Run initial scan once per container instance
    if (!isScannedRef.current) {
      isScannedRef.current = true;
      scanCanvasRef.current();
    }

    const iframe = container.querySelector('iframe') as HTMLIFrameElement | null;
    const targetObsContainer = iframe?.contentDocument?.body || container;

    // Re-scan on child DOM structural mutations (ignoring overlay elements)
    const observer = new MutationObserver((mutations) => {
      const isExternalMutation = mutations.some((m) => {
        const target = m.target as HTMLElement;
        if (!target || !target.closest) return true;
        return !target.closest('.editor-overlay, .canvas-overlay, [data-overlay="true"], .floating-toolbar');
      });

      if (isExternalMutation) {
        if (rescanTimerRef.current) clearTimeout(rescanTimerRef.current);
        rescanTimerRef.current = setTimeout(() => {
          scanCanvasRef.current();
        }, 1000);
      }
    });

    try {
      observer.observe(targetObsContainer, { childList: true, subtree: true });
    } catch (e) {}

    return () => {
      if (rescanTimerRef.current) clearTimeout(rescanTimerRef.current);
      try { observer.disconnect(); } catch (e) {}
    };
  }, [canvasRef]);

  // ── Registry resolver — walks up DOM from target ─────────────────────────

  const resolveRegistration = useCallback((target: EventTarget | null): ElementRegistration | null => {
    if (!target) return null;
    let el = target as HTMLElement;

    if (el.tagName === 'IMG') {
      const sectionId = detectSectionId(el);
      const fieldPath = resolveFieldPath(el, sectionId, 'IMG');
      return {
        el,
        fieldPath,
        elementType: 'image',
        sectionId,
        label: 'Image'
      };
    }

    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'SMALL', 'STRONG', 'B', 'EM', 'I', 'U', 'LI', 'LABEL'].includes(el.tagName.toUpperCase())) {
      const sectionId = detectSectionId(el);
      const fieldPath = resolveFieldPath(el, sectionId, el.tagName);
      return {
        el,
        fieldPath,
        elementType: 'text',
        sectionId,
        label: el.textContent?.trim().slice(0, 24) || el.tagName
      };
    }

    if (['A', 'BUTTON'].includes(el.tagName.toUpperCase())) {
      const sectionId = detectSectionId(el);
      const fieldPath = resolveFieldPath(el, sectionId, el.tagName);
      return {
        el,
        fieldPath,
        elementType: 'button',
        sectionId,
        label: el.textContent?.trim().slice(0, 24) || el.tagName
      };
    }

    for (let i = 0; i < 6; i++) {
      if (!el || !el.tagName || ['HTML', 'BODY'].includes(el.tagName.toUpperCase())) break;

      const reg = elementRegistry.get(el);
      if (reg) return reg;

      const tag = el.tagName.toUpperCase();
      const classified = classifyDOMNode(el);

      const hasNodeAttr = el.hasAttribute('data-campus-node-id') || el.hasAttribute('data-node-id') || el.hasAttribute('data-field') || el.hasAttribute('data-edit-key');
      const isCard = tag === 'ARTICLE' || classified.type === 'collection-item' || (tag === 'DIV' && (el.classList.contains('card') || el.hasAttribute('data-card')));
      const isSection = ['SECTION', 'HEADER', 'FOOTER', 'MAIN', 'NAV'].includes(tag);
      const isSpecificTag = /^(H[1-6]|P|SPAN|A|BUTTON|IMG|LI|STRONG|EM|SMALL|B|I)$/i.test(tag);

      const explicitId = el.getAttribute('data-node-id') || el.getAttribute('data-campus-node-id') || '';
      const isContainerNode = explicitId.startsWith('container:') || explicitId.startsWith('card:');
      const isButtonNode = explicitId.startsWith('button:') || ['A', 'BUTTON'].includes(tag);
      const isImageNode = explicitId.startsWith('image:') || tag === 'IMG';
      const isTextNode = explicitId.startsWith('text:') || /^(H[1-6]|P|SPAN|LI|STRONG|EM|SMALL|B|I|TIME|LABEL)$/i.test(tag);

      if (classified.type !== 'ignore' || isSpecificTag || hasNodeAttr || isCard || isSection || isContainerNode) {
        let elementType: ElementType = 'text';
        if (isImageNode || classified.type === 'image') elementType = 'image';
        else if (isButtonNode || classified.type === 'button' || classified.type === 'link') elementType = 'button';
        else if (isSection && tag !== 'ARTICLE') elementType = 'section';
        else if (isContainerNode || isCard) elementType = 'card';
        else if (tag === 'LI') elementType = 'list';
        else if (isTextNode) elementType = 'text';

        const sectionId = detectSectionId(el);
        const fieldPath = resolveFieldPath(el, sectionId, tag);
        const label = el.textContent?.trim().slice(0, 24) || tag;

        return {
          el,
          fieldPath,
          elementType,
          sectionId,
          label
        };
      }

      el = el.parentElement as HTMLElement;
    }
    return null;
  }, [elementRegistry]);

  const buildSel = useCallback((reg: ElementRegistration): SelectedElement => {
    let fieldPath = reg.fieldPath;
    const schemaPath = reg.schemaPath || fieldPath;

    if (reg.elementType === 'image' || reg.el.tagName === 'IMG') {
      if (!fieldPath || fieldPath.startsWith('general.') || fieldPath.includes('element')) {
        console.warn(`[BINDING_MISMATCH_WARNING] Selected image has generic fieldPath '${fieldPath}'. Re-binding to explicit schemaPath.`);
        fieldPath = reg.sectionId === 'projects' ? `projects[${reg.index || 0}].image` : (reg.sectionId === 'about' ? 'about.avatarUrl' : 'profileImage');
      }
    }

    const nodeId = reg.el.getAttribute('data-node-id') || undefined;

    return {
      id: genElementId(reg.el),
      fieldPath,
      schemaPath: schemaPath && !schemaPath.startsWith('general.') ? schemaPath : fieldPath,
      elementType: reg.elementType,
      sectionId: reg.sectionId,
      index: reg.index,
      label: reg.label,
      rect: reg.el.getBoundingClientRect(),
      el: reg.el,
      nodeId,
      currentValue: reg.el.getAttribute('src') || reg.el.textContent?.trim(),
    };
  }, []);

  // ── resolveClickTarget ───────────────────────────────────────────────────
  //
  // ONE-CLICK SELECTION ALGORITHM:
  //   Step 1 — Skip animation wrappers (TextFx .letter/.word/.char/.txt-fx)
  //   Step 2 — If current element has a data attribute → return immediately
  //   Step 3 — Walk UP the DOM (max 10 steps) to find nearest editable
  //             ancestor that is NOT a section/collection container
  //   Step 4 — Fall back to the original semantic element
  //
  // This runs as a pure function BEFORE any classification logic, ensuring
  // the capture-phase handler always receives the correct leaf element.
  // ─────────────────────────────────────────────────────────────────────────
  function resolveClickTarget(rawEl: HTMLElement): HTMLElement {
    const ANIM_CLASSES = ['word', 'letter', 'char', 'txt-fx', 'split-text', 'line'];
    const SVG_TAGS = new Set(['SVG', 'PATH', 'G', 'CIRCLE', 'RECT', 'POLYGON', 'LINE', 'USE', 'DEFS', 'SYMBOL']);

    // Step 0: SVG → nearest interactive parent
    if (SVG_TAGS.has(rawEl.tagName.toUpperCase())) {
      const interactiveParent = rawEl.closest('a, button, [role="button"], [data-node-id], [data-cv], [data-edit-key]') as HTMLElement | null;
      if (interactiveParent) return interactiveParent;
    }

    // Step 1: Skip TextFx animation wrapper spans (.letter / .word / .char / .txt-fx)
    let current: HTMLElement = rawEl;
    while (
      current.tagName === 'SPAN' &&
      current.parentElement &&
      ANIM_CLASSES.some(c => current.classList.contains(c)) &&
      !current.hasAttribute('data-cv') &&
      !current.hasAttribute('data-node-id') &&
      !current.hasAttribute('data-edit-key')
    ) {
      current = current.parentElement;
    }

    // Step 2: If current already has a data attribute at a leaf level, return it
    const hasDataAttr = (el: HTMLElement) =>
      el.hasAttribute('data-cv') ||
      el.hasAttribute('data-node-id') ||
      el.hasAttribute('data-edit-key') ||
      el.hasAttribute('data-cv-field') ||
      el.hasAttribute('data-cv-item');

    const isLeafNodeId = (el: HTMLElement) => {
      const nid = el.getAttribute('data-node-id') || '';
      return nid.startsWith('text:') || nid.startsWith('button:') || nid.startsWith('image:');
    };

    const isSectionOrCollectionContainer = (el: HTMLElement) =>
      el.hasAttribute('data-cv-section') ||
      el.hasAttribute('data-cv-collection') ||
      (el.getAttribute('data-node-id') || '').startsWith('section:') ||
      (el.getAttribute('data-node-id') || '').startsWith('container:');

    if (hasDataAttr(current) && !isSectionOrCollectionContainer(current)) {
      return current;
    }

    // Step 3: Walk UP to find nearest explicit editable ancestor (skip section/collection containers)
    let walker: HTMLElement | null = current.parentElement;
    for (let i = 0; i < 10; i++) {
      if (!walker || ['HTML', 'BODY'].includes(walker.tagName.toUpperCase())) break;

      if (hasDataAttr(walker)) {
        if (!isSectionOrCollectionContainer(walker)) {
          // Prefer leaf node IDs (text:/button:/image:) over generic ones
          if (isLeafNodeId(walker)) return walker;
          // For non-prefixed data-cv or data-edit-key or data-cv-item — return directly
          if (walker.hasAttribute('data-cv') || walker.hasAttribute('data-edit-key') || walker.hasAttribute('data-cv-field') || walker.hasAttribute('data-cv-item')) return walker;
        }
        // It's a section or collection container attribute — stop walking UP so we don't bubble to the entire section
        break;
      }

      // Stop at semantic section boundaries
      const walkerTag = walker.tagName.toUpperCase();
      if (['SECTION', 'HEADER', 'FOOTER', 'MAIN', 'NAV'].includes(walkerTag)) break;

      walker = walker.parentElement;
    }

    // Step 4: Return original element if no better match found
    return current;
  }

  // Update refs synchronously every render with freshest closures
  onTouchStartRef.current = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      isTouchScrollingRef.current = false;
    }
  };

  onTouchMoveRef.current = (e: TouchEvent) => {
    if (touchStartPosRef.current && e.touches.length > 0) {
      const dx = e.touches[0].clientX - touchStartPosRef.current.x;
      const dy = e.touches[0].clientY - touchStartPosRef.current.y;
      if (Math.hypot(dx, dy) > 8) {
        isTouchScrollingRef.current = true;
        lastTouchScrollTimeRef.current = Date.now();
      }
    }
  };

  onTouchEndRef.current = () => {
    if (isTouchScrollingRef.current) {
      lastTouchScrollTimeRef.current = Date.now();
    }
    setTimeout(() => {
      isTouchScrollingRef.current = false;
    }, 250);
  };

  const startInlineEditRef = useRef<(el: HTMLElement) => void>(() => {});
  const triggerImageReplaceRef = useRef<(el: HTMLElement) => void>(() => {});

  onCaptureDblClickRef.current = (e: MouseEvent) => {
    if (!isEditMode) return;
    let target = e.target as HTMLElement;
    if (!target) return;

    if (target.closest('.floating-toolbar') || target.closest('[data-toolbar="true"]') || target.closest('.campuscv-editor-ui') || target.closest('[data-cv-ignore="true"]')) return;

    const tag = target.tagName.toUpperCase();
    if (['SVG', 'PATH', 'G', 'CIRCLE', 'RECT', 'POLYGON', 'LINE', 'USE'].includes(tag)) {
      const parentInteractive = target.closest('a, button, [role="button"], [data-node-id], div') as HTMLElement | null;
      if (parentInteractive) target = parentInteractive;
    }

    const action = handleUniversalDoubleClick(target);

    if (action.type === 'IMAGE_CONTROLS' || target.tagName === 'IMG') {
      e.preventDefault();
      e.stopPropagation();
      triggerImageReplaceRef.current(target);
      return;
    }

    if (action.type === 'INLINE_TEXT_EDIT') {
      e.preventDefault();
      e.stopPropagation();
      startInlineEditRef.current(target);
      return;
    }
  };

  onCaptureClickRef.current = (e: MouseEvent) => {
    if (!isEditMode) return;
    const rawTarget = e.target as HTMLElement;
    if (!rawTarget) return;

    if (rawTarget.closest('.floating-toolbar') || rawTarget.closest('[data-toolbar="true"]') || rawTarget.closest('.campuscv-editor-ui') || rawTarget.closest('[data-cv-ignore="true"]')) return;

    // If inline editing is active on the exact element being clicked, allow native text selection
    if (isInlineEditing && (rawTarget.contentEditable === 'true' || rawTarget.getAttribute('contenteditable') === 'true')) {
      return;
    }

    // If inline editing was active elsewhere, cleanly deactivate it before proceeding with the new selection
    if (isInlineEditing) {
      setIsInlineEditing(false);
      const doc = rawTarget.ownerDocument || document;
      doc.querySelectorAll('[contenteditable="true"]').forEach(el => {
        (el as HTMLElement).contentEditable = 'false';
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.backgroundColor = '';
        (el as HTMLElement).blur();
      });
    }

    e.stopPropagation();
    e.preventDefault();

    // Clean legacy inline outlines
    const doc = rawTarget.ownerDocument || document;
    doc.querySelectorAll('.canvas-selected-element, [data-node-selected]').forEach(el => {
      el.classList.remove('canvas-selected-element');
      el.removeAttribute('data-node-selected');
      if ((el as HTMLElement).style?.outline) (el as HTMLElement).style.outline = '';
    });

    // ── CORE: Resolve to the correct editable target in ONE step ──────────
    // resolveClickTarget handles:
    //   - TextFx animation wrapper spans (.letter/.word/.char/.txt-fx)
    //   - SVG children → nearest interactive parent
    //   - Upward walk to nearest data-attributed editable ancestor
    const target = resolveClickTarget(rawTarget);
    const tag = target.tagName.toUpperCase();

    console.log('[CANVAS_CLICK] raw:', rawTarget.tagName, rawTarget.className?.toString?.()?.slice(0, 30), '→ resolved:', tag, target.getAttribute('data-node-id') || target.getAttribute('data-cv') || target.innerText?.slice(0, 20));

    // Classify node type from the resolved target
    const explicitId = target.getAttribute('data-node-id') || target.getAttribute('data-campus-node-id') || '';
    let nodeType: 'text' | 'image' | 'button' | 'section' | 'card' = 'text';

    if (tag === 'IMG' || explicitId.startsWith('image:')) {
      nodeType = 'image';
    } else if (['A', 'BUTTON'].includes(tag) || target.getAttribute('role') === 'button' || explicitId.startsWith('button:')) {
      nodeType = 'button';
    } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'SMALL', 'STRONG', 'B', 'EM', 'I', 'U', 'LI', 'LABEL', 'TIME'].includes(tag) || explicitId.startsWith('text:')) {
      nodeType = 'text';
    } else if (['SECTION', 'HEADER', 'FOOTER', 'MAIN', 'NAV'].includes(tag) || explicitId.startsWith('section:')) {
      nodeType = 'section';
    } else if (tag === 'ARTICLE' || explicitId.startsWith('card:') || explicitId.startsWith('container:') || getClassName(target).includes('card') || target.hasAttribute('data-card')) {
      nodeType = 'card';
    } else if (target.childElementCount === 0 && target.innerText?.trim().length > 0) {
      nodeType = 'text';
    } else if (isMeaningfulContainer(target)) {
      nodeType = 'card';
    } else {
      nodeType = 'text';
    }

    const domNode = target;
    const sectionId = detectNodeSectionId(domNode) || detectSectionId(domNode);
    const containerCtx = detectContainerContext(domNode);
    const cKey = containerCtx.containerKey || 'root';
    const cIdx = containerCtx.containerIndex !== undefined ? containerCtx.containerIndex : 0;

    const nodeId = explicitId || `${nodeType}:${sectionId}:${cKey}:${domNode.tagName.toLowerCase()}:0`;

    const colCtx = detectCollectionContext(domNode);
    const colIndex = colCtx.collectionIndex !== undefined ? colCtx.collectionIndex : cIdx;
    const colName = colCtx.collection || (
      sectionId === 'projects' ? 'projects' :
      sectionId === 'experience' ? 'experience' :
      sectionId === 'skills' ? 'skills' :
      sectionId === 'education' ? 'education' : undefined
    );
    const colItemId = colCtx.itemId || (colName ? `${colName}-${colIndex + 1}` : undefined);
    const colField = colCtx.field || (nodeType === 'image' ? 'image' : (tag === 'A' ? 'link' : undefined));

    let reg = resolveRegistration(domNode);
    if (!reg) {
      const fieldPath = resolveFieldPath(domNode, sectionId, domNode.tagName);
      reg = {
        el: domNode,
        fieldPath,
        elementType: nodeType === 'section' ? 'section' : (nodeType === 'card' ? 'card' : (nodeType === 'image' ? 'image' : (nodeType === 'button' ? 'button' : 'text'))),
        sectionId,
        label: domNode.innerText?.slice(0, 24) || domNode.tagName
      };
    }

    const sel = buildSel(reg);
    setSelectedElement(sel);

    if (setSelectedNode) {
      const style = window.getComputedStyle(domNode);
      setSelectedNode({
        nodeId,
        type: nodeType as any,
        tag: domNode.tagName.toLowerCase(),
        sectionId,
        containerKey: cKey,
        index: colIndex,
        collection: colName,
        itemId: colItemId,
        collectionIndex: colIndex,
        field: colField,
        currentValue: domNode.innerText ? domNode.innerText.trim() : '',
        currentSrc: domNode.tagName === 'IMG' ? (domNode as HTMLImageElement).src : undefined,
        currentHref: domNode.tagName === 'A' ? (domNode as HTMLAnchorElement).href : undefined,
        currentStyles: {
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontFamily: style.fontFamily,
          textAlign: style.textAlign,
          borderRadius: style.borderRadius,
        },
        el: domNode
      });
    }

    if (nodeType === 'image') setInspectorMode('image');
    else if (nodeType === 'section') setInspectorMode('section');
    else if (nodeType === 'card') setInspectorMode('card');
    else setInspectorMode('universal_node');
  };

  // Persistent event listeners on container and iframe document
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const handleTouchStartWrapper = (e: TouchEvent) => onTouchStartRef.current(e);
    const handleTouchMoveWrapper = (e: TouchEvent) => onTouchMoveRef.current(e);
    const handleTouchEndWrapper = () => onTouchEndRef.current();
    const handleCaptureClickWrapper = (e: MouseEvent) => onCaptureClickRef.current(e);
    const handleCaptureDblClickWrapper = (e: MouseEvent) => onCaptureDblClickRef.current(e);

    container.addEventListener('touchstart', handleTouchStartWrapper, { passive: true, capture: true });
    container.addEventListener('touchmove', handleTouchMoveWrapper, { passive: true, capture: true });
    container.addEventListener('touchend', handleTouchEndWrapper, { passive: true, capture: true });
    container.addEventListener('touchcancel', handleTouchEndWrapper, { passive: true, capture: true });
    container.addEventListener('click', handleCaptureClickWrapper, true);
    container.addEventListener('dblclick', handleCaptureDblClickWrapper, true);
    // Global Iframe Event Bridge Handler (called directly from inline script in iframe doc)
    (window as any).__CAMPUSCV_ON_IFRAME_EVENT__ = (e: any) => {
      if (!e) return;
      if (e.type === 'click') onCaptureClickRef.current(e);
      else if (e.type === 'dblclick') onCaptureDblClickRef.current(e);
      else if (e.type === 'touchstart') onTouchStartRef.current(e);
      else if (e.type === 'touchmove') onTouchMoveRef.current(e);
      else if (e.type === 'touchend' || e.type === 'touchcancel') onTouchEndRef.current();
    };

    let attachedDoc: Document | null = null;

    const attachIframeListeners = () => {
      const iframe = container.querySelector('iframe') as HTMLIFrameElement | null;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document || (window as any).__CAMPUSCV_IFRAME_DOC__;
      if (iframeDoc) {
        try {
          if (attachedDoc && attachedDoc !== iframeDoc) {
            attachedDoc.removeEventListener('touchstart', handleTouchStartWrapper, true);
            attachedDoc.removeEventListener('touchmove', handleTouchMoveWrapper, true);
            attachedDoc.removeEventListener('touchend', handleTouchEndWrapper, true);
            attachedDoc.removeEventListener('touchcancel', handleTouchEndWrapper, true);
            attachedDoc.removeEventListener('click', handleCaptureClickWrapper, true);
            attachedDoc.removeEventListener('dblclick', handleCaptureDblClickWrapper, true);
          }

          // Unconditionally remove then add to prevent stale listeners after doc.open()/write()
          iframeDoc.removeEventListener('touchstart', handleTouchStartWrapper, true);
          iframeDoc.removeEventListener('touchmove', handleTouchMoveWrapper, true);
          iframeDoc.removeEventListener('touchend', handleTouchEndWrapper, true);
          iframeDoc.removeEventListener('touchcancel', handleTouchEndWrapper, true);
          iframeDoc.removeEventListener('click', handleCaptureClickWrapper, true);
          iframeDoc.removeEventListener('dblclick', handleCaptureDblClickWrapper, true);

          iframeDoc.addEventListener('touchstart', handleTouchStartWrapper, { passive: true, capture: true });
          iframeDoc.addEventListener('touchmove', handleTouchMoveWrapper, { passive: true, capture: true });
          iframeDoc.addEventListener('touchend', handleTouchEndWrapper, { passive: true, capture: true });
          iframeDoc.addEventListener('touchcancel', handleTouchEndWrapper, { passive: true, capture: true });
          iframeDoc.addEventListener('click', handleCaptureClickWrapper, true);
          iframeDoc.addEventListener('dblclick', handleCaptureDblClickWrapper, true);
          attachedDoc = iframeDoc;
        } catch (err) {
          console.warn('[EDITOR_SELECTION_ENGINE] Failed to attach iframe listeners:', err);
        }
      }
    };

    attachIframeListeners();

    const handleTemplateRendered = (e: any) => {
      attachIframeListeners();
      scanCanvasRef.current();
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'CAMPUSCV_TEMPLATE_READY') {
        attachIframeListeners();
        scanCanvasRef.current();
      }
    };

    // Heartbeat watcher ensures listeners remain bound across all dynamic template DOM updates
    const watcherInterval = setInterval(() => {
      const iframe = container.querySelector('iframe') as HTMLIFrameElement | null;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document || (window as any).__CAMPUSCV_IFRAME_DOC__;
      if (iframeDoc && iframeDoc !== attachedDoc) {
        attachIframeListeners();
      }
    }, 400);

    window.addEventListener('campuscv:template-rendered', handleTemplateRendered);
    window.addEventListener('message', handleMessage);
    const iframe = container.querySelector('iframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.addEventListener('load', () => {
        attachIframeListeners();
        scanCanvasRef.current();
      });
      iframe.addEventListener('mouseenter', attachIframeListeners, true);
    }

    return () => {
      clearInterval(watcherInterval);
      delete (window as any).__CAMPUSCV_ON_IFRAME_EVENT__;
      window.removeEventListener('campuscv:template-rendered', handleTemplateRendered);
      window.removeEventListener('message', handleMessage);
      if (iframe) {
        iframe.removeEventListener('load', attachIframeListeners);
        iframe.removeEventListener('mouseenter', attachIframeListeners, true);
      }
      container.removeEventListener('touchstart', handleTouchStartWrapper, true);
      container.removeEventListener('touchmove', handleTouchMoveWrapper, true);
      container.removeEventListener('touchend', handleTouchEndWrapper, true);
      container.removeEventListener('touchcancel', handleTouchEndWrapper, true);
      container.removeEventListener('click', handleCaptureClickWrapper, true);
      container.removeEventListener('dblclick', handleCaptureDblClickWrapper, true);
      if (attachedDoc) {
        try {
          attachedDoc.removeEventListener('touchstart', handleTouchStartWrapper, true);
          attachedDoc.removeEventListener('touchmove', handleTouchMoveWrapper, true);
          attachedDoc.removeEventListener('touchend', handleTouchEndWrapper, true);
          attachedDoc.removeEventListener('touchcancel', handleTouchEndWrapper, true);
          attachedDoc.removeEventListener('click', handleCaptureClickWrapper, true);
          attachedDoc.removeEventListener('dblclick', handleCaptureDblClickWrapper, true);
        } catch {}
      }
    };
  }, [canvasRef]);

  // ── Mouse Events ─────────────────────────────────────────────────────────
  // NOTE: Selection is handled exclusively by onCaptureClickRef (native capture-phase listener).
  // The React onClick handler has been removed to eliminate the dual-handler race condition
  // that caused elements to require multiple clicks to select.

  const handleMouseMove = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
    // High-performance noop when hover overlays are disabled
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredElement(null);
  }, [setHoveredElement]);

  const startInlineEdit = useCallback((targetEl: HTMLElement) => {
    console.log('[START INLINE EDIT TARGET]', targetEl?.tagName, targetEl?.className, targetEl?.innerText?.slice(0, 20));
    if (!targetEl) return;
    const TEXT_TAGS = /^(H[1-6]|P|SPAN|A|BUTTON|LI|STRONG|EM|SMALL|B|I|DIV)$/i;
    if (!TEXT_TAGS.test(targetEl.tagName)) return;

    setIsInlineEditing(true);

    const nodeEl = targetEl.closest('[data-node-id]') as HTMLElement | null;
    const targetNodeId = targetEl.getAttribute('data-node-id') || nodeEl?.getAttribute('data-node-id');
    const editKeyEl = targetEl.closest('[data-edit-key], [data-field], [data-editable]') as HTMLElement | null;
    const editKey = editKeyEl?.getAttribute('data-edit-key') || editKeyEl?.getAttribute('data-field') || editKeyEl?.getAttribute('data-editable') || null;

    targetEl.contentEditable = "true";
    targetEl.setAttribute('suppressContentEditableWarning', 'true');
    targetEl.style.outline = '2px dashed #7C3AED';
    targetEl.style.outlineOffset = '2px';
    targetEl.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
    targetEl.focus();

    try {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(targetEl);
      range.collapse(false);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (err) {}

    const handleInput = () => {
      const newText = targetEl.innerText ? targetEl.innerText.trim() : '';
      if (targetNodeId && selectedNode && setSelectedNode) {
        setSelectedNode({ ...selectedNode, currentValue: newText });
      }
    };

    const handleKeyDown = (ke: KeyboardEvent) => {
      if (ke.key === 'Escape') {
        ke.preventDefault();
        targetEl.blur();
      } else if (ke.key === 'Enter' && !['P', 'TEXTAREA'].includes(targetEl.tagName)) {
        ke.preventDefault();
        targetEl.blur();
      }
    };

    const handleBlur = () => {
      targetEl.contentEditable = "false";
      targetEl.style.outline = '';
      targetEl.style.backgroundColor = '';
      targetEl.removeEventListener('input', handleInput);
      targetEl.removeEventListener('blur', handleBlur);
      targetEl.removeEventListener('keydown', handleKeyDown);
      setIsInlineEditing(false);

      const finalVal = targetEl.innerText ? targetEl.innerText.trim() : '';
      if (targetNodeId && onFieldChange) {
        // Atomic write — single state mutation, single undo entry
        onFieldChange(`contentOverrides.${targetNodeId}`, { type: 'text', value: finalVal });
      } else if (editKey && onFieldChange) {
        onFieldChange(editKey, finalVal);
      }
    };

    targetEl.addEventListener('input', handleInput);
    targetEl.addEventListener('blur', handleBlur);
    targetEl.addEventListener('keydown', handleKeyDown);
  }, [setIsInlineEditing, selectedNode, setSelectedNode, onFieldChange]);

  startInlineEditRef.current = startInlineEdit;

  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode) return;
    const target = e.target as HTMLElement;
    if (!target) return;

    const action = handleUniversalDoubleClick(target);

    if (action.type === 'IMAGE_CONTROLS') {
      e.preventDefault();
      e.stopPropagation();
      triggerImageReplace(target);
      return;
    }

    if (action.type === 'SELECT_ONLY' || !action.isContentEditable) {
      // Container/card/grid/section -> READ-ONLY selection, ZERO DOM mutation!
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    startInlineEdit(target);
  }, [isEditMode, triggerImageReplace, startInlineEdit]);

  // ── Image replace ────────────────────────────────────────────────────────

  function triggerImageReplace(imgEl: HTMLElement) {
    console.log('[TRIGGER IMAGE REPLACE CALLED]', imgEl?.tagName, (imgEl as any)?.src);
    triggerImageReplaceRef.current = triggerImageReplace;
    const nodeEl = imgEl?.closest('[data-node-id]') as HTMLElement | null;
    const nodeId = imgEl.getAttribute('data-node-id') || nodeEl?.getAttribute('data-node-id');
    
    let editKey = 'profile.photo';
    const cvAttr = imgEl.getAttribute('data-cv') || imgEl.closest('[data-cv]')?.getAttribute('data-cv');
    const editKeyEl = imgEl.closest('[data-edit-key], [data-field]') as HTMLElement | null;
    
    if (cvAttr) {
      if (cvAttr.includes('[]')) {
        const parentItem = imgEl.closest('[data-cv*="["]') as HTMLElement | null;
        const parentCv = parentItem?.getAttribute('data-cv') || '';
        const match = parentCv.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]/) || parentCv.match(/([a-zA-Z0-9_]+)\[(\d+)\]/);
        if (match) {
          const [, col, idx] = match;
          const sub = cvAttr.split('[]')[1]?.replace(/^\./, '') || 'image';
          editKey = `${col}.${idx}.${sub}`;
        } else {
          editKey = cvAttr;
        }
      } else {
        const directMatch = cvAttr.match(/([a-zA-Z0-9_]+)\.items\[(\d+)\]\.(.+)/) || cvAttr.match(/([a-zA-Z0-9_]+)\[(\d+)\]\.(.+)/);
        if (directMatch) {
          editKey = `${directMatch[1]}.${directMatch[2]}.${directMatch[3]}`;
        } else {
          editKey = cvAttr;
        }
      }
    } else if (editKeyEl) {
      editKey = editKeyEl.getAttribute('data-edit-key') || editKeyEl.getAttribute('data-field') || 'profile.photo';
    } else if (imgEl.closest('#hero, [data-cv-section="hero"]')) {
      editKey = 'hero.avatarUrl';
    } else if (imgEl.closest('#about, [data-cv-section="about"]')) {
      editKey = 'about.avatarUrl';
    }

    // Remove any existing upload input
    document.getElementById('active-image-upload-input')?.remove();

    const input = document.createElement('input');
    input.id = 'active-image-upload-input';
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';
    input.style.position = 'fixed';
    input.style.top = '-9999px';
    input.style.left = '-9999px';
    input.style.opacity = '0';
    document.body.appendChild(input);

    input.onchange = (ev: any) => {
      const file = ev.target.files?.[0];
      if (!file) return;

      handleImageUpload(
        file,
        (blobUrl) => {
          if (imgEl && imgEl instanceof HTMLImageElement) {
            imgEl.src = blobUrl;
          }
        },
        (finalUrl) => {
          if (finalUrl && onFieldChange) {
            if (imgEl && imgEl instanceof HTMLImageElement) {
              imgEl.src = finalUrl;
            }
            if (nodeId) {
              console.log(`[CANVAS IMAGE REPLACE PERMANENT] nodeId: ${nodeId} | url: ${finalUrl}`);
              onFieldChange(`contentOverrides.${nodeId}`, { type: 'image', src: finalUrl });
              onFieldChange(`imageOverrides.${nodeId}`, finalUrl);
            }
            if (editKey) {
              onFieldChange(editKey, finalUrl);
            }
            const isAvatar = !nodeId || nodeId.includes('avatar') || nodeId.includes('profile') || nodeId.includes('portrait') || nodeId.includes('hero') || nodeId.includes('about') || (editKey && (editKey.includes('avatar') || editKey.includes('profile') || editKey.includes('photo')));
            if (isAvatar) {
              onFieldChange('profileImage', finalUrl);
              onFieldChange('avatarUrl', finalUrl);
              onFieldChange('about.avatarUrl', finalUrl);
            }
          }
        }
      );
    };

    input.click();
  }

  return (
    <div
      className="relative w-full min-h-full flex-grow"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      {/* Layer 1 — the template, completely untouched */}
      {children}

      {/* Layer 2 — Floating Toolbar (renders above template via z-index) */}
      {isEditMode && !isInlineEditing && selectedElement && (
        <FloatingToolbar
          selectedElement={selectedElement}
          onTriggerImageReplace={(el) => triggerImageReplace(el ?? selectedElement.el!)}
          onStartInlineEdit={(el) => startInlineEdit(el ?? selectedElement.el!)}
        />
      )}
    </div>
  );
}
