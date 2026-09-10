import React from 'react';
import { PortfolioData } from '../utils/mockDb';
import UploadedTemplateRunner from './UploadedTemplateRunner';

interface DynamicTemplateLoaderProps {
  data: PortfolioData;
  activePage?: string;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: any) => void;
  selectedElementId?: string | null;
  setSelectedElementId?: (id: string | null) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
}

export default function DynamicTemplateLoader(props: DynamicTemplateLoaderProps) {
  return <UploadedTemplateRunner {...props} />;
}
