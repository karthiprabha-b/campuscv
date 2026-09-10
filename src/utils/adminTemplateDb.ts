import { TemplateRecord, TemplateStatus, FieldCounts, ValidationReport, EditorCompatibilityFlags, TemplateAnalyticsRecord } from '../types/adminTemplate';
import { templateStorage } from './templateStorage';

export interface TemplatePackage {
  manifest: { id: string; name: string; version: string; author?: string; description?: string; thumbnail?: string; preview?: string };
  sectionFiles: Record<string, string>;
}

const defaultFieldCounts: FieldCounts = { text: 0, images: 0, buttons: 0, links: 0, lists: 0, cards: 0, tags: 0, timeline: 0, skills: 0, social: 0, total: 0 };
const defaultValidationReport: ValidationReport = { score: 100, isValid: true, checks: [], errors: [], warnings: [], validatedAt: new Date().toISOString() };
const defaultEditorCompatibility: EditorCompatibilityFlags = { text: true, image: true, button: true, social: true, projects: true, experience: true, skills: true, education: true, gallery: true, timeline: true, customSections: true };
const defaultAnalytics: TemplateAnalyticsRecord = { installCount: 0, publishedPortfolios: 0, templateViews: 0, previewCount: 0, usagePercent: 0, avgLoadTimeMs: 0, validationScore: 100 };

export interface AdminTemplateRecord extends TemplateRecord {
  preview: string;
  isCustomUploaded?: boolean;
}

export const ADMIN_TEMPLATE_CATALOG: AdminTemplateRecord[] = [];

class AdminTemplateDatabase {
  private templates: AdminTemplateRecord[] = [];
  private isInitialized = false;

  constructor() {
    this.initFromDefaults();
  }

  private initFromDefaults() {
    if (this.isInitialized) return;
    this.templates = ADMIN_TEMPLATE_CATALOG.map(t => ({ ...t }));
    this.isInitialized = true;
  }

  /**
   * Returns only ACTIVE templates available for new user selection.
   */
  public getActiveTemplates(): AdminTemplateRecord[] {
    return this.templates.filter(t => (t.status || 'active') === 'active');
  }

  /**
   * Returns all active + disabled templates for Admin management.
   */
  public getAllTemplates(includeDeleted: boolean = false): AdminTemplateRecord[] {
    return this.templates.filter(t => includeDeleted || t.status !== 'deleted');
  }

  /**
   * By default, returns active templates for user-facing template selectors.
   */
  public getTemplates(): AdminTemplateRecord[] {
    return this.getActiveTemplates();
  }

  public getTemplate(id: string): AdminTemplateRecord | undefined {
    return this.getTemplateById(id);
  }

  public getTemplateById(id: string): AdminTemplateRecord | undefined {
    if (!id) return undefined;
    const cleanId = id.trim().toLowerCase();
    return this.templates.find(t => t.id.toLowerCase() === cleanId);
  }

