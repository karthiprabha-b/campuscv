'use client';

import React, { useState } from 'react';
import { useTheme, AccentColor } from './ThemeContext';
import { Sparkles, FileText, Send, Palette, Moon, Sun, Laptop } from 'lucide-react';

const DEFAULT_PROFILE = {
  name: "Alex Sterling",
  title: "Senior Full-Stack & Cloud Engineer",
  availability: "Available for Q4 Opportunities & Freelance",
  statusText: "Building next-gen digital experiences"
};

interface NavbarProps {
  data?: any;
  onOpenResume: () => void;
  onScrollToCard?: (cardId: string) => void;
}

const ACCENT_OPTIONS: { key: AccentColor; label: string; colorClass: string }[] = [
  { key: 'violet', label: 'Cyber Violet', colorClass: 'bg-violet-500' },
  { key: 'cyan', label: 'Neon Cyan', colorClass: 'bg-cyan-500' },
  { key: 'emerald', label: 'Emerald Glow', colorClass: 'bg-emerald-500' },
  { key: 'amber', label: 'Solar Amber', colorClass: 'bg-amber-500' },
  { key: 'rose', label: 'Crimson Rose', colorClass: 'bg-rose-500' },
];

export const Navbar: React.FC<NavbarProps> = React.memo(({ data, onOpenResume, onScrollToCard }) => {
  const { isDark, toggleDark, accent, setAccent, accentClass } = useTheme();
  const [showPalette, setShowPalette] = useState(false);

  const profile = data?.profile || data?.hero || data || {};
  const name = profile?.name || data?.name || DEFAULT_PROFILE.name;
  const title = profile?.title || profile?.role || data?.role || DEFAULT_PROFILE.title;
  const statusText = profile?.statusText || profile?.availability || DEFAULT_PROFILE.statusText;

  // Initials
  const initials = (name || DEFAULT_PROFILE.name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0]?.toUpperCase() || '')
    .join('') || 'AS';

  const handleScrollToCard = (cardId: string) => {
    if (onScrollToCard) {
      onScrollToCard(cardId);
    } else {
      const el = document.getElementById(cardId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-black/50 border-b border-white/10 transition-colors pointer-events-auto">
      {/* Brand & Availability */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleScrollToCard('card-hero')}
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
            <span className="font-mono font-bold text-lg text-white">{initials}</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-black animate-pulse" />
          </div>
          <div>
            <div className="font-semibold text-sm text-white flex items-center gap-1.5">
              <span>{name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono uppercase ${accentClass.badge}`}>
                Pro
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block truncate max-w-[200px] md:max-w-xs">
              {title}
            </p>
          </div>
        </button>

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-[12px] font-medium text-emerald-300 truncate max-w-[240px]">{statusText}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Accent Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-zinc-300 transition-all"
            title="Switch Accent Glow"
          >
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Theme</span>
            <div className={`w-2.5 h-2.5 rounded-full ${accentClass.bg} shadow-sm`} />
          </button>

          {showPalette && (
            <div className="absolute right-0 mt-2 p-2 rounded-2xl bg-zinc-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-50 flex flex-col gap-1 min-w-[170px] animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 px-2 py-1">
                Accent Glow
              </div>
              {ACCENT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setAccent(opt.key);
                    setShowPalette(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                    accent === opt.key
                      ? 'bg-white/15 text-white font-medium'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className={`w-3 h-3 rounded-full ${opt.colorClass} ${accent === opt.key ? 'ring-2 ring-white/50' : ''}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Resume Button */}
        <button
          onClick={onOpenResume}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-zinc-300" />
          <span>CV / Resume</span>
        </button>

        {/* Get in touch CTA */}
        <button
          onClick={() => handleScrollToCard('card-contact')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${accentClass.gradient} shadow-lg shadow-black/40 hover:opacity-95 hover:scale-[1.03] active:scale-[0.98] transition-all`}
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hire Me</span>
          <span className="sm:hidden">Contact</span>
        </button>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';
