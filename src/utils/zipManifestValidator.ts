import { 
  TemplateManifestSchema, 
  TemplateManifest, 
  ValidationReport, 
  FieldCounts, 
  EditorCompatibilityFlags,
  FileTreeNode
} from '../types/adminTemplate';
import { UniversalUploadEngine, ExtractedTemplatePackage } from './universalUploadEngine';

export interface ZipValidationResult {
  isValid: boolean;
  manifest?: TemplateManifest;
  schema?: Record<string, any>;
  bindings?: Record<string, any>;
  assetMap?: Record<string, string>;
  themeConfig?: Record<string, any>;
  sectionFiles?: Record<string, string>;
  filesFound: string[];
  thumbnailUrl?: string;
  previewLightUrl?: string;
  previewDarkUrl?: string;
  customCSS?: string;
  templateCode?: string;
  manifestJson?: string;
  schemaCode?: string;
  bindingsJson?: string;
  fieldCounts: FieldCounts;
  sectionsCount: number;
  assetsCount: number;
  validationReport: ValidationReport;
  editorCompatibility: EditorCompatibilityFlags;
  fileTree: FileTreeNode[];
  error?: string;
}

export function generateFallbackTemplateThumbnail(templateName: string, category: string, primaryColor: string = '#7C3AED'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#09090b"/>
    <rect x="0" y="0" width="600" height="40" fill="#18181b"/>
    <circle cx="20" cy="20" r="5" fill="#ef4444"/>
    <circle cx="36" cy="20" r="5" fill="#eab308"/>
    <circle cx="52" cy="20" r="5" fill="#22c55e"/>
    <rect x="80" y="12" width="240" height="16" rx="8" fill="#27272a"/>
    <text x="300" y="140" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="800" text-anchor="middle">${templateName}</text>
    <rect x="220" y="160" width="160" height="28" rx="14" fill="${primaryColor}" opacity="0.2"/>
    <text x="300" y="179" fill="${primaryColor}" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="1">${category.toUpperCase()}</text>
    <rect x="60" y="220" width="480" height="1" fill="#27272a"/>
    <rect x="60" y="250" width="140" height="80" rx="12" fill="#18181b" stroke="#27272a"/>
    <rect x="230" y="250" width="140" height="80" rx="12" fill="#18181b" stroke="#27272a"/>
    <rect x="400" y="250" width="140" height="80" rx="12" fill="#18181b" stroke="#27272a"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function validateAndExtractTemplateZip(file: File, existingIds: string[] = []): Promise<ZipValidationResult> {
  const result: ExtractedTemplatePackage = await UniversalUploadEngine.processZipPackage(file, existingIds);

  return {
    isValid: result.isValid,
    manifest: result.manifest,
    schema: result.schema,
    bindings: result.bindings,
    assetMap: result.assetMap,
    themeConfig: result.manifest?.themeConfig || {},
    sectionFiles: result.sectionFiles,
    filesFound: result.fileTree.map(f => f.path),
    thumbnailUrl: result.thumbnailUrl,
    customCSS: result.customCSS,
    templateCode: result.templateCode,
    manifestJson: result.manifestJson,
    schemaCode: result.schemaJson,
    bindingsJson: result.bindingsJson,
    fieldCounts: result.fieldCounts,
    sectionsCount: result.sectionsCount,
    assetsCount: result.assetsCount,
    validationReport: result.validationReport,
    editorCompatibility: result.editorCompatibility,
    fileTree: result.fileTree,
    error: result.error
  };
}
