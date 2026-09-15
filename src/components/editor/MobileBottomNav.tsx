"use client";

import React from 'react';
import { Layers, LayoutTemplate, Plus, Eye, EyeOff, UploadCloud, Palette } from 'lucide-react';
import { useEditorContext } from '../../context/EditorContext';

interface MobileBottomNavProps {
  onOpenLayers: () => void;
  onOpenTemplates: () => void;
  onOpenAddModal: () => void;
  onPublish: () => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  activeSheet: 'none' | 'layers' | 'templates' | 'add' | 'inspector' | 'url' | 'design';
}

export default function MobileBottomNav({
  onOpenLayers,
  onOpenTemplates,
  onOpenAddModal,
  onPublish,
  isEditMode,
  toggleEditMode,
  activeSheet,
}: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 bg-white/96 backdrop-blur-md border-t border-[#e7e7ef] flex items-center justify-around z-[450] px-2 select-none lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Layers Sheet Toggle */}
      <button
        onClick={onOpenLayers}
        className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
          activeSheet === 'layers'
            ? 'text-[#7448e8] bg-[#f3f1ff] font-bold border border-[#ddd6fe]'
            : 'text-[#666674] hover:text-[#1f1f26]'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Layers</span>
      </button>

      {/* Design (Themes, Fonts & Templates) Sheet Toggle */}
      <button
        onClick={onOpenTemplates}
        className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
          activeSheet === 'templates'
            ? 'text-[#7448e8] bg-[#f3f1ff] font-bold border border-[#ddd6fe]'
            : 'text-[#666674] hover:text-[#1f1f26]'
        }`}
      >
        <Palette className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Design</span>
      </button>

      {/* Primary Center [+] Add Button */}
      <button
        onClick={onOpenAddModal}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#5f8ff7] via-[#8252c7] to-[#3a0bb0] text-white shadow-lg shadow-[#8252c7]/30 active:scale-95 transition-all -mt-4 border-2 border-white"
        title="Add Portfolio Content"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Preview Toggle */}
      <button
        onClick={toggleEditMode}
        className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
          !isEditMode
            ? 'text-[#7448e8] bg-[#f3f1ff] font-bold border border-[#ddd6fe]'
            : 'text-[#666674] hover:text-[#1f1f26]'
        }`}
      >
        {!isEditMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        <span className="text-[10px] font-medium mt-1">{!isEditMode ? 'Edit' : 'Preview'}</span>
      </button>

      {/* Publish Trigger */}
      <button
        onClick={onPublish}
        className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-[#8252c7] hover:text-[#3a0bb0] transition-all"
      >
        <UploadCloud className="w-5 h-5 text-[#8252c7]" />
        <span className="text-[10px] font-bold text-[#8252c7] mt-1">Publish</span>
      </button>
    </nav>
  );
}
