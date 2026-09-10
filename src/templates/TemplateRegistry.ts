import { TemplateDefinition, TemplateManifest } from './types';
import DynamicTemplateLoader from './DynamicTemplateLoader';
import { adminTemplateDb } from '../utils/adminTemplateDb';

export const defaultTemplateId = 'default';

/**
 * Returns available templates based on canonical active templates in adminTemplateDb.
 */
export function getAllTemplates(): TemplateManifest[] {
  let activeList: any[] = [];
  try {
    activeList = adminTemplateDb.getActiveTemplates();
  } catch (e) {
    activeList = [];
  }

  if (activeList.length === 0) {
    // If database not yet populated, return empty or fallback
    return [{
      id: 'default',
      name: 'Default Portfolio',
      category: 'Universal',
      description: 'Clean responsive layout for students and developers.',
      sections: ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact', 'Footer']
    }];
  }

  return activeList.map(tmpl => ({
    id: tmpl.id,
    name: tmpl.name || tmpl.id,
    category: tmpl.category || 'general',
    description: tmpl.description || '',
    thumbnail: tmpl.thumbnail,
    sections: tmpl.sections || ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact', 'Footer'],
    features: [
      tmpl.supportsDarkMode ? 'Dark Mode Preset' : 'Light Mode Ready',
      `${(tmpl.sections || []).length} Sections Included`
    ]
  }));
}

/**
 * Resolves template definition / component for a given templateId.
 * Implementation exists regardless of whether the template is currently active for new selections.
 */
export function getTemplate(id?: string): TemplateDefinition {
  const targetId = (id || defaultTemplateId).trim();
  const tmplRecord = adminTemplateDb.getTemplateById(targetId);

  const manifest: TemplateManifest = tmplRecord ? {
    id: tmplRecord.id,
    name: tmplRecord.name,
    category: tmplRecord.category,
    description: tmplRecord.description || '',
    thumbnail: tmplRecord.thumbnail,
    sections: tmplRecord.sections || ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact', 'Footer']
  } : {
    id: targetId,
    name: targetId === 'default' ? 'Default Portfolio' : targetId,
    category: 'Universal',
    description: 'Portfolio template layout.',
    sections: ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact', 'Footer']
  };

  const Component = DynamicTemplateLoader as any;

  return {
    manifest,
    theme: {
      primaryColor: '#7C3AED',
      accentColor: '#4F46E5',
      fontFamily: 'Inter',
      isDarkMode: false
    },
    Component
  };
}

export const templates: Record<string, TemplateDefinition> = {
  'default': getTemplate('default')
};

export function getTemplateManifest(id?: string): TemplateManifest {
  return getTemplate(id).manifest;
}

