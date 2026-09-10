'use client';

import React from 'react';

export interface SkillItem {
  name: string;
  level: string;
  icon: string;
}

const DEFAULT_USING_NOW: SkillItem[] = [
  { name: 'HTML5', level: 'EXPERT', icon: 'html' },
  { name: 'CSS3', level: 'EXPERT', icon: 'css' },
  { name: 'JavaScript', level: 'ADVANCED', icon: 'js' },
  { name: 'TypeScript', level: 'ADVANCED', icon: 'ts' },
  { name: 'React', level: 'EXPERT', icon: 'react' },
  { name: 'Next.js', level: 'ADVANCED', icon: 'next' },
  { name: 'Git', level: 'ADVANCED', icon: 'git' },
  { name: 'Figma', level: 'ADVANCED', icon: 'figma' }
];

const DEFAULT_LEARNING: SkillItem[] = [
  { name: 'GraphQL', level: 'INTERMEDIATE', icon: 'graphql' },
  { name: 'Vue.js', level: 'BASIC', icon: 'vue' },
  { name: 'WebAssembly', level: 'BASIC', icon: 'wasm' },
  { name: 'Three.js', level: 'INTERMEDIATE', icon: 'three' }
];

const DEFAULT_OTHER: SkillItem[] = [
  { name: 'Node.js', level: 'ADVANCED', icon: 'node' },
  { name: 'PostgreSQL', level: 'INTERMEDIATE', icon: 'postgres' },
  { name: 'Docker', level: 'INTERMEDIATE', icon: 'docker' },
  { name: 'UI / UX Design', level: 'EXPERT', icon: 'figma' }
];

interface SkillsSectionProps {
  data?: any;
}

function renderSkillIcon(iconName: string) {
  const icon = (iconName || '').toLowerCase();
  switch (icon) {
    case 'html':
    case 'html5':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12 18.25l-5.7-1.58L5.2 6h13.6l-1.1 10.67zM1.5 0h21l-1.9 21.6L12 24l-8.6-2.4L1.5 0z"/>
        </svg>
      );
    case 'css':
    case 'css3':
    case 'tailwind':
    case 'tailwindcss':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M1.5 0h21l-1.9 21.6L12 24l-8.6-2.4L1.5 0zm15.8 8.4l-.2-2.4H6.9l.4 4.8h7.8l-.4 4.1-2.7.8-2.7-.8-.2-2.1H7.1l.3 4.1 4.6 1.3 4.6-1.3 1-10.6z"/>
        </svg>
      );
    case 'js':
    case 'javascript':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M3 3h18v18H3V3zm14.5 13.8c-.8 0-1.4-.4-1.7-1.1l-1.4.9c.6 1.1 1.7 1.8 3.1 1.8 2.1 0 3.5-1.2 3.5-3.1 0-1.8-1.2-2.5-2.6-3.1-.9-.4-1.4-.7-1.4-1.3 0-.6.5-1.1 1.3-1.1.7 0 1.2.3 1.5.8l1.4-.9c-.5-.9-1.4-1.5-2.9-1.5-1.9 0-3.1 1.2-3.1 2.8 0 1.6 1.1 2.4 2.4 2.9.9.4 1.6.7 1.6 1.4 0 .7-.6 1.2-1.7 1.2zm-7.7-7.4h-1.8v5.8c0 1.2-.6 1.8-1.6 1.8-.7 0-1.2-.3-1.5-.8l-1.4.9c.6 1 1.5 1.6 2.9 1.6 2.2 0 3.4-1.2 3.4-3.5V9.4z"/>
        </svg>
      );
    case 'ts':
    case 'typescript':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M1 3h22v18H1V3zm18.5 13.7c-.8 0-1.4-.4-1.7-1.1l-1.4.9c.6 1.1 1.7 1.8 3.1 1.8 2.1 0 3.5-1.2 3.5-3.1 0-1.8-1.2-2.5-2.6-3.1-.9-.4-1.4-.7-1.4-1.3 0-.6.5-1.1 1.3-1.1.7 0 1.2.3 1.5.8l1.4-.9c-.5-.9-1.4-1.5-2.9-1.5-1.9 0-3.1 1.2-3.1 2.8 0 1.6 1.1 2.4 2.4 2.9.9.4 1.6.7 1.6 1.4 0 .7-.6 1.2-1.7 1.2zM8.5 9.4H4.8v1.8h2.3v7.2h2.2v-7.2h2.3V9.4H8.5z"/>
        </svg>
      );
    case 'react':
    case 'react.js':
    case 'reactjs':
      return (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)"/>
        </svg>
      );
    case 'next':
    case 'next.js':
    case 'nextjs':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 19.5h20L12 2zm0 4.5l6.5 11H5.5L12 6.5z"/>
        </svg>
      );
    case 'git':
    case 'github':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      );
    case 'figma':
    case 'ui':
    case 'ux':
    case 'ui/ux':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M8 2h4a4 4 0 0 1 0 8H8V2zm0 8h4a4 4 0 0 1 0 8H8v-8zm-4 0a4 4 0 0 1 4-4v8a4 4 0 0 1-4-4zm0 8a4 4 0 0 1 4-4v4a4 4 0 0 1-4 0z"/>
        </svg>
      );
    case 'node':
    case 'nodejs':
    case 'node.js':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2L19.5 8 12 11.8 4.5 8 12 4.2zM4 9.6l7 3.5v7.3l-7-3.5V9.6zm9 10.8v-7.3l7-3.5v7.3l-7 3.5z"/>
        </svg>
      );
    case 'postgres':
    case 'postgresql':
    case 'sql':
    case 'database':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      );
    case 'docker':
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      );
    default:
      return (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      );
  }
}

