/**
 * installedTemplateResolver.ts — Canonical Single Source of Truth Template Resolver
 *
 * Ensures Admin Preview, Editor, Live Preview, and Published Portfolio ALL resolve the exact
 * same installed template record and package files for a given templateId.
 */

import { adminTemplateDb } from './adminTemplateDb';
import { templateStorage } from './templateStorage';
import { discoverTemplateCSS } from './UniversalCSSDiscovery';

export interface TemplateCapabilities {
  profile: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  experience: boolean;
  achievements: boolean;
  certifications: boolean;
  contact: boolean;
}

export interface InstalledTemplateRecord {
  id: string;
  name: string;
  version: string;
  sourceType: 'builtin' | 'uploaded' | 'react' | 'html';
  entryPath: string;
  schemaVersion: string;
  capabilities: TemplateCapabilities;
  manifest: any;
  sectionFiles: Record<string, string>;
  customCSS: string;
  templateCode: string;
  source: 'portfolio' | 'api' | 'adminDb' | 'storage' | 'none';
  status: 'ACTIVE' | 'ERROR' | 'LOADING';
  error?: string;
}

export const DEFAULT_TEMPLATE_CAPABILITIES: TemplateCapabilities = {
  profile: true,
  education: true,
  skills: true,
  projects: true,
  experience: true,
  achievements: true,
  certifications: true,
  contact: true
};

// In-memory single source of truth cache for installed templates
const installedTemplateMemoryCache = new Map<string, InstalledTemplateRecord>();

/**
 * Synchronous resolution of an installed template by ID.
 */
export function resolveInstalledTemplateSync(templateId: string, portfolio?: any): InstalledTemplateRecord {
  const normId = (templateId || portfolio?.templateId || portfolio?.layoutStyle || 'default').trim();

  // 0. Check in-memory fast cache
  if (installedTemplateMemoryCache.has(normId)) {
    const cached = installedTemplateMemoryCache.get(normId)!;
    if (Object.keys(cached.sectionFiles).length > 0) {
      return cached;
    }
  }

  // 1. Check embedded portfolio sectionFiles (if exact match and complete)
  const embeddedId = portfolio?._sectionFilesTemplateId || portfolio?.sectionFilesTemplateId || portfolio?.manifest?.id || portfolio?.manifest?.template?.id || portfolio?.templateId;
  const hasRealCode = portfolio?.sectionFiles && Object.keys(portfolio.sectionFiles).some(k => (k.includes('src/') || k.endsWith('.jsx') || k.endsWith('.tsx')) && !k.endsWith('.d.ts'));
  if (portfolio?.sectionFiles && Object.keys(portfolio.sectionFiles).length >= 10 && hasRealCode && (!embeddedId || embeddedId === normId)) {
    const discovered = discoverTemplateCSS(portfolio.sectionFiles, 'tpl', portfolio.assetMap, normId);
    const rec: InstalledTemplateRecord = {
      id: normId,
      name: normId,
      version: '1.0.0',
      sourceType: 'uploaded',
      entryPath: 'src/App.jsx',
      schemaVersion: '1',
      capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
      manifest: portfolio.manifest || {},
      sectionFiles: portfolio.sectionFiles,
      customCSS: discovered.combinedCSS || portfolio.customCSS || '',
      templateCode: portfolio.templateCode || '',
      source: 'portfolio',
      status: 'ACTIVE'
    };
    installedTemplateMemoryCache.set(normId, rec);
    return rec;
  }

  // 2. Check adminTemplateDb
  try {
    const adminTmpl = adminTemplateDb.getTemplateById(normId);
    if (adminTmpl && adminTmpl.sectionFiles && Object.keys(adminTmpl.sectionFiles).length > 0) {
      const discovered = discoverTemplateCSS(adminTmpl.sectionFiles, 'tpl', adminTmpl.assetMap, normId);
      return {
        id: normId,
        name: adminTmpl.name || normId,
        version: adminTmpl.version || '1.0.0',
        sourceType: 'uploaded',
        entryPath: (adminTmpl as any).entryFile || 'src/App.jsx',
        schemaVersion: '1',
        capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
        manifest: (adminTmpl as any).manifest || {},
        sectionFiles: adminTmpl.sectionFiles,
        customCSS: discovered.combinedCSS || adminTmpl.customCSS || '',
        templateCode: adminTmpl.templateCode || '',
        source: 'adminDb',
        status: 'ACTIVE'
      };
    }
  } catch (e) {}

  // 3. Check templateStorage memory cache
  try {
    const cached = templateStorage.getTemplateSync(normId);
    if (cached && cached.sectionFiles && Object.keys(cached.sectionFiles).length > 0) {
      const discovered = discoverTemplateCSS(cached.sectionFiles, 'tpl', cached.assetMap, normId);
      return {
        id: normId,
        name: cached.name || normId,
        version: cached.version || '1.0.0',
        sourceType: 'uploaded',
        entryPath: cached.entryFile || 'src/App.jsx',
        schemaVersion: '1',
        capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
        manifest: cached.manifest || {},
        sectionFiles: cached.sectionFiles,
        customCSS: discovered.combinedCSS || cached.customCSS || '',
        templateCode: cached.templateCode || '',
        source: 'storage',
        status: 'ACTIVE'
      };
    }
  } catch (e) {}

  // 4. Server-side / local disk fallback
  if (typeof window === 'undefined') {
    try {
      const { getTemplateFilesServer } = require('../lib/serverTemplateStore');
      const diskTmpl = getTemplateFilesServer(normId);
      if (diskTmpl && diskTmpl.files && Object.keys(diskTmpl.files).length > 0) {
        const discovered = discoverTemplateCSS(diskTmpl.files, 'tpl', undefined, normId);
        return {
          id: normId,
          name: normId,
          version: '1.0.0',
          sourceType: 'uploaded',
          entryPath: diskTmpl.entryFile || 'src/App.jsx',
          schemaVersion: '1',
          capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
          manifest: {},
          sectionFiles: diskTmpl.files,
          customCSS: discovered.combinedCSS || '',
          templateCode: diskTmpl.files['src/template.jsx'] || diskTmpl.files['template.jsx'] || diskTmpl.files['src/App.jsx'] || '',
          source: 'storage',
          status: 'ACTIVE'
        };
      }
    } catch (e) {}
  }

  return {
    id: normId,
    name: normId,
    version: '1.0.0',
    sourceType: normId === 'default' ? 'builtin' : 'uploaded',
    entryPath: '',
    schemaVersion: '1',
    capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
    manifest: {},
    sectionFiles: {},
    customCSS: '',
    templateCode: '',
    source: 'none',
    status: normId === 'default' ? 'ACTIVE' : 'LOADING'
  };
}

