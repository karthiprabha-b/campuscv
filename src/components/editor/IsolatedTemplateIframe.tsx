"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import UploadedTemplateRunner, { UploadedTemplateRunnerProps } from '../../templates/UploadedTemplateRunner';
import { templateDebugger } from '../../utils/templateDebugger';

import { templateStorage } from '../../utils/templateStorage';
import { adminTemplateDb } from '../../utils/adminTemplateDb';
import { discoverTemplateCSS } from '../../utils/UniversalCSSDiscovery';

export interface IsolatedTemplateIframeProps extends UploadedTemplateRunnerProps {
  className?: string;
  style?: React.CSSProperties;
  viewportWidth?: number; // Explicit logical px width for iframe viewport meta (controls which CSS breakpoints fire)
}

const GOOGLE_FONT_MAP: Record<string, string> = {
  'jetbrains mono': 'JetBrains+Mono:ital,wght@0,300..800;1,300..800',
  'fira code': 'Fira+Code:wght@300..700',
  'inter': 'Inter:ital,wght@0,300..900;1,300..900',
  'plus jakarta sans': 'Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800',
  'outfit': 'Outfit:wght@300..900',
  'playfair display': 'Playfair+Display:ital,wght@0,400..900;1,400..900',
  'space grotesk': 'Space+Grotesk:wght@300..700',
  'space mono': 'Space+Mono:ital,wght@0,400;0,700;1,400;1,700',
  'bricolage grotesque': 'Bricolage+Grotesque:opsz,wght@12..96,200..800',
  'manrope': 'Manrope:wght@300..800',
  'poppins': 'Poppins:ital,wght@0,300..900;1,300..900',
  'dm sans': 'DM+Sans:ital,opsz,wght@0,9..40,300..900;1,9..40,300..900',
  'sora': 'Sora:wght@300..800',
  'syne': 'Syne:wght@400..800',
  'roboto': 'Roboto:ital,wght@0,300..900;1,300..900',
  'montserrat': 'Montserrat:ital,wght@0,300..900;1,300..900',
  'lora': 'Lora:ital,wght@0,400..700;1,400..700',
  'merriweather': 'Merriweather:ital,wght@0,300..900;1,300..900',
  'caveat': 'Caveat:wght@400..700',
  'cinzel': 'Cinzel:wght@400..900',
  'epilogue': 'Epilogue:ital,wght@0,300..900;1,300..900',
  'geist': 'Geist:wght@300..800',
  'geist mono': 'Geist+Mono:wght@300..800',
  'cabinet grotesk': 'Cabinet+Grotesk:wght@400..900',
  'clash display': 'Clash+Display:wght@400..700',
  'instrument sans': 'Instrument+Sans:ital,wght@0,400..700;1,400..700',
  'instrument serif': 'Instrument+Serif:ital@0;1',
  'work sans': 'Work+Sans:ital,wght@0,300..900;1,300..900',
  'unbounded': 'Unbounded:wght@300..900',
  'figtree': 'Figtree:ital,wght@0,300..900;1,300..900',
  'raleway': 'Raleway:ital,wght@0,300..900;1,300..900'
};

const fontLinksCache = new Map<string, string[]>();

