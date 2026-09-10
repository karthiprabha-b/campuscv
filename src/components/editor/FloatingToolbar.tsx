"use client";

/**
 * FloatingToolbar — Canva-Style Floating Action Bar
 *
 * Floats directly ABOVE selected portfolio elements.
 * Features clean actions: Move, Duplicate, Hide, Lock, Delete, Settings.
 * Never modifies or injects code inside the template DOM.
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Edit3, Copy, Trash2, ArrowUp, ArrowDown,
  Camera, Sliders, Eye, EyeOff, Lock, Unlock, GripVertical
} from 'lucide-react';
import { useEditorContext, SelectedElement } from '../../context/EditorContext';

interface FloatingToolbarProps {
  selectedElement: SelectedElement;
  onTriggerImageReplace?: (el?: HTMLElement) => void;
  onStartInlineEdit?: (el?: HTMLElement) => void;
}

function calcPos(selectedElement: SelectedElement | null): { top: number; left: number } | null {
  if (!selectedElement?.el) return null;
  const el = selectedElement.el;
  const elRect = el.getBoundingClientRect();
  const win = el.ownerDocument?.defaultView;
  const frameEl = win && win.frameElement ? (win.frameElement as HTMLElement) : null;
  const frameRect = frameEl ? frameEl.getBoundingClientRect() : { top: 0, left: 0 };

  const canvas = el.closest('#template-root') || el.closest('[data-canvas]') || document.body;
  const canvasRect = canvas.getBoundingClientRect();
  const toolbarHeight = 40;
  const toolbarWidth = 260;

  let top = (elRect.top + frameRect.top) - canvasRect.top - toolbarHeight - 10;
  let left = (elRect.left + frameRect.left) - canvasRect.left;

  const containerWidth = (canvas as HTMLElement).offsetWidth || window.innerWidth;
  if (left + toolbarWidth > containerWidth) {
    left = containerWidth - toolbarWidth - 10;
  }
  if (left < 10) left = 10;
  if (top < 10) top = (elRect.bottom + frameRect.top) - canvasRect.top + 10;

  return { top, left };
}

export default function FloatingToolbar({
  selectedElement,
  onTriggerImageReplace,
  onStartInlineEdit,
}: FloatingToolbarProps) {
  const {
    onFieldChange,
    portfolioData,
    setSelectedElement,
    setInspectorMode,
    toggleLock,
    isElementLocked,
    toggleHide,
    isElementHidden
  } = useEditorContext();

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(() => calcPos(selectedElement));

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedElement.el) return;

    const updatePos = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const p = calcPos(selectedElement);
        if (p) setPos(p);
      });
    };

    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [selectedElement]);

  const { elementType, fieldPath, id } = selectedElement;
  const isArrayItem = /^([a-zA-Z0-9_]+)\[(\d+)\]/.test(fieldPath);
  const locked = isElementLocked(id);
  const hidden = isElementHidden(id);
  const isImageNode = elementType === 'image' || selectedElement.el?.tagName === 'IMG';

  function deleteItem() {
    if (locked) return;

    let targetNodeId: string | null = selectedElement.nodeId || null;
    if (!targetNodeId && selectedElement.el) {
      targetNodeId = selectedElement.el.getAttribute('data-node-id');
    }

    if (selectedElement.elementType === 'section' || (targetNodeId && targetNodeId.includes('custom-section'))) {
      const secId = selectedElement.sectionId || (targetNodeId ? targetNodeId.replace(/^section:/, '').replace(/:.*$/, '') : '');
      if (secId && portfolioData) {
        const p = { ...(portfolioData || {}) } as any;
        const addedSections = (p.addedSections || []).filter(
          (s: any) => s.id !== secId && !secId.includes(s.id) && !s.id.includes(secId)
        );
        const sectionOrder = (p.sectionOrder || []).filter(
          (id: string) => id !== secId && !secId.includes(id) && !id.includes(secId)
        );
        const addedElements = (p.addedElements || []).filter(
          (el: any) => el.parentNodeId !== secId && !el.parentNodeId?.includes(secId) && el.sectionId !== secId
        );
        const deletedNodes = { ...(p.deletedNodes || {}) };
        deletedNodes[`section:${secId}:root:section:0`] = true;
        deletedNodes[secId] = true;

        if (onFieldChange) {
          onFieldChange('addedSections', addedSections);
          onFieldChange('sectionOrder', sectionOrder);
          onFieldChange('addedElements', addedElements);
          onFieldChange('deletedNodes', deletedNodes);
        }
        setSelectedElement(null);
        return;
      }
    }

    if (onFieldChange) {
      if (targetNodeId) {
        onFieldChange(`deletedNodes.${targetNodeId}`, true);
      }
      const parts = fieldPath.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
      if (parts && portfolioData) {
        const [, arrayKey, idxStr] = parts;
        const idx = parseInt(idxStr, 10);
        const arr = (portfolioData as any)[arrayKey];
        if (Array.isArray(arr)) {
          const next = arr.filter((_, i) => i !== idx);
          onFieldChange(arrayKey, next);
        }
      }
    }

    setSelectedElement(null);
  }

  function duplicateItem() {
    if (locked) return;
    if (!onFieldChange || !portfolioData) return;
    const parts = fieldPath.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (!parts) return;
    const [, arrayKey, idxStr] = parts;
    const idx = parseInt(idxStr);
    const arr = (portfolioData as any)[arrayKey];
    if (!Array.isArray(arr)) return;

    const next = [...arr];
    const itemToClone = next[idx];
    const cloned = typeof itemToClone === 'object'
      ? { ...itemToClone, id: `item-${Date.now()}` }
      : `${itemToClone} (Copy)`;

    next.splice(idx + 1, 0, cloned);
    onFieldChange(arrayKey, next);
  }

  function moveItem(dir: 'up' | 'down') {
    if (locked) return;
    if (!onFieldChange || !portfolioData) return;
    const parts = fieldPath.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (!parts) return;
    const [, arrayKey, idxStr] = parts;
    const idx = parseInt(idxStr);
    const arr = (portfolioData as any)[arrayKey];
    if (!Array.isArray(arr)) return;

    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= arr.length) return;

    const next = [...arr];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    onFieldChange(arrayKey, next);
  }

  if (!pos) return null;

  return (
    <div
      ref={toolbarRef}
      data-toolbar="true"
      className="floating-toolbar absolute z-[9999] flex items-center gap-1 p-1 rounded-xl shadow-xl border border-white/20 bg-zinc-900/90 text-white backdrop-blur-md text-xs font-semibold select-none"
      style={{ top: pos.top, left: pos.left }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drag handle */}
      <div className="p-1 text-zinc-400 cursor-grab hover:text-white" title="Drag to reorder">
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* For TEXT / LINK / BUTTON: Show "Edit" button that starts canvas direct inline editing */}
      {!isImageNode && (
        <button
          onClick={() => {
            if (onStartInlineEdit && selectedElement.el) {
              onStartInlineEdit(selectedElement.el);
            } else {
              setInspectorMode(elementType === 'card' ? 'card' : elementType === 'section' ? 'section' : 'element');
            }
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/15 text-violet-300 transition-colors"
          title="Edit text directly on canvas"
        >
          <Edit3 className="w-3.5 h-3.5 text-violet-400" />
          <span>Edit</span>
        </button>
      )}

      {/* For IMAGE: Show "Replace Image" button */}
      {isImageNode && (
        <button
          onClick={() => onTriggerImageReplace?.(selectedElement.el)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/15 text-emerald-300 transition-colors"
          title="Replace Image File"
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Replace Image</span>
        </button>
      )}

      {/* Collection Reorder Actions (Move Up / Move Down / Duplicate) */}
      {isArrayItem && (
        <>
          <div className="w-px h-4 bg-white/20 my-auto mx-0.5" />
          <button
            onClick={() => moveItem('up')}
            disabled={locked}
            className={`p-1.5 rounded-lg transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-white/15 text-zinc-300 hover:text-white'}`}
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => moveItem('down')}
            disabled={locked}
            className={`p-1.5 rounded-lg transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-white/15 text-zinc-300 hover:text-white'}`}
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={duplicateItem}
            disabled={locked}
            className={`p-1.5 rounded-lg transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-white/15 text-zinc-300 hover:text-white'}`}
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      <div className="w-px h-4 bg-white/20 my-auto mx-0.5" />

      {/* Lock / Unlock */}
      <button
        onClick={() => toggleLock(id)}
        className={`p-1.5 rounded-lg transition-colors ${locked ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-white/15 text-zinc-300'}`}
        title={locked ? 'Unlock Element' : 'Lock Element'}
      >
        {locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
      </button>

      {/* Hide / Show */}
      <button
        onClick={() => {
          toggleHide(id);
          if (selectedElement.el) {
            selectedElement.el.style.display = hidden ? '' : 'none';
          }
        }}
        className={`p-1.5 rounded-lg transition-colors ${hidden ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/15 text-zinc-300'}`}
        title={hidden ? 'Show Element' : 'Hide Element'}
      >
        {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>

      {/* Delete button */}
      <button
        onClick={deleteItem}
        disabled={locked}
        className={`p-1.5 rounded-lg transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-red-500/20 text-red-400 hover:text-red-300'}`}
        title="Delete Element"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Settings / Inspector button (Sliders icon) */}
      <button
        onClick={() => setInspectorMode(isImageNode ? 'image' : elementType === 'card' ? 'card' : elementType === 'section' ? 'section' : 'element')}
        className="p-1.5 rounded-lg hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
        title="Edit Properties"
      >
        <Sliders className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
