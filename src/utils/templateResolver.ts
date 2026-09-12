/**
 * templateResolver.ts — Authoritative Template Selection & File Resolver
 *
 * Enforces the primary rule:
 * IF portfolio.templateType === "uploaded" OR templateId !== "default":
 *   ONLY load and render that portfolio's exact uploaded template.
 *   NEVER fall back to DefaultPortfolioLayout, CustomDynamicLayout, starter, sample, or built-in layouts.
 */

import { adminTemplateDb } from './adminTemplateDb';
import { templateStorage } from './templateStorage';
import { discoverTemplateCSS } from './UniversalCSSDiscovery';

export function isUploadedPortfolio(portfolio: any): boolean {
  if (!portfolio) return false;
  if (portfolio.sectionFiles && Object.keys(portfolio.sectionFiles).length > 0) return true;
  const tmplId = (typeof portfolio === 'string' ? portfolio : (portfolio.templateId || portfolio.layoutStyle || portfolio.template_id || '')).toLowerCase();
  return tmplId !== '';
}

const TEMPLATE_ALIASES: Record<string, string> = {
  'doctor': 'doctor-portfolio',
  'doctor portfolio': 'doctor-portfolio',
  'doctor-portfolio': 'doctor-portfolio',
  'doctor_portfolio': 'doctor-portfolio',
  'consultant physician & medical specialist': 'doctor-portfolio',
  'consultant physician & medical portfolio': 'doctor-portfolio',
  'designer': 'designer-portfolio',
  'designer portfolio': 'designer-portfolio',
  'designer-portfolio': 'designer-portfolio',
  'designer_portfolio': 'designer-portfolio',
  'product designer': 'designer-portfolio',
  'product designer portfolio': 'designer-portfolio',
  'product-designer-portfolio': 'designer-portfolio',
  'student': 'student-portfolio',
  'student portfolio': 'student-portfolio',
  'student-portfolio': 'student-portfolio',
  'student_portfolio': 'student-portfolio',
  'slash': 'slash-model',
  'slash model': 'slash-model',
  'slash-model': 'slash-model',
  'slash_model': 'slash-model',
  'cs': 'cs-portfolio',
  'cs portfolio': 'cs-portfolio',
  'cs-portfolio': 'cs-portfolio',
  'cs_portfolio': 'cs-portfolio',
  'static-panel': 'static-panel',
  'static panel': 'static-panel',
  'staticpanel': 'static-panel',
  'static_panel': 'static-panel',
  'static panel portfolio': 'static-panel',
  'centerd': 'centerd',
  'centered': 'centerd',
  'centerd portfolio': 'centerd',
  'centered portfolio': 'centerd',
  'centerd-portfolio': 'centerd',
  'centered-portfolio': 'centerd',
  'card': 'card',
  'card deck': 'card',
  'card-deck': 'card',
  'card deck portfolio': 'card',
  'card-deck-portfolio': 'card',
  'card portfolio': 'card',
  'card-portfolio': 'card',
  'stu-creative-bold': 'stu-creative-bold',
  'stu_creative_bold': 'stu-creative-bold',
  'stu creative bold': 'stu-creative-bold',
  'creative-bold': 'stu-creative-bold',
  'creative_bold': 'stu-creative-bold',
  'creative bold': 'stu-creative-bold',
  'creative bold portfolio': 'stu-creative-bold',
  'bold creative': 'stu-creative-bold',
};

export function getCanonicalTemplateId(rawId?: string): string {
  if (!rawId) return '';
  const clean = rawId.trim().toLowerCase();
  return TEMPLATE_ALIASES[clean] || rawId;
}

export function getPortfolioTemplateId(portfolio: any): string {
  if (!portfolio) return '';
  if (typeof portfolio === 'string' && portfolio.trim() !== '') return getCanonicalTemplateId(portfolio);
  const tmplId = portfolio.templateId || portfolio.layoutStyle || portfolio.template_id;
  if (tmplId && tmplId.trim() !== '') return getCanonicalTemplateId(tmplId);
  return '';
}

export interface ResolvedTemplateFiles {
  templateId: string;
  isUploaded: boolean;
  sectionFiles: Record<string, string>;
  customCSS: string;
  templateCode: string;
  entryFile?: string;
  assetMap?: Record<string, string>;
  manifest?: any;
  source: 'portfolio' | 'api' | 'adminDb' | 'storage' | 'none';
  error?: string;
}

