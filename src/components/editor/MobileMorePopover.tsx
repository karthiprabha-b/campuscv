"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Undo2, Redo2, Minus, Plus, Maximize2, X, Globe,
  FileText, HelpCircle, Palette, Sparkles, ExternalLink
} from 'lucide-react';
import ZoomDropdown from './ZoomDropdown';
import { useEditorContext } from '../../context/EditorContext';

interface MobileMorePopoverProps {
  isOpen: boolean;
  onClose: () => void;
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
  onOpenUrlSheet?: () => void;
  onOpenResumeSync?: () => void;
  onStartTour?: () => void;
}

export default function MobileMorePopover({
  isOpen,
  onClose,
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
  onOpenUrlSheet,
  onOpenResumeSync,
  onStartTour,
}: MobileMorePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { selectedElement, selectedNode } = useEditorContext();

  // Close popover when selected element/node changes (e.g. inspector opens)
  useEffect(() => {
    if (isOpen && (selectedElement || selectedNode)) {
      onClose();
    }
  }, [selectedElement, selectedNode, isOpen, onClose]);

  // Click outside and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Active Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[550] lg:hidden"
            onClick={onClose}
          />

          {/* Floating Popover Panel */}
          <div className="fixed inset-x-0 top-14 z-[560] flex justify-end px-3 lg:hidden pointer-events-none">
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-72 bg-white border border-[#e7e7ef] rounded-2xl shadow-2xl p-3.5 space-y-3 pointer-events-auto select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popover Header */}
              <div className="flex items-center justify-between border-b border-[#e7e7ef] pb-2">
                <span className="text-[11px] font-extrabold text-[#1f1f26] uppercase tracking-wider">
                  Editor Options
                </span>
                <button
                  onClick={onClose}
                  className="w-6 h-6 flex items-center justify-center rounded-full text-[#9292a0] hover:text-[#1f1f26] hover:bg-[#f7f8fc] transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. URL & Custom Domain Setting Trigger */}
              {onOpenUrlSheet && (
                <button
                  onClick={() => {
                    onOpenUrlSheet();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-violet-50/70 hover:bg-violet-100/80 border border-violet-200/80 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-violet-950 truncate">URL & Custom Domain</p>
                      <p className="text-[10px] text-violet-700 truncate">Manage handle, domain &amp; QR</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-violet-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              )}

              {/* 2. Resume Upload & Sync Trigger */}
              {onOpenResumeSync && (
                <button
                  onClick={() => {
                    onOpenResumeSync();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate">Resume Sync</p>
                      <p className="text-[10px] text-zinc-500 truncate">Import PDF or Word resume</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              )}

              {/* 3. History Actions: Undo & Redo */}
              <div className="space-y-1 pt-1 border-t border-[#e7e7ef]">
                <span className="text-[10px] font-bold text-[#9292a0] uppercase tracking-wider block px-0.5">
                  History
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      onUndo();
                      onClose();
                    }}
                    disabled={!canUndo}
                    className={`h-9 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      canUndo
                        ? 'border-[#e7e7ef] bg-[#f7f8fc] text-[#1f1f26] active:bg-[#f3f1ff] active:text-[#7448e8]'
                        : 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                    }`}
                    aria-label="Undo"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Undo</span>
                  </button>

                  <button
                    onClick={() => {
                      onRedo();
                      onClose();
                    }}
                    disabled={!canRedo}
                    className={`h-9 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      canRedo
                        ? 'border-[#e7e7ef] bg-[#f7f8fc] text-[#1f1f26] active:bg-[#f3f1ff] active:text-[#7448e8]'
                        : 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                    }`}
                    aria-label="Redo"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                    <span>Redo</span>
                  </button>
                </div>
              </div>

              {/* 4. Canvas Zoom Group */}
              <div className="space-y-1 border-t border-[#e7e7ef] pt-2">
                <span className="text-[10px] font-bold text-[#9292a0] uppercase tracking-wider block px-0.5">
                  Canvas Zoom
                </span>
                <div className="flex items-center justify-between h-9 rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] p-1 divide-x divide-[#e7e7ef]">
                  <button
                    onClick={onZoomOut}
                    className="w-8 h-7 flex items-center justify-center text-[#666674] hover:text-[#1f1f26] active:bg-[#f3f1ff] rounded-md transition-colors cursor-pointer"
                    aria-label="Zoom out"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <div className="flex-1 px-1">
                    <ZoomDropdown
                      zoom={zoom}
                      onZoomSet={(v) => {
                        if (onZoomSet) onZoomSet(v);
                        else onZoomReset();
                      }}
                      onFitToScreen={onFitToScreen}
                    />
                  </div>

                  <button
                    onClick={onZoomIn}
                    className="w-8 h-7 flex items-center justify-center text-[#666674] hover:text-[#1f1f26] active:bg-[#f3f1ff] rounded-md transition-colors cursor-pointer"
                    aria-label="Zoom in"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 5. Guided Tour */}
              {onStartTour && (
                <button
                  onClick={() => {
                    onStartTour();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Interactive Editor Tour</span>
                </button>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
