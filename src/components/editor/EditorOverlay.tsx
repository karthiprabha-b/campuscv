"use client";

/**
 * EditorOverlay — Simple Canva-Style Highlight Layer
 *
 * Provides a clean selection ring & hover feedback over selected elements.
 * Features lock indicator tags and inline editing states.
 * Never modifies or injects anything into the template DOM.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEditorContext } from '../../context/EditorContext';
import { Lock } from 'lucide-react';

interface OverlayBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

function rectToBox(rect: DOMRect): OverlayBox {
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

function getLiveRect(el: HTMLElement | null | undefined): DOMRect | null {
  if (!el || !el.ownerDocument?.body?.contains(el)) return null;
  const rect = el.getBoundingClientRect();
  const win = el.ownerDocument?.defaultView;
  if (win && win !== window) {
    const frameEl = (win.frameElement as HTMLElement | null) || document.querySelector('iframe');
    if (frameEl) {
      const frameRect = frameEl.getBoundingClientRect();
      return new DOMRect(
        rect.left + frameRect.left,
        rect.top + frameRect.top,
        rect.width,
        rect.height
      );
    }
  }
  return rect;
}

function formatLabel(label?: string, type?: string): string {
  if (type) {
    const cleanType = type.replace(/\[.*\]/g, '').replace(/sections\./g, '').trim().toLowerCase();
    if (cleanType === 'heading' || cleanType === 'h1' || cleanType === 'h2' || cleanType === 'h3') return 'Heading';
    if (cleanType === 'text' || cleanType === 'p' || cleanType === 'span') return 'Text';
    if (cleanType === 'image' || cleanType === 'img' || cleanType === 'photo') return 'Image';
    if (cleanType === 'button' || cleanType === 'btn' || cleanType === 'a') return 'Button';
    if (cleanType === 'link') return 'Link';
    if (cleanType === 'section') return 'Section';
    if (cleanType === 'card' || cleanType === 'container') return 'Card';
    if (cleanType) return cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
  }
  if (!label) return 'Text';
  const clean = label.replace(/\[.*\]/g, '').replace(/sections\./g, '').trim();
  if (!clean || clean.length > 15) return 'Text';
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export default function EditorOverlay({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> }) {
  const {
    isEditMode,
    hoveredElement,
    selectedElement,
    selectedNode,
    isInlineEditing,
    isElementLocked
  } = useEditorContext();

  const SHOW_HOVER_OVERLAY = false;
  const [selectedBox, setSelectedBox] = useState<OverlayBox | null>(null);
  const rafRef = useRef<number>(0);

  const activeEl = selectedNode?.el || selectedElement?.el;

  const syncRects = useCallback(() => {
    let targetEl: HTMLElement | null = activeEl || null;
    if (targetEl && !targetEl.ownerDocument?.body?.contains(targetEl)) {
      targetEl = null;
    }
    
    // If targetEl lost reference, try resolving by data-node-id in iframe or canvas
    if (!targetEl && (selectedNode?.nodeId || selectedElement?.id)) {
      const nid = selectedNode?.nodeId || selectedElement?.id;
      const iframe = canvasRef.current?.querySelector('iframe');
      const doc = iframe?.contentDocument || (window as any).__CAMPUSCV_IFRAME_DOC__ || document;
      targetEl = doc.querySelector(`[data-node-id="${nid}"]`) || doc.getElementById(nid || '');
    }

    if (targetEl) {
      const r = getLiveRect(targetEl);
      const newBox = r ? rectToBox(r) : null;
      setSelectedBox(prev => {
        if (!prev && !newBox) return null;
        if (
          prev && 
          newBox && 
          Math.abs(prev.top - newBox.top) < 0.5 && 
          Math.abs(prev.left - newBox.left) < 0.5 && 
          Math.abs(prev.width - newBox.width) < 0.5 && 
          Math.abs(prev.height - newBox.height) < 0.5
        ) {
          return prev;
        }
        return newBox;
      });
    } else {
      setSelectedBox(null);
    }
  }, [activeEl, selectedNode?.nodeId, selectedElement?.id, canvasRef]);

  useEffect(() => {
    if (!isEditMode || (!selectedElement && !selectedNode)) {
      setSelectedBox(null);
      return;
    }

    syncRects();

    // High precision RAF sync loop while selected for seamless layout adjustments
    let isRunning = true;
    const loop = () => {
      syncRects();
      if (isRunning) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    const handleUpdate = () => {
      syncRects();
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('campuscv:layout-shift', handleUpdate);
    window.addEventListener('transitionend', handleUpdate);
    window.addEventListener('animationend', handleUpdate);

    let resizeObserver: ResizeObserver | null = null;
    if (canvasRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => syncRects());
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      isRunning = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('campuscv:layout-shift', handleUpdate);
      window.removeEventListener('transitionend', handleUpdate);
      window.removeEventListener('animationend', handleUpdate);
    };
  }, [isEditMode, selectedElement, selectedNode, syncRects, canvasRef]);

  if (!isEditMode) return null;

  const currentActiveId = selectedNode?.nodeId || selectedElement?.id || '';
  const isLocked = currentActiveId ? isElementLocked(currentActiveId) : false;
  const currentLabel = selectedNode 
    ? (selectedNode.type === 'button' ? 'Button' : selectedNode.type === 'image' ? 'Image' : selectedNode.type === 'container' ? 'Container' : 'Text')
    : (selectedElement ? formatLabel(selectedElement.label, selectedElement.elementType) : 'Element');

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden="true">
      {/* Hover Overlay completely disabled — ZERO rectangles on mousemove */}
      {SHOW_HOVER_OVERLAY && null}

      {/* Selected Ring — Clean 1.5px CampusCV Purple Outline */}
      {selectedBox && (selectedElement || selectedNode) && (
        <div
          style={{
            position: 'fixed',
            top: selectedBox.top - 2,
            left: selectedBox.left - 2,
            width: selectedBox.width + 4,
            height: selectedBox.height + 4,
            border: isLocked
              ? '1.5px solid #F59E0B'
              : isInlineEditing
              ? '1.5px dashed #7C3AED'
              : '1.5px solid #7C3AED',
            borderRadius: 6,
            background: 'transparent',
            boxShadow: 'none',
            pointerEvents: 'none',
            transition: 'none',
          }}
        >
          {/* Label Tag */}
          <div
            style={{
              position: 'absolute',
              top: -22,
              left: 0,
              background: isLocked ? '#F59E0B' : '#7C3AED',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'sans-serif',
              padding: '2px 8px',
              borderRadius: '4px 4px 4px 0',
              whiteSpace: 'nowrap',
              lineHeight: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {isLocked && <Lock className="w-3 h-3" />}
            {isLocked
              ? 'Locked'
              : isInlineEditing
              ? '✏ Editing Text...'
              : currentLabel}
          </div>
        </div>
      )}
    </div>
  );
}
