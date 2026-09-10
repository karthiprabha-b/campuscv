"use client";

/**
 * TemplateRenderer.tsx — Single Source of Truth Universal Template Renderer
 *
 * Render pipeline shared identically by:
 *   1. Admin Preview (mode="admin-preview")
 *   2. Editor Canvas (mode="editor")
 *   3. User Preview (mode="preview")
 *   4. Published Portfolio (mode="published")
 *
 * NEVER silently falls back to old default templates on error.
 * Shows explicit error diagnostics if loading fails.
 */

import React, { useState, useEffect } from 'react';
import { PortfolioData } from '../../utils/mockDb';
import TemplateRuntime from '../../templates/TemplateRuntime';
import { AlertTriangle, RefreshCw, Layers } from 'lucide-react';

export interface TemplateRendererProps {
  templateId: string;
  versionId?: string;
  portfolioData: PortfolioData;
  mode: 'admin-preview' | 'editor' | 'preview' | 'published';
  version?: string;
  activePage?: string;
  onFieldChange?: (field: string, value: any) => void;
  selectedElementId?: string | null;
  setSelectedElementId?: (id: string | null) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onSchemaLoaded?: (schema: any) => void;
}

export default function TemplateRenderer(props: TemplateRendererProps) {
  const {
    templateId,
    versionId: explicitVersionId,
    portfolioData,
    mode,
    version,
    activePage,
    onFieldChange,
    selectedElementId,
    setSelectedElementId,
    viewport,
    onSchemaLoaded
  } = props;

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if templateId changes
  useEffect(() => {
    setHasError(false);
    setErrorMessage(null);
  }, [templateId]);

  if (!templateId) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-red-950/40 border border-red-800/80 rounded-2xl text-red-200 shadow-2xl backdrop-blur-md font-mono">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="text-lg font-extrabold tracking-wide">Template Runtime Error — No Template ID Specified</h3>
        </div>
        <p className="text-xs text-red-300 mb-4">
          CampusCV Universal Render Isolation Active — Silent fallbacks to old default layouts are strictly disabled.
        </p>
        <div className="bg-black/60 p-4 rounded-xl text-xs space-y-2 border border-red-900/40">
          <div><span className="text-red-400 font-bold">Portfolio ID:</span> {portfolioData?.id || 'unknown'}</div>
          <div><span className="text-red-400 font-bold">Requested Mode:</span> {mode}</div>
          <div><span className="text-red-400 font-bold">Error Reason:</span> templateId parameter was null or empty.</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-red-950/40 border border-red-800/80 rounded-2xl text-red-200 shadow-2xl backdrop-blur-md font-mono">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="text-lg font-extrabold tracking-wide">Uploaded Template Could Not Be Loaded</h3>
        </div>
        <p className="text-xs text-red-300 mb-4">
          CampusCV Render Isolation Active — Default layouts are strictly disabled for uploaded templates.
        </p>
        <div className="bg-black/60 p-4 rounded-xl text-xs space-y-2 border border-red-900/40 mb-6">
          <div><span className="text-red-400 font-bold">Portfolio ID:</span> {portfolioData?.id || 'unknown'}</div>
          <div><span className="text-red-400 font-bold">Template ID:</span> {templateId}</div>
          <div><span className="text-red-400 font-bold">Version:</span> {version || '1.0.0'}</div>
          <div><span className="text-red-400 font-bold">Requested Mode:</span> {mode}</div>
          <div><span className="text-red-400 font-bold">Error Reason:</span></div>
          <div className="text-red-300 pl-4 border-l-2 border-red-700 font-sans leading-relaxed">{errorMessage || 'Template failed to compile or render.'}</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setHasError(false); setErrorMessage(null); }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Loading Template
          </button>
        </div>
      </div>
    );
  }

  const runtimeMode = mode === 'published' ? 'published' : (mode === 'editor' ? 'editor' : 'preview');
  const versionId = explicitVersionId || portfolioData?.templateVersionId;

  console.log("[MODE FLOW]", {
    component: "TemplateRenderer",
    mode: runtimeMode,
    isEditMode: runtimeMode === 'editor',
    portfolioId: portfolioData?.id,
    templateId
  });

  console.log('[TEMPLATE RENDER]', {
    templateId,
    versionId: versionId || 'latest',
    portfolioId: portfolioData?.id || 'demo',
    mode: runtimeMode
  });

  return (
    <TemplateRuntime
      templateId={templateId}
      versionId={versionId}
      data={portfolioData}
      mode={runtimeMode}
      activePage={activePage}
      onFieldChange={onFieldChange}
      selectedElementId={selectedElementId}
      setSelectedElementId={setSelectedElementId}
      viewport={viewport}
      onSchemaLoaded={onSchemaLoaded}
    />
  );
}
