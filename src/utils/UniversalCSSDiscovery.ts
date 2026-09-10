/**
 * UniversalCSSDiscovery.ts — Universal Template CSS Discovery & Manifest Engine
 * 
 * Automatically discovers, categorizes, resolves @import graphs, and bundles all
 * styling sources in uploaded portfolio templates without requiring hardcoded filenames.
 */

export interface CSSManifest {
  globalStyles: string[];
  componentStyles: string[];
  styleImports: string[];
  externalStyles: string[];
  tailwind: boolean;
  postcss: boolean;
  preprocessors: string[];
}

export interface DiscoveredCSSResult {
  manifest: CSSManifest;
  combinedCSS: string;
  cssModuleMap: Record<string, Record<string, string>>;
}

/**
 * Searches for a file in sectionFiles using multiple path variation strategies.
 */
function findInFiles(files: Record<string, string>, targetPath: string): { code: string; key: string } | null {
  if (!files || !targetPath) return null;
  const cleanTarget = targetPath.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\/+/, '').replace(/^[@~]\//, '');

  if (files[targetPath]) return { code: files[targetPath], key: targetPath };
  if (files[cleanTarget]) return { code: files[cleanTarget], key: cleanTarget };
  if (files[`src/${cleanTarget}`]) return { code: files[`src/${cleanTarget}`], key: `src/${cleanTarget}` };

  const normTarget = cleanTarget.toLowerCase();
  const directMatchKey = Object.keys(files).find(k => {
    const normK = k.toLowerCase().replace(/\\/g, '/');
    return normK === normTarget || normK.endsWith('/' + normTarget) || normK.endsWith('/src/' + normTarget);
  });
  if (directMatchKey && files[directMatchKey]) {
    return { code: files[directMatchKey], key: directMatchKey };
  }

  return null;
}

/**
 * Basic SCSS/SASS/LESS nesting and variable transpiler for browser runtime compatibility.
 */
