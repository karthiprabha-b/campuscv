"use client";

/**
 * TopToolbar — Layer 3 (Responsive CampusCV SaaS Header V3)
 * 
 * Strict responsive presentations based on physical editor width (editorWidth):
 *   1. Desktop (>= 1024px): Full 1-row header (Back, Title, Undo/Redo, Desktop/Tablet/Mobile, Zoom, Preview, Save, Publish)
 *   2. Tablet (768px - 1023px): Compact 1-row header (Back, Truncated Title, Undo/Redo, Tablet/Mobile ONLY, Zoom, Eye Preview, Save)
 *   3. Mobile (< 768px): Single 56px compact row (Back, Truncated Title + Dot, Save 💾, ⋮ More)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Monitor, Tablet, Smartphone,
  Undo2, Redo2, Eye, EyeOff, UploadCloud,
  Save, Minus, Plus, MoreVertical, Sparkles, Check, HelpCircle, FileText
} from 'lucide-react';
import ZoomDropdown from './ZoomDropdown';
import MobileMorePopover from './MobileMorePopover';
import { getAvailablePreviewDevices, PreviewDevice } from '../../utils/responsiveRules';

interface TopToolbarProps {
  portfolioName: string;
  portfolioCategory?: string;
  saveStatus: 'saved' | 'saving' | 'dirty' | 'error';
  viewport: PreviewDevice;
  setViewport: (v: PreviewDevice) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomSet?: (val: number) => void;
  onFitToScreen?: () => void;
  onPublish: () => void;
  publishingInProgress: boolean;
  onOpenAddModal?: () => void;
  onOpenUrlSheet?: () => void;
  onOpenResumeSync?: () => void;
  onSave?: () => void;
  onStartTour?: () => void;
  editorWidth: number;
}

export default function TopToolbar({
  portfolioName,
  portfolioCategory,
  saveStatus,
  viewport,
  setViewport,
  isEditMode,
  toggleEditMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomSet,
  onFitToScreen,
  onPublish,
  publishingInProgress,
  onOpenAddModal,
  onOpenUrlSheet,
  onOpenResumeSync,
  onSave,
  onStartTour,
  editorWidth,
}: TopToolbarProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isDesktopScreen = editorWidth >= 1024;
  const isTabletScreen = editorWidth >= 768 && editorWidth < 1024;
  const isMobileScreen = editorWidth < 768;

  const availableDevices = getAvailablePreviewDevices(editorWidth);

  return (
    <header className="h-[56px] flex-shrink-0 w-full bg-white border-b border-[#e7e7ef] shadow-[0_1px_3px_rgba(30,20,60,0.04)] select-none z-[400] relative">
      <div className="h-full w-full px-3 md:px-4 flex items-center justify-between gap-2 overflow-hidden">

        {/* ── LEFT GROUP: Back + CampusCV Mark + Title + Save Dot ───────────── */}
        <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial">
          <Link
            href="/dashboard"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] text-[#666674] hover:text-[#1f1f26] hover:bg-[#f3f1ff] hover:border-[#ddd6fe] transition-all shrink-0"
            title="Back to Dashboard"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Portfolio Identity Component */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] min-w-0 flex-1 md:flex-initial">
            <span className="text-[#1f1f26] text-xs font-bold truncate max-w-[110px] sm:max-w-[160px] md:max-w-[200px]">
              {portfolioName}
            </span>

            <div className="flex items-center gap-1.5 shrink-0 pl-1.5 border-l border-[#e7e7ef]">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  saveStatus === 'saved'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500 animate-pulse'
                }`}
                title={saveStatus === 'saved' ? 'Saved' : 'Unsaved changes'}
              />
              <span className="text-[#666674] text-[10px] hidden xl:inline font-medium">
                {saveStatus === 'saved' ? 'Saved' : 'Unsaved'}
              </span>
            </div>
          </div>
        </div>

        {/* ── DESKTOP & TABLET CENTER GROUP (>= 768px) ────────────────────────── */}
        {!isMobileScreen && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Undo / Redo */}
            <div className="flex items-center h-9 rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] overflow-hidden divide-x divide-[#e7e7ef]">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
                className={`w-8 h-9 flex items-center justify-center transition-all ${
                  canUndo ? 'text-[#666674] hover:bg-[#f3f1ff] hover:text-[#7448e8]' : 'text-zinc-300 cursor-not-allowed'
                }`}
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                aria-label="Redo"
                className={`w-8 h-9 flex items-center justify-center transition-all ${
                  canRedo ? 'text-[#666674] hover:bg-[#f3f1ff] hover:text-[#7448e8]' : 'text-zinc-300 cursor-not-allowed'
                }`}
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Device Selector (Strictly filtered by physical editor width) */}
            <div data-tour="viewport-switcher" className="flex items-center h-9 rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] p-1 gap-0.5">
              {([
                ['desktop', Monitor, 'Desktop'] as const,
                ['tablet', Tablet, 'Tablet'] as const,
                ['mobile', Smartphone, 'Mobile'] as const,
              ])
                .filter(([vp]) => availableDevices.includes(vp))
                .map(([vp, Icon, label]) => (
                  <button
                    key={vp}
                    onClick={() => setViewport(vp)}
                    title={`${label} Viewport`}
                    aria-label={`${label} Viewport`}
                    className={`h-7 px-2 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${
                      viewport === vp
                        ? 'bg-white text-[#7448e8] shadow-xs border border-[#ddd6fe]'
                        : 'text-[#666674] hover:text-[#1f1f26]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {isDesktopScreen && <span className="hidden lg:inline">{label}</span>}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ── DESKTOP & TABLET RIGHT GROUP (>= 768px) ───────────────────────── */}
        {!isMobileScreen && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center h-9 rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] overflow-hidden divide-x divide-[#e7e7ef]">
              <button
                onClick={onZoomOut}
                title="Zoom Out"
                aria-label="Zoom out"
                className="w-7 h-9 flex items-center justify-center text-[#666674] hover:text-[#1f1f26] hover:bg-[#f3f1ff] transition-all"
              >
                <Minus className="w-3 h-3" />
              </button>
              <ZoomDropdown
                zoom={zoom}
                onZoomSet={(v) => onZoomSet ? onZoomSet(v) : onZoomReset()}
                onFitToScreen={onFitToScreen}
              />
              <button
                onClick={onZoomIn}
                title="Zoom In"
                aria-label="Zoom in"
                className="w-7 h-9 flex items-center justify-center text-[#666674] hover:text-[#1f1f26] hover:bg-[#f3f1ff] transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>



            {/* Preview Toggle */}
            <button
              onClick={toggleEditMode}
              title={isEditMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
              aria-label={isEditMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
              className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isEditMode
                  ? 'border-[#e7e7ef] bg-[#f7f8fc] text-[#666674] hover:text-[#1f1f26] hover:bg-[#f3f1ff]'
                  : 'border-[#ddd6fe] bg-[#f3f1ff] text-[#7448e8] font-bold shadow-xs'
              }`}
            >
              {isEditMode ? (
                <><Eye className="w-3.5 h-3.5" /><span className="hidden lg:inline">Preview</span></>
              ) : (
                <><EyeOff className="w-3.5 h-3.5" /><span className="hidden lg:inline">Edit</span></>
              )}
            </button>

            {/* Auto-Save Live Status Indicator (Phase 23) */}
            <div
              data-tour="save-indicator"
              className={`h-9 px-3 rounded-xl text-xs font-medium border flex items-center gap-2 select-none transition-all ${
                saveStatus === 'saving'
                  ? 'border-purple-200 bg-purple-50/70 text-purple-700'
                  : saveStatus === 'saved'
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700'
                    : saveStatus === 'dirty'
                      ? 'border-zinc-200 bg-zinc-50 text-zinc-600'
                      : 'border-red-200 bg-red-50 text-red-700'
              }`}
              title={
                saveStatus === 'saving'
                  ? 'Auto-saving changes to database...'
                  : saveStatus === 'saved'
                    ? 'All changes saved automatically'
                    : saveStatus === 'dirty'
                      ? 'Unsaved changes (will auto-save)'
                      : 'Auto-save failed. Click to retry.'
              }
              onClick={saveStatus === 'error' || saveStatus === 'dirty' ? onSave : undefined}
            >
              {saveStatus === 'saving' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span className="hidden sm:inline font-semibold">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline font-semibold">Saved</span>
                </>
              )}
              {saveStatus === 'dirty' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  <span className="hidden sm:inline">Unsaved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="hidden sm:inline cursor-pointer hover:underline font-semibold">Retry Save</span>
                </>
              )}
            </div>

            {/* Guided Tour Trigger (Screenshot 4 design) */}
            {onStartTour && (
              <div className="relative group">
                <button
                  onClick={onStartTour}
                  title="Guided Tour"
                  aria-label="Guided Tour"
                  data-tour="tour-trigger"
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer shadow-2xs"
                >
                  <HelpCircle className="w-4 h-4 text-zinc-600" />
                </button>
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
                  Guided Tour
                </span>
              </div>
            )}

            {/* Desktop Only Publish Button */}
            {isDesktopScreen && (
              <button
                data-tour="publish-btn"
                onClick={onPublish}
                disabled={publishingInProgress}
                title="Publish Portfolio"
                aria-label="Publish portfolio"
                className="h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-[#8252c7] to-[#3a0bb0] hover:opacity-95 text-white transition-all disabled:opacity-50 shadow-md shadow-[#8252c7]/20"
              >
                {publishingInProgress ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* ── MOBILE RIGHT GROUP (< 768px): Auto-save indicator + ⋮ More Button ───────────── */}
        {isMobileScreen && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Auto-Save Indicator */}
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                saveStatus === 'saving'
                  ? 'border-purple-200 bg-purple-50 text-purple-600'
                  : saveStatus === 'saved'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                    : saveStatus === 'dirty'
                      ? 'border-zinc-200 bg-zinc-50 text-zinc-500'
                      : 'border-red-200 bg-red-50 text-red-600'
              }`}
              title={saveStatus === 'saved' ? 'All changes saved' : saveStatus === 'saving' ? 'Saving...' : 'Auto-save'}
            >
              {saveStatus === 'saving' ? (
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              ) : saveStatus === 'saved' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
              )}
            </div>

            {/* 3-Dot Overflow Menu Button */}
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] text-[#666674] active:bg-[#f3f1ff] active:text-[#7448e8] transition-all"
              title="More Editor Options"
              aria-label="More editor options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Mobile 3-Dot Overflow Popover */}
      <MobileMorePopover
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onZoomReset={onZoomReset}
        onZoomSet={onZoomSet}
        onFitToScreen={onFitToScreen}
        onOpenUrlSheet={onOpenUrlSheet}
        onOpenResumeSync={onOpenResumeSync}
        onStartTour={onStartTour}
      />
    </header>
  );
}
