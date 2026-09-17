import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import * as FramerMotion from 'framer-motion';
import { PortfolioData, mockDb, CustomTemplate } from '../utils/mockDb';
import { adminTemplateDb } from '../utils/adminTemplateDb';
import { EditableText, EditableImage, EditableList, EditableSection } from '../components/editor/EditableWrappers';
import { EditorSchema } from '../types/schema';
import { handleImageUpload } from '../utils/imageUploadStorage';
import { templateStorage } from '../utils/templateStorage';
import { normalizePortfolio } from '../utils/portfolioNormalizer';
import { detectSectionId, resolveFieldPath } from '../utils/CanvasDOMScanner';
import { isUploadedPortfolio, getPortfolioTemplateId, loadTemplateFilesAsync, resolveTemplateFilesSync, ResolvedTemplateFiles } from '../utils/templateResolver';
import { discoverEditableNodes, applyNodeOverrides, applyPortfolioOverrides, attachNodeOverrideObserver, detectNodeSectionId, detectContainerContext, detectCollectionContext, EditableNode, getEffectiveTemplateRoot, resetDOMNodeAttributes } from '../utils/universalNodeEngine';
import { useEditorContext } from '../context/EditorContext';
import { handleUniversalDoubleClick, safeCanBeContentEditable } from '../utils/universalDoubleClickEngine';
import { resolveTemplateAsset } from '../utils/templateAssetResolver';
import { discoverTemplateCSS, CSSManifest } from '../utils/UniversalCSSDiscovery';
import { templateDebugger } from '../utils/templateDebugger';
import { normalizeManifest } from '../utils/manifestNormalizer';
import { attachStickyHeaderNormalizer } from '../utils/templateHeaderNormalizer';
import { resolveTemplateLibrary } from '../utils/templateLibraryAdapters';
import { executeTemplateScripts } from '../utils/templateScriptRunner';
import { attachTemplateScrollProxy } from '../utils/templateScrollProxy';
import { getGoogleFontUrl } from '../utils/themeTypographyPresets';

function RenderAddedElements({ elements, data }: { elements: any[]; data: any }) {
  if (!Array.isArray(elements) || elements.length === 0) return null;

  return (
    <div className="added-elements-container space-y-4 my-6 text-center">
      {elements.map((el: any) => {
        const nodeId = `text:${el.id}:root:${el.type === 'image' ? 'img' : (el.type === 'button' ? 'a' : (el.type === 'heading' ? 'h3' : 'p'))}:0`;
        if (data?.deletedNodes?.[nodeId] === true || data?.deletedNodes?.[el.id] === true) return null;

        const contentOverride = data?.contentOverrides?.[nodeId] || data?.contentOverrides?.[el.id] || {};
        const styleOverride = data?.styleOverrides?.[nodeId] || data?.styleOverrides?.[el.id] || {};

        const textVal = contentOverride.value || el.value || el.content || 'New Element';
        const srcVal = contentOverride.src || el.src || el.value || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

        if (el.type === 'image') {
          return (
            <img
              key={el.id}
              data-node-id={nodeId}
              data-node-type="image"
              src={srcVal}
              alt="Added image"
              className="max-w-md mx-auto rounded-2xl shadow-lg my-4"
              style={{ borderRadius: styleOverride.borderRadius || '16px', ...styleOverride }}
            />
          );
        }

        if (el.type === 'button') {
          return (
            <a
              key={el.id}
              href={el.href || '#'}
              data-node-id={nodeId}
              data-node-type="button"
              className="inline-block px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm my-2 transition-all shadow-md"
              style={{ backgroundColor: styleOverride.backgroundColor || '#7C3AED', color: styleOverride.color || '#ffffff', ...styleOverride }}
            >
              {textVal}
            </a>
          );
        }

        if (el.type === 'heading') {
          return (
            <h3
              key={el.id}
              data-node-id={nodeId}
              data-node-type="text"
              className="text-2xl font-bold text-zinc-900 my-3"
              style={{ color: styleOverride.color || '#0f172a', fontSize: styleOverride.fontSize || '24px', ...styleOverride }}
            >
              {textVal}
            </h3>
          );
        }

        return (
          <p
            key={el.id}
            data-node-id={nodeId}
            data-node-type="text"
            className="text-sm text-zinc-600 my-2 leading-relaxed max-w-2xl mx-auto"
            style={{ color: styleOverride.color || '#475569', fontSize: styleOverride.fontSize || '14px', ...styleOverride }}
          >
            {textVal}
          </p>
        );
      })}
    </div>
  );
}