/**
 * Synchronously attempts to resolve template files from embedded data, admin DB, or sync storage.
 */
export function resolveTemplateFilesSync(portfolio: any): ResolvedTemplateFiles {
  const isUploaded = isUploadedPortfolio(portfolio);
  const templateId = getPortfolioTemplateId(portfolio);
  const versionId = portfolio?.templateVersionId || portfolio?.versionId;

  if (!isUploaded || templateId === 'default') {
    return {
      templateId: 'default',
      isUploaded: false,
      sectionFiles: {},
      customCSS: '',
      templateCode: '',
      source: 'none'
    };
  }

  // 1. Server-side / local disk fallback if in Node.js environment
  if (typeof window === 'undefined') {
    try {
      const { getTemplateFilesServer } = require('../lib/serverTemplateStore');
      const diskTmpl = getTemplateFilesServer(templateId);
      if (diskTmpl && diskTmpl.files && Object.keys(diskTmpl.files).length > 0) {
        const discovered = discoverTemplateCSS(diskTmpl.files, 'tpl', undefined, templateId);
        return {
          templateId,
          isUploaded: true,
          sectionFiles: diskTmpl.files,
          customCSS: discovered.combinedCSS || '',
          templateCode: diskTmpl.files['src/template.jsx'] || diskTmpl.files['template.jsx'] || diskTmpl.files['src/index.jsx'] || '',
          source: 'adminDb'
        };
      }
    } catch (e) {}
  }

  // 2. Check adminTemplateDb / catalog
  try {
    const adminTmpl = adminTemplateDb.getTemplateById(templateId);
    if (adminTmpl && adminTmpl.id === templateId && adminTmpl.sectionFiles && Object.keys(adminTmpl.sectionFiles).length > 0) {
      if (!versionId || adminTmpl.currentVersionId === versionId || adminTmpl.version === versionId) {
        const discovered = discoverTemplateCSS(adminTmpl.sectionFiles, 'tpl', adminTmpl.assetMap, templateId);
        return {
          templateId,
          isUploaded: true,
          sectionFiles: adminTmpl.sectionFiles,
          customCSS: discovered.combinedCSS || adminTmpl.customCSS || '',
          templateCode: adminTmpl.templateCode || '',
          source: 'adminDb'
        };
      }
    }
  } catch (e) {}

  // 3. Check templateStorage memory cache / registry
  try {
    const cached = templateStorage.getTemplateSync(templateId);
    if (cached && cached.sectionFiles && Object.keys(cached.sectionFiles).length > 0) {
      const discovered = discoverTemplateCSS(cached.sectionFiles, 'tpl', cached.assetMap, templateId);
      return {
        templateId,
        isUploaded: true,
        sectionFiles: cached.sectionFiles,
        customCSS: discovered.combinedCSS || cached.customCSS || '',
        templateCode: cached.templateCode || '',
        source: 'storage'
      };
    }
  } catch (e) {}

  // 4. Check embedded files on portfolio JSON as fallback only for custom templates
  const embeddedTemplateId = portfolio?._sectionFilesTemplateId || portfolio?.sectionFilesTemplateId || portfolio?.manifest?.id || portfolio?.manifest?.template?.id;
  const embeddedId = portfolio?._sectionFilesTemplateId || portfolio?.sectionFilesTemplateId || portfolio?.manifest?.id || portfolio?.manifest?.template?.id || portfolio?.templateId;
  if (
    portfolio?.sectionFiles &&
    Object.keys(portfolio.sectionFiles).length > 0 &&
    (!embeddedId || embeddedId === templateId)
  ) {
    const discovered = discoverTemplateCSS(portfolio.sectionFiles, 'tpl', portfolio.assetMap, templateId);
    return {
      templateId,
      isUploaded: true,
      sectionFiles: portfolio.sectionFiles,
      customCSS: discovered.combinedCSS || portfolio.customCSS || '',
      templateCode: portfolio.templateCode || '',
      source: 'portfolio'
    };
  }

  return {
    templateId,
    isUploaded: true,
    sectionFiles: {},
    customCSS: '',
    templateCode: '',
    source: 'none'
  };
}

