"use client";

import React from 'react';
import { SelectedElement } from '../../context/EditorContext';

interface FloatingToolbarProps {
  selectedElement: SelectedElement;
  onTriggerImageReplace?: (el?: HTMLElement) => void;
  onStartInlineEdit?: (el?: HTMLElement) => void;
}

export default function FloatingToolbar(_props: FloatingToolbarProps) {
  // Floating toolbar intentionally removed everywhere as requested
  return null;
}
