/**
 * templateScriptRunner.ts — Static Script & Synthetic Lifecycle Execution Engine
 *
 * Executes static JavaScript scripts, inline <script> blocks, and package .js files
 * inside the template's isolated window/DOM scope once rendered.
 *
 * Dispatches synthetic DOMContentLoaded and load lifecycle events so template initialization
 * scripts (e.g. init(), setupNavigation(), AOS.init(), hamburger menu handlers) run reliably.
 */

export interface ScriptExecutionResult {
  executedCount: number;
  scriptNames: string[];
  cleanup: () => void;
}

/**
 * Strips ES module export/import syntax so code can be executed via new Function().
 */
export function sanitizeScriptForExecution(code: string): string {
  if (!code) return '';
  return code
    .replace(/^(\s*)import\s+[\s\S]*?;/gm, '$1/* import stripped */')
    .replace(/^(\s*)export\s+default\s+/gm, '$1/* export default */ ')
    .replace(/^(\s*)export\s+(const|let|var)\s+/gm, '$1$2 ')
    .replace(/^(\s*)export\s+(function|class)\s+/gm, '$1$2 ')
    .replace(/^(\s*)export\s*\{[\s\S]*?\};?/gm, '$1/* export block stripped */');
}

/**
 * Extracts and safely executes static scripts associated with an uploaded template package.
 */