/**
 * Asynchronous resolution of an installed template by ID.
 */
export async function resolveInstalledTemplateAsync(templateId: string, portfolio?: any): Promise<InstalledTemplateRecord> {
  const syncRecord = resolveInstalledTemplateSync(templateId, portfolio);
  if (Object.keys(syncRecord.sectionFiles).length > 0 || syncRecord.id === 'default') {
    return syncRecord;
  }

  const normId = syncRecord.id;

  // 1. Fetch from /api/template-files endpoint
  try {
    const res = await fetch(`/api/template-files?templateId=${encodeURIComponent(normId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json?.files && Object.keys(json.files).length > 0) {
        const discovered = discoverTemplateCSS(json.files, 'tpl', undefined, normId);
        const record: InstalledTemplateRecord = {
          id: normId,
          name: normId,
          version: '1.0.0',
          sourceType: 'uploaded',
          entryPath: json.entryFile || 'src/App.jsx',
          schemaVersion: '1',
          capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
          manifest: json.manifest || {},
          sectionFiles: json.files,
          customCSS: discovered.combinedCSS || '',
          templateCode: json.files['src/template.jsx'] || json.files['template.jsx'] || json.files['src/index.jsx'] || json.files['index.jsx'] || json.files['src/App.jsx'] || '',
          source: 'api',
          status: 'ACTIVE'
        };

        // Cache in memory and template storage for synchronous lookups
        try {
          templateStorage.cacheInMemory({
            id: normId,
            name: normId,
            version: '1.0.0',
            entryFile: record.entryPath,
            manifest: record.manifest,
            sectionFiles: record.sectionFiles,
            customCSS: record.customCSS,
            templateCode: record.templateCode
          });
          templateStorage.saveTemplateAsync({
            id: normId,
            name: normId,
            version: '1.0.0',
            entryFile: record.entryPath,
            manifest: record.manifest,
            sectionFiles: record.sectionFiles,
            customCSS: record.customCSS,
            templateCode: record.templateCode
          }).catch(() => {});
          adminTemplateDb.saveTemplate({
            id: normId,
            name: normId,
            sectionFiles: record.sectionFiles,
            customCSS: record.customCSS,
            templateCode: record.templateCode,
            status: 'active'
          });
        } catch (e) {}

        installedTemplateMemoryCache.set(normId, record);
        return record;
      }
    }
  } catch (e) {}

  // 2. Fetch from IndexedDB
  try {
    const cached = await templateStorage.getTemplateAsync(normId);
    if (cached && cached.sectionFiles && Object.keys(cached.sectionFiles).length > 0) {
      return {
        id: normId,
        name: cached.name || normId,
        version: cached.version || '1.0.0',
        sourceType: 'uploaded',
        entryPath: cached.entryFile || 'src/App.jsx',
        schemaVersion: '1',
        capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
        manifest: cached.manifest || {},
        sectionFiles: cached.sectionFiles,
        customCSS: cached.customCSS || '',
        templateCode: cached.templateCode || '',
        source: 'storage',
        status: 'ACTIVE'
      };
    }
  } catch (e) {}

  return {
    id: normId,
    name: normId,
    version: '1.0.0',
    sourceType: 'uploaded',
    entryPath: '',
    schemaVersion: '1',
    capabilities: DEFAULT_TEMPLATE_CAPABILITIES,
    manifest: {},
    sectionFiles: {},
    customCSS: '',
    templateCode: '',
    source: 'none',
    status: 'ERROR',
    error: `Template package '${normId}' could not be loaded: No files found on disk or server.`
  };
}
