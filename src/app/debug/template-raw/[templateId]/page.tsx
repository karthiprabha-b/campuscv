'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { loadTemplateFilesAsync } from '@/utils/templateResolver';
import { discoverTemplateCSS } from '@/utils/UniversalCSSDiscovery';
import { applyPortfolioOverrides } from '@/utils/universalNodeEngine';

export default function RawTemplatePureDebugPage() {
  const params = useParams();
  const templateId = (params?.templateId as string) || 'student-portfolio';

  const [sectionFiles, setSectionFiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [testStage, setTestStage] = useState<'TEST1_PURE' | 'TEST10_OVERRIDES'>('TEST1_PURE');

  const [diagnostics, setDiagnostics] = useState<{
    styleSheets: Array<{ href: string; disabled: boolean; rulesCount: any }>;
    computedStyles: {
      header: Record<string, string>;
      nav: Record<string, string>;
      h1: Record<string, string>;
      button: Record<string, string>;
    };
    fonts: Array<{ family: string; status: string }>;
    domMutationDetected: boolean;
  }>({
    styleSheets: [],
    computedStyles: { header: {}, nav: {}, h1: {}, button: {} },
    fonts: [],
    domMutationDetected: false,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function loadFiles() {
      try {
        setLoading(true);
        const resolved = await loadTemplateFilesAsync({ templateId });
        setSectionFiles(resolved?.sectionFiles || {});
      } catch (err) {
        console.error('[RAW TEMPLATE LOAD ERROR]', err);
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

    const cssResult = discoverTemplateCSS(sectionFiles, 'raw', undefined, templateId);
    const combinedCSS = cssResult.combinedCSS;

    const jsFileKeys = Object.keys(sectionFiles).filter(k => {
      const lower = k.toLowerCase();
      return (lower.endsWith('.js') || lower.endsWith('.mjs')) &&
        !lower.includes('node_modules') &&
        !lower.includes('vite') &&
        !lower.includes('schema.') &&
        !lower.includes('bindings.');
    });

    // Write 100% PURE HTML/CSS/JS document into isolated iframe — NO CampusCV CSS or Tailwind Preflight
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Raw Template Pure Debug — ${templateId}</title>
          <style id="pure-template-css">
            html { font-size: 16px; -webkit-text-size-adjust: 100%; }
            ${combinedCSS}
          </style>
        </head>
        <body class="pure-template-body" style="margin:0; padding:0; background:transparent;">
          <div id="pure-root">
            ${sectionFiles['index.html'] || sectionFiles['template.html'] || '<div id="template-root">Template Content Loading...</div>'}
          </div>
          ${jsFileKeys.map(k => `<script data-file="${k}">${sectionFiles[k]}</script>`).join('\n')}
        </body>
      </html>
    `);
    doc.close();

    const win = iframe.contentWindow || window;

    // Test 4 & Test 2: Inspect document.styleSheets and computed styles
    setTimeout(() => {
      // 1. Inspect Document Stylesheets
      const sheetsList: Array<{ href: string; disabled: boolean; rulesCount: any }> = [];
      try {
        Array.from(doc.styleSheets).forEach((sheet, i) => {
          let rulesCount: any = 0;
          try {
            rulesCount = sheet.cssRules ? sheet.cssRules.length : 0;
          } catch (e) {
            rulesCount = 'CROSS_ORIGIN';
          }
          sheetsList.push({
            href: sheet.href || `Inline Style #${i + 1}`,
            disabled: sheet.disabled,
            rulesCount
          });
        });
      } catch (e) {}

      // 2. Inspect Computed Styles
      const getStyles = (el: Element | null): Record<string, string> => {
        if (!el) return { status: 'NOT_FOUND' };
        const cs = win.getComputedStyle(el);
        return {
          display: cs.display,
          position: cs.position,
          width: cs.width,
          height: cs.height,
          padding: cs.padding,
          margin: cs.margin,
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          background: cs.background.slice(0, 30),
          color: cs.color,
          zIndex: cs.zIndex
        };
      };

      const headerEl = doc.querySelector('header') || doc.querySelector('.site-header') || doc.querySelector('nav');
      const navEl = doc.querySelector('nav') || doc.querySelector('.main-nav');
      const h1El = doc.querySelector('h1') || doc.querySelector('.hero-title') || doc.querySelector('.sp-heading-xl');
      const buttonEl = doc.querySelector('button') || doc.querySelector('.btn') || doc.querySelector('a.btn');

      // 3. Inspect Loaded Fonts
      const fontsList: Array<{ family: string; status: string }> = [];
      try {
        if (doc.fonts) {
          doc.fonts.forEach((font: any) => {
            fontsList.push({ family: font.family, status: font.status });
          });
        }
      } catch (e) {}

      // TEST 10: Optionally apply applyPortfolioOverrides to test for DOM destruction
      let mutationDetected = false;
      if (testStage === 'TEST10_OVERRIDES') {
        const rootEl = doc.getElementById('pure-root') || doc.body;
        const initialHTML = rootEl.innerHTML;
        try {
          applyPortfolioOverrides(rootEl, {
            name: 'Karthikeyan Test Data',
            headline: 'Full-Stack Developer'
          });
        } catch (e) {}
        const postHTML = rootEl.innerHTML;
        mutationDetected = initialHTML !== postHTML;
      }

      setDiagnostics({
        styleSheets: sheetsList,
        computedStyles: {
          header: getStyles(headerEl),
          nav: getStyles(navEl),
          h1: getStyles(h1El),
          button: getStyles(buttonEl)
        },
        fonts: fontsList,
        domMutationDetected: mutationDetected
      });
    }, 200);
  }, [loading, sectionFiles, templateId, testStage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-6 space-y-6">
      <header className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">🔍 RAW TEMPLATE PURE DEBUG ROUTE (`/debug/template-raw/${templateId}`)</h1>
          <p className="text-xs text-slate-400">Pure Template Runtime Isolation | ZERO CampusCV CSS | ZERO Tailwind Preflight</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setTestStage('TEST1_PURE')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${testStage === 'TEST1_PURE' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-700'}`}
          >
            TEST 1: Pure Original Template
          </button>
          <button
            onClick={() => setTestStage('TEST10_OVERRIDES')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${testStage === 'TEST10_OVERRIDES' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700'}`}
          >
            TEST 10: Apply Overrides
          </button>
        </div>
      </header>

      {/* Diagnostics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <h2 className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">TEST 4: Active document.styleSheets</h2>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {diagnostics.styleSheets.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] bg-black/40 p-1.5 rounded border border-slate-800">
                <span className="truncate text-slate-300">{s.href}</span>
                <span className="text-emerald-400 font-bold ml-2">{s.rulesCount} rules</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <h2 className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">TEST 2: Computed Styles Summary</h2>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-black/40 p-2 rounded border border-slate-800">
              <div className="font-bold text-indigo-400">Header Computed:</div>
              <div>Position: {diagnostics.computedStyles.header.position || 'N/A'}</div>
              <div>Font-Size: {diagnostics.computedStyles.header.fontSize || 'N/A'}</div>
              <div>Height: {diagnostics.computedStyles.header.height || 'N/A'}</div>
            </div>
            <div className="bg-black/40 p-2 rounded border border-slate-800">
              <div className="font-bold text-indigo-400">H1 Computed:</div>
              <div>Font-Size: {diagnostics.computedStyles.h1.fontSize || 'N/A'}</div>
              <div>Font-Family: {(diagnostics.computedStyles.h1.fontFamily || 'N/A').slice(0, 20)}</div>
              <div>Line-Height: {diagnostics.computedStyles.h1.lineHeight || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Render Stage */}
      <div className="bg-white rounded-2xl border-2 border-cyan-500/40 overflow-hidden shadow-2xl">
        <iframe
          ref={iframeRef}
          title="Pure Template Output Stage"
          className="w-full min-h-[800px] border-0"
        />
      </div>
    </div>
  );
}
