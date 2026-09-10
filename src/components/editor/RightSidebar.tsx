"use client";

import React from 'react';
import {
  Palette,
  Type,
  Sparkles,
  Check
} from 'lucide-react';
import { PortfolioData } from '../../utils/mockDb';

interface RightSidebarProps {
  portfolio: PortfolioData;
  onPortfolioChange: (p: PortfolioData) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  activePanel: 'theme' | 'fonts' | 'animations' | null;
  setActivePanel: React.Dispatch<React.SetStateAction<'theme' | 'fonts' | 'animations' | null>>;
}

const themeColors = [
  { name: 'Purple Dream',   value: 'violet',   bg: 'bg-violet-600' },
  { name: 'Classic Blue',   value: 'indigo',   bg: 'bg-indigo-650' },
  { name: 'Emerald Forest', value: 'emerald',  bg: 'bg-emerald-500' },
  { name: 'Retro Amber',    value: 'retro',    bg: 'bg-amber-500' },
  { name: 'Crimson Rose',   value: 'rose',     bg: 'bg-rose-500' },
  { name: 'Dark Void',      value: 'dark',     bg: 'bg-zinc-800' },
  { name: 'Corporate Navy', value: 'navy',     bg: 'bg-blue-900' },
  { name: 'Medical Teal',   value: 'teal',     bg: 'bg-teal-500' },
];

const fontPacks = [
  { name: 'Inter Sans',          value: 'sans',      desc: 'Modern, clean corporate standard' },
  { name: 'Sora Display',        value: 'sora',      desc: 'Tech-focused, structured geometry' },
  { name: 'Poppins Rounded',     value: 'poppins',   desc: 'Playful, modern startup feel' },
  { name: 'Plus Jakarta',        value: 'manrope',   desc: 'Elegant, tall character shapes' },
  { name: 'Outfit Bold',         value: 'display',   desc: 'Bold, energetic neo-grotesque' },
  { name: 'Playfair Display',    value: 'playfair',  desc: 'Elegant, high-contrast serif' },
  { name: 'Serif Classic',       value: 'serif',     desc: 'Editorial, classic, academic' },
  { name: 'Fira Code Mono',      value: 'mono',      desc: 'Terminal font, code focused' }
];

const animationPresets = [
  { name: 'None',            value: 'none',    desc: 'Instant loading without transitions' },
  { name: 'Fade In',         value: 'fade',    desc: 'Smooth opacity entry animations' },
  { name: 'Slide Up',        value: 'slide',   desc: 'Clean upward layout reveal transitions' },
  { name: 'Bounce Pop',      value: 'bounce',  desc: 'Dynamic playful element scale bounce' },
];

export default function RightSidebar({ 
  portfolio, 
  onPortfolioChange,
  selectedElementId,
  setSelectedElementId,
  activePanel,
  setActivePanel
}: RightSidebarProps) {

  const update = (patch: Partial<PortfolioData>) => {
    onPortfolioChange({ ...portfolio, ...patch });
  };

  const iconBtn = (key: 'theme' | 'fonts' | 'animations', icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActivePanel(prev => prev === key ? null : key)}
      title={label}
      className={`w-full flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-xl transition-all text-[9px] font-bold uppercase tracking-wider ${
        activePanel === key
          ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-600/10'
          : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`flex h-full shrink-0 ${activePanel ? 'absolute md:relative right-0 top-0 bottom-0 z-40 shadow-2xl md:shadow-none bg-white border-l border-zinc-200' : 'hidden md:flex'}`}>
      
      {/* Expanded panel container */}
      {activePanel && (
        <div className="w-72 h-full bg-white border-r border-zinc-150 overflow-y-auto text-xs text-left p-5 space-y-6">
          
          {/* Theme panel */}
          {activePanel === 'theme' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Theme Mode</h3>
                <p className="text-[10px] text-zinc-400">Select standard light or dark styles.</p>
              </div>

              {/* Dark mode switch */}
              <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-150 shadow-xs">
                <span className="text-zinc-700 font-semibold">Dark Background Mode</span>
                <button
                  onClick={() => update({ isDarkMode: !portfolio.isDarkMode })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${portfolio.isDarkMode ? 'bg-[#7C3AED]' : 'bg-zinc-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${portfolio.isDarkMode ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="space-y-1.5 pt-2">
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Primary Accent Color</h3>
                <p className="text-[10px] text-zinc-400">Choose custom buttons and header highlights.</p>
              </div>

              {/* Color swatches */}
              <div className="grid grid-cols-4 gap-2">
                {themeColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => update({ themeColor: color.value, userSelectedAccent: true })}
                    className={`h-11 rounded-xl relative ${color.bg} transition-transform hover:scale-[1.03] flex items-center justify-center shadow-xs border border-white/20`}
                    title={color.name}
                  >
                    {portfolio.themeColor === color.value && (
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fonts panel */}
          {activePanel === 'fonts' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Typography Fonts</h3>
                <p className="text-[10px] text-zinc-400">Pick font pairings for content and displays.</p>
              </div>

              <div className="space-y-2.5">
                {fontPacks.map(font => (
                  <button
                    key={font.value}
                    onClick={() => update({ fontPack: font.value, userSelectedFont: true })}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      portfolio.fontPack === font.value
                        ? 'border-[#7C3AED] bg-purple-50/50 shadow-xs'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-zinc-900 text-xs">{font.name}</div>
                    <div className="text-zinc-500 text-[10px] mt-0.5">{font.desc}</div>
                    {portfolio.fontPack === font.value && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-[#7C3AED]">
                        <Check className="w-3 h-3" /> Active Style
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Animations panel */}
          {activePanel === 'animations' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Entrance Animations</h3>
                <p className="text-[10px] text-zinc-400">Set loading effects for cards and texts.</p>
              </div>

              <div className="space-y-2.5">
                {animationPresets.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => update({ animationPreset: preset.value })}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      portfolio.animationPreset === preset.value
                        ? 'border-[#7C3AED] bg-purple-50/50 shadow-xs'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="font-bold text-zinc-900 text-xs">{preset.name}</div>
                    <div className="text-zinc-500 text-[10px] mt-0.5">{preset.desc}</div>
                    {portfolio.animationPreset === preset.value && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-[#7C3AED]">
                        <Check className="w-3 h-3" /> Active Preset
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Selector Icon Strip on the right */}
      <div className="w-16 bg-white border-l border-zinc-200 py-4 flex flex-col items-center gap-2 shrink-0">
        <button
          onClick={() => setActivePanel(null)}
          className="md:hidden w-10 h-10 rounded-full hover:bg-zinc-50 text-zinc-500 flex items-center justify-center transition-all text-xs mb-2 border border-zinc-200"
          title="Close panel"
        >
          ✕
        </button>
        {iconBtn('theme', <Palette className="w-5 h-5" />, 'Theme')}
        {iconBtn('fonts', <Type className="w-5 h-5" />, 'Fonts')}
        {iconBtn('animations', <Sparkles className="w-5 h-5" />, 'Animations')}
      </div>

    </div>
  );
}
