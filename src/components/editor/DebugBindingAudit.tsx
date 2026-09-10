"use client";

import React, { useState } from 'react';
import { Bug, CheckCircle, AlertTriangle, ShieldAlert, Code2, Eye, X } from 'lucide-react';
import { SemanticNode } from '../../utils/universalNodeGraph';
import { CampusProfile } from '../../types/canonicalProfile';
import { resolveSemanticBinding } from '../../utils/semanticBindingEngine';
import { resolveValue } from '../../utils/valueResolutionEngine';

interface DebugBindingAuditProps {
  selectedNode: SemanticNode | null;
  profile: CampusProfile;
  contentOverrides: Record<string, any>;
  onClose?: () => void;
}

export default function DebugBindingAudit({
  selectedNode,
  profile,
  contentOverrides,
  onClose
}: DebugBindingAuditProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const bindingInfo = selectedNode ? resolveSemanticBinding(selectedNode, selectedNode.sectionId, profile) : null;
  const resolvedVal = selectedNode ? resolveValue(bindingInfo?.bindingPath, profile, contentOverrides, selectedNode.text || '') : null;

  // Audit Metrics Calculation
  const hasName = !!profile?.personal?.fullName;
  const hasRole = !!profile?.personal?.headline;
  const hasLocation = !!profile?.personal?.city;
  const hasSummary = !!profile?.personal?.summary;

  const projectCount = profile?.projects?.length || 0;
  const expCount = profile?.experience?.length || 0;
  const eduCount = profile?.education?.length || 0;
  const skillCount = profile?.skills?.length || 0;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] w-96 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 font-mono text-[11px] backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2 text-violet-400 font-bold">
          <Bug className="w-4 h-4" />
          <span>UNIVERSAL BINDING AUDIT</span>
        </div>
        <button
          onClick={() => { setIsOpen(false); if (onClose) onClose(); }}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3.5 space-y-4 max-h-[420px] overflow-y-auto">
        {/* Selected Node Inspection */}
        {selectedNode ? (
          <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-violet-300 font-bold">
              <span>NODE INSPECTOR</span>
              <span className="text-[10px] text-slate-500 font-normal">{selectedNode.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <div><span className="text-slate-500">TYPE:</span> {selectedNode.type}</div>
              <div><span className="text-slate-500">ROLE:</span> {bindingInfo?.semanticRole || 'none'}</div>
              <div><span className="text-slate-500">SECTION:</span> {selectedNode.sectionId}</div>
              <div><span className="text-slate-500">CONFIDENCE:</span> {(bindingInfo?.confidence || 0).toFixed(2)}</div>
              <div className="col-span-2 truncate"><span className="text-slate-500">BINDING PATH:</span> {bindingInfo?.bindingPath || 'unbound'}</div>
              <div className="col-span-2 truncate"><span className="text-slate-500">TEMPLATE DEFAULT:</span> {selectedNode.text || '(empty)'}</div>
              <div className="col-span-2 truncate text-emerald-400 font-bold"><span className="text-slate-500">RESOLVED VALUE:</span> {resolvedVal?.value || '(none)'}</div>
              <div className="col-span-2 text-[10px] text-purple-400"><span className="text-slate-500">VALUE SOURCE:</span> {resolvedVal?.source}</div>
            </div>
          </div>
        ) : (
          <div className="p-2.5 bg-slate-900/40 rounded-xl text-slate-500 italic text-center">
            Click any canvas element to inspect node binding.
          </div>
        )}

        {/* Identity & Collection Audit Summary */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identity Status</div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${hasName ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'}`}>
              {hasName ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-400" />}
              <span>Name: {hasName ? 'Bound' : 'Missing'}</span>
            </div>
            <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${hasRole ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'}`}>
              {hasRole ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-400" />}
              <span>Role: {hasRole ? 'Bound' : 'Missing'}</span>
            </div>
            <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${hasLocation ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'}`}>
              {hasLocation ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-400" />}
              <span>Location: {hasLocation ? 'Bound' : 'Missing'}</span>
            </div>
            <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${hasSummary ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'}`}>
              {hasSummary ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-rose-400" />}
              <span>Summary: {hasSummary ? 'Bound' : 'Missing'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collections Audit</div>
          <div className="grid grid-cols-2 gap-1.5 text-slate-300">
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">Projects: <span className="text-violet-400 font-bold">{projectCount}</span> items</div>
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">Experience: <span className="text-violet-400 font-bold">{expCount}</span> items</div>
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">Education: <span className="text-violet-400 font-bold">{eduCount}</span> items</div>
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">Skills: <span className="text-violet-400 font-bold">{skillCount}</span> items</div>
          </div>
        </div>
      </div>
    </div>
  );
}
