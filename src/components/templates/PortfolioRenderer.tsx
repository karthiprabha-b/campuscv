import React from 'react';
import { PortfolioData } from '../../types/portfolio';
import TemplateRenderer from '../common/TemplateRenderer';

interface RendererProps {
  data?: PortfolioData;
  portfolio?: PortfolioData;
  versionId?: string;
  mode?: 'admin-preview' | 'editor' | 'preview' | 'published';
  activePage?: string;
  setActivePage?: (page: string) => void;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: any) => void;
  selectedElementId?: string | null;
  setSelectedElementId?: (id: string | null) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onSchemaLoaded?: (schema: any) => void;
}

export default function PortfolioRenderer(props: RendererProps) {
  const portfolioData = (props.data || props.portfolio) as PortfolioData;
  const templateId = portfolioData?.templateId || portfolioData?.layoutStyle || '';
  const versionId = props.versionId || (portfolioData as any)?.templateVersionId;
  const mode = props.mode || (portfolioData as any)?.renderMode || (portfolioData as any)?.mode || (props.isEditMode ? 'editor' : 'published');

  console.log("[MODE FLOW]", {
    component: "PortfolioRenderer",
    mode,
    isEditMode: Boolean(props.isEditMode),
    portfolioId: portfolioData?.id,
    templateId
  });

  return (
    <TemplateRenderer
      templateId={templateId}
      versionId={versionId}
      portfolioData={portfolioData}
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
