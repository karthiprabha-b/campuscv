"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Undo2, Redo2, Monitor, Tablet, Smartphone, Save, Eye, EyeOff } from 'lucide-react';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  setViewport: (v: 'desktop' | 'tablet' | 'mobile') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave?: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export default function MobileMoreSheet({
  isOpen,
  onClose,
  viewport,
  setViewport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  isEditMode,
  toggleEditMode,
}: MobileMoreSheetProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-xs flex flex-col justify-end md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-full bg-white rounded-t-3xl border-t border-[#e7e7ef] shadow-2xl p-5 space-y-5 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e7e7ef] pb-3">
              <span className="text-xs font-bold text-[#1f1f26] uppercase tracking-wider">Editor Options</span>
              <button
                onClick={onClose}
                className="p-1 text-[#9292a0] hover:text-[#1f1f26] hover:bg-[#f7f8fc] rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions: Undo & Redo */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#9292a0] uppercase tracking-wider block">History Actions</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onUndo(); onClose(); }}
                  disabled={!canUndo}
                  className={`h-11 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    canUndo
                      ? 'border-[#e7e7ef] bg-[#f7f8fc] text-[#1f1f26] active:bg-[#f3f1ff] active:text-[#7448e8]'
                      : 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                  }`}
                  aria-label="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>Undo</span>
                </button>
                <button
                  onClick={() => { onRedo(); onClose(); }}
                  disabled={!canRedo}
                  className={`h-11 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    canRedo
                      ? 'border-[#e7e7ef] bg-[#f7f8fc] text-[#1f1f26] active:bg-[#f3f1ff] active:text-[#7448e8]'
                      : 'border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                  }`}
                  aria-label="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                  <span>Redo</span>
                </button>
              </div>
            </div>

            {/* Viewport Preview Mode */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#9292a0] uppercase tracking-wider block">Preview Device</span>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['desktop', Monitor, 'Desktop'] as const,
                  ['tablet', Tablet, 'Tablet'] as const,
                  ['mobile', Smartphone, 'Mobile'] as const,
                ]).map(([vp, Icon, label]) => (
                  <button
                    key={vp}
                    onClick={() => { setViewport(vp); onClose(); }}
                    className={`h-11 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                      viewport === vp
                        ? 'border-[#ddd6fe] bg-[#f3f1ff] text-[#7448e8] shadow-xs'
                        : 'border-[#e7e7ef] bg-[#f7f8fc] text-[#666674]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save & Mode Toggle */}
            <div className="pt-2 flex items-center gap-2 border-t border-[#e7e7ef]">
              <button
                onClick={() => { onSave?.(); onClose(); }}
                className="flex-1 h-11 rounded-xl border border-[#e7e7ef] bg-[#f7f8fc] text-[#1f1f26] font-bold text-xs flex items-center justify-center gap-2 active:bg-[#f3f1ff]"
              >
                <Save className="w-4 h-4 text-[#7448e8]" />
                <span>Save Portfolio</span>
              </button>
              <button
                onClick={() => { toggleEditMode(); onClose(); }}
                className="flex-1 h-11 rounded-xl border border-[#ddd6fe] bg-[#f3f1ff] text-[#7448e8] font-bold text-xs flex items-center justify-center gap-2"
              >
                {isEditMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{isEditMode ? 'Preview Mode' : 'Edit Mode'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
