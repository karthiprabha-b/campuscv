export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'richtext' 
  | 'markdown' 
  | 'number' 
  | 'slider' 
  | 'range' 
  | 'boolean' 
  | 'toggle' 
  | 'checkbox' 
  | 'radio' 
  | 'select' 
  | 'multiselect' 
  | 'color' 
  | 'gradient' 
  | 'font' 
  | 'fontWeight' 
  | 'fontSize' 
  | 'lineHeight' 
  | 'letterSpacing' 
  | 'shadow' 
  | 'border' 
  | 'radius' 
  | 'padding' 
  | 'margin' 
  | 'spacing' 
  | 'alignment' 
  | 'url' 
  | 'email' 
  | 'phone' 
  | 'image' 
  | 'gallery' 
  | 'video' 
  | 'audio' 
  | 'icon' 
  | 'svg' 
  | 'tags' 
  | 'array' 
  | 'object' 
  | 'json' 
  | 'code' 
  | 'date' 
  | 'time' 
  | 'button' 
  | 'divider' 
  | 'group' 
  | 'accordion' 
  | 'tabs';

export interface FieldOption {
  label: string;
  value: string;
}

export interface EditorFieldSchema {
  key: string;            // Property path e.g. "name", "headline", "bio", "photo", "title", "github"
  label: string;          // Human readable label e.g. "Full Name"
  type: FieldType;        // Input field type
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: FieldOption[]; // For select & radio dropdowns
  fields?: EditorFieldSchema[]; // For nested groups or objects
}

export interface SectionStyleSchema {
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  containerWidth?: 'narrow' | 'normal' | 'wide' | 'full';
  gridColumns?: number;
  gap?: string;
  alignment?: 'left' | 'center' | 'right';
  borderRadius?: string;
  boxShadow?: string;
  opacity?: number;
  animation?: 'none' | 'fade-in' | 'slide-up' | 'zoom-in';
}

export interface ResponsiveViewportOverrides {
  desktop?: SectionStyleSchema;
  tablet?: SectionStyleSchema;
  mobile?: SectionStyleSchema;
}

export interface EditorSectionSchema {
  id: string;             // Section key e.g. "hero", "about", "projects", "experience", "gallery"
  title: string;          // Section title e.g. "Hero", "About", "Projects"
  icon?: string;          // Icon name e.g. "User", "Briefcase", "Code"
  type?: 'object' | 'array';
  itemLabel?: string;     // e.g. "Project", "Experience Item", "Skill"
  fields?: EditorFieldSchema[];
  styles?: SectionStyleSchema;
  responsive?: ResponsiveViewportOverrides;
}

export type EditorSchema = EditorSectionSchema[];

export interface TemplateSchemaObject {
  sections: EditorSectionSchema[];
}

export type TemplateSchema = EditorSchema | TemplateSchemaObject;

// Helper to normalize any schema structure into a flat array of EditorSectionSchema
export function normalizeSchema(raw: any): EditorSectionSchema[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object') {
    if (Array.isArray(raw.sections)) return raw.sections;
    if (Array.isArray(raw.editorSchema)) return raw.editorSchema;
    if (Array.isArray(raw.schema)) return raw.schema;
    if (Array.isArray(raw.default)) return raw.default;
  }
  return [];
}

// Dynamically derives a schema from data keys on-the-fly without hardcoded section names
export function deriveSchemaFromData(data: Record<string, any>): EditorSectionSchema[] {
  if (!data || typeof data !== 'object') return [];

  const derivedSections: EditorSectionSchema[] = [];

  // Top level primitive fields -> Object Section
  const rootFields: EditorFieldSchema[] = [];
  Object.keys(data).forEach(k => {
    if (['id', 'templateId', 'isDarkMode', 'advancedSettings', 'layoutStyle'].includes(k)) return;

    const val = data[k];
    if (typeof val === 'string') {
      if (k.toLowerCase().includes('image') || k.toLowerCase().includes('photo') || k.toLowerCase().includes('avatar') || k.toLowerCase().includes('thumb')) {
        rootFields.push({ key: k, label: formatLabel(k), type: 'image' });
      } else if (val.length > 80 || k.toLowerCase().includes('bio') || k.toLowerCase().includes('desc') || k.toLowerCase().includes('about')) {
        rootFields.push({ key: k, label: formatLabel(k), type: 'textarea' });
      } else if (val.startsWith('http://') || val.startsWith('https://') || k.toLowerCase().includes('url') || k.toLowerCase().includes('link')) {
        rootFields.push({ key: k, label: formatLabel(k), type: 'url' });
      } else {
        rootFields.push({ key: k, label: formatLabel(k), type: 'text' });
      }
    } else if (typeof val === 'number') {
      rootFields.push({ key: k, label: formatLabel(k), type: 'number' });
    } else if (typeof val === 'boolean') {
      rootFields.push({ key: k, label: formatLabel(k), type: 'toggle' });
    }
  });

  if (rootFields.length > 0) {
    derivedSections.push({
      id: 'general',
      title: 'General Details',
      icon: 'User',
      type: 'object',
      fields: rootFields
    });
  }

  // Nested arrays or objects -> Sections
  Object.keys(data).forEach(k => {
    if (['id', 'templateId', 'isDarkMode', 'advancedSettings', 'layoutStyle'].includes(k)) return;

    const val = data[k];
    if (Array.isArray(val)) {
      if (val.length > 0 && typeof val[0] === 'string') {
        derivedSections.push({
          id: k,
          title: formatLabel(k),
          icon: 'Code',
          type: 'array',
          itemLabel: formatSingular(k),
          fields: [{ key: 'name', label: 'Item Name', type: 'text' }]
        });
      } else if (val.length > 0 && typeof val[0] === 'object') {
        const itemObj = val[0];
        const fields: EditorFieldSchema[] = Object.keys(itemObj).map(subKey => {
          const subVal = itemObj[subKey];
          if (Array.isArray(subVal)) {
            return { key: subKey, label: formatLabel(subKey), type: 'tags' };
          }
          if (subKey.toLowerCase().includes('image') || subKey.toLowerCase().includes('thumb') || subKey.toLowerCase().includes('photo')) {
            return { key: subKey, label: formatLabel(subKey), type: 'image' };
          }
          if (typeof subVal === 'string' && subVal.length > 80) {
            return { key: subKey, label: formatLabel(subKey), type: 'textarea' };
          }
          if (typeof subVal === 'number') {
            return { key: subKey, label: formatLabel(subKey), type: 'number' };
          }
          if (typeof subVal === 'boolean') {
            return { key: subKey, label: formatLabel(subKey), type: 'toggle' };
          }
          return { key: subKey, label: formatLabel(subKey), type: 'text' };
        });

        derivedSections.push({
          id: k,
          title: formatLabel(k),
          icon: 'Briefcase',
          type: 'array',
          itemLabel: formatSingular(k),
          fields
        });
      }
    } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const subFields: EditorFieldSchema[] = Object.keys(val).map(subKey => ({
        key: `${k}.${subKey}`,
        label: formatLabel(subKey),
        type: typeof val[subKey] === 'string' && (val[subKey].startsWith('http') || subKey.toLowerCase().includes('link')) ? 'url' : 'text'
      }));

      derivedSections.push({
        id: k,
        title: formatLabel(k),
        icon: 'Share2',
        type: 'object',
        fields: subFields
      });
    }
  });

  return derivedSections;
}

function formatLabel(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
}

function formatSingular(str: string): string {
  const formatted = formatLabel(str);
  if (formatted.endsWith('s')) return formatted.slice(0, -1);
  return formatted;
}
