"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useEditorContext } from '../../context/EditorContext';
import { PortfolioData } from '../../utils/mockDb';
import { InspectorBody } from './ContextInspector';

interface MobileInspectorSheetProps {
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
  children?: React.ReactNode;
}

export default function MobileInspectorSheet({
  portfolio,
  onPortfolioChange,
  children,
}: MobileInspectorSheetProps) {
  const { selectedElement, setSelectedElement, selectedNode, setSelectedNode, isEditMode } = useEditorContext();
  const [sheetHeight, setSheetHeight] = useState<'half' | 'full'>('half');

  const isSelected = (!!selectedElement || !!selectedNode) && isEditMode;

  if (!isSelected) return null;

  const nodeTitle = selectedNode
    ? `${selectedNode.type.toUpperCase()} (${selectedNode.tag || 'el'})`
    : selectedElement
    ? `${(selectedElement.elementType || 'CONTAINER').toUpperCase()}`
    : 'Selected Element';

  return (
    <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className={`fixed inset-x-0 bottom-0 z-[500] bg-white border-t border-zinc-200 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)] flex flex-col select-none ${
            sheetHeight === 'full' ? 'h-[85dvh]' : 'h-[55dvh]'
          } transition-all duration-300`}
        >
          {/* Drag Handle & Header */}
          <div
            className="flex flex-col items-center pt-2.5 pb-2 px-4 border-b border-zinc-100 bg-zinc-50/80 rounded-t-3xl cursor-grab active:cursor-grabbing shrink-0"
            onClick={() => setSheetHeight(sheetHeight === 'half' ? 'full' : 'half')}
          >
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full mb-2" />
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#7448e8]" />
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{nodeTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSheetHeight(sheetHeight === 'half' ? 'full' : 'half');
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-700"
                  title="Expand / Collapse"
                >
                  {sheetHeight === 'half' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(null);
                    setSelectedNode(null);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-full"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sheet Scrollable Body */}
          <div className="flex-grow overflow-y-auto p-4 pb-20 min-h-0">
            <InspectorBody portfolio={portfolio} onPortfolioChange={onPortfolioChange} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
