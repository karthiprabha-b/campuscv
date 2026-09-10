'use client';

import React from 'react';
import { useTheme } from './ThemeContext';
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  Mail,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export interface CardNavSection {
  id: string;
  name: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DEFAULT_SECTIONS: CardNavSection[] = [
  { id: 'card-hero', name: 'Hero', short: 'Intro', icon: Sparkles },
  { id: 'card-about', name: 'About Me', short: 'About', icon: User },
  { id: 'card-education', name: 'Education', short: 'Edu', icon: GraduationCap },
  { id: 'card-experience', name: 'Experience', short: 'Exp', icon: Briefcase },
  { id: 'card-projects', name: 'Projects', short: 'Work', icon: FolderGit2 },
  { id: 'card-skills', name: 'Skills & Stack', short: 'Skills', icon: Cpu },
  { id: 'card-certifications', name: 'Certifications', short: 'Certs', icon: Award },
  { id: 'card-contact', name: 'Get in Touch', short: 'Contact', icon: Mail },
];

interface CardNavigatorProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
  sections?: CardNavSection[];
}

export const CardNavigator: React.FC<CardNavigatorProps> = React.memo(({ 
  activeIndex, 
  onNavigate,
  sections = DEFAULT_SECTIONS
}) => {
  const { accentClass } = useTheme();
  const totalSections = sections.length;

  const handlePrev = () => {
    if (activeIndex > 0) onNavigate(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < totalSections - 1) onNavigate(activeIndex + 1);
  };

  if (totalSections === 0) return null;

  return (
    <>
      {/* Desktop Floating Right Rail */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 select-none pointer-events-auto">
        {/* Step Counter Badge */}
        <div className="px-2.5 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-xl text-[11px] font-mono font-medium text-zinc-300 shadow-xl">
          <span className={accentClass.text}>0{activeIndex + 1}</span>
          <span className="text-zinc-600"> / 0{totalSections}</span>
        </div>

        {/* Prev Card Up Button */}
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Previous card"
          className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] border border-white/10 text-zinc-300 disabled:opacity-25 disabled:hover:bg-white/[0.06] transition-all backdrop-blur-md hover:scale-105 active:scale-95"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Nav Items Dock */}
        <div className="flex flex-col gap-2 p-2 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/80">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeIndex === idx;

            return (
              <button
                key={sec.id}
                onClick={() => onNavigate(idx)}
                className="group relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200"
                aria-label={`Scroll to ${sec.name}`}
              >
                {/* Active Backdrop Glow */}
                {isActive && (
                  <div className={`absolute inset-0 rounded-2xl ${accentClass.bg} opacity-25 blur-[6px]`} />
                )}

                {/* Active Pill Indicator */}
                <div
                  className={`relative flex items-center justify-center w-full h-full rounded-2xl transition-all duration-150 ${
                    isActive
                      ? `bg-white/15 border border-white/30 text-white shadow-md scale-105`
                      : `bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-transparent`
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? accentClass.text : ''}`} />
                </div>

                {/* Hover Tooltip Pill */}
                <div className="absolute right-14 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap px-3 py-1 rounded-xl bg-zinc-900/95 border border-white/15 text-xs font-medium text-white shadow-xl backdrop-blur-md z-50">
                  <span>{sec.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Card Down Button */}
        <button
          onClick={handleNext}
          disabled={activeIndex === totalSections - 1}
          aria-label="Next card"
          className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.15] border border-white/10 text-zinc-300 disabled:opacity-25 disabled:hover:bg-white/[0.06] transition-all backdrop-blur-md hover:scale-105 active:scale-95"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </aside>

      {/* Mobile / Tablet Bottom Quick-Nav Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden flex items-center gap-1.5 p-2 rounded-2xl bg-zinc-950/95 border border-white/15 backdrop-blur-2xl shadow-2xl max-w-[95vw] overflow-x-auto no-scrollbar pointer-events-auto">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          const isActive = activeIndex === idx;

          return (
            <button
              key={sec.id}
              onClick={() => onNavigate(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? `bg-white/20 text-white border border-white/25 shadow-lg`
                  : `text-zinc-400 hover:text-zinc-200 hover:bg-white/5`
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? accentClass.text : ''}`} />
              <span className={isActive ? 'inline' : 'hidden sm:inline'}>{sec.short}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
});

CardNavigator.displayName = 'CardNavigator';
