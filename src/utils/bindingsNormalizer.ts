/**
 * bindingsNormalizer.ts — CampusCV Universal Bindings Normalizer
 *
 * Normalizes template bindings from both dictionary format (`mappings: { "hero.title": "file.jsx" }`)
 * and array format (`bindings: [{ field: "hero.title", targetFile: "file.jsx", ... }]`)
 * into a single canonical representation.
 */

export interface NormalizedBindingField {
  field: string;
  targetFile: string;
  component?: string;
  type: 'string' | 'image' | 'collection' | 'object' | 'link' | 'unknown';
}

export interface NormalizedBindings {
  templateId: string;
  fields: NormalizedBindingField[];
}

export function normalizeBindings(rawBindings: any): NormalizedBindings {
  if (!rawBindings || typeof rawBindings !== 'object') {
    return {
      templateId: 'unknown',
      fields: []
    };
  }

  const templateId = rawBindings.templateId || rawBindings.id || 'template';
  const fields: NormalizedBindingField[] = [];

  // Format A: bindings array format
  if (Array.isArray(rawBindings.bindings)) {
    for (const item of rawBindings.bindings) {
      if (item && typeof item === 'object' && item.field) {
        fields.push({
          field: item.field,
          targetFile: item.targetFile || item.file || '',
          component: item.component || item.section || '',
          type: item.type || (item.field.includes('Url') || item.field.includes('photo') || item.field.includes('avatar') || item.field.includes('image') ? 'image' : 'string')
        });
      }
    }
  }

  // Format B: mappings object dictionary format
  if (rawBindings.mappings && typeof rawBindings.mappings === 'object') {
    for (const [fieldKey, targetFileVal] of Object.entries(rawBindings.mappings)) {
      const targetFileStr = typeof targetFileVal === 'string' ? targetFileVal : (targetFileVal as any)?.targetFile || '';
      // Avoid duplicate field entries
      if (!fields.some((f) => f.field === fieldKey)) {
        fields.push({
          field: fieldKey,
          targetFile: targetFileStr,
          type: fieldKey.includes('Url') || fieldKey.includes('photo') || fieldKey.includes('avatar') || fieldKey.includes('image') ? 'image' : 'string'
        });
      }
    }
  }

  return {
    templateId,
    fields
  };
}