function extractTemplateFontLinks(files?: Record<string, string>, data?: any): string[] {
  const userFont = String(data?.userSelectedFont || data?.typography?.fontFamily || '').toLowerCase();
  const fileKeys = files ? Object.keys(files) : [];
  const cacheKey = `${userFont}::${fileKeys.length}::${fileKeys.slice(0, 5).join(',')}`;
  
  if (fontLinksCache.has(cacheKey)) {
    return fontLinksCache.get(cacheKey)!;
  }

  const foundLinks: Set<string> = new Set();
  const fontFamiliesToLoad: Set<string> = new Set(['inter']);

  if (userFont) {
    Object.keys(GOOGLE_FONT_MAP).forEach(fontKey => {
      if (userFont.includes(fontKey)) {
        fontFamiliesToLoad.add(fontKey);
      }
    });
  }

  if (files && fileKeys.length > 0) {
    // Only scan CSS files or HTML files for font links, not all 98 code files
    Object.entries(files).forEach(([path, content]) => {
      if (!content || (!path.endsWith('.css') && !path.endsWith('.html') && !path.endsWith('index.html'))) return;

      // 1. Extract HTML link tags to external stylesheets/fonts
      const linkMatches = content.matchAll(/<link\s+[^>]*href=["']([^"']+)["'][^>]*>/gi);
      for (const m of linkMatches) {
        const href = m[1];
        if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))) {
          foundLinks.add(href);
        }
      }

      // 2. Extract @import url(...)
      const importMatches = content.matchAll(/@import\s+(?:url\(['"]?([^'")]+)['"]?\)|['"]([^'"]+)['"])\s*;?/gi);
      for (const m of importMatches) {
        const imp = (m[1] || m[2] || '').trim();
        if (imp && (imp.startsWith('http://') || imp.startsWith('https://') || imp.startsWith('//'))) {
          foundLinks.add(imp);
        }
      }

      // 3. Scan for font-family in CSS
      Object.keys(GOOGLE_FONT_MAP).forEach(fontKey => {
        const regex = new RegExp(`['"]?${fontKey}['"]?`, 'i');
        if (regex.test(content)) {
          fontFamiliesToLoad.add(fontKey);
        }
      });
    });
  }

  // Construct Google Fonts URLs for detected families
  const googleFamilies: string[] = [];
  fontFamiliesToLoad.forEach(f => {
    if (GOOGLE_FONT_MAP[f]) {
      googleFamilies.push(`family=${GOOGLE_FONT_MAP[f]}`);
    }
  });

  if (googleFamilies.length > 0) {
    foundLinks.add(`https://fonts.googleapis.com/css2?${googleFamilies.join('&')}&display=swap`);
  }

  const result = Array.from(foundLinks);
  fontLinksCache.set(cacheKey, result);
  return result;
}

function extractTemplateTailwindConfig(files?: Record<string, string>): any {
  if (!files) return null;
  const configKey = Object.keys(files).find(k => 
    /tailwind\.config\.(js|ts|mjs|cjs|json)$/i.test(k) && !k.includes('node_modules') && !k.includes('.next')
  );
  if (!configKey || !files[configKey]) return null;

  const raw = files[configKey];
  try {
    if (configKey.endsWith('.json')) {
      return JSON.parse(raw);
    }
    const cleaned = raw
      .replace(/\/\*\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/module\.exports\s*=\s*/g, '')
      .trim()
      .replace(/;$/, '');
    const fn = new Function('return (' + cleaned + ')');
    return fn();
  } catch (e) {
    console.warn('[IsolatedTemplateIframe] Failed to parse template tailwind.config:', e);
    return null;
  }
}