function SkillCard({ skill, index, category }: { skill: SkillItem; index: number; category: string }) {
  return (
    <div 
      data-node-id={`card:skills:${category}:${index}`}
      data-node-type="card"
      className="bg-white border-2 border-black p-5 sm:p-6 flex flex-col items-center justify-center gap-3 shadow-solid-sm hover:-translate-x-1 hover:-translate-y-1 hover:shadow-solid-md hover:bg-[var(--primary,#000000)] text-black hover:text-[var(--primary-foreground,#FFFFFF)] hover:border-[var(--primary,#000000)] transition-all duration-200 cursor-default group"
    >
      <div className="text-black group-hover:text-[var(--primary-foreground,#FFFFFF)] transition-colors duration-200">
        {renderSkillIcon(skill.icon || skill.name)}
      </div>
      <span 
        data-node-id={`text:skills:${category}:${index}:name`}
        data-node-type="text"
        className="font-heading font-black text-xs sm:text-sm tracking-wider uppercase text-center text-black group-hover:text-[var(--primary-foreground,#FFFFFF)] transition-colors duration-200"
      >
        {skill.name}
      </span>
      <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-600 group-hover:text-[var(--primary-foreground,#FFFFFF)] group-hover:opacity-90 transition-colors duration-200">
        {skill.level || 'PROFICIENT'}
      </span>
    </div>
  );
}

export default function SkillsSection({ data = {} }: SkillsSectionProps) {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};

  const title = contentOverrides['text:skills:root:div:title']?.value ||
    data?.skills?.title ||
    'Skills';

  const userSkills = Array.isArray(data?.skills) ? data.skills : (Array.isArray(data?.skillsList) ? data.skillsList : null);

  const hasCustomData = Boolean(
    data?.name || data?.fullName || data?.hero || data?.about || data?.education ||
    data?.experience || data?.projects || data?.skills || data?.contact || data?.email
  );

  let rawList: any[] = [];
  if (Array.isArray(userSkills)) {
    rawList = userSkills;
  } else if (!hasCustomData) {
    rawList = DEFAULT_USING_NOW;
  }

  // If no skills data exists, cleanly remove section without showing fake demo data
  if (!rawList || rawList.length === 0) {
    return null;
  }

  let usingNow: SkillItem[] = [];
  let learning: SkillItem[] = [];
  let other: SkillItem[] = [];

  const formatted: SkillItem[] = rawList.map((s: any) => {
    if (typeof s === 'string') {
      const name = s;
      const iconKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return { name, level: 'ADVANCED', icon: iconKey };
    }
    return {
      name: s.name || s.title || s.skill || 'Skill',
      level: s.level || 'ADVANCED',
      icon: (s.icon || s.name || '').toLowerCase()
    };
  });

  if (formatted.length <= 4) {
    usingNow = formatted;
    learning = [];
    other = [];
  } else if (formatted.length <= 8) {
    usingNow = formatted.slice(0, 4);
    learning = formatted.slice(4);
    other = [];
  } else {
    const third = Math.ceil(formatted.length / 3);
    usingNow = formatted.slice(0, third);
    learning = formatted.slice(third, third * 2);
    other = formatted.slice(third * 2);
  }

  return (
    <section 
      id="skills" 
      data-section="skills"
      className="py-24 bg-[#E5E5E5] transition-colors scroll-mt-24"
      style={styleOverrides['section:skills:root:section:0']}
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            data-node-id="text:skills:root:div:title"
            data-node-type="text"
            className="section-header-box"
            style={styleOverrides['text:skills:root:div:title']}
          >
            {title}
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-800 mt-4 font-normal">
            A comprehensive tech stack and engineering capabilities refined through production systems.
          </p>
        </div>

        {/* 1. USING NOW */}
        <div className="mb-14">
          <h3 className="font-heading font-black text-sm tracking-[0.3em] uppercase text-black mb-6 pl-3 border-l-4 border-[var(--primary,#000000)]">
            Using Now:
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {usingNow.map((skill, idx) => (
              <SkillCard key={idx} skill={skill} index={idx} category="using" />
            ))}
          </div>
        </div>

        {/* 2. LEARNING & EXPLORING */}
        <div className="mb-14">
          <h3 className="font-heading font-black text-sm tracking-[0.3em] uppercase text-black mb-6 pl-3 border-l-4 border-[var(--primary,#000000)]">
            Learning & Exploring:
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {learning.map((skill, idx) => (
              <SkillCard key={idx} skill={skill} index={idx} category="learning" />
            ))}
          </div>
        </div>

        {/* 3. OTHER SKILLS */}
        <div>
          <h3 className="font-heading font-black text-sm tracking-[0.3em] uppercase text-black mb-6 pl-3 border-l-4 border-[var(--primary,#000000)]">
            Other Skills & Architecture:
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {other.map((skill, idx) => (
              <SkillCard key={idx} skill={skill} index={idx} category="other" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
