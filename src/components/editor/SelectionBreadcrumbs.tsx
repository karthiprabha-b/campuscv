"use client";

import React from 'react';
import { ChevronRight, Layers, Box, Type, Image as ImageIcon, Sparkles } from 'lucide-react';
import { SemanticNode } from '../../utils/universalNodeGraph';

interface SelectionBreadcrumbsProps {
  breadcrumbs: SemanticNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: SemanticNode) => void;
}

export default function SelectionBreadcrumbs({
  breadcrumbs = [],
  selectedNodeId,
  onSelectNode
}: SelectionBreadcrumbsProps) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const getNodeIcon = (type: SemanticNode['type']) => {
    switch (type) {
      case 'section': return <Layers className="w-3 h-3 text-purple-400" />;
      case 'collection-item':
      case 'container': return <Box className="w-3 h-3 text-amber-400" />;
      case 'image': return <ImageIcon className="w-3 h-3 text-emerald-400" />;
      case 'heading':
      case 'paragraph':
      case 'text': return <Type className="w-3 h-3 text-sky-400" />;
      default: return <Sparkles className="w-3 h-3 text-slate-400" />;
    }
  };

  const formatNodeLabel = (node: SemanticNode): string => {
    if (node.type === 'section') {
      return node.sectionId.toUpperCase();
    }
    if (node.type === 'collection-item' || node.type === 'container') {
      return `Container (${node.containerKey})`;
    }
    if (node.text) {
      const trimmed = node.text.trim();
      return trimmed.length > 18 ? `${trimmed.substring(0, 18)}...` : trimmed;
    }
    return `${node.type.toUpperCase()} (${node.tagName})`;
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-300 backdrop-blur-md overflow-x-auto max-w-full">
      <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider mr-1">
        Hierarchy:
      </span>
      {breadcrumbs.map((node, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        const isSelected = node.id === selectedNodeId;

        return (
          <React.Fragment key={node.id}>
            <button
              onClick={() => onSelectNode(node)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all font-mono text-[11px] whitespace-nowrap ${
                isSelected
                  ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40 shadow-xs'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={`Select ${node.type} (${node.id})`}
            >
              {getNodeIcon(node.type)}
              <span>{formatNodeLabel(node)}</span>
            </button>

            {!isLast && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