export default function IsolatedTemplateIframe(props: IsolatedTemplateIframeProps) {
  const { className, style, viewportWidth, ...runnerProps } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(1400);
  const isPublished = runnerProps.renderMode === 'published';

  // Logical pixel width written into the iframe viewport meta tag.
  const deviceViewport = runnerProps.viewport || 'desktop';
  const logicalViewportWidth = viewportWidth ||
    (deviceViewport === 'mobile' ? 390 :
     deviceViewport === 'tablet' ? 768 :
     1440);
  const viewportMetaTag = isPublished || deviceViewport === 'desktop'
    ? '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    : `<meta name="viewport" content="width=${logicalViewportWidth}, initial-scale=1.0">`;

  const initIframe = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const templateId = runnerProps.templateId || runnerProps.data?.templateId || runnerProps.data?.layoutStyle;
    const sectionFiles: Record<string, string> =
      (runnerProps as any).sectionFiles ||
      (runnerProps as any).files ||
      runnerProps.data?.sectionFiles ||
      (templateId ? templateStorage.getTemplateSync(templateId)?.sectionFiles : null) ||
      (templateId ? adminTemplateDb.getTemplateById(templateId)?.sectionFiles : null) ||
      {};

    // Avoid redundant doc.write if already initialized
    if (doc.getElementById('iframe-root')) {
      const rootEl = doc.getElementById('iframe-root');
      if (rootEl && rootEl !== iframeBody) {
        (window as any).__CAMPUSCV_IFRAME_DOC__ = doc;
        setIframeBody(rootEl);
      }
      const bundledTag = doc.getElementById('template-bundled-css') as HTMLStyleElement | null;
      if (bundledTag && (!bundledTag.textContent || bundledTag.textContent.trim() === '/* Isolated Template Bundled CSS */')) {
        const discoveredCSS = discoverTemplateCSS(sectionFiles, 'tpl', undefined, templateId || 'uploaded');
        if (discoveredCSS.combinedCSS) {
          bundledTag.textContent = discoveredCSS.combinedCSS;
        }
      }
      return;
    }

    const templateTailwind = extractTemplateTailwindConfig(sectionFiles);
    const customTheme = templateTailwind?.theme || {};
    const customThemeExtend = templateTailwind?.theme?.extend || {};

    const customSans = customThemeExtend?.fontFamily?.sans || customTheme?.fontFamily?.sans;
    const customHeading = customThemeExtend?.fontFamily?.heading || customTheme?.fontFamily?.heading;
    const sansFontCSS = customSans ? (Array.isArray(customSans) ? customSans.join(', ') : customSans) : '';
    const headingFontCSS = customHeading ? (Array.isArray(customHeading) ? customHeading.join(', ') : customHeading) : '';

    const fontLinks = extractTemplateFontLinks(sectionFiles, runnerProps.data);
    const discoveredCSS = discoverTemplateCSS(sectionFiles, 'tpl', undefined, templateId || 'uploaded');

    const initialThemeColor =
      (runnerProps.data as any)?.theme?.primaryColor ||
      (runnerProps.data as any)?.themeColor ||
      (runnerProps.data as any)?.accentColor ||
      (runnerProps.data as any)?.userSelectedAccent ||
      '#7C3AED';

    const tailwindConfigJson = JSON.stringify({
      darkMode: 'class',
      corePlugins: {
        preflight: false,
        container: false
      },
      theme: {
        ...customTheme,
        extend: {
          ...(customThemeExtend || {}),
          colors: {
            primary: 'var(--campuscv-primary-color, #7C3AED)',
            ...(customTheme?.colors || {}),
            ...(customThemeExtend?.colors || {})
          },
          fontFamily: {
            ...(customSans ? { sans: customSans } : {}),
            ...(customHeading ? { heading: customHeading } : {}),
            ...(customThemeExtend?.fontFamily || customTheme?.fontFamily || {})
          },
          borderRadius: {
            '2xl': '1rem',
            '3xl': '1.5rem',
            '4xl': '2rem',
            ...(customThemeExtend?.borderRadius || customTheme?.borderRadius || {})
          }
        }
      }
    });

    try {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            ${viewportMetaTag}
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            ${fontLinks.map(url => `<link href="${url}" rel="stylesheet">`).join('\n            ')}
            <script>
              window.tailwind = window.tailwind || {};
              window.tailwind.config = ${tailwindConfigJson};
              (function() {
                ['click', 'dblclick', 'touchstart', 'touchend', 'touchmove'].forEach(function(eventType) {
                  document.addEventListener(eventType, function(event) {
                    try {
                      if (window.parent && typeof window.parent.__CAMPUSCV_ON_IFRAME_EVENT__ === 'function') {
                        window.parent.__CAMPUSCV_ON_IFRAME_EVENT__(event);
                      }
                    } catch(e) {}
                  }, true);
                });

                // Global broken image fallback interceptor
                document.addEventListener('error', function(e) {
                  if (e.target && e.target.tagName === 'IMG') {
                    var img = e.target;
                    if (!img.dataset.hasFallback) {
                      img.dataset.hasFallback = 'true';
                      var isAvatar = img.getAttribute('data-node-type') === 'image' ||
                                     img.getAttribute('data-cv-image') ||
                                     (img.className && img.className.indexOf('avatar') !== -1) ||
                                     (img.alt && (img.alt.indexOf('Avatar') !== -1 || img.alt.indexOf('Profile') !== -1)) ||
                                     img.getAttribute('data-cv') === 'profile.photo' ||
                                     img.getAttribute('data-cv') === 'basics.photo';
                      if (isAvatar) {
                        img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                      } else {
                        img.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                      }
                    }
                  }
                }, true);
              })();
            </script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              :root, html, body, #iframe-root {
                --campuscv-primary-color: ${initialThemeColor};
                --primary: ${initialThemeColor};
                --theme-color: ${initialThemeColor};
                --accent-color: ${initialThemeColor};
              }
              .bg-primary { background-color: var(--campuscv-primary-color) !important; }
              .text-primary { color: var(--campuscv-primary-color) !important; }
              .border-primary { border-color: var(--campuscv-primary-color) !important; }
              .accent-primary { accent-color: var(--campuscv-primary-color) !important; }
              html {
                font-size: 16px;
                -webkit-text-size-adjust: 100%;
                height: ${isPublished ? '100%' : 'auto'};
                min-height: 100%;
                overflow-y: ${isPublished ? 'auto' : 'visible'};
                overflow-x: hidden;
                ${isPublished ? 'scroll-behavior: smooth;' : ''}
              }
              html, body, #iframe-root, #template-root, .uploaded-template-runner {
                margin: 0;
                padding: 0;
                width: 100%;
                ${sansFontCSS ? `font-family: var(--campuscv-font-family, ${sansFontCSS});` : ''}
              }
              ${headingFontCSS ? `.font-heading { font-family: var(--campuscv-font-heading, ${headingFontCSS}); }` : ''}
              body {
                height: auto;
                min-height: 100%;
                background: transparent;
                overflow: visible;
              }
              #iframe-root {
                height: auto;
                min-height: 100%;
                overflow: visible;
              }
              #template-root, .uploaded-template-runner {
                min-height: 100%;
                height: auto;
                overflow: visible;
              }
              /* Prevent min-h-screen from collapsing inside auto-height iframes */
              .min-h-screen {
                min-height: ${isPublished ? '100vh' : 'auto'};
              }
            </style>
            <style id="campuscv-theme-style">
              :root, html, body, #iframe-root {
                --campuscv-primary-color: ${initialThemeColor};
                --primary: ${initialThemeColor};
                --theme-color: ${initialThemeColor};
                --accent-color: ${initialThemeColor};
              }
              .bg-primary { background-color: var(--campuscv-primary-color) !important; }
              .text-primary { color: var(--campuscv-primary-color) !important; }
              .border-primary { border-color: var(--campuscv-primary-color) !important; }
              .accent-primary { accent-color: var(--campuscv-primary-color) !important; }
            </style>
            <style id="template-bundled-css">
              /* Isolated Template Bundled CSS */
              ${discoveredCSS.combinedCSS}
            </style>
          </head>
          <body>
            <div id="iframe-root" style="width:100%; height:${isPublished ? '100%' : 'auto'}; min-height:${isPublished ? '100%' : '100vh'};"></div>
          </body>
        </html>
      `);
      doc.close();

      const rootEl = doc.getElementById('iframe-root');
      if (rootEl) {
        (window as any).__CAMPUSCV_IFRAME_DOC__ = doc;

        if (!isPublished) {
          let heightUpdateRaf: number | null = null;
          const updateHeight = () => {
            if (heightUpdateRaf) return;
            heightUpdateRaf = requestAnimationFrame(() => {
              heightUpdateRaf = null;
              if (!iframe) return;
              const currentDoc = iframe.contentDocument || iframe.contentWindow?.document || doc;
              if (!currentDoc || !currentDoc.body) return;

              const rootElem = currentDoc.getElementById('iframe-root') || currentDoc.body.firstElementChild || currentDoc.body;
              
              // High performance scroll and root height calculation
              const rootScrollH = (rootElem as HTMLElement).scrollHeight || 0;
              const rootOffsetH = (rootElem as HTMLElement).offsetHeight || 0;
              const bodyScrollH = currentDoc.body.scrollHeight || 0;
              const docScrollH = currentDoc.documentElement.scrollHeight || 0;
              
              const computedH = Math.max(rootScrollH, rootOffsetH, bodyScrollH, docScrollH, 1200);

              if (computedH > 0 && iframe) {
                const targetH = `${computedH}px`;
                if (iframe.style.height !== targetH) {
                  iframe.style.height = targetH;
                }
              }
            });
          };

          // Use the iframe window's own ResizeObserver & MutationObserver to cross iframe boundary
          const iframeWin = doc.defaultView || iframe.contentWindow || window;
          const RO = (iframeWin as any).ResizeObserver || window.ResizeObserver;
          const MO = (iframeWin as any).MutationObserver || window.MutationObserver;

          if (RO) {
            try {
              const resizeObserver = new RO(() => updateHeight());
              resizeObserver.observe(rootEl);
              resizeObserver.observe(doc.body);
            } catch (e) {}
          }

          if (MO) {
            try {
              const mutationObserver = new MO((mutations: MutationRecord[]) => {
                const isOnlyStyleOnIframe = mutations.every((m: MutationRecord) => m.target === iframe || (m.target === doc.body && m.attributeName === 'style'));
                if (!isOnlyStyleOnIframe) {
                  updateHeight();
                }
              });
              mutationObserver.observe(doc.body, { childList: true, subtree: true, attributes: false });
            } catch (e) {}
          }

          updateHeight();

          doc.addEventListener('load', updateHeight, true);
          iframeWin.addEventListener('resize', updateHeight);
          window.addEventListener('resize', updateHeight);
          window.addEventListener('campuscv:template-rendered', updateHeight);

          // Find the active scroll container once (cached for high performance)
          const getScrollContainer = () => {
            return (
              document.querySelector('[data-tour="canvas-stage"]') ||
              document.getElementById('viewport-stage-scroll-container') ||
              document.getElementById('admin-preview-main') ||
              document.querySelector('main.overflow-y-auto') ||
              document.documentElement ||
              document.body
            ) as HTMLElement;
          };

          // Forward wheel events from inside iframe to parent scroll containers ONLY when target is not inside an internal scrollable container
          let wheelRaf: number | null = null;
          let deltaYBuffer = 0;
          let deltaXBuffer = 0;

          const handleIframeWheel = (e: WheelEvent) => {
            if (isPublished) return;

            // Check if the wheel event occurred inside an internal scrollable element (e.g. .card-snap-container, modal, code viewer)
            let curr = e.target as HTMLElement | null;
            while (curr && curr !== doc.body && curr !== doc.documentElement) {
              const style = iframeWin.getComputedStyle(curr);
              const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll' || curr.classList.contains('card-snap-container')) && curr.scrollHeight > curr.clientHeight;
              if (isScrollable) {
                // Allow internal scroll container to handle scrolling naturally
                return;
              }
              curr = curr.parentElement;
            }

            deltaYBuffer += e.deltaY;
            deltaXBuffer += e.deltaX;

            if (!wheelRaf) {
              wheelRaf = requestAnimationFrame(() => {
                wheelRaf = null;
                const container = getScrollContainer();
                if (container) {
                  container.scrollBy({ top: deltaYBuffer, left: deltaXBuffer, behavior: 'auto' });
                }
                deltaYBuffer = 0;
                deltaXBuffer = 0;
              });
            }
          };

          iframeWin.addEventListener('wheel', handleIframeWheel as any, { passive: true });

          if (doc.fonts && doc.fonts.ready) {
            doc.fonts.ready.then(updateHeight).catch(() => {});
          }
        }

        // Forward touch scrolling for mobile/tablet previews
        let touchStartY = 0;
        let touchStartX = 0;
        let isInternalTouch = false;
        doc.addEventListener('touchstart', (e: TouchEvent) => {
          if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isInternalTouch = false;
            let curr = e.target as HTMLElement | null;
            const ifWin = doc.defaultView || window;
            while (curr && curr !== doc.body && curr !== doc.documentElement) {
              const style = ifWin.getComputedStyle(curr);
              if ((style.overflowY === 'auto' || style.overflowY === 'scroll' || curr.classList.contains('card-snap-container')) && curr.scrollHeight > curr.clientHeight) {
                isInternalTouch = true;
                break;
              }
              curr = curr.parentElement;
            }
          }
        }, { passive: true });

        doc.addEventListener('touchmove', (e: TouchEvent) => {
          if (isPublished || isInternalTouch) return;
          if (e.touches.length === 1) {
            const deltaY = touchStartY - e.touches[0].clientY;
            const deltaX = touchStartX - e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            const scrollTarget = document.querySelector('[data-tour="canvas-stage"]') || document.getElementById('viewport-stage-scroll-container') || window;
            if (scrollTarget === window) {
              window.scrollBy({ top: deltaY, left: deltaX, behavior: 'auto' });
            } else {
              (scrollTarget as HTMLElement).scrollBy({ top: deltaY, left: deltaX, behavior: 'auto' });
            }
          }
        }, { passive: true });

        // Handle in-page anchor links inside iframe document (#projects, #about, etc.)
        doc.addEventListener('click', (e: MouseEvent) => {
          const target = (e.target as HTMLElement)?.closest('a');
          if (target) {
            const href = target.getAttribute('href');
            if (href && href.startsWith('#')) {
              e.preventDefault();
              const targetEl = doc.querySelector(href) || doc.getElementById(href.substring(1));
              if (targetEl) {
                if (isPublished) {
                  targetEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  const scrollTarget = document.querySelector('[data-tour="canvas-stage"]') || document.getElementById('viewport-stage-scroll-container') || window;
                  const targetRect = targetEl.getBoundingClientRect();
                  const offsetTop = targetRect.top;
                  if (scrollTarget === window) {
                    window.scrollBy({ top: offsetTop - 80, behavior: 'smooth' });
                  } else {
                    (scrollTarget as HTMLElement).scrollBy({ top: offsetTop - 80, behavior: 'smooth' });
                  }
                }
              }
            }
          }
        });

        const activeTmplId = runnerProps.data?.templateId || runnerProps.data?.layoutStyle || '';
        try {
          ((doc.defaultView || window) as any).__CAMPUSCV_TEMPLATE_ID__ = activeTmplId;
          (window as any).__CAMPUSCV_IFRAME_DOC__ = doc;
          window.dispatchEvent(new CustomEvent('campuscv:template-rendered', { detail: { templateId: activeTmplId, doc } }));
          if (window.parent) {
            window.parent.postMessage({
              type: 'CAMPUSCV_TEMPLATE_READY',
              templateId: activeTmplId
            }, '*');
          }
        } catch (e) {}

        setIframeBody(rootEl);
      }
    } catch (e) {
      console.error('[IsolatedTemplateIframe init error]', e);
    }
  };

  useEffect(() => {
    initIframe();
    // Safety check in case contentDocument ready state changes
    const timer = setTimeout(initIframe, 50);
    return () => clearTimeout(timer);
  }, [isPublished, logicalViewportWidth]);

  // Dynamic live theme color sync across editor and published iframe (Phase 16)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;
    const activeThemeColor =
      (runnerProps.data as any)?.theme?.primaryColor ||
      (runnerProps.data as any)?.themeColor ||
      (runnerProps.data as any)?.accentColor ||
      (runnerProps.data as any)?.userSelectedAccent ||
      '#7C3AED';

    let themeStyleTag = doc.getElementById('campuscv-theme-style') as HTMLStyleElement | null;
    if (!themeStyleTag) {
      themeStyleTag = doc.createElement('style');
      themeStyleTag.id = 'campuscv-theme-style';
      doc.head?.appendChild(themeStyleTag);
    }
    themeStyleTag.textContent = `
      :root, html, body, #iframe-root {
        --campuscv-primary-color: ${activeThemeColor};
        --primary: ${activeThemeColor};
        --theme-color: ${activeThemeColor};
        --accent-color: ${activeThemeColor};
      }
      .bg-primary { background-color: var(--campuscv-primary-color) !important; }
      .text-primary { color: var(--campuscv-primary-color) !important; }
      .border-primary { border-color: var(--campuscv-primary-color) !important; }
      .accent-primary { accent-color: var(--campuscv-primary-color) !important; }
    `;
  }, [
    (runnerProps.data as any)?.theme?.primaryColor,
    (runnerProps.data as any)?.themeColor,
    (runnerProps.data as any)?.accentColor,
    (runnerProps.data as any)?.userSelectedAccent
  ]);

  return (
    <iframe
      ref={iframeRef}
      onLoad={initIframe}
      title="Template Isolated Runtime"
      className={className || (isPublished ? "w-full h-screen border-0 rounded-none bg-transparent" : "w-full border-0 rounded-none bg-transparent")}
      style={{
        width: '100%',
        height: isPublished ? '100vh' : `${iframeHeight}px`,
        minHeight: isPublished ? '100vh' : `${iframeHeight}px`,
        border: 0,
        ...style
      }}
    >
      {iframeBody ? (
        createPortal(
          <UploadedTemplateRunner
            key={`${runnerProps.data?.id || 'port'}:${runnerProps.data?.templateId || 'default'}`}
            {...runnerProps}
          />,
          iframeBody
        )
      ) : (
        <div className="w-full min-h-[300px] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-zinc-500">Preparing template runtime...</span>
          </div>
        </div>
      )}
    </iframe>
  );
}
