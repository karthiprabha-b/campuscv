"use client";

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Sun, 
  Moon, 
  X, 
  ExternalLink, 
  Pencil, 
  Share2, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Sparkles,
  Layout
} from 'lucide-react';
import { PortfolioData } from '../../types/portfolio';
import PortfolioRenderer from '../templates/PortfolioRenderer';
import { getPublicPortfolioUrl } from '../../utils/urlHelper';

interface UserPortfolioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData | null;
  overrideTemplateId?: string | null;
  onOpenEditor?: () => void;
}

export type ViewportDevice = 'desktop' | 'tablet' | 'mobile';

export default function UserPortfolioPreviewModal({
  isOpen,
  onClose,
  portfolio,
  overrideTemplateId,
  onOpenEditor
}: UserPortfolioPreviewModalProps) {
  const [device, setDevice] = useState<ViewportDevice>('desktop');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [zoomScale, setZoomScale] = useState<number>(100);

  useEffect(() => {
    if (portfolio) {
      setThemeMode(portfolio.isDarkMode ? 'dark' : 'light');
    }
  }, [portfolio]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !portfolio) return null;

  const effectiveTemplateId = overrideTemplateId || portfolio.templateId || portfolio.layoutStyle || 'default';
  
  // Construct the effective preview data with active user customizations
  const effectivePortfolioData: PortfolioData = {
    ...portfolio,
    templateId: effectiveTemplateId,
    layoutStyle: effectiveTemplateId,
    isDarkMode: themeMode === 'dark',
    published: true,
  };

  const publicUrl = getPublicPortfolioUrl(portfolio.username);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white animate-in fade-in duration-150">
      
      {/* ── Top Bar / Header ── */}
      <header className="h-16 px-4 sm:px-6 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0 select-none z-10">
        
        {/* Left: Portfolio Info & Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
            <Layout className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white font-bricolage truncate">
                {portfolio.name || 'Your Portfolio'}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Design
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono truncate">
              Template: <span className="text-zinc-200 capitalize font-semibold">{effectiveTemplateId}</span>
              {overrideTemplateId && ' (Preview Override)'}
            </p>
          </div>
        </div>

        {/* Center: Device and Display Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Responsive Device Switcher */}
          <div className="flex items-center gap-0.5 bg-zinc-800/90 p-1 rounded-xl border border-zinc-700/60 shadow-inner">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'desktop'
                  ? 'bg-[#7C3AED] text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Desktop View (Full Screen)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'tablet'
                  ? 'bg-[#7C3AED] text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                device === 'mobile'
                  ? 'bg-[#7C3AED] text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <div className="flex items-center gap-0.5 bg-zinc-800/90 p-1 rounded-xl border border-zinc-700/60">
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Preview in Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-[#7C3AED] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
              }`}
              title="Preview in Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center gap-1 bg-zinc-800/90 p-1 rounded-xl border border-zinc-700/60 font-mono text-xs">
            <button
              type="button"
              onClick={() => setZoomScale(Math.max(zoomScale - 25, 50))}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer rounded hover:bg-zinc-700/50"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-zinc-300 font-bold min-w-[36px] text-center">{zoomScale}%</span>
            <button
              type="button"
              onClick={() => setZoomScale(Math.min(zoomScale + 25, 125))}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer rounded hover:bg-zinc-700/50"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Actions & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenEditor && (
            <button
              type="button"
              onClick={onOpenEditor}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-zinc-700/60"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Site</span>
            </button>
          )}

          <a
            href={`/${portfolio.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-sm cursor-pointer shadow-purple-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Live URL</span>
          </a>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-700/60"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Viewport Stage ── */}
      <main className={`flex-1 overflow-y-auto flex flex-col items-center bg-zinc-950/95 w-full select-auto ${
        device === 'desktop' ? 'p-0' : 'p-4 sm:p-8'
      }`}>
        <div
          style={{
            width: device === 'mobile' ? '390px' : (device === 'tablet' ? '768px' : '100%'),
            maxWidth: device === 'mobile' ? '390px' : (device === 'tablet' ? '768px' : 'none'),
            transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : 'none',
            transformOrigin: 'top center',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`relative mx-auto bg-white transition-shadow ${
            device === 'mobile'
              ? 'rounded-[40px] shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-[10px] border-zinc-800 overflow-hidden my-4 ring-1 ring-zinc-700/50'
              : device === 'tablet'
              ? 'rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.75)] border-[6px] border-zinc-800 overflow-hidden my-4 ring-1 ring-zinc-700/50'
              : 'w-full rounded-none border-0 shadow-none overflow-visible my-0'
          }`}
        >
          {/* Device Speaker Notch for Mobile */}
          {device === 'mobile' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-28 bg-zinc-800 rounded-b-xl z-30 flex items-center justify-center">
              <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>
          )}

          {/* Actual Rendered Portfolio using user's real customization data */}
          <PortfolioRenderer
            portfolio={effectivePortfolioData}
            data={effectivePortfolioData}
            mode="published"
            viewport={device}
          />
        </div>
      </main>
    </div>
  );
}
