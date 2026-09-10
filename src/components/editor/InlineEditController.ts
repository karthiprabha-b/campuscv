"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useEditorContext } from '../../context/EditorContext';

interface InlineEditOptions {
  fieldPath: string;
  el: HTMLElement;
  multiline?: boolean;
  onCommit?: (value: string) => void;
  onCancel?: () => void;
}

let activeEditEl: HTMLElement | null = null;

export function activateInlineEdit({
  fieldPath,
  el,
  multiline = false,
  onCommit,
  onCancel,
}: InlineEditOptions) {
  // Deactivate previous edit if any
  if (activeEditEl && activeEditEl !== el) {
    deactivateInlineEdit(activeEditEl);
  }

  activeEditEl = el;

  const originalText = el.innerText;

  // Activate contentEditable
  el.contentEditable = 'true';
  el.setAttribute('spellcheck', 'true');
  el.style.outline = '2px dashed #7C3AED';
  el.style.outlineOffset = '3px';
  el.style.backgroundColor = 'rgba(124, 58, 237, 0.05)';
  el.style.borderRadius = '4px';
  el.style.cursor = 'text';
  el.focus();

  // Select all text on activation
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  } catch {}

  let commitTimeout: ReturnType<typeof setTimeout>;

  const handleInput = () => {
    clearTimeout(commitTimeout);
    commitTimeout = setTimeout(() => {
      const newValue = el.innerText.trim();
      if (newValue !== originalText && onCommit) {
        onCommit(newValue);
      }
    }, 300);
  };

  const handleBlur = () => {
    clearTimeout(commitTimeout);
    const newValue = el.innerText.trim();
    if (newValue !== originalText && onCommit) {
      onCommit(newValue);
    }
    deactivateInlineEdit(el);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      el.innerText = originalText;
      if (onCancel) onCancel();
      deactivateInlineEdit(el);
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      el.blur();
    }
  };

  el.addEventListener('input', handleInput);
  el.addEventListener('blur', handleBlur, { once: true });
  el.addEventListener('keydown', handleKeyDown);

  // Store cleanup on element
  (el as any).__inlineEditCleanup = () => {
    clearTimeout(commitTimeout);
    el.removeEventListener('input', handleInput);
    el.removeEventListener('keydown', handleKeyDown);
  };
}

export function deactivateInlineEdit(el: HTMLElement) {
  if ((el as any).__inlineEditCleanup) {
    (el as any).__inlineEditCleanup();
    delete (el as any).__inlineEditCleanup;
  }
  el.contentEditable = 'false';
  el.style.outline = '';
  el.style.outlineOffset = '';
  el.style.backgroundColor = '';
  el.style.borderRadius = '';
  el.style.cursor = '';
  if (activeEditEl === el) activeEditEl = null;
}

// ─────────────────────────────────────────────────────────────────────────────
// React hook for inline editing
// ─────────────────────────────────────────────────────────────────────────────

export function useInlineEdit() {
  const { onFieldChange, setIsInlineEditing, isEditMode } = useEditorContext();

  const startInlineEdit = useCallback((el: HTMLElement, fieldPath: string, multiline = false) => {
    if (!isEditMode) return;
    setIsInlineEditing(true);

    activateInlineEdit({
      fieldPath,
      el,
      multiline,
      onCommit: (value) => {
        if (onFieldChange) onFieldChange(fieldPath, value);
      },
      onCancel: () => {
        setIsInlineEditing(false);
      },
    });

    const handleFocusOut = () => {
      setIsInlineEditing(false);
      el.removeEventListener('focusout', handleFocusOut);
    };
    el.addEventListener('focusout', handleFocusOut);
  }, [isEditMode, onFieldChange, setIsInlineEditing]);

  return { startInlineEdit };
}
