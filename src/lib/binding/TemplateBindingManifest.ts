/**
 * TemplateBindingManifest.ts — Template Binding Manifest Auto-Generator & Storage
 *
 * Generates template.binding.json containing pre-discovered field targets and confidence scores
 * when a template package is uploaded or loaded.
 */

import { DetectionResult } from './SemanticFieldDetector';

export interface ManifestBindingEntry {
  field: string;
  target: string;
  confidence: number;
  source: 'EXPLICIT' | 'MANIFEST' | 'AUTO_DETECTED' | 'DEMO_PLACEHOLDER';
}

export interface TemplateBindingManifestRecord {
  templateId: string;
  version: string;
  generatedAt: string;
  bindings: ManifestBindingEntry[];
}

/**
 * Generates a template.binding.json manifest object from discovered field bindings.
 */
export function generateTemplateBindingManifest(
  templateId: string,
  bindingsMap: Map<string, DetectionResult>
): TemplateBindingManifestRecord {
  const bindings: ManifestBindingEntry[] = [];

  bindingsMap.forEach((result, targetId) => {
    if (result && result.field && result.confidence >= 0.70) {
      bindings.push({
        field: result.field,
        target: targetId,
        confidence: result.confidence,
        source: result.source
      });
    }
  });

  return {
    templateId,
    version: 'v1',
    generatedAt: new Date().toISOString(),
    bindings
  };
}

/**
 * Serializes template binding manifest record to formatted JSON string.
 */
export function serializeBindingManifest(manifest: TemplateBindingManifestRecord): string {
  return JSON.stringify(manifest, null, 2);
}

/**
 * Deserializes JSON string to TemplateBindingManifestRecord.
 */
export function parseBindingManifest(jsonStr: string): TemplateBindingManifestRecord | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.templateId && Array.isArray(parsed.bindings)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
