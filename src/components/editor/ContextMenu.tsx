"use client";

import React, { useEffect, useState } from 'react';
import {
  Edit3, Copy, Trash2, ArrowUp, ArrowDown,
  Camera, EyeOff, Lock, Unlock, Sliders
} from 'lucide-react';
import { useEditorContext } from '../../context/EditorContext';
import { PortfolioData } from '../../utils/mockDb';
import { handleImageUpload } from '../../utils/imageUploadStorage';
import { detectSectionId, resolveFieldPath } from '../../utils/CanvasDOMScanner';

interface ContextMenuProps {
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
}

export default function ContextMenu({ portfolio, onPortfolioChange }: ContextMenuProps) {
  const {
    selectedElement,
    setSelectedElement,
    onFieldChange,
    setInspectorMode,
    isEditMode,
    toggleLock,
    isElementLocked,
    toggleHide,
    isElementHidden
  } = useEditorContext();

  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isEditMode) return;

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.tagName) return;
      const canvas = target.closest('[data-canvas]');
      if (!canvas) return;

      e.preventDefault();
      e.stopPropagation();

      // Resolve or build selected element on contextmenu event
      const tag = target.tagName.toUpperCase();
      let elementType: any = 'text';
      if (tag === 'IMG') elementType = 'image';
      else if (['A', 'BUTTON'].includes(tag)) elementType = 'button';
      else if (['SECTION', 'ARTICLE', 'MAIN', 'HEADER', 'FOOTER'].includes(tag)) elementType = 'section';
      else if (tag === 'DIV' && (target.classList.contains('card') || target.getAttribute('data-card'))) elementType = 'card';
      else if (tag === 'LI') elementType = 'list';

      let fieldPath = target.getAttribute('data-field') ||
                      target.getAttribute('data-field-key') ||
                      target.id;
      if (!fieldPath || fieldPath.startsWith('el-') || fieldPath.startsWith('text-')) {
        const sectionId = detectSectionId(target);
        fieldPath = resolveFieldPath(target, sectionId, tag);
      }

      const sectionId = target.closest('[data-section-id], section, [id]')?.id || 'general';

      const sel = {
        id: fieldPath,
        fieldPath,
        elementType,
        sectionId,
        label: target.textContent?.trim().slice(0, 24) || tag,
        rect: target.getBoundingClientRect(),
        el: target,
      };

      setSelectedElement(sel);
      setMenuPos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setMenuPos(null);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, [isEditMode, setSelectedElement]);

  if (!menuPos || !isEditMode) return null;

  const el = selectedElement;
  const isArrayItem = el && /^([a-zA-Z0-9_]+)\[(\d+)\]/.test(el.fieldPath);
  const locked = el ? isElementLocked(el.id) : false;
  const hidden = el ? isElementHidden(el.id) : false;

  const handleDuplicate = () => {
    if (locked || !el || !onFieldChange || !portfolio) return;
    const parts = el.fieldPath.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (!parts) return;
    const [, arrayKey, idxStr] = parts;
    const idx = parseInt(idxStr, 10);
    const arr = (portfolio as any)[arrayKey];
    if (!Array.isArray(arr)) return;

    const next = [...arr];
    const itemToClone = next[idx];
    const cloned = typeof itemToClone === 'object'
      ? { ...itemToClone, id: `item-${Date.now()}`, title: itemToClone.title ? `${itemToClone.title} (Copy)` : itemToClone.name ? `${itemToClone.name} (Copy)` : itemToClone.name }
      : `${itemToClone} (Copy)`;

    next.splice(idx + 1, 0, cloned);
    onFieldChange(arrayKey, next);
    onPortfolioChange({ ...portfolio, [arrayKey]: next });
    setMenuPos(null);
  };

  const handleDelete = () => {
    if (locked || !el) return;

    let targetNodeId: string | null = el.nodeId || null;
    if (!targetNodeId && el.el) {
      targetNodeId = el.el.getAttribute('data-campus-node-id') || el.el.getAttribute('data-node-id');
    }

    if (onFieldChange) {
      if (targetNodeId) {
        onFieldChange(`deletedNodes.${targetNodeId}`, true);
      }
      const parts = el.fieldPath?.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
      if (parts && portfolio) {
        const [, arrayKey, idxStr] = parts;
        const idx = parseInt(idxStr, 10);
        const arr = (portfolio as any)[arrayKey];
        if (Array.isArray(arr)) {
          const next = arr.filter((_, i) => i !== idx);
          onFieldChange(arrayKey, next);
        }
      }
    }

    setSelectedElement(null);
    setMenuPos(null);
  };

  const handleMove = (dir: 'up' | 'down') => {
    if (locked || !el || !onFieldChange || !portfolio) return;
    const parts = el.fieldPath.match(/^([a-zA-Z0-9_]+)\[(\d+)\]/);
    if (!parts) return;
    const [, arrayKey, idxStr] = parts;
    const idx = parseInt(idxStr);
    const arr = (portfolio as any)[arrayKey];
    if (!Array.isArray(arr)) return;

    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= arr.length) return;

    const next = [...arr];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    onFieldChange(arrayKey, next);
    setMenuPos(null);
  };

  return (
    <div
      className="fixed z-[10000] w-48 bg-zinc-900/95 border border-white/15 text-white rounded-xl shadow-2xl backdrop-blur-md p-1.5 text-xs select-none space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: menuPos.y, left: menuPos.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          if (el) setInspectorMode(el.elementType === 'image' ? 'image' : el.elementType === 'card' ? 'card' : el.elementType === 'section' ? 'section' : 'element');
          setMenuPos(null);
        }}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/15 text-zinc-100 transition-colors text-left font-medium"
      >
        <Edit3 className="w-3.5 h-3.5 text-violet-400" />
        <span>Edit Properties</span>
      </button>

      {el?.elementType === 'image' && (
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = 'image/*';
            input.onchange = (e: any) => {
              const file = e.target.files?.[0]; if (!file) return;
              const field = (el.fieldPath || '').toLowerCase();
              const category = (field.includes('avatar') || field.includes('profile') || field.includes('photo'))
                ? 'avatar'
                : (field.includes('project') || field.includes('work'))
                ? 'projects'
                : (field.includes('hero') || field.includes('banner'))
                ? 'banners'
                : 'general';
              const currentImgSrc = (el.el instanceof HTMLImageElement ? el.el.src : '') || '';
              handleImageUpload(
                file,
                (blobUrl) => {
                  if (el.el instanceof HTMLImageElement) el.el.src = blobUrl;
                },
                (finalUrl) => {
                  if (finalUrl && onFieldChange && el) {
                    if (el.el instanceof HTMLImageElement) el.el.src = finalUrl;
                    onFieldChange(el.fieldPath, finalUrl);
                  }
                },
                { 
                  category, 
                  username: (portfolio as any)?.username || (portfolio as any)?.id,
                  oldUrl: currentImgSrc,
                  replace: true
                }
              );
            };
            input.click();
            setMenuPos(null);
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/15 text-emerald-400 transition-colors text-left font-medium"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Replace Photo</span>
        </button>
      )}

      {isArrayItem && (
        <>
          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={handleDuplicate}
            disabled={locked}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-white/15 text-zinc-200'}`}
          >
            <span className="flex items-center gap-2">
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              Duplicate
            </span>
            <span className="text-[9px] font-mono text-zinc-500">Ctrl+D</span>
          </button>

          <button
            onClick={() => handleMove('up')}
            disabled={locked}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-white/15 text-zinc-200'}`}
          >
            <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
            Move Up
          </button>

          <button
            onClick={() => handleMove('down')}
            disabled={locked}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-white/15 text-zinc-200'}`}
          >
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
            Move Down
          </button>
        </>
      )}

      <div className="h-px bg-white/10 my-1" />

      {el && (
        <>
          <button
            onClick={() => {
              toggleLock(el.id);
              setMenuPos(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/15 text-zinc-200 transition-colors text-left font-medium"
          >
            {locked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{locked ? 'Unlock Element' : 'Lock Element'}</span>
          </button>

          <button
            onClick={() => {
              toggleHide(el.id);
              if (el.el) el.el.style.display = hidden ? '' : 'none';
              setMenuPos(null);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/15 text-zinc-200 transition-colors text-left font-medium"
          >
            <EyeOff className="w-3.5 h-3.5 text-indigo-400" />
            <span>{hidden ? 'Show Element' : 'Hide Element'}</span>
          </button>
        </>
      )}

      <div className="h-px bg-white/10 my-1" />

      <button
        onClick={handleDelete}
        disabled={locked}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${locked ? 'text-zinc-600' : 'hover:bg-red-500/20 text-red-400'}`}
      >
        <span className="flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </span>
        <span className="text-[9px] font-mono text-red-400/60">Del</span>
      </button>
    </div>
  );
}
