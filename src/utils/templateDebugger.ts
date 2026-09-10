/**
 * templateDebugger.ts — 10X Universal Template Runtime Forensics & Viewport Audit Engine
 */

export interface ViewportLayerMeasurement {
  layerName: string;
  elementSelector: string;
  windowInnerWidth: number;
  windowInnerHeight: number;
  clientWidth: number;
  clientHeight: number;
  offsetWidth: number;
  offsetHeight: number;
  boundingWidth: number;
  boundingHeight: number;
  computedWidth: string;
  computedMaxWidth: string;
  computedMinWidth: string;
  computedHeight: string;
  computedMaxHeight: string;
  display: string;
  position: string;
  flexBasis: string;
  flexShrink: string;
  transform: string;
  transformOrigin: string;
  zoom: string;
  isFirstReductionStage: boolean;
}

export interface ViewportAuditResult {
  timestamp: string;
  browserViewport: { width: number; height: number; devicePixelRatio: number };
  layers: ViewportLayerMeasurement[];
  firstReductionStage: ViewportLayerMeasurement | null;
  visualScaleMismatch: {
    logicalWidth: number;
    boundingWidth: number;
    scaleFactor: number;
    detected: boolean;
  };
  artificialScaleRules: Array<{
    sourceFile: string;
    line?: number;
    property: string;
    value: string;
    appliedTo: string;
  }>;
  rootCauseSummary: string;
}

export interface FileManifestEntry {
  path: string;
  size: number;
  hash: string;
  mime: string;
  stage: 'UPLOADED_ZIP' | 'STORED_DISK' | 'ADMIN_PREVIEW' | 'EDITOR_PREVIEW';
}

export interface TemplateManifest {
  templateId: string;
  debugId: string;
  createdAt: string;
  framework?: string;
  entrypoint?: string;
  globalCSS?: string;
  files: FileManifestEntry[];
}

export interface ComponentTreeNode {
  name: string;
  sourcePath: string;
  isOriginal: boolean;
  originTag: 'UPLOADED TEMPLATE' | 'CAMPUSCV GENERATED';
  renderCount: number;
  renderTimeMs: number;
  children?: ComponentTreeNode[];
}

export interface CSSSpecificityEntry {
  selector: string;
  property: string;
  templateValue: string;
  platformValue: string;
  specificity: [number, number, number];
  winner: 'Template' | 'Platform';
  isOverridden: boolean;
  templateSource: string;
  platformSource: string;
}

export interface DOMMutationRecordEntry {
  timestamp: string;
  type: 'attributes' | 'childList' | 'characterData';
  target: string;
  details: string;
  source: 'CampusCV Runtime' | 'Template Runtime' | 'User Interaction';
}

export interface NetworkRequestEntry {
  url: string;
  method: string;
  status: number;
  type: string;
  size: number;
  durationMs: number;
  error?: string;
}

export interface AnimationEntry {
  name: string;
  type: 'keyframes' | 'transition';
  duration: string;
  easing: string;
  isRunning: boolean;
  targetSelector: string;
}

export interface EventListenerEntry {
  elementSelector: string;
  eventType: string;
  handlerName: string;
  sourceFile: string;
  status: 'ACTIVE' | 'DISABLED';
}

export interface ResponsiveBreakpointEntry {
  label: string;
  widthPx: number;
  query: string;
  isActive: boolean;
  affectedRulesCount: number;
}

export interface ForensicPerformanceTimings {
  firstRenderMs: number;
  cssBundleLoadMs: number;
  jsTranspileMs: number;
  reactHydrationMs: number;
  fontLoadMs: number;
}

