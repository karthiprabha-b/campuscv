"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { PortfolioData } from '../utils/mockDb';

import { EditableNode } from '../utils/universalNodeEngine';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ElementType =
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'link'
  | 'list'
  | 'card'
  | 'section'
  | 'badge'
  | 'icon'
  | 'stat'
  | 'unknown';

export type InspectorMode = 'element' | 'section' | 'design' | 'image' | 'card' | 'list' | 'universal_node' | null;

export interface ElementRegistration {
  el: HTMLElement;
  fieldPath: string;       // e.g. "profile.name", "projects[0].title"
  schemaPath?: string;     // explicit template schema path e.g. "hero.avatarUrl", "profileImage"
  elementType: ElementType;
  sectionId?: string;      // e.g. "hero", "projects"
  index?: number;          // for list items
  label?: string;          // human readable
}

export interface SelectedElement {
  id: string;              // DOM element unique id (generated)
  fieldPath: string;
  schemaPath?: string;
  elementType: ElementType;
  sectionId?: string;
  index?: number;
  label?: string;
  rect?: DOMRect;
  el?: HTMLElement;
  nodeId?: string;
  currentValue?: any;
}

export interface DetectedSection {
  id: string;
  label: string;
  icon: string;
  el?: HTMLElement;
  isVisible: boolean;
  order: number;
}

export interface ValidationReport {
  scannedElementsCount: number;
  registeredCount: number;
  autoBoundCount: number;
  blockedElementsCount: number;
  healthRatio: string;
  missingRegistrations: string[];
}

interface EditorContextType {
  // Element selection
  selectedElement: SelectedElement | null;
  setSelectedElement: (el: SelectedElement | null) => void;
  selectedNode: EditableNode | null;
  setSelectedNode: (node: EditableNode | null) => void;
  hoveredElement: SelectedElement | null;
  setHoveredElement: (el: SelectedElement | null) => void;

  // Inspector mode
  inspectorMode: InspectorMode;
  setInspectorMode: (mode: InspectorMode) => void;

  // Element registry (DOM node → field mapping)
  elementRegistry: Map<HTMLElement, ElementRegistration>;
  registerElement: (reg: ElementRegistration) => void;
  unregisterElement: (el: HTMLElement) => void;
  clearRegistry: () => void;

  // Section detection
  detectedSections: DetectedSection[];
  setDetectedSections: (sections: DetectedSection[]) => void;

  // Field change handler (set by page.tsx, consumed by inspector/toolbar)
  onFieldChange: ((fieldPath: string, value: any) => void) | null;
  setOnFieldChange: (fn: (fieldPath: string, value: any) => void) => void;

  // Portfolio data reference
  portfolioData: PortfolioData | null;
  setPortfolioData: (data: PortfolioData) => void;

  // Edit mode & Debug mode
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  isDebugMode: boolean;
  setIsDebugMode: (mode: boolean) => void;
  toggleDebugMode: () => void;
  validationReport: ValidationReport | null;
  setValidationReport: (report: ValidationReport) => void;

  // Inline editing state
  isInlineEditing: boolean;
  setIsInlineEditing: (v: boolean) => void;

  // Lock & Hide states
  lockedElements: Set<string>;
  toggleLock: (id: string) => void;
  isElementLocked: (id: string) => boolean;