/**
 * Asynchronously loads template files from API endpoint with strict versionId.
 * NEVER returns a default template or fallback template for uploaded portfolios.
 */
export async function loadTemplateFilesAsync(portfolio: any): Promise<ResolvedTemplateFiles> {
  const isUploaded = isUploadedPortfolio(portfolio);
  const templateId = getPortfolioTemplateId(portfolio);
  const versionId = portfolio?.templateVersionId || portfolio?.versionId;

  if (!isUploaded || templateId === 'default') {
    return resolveTemplateFilesSync(portfolio);
  }

  // 1. Always prioritize fetching live template files from server API route
  try {
    const url = `/api/template-files?templateId=${encodeURIComponent(templateId)}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    if (res.ok) {
      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch (e) {}

      if (json?.files && Object.keys(json.files).length > 0) {
        const discovered = discoverTemplateCSS(json.files, 'tpl', undefined, templateId);
        return {
          templateId,
          isUploaded: true,
          sectionFiles: json.files,
          customCSS: discovered.combinedCSS || '',
          templateCode: json.files['src/template.jsx'] || json.files['template.jsx'] || '',
          source: 'api'
        };
      }
    }
  } catch (err) {}

  // 2. Fall back to sync resolver if API call unavailable
  const syncResolved = resolveTemplateFilesSync(portfolio);
  if (Object.keys(syncResolved.sectionFiles).length > 0) {
    return syncResolved;
  }

  // 3. Try loading from IndexedDB storage
  try {
    const cached = await templateStorage.getTemplateAsync(templateId);
    if (cached && cached.id === templateId && cached.sectionFiles && Object.keys(cached.sectionFiles).length > 0) {
      const discovered = discoverTemplateCSS(cached.sectionFiles, 'tpl', cached.assetMap, templateId);
      return {
        templateId,
        isUploaded: true,
        sectionFiles: cached.sectionFiles,
        customCSS: discovered.combinedCSS || cached.customCSS || '',
        templateCode: cached.templateCode || '',
        source: 'storage'
      };
    }
  } catch (err) {}

  // If still no files found for an uploaded template, return explicit error state (NO DEFAULT FALLBACK)
  return {
    templateId,
    isUploaded: true,
    sectionFiles: {},
    customCSS: '',
    templateCode: '',
    source: 'none',
    error: `Uploaded template '${templateId}' (versionId: ${versionId || 'current'}) could not be loaded: No template files found.`
  };
}


export interface CanonicalResolvedTemplate {
  id: string;
  name: string;
  source: 'portfolio' | 'api' | 'adminDb' | 'storage' | 'none';
  entry: string;
  preview: string;
  manifest: any;
  runtime: any;
  sectionFiles: Record<string, string>;
  customCSS: string;
  error?: string;
}

export function resolveTemplate(rawId?: string, portfolio?: any): CanonicalResolvedTemplate {
  const reqId = getPortfolioTemplateId(portfolio) || getCanonicalTemplateId(rawId) || '';
  const sync = resolveTemplateFilesSync(portfolio || { templateId: reqId, layoutStyle: reqId, templateType: 'uploaded' });

  let adminTmpl = null;
  try {
    adminTmpl = reqId ? adminTemplateDb.getTemplateById(reqId) : null;
  } catch (e) {}
  const tmplName = adminTmpl?.name || portfolio?.templateName || reqId;

  console.log('[TEMPLATE RESOLUTION]', {
    requestedTemplateId: rawId || portfolio?.templateId || portfolio?.layoutStyle,
    activeTemplateId: reqId,
    resolvedTemplateId: sync.templateId,
    templateName: tmplName,
    templateSource: sync.source,
    templatePath: 'src/templates/' + reqId,
    previewPath: adminTmpl?.thumbnail || '',
    fallbackUsed: sync.source === 'none'
  });

  return {
    id: sync.templateId,
    name: tmplName,
    source: sync.source,
    entry: sync.entryFile || 'src/index.jsx',
    preview: adminTmpl?.thumbnail || '',
    manifest: portfolio?.manifest || (adminTmpl as any)?.manifest || {},
    runtime: sync.templateCode || '',
    sectionFiles: sync.sectionFiles || {},
    customCSS: sync.customCSS || '',
    error: sync.error
  };
}
