'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { loadTemplateFilesAsync } from '@/utils/templateResolver';
import { discoverTemplateCSS } from '@/utils/UniversalCSSDiscovery';

export default function OriginalTemplatePurePage() {
  const params = useParams();
  const templateId = (params?.templateId as string) || 'student-portfolio';

  const [sectionFiles, setSectionFiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [diagnostics, setDiagnostics] = useState<{
    styleSheetCount: number;
    rulesCount: number;
    scriptCount: number;
    domElementCount: number;
    fontCount: number;
  }>({
    styleSheetCount: 0,
    rulesCount: 0,
    scriptCount: 0,
    domElementCount: 0,
    fontCount: 0,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true);
        const resolved = await loadTemplateFilesAsync({ templateId });
        setSectionFiles(resolved?.sectionFiles || {});
      } catch (err) {
        console.error('[ORIGINAL TEMPLATE LOAD ERROR]', err);
      } finally {
        setLoading(false);
      }
    }
    loadFiles();
  }, [templateId]);

  useEffect(() => {
    if (loading || !iframeRef.current || Object.keys(sectionFiles).length === 0) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const cssResult = discoverTemplateCSS(sectionFiles, 'orig', undefined, templateId);
    const combinedCSS = cssResult.combinedCSS;

    const jsFileKeys = Object.keys(sectionFiles).filter(k => {
      const lower = k.toLowerCase();
      return (lower.endsWith('.js') || lower.endsWith('.mjs')) &&
        !lower.includes('node_modules') &&
        !lower.includes('vite') &&
        !lower.includes('schema.') &&
        !lower.includes('bindings.');
    });

    // Write 100% PURE ORIGINAL template HTML/CSS/JS with zero CampusCV mutations
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Original Pure Template — ${templateId}</title>
          <style id="original-template-css">
            html { font-size: 16px; -webkit-text-size-adjust: 100%; }
            ${combinedCSS}
          </style>
        </head>
        <body class="original-template-body" style="margin:0; padding:0; background:transparent;">
          <div id="original-root">
            ${sectionFiles['index.html'] || sectionFiles['template.html'] || '<div id="template-root">Original Content Loading...</div>'}
          </div>
          ${jsFileKeys.map(k => `<script data-file="${k}">${sectionFiles[k]}</script>`).join('\n')}
        </body>
      </html>
    `);
    doc.close();

    // Inspect iframe document
    setTimeout(() => {
      let rulesCountTotal = 0;
      try {
        Array.from(doc.styleSheets).forEach(sheet => {
          try {
            rulesCountTotal += sheet.cssRules ? sheet.cssRules.length : 0;
          } catch (e) {}
        });
      } catch (e) {}

      let fontCountTotal = 0;
      try {
        if (doc.fonts) fontCountTotal = doc.fonts.size;
      } catch (e) {}

      setDiagnostics({
        styleSheetCount: doc.styleSheets.length,
        rulesCount: rulesCountTotal,
        scriptCount: jsFileKeys.length,
        domElementCount: doc.querySelectorAll('*').length,
        fontCount: fontCountTotal
      });
    }, 150);
  }, [loading, sectionFiles, templateId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-6 space-y-6">
      <header className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">💎 TEST A — PURE ORIGINAL UNTOUCHED TEMPLATE</h1>
          <p className="text-xs text-slate-400">Route: `/debug/template/${templateId}/original` | ZERO Data Binding | ZERO Overrides</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full">
            DOM Elements: {diagnostics.domElementCount}
          </span>
          <span className="bg-cyan-950 text-cyan-300 border border-cyan-700 px-3 py-1 rounded-full">
            CSS Rules: {diagnostics.rulesCount}
          </span>
        </div>
      </header>

      {/* Diagnostics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">StyleSheets Count:</div>
          <div className="text-sm font-bold text-emerald-400">{diagnostics.styleSheetCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">Active CSS Rules:</div>
          <div className="text-sm font-bold text-emerald-400">{diagnostics.rulesCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">JS Scripts Executed:</div>
          <div className="text-sm font-bold text-emerald-400">{diagnostics.scriptCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">DOM Element Count:</div>
          <div className="text-sm font-bold text-emerald-400">{diagnostics.domElementCount}</div>
        </div>
      </div>

      {/* Pure Render Stage */}
      <div className="bg-white rounded-2xl border-2 border-emerald-500/40 overflow-hidden shadow-2xl">
        <iframe
          ref={iframeRef}
          title="Pure Original Template Output Stage"
          className="w-full min-h-[800px] border-0"
        />
      </div>
    </div>
  );
}