  hiddenElements: Set<string>;
  toggleHide: (id: string) => void;
  isElementHidden: (id: string) => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const EditorContext = createContext<EditorContextType>({
  selectedElement: null,
  setSelectedElement: () => {},
  selectedNode: null,
  setSelectedNode: () => {},
  hoveredElement: null,
  setHoveredElement: () => {},
  inspectorMode: null,
  setInspectorMode: () => {},
  elementRegistry: new Map(),
  registerElement: () => {},
  unregisterElement: () => {},
  clearRegistry: () => {},
  detectedSections: [],
  setDetectedSections: () => {},
  onFieldChange: null,
  setOnFieldChange: () => {},
  portfolioData: null,
  setPortfolioData: () => {},
  isEditMode: true,
  setIsEditMode: () => {},
  isDebugMode: false,
  setIsDebugMode: () => {},
  toggleDebugMode: () => {},
  validationReport: null,
  setValidationReport: () => {},
  isInlineEditing: false,
  setIsInlineEditing: () => {},

  lockedElements: new Set(),
  toggleLock: () => {},
  isElementLocked: () => false,

  hiddenElements: new Set(),
  toggleHide: () => {},
  isElementHidden: () => false,
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [selectedElement, _setSelectedElement] = useState<SelectedElement | null>(null);
  const [selectedNode, _setSelectedNode] = useState<EditableNode | null>(null);

  const setSelectedElement = useCallback((el: SelectedElement | null) => {
    _setSelectedElement(el);
  }, []);

  const setSelectedNode = useCallback((node: EditableNode | null) => {
    _setSelectedNode(node);
  }, []);
  const [hoveredElement, setHoveredElement] = useState<SelectedElement | null>(null);
  const [inspectorMode, setInspectorMode] = useState<InspectorMode>(null);
  const [detectedSections, setDetectedSections] = useState<DetectedSection[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const [lockedElements, setLockedElements] = useState<Set<string>>(new Set());
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());

  const elementRegistry = useRef<Map<HTMLElement, ElementRegistration>>(new Map());
  const onFieldChangeRef = useRef<((fieldPath: string, value: any) => void) | null>(null);

  const registerElement = useCallback((reg: ElementRegistration) => {
    elementRegistry.current.set(reg.el, reg);
  }, []);

  const unregisterElement = useCallback((el: HTMLElement) => {
    elementRegistry.current.delete(el);
  }, []);

  const clearRegistry = useCallback(() => {
    elementRegistry.current.clear();
  }, []);

  const setOnFieldChange = useCallback((fn: (fieldPath: string, value: any) => void) => {
    onFieldChangeRef.current = fn;
  }, []);

  const onFieldChange = useCallback((fieldPath: string, value: any) => {
    if (onFieldChangeRef.current) {
      onFieldChangeRef.current(fieldPath, value);
    }
  }, []);

  const toggleLock = useCallback((id: string) => {
    setLockedElements(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isElementLocked = useCallback((id: string) => lockedElements.has(id), [lockedElements]);

  const toggleHide = useCallback((id: string) => {
    setHiddenElements(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isElementHidden = useCallback((id: string) => hiddenElements.has(id), [hiddenElements]);

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(v => !v);
  }, []);

  const contextValue = React.useMemo(() => ({
    selectedElement,
    setSelectedElement,
    selectedNode,
    setSelectedNode,
    hoveredElement,
    setHoveredElement,
    inspectorMode,
    setInspectorMode,
    elementRegistry: elementRegistry.current,
    registerElement,
    unregisterElement,
    clearRegistry,
    detectedSections,
    setDetectedSections,
    onFieldChange,
    setOnFieldChange,
    portfolioData,
    setPortfolioData,
    isEditMode,
    setIsEditMode,
    isDebugMode,
    setIsDebugMode,
    toggleDebugMode,
    validationReport,
    setValidationReport,
    isInlineEditing,
    setIsInlineEditing,
    lockedElements,
    toggleLock,
    isElementLocked,
    hiddenElements,
    toggleHide,
    isElementHidden,
  }), [
    selectedElement,
    setSelectedElement,
    selectedNode,
    setSelectedNode,
    hoveredElement,
    inspectorMode,
    detectedSections,
    onFieldChange,
    setOnFieldChange,
    portfolioData,
    isEditMode,
    isDebugMode,
    toggleDebugMode,
    validationReport,
    isInlineEditing,
    lockedElements,
    toggleLock,
    isElementLocked,
    hiddenElements,
    toggleHide,
    isElementHidden,
    registerElement,
    unregisterElement,
    clearRegistry,
  ]);

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  return useContext(EditorContext);
}
