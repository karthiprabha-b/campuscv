/**
 * EditableWrappers — GUTTED (v2)
 *
 * All inline editing controls have been removed.
 * These components now render their children exactly as they would in
 * production (preview/published) mode.
 *
 * Editing is handled exclusively by the EditorOverlay + FloatingToolbar layers
 * which draw OUTSIDE the template DOM and never modify its structure.
 */

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// EditableText — renders the plain tag, no contentEditable or hover styles
// ─────────────────────────────────────────────────────────────────────────────

interface EditableTextProps {
  value: string;
  onChange?: (newValue: string) => void;
  isEditMode?: boolean;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  className = '',
  tag = 'span',
}: EditableTextProps) {
  const Tag = tag as any;
  return <Tag className={className}>{value}</Tag>;
}

// ─────────────────────────────────────────────────────────────────────────────
// EditableImage — renders plain <img>, no hover overlay controls
// ─────────────────────────────────────────────────────────────────────────────

interface EditableImageProps {
  src: string;
  alt?: string;
  onChange?: (newSrc: string) => void;
  isEditMode?: boolean;
  className?: string;
}

export function EditableImage({ src, alt = 'Image', className = '' }: EditableImageProps) {
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// EditableList — renders children directly, no Add/Remove/Reorder controls
// ─────────────────────────────────────────────────────────────────────────────

interface EditableListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
  onDuplicate?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  isEditMode?: boolean;
  className?: string;
  addLabel?: string;
}

export function EditableList<T>({
  items,
  renderItem,
  className = '',
}: EditableListProps<T>) {
  return (
    <div className={className}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EditableSection — renders plain <section>, no floating action badges
// ─────────────────────────────────────────────────────────────────────────────

interface EditableSectionProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  isEditMode?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function EditableSection({
  id,
  children,
  className = '',
}: EditableSectionProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
