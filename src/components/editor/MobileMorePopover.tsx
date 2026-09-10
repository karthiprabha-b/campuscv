"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Redo2, Minus, Plus, Maximize2, X } from 'lucide-react';
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
}: MobileMorePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { selectedElement, selectedNode } = useEditorContext();

  // Close popover when selected element/node changes (e.g. inspector opens)
  useEffect(() => {
    if (isOpen && (selectedElement || selectedNode)) {
      onClose();
    }
  }, [selectedElement, selectedNode]);

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
            className="fixed inset-0 bg-black/25 backdrop-blur-xs z-[550] lg:hidden"
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
              className="w-64 bg-white border border-[#e7e7ef] rounded-2xl shadow-2xl p-3.5 space-y-3.5 pointer-events-auto select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popover Header with Title and Close Button */}
              <div className="flex items-center justify-between border-b border-[#e7e7ef] pb-2">
                <span className="text-[11px] font-extrabold text-[#1f1f26] uppercase tracking-wider">
                  Editor Controls
                </span>
                <button
                  onClick={onClose}
                  className="w-6 h-6 flex items-center justify-center rounded-full text-[#9292a0] hover:text-[#1f1f26] hover:bg-[#f7f8fc] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* History Actions: Undo & Redo */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#9292a0] uppercase tracking-wider block px-1">
                  History
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      onUndo();
                      onClose();
                    }}
                    disabled={!canUndo}
                    className={`h-9 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
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
                    className={`h-9 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
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

              {/* Zoom Control Group */}
              <div className="space-y-1 border-t border-[#e7e7ef] pt-2.5">
                <span className="text-[10px] font-bold text-[#9292a0] uppercase tracking-wider block px-1">
                  Canvas Zoom
                </span>
                <div className="flex items-center justify-between h-9 rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] p-1 divide-x divide-[#e7e7ef]">
                  <button
                    onClick={onZoomOut}
                    className="w-8 h-7 flex items-center justify-center text-[#666674] hover:text-[#1f1f26] active:bg-[#f3f1ff] rounded-md transition-colors"
                    aria-label="Zoom out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 flex justify-center">
                    <ZoomDropdown
                      zoom={zoom}
                      onZoomSet={(v) => {
                        onZoomSet?.(v);
                      }}
                      onFitToScreen={() => {
                        onFitToScreen?.();
                        onClose();
                      }}
                    />
                  </div>
                  <button
                    onClick={onZoomIn}
                    className="w-8 h-7 flex items-center justify-center text-[#666674] hover:text-[#1f1f26] active:bg-[#f3f1ff] rounded-md transition-colors"
                    aria-label="Zoom in"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Fit to Screen Button */}
              {onFitToScreen && (
                <button
                  onClick={() => {
                    onFitToScreen();
                    onClose();
                  }}
                  className="w-full h-9 rounded-xl border border-[#ddd6fe] bg-[#f3f1ff] text-[#7448e8] font-bold text-xs flex items-center justify-center gap-2 active:bg-[#e9e4ff] transition-all"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fit to Screen</span>
                </button>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
