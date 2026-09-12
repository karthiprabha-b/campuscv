import { z } from 'zod';

// Zod Schema for template manifest.json validation
export const TemplateManifestSchema = z.object({
  id: z.string().min(1, "Template ID is required").default("custom-template"),
  name: z.string().default("Custom Template"),
  version: z.string().default("1.0.0"),
  author: z.string().default("Admin Upload"),
  description: z.string().default("Uploaded portfolio template package."),
  category: z.string().default("Developer"),
  supportsDarkMode: z.boolean().default(true),
  supportsLightMode: z.boolean().default(true),
  tags: z.array(z.string()).optional().default(["portfolio", "responsive"]),
  supportedFeatures: z.array(z.string()).optional().default(["inline-editing", "custom-styles", "dark-mode"]),
  sections: z.array(z.string()).default(["Hero", "About", "Skills", "Projects", "Experience", "Contact"]),
  fontLinks: z.array(z.string()).optional().default([]),
  planTier: z.enum(['free', 'monthly', 'quarterly', 'yearly', 'pro']).optional(),
  themeConfig: z.object({
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    fontFamily: z.string().optional()
  }).optional()
});

export type TemplateManifest = z.infer<typeof TemplateManifestSchema>;

export type TemplateStatus = 'active' | 'disabled' | 'deleted' | 'draft' | 'archived' | 'broken' | 'validation-failed';

export interface FieldCounts {
  text: number;
  images: number;
  buttons: number;
  links: number;
  lists: number;
  cards: number;
  tags: number;
  timeline: number;
  skills: number;
  social: number;
  total: number;
}

export interface ValidationCheckItem {
  id: string;
  name: string;
  passed: boolean;
  message: string;
  critical?: boolean;
}

export interface ValidationReport {
  score: number;
  isValid: boolean;
  checks: ValidationCheckItem[];
  errors: string[];
  warnings: string[];
  validatedAt: string;
}

export interface EditorCompatibilityFlags {
  text: boolean;
  image: boolean;
  button: boolean;
  social: boolean;
  projects: boolean;
  experience: boolean;
  skills: boolean;
  education: boolean;
  gallery: boolean;
  timeline: boolean;
  customSections: boolean;
}

export interface TemplateAnalyticsRecord {
  installCount: number;
  publishedPortfolios: number;
  templateViews: number;
  previewCount: number;
  usagePercent: number;
  avgLoadTimeMs: number;
  validationScore: number;
}

export interface FileTreeNode {
  path: string;
  sizeFormatted: string;
  type: 'code' | 'asset' | 'config' | 'style' | 'document';
}

export interface TemplateVersionEntry {
  versionId: string;
  version: string;
  sourcePath: string;
  fileCount: number;
  createdAt: string;
}

export interface TemplateRecord {
  id: string;
  currentVersionId?: string;
  versions?: TemplateVersionEntry[];
  name: string;
  version: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  supportsDarkMode: boolean;
  supportsLightMode?: boolean;
  sections: string[];
  fontLinks?: string[];
  status: TemplateStatus;
  downloadCount: number;
  usersCount: number;
  zipFileName: string;
  zipSizeFormatted: string;
  thumbnail: string;
  previewLight?: string;
  previewDark?: string;
  customCSS?: string;
  templateCode?: string;
  themeConfig?: Record<string, any>;
  sectionFiles?: Record<string, string>;
  bindings?: Record<string, any>;
  schema?: Record<string, any>;
  assetMap?: Record<string, string>;
  fieldCounts: FieldCounts;
  sectionsCount: number;
  assetsCount: number;
  validationReport: ValidationReport;
  editorCompatibility: EditorCompatibilityFlags;
  analytics: TemplateAnalyticsRecord;
  fileTree?: FileTreeNode[];
  manifestJson?: string;
  schemaCode?: string;
  bindingsJson?: string;
  createdAt: string;
  updatedAt: string;
  // Marketplace & Plan Tier fields
  planTier?: 'free' | 'monthly' | 'quarterly' | 'yearly' | 'pro' | string;
  isPremium?: boolean;
  price?: number;
  purchasedBy?: string[];
}

export interface TemplateVersionRecord {
  id: string;
  templateId: string;
  version: string;
  changelog: string;
  zipFileName: string;
  zipSizeFormatted: string;
  createdAt: string;
}

export interface TemplateCategoryRecord {
  id: string;
  name: string;
  slug: string;
  count: number;
  description: string;
}

export interface TemplateInstallLogRecord {
  id: string;
  templateId: string;
  templateName: string;
  action: 'UPLOAD' | 'ENABLE' | 'DISABLE' | 'UPDATE' | 'DELETE' | 'DUPLICATE' | 'REVALIDATE';
  performedBy: string;
  timestamp: string;
  details: string;
}

export type ViewportDevice = 'desktop' | 'tablet' | 'mobile';
export type ThemeMode = 'light' | 'dark';
