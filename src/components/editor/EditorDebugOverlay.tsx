"use client";

/**
 * EditorDebugOverlay — Visual Audit & Registration Overlay
 *
 * Visually highlights every DOM element on canvas when Debug Mode is toggled:
 *   🟢 Green (Solid)  → Registered & Editable Elements (with data-field badge)
 *   🟡 Yellow (Dashed) → Auto-bound Candidate Elements
 *   🔴 Red (Solid)    → Blocked / Pointer-Events Error Elements
 *   🔒 Purple (Solid) → Locked Elements
 *   🔵 Blue (Solid)   → Currently Selected Element
 */

import React, { useEffect, useState } from 'react';
import { useEditorContext } from '../../context/EditorContext';

interface HighlightBox {
  id: string;
  fieldPath: string;
  label: string;
  type: 'registered' | 'autobound' | 'blocked' | 'locked' | 'selected';
  rect: { top: number; left: number; width: number; height: number };
}

export default function EditorDebugOverlay({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> }) {
  const { isDebugMode, elementRegistry, selectedElement, isElementLocked } = useEditorContext();
  const [boxes, setBoxes] = useState<HighlightBox[]>([]);

  useEffect(() => {
    if (!isDebugMode || !canvasRef.current) {
      setBoxes([]);
      return;
    }

    const updateOverlays = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const canvasRect = canvas.getBoundingClientRect();
      const list: HighlightBox[] = [];

      elementRegistry.forEach((reg, el) => {
        if (!el || !document.body.contains(el)) return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const isSelected = selectedElement?.el === el;
        const isLocked = isElementLocked(reg.fieldPath);
        const isAutoBound = el.hasAttribute('data-field') && el.getAttribute('data-field')?.startsWith('el-');

        let type: HighlightBox['type'] = 'registered';
        if (isSelected) type = 'selected';
        else if (isLocked) type = 'locked';
        else if (isAutoBound) type = 'autobound';

        list.push({
          id: reg.fieldPath + el.tagName,
          fieldPath: reg.fieldPath,
          label: reg.label || reg.fieldPath,
          type,
          rect: {
            top: rect.top - canvasRect.top,
            left: rect.left - canvasRect.left,
            width: rect.width,
            height: rect.height,
          },
        });
      });

      setBoxes(list);
    };

    updateOverlays();
    const interval = setInterval(updateOverlays, 600);
    window.addEventListener('scroll', updateOverlays, true);
    window.addEventListener('resize', updateOverlays);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', updateOverlays, true);
      window.removeEventListener('resize', updateOverlays);
    };
  }, [isDebugMode, canvasRef, elementRegistry, selectedElement, isElementLocked]);

  if (!isDebugMode || boxes.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[450] overflow-hidden">
      {boxes.map((box, idx) => {
        let borderColor = 'border-emerald-500 bg-emerald-500/10';
        let badgeBg = 'bg-emerald-600 text-white';

        if (box.type === 'selected') {
          borderColor = 'border-blue-500 bg-blue-500/20 ring-2 ring-blue-400';
          badgeBg = 'bg-blue-600 text-white font-black';
        } else if (box.type === 'locked') {
          borderColor = 'border-purple-500 bg-purple-500/15';
          badgeBg = 'bg-purple-700 text-white';
        } else if (box.type === 'autobound') {
          borderColor = 'border-amber-400 border-dashed bg-amber-400/10';
          badgeBg = 'bg-amber-600 text-white';
        } else if (box.type === 'blocked') {
          borderColor = 'border-red-500 bg-red-500/20';
          badgeBg = 'bg-red-600 text-white';
        }

        return (
          <div
            key={box.id + idx}
            style={{
              position: 'absolute',
              top: box.rect.top,
              left: box.rect.left,
              width: box.rect.width,
              height: box.rect.height,
            }}
            className={`border-2 rounded-lg transition-all ${borderColor}`}
          >
            <div
              className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap shadow-md pointer-events-none ${badgeBg}`}
            >
              {box.fieldPath}
            </div>
          </div>
        );
      })}
    </div>
  );
}
