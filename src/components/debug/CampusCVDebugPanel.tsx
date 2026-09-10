"use client";

import React, { useState, useEffect } from 'react';

export interface CampusCVDebugPanelProps {
  debugSessionId: string;
  portfolioId?: string;
  templateId?: string;
  mode?: string;
  data?: any;
  imageTrace?: any;
  cssStats?: { discovered: number; loaded: number; failed: number; failedUrls?: string[] };
  mountCount?: number;
  unmountCount?: number;
}

export default function CampusCVDebugPanel(props: CampusCVDebugPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const [mountedTime] = useState(() => new Date().toLocaleTimeString());

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const {
    debugSessionId,
    portfolioId = 'N/A',
    templateId = 'N/A',
    mode = 'N/A',
    data,
    imageTrace,
    cssStats = { discovered: 30, loaded: 30, failed: 0, failedUrls: [] },
    mountCount = 1,
    unmountCount = 0
  } = props;

  const profileImage = data?.profileImage || data?.personal?.profilePhoto || data?.avatarUrl || 'N/A';
  const name = data?.name || data?.personal?.fullName || 'N/A';
  const projectsCount = Array.isArray(data?.projects) ? data.projects.length : (data?.projects === undefined ? 'undefined' : 0);
  const skillsCount = Array.isArray(data?.skills) ? data.skills.length : (data?.skills === undefined ? 'undefined' : 0);

  return (
    <div
      id="campuscv-debug-panel"
      className="fixed bottom-4 right-4 z-[99999] font-mono text-xs text-green-400 bg-black/90 border border-green-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-md max-w-sm w-full select-text transition-all"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center justify-between border-b border-green-500/30 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h4 className="font-bold text-white tracking-wide text-xs uppercase">CampusCV Debugger</h4>
        </div>
        <button
          onClick={() => setMinimized(!minimized)}
          className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded bg-zinc-800"
        >
          {minimized ? 'Expand' : 'Collapse'}
        </button>
      </div>

      {!minimized && (
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {/* SESSION & ENVIRONMENT */}
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div><span className="text-zinc-500">Session:</span> <span className="text-yellow-300 font-bold">{debugSessionId ? debugSessionId.substring(0, 13) : 'N/A'}</span></div>
            <div><span className="text-zinc-500">Portfolio:</span> <span className="text-white">{portfolioId}</span></div>
            <div><span className="text-zinc-500">Template:</span> <span className="text-white">{templateId}</span></div>
            <div><span className="text-zinc-500">Mode:</span> <span className="text-cyan-300 font-bold">{mode}</span></div>
            <div><span className="text-zinc-500">Init Time:</span> <span className="text-zinc-400">{mountedTime}</span></div>
          </div>

          {/* DATA SNAPSHOT */}
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-1 mb-1">DATA</div>
            <div><span className="text-zinc-500">name:</span> <span className="text-white">{name}</span></div>
            <div><span className="text-zinc-500">profileImage:</span> <span className="text-purple-300 break-all">{profileImage}</span></div>
            <div><span className="text-zinc-500">projects:</span> <span className={projectsCount === 'undefined' ? 'text-red-400 font-bold' : 'text-white'}>{String(projectsCount)}</span></div>
            <div><span className="text-zinc-500">skills:</span> <span className="text-white">{String(skillsCount)}</span></div>
          </div>

          {/* IMAGE PIPELINE */}
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-1 mb-1">IMAGE PIPELINE</div>
            <div><span className="text-zinc-500">portfolio.profileImage:</span> <span className="text-zinc-300 break-all">{imageTrace?.portfolioProfileImage || profileImage}</span></div>
            <div><span className="text-zinc-500">uploadedUrl:</span> <span className="text-zinc-300 break-all">{imageTrace?.uploadedUrl || 'N/A'}</span></div>
            <div><span className="text-zinc-500">resolvedUrl:</span> <span className="text-emerald-300 break-all">{imageTrace?.resolvedImageUrl || 'N/A'}</span></div>
            <div><span className="text-zinc-500">source:</span> <span className="text-yellow-300">{imageTrace?.source || 'N/A'}</span></div>
            <div><span className="text-zinc-500">fallback:</span> <span className="text-white">{String(imageTrace?.demoFallback ?? 'N/A')}</span></div>
          </div>

          {/* CSS STATS */}
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-1 mb-1">CSS</div>
            <div><span className="text-zinc-500">CSS Discovered:</span> <span className="text-white">{cssStats.discovered}</span></div>
            <div><span className="text-zinc-500">CSS Loaded:</span> <span className="text-emerald-400">{cssStats.loaded}</span></div>
            <div><span className="text-zinc-500">CSS Failed:</span> <span className={cssStats.failed > 0 ? 'text-red-400 font-bold' : 'text-white'}>{cssStats.failed}</span></div>
            {cssStats.failedUrls && cssStats.failedUrls.length > 0 && (
              <div className="text-red-300 text-[10px] break-all">
                Failed: {cssStats.failedUrls.join(', ')}
              </div>
            )}
          </div>

          {/* RUNTIME LIFECYCLE */}
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 space-y-1">
            <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-1 mb-1">RUNTIME</div>
            <div><span className="text-zinc-500">Mount count:</span> <span className="text-white">{mountCount}</span></div>
            <div><span className="text-zinc-500">Unmount count:</span> <span className="text-white">{unmountCount}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