export interface TemplateDebugState {
  enabled: boolean;
  debugId: string;
  templateId: string;
  runtimeId: string;
  framework: string;
  version: string;
  entrypoint: string;
  globalCSS: string;
  runtimeMode: 'ORIGINAL_SOURCE' | 'SAFE_ADAPTER' | 'RECONSTRUCTED';
  checkpoints: {
    A?: TemplateManifest;
    B?: TemplateManifest;
    C?: TemplateManifest;
    D?: TemplateManifest;
  };
  viewportAudit: ViewportAuditResult | null;
  dataBinding: {
    templateId: string;
    dataMode: 'REAL_USER_DATA' | 'SAMPLE_DEMO_DATA';
    portfolioId: string;
    userName: string;
    userHeadline: string;
    userUniversity: string;
    userLocation: string;
    resolvedBindingsCount: number;
    totalBindingsCount: number;
    demoFallbackActive: boolean;
  } | null;
  cssFiles: Array<{
    path: string;
    hash: string;
    size: number;
    rulesCount: number;
    keyframesCount: number;
    mediaQueriesCount: number;
    variablesCount: number;
    loaded: boolean;
    status: 'discovered' | 'loaded' | 'failed';
  }>;
  jsModules: Array<{
    path: string;
    hash: string;
    size: number;
    transpileTimeMs: number;
    executed: boolean;
    dependencies: string[];
    status: 'compiled' | 'failed';
  }>;
  assets: Array<{
    originalPath: string;
    resolvedUrl: string;
    status: number;
    mime: string;
    dimensions?: string;
    sizeBytes?: number;
  }>;
  fonts: Array<{
    family: string;
    url: string;
    source: 'Google Fonts' | 'Local WOFF2' | 'System Font';
    declaredFamily: string;
    computedFamily: string;
    loaded: boolean;
    isFallback: boolean;
  }>;
  componentTree: ComponentTreeNode[];
  cssOverrides: CSSSpecificityEntry[];
  mutations: DOMMutationRecordEntry[];
  networkRequests: NetworkRequestEntry[];
  animations: AnimationEntry[];
  eventListeners: EventListenerEntry[];
  responsiveBreakpoints: ResponsiveBreakpointEntry[];
  performance: ForensicPerformanceTimings;
  hydration: {
    status: 'PASS' | 'MISMATCH';
    ssrNodeCount: number;
    clientNodeCount: number;
    mismatchComponent?: string;
  };
  viewport: {
    browserWidth: number;
    browserHeight: number;
    templateWidth: number;
    templateHeight: number;
    scale: number;
    zoom: number;
    mutated: boolean;
  };
  errors: Array<{
    timestamp: string;
    message: string;
    source: string;
    line?: number;
    col?: number;
    stack?: string;
  }>;
  warnings: string[];
  logs: string[];
}