export function executeTemplateScripts(
  doc: Document,
  rootElement: HTMLElement,
  sectionFiles: Record<string, string> = {}
): ScriptExecutionResult {
  if (!doc || !rootElement) {
    return { executedCount: 0, scriptNames: [], cleanup: () => {} };
  }

  const win = doc.defaultView || (typeof window !== 'undefined' ? window : null);
  if (!win) {
    return { executedCount: 0, scriptNames: [], cleanup: () => {} };
  }

  const executedNames: string[] = [];
  const activeListeners: Array<{ target: EventTarget; type: string; listener: EventListenerOrEventListenerObject }> = [];

  // Track event listeners added by scripts for safe unmount cleanup
  const originalAddEventListener = typeof win.addEventListener === 'function' ? win.addEventListener : null;
  const boundAddEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: any) {
    if (win) {
      activeListeners.push({ target: win, type, listener });
    }
    if (originalAddEventListener && typeof originalAddEventListener.call === 'function') {
      return originalAddEventListener.call(win, type, listener, options);
    }
  };

  const safeTimeout = typeof win.setTimeout === 'function' ? win.setTimeout.bind(win) : (typeof setTimeout !== 'undefined' ? setTimeout : () => 0);
  const safeInterval = typeof win.setInterval === 'function' ? win.setInterval.bind(win) : (typeof setInterval !== 'undefined' ? setInterval : () => 0);

  // Find standalone JavaScript files in package (e.g. js/main.js, js/app.js, js/script.js, scripts/nav.js)
  // Exclude root React config/entry files (schema, metadata, defaults, bindings, vite.config)
  const jsFiles = Object.entries(sectionFiles).filter(([path]) => {
    const clean = path.toLowerCase();
    const baseName = clean.split('/').pop() || '';
    const isScriptFolder = clean.includes('/js/') || clean.includes('/scripts/') || clean.includes('/assets/') || clean.includes('/vendor/') || clean.includes('/dist/');
    const isRootEntry = clean === 'app.js' || clean === 'app.jsx' || clean === 'app.tsx' || clean === 'index.js' || clean === 'index.jsx' || clean === 'index.tsx' || clean === 'src/app.jsx' || clean === 'src/index.jsx' || clean === 'src/main.jsx';

    const isConfigFile =
      baseName.includes('tailwind.config') ||
      baseName.includes('postcss.config') ||
      baseName.includes('vite.config') ||
      baseName.includes('next.config') ||
      baseName.includes('webpack.config') ||
      baseName.includes('rollup.config') ||
      baseName.includes('babel.config') ||
      baseName.includes('tsconfig') ||
      baseName.includes('package.json');

    return (
      (clean.endsWith('.js') || clean.endsWith('.mjs') || clean.endsWith('.cjs')) &&
      !clean.includes('node_modules') &&
      !isConfigFile &&
      !baseName.startsWith('schema.') &&
      !baseName.startsWith('metadata.') &&
      !baseName.startsWith('defaults.') &&
      !baseName.startsWith('bindings.') &&
      !baseName.startsWith('styles.') &&
      !baseName.startsWith('template.') &&
      (isScriptFolder || !isRootEntry)
    );
  });

  // Extract inline <script> tags inside rendered DOM
  const scriptElements = Array.from(rootElement.querySelectorAll('script'));

  let count = 0;

  // Execute standalone package .js files
  jsFiles.forEach(([path, rawCode]) => {
    if (!rawCode || rawCode.trim().length === 0) return;
    try {
      console.log(`[TEMPLATE RUNTIME] Executing package script: "${path}"`);
      const sanitizedCode = sanitizeScriptForExecution(rawCode);
      const scriptFn = new Function('window', 'document', 'console', 'setTimeout', 'setInterval', sanitizedCode);
      if (typeof scriptFn === 'function' && typeof scriptFn.call === 'function') {
        scriptFn.call(win, win, doc, console, safeTimeout, safeInterval);
      }
      executedNames.push(path);
      count++;
    } catch (err: any) {
      console.warn(`[TEMPLATE RUNTIME Script Notice in "${path}"]: `, err?.message || err);
    }
  });

  // Execute inline <script> tags
  scriptElements.forEach((scriptEl, idx) => {
    const inlineCode = scriptEl.textContent || scriptEl.innerText || '';
    if (inlineCode.trim().length > 0 && !scriptEl.hasAttribute('data-campus-executed')) {
      scriptEl.setAttribute('data-campus-executed', 'true');
      try {
        const scriptName = `inline-script-${idx + 1}`;
        console.log(`[TEMPLATE RUNTIME] Executing inline script ${scriptName}`);
        const sanitizedCode = sanitizeScriptForExecution(inlineCode);
        const scriptFn = new Function('window', 'document', 'console', 'setTimeout', 'setInterval', sanitizedCode);
        if (typeof scriptFn === 'function' && typeof scriptFn.call === 'function') {
          scriptFn.call(win, win, doc, console, safeTimeout, safeInterval);
        }
        executedNames.push(scriptName);
        count++;
      } catch (err: any) {
        console.warn(`[TEMPLATE RUNTIME Inline Script Notice ${idx + 1}]: `, err?.message || err);
      }
    }
  });

  // Dispatch synthetic DOMContentLoaded & load events to trigger initializers
  const triggerLifecycleEvents = () => {
    try {
      console.log('[TEMPLATE RUNTIME] Triggering synthetic DOMContentLoaded & load lifecycle events');
      const domContentLoadedEvent = new Event('DOMContentLoaded', { bubbles: true, cancelable: true });
      const loadEvent = new Event('load', { bubbles: true, cancelable: true });

      doc.dispatchEvent(domContentLoadedEvent);
      if (win && typeof win.dispatchEvent === 'function') {
        win.dispatchEvent(domContentLoadedEvent);
        win.dispatchEvent(loadEvent);
      }
    } catch (e) {
      // Fallback dispatch
      try {
        if (typeof (doc as any).onDOMContentLoaded === 'function') (doc as any).onDOMContentLoaded();
        if (win && typeof (win as any).onload === 'function') (win as any).onload();
      } catch (_) {}
    }
  };

  // Trigger lifecycle after paint
  const safeReqAnimFrame = typeof win.requestAnimationFrame === 'function' ? win.requestAnimationFrame.bind(win) : (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : (cb: Function) => setTimeout(cb, 16));
  const rafId = safeReqAnimFrame(() => {
    triggerLifecycleEvents();
  });

  const cleanup = () => {
    try {
      if (typeof win.cancelAnimationFrame === 'function') {
        win.cancelAnimationFrame(rafId);
      }
      activeListeners.forEach(({ target, type, listener }) => {
        try {
          if (target && typeof target.removeEventListener === 'function') {
            target.removeEventListener(type, listener);
          }
        } catch (e) {}
      });
    } catch (e) {}
  };

  return {
    executedCount: count,
    scriptNames: executedNames,
    cleanup
  };
}
