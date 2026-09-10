"use client";

import React, { useState, useEffect } from 'react';

interface ViewportStageProps {
  viewport: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
  editorWidth?: number;
  children: (stageInfo: { layoutWidth: number; layoutHeight?: number; scale: number; iframeRef: React.RefObject<HTMLIFrameElement | null>; onHeightChange?: (height: number) => void }) => React.ReactNode;
}

export default function ViewportStage({ viewport, zoom, editorWidth, children }: ViewportStageProps) {
  const [mountedWidth, setMountedWidth] = useState<number>(editorWidth || 1440);

  useEffect(() => {
    const update = () => {
      setMountedWidth(window.innerWidth);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const currentScreenWidth = editorWidth || mountedWidth;
  const isPhysicalMobile = currentScreenWidth < 768;
  const isPhysicalTablet = currentScreenWidth >= 768 && currentScreenWidth < 1024;

  const isDesktop = viewport === 'desktop';
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  const userZoom = zoom || 1.0;

  // Sizing & container styling determination
  let wrapperClass = 'transition-all duration-300 relative bg-white overflow-hidden';
  let wrapperStyle: React.CSSProperties = {
    transform: userZoom !== 1.0 ? `scale(${userZoom})` : 'none',
    transformOrigin: 'top center',
  };
  let effectiveLayoutWidth = 1440;

  if (isPhysicalMobile) {
    // Native Mobile: Render full-width seamlessly without fake bezel overflows
    wrapperClass += ' w-full max-w-full rounded-none border-0 shadow-none my-0';
    wrapperStyle.width = '100%';
    wrapperStyle.maxWidth = '100%';
    effectiveLayoutWidth = currentScreenWidth;
  } else if (isPhysicalTablet) {
    if (isMobile) {
      wrapperClass += ' rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[6px] border-zinc-800 mx-auto my-3';
      wrapperStyle.width = '390px';
      wrapperStyle.maxWidth = '390px';
      effectiveLayoutWidth = 390;
    } else {
      wrapperClass += ' w-full max-w-full rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-zinc-800/80 mx-auto my-2';
      wrapperStyle.width = '100%';
      wrapperStyle.maxWidth = '100%';
      effectiveLayoutWidth = Math.min(currentScreenWidth - 32, 768);
    }
  } else {
    // Desktop Studio Mode: Show appropriate frame previews
    if (isMobile) {
      wrapperClass += ' rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.7)] border-[8px] border-zinc-800 mx-auto my-4';
      wrapperStyle.width = '390px';
      wrapperStyle.maxWidth = '390px';
      effectiveLayoutWidth = 390;
    } else if (isTablet) {
      wrapperClass += ' rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-zinc-800/80 mx-auto my-4';
      wrapperStyle.width = '768px';
      wrapperStyle.maxWidth = '768px';
      effectiveLayoutWidth = 768;
    } else {
      wrapperClass += ' rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-zinc-800/80 mx-auto my-4 w-full max-w-[1440px]';
      wrapperStyle.width = '100%';
      wrapperStyle.maxWidth = '1440px';
      effectiveLayoutWidth = 1440;
    }
  }

  return (
    <div className={`w-full flex flex-col items-center justify-start relative ${isPhysicalMobile ? 'pb-24' : 'pb-28'}`}>
      {/* Centered Device Canvas Wrapper */}
      <div
        className={wrapperClass}
        style={wrapperStyle}
      >
        <div className="w-full bg-white relative rounded-[inherit]">
          {children({
            layoutWidth: effectiveLayoutWidth,
            scale: userZoom,
            iframeRef: { current: null },
          })}
        </div>
      </div>
    </div>
  );
}
