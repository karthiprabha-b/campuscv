export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'array' | 'tags' | 'list' | 'number';
  itemSchema?: TemplateField[];
}

export interface TemplateSectionSchema {
  id: string;
  name: string;
  category: string;
  fields: TemplateField[];
}

export type TemplateSchema = TemplateSectionSchema[];
