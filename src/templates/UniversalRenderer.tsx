"use client";

/**
 * UniversalRenderer — Master Template Container
 *
 * Single Execution Engine shared by Admin Preview, Editor Canvas, Live Preview, and Published Portfolio.
 */

import React from 'react';
import TemplateRenderer from '../components/common/TemplateRenderer';
import { PortfolioData } from '../utils/mockDb';

interface UniversalRendererProps {
  data: PortfolioData;
  versionId?: string;
  mode?: 'admin-preview' | 'editor' | 'preview' | 'published';
  activePage?: string;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: any) => void;
  selectedElementId?: string | null;
  setSelectedElementId?: (id: string | null) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onSchemaLoaded?: (schema: any) => void;
}

export default function UniversalRenderer(props: UniversalRendererProps) {
  const templateId = props.data?.templateId || props.data?.layoutStyle || 'default';
  const versionId = props.versionId || (props.data as any)?.templateVersionId;
  const mode = props.mode || (props.isEditMode ? 'editor' : 'preview');

  return (
    <TemplateRenderer
      templateId={templateId}
      versionId={versionId}
      portfolioData={props.data}
      mode={mode}
      activePage={props.activePage}
      onFieldChange={props.onFieldChange}
      selectedElementId={props.selectedElementId}
      setSelectedElementId={props.setSelectedElementId}
      viewport={props.viewport}
      onSchemaLoaded={props.onSchemaLoaded}
    />
  );
}
