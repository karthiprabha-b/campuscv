import React from 'react';
import { PortfolioData } from '../types/portfolio';

export interface TemplateManifest {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail?: string;
  sections: string[];
  features?: string[];
}

export interface TemplateTheme {
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  isDarkMode?: boolean;
  defaultSectionGap?: number;
  defaultCardRadius?: number;
}

export interface TemplateProps {
  data: PortfolioData;
  activePage?: string;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: any) => void;
  selectedElementId?: string | null;
  setSelectedElementId?: (id: string | null) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  manifest?: TemplateManifest;
  theme?: TemplateTheme;
}

export interface TemplateDefinition {
  manifest: TemplateManifest;
  theme: TemplateTheme;
  Component: React.ComponentType<TemplateProps>;
}
