'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { loadTemplateFilesAsync } from '@/utils/templateResolver';
import { discoverTemplateCSS } from '@/utils/UniversalCSSDiscovery';

export default function TemplateOriginalDebugPage() {
  const params = useParams();
  const templateId = (params?.templateId as string) || 'student-portfolio';

  const [sectionFiles, setSectionFiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [computedStyles, setComputedStyles] = useState<{
    htmlFontSize: string;
    bodyFontSize: string;
    headerHeight: string;
    h1FontSize: string;
    h1LineHeight: string;
    viewportMeta: string;
  }>({
    htmlFontSize: 'N/A',
    bodyFontSize: 'N/A',
    headerHeight: 'N/A',
    h1FontSize: 'N/A',
    h1LineHeight: 'N/A',
    viewportMeta: 'N/A',
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true);
        const resolved = await loadTemplateFilesAsync({ templateId });
        setSectionFiles(resolved?.sectionFiles || {});
      } catch (err) {
        console.error('[TEMPLATE ORIGINAL LOAD ERROR]', err);
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

    // Write original template HTML with explicit viewport meta tag & baseline font-size
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Original Template Static Debug — ${templateId}</title>
          <style id="original-template-css">
            html { font-size: 16px; -webkit-text-size-adjust: 100%; }
            ${combinedCSS}
          </style>
        </head>
        <body class="original-template-body">
          <div id="original-root">
            ${sectionFiles['index.html'] || sectionFiles['template.html'] || '<div id="template-root">Original Static Content</div>'}
          </div>
          ${jsFileKeys.map(k => `<script data-file="${k}">${sectionFiles[k]}</script>`).join('\n')}
        </body>
      </html>
    `);
    doc.close();

    // Inspect computed styles
    const win = iframe.contentWindow || window;
    setTimeout(() => {
      const htmlEl = doc.documentElement;
      const bodyEl = doc.body;
      const headerEl = doc.querySelector('header') || doc.querySelector('.site-header') || doc.querySelector('nav');
      const h1El = doc.querySelector('h1') || doc.querySelector('.hero-title') || doc.querySelector('.sp-heading-xl');

      const csHtml = win.getComputedStyle(htmlEl);
      const csBody = win.getComputedStyle(bodyEl);
      const csHeader = headerEl ? win.getComputedStyle(headerEl) : null;
      const csH1 = h1El ? win.getComputedStyle(h1El) : null;

      const metaViewport = doc.querySelector('meta[name="viewport"]');

      setComputedStyles({
        htmlFontSize: csHtml.fontSize,
        bodyFontSize: csBody.fontSize,
        headerHeight: csHeader ? csHeader.height : 'N/A',
        h1FontSize: csH1 ? csH1.fontSize : 'N/A',
        h1LineHeight: csH1 ? csH1.lineHeight : 'N/A',
        viewportMeta: metaViewport ? (metaViewport.getAttribute('content') || 'Present') : 'MISSING'
      });
    }, 100);
  }, [loading, sectionFiles, templateId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-6 space-y-6">
      <header className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-amber-400">🧪 TEST 1 — ORIGINAL STATIC TEMPLATE (NO DATA BINDING)</h1>
          <p className="text-xs text-slate-400">Template ID: {templateId} | Pure Static Source Content</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-amber-950 text-amber-300 border border-amber-700 px-3 py-1 rounded-full">
            HTML Root Font: {computedStyles.htmlFontSize}
          </span>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full">
            H1 Font Size: {computedStyles.h1FontSize}
          </span>
        </div>
      </header>

      {/* Diagnostic HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">HTML Root Font-Size:</div>
          <div className="text-sm font-bold text-emerald-400">{computedStyles.htmlFontSize}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">Body Font-Size:</div>
          <div className="text-sm font-bold text-emerald-400">{computedStyles.bodyFontSize}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">Header Height:</div>
          <div className="text-sm font-bold text-emerald-400">{computedStyles.headerHeight}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-slate-400">Viewport Meta Tag:</div>
          <div className="text-sm font-bold text-emerald-400">{computedStyles.viewportMeta}</div>
        </div>
      </div>

      {/* Render Stage */}
      <div className="bg-white rounded-2xl border-2 border-amber-500/40 overflow-hidden shadow-2xl">
        <iframe
          ref={iframeRef}
          title="Original Template Static Output"
          className="w-full min-h-[800px] border-0"
        />
      </div>
    </div>
  );
}
