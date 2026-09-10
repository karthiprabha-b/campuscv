"use client";

/**
 * ContextInspector — Slide-in Floating Property Inspector V2
 *
 * Framer / Canva inspired inspector panel that slides in from the right ONLY when an element is selected.
 * Completely hidden when no element is selected. Transforms into a bottom sheet on mobile/tablet viewports.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type, Image as ImageIcon, Square, List, Layers,
  Link as LinkIcon, Trash2, Plus, ArrowUp, ArrowDown, ArrowLeft,
  Camera, Sliders, Copy, MousePointer, X,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  AlertTriangle, Database, HelpCircle, Info,
  ChevronRight, Briefcase, FolderKanban, GraduationCap,
  Code, Award, Mail, User
} from 'lucide-react';
import { useEditorContext } from '../../context/EditorContext';
import { PortfolioData } from '../../utils/mockDb';
import { handleImageUpload, deleteServerAsset } from '../../utils/imageUploadStorage';
import { reflectObjectProperties, createUniversalCollectionObject } from '../../utils/universalEditorEngine';
import { normalizePortfolio } from '../../utils/portfolioNormalizer';

const inputCls = "w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400 text-zinc-800 bg-white transition-all";
const labelCls = "text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1";
const sectionHdr = "text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 mb-3";

interface ContextInspectorProps {
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
}

export default function ContextInspector({ portfolio, onPortfolioChange }: ContextInspectorProps) {
  const { selectedElement, setSelectedElement, selectedNode, setSelectedNode, inspectorMode, isEditMode } = useEditorContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ title: string; onConfirm: () => void } | null>(null);

  if (!isEditMode) return null;
  const isSelected = !!selectedElement || !!selectedNode;

  return (
    <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="flex fixed right-0 top-14 bottom-0 w-[320px] max-w-[320px] bg-white border-l border-zinc-200 shadow-2xl flex-col z-[500] overflow-hidden select-none pointer-events-auto"
        >
          {/* Inspector Header */}
          <div className="flex flex-col border-b border-zinc-100 shrink-0 bg-white">
            <div className="h-12 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-bold text-zinc-800 tracking-wide capitalize">
                  {selectedNode
                    ? `Edit ${selectedNode.type === 'button' ? 'Button' : selectedNode.type === 'link' ? 'Link' : selectedNode.type === 'image' ? 'Photo' : 'Text'}`
                    : selectedElement
                    ? `Edit ${(selectedElement.elementType || 'Element').toLowerCase()}`
                    : 'Properties'}
                </span>
              </div>
              <button
                onClick={() => { setSelectedElement(null); setSelectedNode(null); }}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                title="Close Inspector (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inspector Body */}
          <div className="flex-grow overflow-y-auto">
            <InspectorBody
              portfolio={portfolio}
              onPortfolioChange={onPortfolioChange}
              onRequestConfirm={(title, cb) => setShowDeleteConfirm({ title, onConfirm: cb })}
            />
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">Delete Item?</h4>
                    <p className="text-xs text-zinc-500">Are you sure you want to delete {showDeleteConfirm.title}?</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      showDeleteConfirm.onConfirm();
                      setShowDeleteConfirm(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function getCollectionForSection(portfolio: PortfolioData | null, sectionOrDataKey?: string): { collection: any[]; dataKey: string } {
  if (!portfolio) return { collection: [], dataKey: 'items' };

  const rawSec = (sectionOrDataKey || '').toLowerCase().replace(/^section-/, '');

  let dataKey = rawSec;
  if (rawSec.includes('exp') || rawSec.includes('timeline') || rawSec.includes('work')) {
    dataKey = (portfolio.experience && Array.isArray(portfolio.experience) && portfolio.experience.length > 0)
      ? 'experience'
      : ((portfolio.timeline && Array.isArray(portfolio.timeline)) ? 'timeline' : 'experience');
  } else if (rawSec.includes('edu')) {
    dataKey = 'education';
  } else if (rawSec.includes('proj')) {
    dataKey = 'projects';
  } else if (rawSec.includes('skill')) {
    dataKey = 'skills';
  } else if (rawSec.includes('cert') || rawSec.includes('award')) {
    dataKey = (portfolio.certifications && Array.isArray(portfolio.certifications)) ? 'certifications' : 'awards';
  } else if (rawSec.includes('blog')) {
    dataKey = 'blogs';
  } else if (rawSec.includes('testimonial')) {
    dataKey = 'testimonials';
  } else if (rawSec.includes('service')) {
    dataKey = 'services';
  }

  const rawCollection = (portfolio as any)[dataKey];
  const collection = Array.isArray(rawCollection) ? rawCollection : [];

  return { collection, dataKey };
}

export function getSelectedRecord(
  portfolio: PortfolioData | null,
  section?: string,
  id?: string,
  index?: number,
  fieldPath?: string
): { record: any | null; collection: any[]; dataKey: string; index: number } {
  const { collection, dataKey } = getCollectionForSection(
    portfolio,
    fieldPath?.match(/^([a-zA-Z0-9_]+)/)?.[1] || section
  );

  if (!collection || collection.length === 0) {
    return { record: null, collection: [], dataKey, index: -1 };
  }

  const cleanId = id ? String(id).trim() : '';
  const cleanIdLower = cleanId.toLowerCase();

  // 1. Try exact or normalized ID match
  if (cleanId) {
    const foundByIdIdx = collection.findIndex(item => {
      if (typeof item === 'object' && item !== null) {
        const itemCleanId = String(item.id || '').trim();
        if (itemCleanId) {
          if (itemCleanId === cleanId) return true;
          if (itemCleanId.toLowerCase() === cleanIdLower) return true;
          if (cleanIdLower.includes(itemCleanId.toLowerCase()) || itemCleanId.toLowerCase().includes(cleanIdLower)) return true;
        }
      }
      return false;
    });

    if (foundByIdIdx !== -1) {
      return { record: collection[foundByIdIdx], collection, dataKey, index: foundByIdIdx };
    }
  }

  // 2. Try index from fieldPath or prop
  let resolvedIdx = index;
  if (resolvedIdx === undefined && fieldPath) {
    const match = fieldPath.match(/\[(\d+)\]/);
    if (match) resolvedIdx = parseInt(match[1], 10);
  }

  if (resolvedIdx === undefined && cleanId) {
    const match = cleanId.match(/(?:card|li|cd|item)[-_:]?(\d+)/i);
    if (match) resolvedIdx = parseInt(match[1], 10);
  }

  if (resolvedIdx !== undefined && resolvedIdx >= 0 && resolvedIdx < collection.length) {
    return { record: collection[resolvedIdx], collection, dataKey, index: resolvedIdx };
  }

  return { record: collection[0] ?? null, collection, dataKey, index: collection.length > 0 ? 0 : -1 };
}

export function InspectorBody({
  portfolio,
  onPortfolioChange,
  onRequestConfirm
}: {
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
  onRequestConfirm?: (title: string, cb: () => void) => void;
}) {
  const { selectedElement, selectedNode, inspectorMode } = useEditorContext();

  let body = null;
  if (inspectorMode === 'universal_node' || selectedNode) {
    body = <UniversalNodeInspector />;
  } else if (inspectorMode === 'image' || selectedElement?.elementType === 'image') {
    body = <ImageInspector portfolio={portfolio} onPortfolioChange={onPortfolioChange} onRequestConfirm={onRequestConfirm} />;
  } else if (inspectorMode === 'card' || selectedElement?.elementType === 'card') {
    body = <UniversalCardInspector portfolio={portfolio} onPortfolioChange={onPortfolioChange} onRequestConfirm={onRequestConfirm} />;
  } else if (inspectorMode === 'list' || selectedElement?.elementType === 'list') {
    body = <ListInspector portfolio={portfolio} onPortfolioChange={onPortfolioChange} onRequestConfirm={onRequestConfirm} />;
  } else if (inspectorMode === 'section' || selectedElement?.elementType === 'section') {
    body = <SectionInspector portfolio={portfolio} onPortfolioChange={onPortfolioChange} onRequestConfirm={onRequestConfirm} />;
  } else {
    body = <TextElementInspector portfolio={portfolio} onPortfolioChange={onPortfolioChange} onRequestConfirm={onRequestConfirm} />;
  }

  return (
    <div className="flex flex-col min-h-full">
      {body}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Universal Card Inspector (Property Reflector)
// ─────────────────────────────────────────────────────────────────────────────

interface InspectorSubProps extends ContextInspectorProps {
  onRequestConfirm?: (title: string, cb: () => void) => void;
}

function UniversalCardInspector({ portfolio, onPortfolioChange, onRequestConfirm }: InspectorSubProps) {
  const { selectedElement, selectedNode, onFieldChange, setSelectedElement, portfolioData } = useEditorContext();
  const currentPortfolio = portfolio || portfolioData;
  const el = selectedElement;
  const targetId = el?.id || el?.nodeId || selectedNode?.nodeId || '';
  const sectionId = el?.sectionId || selectedNode?.sectionId || 'projects';

  const { record, collection, dataKey, index } = getSelectedRecord(
    currentPortfolio,
    sectionId,
    targetId,
    el?.index,
    el?.fieldPath
  );

  const arr = collection;
  const idx = index;
  const item = record;
  const arrayKey = dataKey;

  // ALL updates go through onFieldChange ONLY — single source of truth
  function update(key: string, value: any) {
    if (!arr || !onFieldChange || idx < 0) return;
    const next = [...arr];
    const targetObj = typeof next[idx] === 'object' ? { ...next[idx], [key]: value } : value;

    if (typeof targetObj === 'object' && targetObj !== null) {
      if (key === 'role') {
        targetObj.title = value;
        targetObj.position = value;
      } else if (key === 'title') {
        targetObj.role = value;
        targetObj.name = value;
      } else if (key === 'company') {
        targetObj.organization = value;
        targetObj.employer = value;
      } else if (key === 'institution') {
        targetObj.school = value;
        targetObj.university = value;
        targetObj.company = value;
      } else if (key === 'degree') {
        targetObj.title = value;
        targetObj.credential = value;
      } else if (key === 'field' || key === 'fieldOfStudy' || key === 'department') {
        targetObj.field = value;
        targetObj.fieldOfStudy = value;
        targetObj.department = value;
        targetObj.specialization = value;
        targetObj.major = value;
      } else if (key === 'description') {
        targetObj.desc = value;
        targetObj.summary = value;
      } else if (key === 'startDate') {
        targetObj.startDate = value;
        targetObj.startYear = value;
        targetObj.start = value;
        targetObj.from = value;
        const end = targetObj.endDate || targetObj.endYear || targetObj.end || targetObj.to || targetObj.graduationYear || '';
        if (value && end) targetObj.period = `${value} – ${end}`;
        else if (value) targetObj.period = value;
        else if (end) targetObj.period = end;
        else targetObj.period = '';
        targetObj.year = targetObj.period || value;
        targetObj.years = targetObj.period || value;
        targetObj.duration = targetObj.period || value;
        targetObj.date = targetObj.period || value;
      } else if (key === 'endDate') {
        targetObj.endDate = value;
        targetObj.endYear = value;
        targetObj.end = value;
        targetObj.to = value;
        targetObj.graduationYear = value;
        const start = targetObj.startDate || targetObj.startYear || targetObj.start || targetObj.from || '';
        if (start && value) targetObj.period = `${start} – ${value}`;
        else if (value) targetObj.period = value;
        else if (start) targetObj.period = start;
        else targetObj.period = '';
        targetObj.year = targetObj.period || value;
        targetObj.years = targetObj.period || value;
        targetObj.duration = targetObj.period || value;
        targetObj.date = targetObj.period || value;
      } else if (key === 'issuer' || key === 'organization') {
        targetObj.organization = value;
        targetObj.issuedBy = value;
        targetObj.issuer = value;
      } else if (key === 'date' || key === 'year' || key === 'issueDate' || key === 'issuedDate' || key === 'period') {
        targetObj.date = value;
        targetObj.year = value;
        targetObj.years = value;
        targetObj.issueDate = value;
        targetObj.issuedDate = value;
        targetObj.period = value;
        targetObj.duration = value;
      }
    }

    next[idx] = targetObj;
    onFieldChange(arrayKey, next);
  }

  const handleDuplicate = () => {
    if (!arr || !onFieldChange || idx < 0) return;
    const timestamp = Date.now();
    const prefix = arrayKey.slice(0, 4);
    const itemToClone = typeof item === 'object' && item !== null
      ? { ...item, id: `${prefix}-${timestamp}` }
      : `${item} (Copy)`;
    if (typeof itemToClone === 'object' && itemToClone.title) itemToClone.title += ' (Copy)';
    
    const next = [...arr];
    next.splice(idx + 1, 0, itemToClone);
    onFieldChange(arrayKey, next);

    setTimeout(() => {
      setSelectedElement({
        id: typeof itemToClone === 'object' ? itemToClone.id : `item-${arrayKey}-${idx + 1}`,
        fieldPath: `${arrayKey}[${idx + 1}]`,
        elementType: typeof itemToClone === 'string' ? 'list' : 'card',
        sectionId: sectionId,
        index: idx + 1,
        label: typeof itemToClone === 'string' ? itemToClone : (itemToClone.title || itemToClone.name || 'Duplicated Item')
      });
    }, 50);
  };

  const handleDelete = () => {
    const title = typeof item === 'object' && item ? (item.title || item.name || item.role || item.degree || 'Item') : `Card #${idx + 1}`;
    const targetItemId = typeof item === 'object' && item ? item.id : undefined;
    const performDelete = () => {
      if (!arr || !onFieldChange) return;
      const next = arr.filter((it: any, i: number) => {
        if (targetItemId && typeof it === 'object' && it?.id) {
          return it.id !== targetItemId;
        }
        return i !== idx;
      });
      onFieldChange(arrayKey, next);
      setSelectedElement(null);
    };

    if (onRequestConfirm) {
      onRequestConfirm(title, performDelete);
    } else {
      performDelete();
    }
  };

  const properties = reflectObjectProperties(item, arrayKey);

  const { setInspectorMode } = useEditorContext();

  if (!item) {
    return (
      <div className="p-4 space-y-3">
        <p className={sectionHdr}><Square className="w-3.5 h-3.5 text-violet-500" />Item Details ({arrayKey})</p>
        <p className="text-xs text-zinc-400 italic">No record details found for this selection.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Back to Section View Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
        <button
          onClick={() => {
            setSelectedElement({
              id: `section-${sectionId}`,
              fieldPath: `sections.${sectionId}`,
              elementType: 'section',
              sectionId: sectionId,
              label: `${arrayKey.toUpperCase()} Section`,
            });
            setInspectorMode('section');
          }}
          className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 px-2.5 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {arrayKey.charAt(0).toUpperCase() + arrayKey.slice(1)} List</span>
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <p className={sectionHdr}><Square className="w-3.5 h-3.5 text-violet-500" />Item Details ({arrayKey})</p>
        <div className="flex items-center gap-1">
          <button onClick={handleDuplicate} className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-600 transition-colors" title="Duplicate Item (Ctrl+D)">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => {
            if (!arr || !onFieldChange || idx === 0) return;
            const next = [...arr];
            [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
            onFieldChange(arrayKey, next);
          }} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500" title="Move Up">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => {
            if (!arr || !onFieldChange || idx === arr.length - 1) return;
            const next = [...arr];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            onFieldChange(arrayKey, next);
          }} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500" title="Move Down">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete Item">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {properties.map(({ key, label, type, value }) => {
        const inputKey = `${targetId}-${key}`;
        if (type === 'image' && typeof value === 'string') return (
          <div key={key}>
            <label className={labelCls}>{label}</label>
            {value && <img src={value} alt="" className="w-full h-24 object-cover rounded-xl border border-zinc-200 mb-2" />}
            <button onClick={() => {
              const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
              input.onchange = (e: any) => {
                const file = e.target.files?.[0]; if (!file) return;
                const r = new FileReader(); r.onloadend = () => typeof r.result === 'string' && update(key, r.result);
                r.readAsDataURL(file);
              };
              input.click();
            }} className="w-full py-2 bg-violet-50 text-violet-700 hover:bg-violet-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors">
              <Camera className="w-3.5 h-3.5" />Replace Photo
            </button>
          </div>
        );

        if (type === 'array') return (
          <div key={key}>
            <label className={labelCls}>{label} (Comma separated)</label>
            <input key={inputKey} type="text" className={inputCls} defaultValue={Array.isArray(value) ? value.join(', ') : ''}
              placeholder="e.g. React, TypeScript, Python"
              onBlur={(e) => update(key, e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          </div>
        );

        if (type === 'boolean') return (
          <div key={key} className="flex items-center justify-between py-1">
            <label className={labelCls}>{label}</label>
            <input key={inputKey} type="checkbox" defaultChecked={Boolean(value)} onChange={(e) => update(key, e.target.checked)} className="rounded text-violet-600 focus:ring-violet-400" />
          </div>
        );

        return (
          <div key={key}>
            <label className={labelCls}>{label}</label>
            {type === 'longtext' ? (
              <textarea key={inputKey} rows={3} className={`${inputCls} resize-none`} defaultValue={String(value ?? '')}
                onBlur={(e) => update(key, e.target.value)} />
            ) : (
              <input key={inputKey} type={type === 'url' ? 'url' : type === 'number' ? 'number' : 'text'} className={inputCls} defaultValue={String(value ?? '')}
                placeholder={type === 'url' ? 'https://' : ''}
                onBlur={(e) => update(key, e.target.value)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Color conversion helper: converts rgb, rgba, hex, and named colors to 6-digit hex
// ─────────────────────────────────────────────────────────────────────────────

function parseToHex(color: string | undefined | null, fallback: string = '#000000'): { hex: string; isTransparent: boolean } {
  if (!color) return { hex: fallback, isTransparent: true };
  const c = color.trim().toLowerCase();
  if (c === 'transparent' || c === 'rgba(0, 0, 0, 0)' || c === 'rgba(0,0,0,0)' || c === 'inherit' || c === 'initial') {
    return { hex: fallback, isTransparent: true };
  }
  if (/^#[0-9a-f]{6}$/i.test(c)) {
    return { hex: c, isTransparent: false };
  }
  if (/^#[0-9a-f]{3}$/i.test(c)) {
    return { hex: `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`, isTransparent: false };
  }
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (m) {
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (a === 0) return { hex: fallback, isTransparent: true };
    const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
    return { hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`, isTransparent: false };
  }
  if (c === 'white') return { hex: '#ffffff', isTransparent: false };
  if (c === 'black') return { hex: '#000000', isTransparent: false };
  return { hex: fallback, isTransparent: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// Text Element Inspector
// ─────────────────────────────────────────────────────────────────────────────

function TextElementInspector({ portfolio, onPortfolioChange, onRequestConfirm }: InspectorSubProps) {
  const { selectedElement, onFieldChange, setSelectedElement } = useEditorContext();
  const el = selectedElement;
  if (!el) return null;

  const currentText = el.el?.textContent?.trim() ?? '';
  const isButton = ['button', 'link'].includes(el.elementType);

  const applyStyle = (property: string, value: string) => {
    if (el.el) (el.el.style as any)[property] = value;
  };

  const handleDelete = () => {
    const targetNodeId = el.id || (el.el ? el.el.getAttribute('data-node-id') : null);
    const performDelete = () => {
      if (el.el) el.el.style.display = 'none';
      if (targetNodeId && onFieldChange) {
        onFieldChange(`deletedNodes.${targetNodeId}`, true);
      }
      setSelectedElement(null);
    };

    if (onRequestConfirm) {
      onRequestConfirm('Selected Text Element', performDelete);
    } else {
      performDelete();
    }
  };

  return (
    <div className="p-4 space-y-5">
      <div>
        <p className={sectionHdr}><Type className="w-3.5 h-3.5 text-violet-500" />Text Content</p>
        <div className="space-y-2">
          <label className={labelCls}>Content</label>
          <textarea
            rows={3}
            defaultValue={currentText}
            className={`${inputCls} resize-none`}
            onChange={(e) => {
              if (onFieldChange) onFieldChange(el.fieldPath, e.target.value);
              if (el.el) el.el.textContent = e.target.value;
            }}
            onBlur={(e) => {
              if (onFieldChange) onFieldChange(el.fieldPath, e.target.value);
              if (el.el) el.el.textContent = e.target.value;
            }}
          />
        </div>
      </div>

      {isButton && (
        <div>
          <p className={sectionHdr}><LinkIcon className="w-3.5 h-3.5 text-blue-500" />Link Address</p>
          <div className="space-y-2">
            <label className={labelCls}>URL Address</label>
            <input type="url" className={inputCls} defaultValue={el.el instanceof HTMLAnchorElement ? (el.el as HTMLAnchorElement).href : ''} placeholder="https://yourlink.com"
              onBlur={(e) => {
                if (el.el instanceof HTMLAnchorElement) el.el.href = e.target.value;
                if (onFieldChange) onFieldChange(el.fieldPath + '.url', e.target.value);
              }} />
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-zinc-100">
        <button onClick={handleDelete} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all">
          <Trash2 className="w-3.5 h-3.5" />Delete Text Element
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Inspector
// ─────────────────────────────────────────────────────────────────────────────

function ImageInspector({ portfolio, onPortfolioChange, onRequestConfirm }: InspectorSubProps) {
  const { selectedElement, onFieldChange, setSelectedElement } = useEditorContext();
  const el = selectedElement;
  if (!el) return null;

  const imgEl = el.el as HTMLImageElement | null;
  const currentSrc = imgEl?.src || (portfolio as any)[el.fieldPath] || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const field = el.fieldPath || '';
    const section = el.sectionId || '';
    const category = (field.includes('avatar') || field.includes('profile') || field.includes('photo') || section === 'about')
      ? 'avatar'
      : (field.includes('project') || section === 'projects')
      ? 'projects'
      : (field.includes('hero') || field.includes('banner'))
      ? 'banners'
      : 'general';

    handleImageUpload(
      file,
      (b64: string) => {
        if (imgEl) imgEl.src = b64;
      },
      (finalUrl?: string) => {
        if (finalUrl && onFieldChange) {
          if (imgEl) imgEl.src = finalUrl;
          onFieldChange(el.fieldPath, finalUrl);
        }
      },
      { category, username: (portfolio as any)?.username || (portfolio as any)?.id }
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className={sectionHdr}><ImageIcon className="w-3.5 h-3.5 text-violet-500" />Image Source & Media</p>
        <div className="space-y-3">
          {currentSrc && (
            <img src={currentSrc} alt="" className="w-full h-32 object-cover rounded-xl border border-zinc-200 shadow-xs mb-2" />
          )}

          <div>
            <label className={labelCls}>Upload Local Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer" />
          </div>

          <div>
            <label className={labelCls}>Image URL</label>
            <input
              type="url"
              className={inputCls}
              defaultValue={currentSrc}
              onBlur={(e) => {
                if (imgEl) imgEl.src = e.target.value;
                if (onFieldChange) onFieldChange(el.fieldPath, e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <button onClick={() => {
        if (onRequestConfirm) {
          onRequestConfirm('Selected Image', () => {
            if (imgEl) imgEl.style.display = 'none';
            setSelectedElement(null);
          });
        } else {
          if (imgEl) imgEl.style.display = 'none';
          setSelectedElement(null);
        }
      }} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all">
        <Trash2 className="w-3.5 h-3.5" />Delete Photo
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// List Inspector
// ─────────────────────────────────────────────────────────────────────────────

function ListInspector({ portfolio, onPortfolioChange, onRequestConfirm }: InspectorSubProps) {
  const { selectedElement, onFieldChange, portfolioData } = useEditorContext();
  const currentPortfolio = portfolio || portfolioData;
  const el = selectedElement;
  if (!el) return null;

  const { collection, dataKey } = getCollectionForSection(currentPortfolio, el.sectionId || el.fieldPath);
  const arr = collection;
  const arrayKey = dataKey;

  if (!Array.isArray(arr) || arr.length === 0) return <div className="p-4 text-xs text-zinc-400 italic">No items found in {arrayKey} list.</div>;

  // ALL updates go through onFieldChange ONLY — single source of truth
  const update = (next: any[]) => {
    if (!onFieldChange) return;
    onFieldChange(arrayKey, next);
  };

  return (
    <div className="p-4 space-y-3">
      <p className={sectionHdr}><List className="w-3.5 h-3.5 text-violet-500" />{arrayKey} List</p>

      {arr.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400"
            defaultValue={typeof item === 'string' ? item : item.name ?? item.title ?? ''}
            onBlur={(e) => {
              const next = [...arr];
              next[i] = typeof item === 'string' ? e.target.value : { ...item, name: e.target.value };
              update(next);
            }}
          />
          <button onClick={() => update(arr.filter((_: any, j: number) => j !== i))} className="p-1 text-zinc-400 hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      <button onClick={() => update([...arr, typeof arr[0] === 'string' ? 'New Skill' : { ...arr[arr.length - 1], name: 'New Skill' }])}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-violet-300 text-violet-600 hover:bg-violet-50 text-xs font-bold transition-all">
        <Plus className="w-3.5 h-3.5" />Add Item
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Inspector
// ─────────────────────────────────────────────────────────────────────────────

function SectionInspector({ portfolio, onPortfolioChange, onRequestConfirm }: InspectorSubProps) {
  const { selectedElement, onFieldChange, setSelectedElement, setInspectorMode } = useEditorContext();
  const el = selectedElement;
  if (!el) return null;

  const rawSecId = (el.sectionId || 'projects').toLowerCase();
  const sectionId = rawSecId.replace(/^section-/, '');

  // Helper to open record detail
  const handleSelectRecord = (dataKey: string, idx: number, label: string, itemId?: string) => {
    setSelectedElement({
      id: itemId || `item-${dataKey}-${idx}`,
      fieldPath: `${dataKey}[${idx}]`,
      elementType: dataKey === 'skills' ? 'list' : 'card',
      sectionId: sectionId,
      index: idx,
      label: label,
    });
    setInspectorMode(dataKey === 'skills' ? 'list' : 'card');
  };

  // Helper to add record
  const handleAddRecord = (dataKey: string) => {
    const list = Array.isArray((portfolio as any)[dataKey]) ? [...(portfolio as any)[dataKey]] : [];
    const newItem = createUniversalCollectionObject(dataKey, list);
    const updatedList = [...list, newItem];
    
    if (onFieldChange) {
      onFieldChange(dataKey, updatedList);
    }
    const newIdx = updatedList.length - 1;
    handleSelectRecord(
      dataKey,
      newIdx,
      typeof newItem === 'string' ? (newItem || 'New Record') : (newItem.title || newItem.name || newItem.role || 'New Record'),
      typeof newItem === 'object' ? newItem?.id : undefined
    );
  };

  // 1. EXPERIENCE SECTION
  if (sectionId.includes('exp') || sectionId.includes('work') || sectionId.includes('timeline')) {
    const items = ((portfolio as any).experience && (portfolio as any).experience.length > 0
      ? (portfolio as any).experience
      : ((portfolio as any).timeline || [])) as any[];
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Experience Records
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Manage work history and roles</p>
          </div>
          <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded-full font-bold text-zinc-600">
            {items.length} items
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectRecord('experience', idx, item.role || item.title || `Experience #${idx + 1}`, item.id)}
              className="p-3 rounded-xl border border-zinc-200 hover:border-violet-400 hover:bg-violet-50/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-violet-700">
                  {item.role || item.title || `Position #${idx + 1}`}
                </h4>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  {item.company || item.organization || 'Company'} {item.startDate ? `• ${item.startDate}` : ''} {item.endDate ? `- ${item.endDate}` : ''}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 shrink-0 ml-2" />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleAddRecord('experience')}
          className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-2 border border-violet-200 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Experience</span>
        </button>
      </div>
    );
  }

  // 2. PROJECTS SECTION
  if (sectionId.includes('project')) {
    const items = ((portfolio as any).projects || []) as any[];
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4 text-violet-600" />
              Project Records
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Manage software projects and portfolio items</p>
          </div>
          <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded-full font-bold text-zinc-600">
            {items.length} items
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectRecord('projects', idx, item.title || `Project #${idx + 1}`, item.id)}
              className="p-3 rounded-xl border border-zinc-200 hover:border-violet-400 hover:bg-violet-50/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-violet-700">
                  {item.title || `Project #${idx + 1}`}
                </h4>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  {item.description || item.subtitle || 'Project details'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 shrink-0 ml-2" />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleAddRecord('projects')}
          className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-2 border border-violet-200 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Project</span>
        </button>
      </div>
    );
  }

  // 3. EDUCATION SECTION
  if (sectionId.includes('edu')) {
    const items = ((portfolio as any).education && (portfolio as any).education.length > 0
      ? (portfolio as any).education
      : ((portfolio as any).timeline || [])) as any[];
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Education Records
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Degrees, qualifications, and academic history</p>
          </div>
          <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded-full font-bold text-zinc-600">
            {items.length} items
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectRecord('education', idx, item.degree || item.title || `Education #${idx + 1}`, item.id)}
              className="p-3 rounded-xl border border-zinc-200 hover:border-violet-400 hover:bg-violet-50/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-violet-700">
                  {item.degree || item.title || `Qualification #${idx + 1}`}
                </h4>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  {item.institution || item.school || item.university || item.company || 'Institution'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 shrink-0 ml-2" />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleAddRecord('education')}
          className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-2 border border-violet-200 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Education</span>
        </button>
      </div>
    );
  }

  // 4. SKILLS SECTION
  if (sectionId.includes('skill')) {
    const items = ((portfolio as any).skills || []) as any[];
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Code className="w-4 h-4 text-cyan-600" />
              Skills & Tech
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Programming languages, tools, and frameworks</p>
          </div>
          <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded-full font-bold text-zinc-600">
            {items.length} items
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => {
            const skillName = typeof item === 'string' ? item : (item.name || item.title || `Skill #${idx + 1}`);
            return (
              <span
                key={idx}
                onClick={() => handleSelectRecord('skills', idx, skillName)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-purple-100 hover:text-purple-800 text-zinc-800 text-xs font-bold border border-zinc-200 cursor-pointer transition-all flex items-center gap-1.5"
              >
                {skillName}
              </span>
            );
          })}
        </div>

        <button
          onClick={() => handleAddRecord('skills')}
          className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-2 border border-violet-200 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Skill</span>
        </button>
      </div>
    );
  }

  // 5. CERTIFICATIONS SECTION
  if (sectionId.includes('cert')) {
    const items = ((portfolio as any).certifications || (portfolio as any).awards || []) as any[];
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Award className="w-4 h-4 text-rose-600" />
              Certifications & Awards
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Verified certificates and achievements</p>
          </div>
          <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded-full font-bold text-zinc-600">
            {items.length} items
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectRecord('certifications', idx, item.name || item.title || `Certification #${idx + 1}`, item.id)}
              className="p-3 rounded-xl border border-zinc-200 hover:border-violet-400 hover:bg-violet-50/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-violet-700">
                  {item.name || item.title || `Certification #${idx + 1}`}
                </h4>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  {item.issuer || item.organization || 'Issuer'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 shrink-0 ml-2" />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleAddRecord('certifications')}
          className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-2 border border-violet-200 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Certification</span>
        </button>
      </div>
    );
  }

  // 6. CONTACT & SOCIAL SECTION
  if (sectionId.includes('contact') || sectionId.includes('social')) {
    const contact = (portfolio as any)?.contact || (portfolio as any)?.personal || (portfolio as any)?.profile || {};
    const socials = (portfolio as any)?.socialLinks || (portfolio as any)?.social || {};
    return (
      <div className="p-4 space-y-4">
        <div className="border-b border-zinc-100 pb-3">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-purple-600" />
            Contact & Social Info
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Personal contact details and profile links</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              className={inputCls}
              defaultValue={contact.email || (portfolio as any)?.ownerEmail || (portfolio as any)?.email || ''}
              onBlur={(e) => {
                onFieldChange?.('contact.email', e.target.value);
                onFieldChange?.('email', e.target.value);
                onFieldChange?.('ownerEmail', e.target.value);
              }}
            />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input
              type="text"
              className={inputCls}
              defaultValue={contact.phone || (portfolio as any)?.phone || ''}
              onBlur={(e) => {
                onFieldChange?.('contact.phone', e.target.value);
                onFieldChange?.('phone', e.target.value);
              }}
            />
          </div>
          <div>
            <label className={labelCls}>Location / City</label>
            <input
              type="text"
              className={inputCls}
              defaultValue={contact.location || (portfolio as any)?.location || ''}
              onBlur={(e) => {
                onFieldChange?.('contact.location', e.target.value);
                onFieldChange?.('location', e.target.value);
              }}
            />
          </div>
          <div>
            <label className={labelCls}>GitHub Profile URL</label>
            <input
              type="url"
              className={inputCls}
              defaultValue={contact.github || socials.github || ''}
              onBlur={(e) => {
                onFieldChange?.('contact.github', e.target.value);
                onFieldChange?.('socialLinks.github', e.target.value);
              }}
            />
          </div>
          <div>
            <label className={labelCls}>LinkedIn Profile URL</label>
            <input
              type="url"
              className={inputCls}
              defaultValue={contact.linkedin || socials.linkedin || ''}
              onBlur={(e) => {
                onFieldChange?.('contact.linkedin', e.target.value);
                onFieldChange?.('socialLinks.linkedin', e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 7. GENERIC COLLECTION SECTION HANDLER (Testimonials, Services, Awards, Clients, Publications, Achievements, Languages, Custom)
  const { collection: genericItems, dataKey: genericKey } = getCollectionForSection(portfolio, sectionId);
  if (Array.isArray(genericItems) && (genericItems.length > 0 || (portfolio as any)?.[genericKey] !== undefined || ['testimonials', 'services', 'awards', 'clients', 'publications', 'achievements', 'languages', 'casestudies'].includes(sectionId.toLowerCase()))) {
    const secTitle = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/([A-Z])/g, ' $1');
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-600" />
              {secTitle} Records
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Manage {secTitle.toLowerCase()} items</p>
          </div>
          <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded-full font-bold text-zinc-600">
            {genericItems.length} items
          </span>
        </div>

        <div className="space-y-2">
          {genericItems.map((item, idx) => {
            const itemTitle = typeof item === 'string' ? item : (item.title || item.name || item.role || item.quote || `${secTitle} #${idx + 1}`);
            const itemSub = typeof item === 'object' && item ? (item.description || item.subtitle || item.company || item.issuer || '') : '';
            return (
              <div
                key={idx}
                onClick={() => handleSelectRecord(genericKey, idx, itemTitle, typeof item === 'object' ? item.id : undefined)}
                className="p-3 rounded-xl border border-zinc-200 hover:border-violet-400 hover:bg-violet-50/40 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-zinc-900 truncate group-hover:text-violet-700">
                    {itemTitle}
                  </h4>
                  {itemSub && (
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {itemSub}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-600 shrink-0 ml-2" />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => handleAddRecord(genericKey)}
          className="w-full py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center gap-2 border border-violet-200 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add {secTitle.replace(/s$/, '')}</span>
        </button>
      </div>
    );
  }

  // 8. DEFAULT PROFILE SECTION (HERO / ABOUT)
  const personal = ((portfolio as any)?.personal || (portfolio as any)?.profile || (portfolio as any) || {}) as any;
  return (
    <div className="p-4 space-y-4">
      <div className="border-b border-zinc-100 pb-3">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <User className="w-4 h-4 text-blue-600" />
          Profile Information
        </h3>
        <p className="text-[11px] text-zinc-500 mt-0.5">Hero intro, bio, and main personal details</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className={labelCls}>Full Name</label>
          <input
            type="text"
            className={inputCls}
            defaultValue={personal.fullName || personal.name || (portfolio as any)?.name || ''}
            onBlur={(e) => {
              onFieldChange?.('personal.fullName', e.target.value);
              onFieldChange?.('name', e.target.value);
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Professional Headline</label>
          <input
            type="text"
            className={inputCls}
            defaultValue={personal.headline || personal.role || (portfolio as any)?.tagline || ''}
            onBlur={(e) => {
              onFieldChange?.('personal.headline', e.target.value);
              onFieldChange?.('tagline', e.target.value);
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Bio / About Summary</label>
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            defaultValue={personal.bio || personal.summary || (portfolio as any)?.aboutMe || ''}
            onBlur={(e) => {
              onFieldChange?.('personal.bio', e.target.value);
              onFieldChange?.('aboutMe', e.target.value);
            }}
          />
        </div>
        <div>
          <label className={labelCls}>Avatar / Photo URL</label>
          <input
            type="url"
            className={inputCls}
            defaultValue={personal.avatarUrl || personal.avatar || (portfolio as any)?.profileImage || ''}
            onBlur={(e) => {
              onFieldChange?.('personal.avatarUrl', e.target.value);
              onFieldChange?.('profileImage', e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Universal Node Inspector — Visual Editability for ANY Uploaded Template Node
// ─────────────────────────────────────────────────────────────────────────────

function UniversalNodeInspector() {
  const { selectedNode, onFieldChange, portfolioData, setSelectedNode, setSelectedElement } = useEditorContext();
  if (!selectedNode) return null;

  const nodeId = selectedNode.nodeId;
  const pData = (portfolioData || {}) as any;

  const contentOverride = pData.contentOverrides?.[nodeId] || {};
  const styleOverride = pData.styleOverrides?.[nodeId] || {};

  const currentText = contentOverride.value !== undefined ? contentOverride.value : selectedNode.currentValue;
  const currentSrc = contentOverride.src !== undefined ? contentOverride.src : (selectedNode.currentSrc || '');
  const currentHref = contentOverride.href !== undefined ? contentOverride.href : (selectedNode.currentHref || '#');
  const currentTarget = contentOverride.target || (selectedNode.el as HTMLAnchorElement)?.target || '_self';
  const currentLabel = contentOverride.label !== undefined ? contentOverride.label : (contentOverride.value !== undefined ? contentOverride.value : selectedNode.currentValue);
  const currentAlt = contentOverride.alt || '';
  // 1. Text color: parse computed rgb(...) to 6-digit hex
  const rawColor = styleOverride.color || selectedNode.currentStyles.color || '#0f172a';
  const parsedColor = parseToHex(rawColor, '#0f172a');
  const currentColorHex = parsedColor.hex;

  // 2. Background color: parse computed rgb/rgba to hex & detect transparent
  const rawBg = styleOverride.backgroundColor !== undefined
    ? styleOverride.backgroundColor
    : (selectedNode.currentStyles.backgroundColor || 'transparent');
  const parsedBg = parseToHex(rawBg, '#ffffff');
  const isBgTransparent = rawBg === 'transparent' || parsedBg.isTransparent;
  const currentBgHex = parsedBg.hex;

  const currentFontSize = styleOverride.fontSize ? parseInt(styleOverride.fontSize) : 16;
  const currentFontWeight = styleOverride.fontWeight || '400';
  const currentTextAlign = styleOverride.textAlign || 'left';
  const currentBorderRadius = styleOverride.borderRadius || '0px';

  // Local state buffering for text inputs to prevent typing lag or focus jitter
  const [localText, setLocalText] = useState(currentText);
  const [localLabel, setLocalLabel] = useState(currentLabel);
  const [localHref, setLocalHref] = useState(currentHref);
  const [localAlt, setLocalAlt] = useState(currentAlt);

  useEffect(() => {
    setLocalText(currentText);
  }, [nodeId, currentText]);

  useEffect(() => {
    setLocalLabel(currentLabel);
  }, [nodeId, currentLabel]);

  useEffect(() => {
    setLocalHref(currentHref);
  }, [nodeId, currentHref]);

  useEffect(() => {
    setLocalAlt(currentAlt);
  }, [nodeId, currentAlt]);

  const handleTextCommit = (val: string) => {
    if (!onFieldChange) return;
    onFieldChange(`contentOverrides.${nodeId}`, { ...contentOverride, type: selectedNode.type, value: val });

    const colName = selectedNode.collection || (selectedNode.sectionId === 'projects' ? 'projects' : undefined);
    const colIdx = selectedNode.collectionIndex !== undefined ? selectedNode.collectionIndex : selectedNode.index;
    const fieldName = selectedNode.field;
    if (colName && colIdx !== undefined && colIdx >= 0 && fieldName) {
      onFieldChange(`${colName}.${colIdx}.${fieldName}`, val);
    }

    if (selectedNode.el) selectedNode.el.innerText = val;
  };

  const handleButtonCommit = (newLabel: string, newHref: string, newTarget?: string) => {
    if (!onFieldChange) return;
    const effectiveHref = newHref.trim() ? newHref.trim() : '#';
    onFieldChange(`contentOverrides.${nodeId}`, {
      ...contentOverride,
      type: 'button',
      value: newLabel,
      label: newLabel,
      href: effectiveHref,
      target: newTarget || currentTarget
    });

    if (selectedNode.el) {
      const btnSpan = selectedNode.el.querySelector('span');
      if (btnSpan) btnSpan.innerText = newLabel;
      else selectedNode.el.innerText = newLabel;

      if (selectedNode.el.tagName.toLowerCase() === 'a') {
        (selectedNode.el as HTMLAnchorElement).href = effectiveHref;
        if (newTarget) (selectedNode.el as HTMLAnchorElement).target = newTarget;
      }
    }
  };

  const handleStyleChange = (prop: string, val: any) => {
    if (!onFieldChange) return;
    const existingStyles = styleOverride || {};
    const updatedStyles = {
      ...existingStyles,
      [prop]: val
    };
    onFieldChange(`styleOverrides.${nodeId}`, updatedStyles);
    if (selectedNode.el) (selectedNode.el.style as any)[prop] = val;
  };

  const handleImageChange = (srcUrl: string) => {
    if (!onFieldChange) return;
    onFieldChange(`contentOverrides.${nodeId}`, { ...contentOverride, type: 'image', src: srcUrl });
    onFieldChange(`imageOverrides.${nodeId}`, srcUrl);

    const colName = selectedNode.collection || (selectedNode.sectionId === 'projects' ? 'projects' : undefined);
    const colIdx = selectedNode.collectionIndex !== undefined ? selectedNode.collectionIndex : selectedNode.index;
    if (colName && colIdx !== undefined && colIdx >= 0) {
      onFieldChange(`${colName}.${colIdx}.image`, srcUrl);
      onFieldChange(`${colName}.${colIdx}.imageUrl`, srcUrl);
    }

    const isProfileOrAvatar =
      nodeId.includes('avatar') ||
      nodeId.includes('profile') ||
      nodeId.includes('portrait') ||
      selectedNode.sectionId === 'hero' ||
      selectedNode.sectionId === 'about';

    if (isProfileOrAvatar) {
      onFieldChange('profileImage', srcUrl);
      onFieldChange('avatarUrl', srcUrl);
      onFieldChange('about.avatarUrl', srcUrl);
    }

    if (selectedNode.el) (selectedNode.el as HTMLImageElement).src = srcUrl;
  };

  const isButton = selectedNode.type === 'button' || selectedNode.type === 'link' || selectedNode.tag === 'button' || selectedNode.tag === 'a' || nodeId.startsWith('button:');
  const isImage = selectedNode.type === 'image' || selectedNode.tag === 'img' || nodeId.startsWith('image:');
  const isContainer = (selectedNode.type as any) === 'container' || (selectedNode.type as any) === 'card' || selectedNode.type === 'section' || nodeId.startsWith('container:') || nodeId.startsWith('card:') || nodeId.startsWith('section:');
  const isText = !isContainer && !isButton && !isImage;

  const currentBorderWidth = styleOverride.borderWidth || '0px';
  const currentBorderStyle = styleOverride.borderStyle || 'solid';
  const currentBorderColor = parseToHex(styleOverride.borderColor || '#E5E0D8', '#E5E0D8').hex;
  const currentPadding = styleOverride.padding || 'auto';

  return (
    <div className="p-4 space-y-5 text-xs text-zinc-800 select-none">
      {/* ─── 1. CONTAINER / CARD / PILL / SHAPE CONTROLS ─── */}
      {isContainer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <span className="font-extrabold text-[11px] text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-violet-600" />
              Container & Shape Properties
            </span>
            <span className="text-[10px] font-mono bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-bold">
              {nodeId.split(':')[1] || 'shape'}
            </span>
          </div>

          {/* Background Color & Transparency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Background Color</label>
              <button
                type="button"
                onClick={() => handleStyleChange('backgroundColor', isBgTransparent ? '#ffffff' : 'transparent')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer border ${
                  isBgTransparent
                    ? 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                    : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
                }`}
              >
                {isBgTransparent ? 'Set Solid Color' : 'Make Transparent'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentBgHex}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5 shrink-0"
              />
              <input
                type="text"
                value={isBgTransparent ? 'TRANSPARENT' : (styleOverride.backgroundColor || currentBgHex.toUpperCase())}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                placeholder="#HEX or transparent"
                className={inputCls + " font-mono text-[11px] uppercase"}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['transparent', '#ffffff', '#FAF8F5', '#111111', '#FF4500', '#7C3AED', '#2563eb', '#059669', '#dc2626', '#f59e0b'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleStyleChange('backgroundColor', c)}
                  title={c === 'transparent' ? 'Transparent' : c}
                  className={`w-6 h-6 rounded-full border border-zinc-200 shadow-2xs hover:scale-110 transition-transform flex items-center justify-center text-[8px] font-bold ${
                    c === 'transparent' ? 'bg-zinc-100 text-zinc-500' : ''
                  }`}
                  style={c !== 'transparent' ? { backgroundColor: c } : {}}
                >
                  {c === 'transparent' ? '∅' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius (Shape Pill / Oval / Rectangle) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className={labelCls}>Corner Shape / Border Radius</label>
              <span className="text-[10px] font-mono text-zinc-500 font-bold">{currentBorderRadius}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'Sharp (0px)', val: '0px' },
                { label: 'Round (8px)', val: '8px' },
                { label: 'Curved (16px)', val: '16px' },
                { label: 'Pill / Oval', val: '9999px' }
              ].map(r => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => handleStyleChange('borderRadius', r.val)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                    currentBorderRadius === r.val
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Border Width & Color */}
          <div className="space-y-2">
            <label className={labelCls}>Border Stroke & Color</label>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {['0px', '1px', '2px', '4px'].map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    handleStyleChange('borderWidth', w);
                    if (w !== '0px' && !styleOverride.borderStyle) handleStyleChange('borderStyle', 'solid');
                  }}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    currentBorderWidth === w
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {w === '0px' ? 'None' : w}
                </button>
              ))}
            </div>
            {currentBorderWidth !== '0px' && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentBorderColor}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={styleOverride.borderColor || currentBorderColor.toUpperCase()}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className={inputCls + " font-mono text-[11px] uppercase"}
                  placeholder="Border Color"
                />
              </div>
            )}
          </div>

          {/* Padding / Spacing */}
          <div className="space-y-1">
            <label className={labelCls}>Internal Padding</label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'Compact', val: '4px 8px' },
                { label: 'Medium', val: '8px 16px' },
                { label: 'Spacious', val: '12px 24px' },
                { label: 'Large Card', val: '24px 32px' }
              ].map(p => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleStyleChange('padding', p.val)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                    currentPadding === p.val
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. TEXT CONTROLS ─── */}
      {isText && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>Text Content</label>
            <textarea
              rows={4}
              value={localText}
              onChange={(e) => {
                setLocalText(e.target.value);
                handleTextCommit(e.target.value);
              }}
              className={inputCls + " resize-none font-medium text-xs"}
              placeholder="Enter text..."
            />
          </div>
        </div>
      )}

      {/* ─── 3. IMAGE CONTROLS ─── */}
      {isImage && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className={labelCls}>Image Preview</label>
            {currentSrc ? (
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 aspect-video flex items-center justify-center group">
                <img src={currentSrc} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-zinc-400 text-xs">
                No image selected
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => {
                    const uploadedFile = e.target?.files?.[0];
                    if (!uploadedFile) return;
                    const field = `${selectedNode.sectionId || ''} ${selectedNode.field || ''} ${nodeId}`.toLowerCase();
                    const category = (field.includes('avatar') || field.includes('profile') || field.includes('photo') || selectedNode.sectionId === 'hero' || selectedNode.sectionId === 'about')
                      ? 'avatar'
                      : (field.includes('project') || selectedNode.sectionId === 'projects')
                      ? 'projects'
                      : (field.includes('hero') || field.includes('banner'))
                      ? 'banners'
                      : 'general';

                    handleImageUpload(
                      uploadedFile,
                      (blobUrl) => handleImageChange(blobUrl),
                      (finalUrl) => handleImageChange(finalUrl),
                      { 
                        category, 
                        username: pData?.username || pData?.id,
                        oldUrl: currentSrc,
                        replace: true
                      }
                    );
                  };
                  input.click();
                }}
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" /> Upload / Replace
              </button>
              {currentSrc && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentSrc && currentSrc.includes('/uploads/users/')) {
                      deleteServerAsset(currentSrc, pData?.username || pData?.id);
                    }
                    handleImageChange('');
                  }}
                  className="px-3 py-2 border border-zinc-200 hover:bg-red-50 hover:text-red-600 text-zinc-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Alt Description</label>
            <input
              type="text"
              value={localAlt}
              onChange={(e) => {
                setLocalAlt(e.target.value);
                onFieldChange?.(`contentOverrides.${nodeId}.alt`, e.target.value);
              }}
              className={inputCls}
              placeholder="Descriptive text for accessibility"
            />
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Border Radius</label>
            <div className="grid grid-cols-4 gap-1">
              {['0px', '8px', '16px', '9999px'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleStyleChange('borderRadius', r)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    currentBorderRadius === r
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {r === '9999px' ? 'Round' : r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. BUTTON & LINK CONTROLS ─── */}
      {isButton && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>Button / Link Label</label>
            <input
              type="text"
              value={localLabel}
              onChange={(e) => {
                setLocalLabel(e.target.value);
                handleButtonCommit(e.target.value, localHref);
              }}
              className={inputCls}
              placeholder="Button Text..."
            />
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Link Destination URL (href)</label>
            <input
              type="text"
              value={localHref}
              onChange={(e) => {
                const val = e.target.value;
                setLocalHref(val);
                handleButtonCommit(localLabel, val);
              }}
              className={inputCls}
              placeholder="#"
            />
            <p className="text-[10px] text-zinc-400">Defaults to '#' if left empty.</p>
          </div>

          <div className="flex items-center justify-between py-1 bg-zinc-50 px-3 rounded-xl border border-zinc-200">
            <span className="text-xs font-semibold text-zinc-700">Open in New Tab</span>
            <input
              type="checkbox"
              checked={currentTarget === '_blank'}
              onChange={(e) => {
                const t = e.target.checked ? '_blank' : '_self';
                handleButtonCommit(localLabel, localHref, t);
              }}
              className="rounded text-violet-600 focus:ring-violet-400 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Background Color</label>
              <button
                type="button"
                onClick={() => handleStyleChange('backgroundColor', isBgTransparent ? '#7C3AED' : 'transparent')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer border ${
                  isBgTransparent
                    ? 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                    : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
                }`}
              >
                {isBgTransparent ? 'Set Solid Color' : 'Make Transparent'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentBgHex}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0.5 shrink-0"
              />
              <input
                type="text"
                value={isBgTransparent ? 'TRANSPARENT' : (styleOverride.backgroundColor || currentBgHex.toUpperCase())}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                placeholder="#HEX or transparent"
                className={inputCls + " font-mono text-[11px] uppercase"}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['transparent', '#0f172a', '#7C3AED', '#2563eb', '#059669', '#dc2626', '#ffffff', '#FF4500'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleStyleChange('backgroundColor', c)}
                  title={c === 'transparent' ? 'Transparent' : c}
                  className={`w-6 h-6 rounded-full border border-zinc-200 shadow-2xs hover:scale-110 transition-transform flex items-center justify-center text-[8px] font-bold ${
                    c === 'transparent' ? 'bg-zinc-100 text-zinc-500' : ''
                  }`}
                  style={c !== 'transparent' ? { backgroundColor: c } : {}}
                >
                  {c === 'transparent' ? '∅' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>Border Radius</label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: '0px', val: '0px' },
                { label: '8px', val: '8px' },
                { label: '16px', val: '16px' },
                { label: 'Pill / Oval', val: '9999px' }
              ].map(r => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => handleStyleChange('borderRadius', r.val)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    currentBorderRadius === r.val
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* DELETE ELEMENT BUTTON (Isolates and hides only this specific element) */}
      <div className="pt-3 border-t border-zinc-200">
        <button
          type="button"
          onClick={() => {
            if (onFieldChange && nodeId) {
              if (selectedNode.el) {
                selectedNode.el.style.display = 'none';
              }
              onFieldChange(`deletedNodes.${nodeId}`, true);
              onFieldChange(`styleOverrides.${nodeId}.display`, 'none');

              // If it's a specific tag pill in a project or item tags array:
              if (nodeId.includes(':tag:')) {
                const tagMatch = nodeId.match(/card:(\d+):tag:(\d+)/);
                if (tagMatch) {
                  const cardIdx = parseInt(tagMatch[1], 10);
                  const tagIdx = parseInt(tagMatch[2], 10);
                  const colName = selectedNode.collection || (selectedNode.sectionId === 'projects' ? 'projects' : undefined);
                  if (colName && pData[colName] && pData[colName][cardIdx]) {
                    const currentTags = pData[colName][cardIdx].tags;
                    if (Array.isArray(currentTags)) {
                      const updatedTags = currentTags.filter((_, tI) => tI !== tagIdx);
                      onFieldChange(`${colName}.${cardIdx}.tags`, updatedTags);
                    }
                  }
                }
              }

              setSelectedNode(null);
              setSelectedElement(null);
            }
          }}
          className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Delete Element
        </button>
      </div>
    </div>
  );
}

