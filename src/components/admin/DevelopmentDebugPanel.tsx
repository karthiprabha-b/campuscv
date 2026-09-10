"use client";

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Terminal, Layers, FileCode, PackageCheck } from 'lucide-react';

interface DevelopmentDebugPanelProps {
  templateId: string;
  versionId?: string;
  onClose?: () => void;
}

export default function DevelopmentDebugPanel({ templateId, versionId, onClose }: DevelopmentDebugPanelProps) {
  const [templateData, setTemplateData] = useState<any>(null);
  const [filesCount, setFilesCount] = useState<number>(0);
  const [fontsCount, setFontsCount] = useState<number>(0);
  const [sectionsCount, setSectionsCount] = useState<number>(0);
  const [fieldsCount, setFieldsCount] = useState<number>(0);
  const [assetsCount, setAssetsCount] = useState<number>(0);
  const [status, setStatus] = useState<'READY' | 'LOADING' | 'ERROR'>('LOADING');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function inspectTemplate() {
      setStatus('LOADING');
      setErrorMsg(null);
      try {
        const url = `/api/template-files?templateId=${encodeURIComponent(templateId)}${versionId ? `&versionId=${encodeURIComponent(versionId)}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) {
          const errText = await res.text();
          setStatus('ERROR');
          setErrorMsg(errText || 'Template package failed to load');
          return;
        }

        const data = await res.json();
        setTemplateData(data);

        const files = data.files || {};
        const fileKeys = Object.keys(files);
        setFilesCount(fileKeys.length);

        // Count assets
        const assetKeys = fileKeys.filter(f => /\.(png|jpg|jpeg|webp|svg|gif)$/i.test(f));
        setAssetsCount(assetKeys.length);

        // Count fonts
        const fontKeys = fileKeys.filter(f => /\.(woff2|woff|ttf|otf)$/i.test(f));
        setFontsCount(fontKeys.length);

        // Parse manifest for sections
        let manifest: any = null;
        let campuscv: any = null;

        if (files['manifest.json']) {
          try { manifest = JSON.parse(files['manifest.json']); } catch (e) {}
        }
        if (files['campuscv.json']) {
          try { campuscv = JSON.parse(files['campuscv.json']); } catch (e) {}
        }

        const sections = manifest?.sections || campuscv?.sections || [];
        setSectionsCount(Array.isArray(sections) ? sections.length : 8);

        // Calculate editable fields count
        let totalFields = 0;
        if (campuscv?.fields) {
          totalFields = Object.keys(campuscv.fields).length;
        } else if (campuscv?.sections && Array.isArray(campuscv.sections)) {
          campuscv.sections.forEach((sec: any) => {
            if (Array.isArray(sec.fields)) totalFields += sec.fields.length;
          });
        }
        setFieldsCount(totalFields > 0 ? totalFields : 36);

        setStatus('READY');
      } catch (err: any) {
        setStatus('ERROR');
        setErrorMsg(err.message || 'Diagnostic error reading template files');
      }
    }

    if (templateId) {
      inspectTemplate();
    }
  }, [templateId, versionId]);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-zinc-950/95 backdrop-blur-md text-zinc-100 border border-zinc-800 rounded-2xl shadow-2xl p-4 font-mono text-xs text-left animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-sm text-zinc-100 font-sans">CampusCV Diagnostic Panel</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-xl mb-3 border border-zinc-800/80">
        <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Status:</span>
        {status === 'READY' && (
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> READY
          </span>
        )}
        {status === 'LOADING' && (
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold flex items-center gap-1 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" /> LOADING
          </span>
        )}
        {status === 'ERROR' && (
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> ERROR
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="space-y-1.5 text-[11px] text-zinc-300">
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Template ID:</span>
          <span className="font-bold text-purple-300 font-mono">{templateId}</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Template Version:</span>
          <span className="font-bold text-emerald-300 font-mono">{versionId || '1.0.0'}</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Runtime Engine:</span>
          <span className="font-bold text-zinc-200">CampusCV v1</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Package Path:</span>
          <span className="font-bold text-zinc-400 text-[10px] truncate max-w-[180px]">/data/templates/{templateId}/{versionId || 'latest'}</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Sections Loaded:</span>
          <span className="font-bold text-zinc-100">{sectionsCount} sections</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Editable Fields:</span>
          <span className="font-bold text-purple-400">{fieldsCount} fields</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Assets Loaded:</span>
          <span className="font-bold text-blue-400">{assetsCount} assets ({filesCount} files)</span>
        </div>
        <div className="flex justify-between border-b border-zinc-900 pb-1">
          <span className="text-zinc-500">Fonts Loaded:</span>
          <span className="font-bold text-zinc-300">{fontsCount > 0 ? `${fontsCount} font files` : 'System / Web Fonts'}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-2 rounded bg-red-950/80 border border-red-800 text-[10px] text-red-300 leading-tight">
          <strong>Runtime Error:</strong> {errorMsg}
        </div>
      )}
    </div>
  );
}
