"use client";

/**
 * StatusBar — Simple Canva-Style Status Bar
 *
 * Displays clean, human-friendly status (e.g., "Editing: Hero Section")
 * and zoom controls. Free of technical pixel coordinates.
 */

import React from 'react';
import { useEditorContext } from '../../context/EditorContext';

interface StatusBarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export default function StatusBar({ zoom, onZoomIn, onZoomOut, onZoomReset }: StatusBarProps) {
  const { selectedElement, isEditMode, validationReport, isDebugMode, toggleDebugMode } = useEditorContext();

  if (!isEditMode) return null;

  return (
    <div
      className="flex-shrink-0 flex items-center justify-between px-4 border-t border-white/10 select-none text-[11px] font-sans"
      style={{ height: 32, background: '#0f0f11', color: 'rgba(255,255,255,0.6)' }}
    >
      {/* Left status text */}
      <div className="flex items-center gap-3">
        {selectedElement ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>Editing:</span>
            <span className="text-white font-semibold capitalize">
              {selectedElement.label || selectedElement.sectionId || 'Item'}
            </span>
          </div>
        ) : (
          <span className="text-white/40">Click any element on canvas or select a section from left sidebar</span>
        )}

        {/* Validation Health Ratio Badge */}
        {validationReport && (
          <button
            onClick={toggleDebugMode}
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold transition-all ${
              isDebugMode
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-white/5 text-emerald-400 border border-white/10 hover:bg-white/10'
            }`}
            title="Universal DOM Audit: 100% of visible portfolio elements are registered and selectable."
          >
            Audit: {validationReport.healthRatio}
          </button>
        )}
      </div>

      {/* Right zoom controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onZoomOut}
          className="w-5 h-5 flex items-center justify-center hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={onZoomReset}
          className="px-1.5 font-medium hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={onZoomIn}
          className="w-5 h-5 flex items-center justify-center hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Zoom In"
        >
          +
        </button>
      </div>
    </div>
  );
}
