"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface ViewportIframeContainerProps {
  layoutWidth: number;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  onHeightChange?: (height: number) => void;
  children: React.ReactNode;
}

export default function ViewportIframeContainer({ layoutWidth, iframeRef: externalIframeRef, onHeightChange, children }: ViewportIframeContainerProps) {
  const internalIframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeRef = externalIframeRef || internalIframeRef;
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const syncHeadStyles = (iframeDoc: Document) => {
    if (!iframeDoc || !iframeDoc.head) return;

    // 1. Remove stale copied style nodes
    const existingCopied = iframeDoc.head.querySelectorAll('[data-campuscv-frame-style="true"]');
    existingCopied.forEach(el => el.remove());

    // 2. Copy ONLY template styles, font links, and Babel runtime from parent document head into iframe head
    const headNodes = document.head.querySelectorAll('style, link[rel="stylesheet"], script[src*="babel"]');
    headNodes.forEach((node) => {
      const href = (node.getAttribute('href') || '').toLowerCase();
      const id = node.id || '';
      const isTemplateStyle = node.hasAttribute('data-template-css') ||
        node.hasAttribute('data-template-id') ||
        node.hasAttribute('data-campuscv-ignore-editor') ||
        id.startsWith('template-css-');
      const isFontLink = href.includes('fonts.googleapis.com') || href.includes('fonts.gstatic.com');
      const isBabelScript = node.tagName === 'SCRIPT' && (node.getAttribute('src') || '').includes('babel');

      if (isTemplateStyle || isFontLink || isBabelScript) {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.setAttribute('data-campuscv-frame-style', 'true');
        iframeDoc.head.appendChild(clone);
      }
    });

    // 3. Ensure iframe body resets margins without forcing 100vh or oversized height
    if (iframeDoc.body) {
      iframeDoc.body.style.margin = '0';
      iframeDoc.body.style.padding = '0';
      iframeDoc.body.style.background = 'transparent';
      iframeDoc.body.style.minHeight = 'auto';
      iframeDoc.body.style.overflow = 'visible';
      iframeDoc.body.style.position = 'relative';
      iframeDoc.documentElement.style.height = 'auto';
      iframeDoc.documentElement.style.minHeight = 'auto';
      iframeDoc.documentElement.style.overflow = 'visible';
    }
  };

  useLayoutEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    syncHeadStyles(iframeDoc);

    // Create template root container inside iframe body if not existing
    let rootContainer = iframeDoc.getElementById('campuscv-iframe-root');
    if (!rootContainer) {
      rootContainer = iframeDoc.createElement('div');
      rootContainer.id = 'campuscv-iframe-root';
      rootContainer.style.width = '100%';
      rootContainer.style.minHeight = 'auto';
      rootContainer.style.height = 'auto';
      iframeDoc.body.appendChild(rootContainer);
    }

    setMountNode(rootContainer);

    // Content-driven Auto Height Engine
    const updateContentHeight = () => {
      if (!iframe || !iframeDoc || !iframeDoc.body) return;
      const rootEl = iframeDoc.getElementById('campuscv-iframe-root') || iframeDoc.body.firstElementChild || iframeDoc.body;
      const rootRectH = (rootEl as HTMLElement).getBoundingClientRect ? Math.ceil((rootEl as HTMLElement).getBoundingClientRect().height) : 0;
      const scrollH = Math.max(iframeDoc.body.scrollHeight, iframeDoc.documentElement.scrollHeight);
      const offsetH = Math.max(iframeDoc.body.offsetHeight, iframeDoc.documentElement.offsetHeight);
      const contentHeight = Math.max(rootRectH, scrollH, offsetH, 300);

      if (iframe.style.height !== `${contentHeight}px`) {
        iframe.style.height = `${contentHeight}px`;
      }
      if (onHeightChange) {
        onHeightChange(contentHeight);
      }
    };

    updateContentHeight();

    // 1. ResizeObserver on rootContainer and body
    const resizeObserver = new ResizeObserver(() => updateContentHeight());
    if (rootContainer) resizeObserver.observe(rootContainer);
    if (iframeDoc.body) resizeObserver.observe(iframeDoc.body);

    // 2. MutationObserver for DOM structure edits
    const mutationObserver = new MutationObserver(() => updateContentHeight());
    mutationObserver.observe(iframeDoc.body || iframeDoc.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });

    // 3. Document Fonts Ready trigger
    if (iframeDoc.fonts && iframeDoc.fonts.ready) {
      iframeDoc.fonts.ready.then(() => updateContentHeight()).catch(() => {});
    }

    // 4. Image Load triggers
    const handleImgLoad = () => updateContentHeight();
    const imgs = Array.from(iframeDoc.querySelectorAll('img'));
    imgs.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', handleImgLoad, { once: true });
      }
    });

    // Global image asset error recovery inside iframe
    const handleFrameImgError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img && img.tagName === 'IMG') {
        const src = img.src || '';
        console.warn('[TEMPLATE ASSET RESOLVER] Image 404 detected inside iframe:', src);
        if (src.includes('portrait') || src.includes('avatar') || src.includes('maya') || src.includes('profile')) {
          img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
        } else {
          img.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
        }
      }
    };
    iframeDoc.addEventListener('error', handleFrameImgError, true);

    // Observe parent document.head for dynamically injected styles (e.g. Babel bundled CSS)
    const headObserver = new MutationObserver(() => {
      syncHeadStyles(iframeDoc);
      updateContentHeight();
    });

    try {
      headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
    } catch (e) {}

    return () => {
      iframeDoc.removeEventListener('error', handleFrameImgError, true);
      try { resizeObserver.disconnect(); } catch (e) {}
      try { mutationObserver.disconnect(); } catch (e) {}
      try { headObserver.disconnect(); } catch (e) {}
    };
  }, [layoutWidth]);

  return (
    <iframe
      ref={iframeRef as any}
      title="Template Viewport Stage"
      data-viewport-iframe="true"
      style={{
        width: `${layoutWidth}px`,
        height: 'auto',
        border: 'none',
        display: 'block',
        background: '#ffffff',
      }}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}