  /**
   * Synchronizes with canonical server registry (/api/templates).
   * Server registry status strictly overrides any default state.
   */
  public async syncWithServerRegistryAsync(includeDisabled: boolean = true): Promise<AdminTemplateRecord[]> {
    try {
      if (typeof window !== 'undefined') {
        const url = `/api/templates?includeDisabled=${includeDisabled ? 'true' : 'false'}&includeDeleted=true`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.templates)) {
            const serverTemplates: any[] = data.templates;
            const serverMap = new Map<string, any>(serverTemplates.map(t => [t.id, t]));

            // Update existing or add new from server
            const merged: AdminTemplateRecord[] = [];

            // 1. Process server records
            serverTemplates.forEach(st => {
              const localMatch = ADMIN_TEMPLATE_CATALOG.find(d => d.id === st.id) || this.templates.find(d => d.id === st.id);
              const rec: AdminTemplateRecord = {
                ...(localMatch || {}),
                ...st,
                id: st.id,
                name: st.name || localMatch?.name || st.id,
                category: st.category || localMatch?.category || 'general',
                version: st.version || localMatch?.version || '1.0.0',
                status: (st.status || 'active') as TemplateStatus,
                currentVersionId: st.currentVersionId || (localMatch as any)?.currentVersionId || 'v1',
                thumbnail: st.thumbnail || localMatch?.thumbnail || '',
                preview: st.preview || localMatch?.preview || '',
                supportsDarkMode: st.supportsDarkMode ?? localMatch?.supportsDarkMode ?? true,
                sections: st.sections || localMatch?.sections || ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact'],
                sectionFiles: st.sectionFiles || localMatch?.sectionFiles || {},
                customCSS: st.customCSS || localMatch?.customCSS || '',
                templateCode: st.templateCode || localMatch?.templateCode || '',
                fieldCounts: st.fieldCounts || localMatch?.fieldCounts || defaultFieldCounts,
                sectionsCount: st.sectionsCount || (st.sections?.length ?? localMatch?.sectionsCount ?? 6),
                assetsCount: st.assetsCount || localMatch?.assetsCount || 0,
                validationReport: st.validationReport || localMatch?.validationReport || defaultValidationReport,
                editorCompatibility: st.editorCompatibility || localMatch?.editorCompatibility || defaultEditorCompatibility,
                analytics: st.analytics || localMatch?.analytics || defaultAnalytics,
                createdAt: st.createdAt || localMatch?.createdAt || new Date().toISOString(),
                updatedAt: st.updatedAt || localMatch?.updatedAt || new Date().toISOString(),
              };
              merged.push(rec);
            });

            // 2. Built-in templates not explicitly present in server map
            // Only add if not recorded as deleted on server
            ADMIN_TEMPLATE_CATALOG.forEach(builtIn => {
              if (!serverMap.has(builtIn.id)) {
                merged.push({ ...builtIn });
              }
            });

            this.templates = merged;
            console.log(`[AdminTemplateDatabase] Synced ${this.templates.length} templates with server canonical registry.`);
            return includeDisabled ? this.getAllTemplates() : this.getActiveTemplates();
          }
        }
      }
    } catch (err) {
      console.error('[AdminTemplateDatabase sync error]', err);
    }
    return includeDisabled ? this.getAllTemplates() : this.getActiveTemplates();
  }

  public getLogs(): any[] {
    return [];
  }

  public saveTemplate(record: Partial<AdminTemplateRecord>): AdminTemplateRecord {
    const id = record.id || 'custom-template';
    const existingIdx = this.templates.findIndex(t => t.id === id);
    const fullRecord: AdminTemplateRecord = {
      id,
      name: record.name || 'Custom Template',
      category: record.category || 'general',
      version: record.version || '1.0.0',
      author: record.author || 'Custom Upload',
      description: record.description || '',
      tags: record.tags || ['custom'],
      supportsDarkMode: record.supportsDarkMode ?? true,
      sections: record.sections || ['Hero', 'About'],
      status: (record.status as TemplateStatus) || 'active',
      downloadCount: record.downloadCount || 0,
      usersCount: record.usersCount || 0,
      zipFileName: record.zipFileName || 'custom-template.zip',
      zipSizeFormatted: record.zipSizeFormatted || '1.0 MB',
      thumbnail: record.thumbnail || '/templates/default/thumbnail.png',
      preview: record.preview || '/templates/default/preview.png',
      fieldCounts: record.fieldCounts || defaultFieldCounts,
      sectionsCount: record.sectionsCount || 2,
      assetsCount: record.assetsCount || 0,
      validationReport: record.validationReport || defaultValidationReport,
      editorCompatibility: record.editorCompatibility || defaultEditorCompatibility,
      analytics: record.analytics || defaultAnalytics,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: record.updatedAt || new Date().toISOString(),
      ...record
    };
    if (existingIdx >= 0) {
      this.templates[existingIdx] = { ...this.templates[existingIdx], ...fullRecord };
    } else {
      this.templates.push(fullRecord);
    }
    return fullRecord;
  }

  public async toggleTemplateStatus(id: string): Promise<AdminTemplateRecord | undefined> {
    const tmpl = this.getTemplateById(id);
    if (!tmpl) return undefined;

    const nextStatus: TemplateStatus = tmpl.status === 'disabled' ? 'active' : 'disabled';
    tmpl.status = nextStatus;

    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/templates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: id,
            action: 'status',
            status: nextStatus
          })
        });
      }
    } catch (e) {
      console.error('[AdminTemplateDatabase toggle status error]', e);
    }

    return tmpl;
  }

  public duplicateTemplate(id: string): AdminTemplateRecord | undefined {
    const tmpl = this.getTemplateById(id);
    if (!tmpl) return undefined;
    const dup: AdminTemplateRecord = {
      ...tmpl,
      id: `${tmpl.id}-copy-${Date.now()}`,
      name: `${tmpl.name} (Copy)`
    };
    this.templates.push(dup);
    return dup;
  }

  public async updateMetadata(id: string, meta: any): Promise<AdminTemplateRecord | undefined> {
    const tmpl = this.getTemplateById(id);
    if (tmpl) {
      Object.assign(tmpl, meta);
      try {
        if (typeof window !== 'undefined') {
          await fetch('/api/templates', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              templateId: id,
              action: 'metadata',
              patch: meta
            })
          });
        }
      } catch (e) {
        console.error('[AdminTemplateDatabase update metadata error]', e);
      }
    }
    return tmpl;
  }

  public async deleteTemplate(id: string): Promise<{ success: boolean; message: string }> {
    // Mark as deleted in local state
    const tmpl = this.getTemplateById(id);
    if (tmpl) {
      tmpl.status = 'deleted';
    }
    const idx = this.templates.findIndex(t => t.id === id);
    if (idx >= 0) {
      this.templates[idx].status = 'deleted';
    }

    try {
      templateStorage.deleteTemplate(id);
      if (typeof window !== 'undefined') {
        try {
          const custom = localStorage.getItem('portly_custom_templates');
          if (custom) {
            const parsed = JSON.parse(custom);
            if (Array.isArray(parsed)) {
              localStorage.setItem('portly_custom_templates', JSON.stringify(parsed.filter((t: any) => t.id !== id)));
            }
          }
        } catch (e) {}

        const res = await fetch(`/api/templates?templateId=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          const json = await res.json();
          return { success: true, message: json.message || `Template '${id}' deleted successfully.` };
        }
      }
    } catch (e) {
      console.error('[adminTemplateDb deleteTemplate server error]', e);
    }
    return { success: true, message: 'Template deleted successfully' };
  }

  public registerCustomTemplate(pkg: TemplatePackage): AdminTemplateRecord {
    return this.saveTemplate({
      id: pkg.manifest.id,
      name: pkg.manifest.name,
      category: 'general',
      version: pkg.manifest.version,
      author: pkg.manifest.author || 'Custom Upload',
      description: pkg.manifest.description || 'Uploaded custom template',
      thumbnail: pkg.manifest.thumbnail || '/templates/default/thumbnail.png',
      preview: pkg.manifest.preview || '/templates/default/preview.png',
      sectionFiles: pkg.sectionFiles,
      isCustomUploaded: true,
      status: 'active'
    });
  }
}

export const adminTemplateDb = new AdminTemplateDatabase();
