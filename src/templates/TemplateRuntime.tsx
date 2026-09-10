"use client";

/**
 * TemplateRuntime.tsx — Canonical Single Source of Truth Template Runtime
 *
 * Serves as the ONE execution container shared by:
 *   - Admin Preview (mode="preview")
 *   - Editor Canvas (mode="editor")
 *   - Published Site (mode="published")
 *
 * Renders the EXACT uploaded template React components without reconstruction or silent fallbacks.
 */

import React, { useEffect, useRef, useState } from 'react';
import { PortfolioData } from '../utils/mockDb';
import { normalizePortfolio } from '../utils/portfolioNormalizer';
import IsolatedTemplateIframe from '../components/editor/IsolatedTemplateIframe';
import UploadedTemplateRunner from './UploadedTemplateRunner';

export interface TemplateRuntimeProps {
  templateId: string;
  versionId?: string;
  data: PortfolioData;
  mode: 'editor' | 'preview' | 'published';
  activePage?: string;
  onFieldChange?: (field: string, value: any) => void;
  selectedElementId?: string | null;
  setSelectedElementId?: (id: string | null) => void;
  viewport?: 'desktop' | 'tablet' | 'mobile';
  onSchemaLoaded?: (schema: any) => void;
}

export default function TemplateRuntime(props: TemplateRuntimeProps) {
  const { templateId, versionId: explicitVersionId, data, mode, activePage, onFieldChange, selectedElementId, setSelectedElementId, viewport, onSchemaLoaded } = props;

  const debugSessionId = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)
  ).current;

  const runtimeInstanceId = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)
  ).current;

  const isEditMode = mode === 'editor';
  const versionId = explicitVersionId || data?.templateVersionId;

  // Ensure raw database / canonical payload is fully normalized into single source of truth PortfolioData
  const normalizedData: PortfolioData = normalizePortfolio({
    ...data,
    renderMode: mode,
    mode: mode,
    templateId: templateId || data?.templateId || data?.layoutStyle || 'default',
    templateVersionId: versionId || data?.templateVersionId,
    layoutStyle: templateId || data?.layoutStyle || data?.templateId || 'default'
  });

  useEffect(() => {
    console.log('[CV DEBUG][MOUNT]', {
      debugSessionId,
      runtimeInstanceId,
      portfolioId: data?.id,
      mode
    });
    console.log('[MOUNT]', {
      component: 'TemplateRuntime',
      runtimeInstanceId,
      renderMode: mode,
      templateId,
      portfolioId: data?.id
    });
    return () => {
      console.log('[CV DEBUG][UNMOUNT]', {
        debugSessionId,
        runtimeInstanceId,
        portfolioId: data?.id,
        templateId,
        mode
      });
      console.log('[UNMOUNT]', {
        component: 'TemplateRuntime',
        runtimeInstanceId,
        renderMode: mode,
        templateId,
        portfolioId: data?.id
      });
    };
  }, []);

  // NOTE: Debug logging removed from render path — it fires on every re-render
  // and caused main thread overload (Page Unresponsive). Use browser DevTools instead.


  return (
    <div
      data-campus-runtime-mode={mode}
      data-template-id={templateId}
      data-template-version-id={versionId}
      className="template-runtime-root w-full min-h-full relative bg-transparent"
      style={{ overflow: 'visible' }}
    >
      <IsolatedTemplateIframe
        templateId={templateId}
        versionId={versionId}
        data={normalizedData}
        mode={mode}
        renderMode={mode}
        activePage={activePage}
        isEditMode={isEditMode}
        onFieldChange={onFieldChange}
        selectedElementId={selectedElementId}
        setSelectedElementId={setSelectedElementId}
        viewport={viewport}
        onSchemaLoaded={onSchemaLoaded}
      />
    </div>
  );
}
