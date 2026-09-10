"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Tablet, Smartphone, Sparkles, RefreshCw, Layers, ShieldCheck, Code } from 'lucide-react';
import TemplateRuntime from '@/templates/TemplateRuntime';
import DevelopmentDebugPanel from '@/components/admin/DevelopmentDebugPanel';
import { initialPortfolios } from '@/utils/mockDb';

interface AdminPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminPreviewPage({ params }: AdminPreviewPageProps) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.id;

  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showDebug, setShowDebug] = useState(false);
  const [templateRecord, setTemplateRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const res = await fetch('/api/templates');
        if (res.ok) {
          const json = await res.json();
          if (json.templates) {
            const found = json.templates.find((t: any) => t.id === templateId);
            if (found) setTemplateRecord(found);
          }
        }
      } catch (e) {
        console.error('[AdminPreview] Error loading metadata:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetadata();
  }, [templateId]);

  const viewportWidth = viewport === 'mobile' ? 'w-[390px] max-w-[390px]' : viewport === 'tablet' ? 'w-[768px] max-w-[768px]' : 'w-full';
  const baseData = initialPortfolios[0] || { id: 'preview-portfolio', name: 'Demo User' };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-4 py-3 sticky top-0 z-50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-zinc-100 font-display">CampusCV Admin Preview</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                {templateId}
              </span>
              {templateRecord?.version && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  v{templateRecord.version}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400">100% Original Uploaded Package Execution Container</p>
          </div>
        </div>

        {/* Viewport Controls */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all ${
              viewport === 'desktop' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all ${
              viewport === 'tablet' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all ${
              viewport === 'mobile' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              showDebug ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Diagnostics</span>
          </button>
          <Link
            href={`/editor/demo?templateId=${encodeURIComponent(templateId)}`}
            className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-[11px] font-bold shadow-sm transition-all"
          >
            Open in Editor →
          </Link>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className={`flex-1 bg-zinc-900/50 ${viewport === 'desktop' ? 'p-0' : 'p-4 sm:p-8'} flex justify-center items-start overflow-y-auto relative`}>
        <div className={`${viewportWidth} transition-all duration-300 shadow-2xl ${viewport === 'desktop' ? 'rounded-none border-0' : 'rounded-2xl border border-zinc-800/80'} overflow-hidden bg-white min-h-[85vh]`}>
          <TemplateRuntime
            templateId={templateId}
            versionId={templateRecord?.currentVersionId}
            data={{ ...baseData, templateId }}
            mode="preview"
            viewport={viewport}
          />
        </div>
      </main>

      {/* Dev Diagnostic Overlay */}
      {showDebug && (
        <DevelopmentDebugPanel
          templateId={templateId}
          versionId={templateRecord?.currentVersionId || templateRecord?.version || '1.0.0'}
          onClose={() => setShowDebug(false)}
        />
      )}
    </div>
  );
}
