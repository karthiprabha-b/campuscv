"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Check } from 'lucide-react';

interface ZoomDropdownProps {
  zoom: number;
  onZoomSet: (val: number) => void;
  onFitToScreen?: () => void;
}

const ZOOM_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5];

export default function ZoomDropdown({ zoom, onZoomSet, onFitToScreen }: ZoomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPct = Math.round(zoom * 100);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2.5 font-mono text-[11px] font-bold text-[#1f1f26] hover:bg-[#f3f1ff] hover:text-[#7448e8] transition-all flex items-center justify-center rounded-md"
        title="Zoom Options"
        aria-label="Zoom options"
      >
        <span>{currentPct}%</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-36 bg-white border border-[#e7e7ef] rounded-xl shadow-xl z-[600] py-1 select-none">
          <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#9292a0]">
            Zoom Presets
          </div>

          {ZOOM_PRESETS.map((p) => {
            const pct = Math.round(p * 100);
            const isSelected = Math.abs(zoom - p) < 0.04;
            return (
              <button
                key={pct}
                onClick={() => {
                  onZoomSet(p);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-mono font-medium flex items-center justify-between hover:bg-[#f3f1ff] transition-colors ${
                  isSelected ? 'text-[#7448e8] font-bold bg-[#f3f1ff]/50' : 'text-[#1f1f26]'
                }`}
              >
                <span>{pct}%</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#7448e8]" />}
              </button>
            );
          })}

          {onFitToScreen && (
            <div className="border-t border-[#e7e7ef] mt-1 pt-1">
              <button
                onClick={() => {
                  onFitToScreen();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs font-medium flex items-center gap-2 text-[#7448e8] hover:bg-[#f3f1ff] transition-colors font-bold"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fit to Screen</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