export function computeStringHash(str: string): string {
  if (!str) return '00000000';
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function createTemplateDebugId(templateId: string = 'tpl'): string {
  const dateStr = new Date().toISOString().replace(/[-T::.Z]/g, '').slice(0, 8);
  const rand = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
  return `TPLDBG-${dateStr}-${rand}`;
}

export const initialDebugState: TemplateDebugState = {
  enabled: true,
  debugId: 'TPLDBG-INITIAL',
  templateId: 'student-portfolio',
  runtimeId: 'rt-init',
  framework: 'Next.js',
  version: '1.0.0',
  entrypoint: 'src/app/page.tsx',
  globalCSS: 'src/app/globals.css',
  runtimeMode: 'ORIGINAL_SOURCE',
  checkpoints: {},
  viewportAudit: null,
  dataBinding: null,
  cssFiles: [
    {
      path: 'src/app/globals.css',
      hash: 'e4a1b2c3',
      size: 12450,
      rulesCount: 843,
      keyframesCount: 9,
      mediaQueriesCount: 17,
      variablesCount: 42,
      loaded: true,
      status: 'loaded'
    }
  ],
  jsModules: [
    { path: 'src/app/layout.tsx', hash: '8f9e0a1b', size: 1820, transpileTimeMs: 12.4, executed: true, dependencies: ['react', 'src/app/globals.css'], status: 'compiled' },
    { path: 'src/app/page.tsx', hash: '1a2b3c4d', size: 4500, transpileTimeMs: 24.1, executed: true, dependencies: ['Hero', 'About', 'Projects'], status: 'compiled' }
  ],
  assets: [
    { originalPath: 'public/images/portrait.jpg', resolvedUrl: '/api/template-assets?path=images/portrait.jpg', status: 200, mime: 'image/jpeg', dimensions: '600x800', sizeBytes: 84200 }
  ],
  fonts: [
    { family: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter', source: 'Google Fonts', declaredFamily: 'Inter', computedFamily: 'Inter', loaded: true, isFallback: false }
  ],
  componentTree: [
    {
      name: 'App',
      sourcePath: 'src/app/layout.tsx',
      isOriginal: true,
      originTag: 'UPLOADED TEMPLATE',
      renderCount: 1,
      renderTimeMs: 4.2,
      children: [
        {
          name: 'Page',
          sourcePath: 'src/app/page.tsx',
          isOriginal: true,
          originTag: 'UPLOADED TEMPLATE',
          renderCount: 1,
          renderTimeMs: 12.8
        }
      ]
    }
  ],
  cssOverrides: [],
  mutations: [],
  networkRequests: [
    { url: '/api/template-files?templateId=student-portfolio', method: 'GET', status: 200, type: 'json', size: 142000, durationMs: 83 }
  ],
  animations: [
    { name: 'heroFadeIn', type: 'keyframes', duration: '700ms', easing: 'cubic-bezier(0.16, 1, 0.3, 1)', isRunning: true, targetSelector: '.hero' }
  ],
  eventListeners: [
    { elementSelector: 'button#explore-projects', eventType: 'click', handlerName: 'scrollToProjects', sourceFile: 'Hero.tsx:42', status: 'ACTIVE' }
  ],
  responsiveBreakpoints: [
    { label: 'Desktop', widthPx: 1440, query: '@media (min-width: 1280px)', isActive: true, affectedRulesCount: 42 },
    { label: 'Tablet', widthPx: 768, query: '@media (max-width: 768px)', isActive: false, affectedRulesCount: 34 },
    { label: 'Mobile', widthPx: 390, query: '@media (max-width: 640px)', isActive: false, affectedRulesCount: 51 }
  ],
  performance: {
    firstRenderMs: 142,
    cssBundleLoadMs: 18,
    jsTranspileMs: 69,
    reactHydrationMs: 24,
    fontLoadMs: 45
  },
  hydration: {
    status: 'PASS',
    ssrNodeCount: 418,
    clientNodeCount: 418
  },
  viewport: {
    browserWidth: 1536,
    browserHeight: 864,
    templateWidth: 1200,
    templateHeight: 800,
    scale: 1.0,
    zoom: 1.0,
    mutated: false
  },
  errors: [],
  warnings: [],
  logs: []
};

class TemplateDebuggerEngine {
  private state: TemplateDebugState = { ...initialDebugState };

  constructor() {
    if (typeof window !== 'undefined') {
      (window as any).__CAMPUSCV_TEMPLATE_DEBUG__ = this.state;
    }
  }

  public getDebugId(): string {
    return this.state.debugId;
  }

  public startSession(templateId: string, runtimeId?: string): string {
    const debugId = createTemplateDebugId(templateId);
    this.state.debugId = debugId;
    this.state.templateId = templateId;
    this.state.runtimeId = runtimeId || `rt-${Date.now()}`;
    this.state.logs = [];
    this.state.warnings = [];
    this.state.errors = [];
    this.state.mutations = [];

    this.log(`[TEMPLATE:${debugId}] FORENSICS ENGINE INITIALIZED for template '${templateId}' (Runtime: ${this.state.runtimeId})`);
    this.syncGlobalState();
    return debugId;
  }

  public runViewportRootCauseAudit(): ViewportAuditResult {
    const timestamp = new Date().toISOString();
    const browserViewport = {
      width: typeof window !== 'undefined' ? window.innerWidth : 1536,
      height: typeof window !== 'undefined' ? window.innerHeight : 864,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    };

    const layers: ViewportLayerMeasurement[] = [];
    let previousWidth = browserViewport.width;
    let firstReductionStage: ViewportLayerMeasurement | null = null;

    if (typeof window !== 'undefined') {
      // 1. Browser Layer
      layers.push({
        layerName: '1. Browser Window',
        elementSelector: 'window',
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        offsetWidth: document.documentElement.offsetWidth,
        offsetHeight: document.documentElement.offsetHeight,
        boundingWidth: window.innerWidth,
        boundingHeight: window.innerHeight,
        computedWidth: `${window.innerWidth}px`,
        computedMaxWidth: 'none',
        computedMinWidth: '0px',
        computedHeight: `${window.innerHeight}px`,
        computedMaxHeight: 'none',
        display: 'block',
        position: 'static',
        flexBasis: 'auto',
        flexShrink: '1',
        transform: 'none',
        transformOrigin: '0 0',
        zoom: '1',
        isFirstReductionStage: false
      });

      // 2. Query Key Ancestors in DOM Tree
      const selectors = [
        '#admin-root, [data-admin-root="true"], main',
        '.preview-container, [data-preview-container="true"], .viewport-stage-container',
        'iframe, [data-template-iframe="true"]',
        '#template-root, #iframe-root, .uploaded-template-runner',
        'section, main, .hero, header'
      ];

      selectors.forEach((sel, idx) => {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) {
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          const isReduced = rect.width < previousWidth - 50 && previousWidth >= 1000;

          const measurement: ViewportLayerMeasurement = {
            layerName: `${idx + 2}. ${sel.split(',')[0]}`,
            elementSelector: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ').join('.') : ''}`,
            windowInnerWidth: window.innerWidth,
            windowInnerHeight: window.innerHeight,
            clientWidth: el.clientWidth,
            clientHeight: el.clientHeight,
            offsetWidth: el.offsetWidth,
            offsetHeight: el.offsetHeight,
            boundingWidth: Math.round(rect.width),
            boundingHeight: Math.round(rect.height),
            computedWidth: computed.width,
            computedMaxWidth: computed.maxWidth,
            computedMinWidth: computed.minWidth,
            computedHeight: computed.height,
            computedMaxHeight: computed.maxHeight,
            display: computed.display,
            position: computed.position,
            flexBasis: computed.flexBasis,
            flexShrink: computed.flexShrink,
            transform: computed.transform,
            transformOrigin: computed.transformOrigin,
            zoom: (computed as any).zoom || '1',
            isFirstReductionStage: isReduced && !firstReductionStage
          };

          if (isReduced && !firstReductionStage) {
            firstReductionStage = measurement;
          }

          previousWidth = Math.round(rect.width);
          layers.push(measurement);
        }
      });
    }

    // Mathematical Scale Mismatch Detection
    const templateLayer = layers.find(l => l.layerName.includes('template-root') || l.layerName.includes('iframe-root')) || layers[layers.length - 1];
    const logicalWidth = templateLayer ? templateLayer.clientWidth || 1200 : 1200;
    const boundingWidth = templateLayer ? templateLayer.boundingWidth || 1200 : 1200;
    const scaleFactor = boundingWidth / (logicalWidth || 1);

    const result: ViewportAuditResult = {
      timestamp,
      browserViewport,
      layers,
      firstReductionStage,
      visualScaleMismatch: {
        logicalWidth,
        boundingWidth,
        scaleFactor,
        detected: scaleFactor < 0.9 && logicalWidth >= 1000
      },
      artificialScaleRules: [],
      rootCauseSummary: (firstReductionStage as ViewportLayerMeasurement | null)
        ? `FIRST REDUCTION STAGE: Width reduced to ${(firstReductionStage as any).boundingWidth}px at <${(firstReductionStage as any).elementSelector}> (computed max-width: ${(firstReductionStage as any).computedMaxWidth}, transform: ${(firstReductionStage as any).transform}).`
        : `100% DESKTOP VIEWPORT PARITY: Template bounding width (${boundingWidth}px) matches available browser width (${browserViewport.width}px).`
    };

    this.state.viewportAudit = result;
    this.log(`[VIEWPORT AUDIT] ${result.rootCauseSummary}`);
    this.syncGlobalState();
    return result;
  }

  public recordDataBindingInfo(info: {
    templateId: string;
    dataMode: 'REAL_USER_DATA' | 'SAMPLE_DEMO_DATA';
    portfolioId: string;
    userName: string;
    userHeadline: string;
    userUniversity: string;
    userLocation: string;
    resolvedBindingsCount: number;
    totalBindingsCount: number;
    demoFallbackActive: boolean;
  }): void {
    this.state.dataBinding = info;
    this.log(`[TEMPLATE-DATA] templateId: ${info.templateId} | dataSource: ${info.dataMode} | portfolioId: ${info.portfolioId} | userName: ${info.userName} | resolved: ${info.resolvedBindingsCount}/${info.totalBindingsCount}`);
    this.syncGlobalState();
  }

  public log(msg: string): void {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const entry = `[${timestamp}] ${msg}`;
    this.state.logs.push(entry);
    console.log(`%c[CAMPUSCV FORENSICS]%c ${msg}`, 'color: #a855f7; font-weight: bold;', 'color: inherit;');
    this.syncGlobalState();
  }

  public recordMutation(type: 'attributes' | 'childList' | 'characterData', target: string, details: string, source: 'CampusCV Runtime' | 'Template Runtime' | 'User Interaction' = 'CampusCV Runtime'): void {
    const timestamp = new Date().toLocaleTimeString();
    this.state.mutations.unshift({ timestamp, type, target, details, source });
    if (this.state.mutations.length > 100) this.state.mutations.pop();
    this.syncGlobalState();
  }

  public registerCheckpoint(stage: 'A' | 'B' | 'C' | 'D', manifest: TemplateManifest): void {
    this.state.checkpoints[stage] = manifest;
    this.log(`[TEMPLATE:${this.state.debugId}] CHECKPOINT ${stage} REGISTERED (${manifest.files.length} files recorded)`);
    this.syncGlobalState();
  }

  public updateState(patch: Partial<TemplateDebugState>): void {
    this.state = { ...this.state, ...patch };
    this.syncGlobalState();
  }

  public getState(): TemplateDebugState {
    return this.state;
  }

  public exportDiagnosticReportJSON(): string {
    return JSON.stringify(this.state, null, 2);
  }

  private syncGlobalState(): void {
    if (typeof window !== 'undefined') {
      (window as any).__CAMPUSCV_TEMPLATE_DEBUG__ = this.state;
    }
  }
}

export const templateDebugger = new TemplateDebuggerEngine();
