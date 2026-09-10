/**
 * templateScrollProxy.ts — Scroll & IntersectionObserver Viewport Normalizer
 *
 * Architecture:
 * 1. Binds parent scroll container movement (window or editor stage) to template window scope.
 * 2. Dispatches synthetic scroll and resize events into the template frame for 60fps animation routines.
 * 3. Patches IntersectionObserver in the template window so root: null checks evaluate against
 *    the visible screen viewport rather than the full auto-height iframe canvas height.
 */

export function attachTemplateScrollProxy(
  targetDoc: Document,
  rootElement: HTMLElement
): () => void {
  if (!targetDoc || !rootElement) return () => {};

  const win = targetDoc.defaultView || window;
  const isNested = win.self !== win.top;
  let isRunning = true;
  let rafId: number | null = null;
  const observersSet = new Set<() => void>();

  // Helper to get frame element or iframe position
  const getFrameEl = (): HTMLIFrameElement | null => {
    try {
      return (win.frameElement as HTMLIFrameElement | null) ||
        (isNested && window.parent?.document ? (window.parent.document.querySelector('iframe') as HTMLIFrameElement | null) : null) ||
        (document.querySelector('iframe') as HTMLIFrameElement | null);
    } catch (_) {
      return null;
    }
  };

  // ── 1. INTERSECTION OBSERVER VIEWPORT PROXY ────────────────────────────────
  // In auto-height iframes, root: null targets the 3500px iframe document.
  // We override IntersectionObserver in template scope to check visible screen bounds.
  try {
    const OriginalIntersectionObserver = win.IntersectionObserver || (window as any).IntersectionObserver;

    if (OriginalIntersectionObserver) {
      const ProxiedIntersectionObserver = function (this: any, callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        const instanceOpts = options || {};
        const isDefaultRoot = !instanceOpts.root;

        // Custom observer wrapper tracking targets
        const targetElements = new Set<Element>();

        const handleCheck = () => {
          if (!isRunning) return;
          const frameEl = getFrameEl();
          const frameRect = frameEl ? frameEl.getBoundingClientRect() : rootElement.getBoundingClientRect();
          const viewportHeight = (isNested && typeof window !== 'undefined' ? (window.parent?.innerHeight || window.innerHeight) : win.innerHeight) || 800;
          const viewportWidth = (isNested && typeof window !== 'undefined' ? (window.parent?.innerWidth || window.innerWidth) : win.innerWidth) || 1200;

          const entries: IntersectionObserverEntry[] = [];

          targetElements.forEach((el) => {
            if (!el.isConnected) return;
            const elRect = el.getBoundingClientRect();

            // In auto-height nested iframes, map element position to screen viewport
            const screenTop = isNested ? (frameRect.top + elRect.top) : elRect.top;
            const screenBottom = screenTop + elRect.height;
            // Generous margin for smooth entrance
            const isIntersecting = screenBottom >= -100 && screenTop <= (viewportHeight + 100);

            const entry: any = {
              target: el,
              isIntersecting,
              intersectionRatio: isIntersecting ? 1.0 : 0.0,
              boundingClientRect: elRect,
              intersectionRect: isIntersecting ? elRect : { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 },
              rootBounds: { top: 0, bottom: viewportHeight, left: 0, right: viewportWidth, width: viewportWidth, height: viewportHeight },
              time: performance.now()
            };

            entries.push(entry);
          });

          if (entries.length > 0) {
            try {
              callback(entries, this);
            } catch (e) {
              console.error('[SCROLL PROXY] Error in IntersectionObserver callback:', e);
            }
          }
        };

        const internalObserver = new OriginalIntersectionObserver((entries, obs) => {
          if (isDefaultRoot && isNested) {
            handleCheck();
          } else {
            callback(entries, obs);
          }
        }, instanceOpts);

        this.observe = (el: Element) => {
          targetElements.add(el);
          internalObserver.observe(el);
          // Immediate check for newly observed element
          requestAnimationFrame(handleCheck);
        };

        this.unobserve = (el: Element) => {
          targetElements.delete(el);
          internalObserver.unobserve(el);
        };

        this.disconnect = () => {
          targetElements.clear();
          internalObserver.disconnect();
          observersSet.delete(handleCheck);
        };

        this.takeRecords = () => internalObserver.takeRecords();

        if (isDefaultRoot) {
          observersSet.add(handleCheck);
        }
      };

      ProxiedIntersectionObserver.prototype = OriginalIntersectionObserver.prototype;
      (win as any).IntersectionObserver = ProxiedIntersectionObserver;
    }
  } catch (e) {
    console.warn('[SCROLL PROXY] IntersectionObserver proxy initialization notice:', e);
  }

  // ── 2. SYNTHETIC SCROLL & RESIZE DISPATCHER ──────────────────────────────
  let lastScrollMetric = '';

  const getScrollMetric = () => {
    try {
      const frameEl = getFrameEl();
      if (frameEl) {
        const r = frameEl.getBoundingClientRect();
        return `${r.top.toFixed(1)}_${r.left.toFixed(1)}`;
      }
    } catch (_) {}
    const sy = (isNested ? window.scrollY : win.scrollY) || document.documentElement.scrollTop || 0;
    return `${sy}`;
  };

  let scrollScheduled = false;

  const dispatchSyntheticEvents = () => {
    if (!isRunning) return;
    scrollScheduled = false;

    // Sleep when the tab is hidden
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }

    try {
      const currentScrollMetric = getScrollMetric();
      if (currentScrollMetric !== lastScrollMetric) {
        lastScrollMetric = currentScrollMetric;

        // Dispatch scroll event on template window & document
        const scrollEvent = new Event('scroll', { bubbles: true, cancelable: true });
        win.dispatchEvent(scrollEvent);
        targetDoc.dispatchEvent(scrollEvent);

        // Notify active proxy observers
        observersSet.forEach((fn) => {
          try { fn(); } catch (e) {}
        });
      }
    } catch (e) {}
  };

  const scheduleSyntheticScroll = () => {
    if (!isRunning || scrollScheduled) return;
    scrollScheduled = true;
    rafId = requestAnimationFrame(dispatchSyntheticEvents);
  };

  const handleParentScroll = () => {
    scheduleSyntheticScroll();
  };

  // Immediate progressive reveal checks
  const t0 = setTimeout(handleParentScroll, 50);
  const t1 = setTimeout(handleParentScroll, 150);
  const t2 = setTimeout(handleParentScroll, 350);
  const t3 = setTimeout(handleParentScroll, 700);

  // Discover all potential scroll containers (window, document, canvas stages)
  const attachedContainers: HTMLElement[] = [];
  try {
    const parentDoc = isNested ? (window.parent?.document || window.document) : document;
    const stageEl = parentDoc.querySelector('[data-tour="canvas-stage"]') as HTMLElement | null;
    if (stageEl) {
      stageEl.addEventListener('scroll', handleParentScroll, { passive: true });
      attachedContainers.push(stageEl);
    }

    const frameEl = getFrameEl();
    if (frameEl) {
      let curr: HTMLElement | null = frameEl.parentElement;
      while (curr && curr !== parentDoc.body && curr !== parentDoc.documentElement) {
        const style = (win.parent || window).getComputedStyle(curr);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflow === 'auto' || style.overflow === 'scroll') {
          if (!attachedContainers.includes(curr)) {
            curr.addEventListener('scroll', handleParentScroll, { passive: true });
            attachedContainers.push(curr);
          }
        }
        curr = curr.parentElement;
      }
    }
  } catch (_) {}

  window.addEventListener('scroll', handleParentScroll, { passive: true, capture: true });
  window.addEventListener('wheel', handleParentScroll, { passive: true });
  window.addEventListener('touchmove', handleParentScroll, { passive: true });
  window.addEventListener('resize', handleParentScroll, { passive: true });
  document.addEventListener('scroll', handleParentScroll, { passive: true, capture: true });
  targetDoc.defaultView?.addEventListener('scroll', handleParentScroll, { passive: true });
  targetDoc.addEventListener('scroll', handleParentScroll, { passive: true, capture: true });

  return () => {
    isRunning = false;
    clearTimeout(t0);
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('scroll', handleParentScroll, true);
    window.removeEventListener('wheel', handleParentScroll);
    window.removeEventListener('touchmove', handleParentScroll);
    window.removeEventListener('resize', handleParentScroll);
    document.removeEventListener('scroll', handleParentScroll, true);
    targetDoc.defaultView?.removeEventListener('scroll', handleParentScroll);
    targetDoc.removeEventListener('scroll', handleParentScroll, true);
    attachedContainers.forEach((el) => {
      try { el.removeEventListener('scroll', handleParentScroll); } catch (_) {}
    });
    observersSet.clear();
  };
}