function preprocessCSSLike(content: string, filePath: string): string {
  let processed = content;

  // Replace SCSS variables e.g. $accent: #6366f1; with CSS custom properties or inline values
  const scssVarMap: Record<string, string> = {};
  processed = processed.replace(/\$([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g, (match, varName, varValue) => {
    scssVarMap[varName] = varValue.trim();
    return `--${varName}: ${varValue.trim()};`;
  });

  // Replace SCSS variable usage e.g. color: $accent; -> color: var(--accent, #6366f1);
  Object.entries(scssVarMap).forEach(([varName, val]) => {
    const varRegex = new RegExp(`\\$${varName}\\b`, 'g');
    processed = processed.replace(varRegex, `var(--${varName}, ${val})`);
  });

  return processed;
}

/**
 * Recursively resolves local @import statements in CSS files.
 */
function inlineCSSImports(
  content: string,
  currentFilePath: string,
  sectionFiles: Record<string, string>,
  alreadyIncludedFiles: Set<string> = new Set(),
  recursionStack: Set<string> = new Set()
): string {
  if (recursionStack.has(currentFilePath)) return `/* Circular import skipped: ${currentFilePath} */`;
  recursionStack.add(currentFilePath);

  return content.replace(/@import\s+(?:url\(['"]?([^'")]+)['"]?\)|['"]([^'"]+)['"])\s*;?/gi, (match, p1, p2) => {
    const importPath = (typeof p1 === 'string' ? p1 : (typeof p2 === 'string' ? p2 : '')).trim();
    if (!importPath) return match;

    // Preserve external font / cdn imports
    if (
      importPath.startsWith('http://') ||
      importPath.startsWith('https://') ||
      importPath.startsWith('//') ||
      importPath.includes('fonts.googleapis')
    ) {
      return match;
    }

    if (importPath.includes('tailwindcss') || importPath.includes('tailwind')) {
      return `/* Tailwind @import "${importPath}" resolved */`;
    }

    const matchedFile = findInFiles(sectionFiles, importPath);
    if (matchedFile && matchedFile.code) {
      const baseName = matchedFile.key.split('/').pop() || '';
      if (alreadyIncludedFiles.has(matchedFile.key) || alreadyIncludedFiles.has(baseName)) {
        return `/* --- @import "${importPath}" (${matchedFile.key}) already included in document --- */\n`;
      }
      const preprocessed = preprocessCSSLike(matchedFile.code, matchedFile.key);
      const inlined = inlineCSSImports(preprocessed, matchedFile.key, sectionFiles, alreadyIncludedFiles, recursionStack);
      return `/* --- Inlined @import "${importPath}" (${matchedFile.key}) --- */\n${inlined}\n`;
    }

    const cleanPath = importPath.split('../').join('').split('./').join('');
    const altMatch = findInFiles(sectionFiles, cleanPath);
    if (altMatch && altMatch.code) {
      const baseName = altMatch.key.split('/').pop() || '';
      if (alreadyIncludedFiles.has(altMatch.key) || alreadyIncludedFiles.has(baseName)) {
        return `/* --- @import "${importPath}" (${altMatch.key}) already included in document --- */\n`;
      }
      const preprocessed = preprocessCSSLike(altMatch.code, altMatch.key);
      const inlined = inlineCSSImports(preprocessed, altMatch.key, sectionFiles, alreadyIncludedFiles, recursionStack);
      return `/* --- Inlined @import "${importPath}" (${altMatch.key}) --- */\n${inlined}\n`;
    }
    return `/* Local @import "${importPath}" resolved */`;
  });
}

const cssDiscoveryCache = new Map<string, DiscoveredCSSResult>();

/**
 * Main discovery routine for template styling.
 */
export function discoverTemplateCSS(
  sectionFiles: Record<string, string>,
  scopeHash: string = 'tpl',
  assetMap?: Record<string, string>,
  templateId: string = 'uploaded'
): DiscoveredCSSResult {
  if (!sectionFiles || Object.keys(sectionFiles).length === 0) {
    return {
      manifest: {
        globalStyles: [],
        componentStyles: [],
        styleImports: [],
        externalStyles: [],
        tailwind: false,
        postcss: false,
        preprocessors: []
      },
      combinedCSS: '',
      cssModuleMap: {}
    };
  }

  const fileKeys = Object.keys(sectionFiles);
  const cacheKey = `${templateId}::${scopeHash}::${fileKeys.length}::${fileKeys.slice(0, 10).join(',')}`;
  if (cssDiscoveryCache.has(cacheKey)) {
    return cssDiscoveryCache.get(cacheKey)!;
  }

  const globalStyles: string[] = [];
  const componentStyles: string[] = [];
  const styleImports: string[] = [];
  const externalStyles: Set<string> = new Set();
  const preprocessors: Set<string> = new Set();

  let hasTailwind = false;
  let hasPostCSS = false;

  const cssModuleMap: Record<string, Record<string, string>> = {};
  const cssChunks: string[] = [];

  const reservedPseudos = new Set([
    'hover', 'focus', 'active', 'disabled', 'visited',
    'before', 'after', 'first-child', 'last-child', 'nth-child',
    'root', 'container', 'dark', 'light', 'focus-within', 'focus-visible'
  ]);

  // 1. Scan files for PostCSS / Tailwind configurations
  Object.keys(sectionFiles).forEach((filePath) => {
    const lower = filePath.toLowerCase();
    if (lower.includes('tailwind.config') || lower.includes('postcss.config')) {
      if (lower.includes('tailwind')) hasTailwind = true;
      if (lower.includes('postcss')) hasPostCSS = true;
    }
  });

  // 2. Scan JS/TS/JSX/TSX and HTML files for style imports and external links
  Object.entries(sectionFiles).forEach(([filePath, content]) => {
    if (!content) return;
    const lowerPath = filePath.toLowerCase();

    if (/\.(tsx|jsx|ts|js|html)$/i.test(filePath)) {
      // Check for Tailwind directives or classes in JS/TSX code
      if (!hasTailwind && (content.includes('@import "tailwindcss"') || content.includes('@tailwind') || content.includes('tailwindcss'))) {
        hasTailwind = true;
      }

      // Extract external stylesheet links
      const linkMatches = content.matchAll(/<link\s+[^>]*href=["']([^"']+)["'][^>]*>/gi);
      for (const m of linkMatches) {
        const href = m[1];
        if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//'))) {
          externalStyles.add(href);
        }
      }

      // Extract import statements
      const importMatches = content.matchAll(/(?:import|require)\s*\(\s*["']([^"']+\.(?:css|scss|sass|less))["']\s*\)|import\s+.*?from\s+["']([^"']+\.(?:css|scss|sass|less))["']|import\s+["']([^"']+\.(?:css|scss|sass|less))["']/gi);
      for (const m of importMatches) {
        const imp = m[1] || m[2] || m[3];
        if (imp && !styleImports.includes(imp)) {
          styleImports.push(imp);
        }
      }

      // Extract embedded <style> tags and CSS string variables in JSX/TSX/JS/HTML files
      const styleTagMatches = content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      for (const stm of styleTagMatches) {
        if (stm[1] && stm[1].trim()) {
          cssChunks.push(`/* Embedded <style> in ${filePath} */\n${stm[1]}`);
        }
      }

      const cssStringMatches = content.matchAll(/const\s+styles\s*=\s*`([\s\S]*?)`;/gi);
      for (const csm of cssStringMatches) {
        if (csm[1] && csm[1].trim()) {
          cssChunks.push(`/* Embedded styles string in ${filePath} */\n${csm[1]}`);
        }
      }
    }
  });

  // 3. Extract stylesheet link tags from index.html if present to preserve author's exact cascade order
  const htmlEntry = Object.entries(sectionFiles).find(([k]) => k.toLowerCase().endsWith('index.html') && !k.toLowerCase().includes('dist/'));
  const htmlLinkOrder: string[] = [];
  if (htmlEntry && htmlEntry[1]) {
    const linkMatches = htmlEntry[1].matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>|<link\s+[^>]*href=["']([^"']+\.css)["'][^>]*>/gi);
    for (const lm of linkMatches) {
      const href = (lm[1] || lm[2] || '').trim();
      if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//')) {
        const cleanHref = href.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\/+/, '');
        if (!htmlLinkOrder.includes(cleanHref)) {
          htmlLinkOrder.push(cleanHref);
        }
      }
    }
  }

  // Canonicalize and deduplicate stylesheet entries
  const allStylePaths = Object.keys(sectionFiles).filter(p => /\.(css|scss|sass|less)$/i.test(p) && !p.includes('dist/'));

  // Helper to find the best unique canonical file path in sectionFiles
  const findCanonicalKey = (targetPath: string): string | null => {
    const clean = targetPath.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\/+/, '').toLowerCase();
    // 1. Exact match
    const exact = allStylePaths.find(p => p.toLowerCase() === clean);
    if (exact) return exact;
    // 2. Exact match with prefix (e.g. css/variables.css)
    const withPrefix = allStylePaths.find(p => p.toLowerCase().endsWith('/' + clean) && !p.toLowerCase().includes('template/'));
    if (withPrefix) return withPrefix;
    // 3. Any ending match
    const anyMatch = allStylePaths.find(p => p.toLowerCase().endsWith('/' + clean) || p.toLowerCase() === clean);
    return anyMatch || null;
  };

  const chosenStyleEntries: [string, string][] = [];
  const processedCanonicalKeys = new Set<string>();

  if (htmlLinkOrder.length > 0) {
    // AUTHOR-DECLARED STYLESHEETS (from index.html)
    for (const linkPath of htmlLinkOrder) {
      const matchedKey = findCanonicalKey(linkPath);
      if (matchedKey && !processedCanonicalKeys.has(matchedKey) && sectionFiles[matchedKey]) {
        chosenStyleEntries.push([matchedKey, sectionFiles[matchedKey]]);
        processedCanonicalKeys.add(matchedKey);
        // Also mark alias variations as processed
        const baseName = matchedKey.split('/').pop() || '';
        processedCanonicalKeys.add(baseName);
        processedCanonicalKeys.add(`template/${matchedKey}`);
      }
    }
  }

  // Also include any imported CSS module files or explicit style imports not covered yet
  allStylePaths.forEach((filePath) => {
    if (processedCanonicalKeys.has(filePath)) return;
    const lower = filePath.toLowerCase();
    const baseName = filePath.split('/').pop() || '';

    // Skip nested duplicated copies (e.g. template/css/* if css/* exists)
    if (lower.startsWith('template/css/') && allStylePaths.some(p => p.toLowerCase() === lower.replace('template/', ''))) {
      return;
    }
    // Skip bare aliases (e.g. variables.css if css/variables.css exists)
    if (!lower.includes('/') && allStylePaths.some(p => p.toLowerCase().endsWith('/' + lower) && p.toLowerCase() !== lower)) {
      return;
    }

    const isModule = lower.includes('.module.');
    const isImported = styleImports.some(imp => {
      const cleanImp = imp.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\/+/, '').toLowerCase();
      return lower.endsWith(cleanImp) || cleanImp.endsWith(lower);
    });

    if (isModule || isImported || htmlLinkOrder.length === 0) {
      if (!processedCanonicalKeys.has(filePath) && !processedCanonicalKeys.has(baseName)) {
        chosenStyleEntries.push([filePath, sectionFiles[filePath]]);
        processedCanonicalKeys.add(filePath);
        processedCanonicalKeys.add(baseName);
      }
    }
  });

  // Sort remaining fallback entries by cascade rank if no HTML link order governed them
  if (htmlLinkOrder.length === 0) {
    const getCascadeRank = (filePath: string): number => {
      const lower = filePath.toLowerCase();
      const fileName = lower.split('/').pop() || '';
      if (fileName.includes('variable') || fileName.includes('token') || fileName.includes('theme')) return 200;
      if (fileName.includes('reset') || fileName.includes('normalize') || fileName.includes('preflight')) return 210;
      if (fileName.includes('base') || fileName.includes('global') || fileName.includes('index') || fileName.includes('app')) return 220;
      if (fileName.includes('typography') || fileName.includes('font')) return 230;
      if (fileName.includes('layout') || fileName.includes('grid') || fileName.includes('container')) return 240;
      if (fileName.includes('component') || fileName.includes('section') || fileName.includes('header') || fileName.includes('footer')) return 250;
      if (fileName.includes('responsive') || fileName.includes('media') || fileName.includes('mobile') || fileName.includes('override')) return 260;
      return 270;
    };
    chosenStyleEntries.sort(([a], [b]) => getCascadeRank(a) - getCascadeRank(b));
  }

  const inlinedFilesSet = new Set<string>(processedCanonicalKeys);

  chosenStyleEntries.forEach(([filePath, rawContent]) => {
    if (!rawContent || !rawContent.trim()) return;
    const lowerPath = filePath.toLowerCase();

    if (lowerPath.endsWith('.scss') || lowerPath.endsWith('.sass')) preprocessors.add('scss');
    if (lowerPath.endsWith('.less')) preprocessors.add('less');

    if (rawContent.includes('@import "tailwindcss"') || rawContent.includes("@import 'tailwindcss'") || rawContent.includes('@tailwind')) {
      hasTailwind = true;
    }

    const isModule = lowerPath.includes('.module.');
    const baseName = filePath.split('/').pop()?.replace(/\.(module|css|scss|sass|less)/gi, '').replace(/[^a-zA-Z0-9]/g, '_') || 'style';

    const preprocessed = preprocessCSSLike(rawContent, filePath);
    const inlinedCSS = inlineCSSImports(preprocessed, filePath, sectionFiles, inlinedFilesSet);

    if (isModule) {
      componentStyles.push(filePath);
      const classMap: Record<string, string> = {};

      const scopedCSS = inlinedCSS.replace(/\.([a-zA-Z0-9_-]+)/g, (match, className) => {
        if (reservedPseudos.has(className) || /^\d/.test(className)) {
          return match;
        }
        const scopedName = `${baseName}_${className}__${scopeHash}`;
        classMap[className] = scopedName;
        return `.${scopedName}`;
      });

      cssChunks.push(`/* CSS Module: ${filePath} */\n${scopedCSS}`);

      cssModuleMap[filePath] = classMap;
      const normKey = filePath.replace(/^(\.\/|\.\.\/)+/, '').replace(/^\/+/, '');
      cssModuleMap[normKey] = classMap;
      cssModuleMap[`./${normKey}`] = classMap;
      cssModuleMap[`../${normKey}`] = classMap;
      cssModuleMap[`/styles/${filePath.split('/').pop()}`] = classMap;
      cssModuleMap[`./styles/${filePath.split('/').pop()}`] = classMap;
      cssModuleMap[`../styles/${filePath.split('/').pop()}`] = classMap;
    } else {
      globalStyles.push(filePath);

      let resolvedContent = inlinedCSS;

      // Rewrite relative asset URLs in CSS using assetMap base64 data URLs or /api/template-assets endpoint
      resolvedContent = resolvedContent.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi, (match, urlPath) => {
        if (urlPath.startsWith('data:') || urlPath.startsWith('http://') || urlPath.startsWith('https://') || urlPath.startsWith('//')) {
          return match;
        }
        const cleanPath = urlPath.replace(/^(\.\.|\.)\//, '').replace(/^\/+/, '');
        if (assetMap && Object.keys(assetMap).length > 0) {
          const assetKey = Object.keys(assetMap).find(k => k === cleanPath || k.endsWith('/' + cleanPath) || k.endsWith(cleanPath));
          if (assetKey && assetMap[assetKey]) {
            return `url("${assetMap[assetKey]}")`;
          }
        }
        return `url("/api/template-assets?templateId=${encodeURIComponent(templateId)}&path=${encodeURIComponent(cleanPath)}")`;
      });

      cssChunks.push(`/* Global Style: ${filePath} */\n${resolvedContent}`);
    }
  });

  const rawCombined = cssChunks.join('\n\n');

  // Clean up any unhandled Tailwind build directives (e.g. @import "tailwindcss/base", @import "tailwindcss/components", @import "tailwindcss/utilities", @import "tailwindcss")
  const preCleaned = rawCombined.replace(/@import\s+(?:url\(['"]?([^'")]+)['"]?\)|['"]([^'"]+)['"])\s*;?/gi, (match, p1, p2) => {
    const path = (typeof p1 === 'string' ? p1 : (typeof p2 === 'string' ? p2 : '')).trim();
    if (path.includes('tailwindcss') || path.includes('tailwind')) {
      return `/* Tailwind build directive "${path}" stripped for runtime */`;
    }
    return match;
  });

  // Extract remaining external @import statements and hoist them to the absolute top of the stylesheet
  const importStatements: string[] = [];
  const bodyWithoutImports = preCleaned.replace(/@import\s+(?:url\(['"]?([^'")]+)['"]?\)|['"]([^'"]+)['"])\s*;?/gi, (match, p1, p2) => {
    const importPath = (typeof p1 === 'string' ? p1 : (typeof p2 === 'string' ? p2 : '')).trim();
    if (
      importPath.startsWith('http://') ||
      importPath.startsWith('https://') ||
      importPath.startsWith('//') ||
      importPath.includes('fonts.googleapis')
    ) {
      importStatements.push(match);
      return '';
    }
    return `/* Local @import "${importPath}" stripped */`;
  });

  const combinedCSS = [
    ...Array.from(new Set(importStatements)),
    bodyWithoutImports
  ].filter(Boolean).join('\n\n');

  let cleanCombined = combinedCSS;

  console.log('[CV DEBUG][CSS TRANSFORM]', {
    originalLength: rawCombined.length,
    processedLength: cleanCombined.length,
    changed: rawCombined.length !== cleanCombined.length,
    importStatementsCount: importStatements.length,
    cssChunksCount: cssChunks.length
  });

  const result: DiscoveredCSSResult = {
    manifest: {
      globalStyles,
      componentStyles,
      styleImports,
      externalStyles: Array.from(externalStyles),
      tailwind: hasTailwind,
      postcss: hasPostCSS,
      preprocessors: Array.from(preprocessors)
    },
    combinedCSS: cleanCombined,
    cssModuleMap
  };

  cssDiscoveryCache.set(cacheKey, result);
  return result;
}