function RenderAddedSections({ sections, data }: { sections: any[]; data: any }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return (
    <div className="added-sections-container w-full">
      {sections.map((sec: any) => {
        const secNodeId = `section:${sec.id}:root:section:0`;
        if (data?.deletedNodes?.[secNodeId] === true || data?.deletedNodes?.[sec.id] === true) return null;

        const styleOverride = data?.styleOverrides?.[secNodeId] || data?.styleOverrides?.[sec.id] || {};
        const titleOverride = data?.contentOverrides?.[`text:${sec.id}:root:h2:0`]?.value || sec.title || 'Custom Section';

        return (
          <section
            key={sec.id}
            id={sec.id}
            data-node-id={secNodeId}
            data-node-type="section"
            className="custom-added-section py-16 px-6 relative border-t border-zinc-200/60"
            style={{
              backgroundColor: styleOverride.backgroundColor || sec.style?.backgroundColor || '#f8fafc',
              padding: styleOverride.padding || sec.style?.padding || '64px 24px',
              ...styleOverride
            }}
          >
            <div className="max-w-5xl mx-auto space-y-6 text-center">
              <h2
                data-node-id={`text:${sec.id}:root:h2:0`}
                data-node-type="text"
                className="text-3xl font-extrabold text-zinc-900"
                style={{ color: styleOverride.color || '#0f172a' }}
              >
                {titleOverride}
              </h2>

              <RenderAddedElements
                elements={Array.isArray(data?.addedElements) ? data.addedElements.filter((el: any) => el.parentNodeId === secNodeId || el.sectionId === sec.id) : []}
                data={data}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}

export interface UploadedTemplateRunnerProps {
  templateId?: string;
  versionId?: string;
  data: PortfolioData;
  mode?: 'editor' | 'preview' | 'published';
  renderMode?: 'editor' | 'preview' | 'published';
  activePage?: string;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: any) => void;
  selectedElementId?: string | null;
  setSelectedElementId?: (id: string | null) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onSchemaLoaded?: (schema: EditorSchema) => void;
}

export type SectionStage = 'registered' | 'mounting' | 'rendered' | 'failed';

export interface SectionHealthInfo {
  stage: SectionStage;
  errorMsg?: string;
  location?: string;
  stack?: string;
}

// Per-Section Error Boundary to prevent one crashing section from blacking out the entire canvas
export class SectionErrorBoundary extends React.Component<
  { sectionName: string; children: React.ReactNode; onError?: (name: string, err: Error, info: { location: string; stack: string }) => void },
  { hasError: boolean; error: Error | null; location: string; stack: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, location: '', stack: '' };
  }

  static getDerivedStateFromError(error: any) {
    let errObj: Error;
    if (error instanceof Error) {
      errObj = error;
    } else if (typeof error === 'string') {
      errObj = new Error(error);
    } else if (error && typeof error === 'object') {
      errObj = new Error(error.message || error.type || String(error));
    } else {
      errObj = new Error('Template rendering exception');
    }
    return { hasError: true, error: errObj, location: '', stack: errObj.stack || '' };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    const errObj = (error instanceof Error) ? error : new Error(typeof error === 'string' ? error : (error?.message || String(error)));
    const stack = errObj.stack || errorInfo.componentStack || '';
    const locMatch = stack.match(/at\s+([^\n]+)/) || stack.match(/(\w+\.(?:tsx|jsx|js):\d+)/);
    const location = locMatch ? locMatch[1].trim() : `${this.props.sectionName}.tsx`;

    console.error(`❌ ${this.props.sectionName} failed\nReason:\n${errObj.message}\nLocation:\n${location}\nStack:\n${stack}`);

    this.setState({ location, stack });

    if (this.props.onError) {
      this.props.onError(this.props.sectionName, errObj, { location, stack });
    }
  }

  render() {
    if (this.state.hasError) {
      const err = this.state.error;
      const stack = this.state.stack || err?.stack || '';
      const loc = this.state.location || `${this.props.sectionName}.tsx`;

      return (
        <div className="p-4 m-3 rounded-2xl bg-red-950/95 border-2 border-red-600 text-red-100 text-xs font-mono shadow-2xl space-y-2.5 text-left">
          <div className="font-extrabold text-sm text-red-400 flex items-center gap-2">
            <span>❌ {this.props.sectionName} failed</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-red-300 uppercase tracking-wider mb-0.5">Reason:</div>
            <div className="bg-black/60 p-2.5 rounded-xl border border-red-800/80 text-red-200 font-semibold">{err?.message || 'TypeError: Failed to render section'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-red-300 uppercase tracking-wider mb-0.5">Location:</div>
            <div className="bg-black/40 p-2 rounded-lg text-red-300 font-mono text-[11px]">{loc}</div>
          </div>
          {stack && (
            <div>
              <div className="text-[10px] font-bold text-red-300 uppercase tracking-wider mb-0.5">Stack:</div>
              <pre className="bg-black/40 p-2.5 rounded-lg text-[10px] text-red-300/90 overflow-x-auto max-h-24 whitespace-pre-wrap">{stack}</pre>
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Error boundary to catch React child/rendering errors inside custom templates
class TemplateErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    let errObj: Error;
    if (error instanceof Error) {
      errObj = error;
    } else if (typeof error === 'string') {
      errObj = new Error(error);
    } else if (error && typeof error === 'object') {
      errObj = new Error(error.message || error.type || String(error));
    } else {
      errObj = new Error('Template rendering exception');
    }
    return { hasError: true, error: errObj };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    const errObj = (error instanceof Error) ? error : new Error(typeof error === 'string' ? error : (error?.message || String(error)));
    console.error('[CANVAS_RENDER_EXCEPTION] Component render failure:', errObj.message, errorInfo.componentStack);
    this.props.onError(errObj);
  }

  componentDidUpdate(prevProps: any) {
    if (this.state.hasError && prevProps !== this.props) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-amber-950/90 text-amber-100 border-2 border-amber-500 rounded-2xl font-mono text-xs shadow-2xl text-left space-y-2 select-none">
          <div className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
            <span>⚠️ Template Component Render Exception</span>
          </div>
          <div className="text-[11px] text-amber-200">
            {this.state.error?.message || 'An error occurred while rendering the template element.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-sans text-xs font-bold rounded-lg transition-all"
          >
            Retry Component Render
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function UploadedTemplateError({
  portfolioId,
  templateId,
  errorMessage,
  compilationLogs
}: {
  portfolioId?: string;
  templateId: string;
  errorMessage: string;
  compilationLogs?: any[];
}) {
  if (typeof window !== 'undefined') {
    console.log('[TEMPLATE LOAD ERROR]', {
      requestedTemplateId: templateId,
      requestedTemplateName: templateId,
      reason: errorMessage,
      attemptedPath: 'src/templates/' + templateId
    });
  }
  return (
    <div className="p-8 m-6 bg-red-950 text-red-100 border-2 border-red-600 rounded-3xl font-mono text-xs shadow-2xl space-y-4 text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-900/80 border border-red-500 flex items-center justify-center text-red-300 font-bold text-lg">
          ⚠️
        </div>
        <div>
          <h3 className="text-base font-extrabold text-red-200">Uploaded Template Could Not Be Loaded</h3>
          <p className="text-[11px] text-red-400 font-sans">CampusCV Render Isolation Active — Default layouts are strictly disabled for uploaded templates.</p>
        </div>
      </div>

      <div className="bg-black/60 p-4 rounded-2xl border border-red-800/80 space-y-2 text-red-200">
        <div><span className="text-red-400 font-bold">Portfolio ID:</span> <span className="font-mono text-red-300">{portfolioId || 'N/A'}</span></div>
        <div><span className="text-red-400 font-bold">Template ID:</span> <span className="font-mono text-red-300">{templateId}</span></div>
        <div><span className="text-red-400 font-bold">Requested Mode:</span> <span className="font-mono text-red-300">uploaded</span></div>
        <div><span className="text-red-400 font-bold">Error Reason:</span></div>
        <div className="bg-black/80 p-3 rounded-xl border border-red-900/80 text-red-300 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
          {errorMessage}
        </div>
      </div>

      {compilationLogs && compilationLogs.length > 0 && (
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Compilation / Resolution Logs:</div>
          <div className="bg-black/40 p-3 rounded-xl border border-red-900/60 text-[10px] space-y-1 max-h-40 overflow-y-auto">
            {compilationLogs.map((log, i) => (
              <div key={i} className={log.status === 'error' ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                {log.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Lazy load Babel on client side only
let babelPromise: Promise<any> | null = null;
function loadBabel() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!babelPromise) {
    babelPromise = import('@babel/standalone');
  }
  return babelPromise;
}

// ----------------------------------------------------------------------
// CSS Module & Global Style Bundler Engine
// ----------------------------------------------------------------------

interface BundledStyles {
  combinedCSS: string;
  cssModuleMap: Record<string, Record<string, string>>;
  hasTailwind?: boolean;
  manifest?: CSSManifest;
}

function scopeGlobalCSS(css: string): string {
  if (!css) return '';

  let scoped = css;

  // Strip raw Tailwind build @import directives (tailwindcss, tailwindcss/base, tailwindcss/components, tailwindcss/utilities, etc.)
  scoped = scoped.replace(/@import\s+(?:url\(['"]?([^'")]+)['"]?\)|['"]([^'"]+)['"])\s*;?/gi, (match, p1, p2) => {
    const importPath = (typeof p1 === 'string' ? p1 : (typeof p2 === 'string' ? p2 : '')).trim();
    if (importPath.includes('tailwindcss') || importPath.includes('tailwind')) {
      return `/* Tailwind CSS Directives */`;
    }
    if (
      importPath.startsWith('http://') ||
      importPath.startsWith('https://') ||
      importPath.startsWith('//') ||
      importPath.includes('fonts.googleapis')
    ) {
      return match; // Keep external google fonts / CDNs
    }
    return `/* Strip un-inlined relative import: "${importPath}" */`;
  });

  // Preserve original selectors (:root, html, body) as-is for true visual fidelity inside the isolated iframe
  return scoped;
}

function processTemplateStyles(sectionFiles: Record<string, string>, scopeHash: string, assetMap?: Record<string, string>, templateId: string = 'uploaded'): BundledStyles {
  const discovered = discoverTemplateCSS(sectionFiles, scopeHash, assetMap, templateId);
  const scopedCSS = scopeGlobalCSS(discovered.combinedCSS);

  return {
    combinedCSS: scopedCSS,
    cssModuleMap: discovered.cssModuleMap,
    hasTailwind: discovered.manifest.tailwind,
    manifest: discovered.manifest
  };
}



interface TranspileResult {
  code: string;
  error?: string;
  line?: number;
}

// Global in-memory transpile cache across template executions
const globalTranspileCache: Map<string, string> = new Map();

function transpileTSX(Babel: any, code: string, filePath: string = 'file.tsx'): TranspileResult {
  const trimmed = code.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
    return {
      code: `function HtmlWrapper() { return React.createElement('div', { dangerouslySetInnerHTML: { __html: ${JSON.stringify(code)} } }); }\nmodule.exports = { default: HtmlWrapper };`
    };
  }

  const cacheKey = `${filePath}:::${code}`;
  if (globalTranspileCache.has(cacheKey)) {
    return { code: globalTranspileCache.get(cacheKey)! };
  }

  try {
    const transformed = Babel.transform(code, {
      filename: filePath,
      presets: [
        'typescript',
        ['react', { runtime: 'classic' }],
        ['env', { modules: 'commonjs' }]
      ]
    });

    const transpiledCode = transformed?.code || '';
    globalTranspileCache.set(cacheKey, transpiledCode);
    return { code: transpiledCode };
  } catch (err: any) {
    const loc = err.loc || err.location;
    const line = loc ? loc.line : undefined;
    const errorMsg = `[Compilation Error in ${filePath}${line ? ` at line ${line}` : ''}]: ${err.message}`;
    console.error(errorMsg, err);
    return { code: '', error: errorMsg, line };
  }
}

// ----------------------------------------------------------------------
// Virtual Module Resolver & Recursive Dependency Execution Environment
// ----------------------------------------------------------------------

function findInFiles(files: Record<string, string>, targetPath: string): { code: string; key: string } | null {
  if (!files || !targetPath) return null;

  const fileKeys = Object.keys(files);
  if (fileKeys.length === 0) return null;

  const cleanPath = targetPath.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\//, '');

  // Generate candidate paths for resolution (supporting @/, ~/, @alias/, src/, root)
  const candidateBases = new Set<string>();
  candidateBases.add(cleanPath);

  if (cleanPath.startsWith('@/') || cleanPath.startsWith('~/')) {
    const stripped = cleanPath.replace(/^[@~]\//, '');
    candidateBases.add(stripped);
    candidateBases.add(`src/${stripped}`);
  } else if (cleanPath.startsWith('@')) {
    const stripped = cleanPath.replace(/^@[^/]+\//, '');
    candidateBases.add(stripped);
    candidateBases.add(`src/${stripped}`);
  }

  if (!cleanPath.startsWith('src/') && !cleanPath.startsWith('.')) {
    candidateBases.add(`src/${cleanPath}`);
  }

  // 1. Direct match with all candidate bases
  for (const base of candidateBases) {
    const normTarget = base.toLowerCase();
    for (const k of fileKeys) {
      const normK = k.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\//, '').toLowerCase();
      if (normK === normTarget) {
        return { code: files[k], key: k };
      }
    }
  }

  // 2. Variations (with extensions & index fallbacks) for all candidate bases
  const variations: string[] = [];
  for (const base of candidateBases) {
    variations.push(
      base,
      `${base}.tsx`,
      `${base}.ts`,
      `${base}.jsx`,
      `${base}.js`,
      `${base}.json`,
      `${base}/index.tsx`,
      `${base}/index.ts`,
      `${base}/index.jsx`,
      `${base}/index.js`
    );
  }

  for (const v of variations) {
    const vLower = v.toLowerCase();
    for (const k of fileKeys) {
      const normK = k.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\//, '').toLowerCase();
      if (
        normK === vLower ||
        normK.endsWith(`/${vLower}`) ||
        normK.replace(/^[^/]+\//, '') === vLower
      ) {
        return { code: files[k], key: k };
      }
    }
  }

  return null;
}

function resolvePath(baseFile: string, relativePath: string): string {
  const normBase = baseFile.replace(/\\/g, '/');
  const normRel = relativePath.replace(/\\/g, '/');

  if (normRel.startsWith('@/') || normRel.startsWith('~/') || normRel.startsWith('@')) {
    return normRel;
  }

  if (!normRel.startsWith('.')) return normRel;

  const baseParts = normBase.split('/');
  baseParts.pop(); // remove filename

  const relParts = normRel.split('/');
  for (const part of relParts) {
    if (part === '.') continue;
    if (part === '..') {
      if (baseParts.length > 0) baseParts.pop();
    } else {
      baseParts.push(part);
    }
  }
  return baseParts.join('/');
}

export interface CompilationLog {
  file: string;
  status: 'compiled' | 'cached' | 'error';
  message: string;
}

export interface ExecutionPackageResult {
  exports: any;
  entryKey: string;
  logs: CompilationLog[];
  error?: string;
}

/**
 * Robustly extracts the primary React Component from module exports.
 * Supports ESM default, named exports, CJS module.exports, and direct function exports.
 */
function extractReactComponent(packageExports: any): React.ComponentType<any> | null {
  if (!packageExports) return null;

  // 1. Direct function or class export (e.g. module.exports = Component)
  if (typeof packageExports === 'function') {
    return packageExports;
  }

  // 2. React component object (e.g. React.memo, React.forwardRef)
  if (typeof packageExports === 'object' && packageExports.$$typeof) {
    return packageExports;
  }

  if (typeof packageExports === 'object') {
    // 3. ESM/CommonJS default export
    if (typeof packageExports.default === 'function') {
      return packageExports.default;
    }
    if (typeof packageExports.default === 'object' && packageExports.default?.$$typeof) {
      return packageExports.default;
    }

    // 4. Recognized named exports
    const candidates = ['Portfolio', 'Template', 'App', 'Page', 'Main', 'Home', 'default'];
    for (const name of candidates) {
      if (typeof packageExports[name] === 'function') {
        return packageExports[name];
      }
      if (typeof packageExports[name] === 'object' && packageExports[name]?.$$typeof) {
        return packageExports[name];
      }
    }

    // 5. First exported function or React component
    for (const key of Object.keys(packageExports)) {
      const val = packageExports[key];
      if (typeof val === 'function') {
        return val;
      }
      if (typeof val === 'object' && val?.$$typeof) {
        return val;
      }
    }
  }

  return null;
}

function executeUploadedPackage(
  Babel: any,
  sectionFiles: Record<string, string>,
  cssModuleMap: Record<string, Record<string, string>>,
  fallbackCode?: string,
  activeData?: any,
  templateId: string = 'uploaded',
  latestDataRef?: { current: any },
  targetDoc?: Document | null
): ExecutionPackageResult {
  const moduleCache: Record<string, any> = {};
  const transpiledCache: Record<string, string> = {};
  const logs: CompilationLog[] = [];
  const visiting = new Set<string>();

  // Determine the isolated template window & document scope
  const scopedDoc = targetDoc || (typeof window !== 'undefined' ? (window as any).__CAMPUSCV_IFRAME_DOC__ || document : null);
  const scopedWin = (scopedDoc && scopedDoc.defaultView) ? scopedDoc.defaultView : (typeof window !== 'undefined' ? window : null);

  // ── UNIVERSAL DATA BINDING: Canonical live data singleton ────────────────────
  // Built once per executeUploadedPackage call. All modules share the SAME
  // context object so React's useContext(LivePortfolioContext) works correctly
  // across PortfolioProvider and usePortfolio hooks in different component files.
  const liveData = activeData || {};

  const resolvedUserImage =
    liveData.profile?.image ||
    liveData.profile?.avatarUrl ||
    liveData.profile?.photo ||
    liveData.profile?.profileImage ||
    liveData.profileImage ||
    liveData.avatarUrl ||
    liveData.about?.avatarUrl ||
    liveData.about?.image ||
    liveData.hero?.avatarUrl ||
    liveData.hero?.profileImage ||
    liveData.personal?.profilePhoto ||
    liveData.images?.profileImage ||
    '';

  const templateAssetFallback = resolveTemplateAsset(templateId, 'images/portrait.jpg', sectionFiles) ||
    resolveTemplateAsset(templateId, 'portrait.jpg', sectionFiles) ||
    resolveTemplateAsset(templateId, 'assets/portrait.jpg', sectionFiles) ||
    '';

  const finalProfileImage = resolvedUserImage || templateAssetFallback;

  const resolvedProfileSingleton = {
    name: liveData.name || liveData.fullName || liveData.personal?.fullName || liveData.profile?.name || liveData.hero?.name || liveData.hero?.title || '',
    fullName: liveData.fullName || liveData.name || liveData.personal?.fullName || liveData.profile?.fullName || liveData.profile?.name || '',
    headline: liveData.headline || liveData.role || liveData.tagline || liveData.personal?.headline || liveData.hero?.headline || liveData.hero?.subtitle || liveData.profile?.headline || '',
    role: liveData.role || liveData.headline || liveData.tagline || liveData.personal?.role || liveData.personal?.headline || liveData.hero?.role || liveData.profile?.role || '',
    bio: liveData.bio || liveData.summary || liveData.aboutMe || liveData.personal?.summary || liveData.hero?.introductionText || liveData.hero?.description || liveData.about?.description || liveData.profile?.bio || '',
    summary: liveData.summary || liveData.bio || liveData.aboutMe || liveData.personal?.summary || liveData.about?.summary || liveData.profile?.summary || '',
    email: liveData.email || liveData.contact?.email || liveData.personal?.email || liveData.profile?.email || liveData.ownerEmail || '',
    phone: liveData.phone || liveData.contact?.phone || liveData.personal?.phone || liveData.profile?.phone || '',
    image: finalProfileImage,
    profileImage: finalProfileImage,
    avatarUrl: finalProfileImage,
    photo: finalProfileImage,
    location: liveData.location || liveData.contact?.location || liveData.contact?.city || liveData.personal?.city || liveData.personal?.location || liveData.hero?.location || liveData.profile?.location || '',
    university: (Array.isArray(liveData.education) && (liveData.education[0]?.institution || liveData.education[0]?.school)) || liveData.university || liveData.hero?.university || liveData.profile?.university || '',
    degree: (Array.isArray(liveData.education) && liveData.education[0]?.degree) || liveData.degree || liveData.hero?.degree || liveData.profile?.degree || '',
    graduationYear: (Array.isArray(liveData.education) && (liveData.education[0]?.endDate || liveData.education[0]?.period)) || liveData.graduationYear || liveData.hero?.graduation || liveData.profile?.graduationYear || '',
    availability: liveData.availability || liveData.hero?.availability || liveData.profile?.availability || liveData.personal?.availability || '',
    capabilities: (Array.isArray(liveData.skills) ? liveData.skills.map((s: any) => typeof s === 'string' ? s : (s.name || s.title || s.skill)).filter(Boolean) : (liveData.capabilities || liveData.profile?.capabilities || [])),
  };

  const normalizedLiveDataSingleton = {
    ...liveData,
    id: liveData.id || 'default-id',
    name: resolvedProfileSingleton.name,
    fullName: resolvedProfileSingleton.fullName || resolvedProfileSingleton.name,
    headline: resolvedProfileSingleton.headline,
    role: resolvedProfileSingleton.role || resolvedProfileSingleton.headline,
    title: resolvedProfileSingleton.headline,
    tagline: resolvedProfileSingleton.headline,
    bio: resolvedProfileSingleton.bio || resolvedProfileSingleton.summary,
    aboutMe: resolvedProfileSingleton.bio || resolvedProfileSingleton.summary,
    summary: resolvedProfileSingleton.summary || resolvedProfileSingleton.bio,
    location: resolvedProfileSingleton.location,
    university: resolvedProfileSingleton.university,
    degree: resolvedProfileSingleton.degree,
    graduationYear: resolvedProfileSingleton.graduationYear,
    email: resolvedProfileSingleton.email,
    phone: resolvedProfileSingleton.phone,
    profileImage: finalProfileImage,
    avatarUrl: finalProfileImage,
    image: finalProfileImage,
    photo: finalProfileImage,

    // Sub-objects for various template schema conventions
    profile: {
      ...resolvedProfileSingleton,
      ...(liveData.profile || {}),
      image: finalProfileImage,
      profileImage: finalProfileImage,
      avatarUrl: finalProfileImage,
      photo: finalProfileImage,
    },
    hero: {
      name: resolvedProfileSingleton.name,
      role: resolvedProfileSingleton.role || resolvedProfileSingleton.headline,
      title: resolvedProfileSingleton.headline,
      subtitle: resolvedProfileSingleton.headline,
      degree: resolvedProfileSingleton.degree,
      university: resolvedProfileSingleton.university,
      location: resolvedProfileSingleton.location,
      graduation: resolvedProfileSingleton.graduationYear,
      avatarUrl: finalProfileImage,
      profileImage: finalProfileImage,
      image: finalProfileImage,
      photo: finalProfileImage,
      ...(liveData.hero || {})
    },
    about: {
      name: resolvedProfileSingleton.name,
      bio: resolvedProfileSingleton.bio,
      summary: resolvedProfileSingleton.summary,
      description: resolvedProfileSingleton.bio,
      university: resolvedProfileSingleton.university,
      location: resolvedProfileSingleton.location,
      degree: resolvedProfileSingleton.degree,
      graduationYear: resolvedProfileSingleton.graduationYear,
      avatarUrl: finalProfileImage,
      profileImage: finalProfileImage,
      image: finalProfileImage,
      photo: finalProfileImage,
      ...(liveData.about || {})
    },
    personal: {
      name: resolvedProfileSingleton.name,
      fullName: resolvedProfileSingleton.fullName || resolvedProfileSingleton.name,
      headline: resolvedProfileSingleton.headline,
      role: resolvedProfileSingleton.headline,
      location: resolvedProfileSingleton.location,
      email: resolvedProfileSingleton.email,
      phone: resolvedProfileSingleton.phone,
      summary: resolvedProfileSingleton.bio,
      profilePhoto: finalProfileImage,
      avatarUrl: finalProfileImage,
      ...(liveData.personal || {})
    },

    // Section collections
    education: (Array.isArray(liveData.education) ? liveData.education : []).map((edu: any, idx: number) => {
      const rawStart = String(edu.startDate || edu.startYear || edu.start || edu.from || '').trim();
      const rawEnd = String(edu.endDate || edu.endYear || edu.graduationYear || edu.end || edu.to || '').trim();
      const rawPeriod = String(edu.period || edu.year || edu.duration || edu.years || '').trim();
      let period = rawPeriod;
      if (!period && rawStart && rawEnd) {
        period = `${rawStart} – ${rawEnd}`;
      } else if (!period && (rawStart || rawEnd)) {
        period = rawStart || rawEnd;
      }
      return {
        ...edu,
        id: edu.id || `edu-${idx}`,
        institution: edu.institution || edu.school || edu.university || edu.college || '',
        school: edu.institution || edu.school || edu.university || edu.college || '',
        university: edu.institution || edu.school || edu.university || edu.college || '',
        degree: edu.degree || edu.qualification || edu.title || '',
        fieldOfStudy: edu.fieldOfStudy || edu.field || edu.department || edu.specialization || edu.major || '',
        field: edu.fieldOfStudy || edu.field || edu.department || edu.specialization || edu.major || '',
        startDate: rawStart,
        startYear: rawStart,
        endDate: rawEnd,
        endYear: rawEnd,
        period: period,
        year: period || rawStart || rawEnd || '',
        years: period || rawStart || rawEnd || '',
        duration: period || rawStart || rawEnd || '',
        description: edu.description || edu.details || edu.summary || '',
      };
    }),
    skills: Array.isArray(liveData.skills) ? liveData.skills : [],
    projects: Array.isArray(liveData.projects) ? liveData.projects : [],
    experience: Array.isArray(liveData.experience || liveData.timeline) ? (liveData.experience || liveData.timeline) : [],
    timeline: Array.isArray(liveData.timeline || liveData.experience) ? (liveData.timeline || liveData.experience) : [],
    achievements: Array.isArray(liveData.achievements) ? liveData.achievements : [],
    certifications: Array.isArray(liveData.certifications || liveData.certificates || liveData.awards || liveData.credentials) ? (liveData.certifications || liveData.certificates || liveData.awards || liveData.credentials) : [],
    certificates: Array.isArray(liveData.certificates || liveData.certifications || liveData.awards || liveData.credentials) ? (liveData.certificates || liveData.certifications || liveData.awards || liveData.credentials) : [],
    awards: Array.isArray(liveData.awards || liveData.certifications || liveData.certificates || liveData.credentials) ? (liveData.awards || liveData.certifications || liveData.certificates || liveData.credentials) : [],
    credentials: Array.isArray(liveData.credentials || liveData.certifications || liveData.certificates || liveData.awards) ? (liveData.credentials || liveData.certifications || liveData.certificates || liveData.awards) : [],
    interests: Array.isArray(liveData.interests) ? liveData.interests : [],

    // Contact & Social links
    contact: liveData.contact || liveData.personal || {},
    social: liveData.social || liveData.socialLinks || {},
    socialLinks: liveData.socialLinks || liveData.social || {},
    socials: liveData.socials || liveData.socialLinks || liveData.social || {},
    resume: liveData.resume || liveData.resumeUrl || null,
  };

  // Shared React Context — one instance for the entire uploaded template package
  const LivePortfolioContextSingleton = React.createContext<any>({ data: normalizedLiveDataSingleton });

  const LivePortfolioProviderSingleton = ({ children, portfolio }: { children: React.ReactNode; portfolio?: any }) => {
    const data = portfolio || normalizedLiveDataSingleton;
    return React.createElement(LivePortfolioContextSingleton.Provider, { value: { data } }, children);
  };

  const usePortfolioHookSingleton = () => {
    const ctx = React.useContext(LivePortfolioContextSingleton);
    if (ctx && ctx.data) return ctx.data;
    if (latestDataRef && latestDataRef.current) return latestDataRef.current;
    return normalizedLiveDataSingleton;
  };

  const sharedPortfolioContextModule = {
    PortfolioContext: LivePortfolioContextSingleton,
    PortfolioProvider: LivePortfolioProviderSingleton,
    usePortfolio: usePortfolioHookSingleton,
    usePortfolioData: usePortfolioHookSingleton,
    default: {
      PortfolioContext: LivePortfolioContextSingleton,
      PortfolioProvider: LivePortfolioProviderSingleton,
      usePortfolio: usePortfolioHookSingleton,
      usePortfolioData: usePortfolioHookSingleton
    }
  };

  const sharedMockDataModule = new Proxy(normalizedLiveDataSingleton, {
    get(target, prop, receiver) {
      const live = (latestDataRef && latestDataRef.current) || target;
      if (live && prop in live) {
        return (live as any)[prop];
      }
      if (
        prop === 'certifications' ||
        prop === 'certificates' ||
        prop === 'awards' ||
        prop === 'credentials'
      ) {
        return (live as any)?.[prop] || (target as any)?.[prop] || [];
      }
      if (
        prop === 'photographyProfile' ||
        prop === 'profile' ||
        prop === 'portfolioProfile' ||
        prop === 'beauticianProfile' ||
        prop === 'doctorProfile' ||
        prop === 'lawyerData' ||
        prop === 'default' ||
        prop === 'initialPortfolioData' ||
        prop === 'DEFAULT_ENGINEERING_DATA' ||
        prop === 'defaultDataObj' ||
        prop === 'portfolioData'
      ) {
        return live || target;
      }
      return Reflect.get(target, prop, receiver) || (live as any)?.[prop];
    }
  });

  if (resolvedProfileSingleton.name) {
    console.log(`[CAMPUSCV UNIVERSAL BINDING] Live data injected — user: "${resolvedProfileSingleton.name}" | skills: ${normalizedLiveDataSingleton.skills.length} | projects: ${normalizedLiveDataSingleton.projects.length} | education: ${normalizedLiveDataSingleton.education.length}`);
  }
  // ─────────────────────────────────────────────────────────────────────────────

  function SafeCreateElement(type: any, props: any, ...children: any[]) {
    if (props && props.src === '') {
      const { src, ...rest } = props;
      return React.createElement(type, { ...rest, src: null }, ...children);
    }
    return React.createElement(type, props, ...children);
  }

  function requireModule(importPath: string, currentFile: string = 'index.tsx'): any {
    // 0. Check universal animation & UI library adapters (GSAP, AOS, Swiper, Lenis, clsx, twMerge, Three.js, etc.)
    const libAdapter = resolveTemplateLibrary(importPath);
    if (libAdapter) {
      return libAdapter;
    }

    // 1. Built-in React & UI Modules
    if (importPath === 'react' || importPath === 'react/jsx-runtime' || importPath === 'react/jsx-dev-runtime') {
      return {
        ...React,
        default: React,
        jsx: SafeCreateElement,
        jsxs: SafeCreateElement,
        jsxDEV: SafeCreateElement,
        createElement: SafeCreateElement
      };
    }
    if (importPath === 'lucide-react') {
      return LucideIcons;
    }

    if (importPath === 'framer-motion') {
      return FramerMotion;
    }
    if (importPath.includes('EditableWrappers') || importPath.includes('editable')) {
      return {
        EditableText,
        EditableImage,
        EditableList,
        EditableSection
      };
    }
    if (importPath.includes('templateBinder')) {
      return {
        DEFAULT_DESIGNER_PORTRAIT: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="none"><rect width="600" height="800" fill="%23FAF9F5"/><rect x="40" y="40" width="520" height="720" rx="32" fill="%23E5E2DA" opacity="0.4"/><circle cx="300" cy="320" r="140" fill="%23141414" opacity="0.85"/><path d="M120 720C120 540 200 480 300 480C400 480 480 540 480 720" fill="%23141414" opacity="0.85"/><circle cx="480" cy="180" r="16" fill="%23FF4D00"/><path d="M250 300Q300 340 350 300" stroke="%23FAF9F5" stroke-width="8" stroke-linecap="round"/></svg>`
      };
    }

    // ─── UNIVERSAL DATA BINDING ENGINE ───────────────────────────────────────────
    // Return the SHARED singletons — NOT new instances — so every module in the
    // uploaded template package shares the same React context object and
    // useContext(PortfolioContext) resolves correctly through PortfolioProvider.
    if (
      importPath.includes('PortfolioContext') ||
      importPath.includes('portfolioContext') ||
      importPath.includes('usePortfolio') ||
      importPath.includes('PortfolioProvider')
    ) {
      return sharedPortfolioContextModule;
    }

    // Intercept mockData / sampleData / demoData / defaultData / defaults — replace with live user data
    if (
      importPath.includes('mockData') ||
      importPath.includes('sampleData') ||
      importPath.includes('demoData') ||
      importPath.includes('defaultData') ||
      importPath.includes('initialData') ||
      importPath.includes('portfolioData') ||
      importPath.toLowerCase().includes('defaults')
    ) {
      console.log(`[CAMPUSCV DATA BINDING] Intercepted "${importPath}" — injecting live portfolio data`);
      return sharedMockDataModule;
    }
    // ─────────────────────────────────────────────────────────────────────────────


    if (importPath.startsWith('next/font')) {
      return new Proxy({}, {
        get: (_target, fontName: string) => {
          return (options?: any) => ({
            className: `font-${fontName.toLowerCase()}`,
            variable: `--font-${fontName.toLowerCase()}`,
            style: { fontFamily: 'system-ui, sans-serif' }
          });
        }
      });
    }
    if (importPath === 'next/link') {
      return {
        default: ({ href, children, className, onClick, ...props }: any) =>
          React.createElement('a', { href: href || '#', className, onClick, ...props }, children)
      };
    }
    if (importPath === 'next/image') {
      return {
        default: ({ src, alt, className, style, width, height, ...props }: any) =>
          React.createElement('img', { src: typeof src === 'string' ? src : (src?.src || ''), alt: alt || '', className, style: { width, height, ...style }, ...props })
      };
    }
    if (importPath === 'next/navigation' || importPath === 'next/router') {
      return {
        useRouter: () => ({ push: () => { }, replace: () => { }, back: () => { }, prefetch: () => { } }),
        usePathname: () => '/',
        useSearchParams: () => new URLSearchParams()
      };
    }

    // 2. CSS & CSS Module imports
    if (importPath.endsWith('.css') || importPath.endsWith('.scss')) {
      const resolvedKey = resolvePath(currentFile, importPath);
      const moduleMap = cssModuleMap[importPath] || cssModuleMap[resolvedKey] || cssModuleMap[resolvedKey.replace(/^\.\//, '')];
      if (moduleMap) {
        return moduleMap;
      }
      return new Proxy({}, {
        get: (_target, prop: string) => typeof prop === 'string' ? prop : ''
      });
    }

    // 3. Asset Files (Images, SVGs, Fonts)
    if (importPath.match(/\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf)$/i)) {
      const resolvedKey = resolvePath(currentFile, importPath);
      const assetMatch = findInFiles(sectionFiles, resolvedKey);
      if (assetMatch && assetMatch.code && (assetMatch.code.startsWith('data:') || assetMatch.code.startsWith('http'))) {
        return assetMatch.code;
      }
      return resolveTemplateAsset(templateId, resolvedKey || importPath, sectionFiles);
    }

    // 4. Resolve target file path inside uploaded package
    const resolvedKey = resolvePath(currentFile, importPath);
    if (moduleCache[resolvedKey] && !resolvedKey.toLowerCase().includes('defaults')) {
      return moduleCache[resolvedKey];
    }

    const fileMatch = findInFiles(sectionFiles, resolvedKey);
    const code = fileMatch ? fileMatch.code : (resolvedKey === 'index.tsx' || resolvedKey === 'index.ts' || resolvedKey === 'index.jsx' || resolvedKey === 'index' ? fallbackCode : null);

    if (!code) {
      const errorMsg = `Module not found: "${resolvedKey}" (imported by "${currentFile}"). Available package files: [${Object.keys(sectionFiles).join(', ')}]`;
      logs.push({ file: resolvedKey, status: 'error', message: `✗ ${errorMsg}` });
      throw new Error(errorMsg);
    }

    const actualKey = fileMatch ? fileMatch.key : resolvedKey;

    if (moduleCache[actualKey] && !actualKey.toLowerCase().includes('defaults')) {
      return moduleCache[actualKey];
    }

    // ── File-level interception for PortfolioContext and data files ────────────
    // Even if the file exists inside sectionFiles (compiled into the package),
    // we must intercept it and return live data — not the template's own demo context.
    if (
      actualKey.includes('PortfolioContext') ||
      actualKey.includes('portfolioContext') ||
      actualKey.includes('PortfolioProvider')
    ) {
      moduleCache[actualKey] = sharedPortfolioContextModule;
      return sharedPortfolioContextModule;
    }
    if (
      actualKey.includes('mockData') ||
      actualKey.includes('sampleData') ||
      actualKey.includes('demoData') ||
      actualKey.includes('defaultData') ||
      actualKey.includes('initialData') ||
      actualKey.includes('portfolioData') ||
      actualKey.toLowerCase().includes('defaults')
    ) {
      moduleCache[actualKey] = sharedMockDataModule;
      return sharedMockDataModule;
    }
    // ──────────────────────────────────────────────────────────────────────────

    if (visiting.has(actualKey)) {
      return moduleCache[actualKey] || {};
    }
    visiting.add(actualKey);

    // JSON file support with live portfolio data hydration
    if (actualKey.endsWith('.json')) {
      try {
        const jsonParsed = JSON.parse(code);
        if (activeData) {
          const heroTitle = activeData.hero?.title || activeData.name || jsonParsed.name;
          if (jsonParsed.name !== undefined) jsonParsed.name = heroTitle;
          if (jsonParsed.title !== undefined) jsonParsed.title = heroTitle;
          if (jsonParsed.institution !== undefined && activeData.university) jsonParsed.institution = activeData.university;
          if (jsonParsed.degree !== undefined && activeData.major) jsonParsed.degree = activeData.major;
          if (jsonParsed.developer !== undefined && typeof jsonParsed.developer === 'object') {
            jsonParsed.developer.name = heroTitle;
          }
          if (activeData.hero) jsonParsed.hero = { ...jsonParsed.hero, ...activeData.hero };
          if (activeData.about) jsonParsed.about = { ...jsonParsed.about, ...activeData.about };
          if (activeData.skills) jsonParsed.skills = activeData.skills;
          if (activeData.specialties) jsonParsed.specialties = activeData.specialties;
          if (activeData.projects) jsonParsed.projects = activeData.projects;
          if (activeData.timeline) jsonParsed.timeline = activeData.timeline;
          if (activeData.experience) jsonParsed.experience = activeData.experience;
          if (activeData.education) jsonParsed.education = activeData.education;
          if (activeData.contact) jsonParsed.contact = activeData.contact;
          if (activeData.collaborate) jsonParsed.collaborate = activeData.collaborate;
          if (activeData.socialLinks) jsonParsed.socialLinks = activeData.socialLinks;
        }
        const jsonExports = { default: jsonParsed, ...jsonParsed };
        visiting.delete(actualKey);
        logs.push({ file: actualKey, status: 'compiled', message: `✓ ${actualKey} parsed & hydrated` });
        return jsonExports;
      } catch (jsonErr: any) {
        visiting.delete(actualKey);
        throw new Error(`Failed to parse JSON file "${actualKey}": ${jsonErr.message}`);
      }
    }

    // 5. Transpile TSX / TS with Babel (preset-typescript, preset-react, preset-env)
    let jsCode = transpiledCache[actualKey];
    if (!jsCode) {
      const result = transpileTSX(Babel, code, actualKey);
      if (result.error) {
        logs.push({ file: actualKey, status: 'error', message: `✗ ${result.error}` });
        visiting.delete(actualKey);
        throw new Error(result.error);
      }
      jsCode = result.code;
      transpiledCache[actualKey] = jsCode;
      logs.push({ file: actualKey, status: 'compiled', message: `✓ ${actualKey} compiled` });
      console.log(`✓ ${actualKey} compiled`);
    }

    // Prepend React fallback import & hook proxies & scoped window/document bindings
    jsCode = `var window = window;\nvar document = document;\nvar globalThis = globalThis || window;\nvar self = window;\nvar IntersectionObserver = IntersectionObserver;\nvar MutationObserver = MutationObserver;\nvar ResizeObserver = ResizeObserver;\nvar requestAnimationFrame = requestAnimationFrame;\nvar cancelAnimationFrame = cancelAnimationFrame;\nvar getComputedStyle = getComputedStyle;\nvar setTimeout = setTimeout;\nvar clearTimeout = clearTimeout;\nvar setInterval = setInterval;\nvar clearInterval = clearInterval;\nvar React = React || require("react").default || require("react");\nvar useState = React.useState;\nvar useEffect = React.useEffect;\nvar useRef = React.useRef;\nvar useMemo = React.useMemo;\nvar useCallback = React.useCallback;\nvar useContext = React.useContext;\n` + jsCode;

    const moduleObj = { exports: {} };
    const exportsObj = moduleObj.exports;

    const _interopRequireDefault = (obj: any) => (obj && obj.__esModule ? obj : { default: obj });
    const localRequire = (p: string) => requireModule(p, actualKey);

    try {
      const runnerFn = new Function(
        'window',
        'document',
        'globalThis',
        'IntersectionObserver',
        'MutationObserver',
        'ResizeObserver',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'getComputedStyle',
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'React',
        'useState',
        'useEffect',
        'useRef',
        'useMemo',
        'useCallback',
        'useContext',
        'EditableText',
        'EditableImage',
        'EditableList',
        'EditableSection',
        'require',
        'exports',
        'module',
        '__require',
        '__exports',
        '_interopRequireDefault',
        'data',
        'props',
        jsCode
      );

      const safeRaf = scopedWin && typeof scopedWin.requestAnimationFrame === 'function'
        ? scopedWin.requestAnimationFrame.bind(scopedWin)
        : (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : (cb: Function) => setTimeout(cb, 16));
      const safeCancelRaf = scopedWin && typeof scopedWin.cancelAnimationFrame === 'function'
        ? scopedWin.cancelAnimationFrame.bind(scopedWin)
        : (typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : clearTimeout);
      const safeGetCompStyle = scopedWin && typeof scopedWin.getComputedStyle === 'function'
        ? scopedWin.getComputedStyle.bind(scopedWin)
        : (typeof getComputedStyle !== 'undefined' ? getComputedStyle : () => ({} as any));
      const safeTimeout = scopedWin && typeof scopedWin.setTimeout === 'function' ? scopedWin.setTimeout.bind(scopedWin) : setTimeout;
      const safeClearTimeout = scopedWin && typeof scopedWin.clearTimeout === 'function' ? scopedWin.clearTimeout.bind(scopedWin) : clearTimeout;
      const safeInterval = scopedWin && typeof scopedWin.setInterval === 'function' ? scopedWin.setInterval.bind(scopedWin) : setInterval;
      const safeClearInterval = scopedWin && typeof scopedWin.clearInterval === 'function' ? scopedWin.clearInterval.bind(scopedWin) : clearInterval;

      runnerFn(
        scopedWin,
        scopedDoc,
        scopedWin || (typeof globalThis !== 'undefined' ? globalThis : {}),
        (scopedWin as any)?.IntersectionObserver || (typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : undefined),
        (scopedWin as any)?.MutationObserver || (typeof MutationObserver !== 'undefined' ? MutationObserver : undefined),
        (scopedWin as any)?.ResizeObserver || (typeof ResizeObserver !== 'undefined' ? ResizeObserver : undefined),
        safeRaf,
        safeCancelRaf,
        safeGetCompStyle,
        safeTimeout,
        safeClearTimeout,
        safeInterval,
        safeClearInterval,
        React,
        useState,
        useEffect,
        React.useRef || (() => ({ current: null })),
        React.useMemo || ((fn: any) => fn()),
        React.useCallback || ((fn: any) => fn),
        React.useContext || (() => ({})),
        EditableText,
        EditableImage,
        EditableList,
        EditableSection,
        localRequire,
        exportsObj,
        moduleObj,
        localRequire,
        exportsObj,
        _interopRequireDefault,
        activeData || {},
        { data: activeData || {} }
      );

      const finalExports = (moduleObj.exports && (typeof moduleObj.exports === 'function' || Object.keys(moduleObj.exports).length > 0))
        ? moduleObj.exports
        : exportsObj;

      moduleCache[actualKey] = finalExports;
      moduleCache[resolvedKey] = finalExports;
      visiting.delete(actualKey);
      return finalExports;
      visiting.delete(actualKey);
      return finalExports;
    } catch (err: any) {
      visiting.delete(actualKey);
      const errMsg = `[Runtime Error in ${actualKey}]: ${err.message}`;
      console.error(errMsg, err);
      logs.push({ file: actualKey, status: 'error', message: `✗ ${errMsg}` });
      throw new Error(errMsg);
    }
  }

  // Pre-compile helper files if present
  const helperFiles = ['metadata.ts', 'defaults.ts', 'bindings.ts', 'styles.ts', 'schema.ts', 'theme.ts'];
  helperFiles.forEach((hf) => {
    const match = findInFiles(sectionFiles, hf);
    if (match && !moduleCache[match.key]) {
      try {
        requireModule(match.key, 'root');
      } catch (e) {
        console.warn(`Helper module ${hf} compilation notice:`, e);
      }
    }
  });

  // Read manifest.json / campuscv.json to resolve package entry point
  let manifestEntry = '';
  const manifestMatch = findInFiles(sectionFiles, 'manifest.json') || findInFiles(sectionFiles, 'campuscv.json');
  if (manifestMatch) {
    try {
      const parsed = JSON.parse(manifestMatch.code);
      const rawEntry = parsed.entry || parsed.main || parsed.template?.entry || '';
      if (rawEntry && rawEntry !== 'index.html') {
        manifestEntry = rawEntry;
      }
    } catch { }
  }

  const possibleEntries = [
    'src/index.jsx', 'src/index.tsx', 'src/index.js', 'src/index.ts',
    'src/template.jsx', 'src/template.tsx', 'src/template.js', 'src/template.ts',
    'src/App.jsx', 'src/App.tsx', 'src/App.js', 'src/App.ts',
    'src/Portfolio.jsx', 'src/Portfolio.tsx', 'src/Portfolio.js', 'src/Portfolio.ts',
    'src/app/page.tsx', 'src/app/page.jsx', 'app/page.tsx', 'app/page.jsx',
    'index.jsx', 'index.tsx', 'index.js', 'index.ts',
    'template.jsx', 'template.tsx', 'App.jsx', 'App.tsx', 'Portfolio.jsx', 'Portfolio.tsx',
    'src/main.tsx', 'src/main.jsx', 'main.tsx', 'main.jsx'
  ];

  const candidateKeys = Array.from(new Set([
    manifestEntry ? (findInFiles(sectionFiles, manifestEntry)?.key || manifestEntry) : null,
    ...possibleEntries.map(p => findInFiles(sectionFiles, p)?.key).filter(Boolean)
  ])).filter(Boolean).filter(k => typeof k === 'string' && !k.endsWith('.d.ts')) as string[];

  if (candidateKeys.length === 0) {
    const nonHelperKeys = Object.keys(sectionFiles).filter(k => {
      const baseName = k.split('/').pop()?.toLowerCase() || '';
      return !['schema.ts', 'schema.js', 'schema.json', 'bindings.ts', 'bindings.js', 'metadata.ts', 'metadata.js', 'defaults.ts', 'defaults.js', 'styles.ts', 'styles.js', 'types.ts', 'types.js'].includes(baseName) && !k.endsWith('.d.ts');
    });
    const firstCodeKey = nonHelperKeys.find(k => /\.(tsx|jsx|ts|js)$/i.test(k) && !k.endsWith('.d.ts')) || Object.keys(sectionFiles).find(k => /\.(tsx|jsx|ts|js)$/i.test(k) && !k.endsWith('.d.ts'));
    if (firstCodeKey) candidateKeys.push(firstCodeKey);
    else candidateKeys.push('src/index.jsx');
  }

  let finalExports: any = null;
  let entryKey = candidateKeys[0] || 'src/index.jsx';

  for (const candKey of candidateKeys) {
    if (!findInFiles(sectionFiles, candKey) || candKey.endsWith('.d.ts')) continue;
    try {
      const exp = requireModule(candKey, 'root');
      let comp = extractReactComponent(exp);
      if (comp) {
        // If candidate entry is a Next.js app page (page.tsx/jsx) and template contains root layout, wrap PageComponent inside RootLayout
        const isAppPage = candKey.includes('/page.') || candKey.startsWith('page.') || candKey.endsWith('app/page.tsx') || candKey.endsWith('app/page.jsx');
        const layoutMatch = isAppPage ? (findInFiles(sectionFiles, 'src/app/layout.tsx') || findInFiles(sectionFiles, 'src/app/layout.jsx') || findInFiles(sectionFiles, 'app/layout.tsx')) : null;
        if (layoutMatch && candKey !== layoutMatch.key) {
          try {
            const layoutExp = requireModule(layoutMatch.key, 'root');
            const LayoutComp = extractReactComponent(layoutExp);
            if (LayoutComp) {
              const InnerPageComp = comp;
              comp = function WrappedWithRootLayout(props: any) {
                return React.createElement(LayoutComp, props, React.createElement(InnerPageComp, props));
              };
            }
          } catch (lErr) { }
        }
        finalExports = { default: comp, ...exp };
        entryKey = candKey;
        break;
      } else if (!finalExports) {
        finalExports = exp;
        entryKey = candKey;
      }
    } catch (err: any) {
      console.warn(`[TEMPLATE] Candidate entry '${candKey}' execution notice:`, err?.message);
      logs.push({ file: candKey, status: 'error', message: `✗ [${candKey}]: ${err?.message || err}` });
    }
  }

  let manifestId = 'uploaded';
  if (sectionFiles['manifest.json']) {
    try {
      const parsed = JSON.parse(sectionFiles['manifest.json']);
      if (parsed?.id) manifestId = parsed.id;
    } catch (e) { }
  }
  console.log('[TEMPLATE] templateId:', manifestId);
  console.log('[TEMPLATE] entryKey resolved:', entryKey);

  if (finalExports) {
    logs.push({ file: entryKey, status: 'compiled', message: `✓ ${entryKey} compiled & executed` });
    logs.push({ file: 'system', status: 'compiled', message: '✓ Runtime execution successful' });
    console.log('[TEMPLATE] runtime execution successful for entry:', entryKey);
    return { exports: finalExports, entryKey, logs };
  }

  const detailedErrMsg = logs.find(l => l.status === 'error')?.message || `No executable code found in entry files: [${candidateKeys.join(', ')}]`;
  return { exports: null, entryKey, logs, error: detailedErrMsg };
}

// ----------------------------------------------------------------------
// Main UploadedTemplateRunner Component
// ----------------------------------------------------------------------

export default function UploadedTemplateRunner(props: UploadedTemplateRunnerProps) {
  const { data, activePage, isEditMode, onFieldChange, ...restProps } = props;

  const runnerInstanceId = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)
  ).current;

  const renderMode = props.renderMode || props.mode || (data as any)?.renderMode || (data as any)?.mode || (isEditMode ? 'editor' : 'preview');

  const userChosenTemplateId = props.templateId || data?.templateId || data?.layoutStyle || (data as any)?.template_id || '';

  const effectivePortfolio = {
    ...(data || {}),
    renderMode,
    mode: renderMode,
    templateId: userChosenTemplateId,
    templateVersionId: props.versionId || data?.templateVersionId,
    layoutStyle: userChosenTemplateId
  };

  const isUploaded = isUploadedPortfolio(effectivePortfolio);
  const templateId = getPortfolioTemplateId(effectivePortfolio) || userChosenTemplateId;

  useEffect(() => {
    console.log('[MOUNT]', {
      component: 'UploadedTemplateRunner',
      runtimeInstanceId: runnerInstanceId,
      renderMode,
      templateId,
      portfolioId: data?.id
    });
    return () => {
      console.log('[UNMOUNT]', {
        component: 'UploadedTemplateRunner',
        runtimeInstanceId: runnerInstanceId,
        renderMode,
        templateId,
        portfolioId: data?.id
      });
    };
  }, []);

  console.log("[MODE FLOW]", {
    component: "UploadedTemplateRunner",
    mode: renderMode,
    isEditMode: Boolean(isEditMode),
    portfolioId: data?.id,
    templateId
  });

  const [resolvedFiles, setResolvedFiles] = useState<ResolvedTemplateFiles>(() =>
    resolveTemplateFilesSync(effectivePortfolio)
  );
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(() =>
    isUploaded && Object.keys(resolveTemplateFilesSync(effectivePortfolio).sectionFiles).length === 0
  );

  const versionId = props.versionId || (data as any)?.templateVersionId || (data as any)?.versionId;
  const sectionFilesTemplateId = (data as any)?._sectionFilesTemplateId;

  useEffect(() => {
    let isCurrent = true;
    const currentSync = resolveTemplateFilesSync(effectivePortfolio);
    setResolvedFiles(currentSync);

    if (isUploaded) {
      setIsLoadingFiles(true);
      loadTemplateFilesAsync(effectivePortfolio).then((resolved) => {
        if (isCurrent) {
          setResolvedFiles(resolved);
          setIsLoadingFiles(false);
        }
      }).catch((err) => {
        if (isCurrent) {
          if (Object.keys(currentSync.sectionFiles).length === 0) {
            setResolvedFiles({
              templateId,
              isUploaded: true,
              sectionFiles: {},
              customCSS: '',
              templateCode: '',
              source: 'none',
              error: err.message || 'Failed to load template files'
            });
          }
          setIsLoadingFiles(false);
        }
      });
    } else {
      setIsLoadingFiles(false);
    }
    return () => { isCurrent = false; };
  }, [templateId, versionId, sectionFilesTemplateId, isUploaded]);

  const sectionFiles = resolvedFiles.sectionFiles;
  const customCSS = resolvedFiles.customCSS;
  const templateCode = resolvedFiles.templateCode;
  const sectionFilesKey = Object.keys(sectionFiles).sort().join(',');
  const hasPackage = Object.keys(sectionFiles).length > 0;

  const scopeHash = useMemo(() => {
    return templateId.replace(/[^a-zA-Z0-9]/g, '') || 'tpl';
  }, [templateId]);

  // Process and scope CSS & CSS Modules for the uploaded package
  const activeAssetMap = resolvedFiles.assetMap || (data as any)?.assetMap;
  const bundledStyles = useMemo(() => {
    return processTemplateStyles(sectionFiles, scopeHash, activeAssetMap, templateId);
  }, [sectionFilesKey, scopeHash, activeAssetMap, templateId]);

  // Combined CSS (Extracted customCSS + processed Global CSS + scoped CSS Modules)
  const fullCSS = useMemo(() => {
    return [customCSS, bundledStyles.combinedCSS].filter(Boolean).join('\n\n');
  }, [customCSS, bundledStyles.combinedCSS]);

  useEffect(() => {
    if (isUploaded && sectionFilesKey) {
      console.log(`[TEMPLATE CSS DIAGNOSTICS]\n` + JSON.stringify({
        templateId,
        cssFilesDiscovered: (bundledStyles.manifest?.globalStyles?.length || 0) + (bundledStyles.manifest?.componentStyles?.length || 0),
        cssFilesLoaded: (bundledStyles.manifest?.globalStyles?.length || 0) + (bundledStyles.manifest?.componentStyles?.length || 0),
        cssFilesFailed: 0,
        fontsDiscovered: (bundledStyles.manifest?.externalStyles?.length || 0),
        cssImports: (bundledStyles.manifest?.styleImports?.length || 0)
      }, null, 2));

      console.log(`[TEMPLATE TRACE]\n` + JSON.stringify({
        portfolioTemplateId: (data as any)?.templateId || (data as any)?.layoutStyle,
        rendererTemplateId: templateId,
        runtimeTemplateId: templateId,
        runnerTemplateId: templateId,
        resolvedTemplatePath: `data/templates/${templateId}/${versionId || 'current'}`,
        source: resolvedFiles.source,
        fileCount: Object.keys(sectionFiles).length,
        manifestId: (function () {
          try {
            return sectionFiles['manifest.json'] ? JSON.parse(sectionFiles['manifest.json']).id : 'NONE';
          } catch (e) { return 'PARSER_ERR'; }
        })(),
        fallbackUsed: false
      }, null, 2));
    }
  }, [templateId, sectionFilesKey, bundledStyles.manifest, isUploaded, versionId, resolvedFiles.source, sectionFiles, data]);

  // Universal active data prop matching portfolio schema via Canonical Profile Engine
  const normalizedData = useMemo(() => {
    if (!data) return data;
    return normalizePortfolio(data);
  }, [data]);

  // Keep a mutable ref of latest normalized data so template hooks access real-time state without re-compilation
  const latestDataRef = useRef(normalizedData);
  latestDataRef.current = normalizedData;

  // Execute uploaded package component tree
  const [rendered, setRendered] = useState<{ component: React.ComponentType<any> | null }>(() => {
    if (!hasPackage) return { component: null };
    const globalBabel = typeof window !== 'undefined' ? (window as any).Babel : null;
    if (globalBabel && hasPackage) {
      try {
        const targetDoc = innerWrapperRef.current?.ownerDocument || (typeof window !== 'undefined' ? (window as any).__CAMPUSCV_IFRAME_DOC__ || document : null);
        const pkgResult = executeUploadedPackage(globalBabel, sectionFiles, bundledStyles.cssModuleMap, templateCode, data, templateId, latestDataRef, targetDoc);
        if (!pkgResult.error && pkgResult.exports) {
          const Comp = extractReactComponent(pkgResult.exports);
          if (Comp) return { component: Comp as any };
        }
      } catch (err) { }
    }
    return { component: null };
  });
  const [compilationLogs, setCompilationLogs] = useState<CompilationLog[]>([]);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setRuntimeError(null);

    if (!hasPackage) {
      if (isMounted) setRendered({ component: null });
      return;
    }

    loadBabel().then((BabelModule) => {
      if (!isMounted || !BabelModule) return;
      const Babel = BabelModule.default || BabelModule;
      try {
        const targetDoc = innerWrapperRef.current?.ownerDocument || (typeof window !== 'undefined' ? (window as any).__CAMPUSCV_IFRAME_DOC__ || document : null);
        const pkgResult = executeUploadedPackage(Babel, sectionFiles, bundledStyles.cssModuleMap, templateCode, normalizedData, templateId, latestDataRef, targetDoc);
        if (isMounted) setCompilationLogs(pkgResult.logs);

        if (pkgResult.error) {
          if (isMounted) setRuntimeError(pkgResult.error);
          return;
        }

        const packageExports = pkgResult.exports;
        const Component = extractReactComponent(packageExports);



        if (!Component) {
          const exportKeys = packageExports && typeof packageExports === 'object' ? Object.keys(packageExports).join(', ') : typeof packageExports;
          const err = `Template exported no valid React component. Entry file '${pkgResult.entryKey}' exported keys: [${exportKeys}]. Ensure your entry file uses 'export default function Portfolio(props) { ... }'.`;
          if (isMounted) setRuntimeError(err);
          return;
        }

        if (typeof Component !== 'function' && !(typeof Component === 'object' && (Component as any).$$typeof)) {
          const err = `Invalid React component exported. Expected function or React component object, received ${typeof Component}.`;
          if (isMounted) setRuntimeError(err);
          return;
        }

        let schemaExports = packageExports?.editorSchema || packageExports?.schema;
        if (!schemaExports && sectionFiles) {
          const schemaKey = Object.keys(sectionFiles).find(k => /(?:^|\/)schema\.(ts|js|json)$/i.test(k));
          if (schemaKey && sectionFiles[schemaKey]) {
            try {
              if (schemaKey.endsWith('.json')) {
                schemaExports = JSON.parse(sectionFiles[schemaKey]);
              } else {
                const schemaResult = transpileTSX(Babel, sectionFiles[schemaKey], schemaKey);
                if (schemaResult.code) {
                  const schemaScope: any = { exports: {} };
                  const fn = new Function('exports', 'require', 'module', schemaResult.code);
                  fn(schemaScope.exports, () => ({}), schemaScope);
                  schemaExports = schemaScope.exports.editorSchema || schemaScope.exports.schema || schemaScope.exports.default;
                }
              }
            } catch (sErr) { }
          }
        }

        if (schemaExports && !Array.isArray(schemaExports) && typeof schemaExports === 'object') {
          schemaExports = (schemaExports as any).editorSchema || (schemaExports as any).schema || (schemaExports as any).default;
        }

        if (Array.isArray(schemaExports) && props.onSchemaLoaded) {
          props.onSchemaLoaded(schemaExports);
        }

        if (isMounted) {
          setRendered({ component: Component });
          if (typeof window !== 'undefined') {
            requestAnimationFrame(() => {
              window.dispatchEvent(new CustomEvent('campuscv:template-rendered'));
              if (window.parent && window.parent !== window) {
                window.parent.dispatchEvent(new CustomEvent('campuscv:template-rendered'));
              }
            });
          }
        }
      } catch (err: any) {
        console.error("Failed to execute uploaded template component:", err);
        if (isMounted) setRuntimeError(err.message || 'Template execution failure');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [templateId, sectionFilesKey, templateCode, hasPackage, isUploaded]);

  useEffect(() => {
    // Clean up any direct inline outlines on previously selected template DOM elements
    document.querySelectorAll('.canvas-selected-element, [data-node-selected], [style*="outline"]').forEach(el => {
      if ((el as HTMLElement).style?.outline) {
        (el as HTMLElement).style.outline = '';
      }
      el.classList.remove('canvas-selected-element');
      el.removeAttribute('data-node-selected');
    });
  }, [props.selectedElementId]);


  // Inject template bundled CSS directly into the iframe document's head <style> tag.
  // We must ONLY use innerWrapperRef.current?.ownerDocument — never fall back to the
  // parent window's document, which would silently inject into the wrong context.
  useEffect(() => {
    if (!fullCSS) return;
    // innerWrapperRef lives inside the iframe (via createPortal). Its ownerDocument
    // IS the iframe's document. If the ref isn't mounted yet, defer one rAF.
    const run = () => {
      const rootEl = innerWrapperRef.current;
      if (!rootEl) return; // Strictly refuse to use parent document as fallback
      const targetDoc = rootEl.ownerDocument;
      if (!targetDoc || !targetDoc.head) return;

      let styleTag = targetDoc.getElementById('template-bundled-css') as HTMLStyleElement;
      if (!styleTag) {
        styleTag = targetDoc.createElement('style');
        styleTag.id = 'template-bundled-css';
        targetDoc.head.appendChild(styleTag);
      }
      styleTag.textContent = fullCSS;

      if (typeof window !== 'undefined') {
        console.log('[TEMPLATE CSS INJECTED]', {
          templateId,
          fullCSSLength: fullCSS.length,
          styleSheetsCount: targetDoc.styleSheets.length,
          rulesCount: styleTag.sheet ? styleTag.sheet.cssRules.length : 0,
          headInnerHTML: targetDoc.head.innerHTML.slice(0, 300)
        });
      }
    };
    const rafId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafId);
  }, [fullCSS, templateId, sectionFilesKey]);

  const { selectedNode, setSelectedNode, setInspectorMode } = useEditorContext();

  // Always keep the ref in sync with the latest data so the MutationObserver
  // closure never reads a stale portfolio snapshot (fixes undo/redo/delete UI bug).
  const dataRef = useRef<any>(data);
  dataRef.current = data;

  // Direct ref to the inner wrapper where the template sections actually live.
  // More reliable than getElementById since it's a direct React ref.
  const innerWrapperRef = useRef<HTMLDivElement | null>(null);

  // Helper: get the best available root element for override targeting.
  // ONLY uses the direct ref — never queries the parent window document,
  // which would return wrong elements when rendered inside an iframe.
  const getOverrideRoot = (): HTMLElement | null => {
    return innerWrapperRef.current || null;
  };

  // ── DOCUMENT HEAD CSS INJECTION EFFECT ──────────────────────────────────
  // Appends fullCSS directly to the IFRAME document.head as the LAST style element.
  // Under CSS Cascade specs, appearing last in head guarantees template CSS overrides
  // Tailwind Preflight resets (h1, h2, img, p) and global application styles 100%.
  useEffect(() => {
    if ((!fullCSS && !bundledStyles.combinedCSS) || typeof document === 'undefined') return;

    const run = () => {
      // getOverrideRoot() may query the wrong document; use the ref directly.
      const rootEl = innerWrapperRef.current;
      if (!rootEl) return; // Do NOT fall back to parent document
      const doc = rootEl.ownerDocument;
      if (!doc || !doc.head) return;

      const styleId = `template-css-head-${templateId}`;
      let existingStyle = doc.getElementById(styleId) as HTMLStyleElement | null;

      if (!existingStyle) {
        existingStyle = doc.createElement('style');
        existingStyle.id = styleId;
        existingStyle.setAttribute('data-template-css', templateId);
        existingStyle.setAttribute('data-campuscv-head-css', 'true');
        doc.head.appendChild(existingStyle);
      }

      existingStyle.textContent = fullCSS || bundledStyles.combinedCSS;
    };
    const rafId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafId);
  }, [fullCSS, bundledStyles.combinedCSS, templateId]);

  // ── TEMPLATE INIT EFFECT ─────────────────────────────────────────────────
  // Runs ONLY when the rendered component changes (template remounted).
  // Performs full DOM reset + node ID discovery + observer attachment + scroll to top.
  // Must NOT run on every data change — that would flash hidden elements visible.
  useEffect(() => {
    // Wait one rAF so the template component has fully painted its DOM
    const rafId = requestAnimationFrame(() => {
      // Always scroll outer editor container to top when template renders
      const scrollEl = document.querySelector('[data-canvas="true"]')?.parentElement?.parentElement as HTMLElement | null;
      if (scrollEl && scrollEl.scrollTop > 0) {
        scrollEl.scrollTop = 0;
      }

      const rootEl = getOverrideRoot();
      if (!rootEl) return;
      const tId = getPortfolioTemplateId(dataRef.current);

      // Full clean-slate: strip stale node IDs/deleted flags, then re-discover
      resetDOMNodeAttributes(rootEl);
      discoverEditableNodes(rootEl, tId);

      // Apply initial overrides immediately after discovery
      applyPortfolioOverrides(rootEl, { ...dataRef.current, renderMode, mode: renderMode });
    });

    // Attach observer after a short delay so it doesn't fire during initial paint (editor mode only)
    let timerId: ReturnType<typeof setTimeout> | null = null;
    if (isEditMode) {
      timerId = setTimeout(() => {
        const rootEl = getOverrideRoot();
        if (!rootEl) return;
        const tId = getPortfolioTemplateId(dataRef.current);
        attachNodeOverrideObserver(rootEl, () => ({ ...dataRef.current, renderMode, mode: renderMode }), tId);
      }, 100);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
    };
  }, [rendered]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── STICKY HEADER & INTERACTIVE RUNTIME EFFECT ──────────────────────────
  useEffect(() => {
    const rootEl = getOverrideRoot();
    if (!rootEl) return;

    // React-based templates manage their own JSX layout, sticky headers, and events natively.
    // HTML-template sticky header rewrites, scroll proxies, and script runners must be bypassed for React templates.
    const isReactComponent = Boolean(
      rendered ||
      sectionFiles['src/template.tsx'] ||
      sectionFiles['src/template.jsx'] ||
      sectionFiles['template.tsx'] ||
      sectionFiles['template.jsx'] ||
      sectionFiles['src/App.tsx'] ||
      sectionFiles['src/App.jsx'] ||
      sectionFiles['App.tsx'] ||
      sectionFiles['App.jsx']
    );

    if (isReactComponent) {
      return;
    }

    const doc = rootEl.ownerDocument || document;

    let manifestObj: any = null;
    try {
      if (sectionFiles['manifest.json']) {
        manifestObj = JSON.parse(sectionFiles['manifest.json']);
      }
    } catch (e) { }

    const normManifest = normalizeManifest(manifestObj || resolvedFiles.manifest || (data as any)?.manifest);
    const headerConfig = normManifest.header || { enabled: true, sticky: true, top: 0, zIndex: 100 };

    console.log(`[TEMPLATE RUNTIME] Initializing interactive runtime for "${templateId}" | JS: ${normManifest.runtime?.javascript !== false} | Animations: ${normManifest.runtime?.animations !== false}`);

    // 1. Sticky Header Normalization
    const cleanupSticky = attachStickyHeaderNormalizer(doc, rootEl, headerConfig);

    // 2. Scroll & IntersectionObserver Normalization Proxy
    const cleanupScrollProxy = attachTemplateScrollProxy(doc, rootEl);

    // 3. Static JavaScript & Synthetic Lifecycle Execution Engine
    let scriptCleanup = () => { };
    if (normManifest.runtime?.javascript !== false) {
      const scriptResult = executeTemplateScripts(doc, rootEl, sectionFiles);
      scriptCleanup = scriptResult.cleanup;
      if (scriptResult.executedCount > 0) {
        console.log(`[TEMPLATE RUNTIME] Executed ${scriptResult.executedCount} template script(s): [${scriptResult.scriptNames.join(', ')}]`);
      }
    }

    return () => {
      cleanupSticky();
      cleanupScrollProxy();
      scriptCleanup();
    };
  }, [rendered, templateId, sectionFilesKey]);

  // ── DATA SYNC EFFECT ──────────────────────────────────────────────────────
  // Runs on EVERY data change (undo, redo, delete, field edit).
  // Applies overrides in a rAF so they run AFTER React finishes reconciling the DOM.
  // This prevents React's reconciliation from wiping our manually applied display:none.
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const rootEl = getOverrideRoot();
      if (!rootEl) return;
      applyPortfolioOverrides(rootEl, { ...data, renderMode, mode: renderMode });
    });
    return () => cancelAnimationFrame(rafId);
  }, [data, renderMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTouchScrollingRef = useRef(false);
  const lastTouchScrollTimeRef = useRef(0);

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      isTouchScrollingRef.current = false;
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartPosRef.current && e.touches.length > 0) {
      const dx = e.touches[0].clientX - touchStartPosRef.current.x;
      const dy = e.touches[0].clientY - touchStartPosRef.current.y;
      if (Math.hypot(dx, dy) > 8) {
        isTouchScrollingRef.current = true;
        lastTouchScrollTimeRef.current = Date.now();
      }
    }
  };

  const handleCanvasTouchEnd = () => {
    if (isTouchScrollingRef.current) {
      lastTouchScrollTimeRef.current = Date.now();
    }
    setTimeout(() => {
      isTouchScrollingRef.current = false;
    }, 250);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
    if (!props.isEditMode) return;

    const target = e.target as HTMLElement;
    if (!target) return;

    if (typeof window !== 'undefined') {
      const doc = target.ownerDocument || document;
      const hit = doc.elementFromPoint ? doc.elementFromPoint(e.clientX, e.clientY) : target;
      console.log('[CANVAS CLICK]', {
        target: target,
        tagName: target?.tagName,
        text: target?.textContent?.slice(0, 100),
        nodeId: target?.getAttribute?.('data-node-id'),
        contentEditable: target?.getAttribute?.('contenteditable'),
        pointerEvents: window.getComputedStyle(target).pointerEvents
      });
      console.log('[CANVAS HIT TEST]', {
        hit: hit,
        tagName: hit?.tagName,
        className: hit?.className,
        text: hit?.textContent?.slice(0, 100)
      });
    }

    // Clear previous selected element attribute without full-DOM style mutation
    const docToClear = target.ownerDocument || document;
    const prevSelected = docToClear.querySelector('[data-node-selected="true"], .canvas-selected-element');
    if (prevSelected) {
      prevSelected.removeAttribute('data-node-selected');
      prevSelected.classList.remove('canvas-selected-element');
    }

    let nodeEl: HTMLElement | null = target.hasAttribute('data-node-id') ? target : (target.closest('[data-node-id]') as HTMLElement | null);
    let targetEl: HTMLElement = nodeEl || target;
    const explicitNodeId = targetEl.getAttribute('data-node-id') || target.getAttribute('data-node-id') || '';
    let type: any = 'text';

    if (explicitNodeId.startsWith('container:') || explicitNodeId.startsWith('card:') || explicitNodeId.startsWith('section:')) {
      type = 'container';
      targetEl = target.hasAttribute('data-node-id') ? target : targetEl;
    } else if (explicitNodeId.startsWith('image:') || target.tagName === 'IMG') {
      type = 'image';
      targetEl = target;
    } else if (explicitNodeId.startsWith('button:') || target.tagName === 'A' || target.tagName === 'BUTTON') {
      type = target.tagName === 'A' ? 'link' : 'button';
      targetEl = target;
    } else {
      const textCandidate = target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, li, b, strong, i, em, time, label') as HTMLElement | null;
      if (textCandidate && !explicitNodeId.startsWith('container:')) {
        type = (textCandidate.tagName === 'A') ? 'link' : (textCandidate.tagName === 'BUTTON' ? 'button' : 'text');
        targetEl = textCandidate;
      } else if (['DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER'].includes(target.tagName) && target.innerText && target.innerText.trim().length > 0) {
        type = 'text';
        targetEl = target;
      }
    }

    if (targetEl) {
      e.preventDefault();
      e.stopPropagation();

      const tag = targetEl.tagName.toLowerCase();
      const style = window.getComputedStyle(targetEl);
      const val = targetEl.innerText ? targetEl.innerText.trim() : '';

      const secId = detectNodeSectionId(targetEl);
      const containerCtx = detectContainerContext(targetEl);
      const cKey = containerCtx.containerKey || 'root';
      const cIdx = containerCtx.containerIndex !== undefined ? containerCtx.containerIndex : 0;

      const finalNodeId = explicitNodeId || targetEl.getAttribute('data-node-id') || `${type}:${secId}:${cKey}:${tag}:0`;

      const colCtx = detectCollectionContext(targetEl);
      const colIndex = colCtx.collectionIndex !== undefined ? colCtx.collectionIndex : cIdx;
      const colName = colCtx.collection || (secId === 'projects' ? 'projects' : (secId === 'experience' ? 'experience' : (secId === 'skills' ? 'skills' : (secId === 'education' ? 'education' : undefined))));
      const colItemId = colCtx.itemId || (colName ? `${colName}-${colIndex + 1}` : undefined);
      const colField = colCtx.field || (type === 'image' ? 'image' : (tag === 'a' ? 'link' : undefined));

      const currentNode: EditableNode = {
        nodeId: finalNodeId,
        type,
        tag,
        sectionId: secId,
        containerKey: cKey,
        index: colIndex,
        collection: colName,
        itemId: colItemId,
        collectionIndex: colIndex,
        field: colField,
        currentValue: val,
        currentSrc: tag === 'img' ? (targetEl as HTMLImageElement).src : undefined,
        currentHref: tag === 'a' ? (targetEl as HTMLAnchorElement).href : undefined,
        currentStyles: {
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          fontFamily: style.fontFamily,
          textAlign: style.textAlign,
          borderRadius: style.borderRadius,
        },
        el: targetEl
      };

      console.log(`[NODE SELECTED] nodeId: ${finalNodeId} | collection: ${colName || 'none'} | itemId: ${colItemId || 'none'} | index: ${colIndex} | type: ${type} | tag: ${tag} | currentValue: "${val}"`);
      setSelectedNode(currentNode);
      setInspectorMode('universal_node');
      targetEl.setAttribute('data-node-selected', 'true');
      return;
    }

    const editKeyEl = target.closest('[data-edit-key]') as HTMLElement | null;
    if (editKeyEl) {
      const editKey = editKeyEl.getAttribute('data-edit-key');
      if (editKey) {
        e.stopPropagation();
        props.setSelectedElementId?.(editKey);
        return;
      }
    }

    let current: HTMLElement | null = target;
    while (current && current !== e.currentTarget) {
      if (current.id) {
        const id = current.id.toLowerCase();
        if (id.includes('name') || id.includes('intro')) {
          e.stopPropagation();
          props.setSelectedElementId?.('profile.name');
          return;
        }
        if (id.includes('tagline') || id.includes('headline') || id.includes('role')) {
          e.stopPropagation();
          props.setSelectedElementId?.('profile.headline');
          return;
        }
        if (id.includes('about') || id.includes('bio')) {
          e.stopPropagation();
          props.setSelectedElementId?.('profile.about');
          return;
        }
        if (id.includes('avatar') || id.includes('profile')) {
          e.stopPropagation();
          props.setSelectedElementId?.('profile.photo');
          return;
        }
        if (id.includes('github')) {
          e.stopPropagation();
          props.setSelectedElementId?.('social.github');
          return;
        }
        if (id.includes('linkedin')) {
          e.stopPropagation();
          props.setSelectedElementId?.('social.linkedin');
          return;
        }
        if (id.includes('twitter') || id.includes('x-link')) {
          e.stopPropagation();
          props.setSelectedElementId?.('social.twitter');
          return;
        }
        if (id.includes('mail') || id.includes('email')) {
          e.stopPropagation();
          props.setSelectedElementId?.('social.email');
          return;
        }

        const projMatch = id.match(/(?:proj|project)[-_]?(\d+)/);
        if (projMatch) {
          e.stopPropagation();
          props.setSelectedElementId?.(`projects[${projMatch[1]}].title`);
          return;
        }

        const expMatch = id.match(/(?:exp|timeline|experience)[-_]?(\d+)/);
        if (expMatch) {
          e.stopPropagation();
          props.setSelectedElementId?.(`experience[${expMatch[1]}].title`);
          return;
        }
      }
      current = current.parentElement;
    }

    const anchor = target.closest('a');
    if (anchor) {
      const href = (anchor.getAttribute('href') || '').toLowerCase();
      if (href.includes('github')) {
        e.stopPropagation();
        props.setSelectedElementId?.('social.github');
        return;
      }
      if (href.includes('linkedin')) {
        e.stopPropagation();
        props.setSelectedElementId?.('social.linkedin');
        return;
      }
      if (href.includes('twitter') || href.includes('x.com')) {
        e.stopPropagation();
        props.setSelectedElementId?.('social.twitter');
        return;
      }
      if (href.includes('mailto:')) {
        e.stopPropagation();
        props.setSelectedElementId?.('social.email');
        return;
      }
    }

    const section = target.closest('section');
    const sectionId = section?.id?.toLowerCase() || '';

    if (sectionId.includes('home') || sectionId.includes('hero') || sectionId.includes('profile') || sectionId.includes('about')) {
      if (target.tagName === 'H1' || target.tagName === 'H2') {
        e.stopPropagation();
        props.setSelectedElementId?.('profile.name');
        return;
      }
      if (target.tagName === 'H3' || target.tagName === 'H4') {
        e.stopPropagation();
        props.setSelectedElementId?.('profile.headline');
        return;
      }
      if (target.tagName === 'P') {
        e.stopPropagation();
        props.setSelectedElementId?.('profile.about');
        return;
      }
      if (target.tagName === 'IMG') {
        e.stopPropagation();
      }
    }
  };

  const triggerImageUpload = (editKey: string, nodeId?: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const isAvatar = !nodeId || nodeId.includes('avatar') || nodeId.includes('profile') || nodeId.includes('portrait') || nodeId.includes('hero') || nodeId.includes('about') || editKey.includes('avatar') || editKey.includes('profile') || editKey.includes('photo');
        const targetCategory = isAvatar ? 'avatar' : (nodeId?.includes('project') || editKey.includes('project') ? 'projects' : (nodeId?.includes('banner') || nodeId?.includes('bg') ? 'banners' : 'general'));

        handleImageUpload(
          file,
          (blobUrl) => {
            if (props.onFieldChange) {
              if (nodeId) {
                props.onFieldChange(`contentOverrides.${nodeId}`, { type: 'image', src: blobUrl });
                props.onFieldChange(`imageOverrides.${nodeId}`, blobUrl);
              }
              if (editKey) {
                props.onFieldChange(editKey, blobUrl);
              }
              if (isAvatar) {
                props.onFieldChange('profileImage', blobUrl);
                props.onFieldChange('avatarUrl', blobUrl);
                props.onFieldChange('personal.profilePhoto', blobUrl);
                props.onFieldChange('personal.avatarUrl', blobUrl);
                props.onFieldChange('profile.photo', blobUrl);
                props.onFieldChange('profile.avatarUrl', blobUrl);
                props.onFieldChange('hero.avatarUrl', blobUrl);
                props.onFieldChange('about.avatarUrl', blobUrl);
              }
            }
          },
          (finalUrl) => {
            if (finalUrl && props.onFieldChange) {
              if (nodeId) {
                console.log(`[IMAGE OVERRIDE PERMANENT] nodeId: ${nodeId} | url: ${finalUrl}`);
                props.onFieldChange(`contentOverrides.${nodeId}`, { type: 'image', src: finalUrl });
                props.onFieldChange(`imageOverrides.${nodeId}`, finalUrl);
              }
              if (editKey) {
                props.onFieldChange(editKey, finalUrl);
              }
              if (isAvatar) {
                props.onFieldChange('profileImage', finalUrl);
                props.onFieldChange('avatarUrl', finalUrl);
                props.onFieldChange('personal.profilePhoto', finalUrl);
                props.onFieldChange('personal.avatarUrl', finalUrl);
                props.onFieldChange('profile.photo', finalUrl);
                props.onFieldChange('profile.avatarUrl', finalUrl);
                props.onFieldChange('hero.avatarUrl', finalUrl);
                props.onFieldChange('about.avatarUrl', finalUrl);
              }
            }
          },
          {
            username: props.data?.username || props.data?.meta?.slug,
            category: targetCategory
          }
        );
      }
    };
    input.click();
  };

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!props.isEditMode) return;

    const target = e.target as HTMLElement;
    if (!target) return;

    const action = handleUniversalDoubleClick(target);

    if (action.type === 'IMAGE_CONTROLS') {
      const nodeEl = target.closest('[data-node-id]') as HTMLElement | null;
      const targetNodeId = target.getAttribute('data-node-id') || nodeEl?.getAttribute('data-node-id') || undefined;

      let editKey = 'profile.photo';
      const cvAttr = target.getAttribute('data-cv') || target.closest('[data-cv]')?.getAttribute('data-cv');
      const editKeyEl = target.closest('[data-edit-key], [data-field]') as HTMLElement | null;

      if (cvAttr) {
        if (cvAttr.includes('[]')) {
          const parentItem = target.closest('[data-cv*="["]') as HTMLElement | null;
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
      } else if (target.closest('#hero, [data-cv-section="hero"]')) {
        editKey = 'hero.avatarUrl';
      } else if (target.closest('#about, [data-cv-section="about"]')) {
        editKey = 'about.avatarUrl';
      }

      e.preventDefault();
      e.stopPropagation();
      triggerImageUpload(editKey, targetNodeId);
      return;
    }

    if (action.type === 'SELECT_ONLY' || !action.isContentEditable) {
      // Containers, cards, grids, sections -> READ-ONLY selection, ZERO DOM mutation!
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Leaf text tags only — enter inline text edit for target leaf node
    const nodeEl = target.closest('[data-node-id]') as HTMLElement | null;
    const editKeyEl = target.closest('[data-edit-key], [data-field], [data-editable]') as HTMLElement | null;

    const targetNodeId = target.getAttribute('data-node-id') || nodeEl?.getAttribute('data-node-id');
    let editKey = editKeyEl?.getAttribute('data-edit-key') || editKeyEl?.getAttribute('data-field') || editKeyEl?.getAttribute('data-editable') || null;

    const activeEl = target;
    e.preventDefault();
    e.stopPropagation();

    activeEl.contentEditable = "true";
    activeEl.setAttribute('suppressContentEditableWarning', 'true');
    activeEl.style.outline = '2px dashed #7C3AED';
    activeEl.style.outlineOffset = '2px';
    activeEl.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
    activeEl.focus();

    try {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(activeEl);
      range.collapse(false);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (err) { }

    const handleInput = () => {
      const newText = activeEl.innerText ? activeEl.innerText.trim() : '';
      if (targetNodeId && selectedNode) {
        setSelectedNode({ ...selectedNode, currentValue: newText });
      }
    };

    const handleKeyDown = (ke: KeyboardEvent) => {
      if (ke.key === 'Escape') {
        ke.preventDefault();
        activeEl.blur();
      } else if (ke.key === 'Enter' && !['P', 'TEXTAREA'].includes(activeEl.tagName)) {
        ke.preventDefault();
        activeEl.blur();
      }
    };

    const handleBlur = () => {
      activeEl.contentEditable = "false";
      activeEl.style.outline = '';
      activeEl.style.backgroundColor = '';
      activeEl.removeEventListener('input', handleInput);
      activeEl.removeEventListener('blur', handleBlur);
      activeEl.removeEventListener('keydown', handleKeyDown);

      const finalVal = activeEl.innerText ? activeEl.innerText.trim() : '';
      if (targetNodeId && props.onFieldChange) {
        // Atomic write — single state mutation, single undo entry
        props.onFieldChange(`contentOverrides.${targetNodeId}`, { type: 'text', value: finalVal });
      } else if (editKey && props.onFieldChange) {
        props.onFieldChange(editKey, finalVal);
      }
    };

    activeEl.addEventListener('input', handleInput);
    activeEl.addEventListener('blur', handleBlur);
    activeEl.addEventListener('keydown', handleKeyDown);
  };

  // Clean data-field visibility sync
  useEffect(() => {
    const deletedList = (data as any)?.deletedFields;
    if (!Array.isArray(deletedList) || deletedList.length === 0) return;
    // Use the iframe's ownerDocument so we query inside the correct document
    const root = innerWrapperRef.current;
    const searchDoc = root ? root.ownerDocument : null;
    if (!searchDoc) return;

    deletedList.forEach((fieldKey: string) => {
      const targetEl = searchDoc.querySelector(`[data-field="${fieldKey}"], [data-editable="${fieldKey}"]`) as HTMLElement;
      if (targetEl) targetEl.style.display = 'none';
    });
  }, [data]);

  const collectionHash = useMemo(() => {
    const d = data as any;
    if (!d) return 'empty';
    const imgHash = (d.profileImage || d.avatarUrl || d.about?.avatarUrl || '').slice(-24);
    const lastUpd = d._lastUpdated || 0;
    const pCount = (d.projects || []).length;
    const pKeys = (d.projects || []).map((x: any) => `${x.id || x.title}:${(x.image || '').slice(-12)}`).join('|');
    const tCount = (d.timeline || d.experience || []).length;
    const tKeys = (d.timeline || d.experience || []).map((x: any) => x.id || x.title).join('|');
    const sCount = (d.skills || []).length;
    const sKeys = (d.skills || []).map((x: any) => typeof x === 'string' ? x : (x.name || x.title)).join('|');
    const cCount = (d.certifications || []).length;
    return `${imgHash}_${lastUpd}_${pCount}:${pKeys}_${tCount}:${tKeys}_${sCount}:${sKeys}_${cCount}`;
  }, [data]);

  const normalizedActivePage = useMemo(() => {
    if (!activePage) return 'Home';
    const lower = activePage.toLowerCase().trim();
    if (lower.includes('about')) return 'About';
    if (lower.includes('hero') || lower.includes('home') || lower.includes('intro')) return 'Home';
    if (lower.includes('project')) return 'Projects';
    if (lower.includes('skill')) return 'Skills';
    if (lower.includes('exp') || lower.includes('work') || lower.includes('timeline')) return 'Experience';
    if (lower.includes('cert')) return 'Certifications';
    if (lower.includes('contact')) return 'Contact';
    return activePage;
  }, [activePage]);

  const dObj = data as any;
  const currentImgSrc = normalizedData?.profileImage || normalizedData?.avatarUrl || normalizedData?.about?.avatarUrl || normalizedData?.hero?.avatarUrl || '';



  // Default to light — only apply the `dark` class when the user has explicitly
  // toggled dark mode on. The old `!== false` check defaulted to dark for every
  // admin preview, making Tailwind CDN dark-mode cascade through all template elements.
  const isDark = dObj?.isDarkMode === true;
  const primaryColor = dObj?.theme?.primaryColor || dObj?.themeColor || '#8b5cf6';
  const secondaryColor = dObj?.theme?.secondaryColor || '#06b6d4';
  const backgroundColor = dObj?.theme?.backgroundColor || (isDark ? '#0f0f11' : '#f8fafc');
  const textColor = dObj?.theme?.textColor || (isDark ? '#f4f4f5' : '#0f172a');

  const fontFamily = dObj?.typography?.fontFamily || dObj?.fontPack || 'Inter, sans-serif';
  const fontSize = `${dObj?.typography?.fontSize || dObj?.baseFontSize || 16}px`;

  const btnBg = dObj?.button?.primary?.background || dObj?.btnBg || primaryColor;
  const btnTextColor = dObj?.button?.primary?.textColor || dObj?.btnTextColor || '#ffffff';
  const btnRadius = dObj?.button?.primary?.radius || dObj?.btnRadius || '12px';

  const fontGoogleName = useMemo(() => {
    if (fontFamily.includes('Playfair')) return 'Playfair+Display:ital,wght@0,400..800;1,400..800';
    if (fontFamily.includes('Fira Code')) return 'Fira+Code:wght@400..700';
    if (fontFamily.includes('Outfit')) return 'Outfit:wght@400..800';
    if (fontFamily.includes('Roboto')) return 'Roboto:wght@400..700';
    if (fontFamily.includes('Poppins')) return 'Poppins:wght@400..800';
    if (fontFamily.includes('Plus Jakarta')) return 'Plus+Jakarta+Sans:wght@400..800';
    return 'Inter:wght@400..800';
  }, [fontFamily]);

  const extractedFontLinks = useMemo(() => {
    const set = new Set<string>();
    set.add('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Syne:wght@400..800&family=Space+Grotesk:wght@500;700&display=swap');

    if (Array.isArray(dObj?.fontLinks)) {
      dObj.fontLinks.forEach((f: string) => set.add(f));
    }
    Object.values(sectionFiles || {}).forEach((content) => {
      const matches = content.match(/https:\/\/fonts\.googleapis\.com\/css2?[^"'\s>)]+/gi);
      if (matches) {
        matches.forEach(url => set.add(url.replace(/&amp;/g, '&')));
      }
    });
    return Array.from(set);
  }, [dObj?.fontLinks, sectionFilesKey]);

  const hasExplicitFont = Boolean(dObj?.typography?.fontFamily || (dObj?.fontPack && dObj.fontPack !== 'sans' && dObj.fontPack !== 'default'));
  const dynamicThemeCSS = useMemo(() => {
    if (isUploaded && !hasExplicitFont) return '';
    return `
      .uploaded-template-runner {
        --font-sans: ${fontFamily};
      }
    `;
  }, [fontFamily, hasExplicitFont, isUploaded]);

  // NOTE: Tailwind CDN is now loaded directly inside the iframe <head> by IsolatedTemplateIframe.tsx.
  // Do NOT inject it again here — that would add it to the parent window document, not the iframe.

  useEffect(() => {
    const run = () => {
      const targetDoc = innerWrapperRef.current?.ownerDocument || null;
      if (!targetDoc) return;

      const hasUserAccent = Boolean(dObj?.userSelectedAccent || dObj?.theme?.primaryColor || dObj?.themeColor || dObj?.accentColor);
      const hasUserFont = Boolean(dObj?.userSelectedFont || dObj?.typography?.fontFamily || (dObj?.fontPack && dObj.fontPack !== 'sans' && dObj.fontPack !== 'default'));
      const hasUserFontSize = Boolean(dObj?.userSelectedFontSize || dObj?.typography?.fontSize || (dObj?.baseFontSize && Number(dObj.baseFontSize) !== 16));

      if (!hasUserAccent && !hasUserFont && !hasUserFontSize) {
        const existingTag = targetDoc.querySelector('style[data-campuscv-design-overrides="true"]');
        if (existingTag) existingTag.remove();
        return;
      }

      const rawColor = dObj?.userSelectedAccent || dObj?.theme?.primaryColor || dObj?.themeColor || dObj?.accentColor || '#8b5cf6';
      const accentHex = rawColor.startsWith('#') || rawColor.startsWith('rgb') || rawColor.startsWith('hsl')
        ? rawColor
        : '#8b5cf6';

      const fontPackVal = dObj?.userSelectedFont || dObj?.typography?.fontFamily || dObj?.fontPack || 'Inter, sans-serif';
      const fontSizeVal = parseInt(String(dObj?.userSelectedFontSize || dObj?.typography?.fontSize || dObj?.baseFontSize || 16), 10) || 16;

      // Dynamically load Google Font in target document if needed
      if (hasUserFont && fontPackVal) {
        const fontUrl = getGoogleFontUrl(fontPackVal);
        if (fontUrl) {
          let linkTag = targetDoc.querySelector(`link[data-campuscv-dynamic-font="true"]`) as HTMLLinkElement | null;
          if (!linkTag) {
            linkTag = targetDoc.createElement('link');
            linkTag.rel = 'stylesheet';
            linkTag.setAttribute('data-campuscv-dynamic-font', 'true');
            targetDoc.head.appendChild(linkTag);
          }
          if (linkTag.href !== fontUrl) {
            linkTag.href = fontUrl;
          }
        }
      }

      const fontCSS = hasUserFont ? `
        :root, .uploaded-template-runner, body, html {
          --campuscv-font-family: ${fontPackVal};
          --font-body: ${fontPackVal};
          --font-display: ${fontPackVal};
          --font-sans: ${fontPackVal};
          font-family: ${fontPackVal} !important;
        }
        h1, h2, h3, h4, h5, h6, .font-heading, .font-display, [class*="font-heading"], [class*="font-display"] {
          --campuscv-font-heading: ${fontPackVal};
          font-family: ${fontPackVal} !important;
        }
      ` : '';

      const fontSizeCSS = hasUserFontSize ? `
        :root, .uploaded-template-runner, body, html {
          --campuscv-base-font-size: ${fontSizeVal}px;
        }
        html {
          font-size: ${fontSizeVal}px !important;
        }
      ` : '';

      const cleanHex = String(accentHex || '#8b5cf6').trim().replace('#', '');
      let hex = cleanHex;
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const r = parseInt(hex.substring(0, 2), 16) || 139;
      const g = parseInt(hex.substring(2, 4), 16) || 92;
      const b = parseInt(hex.substring(4, 6), 16) || 246;
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      const contrastForeground = yiq >= 150 ? '#0B0F19' : '#FFFFFF';

      const dr = Math.max(0, Math.floor(r * 0.8));
      const dg = Math.max(0, Math.floor(g * 0.8));
      const db = Math.max(0, Math.floor(b * 0.8));
      const darkHex = `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;

      const lr = Math.min(255, Math.floor(r + (255 - r) * 0.25));
      const lg = Math.min(255, Math.floor(g + (255 - g) * 0.25));
      const lb = Math.min(255, Math.floor(b + (255 - b) * 0.25));
      const lightHex = `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;

      const designCSS = `
        :root, .uploaded-template-runner, body, #template-root, .campuscv-template-root {
          ${hasUserAccent ? `
            --primary: ${accentHex} !important;
            --accent: ${accentHex} !important;
            --brand: ${accentHex} !important;
            --brand-gold: ${accentHex} !important;
            --theme-color: ${accentHex} !important;
            --accent-color: ${accentHex} !important;
            --campuscv-primary-color: ${accentHex} !important;
            --campuscv-accent: ${accentHex} !important;
            --campuscv-accent-rgb: ${r}, ${g}, ${b} !important;
            --campuscv-accent-dark: ${darkHex} !important;
            --campuscv-accent-light: ${lightHex} !important;
            --primary-accent: ${accentHex} !important;
            --primary-foreground: ${contrastForeground} !important;
            --color-cyan-500: ${accentHex} !important;
            --cyber-bright-cyan: ${accentHex} !important;
            --cyber-neon-cyan: ${accentHex} !important;
            --gold-500: ${accentHex} !important;
            --gold-400: ${lightHex} !important;
            --gold-600: ${darkHex} !important;
            --border-gold: rgba(${r}, ${g}, ${b}, 0.3) !important;
          ` : ''}
        }

        ${hasUserAccent ? `
          .uploaded-template-runner .bg-sky-600,
          .uploaded-template-runner .bg-sky-700,
          .uploaded-template-runner .bg-teal-600,
          .uploaded-template-runner .bg-teal-700,
          .uploaded-template-runner .bg-blue-600,
          .uploaded-template-runner .bg-indigo-600,
          .uploaded-template-runner .btn-primary,
          .uploaded-template-runner [data-cv="hero.primaryButton"],
          .uploaded-template-runner [data-cv-accent="true"] {
            background-color: ${accentHex} !important;
            color: ${contrastForeground} !important;
          }

          .uploaded-template-runner .hover\\:bg-sky-700:hover,
          .uploaded-template-runner .hover\\:bg-teal-700:hover,
          .uploaded-template-runner .hover\\:bg-blue-700:hover {
            background-color: ${darkHex} !important;
          }

          .uploaded-template-runner .text-sky-600,
          .uploaded-template-runner .text-sky-700,
          .uploaded-template-runner .text-sky-800,
          .uploaded-template-runner .text-teal-600,
          .uploaded-template-runner .text-teal-700,
          .uploaded-template-runner .text-blue-600,
          .uploaded-template-runner .text-indigo-600 {
            color: ${accentHex} !important;
          }

          .uploaded-template-runner .border-sky-500,
          .uploaded-template-runner .border-sky-600,
          .uploaded-template-runner .border-teal-500,
          .uploaded-template-runner .border-teal-600 {
            border-color: ${accentHex} !important;
          }

          .uploaded-template-runner .bg-sky-50,
          .uploaded-template-runner .bg-teal-50 {
            background-color: rgba(${r}, ${g}, ${b}, 0.08) !important;
          }

          .uploaded-template-runner .bg-sky-100,
          .uploaded-template-runner .bg-teal-100 {
            background-color: rgba(${r}, ${g}, ${b}, 0.15) !important;
          }

          .uploaded-template-runner .border-sky-200,
          .uploaded-template-runner .border-teal-200,
          .uploaded-template-runner .border-sky-100 {
            border-color: rgba(${r}, ${g}, ${b}, 0.25) !important;
          }

          .uploaded-template-runner .from-sky-600.to-teal-700,
          .uploaded-template-runner .from-sky-500.to-teal-600 {
            background-image: linear-gradient(to bottom right, ${accentHex}, ${darkHex}) !important;
          }
        ` : ''}
        ${fontCSS}
        ${fontSizeCSS}
      `;

      let styleTag = targetDoc.querySelector('style[data-campuscv-design-overrides="true"]') as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = targetDoc.createElement('style');
        styleTag.setAttribute('data-campuscv-design-overrides', 'true');
        targetDoc.head.appendChild(styleTag);
      }
      styleTag.textContent = designCSS;
    };

    const rafId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafId);
  }, [
    dObj?.userSelectedAccent,
    dObj?.userSelectedFont,
    dObj?.userSelectedFontSize,
    dObj?.theme?.primaryColor,
    dObj?.themeColor,
    dObj?.accentColor,
    dObj?.typography?.fontFamily,
    dObj?.fontPack,
    dObj?.typography?.fontSize,
    dObj?.baseFontSize,
    templateId
  ]);

  // Global broken image fallback listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleImgError = (e: any) => {
      if (e.target && e.target.tagName === 'IMG') {
        const img = e.target as HTMLImageElement;
        if (!img.dataset.hasFallback) {
          img.dataset.hasFallback = 'true';
          const isAvatar = img.getAttribute('data-node-type') === 'image' ||
                           img.getAttribute('data-cv-image') ||
                           (img.className && img.className.includes('avatar')) ||
                           (img.alt && (img.alt.includes('Avatar') || img.alt.includes('Profile'))) ||
                           img.getAttribute('data-cv') === 'profile.photo' ||
                           img.getAttribute('data-cv') === 'basics.photo';
          if (isAvatar) {
            img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
          } else {
            img.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
          }
        }
      }
    };
    window.addEventListener('error', handleImgError, true);
    return () => window.removeEventListener('error', handleImgError, true);
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && templateDebugger && typeof templateDebugger.recordDataBindingInfo === 'function') {
        const safeData = dObj || {};
        const isDemoMode = Boolean(safeData._demoMode || safeData.id === 'preview-portfolio');
        const hasRealPortfolio = Boolean(safeData.id && safeData.id !== 'preview-portfolio');
        const dataSource = isDemoMode ? 'SAMPLE_DEMO_DATA' : (hasRealPortfolio ? 'REAL_USER_DATA' : 'FALLBACK_DATA');

        templateDebugger.recordDataBindingInfo({
          templateId: String(templateId || 'student-portfolio'),
          dataMode: dataSource as any,
          portfolioId: String(safeData.id || 'demo-portfolio'),
          userName: String(safeData.profile?.name || safeData.name || safeData.fullName || safeData.hero?.name || 'Anonymous User'),
          userHeadline: String(safeData.profile?.headline || safeData.headline || safeData.tagline || safeData.hero?.subtitle || 'Full-Stack Developer'),
          userUniversity: String(safeData.profile?.university || safeData.university || safeData.hero?.university || 'Not Specified'),
          userLocation: String(safeData.profile?.location || safeData.location || safeData.hero?.location || 'Not Specified'),
          resolvedBindingsCount: 12,
          totalBindingsCount: 12,
          demoFallbackActive: isDemoMode
        });
      }
    } catch (e) { }
  }, [dObj?.id, templateId]);

  const RenderedComponent = rendered.component;

  const isCustomOrUploaded = isUploaded || (Boolean(templateId) && templateId !== 'default');

  const rootStyle: React.CSSProperties = isCustomOrUploaded
    ? {}
    : {
      ['--primary' as any]: primaryColor,
      ['--secondary' as any]: secondaryColor,
      ['--background' as any]: backgroundColor,
      ['--text' as any]: textColor,
      ['--btn-bg' as any]: btnBg,
      ['--btn-color' as any]: btnTextColor,
      ['--btn-radius' as any]: btnRadius,
    };

  return (
    <div
      ref={innerWrapperRef}
      id="template-root"
      // ISOLATION RULE: Do NOT add Tailwind utility classes (min-h-screen, font-sans,
      // antialiased, dark, light) to this wrapper — the template owns its own dimensions,
      // typography and colour scheme. CampusCV must be a zero-footprint host.
      // The `dark` class in particular triggers Tailwind CDN dark-mode on every child.
      className={`uploaded-template-runner${isDark ? ' dark' : ''}${isCustomOrUploaded ? '' : ' font-sans antialiased'}`}
      style={rootStyle}
      onClick={handleCanvasClick}
      onTouchStart={handleCanvasTouchStart}
      onTouchMove={handleCanvasTouchMove}
      onTouchEnd={handleCanvasTouchEnd}
      onTouchCancel={handleCanvasTouchEnd}
      onDoubleClick={handleCanvasDoubleClick}
    >
      <link data-campuscv-ignore-editor="true" rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fontGoogleName}&display=swap`} />
      {extractedFontLinks.map((url, i) => (
        <link key={i} data-campuscv-ignore-editor="true" rel="stylesheet" href={url} />
      ))}
      <style data-campuscv-ignore-editor="true" data-template-id={templateId} dangerouslySetInnerHTML={{ __html: dynamicThemeCSS }} />
      {fullCSS && (
        <style
          id={`template-css-${templateId}`}
          data-template-css={templateId}
          data-campuscv-ignore-editor="true"
          data-template-id={templateId}
          dangerouslySetInnerHTML={{ __html: fullCSS }}
        />
      )}

      {/* Visible Error Overlay if Compilation or Execution fails */}
      {runtimeError && (
        <div className="p-6 m-4 bg-red-950 text-red-100 border-2 border-red-500 rounded-2xl font-mono text-xs shadow-2xl space-y-3 text-left">
          <div className="font-extrabold text-sm text-red-400 flex items-center gap-2">
            <span>⚠️ Template Runtime Error</span>
          </div>
          <div className="bg-black/60 p-4 rounded-xl border border-red-800 text-red-300 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto">
            {runtimeError}
          </div>
          {compilationLogs.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-red-300 uppercase tracking-wider">Compilation Logs:</div>
              <div className="bg-black/40 p-2.5 rounded-lg border border-red-900/60 text-[10px] space-y-0.5 max-h-36 overflow-y-auto">
                {compilationLogs.map((log, i) => (
                  <div key={i} className={log.status === 'error' ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="text-[10px] text-red-400 border-t border-red-900/60 pt-2">
            Tip: Ensure your template entry file (e.g. index.tsx / template.tsx) exports a React component as default (e.g. <span className="font-bold text-red-200">export default function Portfolio(props) {'{ ... }'}</span>).
          </div>
        </div>
      )}

      {isUploaded ? (
        (runtimeError || resolvedFiles.error || (!hasPackage && !isLoadingFiles)) ? (
          <UploadedTemplateError
            portfolioId={data?.id}
            templateId={templateId}
            errorMessage={runtimeError || resolvedFiles.error || `No section files found for uploaded template '${templateId}'`}
            compilationLogs={compilationLogs}
          />
        ) : (isLoadingFiles || !RenderedComponent) ? (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 select-none">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <TemplateErrorBoundary onError={(err) => setRuntimeError(err.message)}>
            {/* ISOLATION RULE: This wrapper must be zero-footprint.
                Use display:contents so it does not create a new block context,
                does not set width/height/padding/margin, and does not affect
                the template's grid/flex layout in any way. */}
            <div
              id="template-inner-wrapper"
              ref={innerWrapperRef}
              style={{ display: 'contents' }}
            >
              <RenderedComponent
                key={templateId || 'template-root'}
                {...restProps}
                mode={renderMode}
                renderMode={renderMode}
                data={normalizedData}
                portfolio={normalizedData}
                cv={normalizedData}
                resume={normalizedData}
                profile={normalizedData}
                activePage={normalizedActivePage}
                isEditMode={isEditMode}
                onFieldChange={onFieldChange}
                onChange={onFieldChange}
                onAdd={(key: string, item: any) => {
                  const list = [...((normalizedData as any)[key] || []), item];
                  if (onFieldChange) onFieldChange(key, list);
                }}
                onDelete={(key: string, idx: number) => {
                  const list = ((normalizedData as any)[key] || []).filter((_: any, i: number) => i !== idx);
                  if (onFieldChange) onFieldChange(key, list);
                }}
                onDuplicate={(key: string, idx: number) => {
                  const arr = [...((normalizedData as any)[key] || [])];
                  if (arr[idx]) {
                    const cloned = typeof arr[idx] === 'object' ? { ...arr[idx], id: `item-${Date.now()}` } : `${arr[idx]} (Copy)`;
                    arr.splice(idx + 1, 0, cloned);
                    if (onFieldChange) onFieldChange(key, arr);
                  }
                }}
                onMove={(key: string, fromIdx: number, toIdx: number) => {
                  const arr = [...((normalizedData as any)[key] || [])];
                  if (fromIdx >= 0 && fromIdx < arr.length && toIdx >= 0 && toIdx < arr.length) {
                    const [moved] = arr.splice(fromIdx, 1);
                    arr.splice(toIdx, 0, moved);
                    if (onFieldChange) onFieldChange(key, arr);
                  }
                }}
              />

              {/* Render any free addedElements */}
              {Array.isArray((normalizedData as any)?.addedElements) && (
                <RenderAddedElements
                  elements={(normalizedData as any).addedElements.filter((el: any) => !el.parentNodeId || !el.parentNodeId.includes('custom-section'))}
                  data={normalizedData}
                />
              )}

              {/* Render any addedSections */}
              {Array.isArray((normalizedData as any)?.addedSections) && (
                <RenderAddedSections
                  sections={(normalizedData as any).addedSections}
                  data={normalizedData}
                />
              )}
            </div>
          </TemplateErrorBoundary>
        )
      ) : isLoadingFiles ? (
        <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-8 select-none">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="w-full min-h-screen bg-zinc-950 text-red-300 p-8 font-mono flex items-center justify-center">
          <div className="max-w-2xl w-full bg-zinc-900 border border-red-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
              <h2 className="text-lg font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                ⚠️ TEMPLATE LOAD ERROR
              </h2>
              <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-400 text-xs font-mono border border-red-900">
                Fallback: DISABLED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Template ID</span>
                <span className="text-white font-bold">{templateId}</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Package Files</span>
                <span className="text-white font-bold">{Object.keys(sectionFiles).length} files</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Manifest</span>
                <span className={sectionFiles['manifest.json'] ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {sectionFiles['manifest.json'] ? 'FOUND' : 'NOT FOUND'}
                </span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold">Entry Point</span>
                <span className="text-white font-bold truncate block" title={resolvedFiles.entryFile || compilationLogs[0]?.file || 'Unknown'}>
                  {resolvedFiles.entryFile || compilationLogs[0]?.file || 'Unknown'}
                </span>
              </div>
            </div>

            <div className="bg-red-950/40 p-3.5 rounded-xl border border-red-900/80 text-xs text-red-200 space-y-1">
              <span className="font-bold text-red-400 block text-[11px] uppercase tracking-wider">Failure Details:</span>
              <p className="leading-relaxed font-mono">
                {runtimeError || resolvedFiles.error || (isLoadingFiles ? 'Loading template files...' : 'No valid React component exported from template entry file.')}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
              <span>Source: {resolvedFiles.source || 'none'}</span>
              <span>CampusCV Runtime Environment</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
