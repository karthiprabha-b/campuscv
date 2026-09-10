"use client";

/**
 * /debug/template-native — CampusCV Template Runtime Diagnostic Isolation Test Route
 *
 * Runs the exact isolation sequence (TEST A through TEST E) to pinpoint the exact layer
 * breaking template sticky header positioning and scrolling physics.
 */

import React, { useState, useEffect, useRef } from 'react';
import { mockDb } from '../../../utils/mockDb';
import UploadedTemplateRunner from '../../../templates/UploadedTemplateRunner';
import TemplateRuntime from '../../../templates/TemplateRuntime';

export default function DebugTemplateNativePage() {
  const [activeTest, setActiveTest] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [diagnosticReport, setDiagnosticReport] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sampleData = mockDb.getPortfolios()[0];

  const runDiagnostics = () => {
    if (typeof document === 'undefined') return;

    // Discover header
    const header = document.querySelector('header') || document.querySelector('nav') || document.querySelector('.header, .navbar');
    if (!header) {
      setDiagnosticReport({ error: 'No header or navigation element found in current test environment DOM.' });
      return;
    }

    const win = window;
    const headerStyle = win.getComputedStyle(header);
    const headerRect = header.getBoundingClientRect();

    // Build complete ancestor chain from header up to document.body
    const ancestorChain: any[] = [];
    let curr = header.parentElement;
    while (curr) {
      const cs = win.getComputedStyle(curr);
      ancestorChain.push({
        tagName: curr.tagName.toLowerCase(),
        id: curr.id || undefined,
        className: curr.className ? String(curr.className).substring(0, 50) : undefined,
        position: cs.position,
        display: cs.display,
        overflow: cs.overflow,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        transform: cs.transform !== 'none' ? cs.transform : 'none',
        filter: cs.filter !== 'none' ? cs.filter : 'none',
        perspective: cs.perspective !== 'none' ? cs.perspective : 'none',
        contain: cs.contain !== 'none' ? cs.contain : 'none',
        willChange: cs.willChange !== 'auto' ? cs.willChange : 'auto',
        height: cs.height,
        minHeight: cs.minHeight,
        scrollHeight: curr.scrollHeight,
        clientHeight: curr.clientHeight,
        scrollTop: curr.scrollTop
      });
      if (curr === document.body) break;
      curr = curr.parentElement;
    }

    // Identify actual scroll container
    let scrollContainer = 'window (document.body)';
    let actualScrollElement: any = document.scrollingElement || document.documentElement;
    let scrollHeight = actualScrollElement.scrollHeight;
    let clientHeight = actualScrollElement.clientHeight;

    for (const anc of ancestorChain) {
      if (anc.scrollHeight > anc.clientHeight + 10 && (anc.overflowY === 'auto' || anc.overflowY === 'scroll')) {
        scrollContainer = `<${anc.tagName}${anc.id ? '#' + anc.id : ''}${anc.className ? '.' + anc.className.split(' ')[0] : ''}>`;
        break;
      }
    }

    // Detect breaking ancestors
    const breakingAncestors = ancestorChain.filter(anc => {
      return (
        (anc.overflowY === 'hidden' || anc.overflow === 'hidden' || anc.overflowX === 'hidden') ||
        (anc.transform !== 'none') ||
        (anc.contain !== 'none') ||
        (anc.filter !== 'none') ||
        (anc.perspective !== 'none')
      );
    });

    setDiagnosticReport({
      testMode: activeTest,
      header: {
        tagName: header.tagName.toLowerCase(),
        id: header.id || 'none',
        className: header.className ? String(header.className).substring(0, 60) : 'none',
        computedPosition: headerStyle.position,
        computedTop: headerStyle.top,
        computedZIndex: headerStyle.zIndex,
        computedTransform: headerStyle.transform,
        rectTop: Math.round(headerRect.top),
        rectHeight: Math.round(headerRect.height),
        offsetParent: header.offsetParent ? header.offsetParent.tagName.toLowerCase() : 'null'
      },
      actualScrollContainer: scrollContainer,
      windowScrollY: Math.round(window.scrollY),
      breakingAncestorsCount: breakingAncestors.length,
      breakingAncestors,
      ancestorChainDepth: ancestorChain.length,
      ancestorChain
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runDiagnostics();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTest]);

  useEffect(() => {
    const handleScroll = () => {
      runDiagnostics();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTest]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Diagnostic Control Bar */}
      <div className="fixed top-0 left-0 right-0 z-[99999] bg-slate-950/95 backdrop-blur-md border-b border-slate-800 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-amber-400 text-sm tracking-wider uppercase">⚡ Template Sticky Diagnostic Runner</span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-mono">Test Mode: {activeTest}</span>
          </div>

          {/* Test Isolation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTest('A')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTest === 'A' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              TEST A: Raw Native HTML
            </button>

            <button
              onClick={() => setActiveTest('B')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTest === 'B' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              TEST B: Native + Data
            </button>

            <button
              onClick={() => setActiveTest('C')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTest === 'C' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              TEST C: Published Runtime
            </button>

            <button
              onClick={() => setActiveTest('D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTest === 'D' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              TEST D: Editor Iframe
            </button>

            <button
              onClick={() => setActiveTest('E')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTest === 'E' ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              TEST E: Editor Canvas Stage
            </button>
          </div>
        </div>

        {/* Live Diagnostics HUD Overlay */}
        {diagnosticReport && (
          <div className="mt-3 max-w-7xl mx-auto bg-slate-900/90 p-3 rounded-xl border border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Header Tag/Position:</span>
              <span className="font-bold text-emerald-400">{diagnosticReport.header?.tagName} ({diagnosticReport.header?.computedPosition})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Header rect.top:</span>
              <span className="font-bold text-cyan-400">{diagnosticReport.header?.rectTop}px (scrollY: {diagnosticReport.windowScrollY}px)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Scroll Container:</span>
              <span className="font-bold text-amber-400 truncate block">{diagnosticReport.actualScrollContainer}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Breaking Ancestors:</span>
              <span className={`font-bold ${diagnosticReport.breakingAncestorsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {diagnosticReport.breakingAncestorsCount} element(s)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Ancestor Depth:</span>
              <span className="font-bold text-indigo-400">{diagnosticReport.ancestorChainDepth} parent levels</span>
            </div>
          </div>
        )}
      </div>

      {/* Test Render Viewport */}
      <div className="pt-36 min-h-screen" ref={containerRef}>
        {activeTest === 'A' && (
          <div className="min-h-[2500px] bg-slate-950 text-slate-100 p-8 space-y-16">
            <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 flex items-center justify-between shadow-xl">
              <div className="font-bold text-amber-400 text-lg">TEST A: Raw Native Sticky Header</div>
              <nav className="flex items-center gap-4 text-sm text-slate-300 font-medium">
                <a href="#hero" className="hover:text-amber-400 transition">Hero</a>
                <a href="#about" className="hover:text-amber-400 transition">About</a>
                <a href="#projects" className="hover:text-amber-400 transition">Projects</a>
                <a href="#contact" className="hover:text-amber-400 transition">Contact</a>
              </nav>
            </header>

            <section id="hero" className="min-h-[600px] bg-slate-900/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold text-white">Hero Section</h1>
              <p className="text-slate-400 mt-2">Test A: Pure un-wrapped DOM tree with native position: sticky.</p>
            </section>

            <section id="about" className="min-h-[600px] bg-slate-900/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white">About Section</h2>
              <p className="text-slate-400 mt-2">Scroll down to verify header stays pinned to top = 0px.</p>
            </section>

            <section id="projects" className="min-h-[600px] bg-slate-900/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white">Projects Section</h2>
              <p className="text-slate-400 mt-2">Content scrolls underneath sticky header bar.</p>
            </section>

            <section id="contact" className="min-h-[600px] bg-slate-900/40 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white">Contact Section</h2>
              <p className="text-slate-400 mt-2">Footer section at bottom of page.</p>
            </section>
          </div>
        )}

        {activeTest === 'B' && (
          <div className="min-h-[2500px] bg-slate-950 text-slate-100 p-8 space-y-16">
            <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 flex items-center justify-between shadow-xl">
              <div className="font-bold text-amber-400 text-lg">{(sampleData as any).personal?.name || sampleData.hero?.title || 'TEST B Header'}</div>
              <nav className="flex items-center gap-4 text-sm text-slate-300 font-medium">
                <span>{(sampleData as any).personal?.title || sampleData.about?.title || 'Developer'}</span>
              </nav>
            </header>

            <section className="min-h-[600px] bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
              <h1 className="text-4xl font-extrabold text-white">{(sampleData.hero as any)?.greeting || sampleData.hero?.title || 'Hello'}</h1>
              <p className="text-slate-400 mt-2">{(sampleData.hero as any)?.subheading || sampleData.hero?.subtitle}</p>
            </section>
          </div>
        )}

        {activeTest === 'C' && (
          <div className="w-full">
            <TemplateRuntime
              templateId="cs-portfolio"
              data={sampleData}
              mode="published"
            />
          </div>
        )}

        {activeTest === 'D' && (
          <div className="w-full">
            <TemplateRuntime
              templateId="cs-portfolio"
              data={sampleData}
              mode="preview"
            />
          </div>
        )}

        {activeTest === 'E' && (
          <div className="w-full p-8 flex justify-center">
            <div style={{ transform: 'scale(0.95)', transformOrigin: 'top center' }} className="w-full max-w-5xl">
              <TemplateRuntime
                templateId="cs-portfolio"
                data={sampleData}
                mode="editor"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
