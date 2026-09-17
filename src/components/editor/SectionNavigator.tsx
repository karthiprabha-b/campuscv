"use client";

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Settings2, GripVertical } from 'lucide-react';
import { useEditorContext, DetectedSection } from '../../context/EditorContext';
import { PortfolioData } from '../../utils/mockDb';

interface SectionNavigatorProps {
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
}

export default function SectionNavigator({ portfolio, onPortfolioChange }: SectionNavigatorProps) {
  const { detectedSections, setSelectedElement, setInspectorMode } = useEditorContext();

  const isVisible = (sectionId: string) => {
    const deletedNodes = (portfolio as any).deletedNodes || {};
    if (deletedNodes[`section:${sectionId}:root:section:0`] === true || deletedNodes[sectionId] === true) {
      return false;
    }
    const hiddenNodes = (portfolio as any).hiddenNodes || {};
    if (hiddenNodes[`section:${sectionId}:root:section:0`] === true || hiddenNodes[sectionId] === true) {
      return false;
    }
    const styleOverrides = (portfolio as any).styleOverrides || {};
    if (styleOverrides[sectionId]?.display === 'none' || styleOverrides[`section:${sectionId}:root:section:0`]?.display === 'none') {
      return false;
    }
    const hiddenFields = portfolio.hiddenFields || [];
    return !hiddenFields.includes(`sections.${sectionId}`) && !hiddenFields.includes(sectionId);
  };

  const toggleVisibility = (id: string) => {
    const isCurrentlyHidden = !isVisible(id);
    const hiddenFields = portfolio.hiddenFields || [];
    const updatedHiddenFields = isCurrentlyHidden
      ? hiddenFields.filter(f => f !== id && f !== `sections.${id}`)
      : [...hiddenFields, id];

    const updatedHiddenNodes = {
      ...((portfolio as any).hiddenNodes || {}),
      [id]: !isCurrentlyHidden,
      [`section:${id}:root:section:0`]: !isCurrentlyHidden
    };

    const updatedStyleOverrides = {
      ...((portfolio as any).styleOverrides || {}),
      [id]: {
        ...(((portfolio as any).styleOverrides || {})[id] || {}),
        display: isCurrentlyHidden ? '' : 'none'
      }
    };

    const updated: PortfolioData = {
      ...portfolio,
      hiddenFields: updatedHiddenFields,
      hiddenNodes: updatedHiddenNodes,
      styleOverrides: updatedStyleOverrides
    } as any;

    onPortfolioChange(updated);
  };

  const scrollToSection = useCallback((section: DetectedSection) => {
    if (section.el) {
      section.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSectionSettings = (section: DetectedSection) => {
    setSelectedElement({
      id: `section-${section.id}`,
      fieldPath: `sections.${section.id}`,
      elementType: 'section',
      sectionId: section.id,
      label: section.label,
    });
    setInspectorMode('section');
  };

  const templateId = (portfolio.templateId || (portfolio as any).layoutStyle || '').toLowerCase();
  const templateDefaultOrder = templateId.includes('static')
    ? ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact']
    : (templateId.includes('designer')
      ? ['hero', 'projects', 'about', 'process', 'experience', 'skills', 'education', 'certifications', 'stats', 'contact', 'footer']
      : (templateId.includes('doctor')
        ? ['hero', 'about', 'specialties', 'services', 'experience', 'education', 'certifications', 'contact']
        : ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'contact']));

  // Show detected sections first, then fall back to known list
  const KNOWN_SECTIONS_MAP: Record<string, { id: string; label: string; icon: string }> = {
    hero: { id: 'hero', label: 'Hero', icon: '🏠' },
    about: { id: 'about', label: 'About', icon: '👤' },
    skills: { id: 'skills', label: 'Skills', icon: '⚡' },
    projects: { id: 'projects', label: 'Projects', icon: '💻' },
    experience: { id: 'experience', label: 'Experience', icon: '💼' },
    education: { id: 'education', label: 'Education', icon: '🎓' },
    certifications: { id: 'certifications', label: 'Certifications', icon: '🏆' },
    process: { id: 'process', label: 'Process', icon: '🔄' },
    stats: { id: 'stats', label: 'Stats', icon: '📊' },
    contact: { id: 'contact', label: 'Contact', icon: '📬' },
    footer: { id: 'footer', label: 'Footer', icon: '📄' },
  };

  const fallbackList: DetectedSection[] = templateDefaultOrder
    .filter(id => KNOWN_SECTIONS_MAP[id])
    .map((id, i) => ({
      ...KNOWN_SECTIONS_MAP[id],
      isVisible: isVisible(id),
      order: i
    }));

  const displaySections: DetectedSection[] =
    detectedSections.length > 0
      ? detectedSections
      : fallbackList;

  return (
    <div className="space-y-1">
      <div className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <span>Page Sections</span>
        {detectedSections.length > 0 && (
          <span className="bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full text-[8px] font-bold">
            {detectedSections.length} detected
          </span>
        )}
      </div>

      {displaySections.map((section, i) => {
        const visible = isVisible(section.id);
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`group flex items-center gap-2 px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
              visible
                ? 'bg-white border-zinc-200 hover:border-[#7C3AED]/30 hover:bg-violet-50/30'
                : 'bg-zinc-50 border-zinc-150 opacity-50 hover:opacity-70'
            }`}
            onClick={() => scrollToSection(section)}
          >
            {/* Drag handle (visual only) */}
            <GripVertical className="w-3 h-3 text-zinc-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Icon */}
            <span className="text-sm shrink-0" role="img" aria-label={section.label}>
              {section.icon}
            </span>

            {/* Label */}
            <span className={`flex-1 text-xs font-semibold truncate ${visible ? 'text-zinc-800' : 'text-zinc-400 line-through'}`}>
              {section.label}
            </span>

            {/* Actions (shown on hover) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSectionSettings(section);
                }}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all"
                title="Section Settings"
              >
                <Settings2 className="w-3 h-3" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(section.id);
                }}
                className={`p-1 rounded-lg transition-all ${
                  visible
                    ? 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                }`}
                title={visible ? 'Hide section' : 'Show section'}
              >
                {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>
          </motion.div>
        );
      })}

      {displaySections.length === 0 && (
        <div className="text-center py-8 text-[10px] text-zinc-400">
          <p>No sections detected.</p>
          <p className="mt-1">Load a template to begin.</p>
        </div>
      )}
    </div>
  );
}
