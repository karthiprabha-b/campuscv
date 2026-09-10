"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Eye, EyeOff, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { PortfolioData } from '../../utils/mockDb';
import SectionTree from './SectionTree';

interface MobileLayersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  schema?: any;
  onOpenAddModal: () => void;
}

export default function MobileLayersSheet({
  isOpen,
  onClose,
  portfolio,
  onPortfolioChange,
  selectedElementId,
  setSelectedElementId,
  schema,
  onOpenAddModal,
}: MobileLayersSheetProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed inset-x-0 bottom-0 top-16 z-[500] bg-white border-t border-zinc-200 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col select-none md:hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/80 rounded-t-3xl shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              <span className="font-bold text-sm text-zinc-900">Layers & Section Tree</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tree Body */}
          <div className="flex-grow overflow-y-auto p-4 pb-20">
            <SectionTree
              portfolio={portfolio}
              onPortfolioChange={onPortfolioChange}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