function generateTailwindUtilityFallbackCSS(): string {
  return `
/* --- Universal Layout & Grid System --- */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }

.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

.col-span-1 { grid-column: span 1 / span 1; }
.col-span-2 { grid-column: span 2 / span 2; }
.col-span-3 { grid-column: span 3 / span 3; }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-5 { grid-column: span 5 / span 5; }
.col-span-6 { grid-column: span 6 / span 6; }
.col-span-7 { grid-column: span 7 / span 7; }
.col-span-8 { grid-column: span 8 / span 8; }
.col-span-9 { grid-column: span 9 / span 9; }
.col-span-10 { grid-column: span 10 / span 10; }
.col-span-11 { grid-column: span 11 / span 11; }
.col-span-12 { grid-column: span 12 / span 12; }
.col-span-full { grid-column: 1 / -1; }

.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-5 { gap: 1.25rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
.gap-10 { gap: 2.5rem; }
.gap-12 { gap: 3rem; }
.gap-16 { gap: 4rem; }

.w-full { width: 100%; }
.max-w-7xl { max-width: 80rem; }
.max-w-6xl { max-width: 72rem; }
.max-w-5xl { max-width: 64rem; }
.max-w-4xl { max-width: 56rem; }
.max-w-3xl { max-width: 48rem; }
.max-w-2xl { max-width: 42rem; }
.max-w-xl { max-width: 36rem; }
.max-w-lg { max-width: 32rem; }
.max-w-md { max-width: 28rem; }
.max-w-sm { max-width: 24rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

.relative { position: relative; }
.absolute { position: absolute; }
.sticky { position: sticky; }
.top-0 { top: 0; }
.top-28 { top: 7rem; }
.inset-0 { inset: 0; }

@media (min-width: 640px) {
  .sm\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sm\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .sm\\:flex-row { flex-direction: row; }
  .sm\\:px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
}

@media (min-width: 768px) {
  .md\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .md\\:col-span-1 { grid-column: span 1 / span 1; }
  .md\\:col-span-2 { grid-column: span 2 / span 2; }
  .md\\:col-span-3 { grid-column: span 3 / span 3; }
  .md\\:col-span-4 { grid-column: span 4 / span 4; }
  .md\\:col-span-6 { grid-column: span 6 / span 6; }
  .md\\:col-span-8 { grid-column: span 8 / span 8; }
  .md\\:flex-row { flex-direction: row; }
  .md\\:items-end { align-items: flex-end; }
  .md\\:items-center { align-items: center; }
  .md\\:mt-0 { margin-top: 0; }
  .md\\:py-32 { padding-top: 8rem; padding-bottom: 8rem; }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .lg\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
  .lg\\:col-span-1 { grid-column: span 1 / span 1; }
  .lg\\:col-span-2 { grid-column: span 2 / span 2; }
  .lg\\:col-span-3 { grid-column: span 3 / span 3; }
  .lg\\:col-span-4 { grid-column: span 4 / span 4; }
  .lg\\:col-span-5 { grid-column: span 5 / span 5; }
  .lg\\:col-span-6 { grid-column: span 6 / span 6; }
  .lg\\:col-span-7 { grid-column: span 7 / span 7; }
  .lg\\:col-span-8 { grid-column: span 8 / span 8; }
  .lg\\:col-span-9 { grid-column: span 9 / span 9; }
  .lg\\:col-span-10 { grid-column: span 10 / span 10; }
  .lg\\:col-span-11 { grid-column: span 11 / span 11; }
  .lg\\:col-span-12 { grid-column: span 12 / span 12; }
  .lg\\:flex-row { flex-direction: row; }
}
`;
}
