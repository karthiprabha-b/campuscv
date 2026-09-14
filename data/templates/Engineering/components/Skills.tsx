'use client';

import React, { useState } from 'react';
import { Code2, Layout, Server, Cloud, Database, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import SectionHeader from './SectionHeader';

export default function Skills() {
  const { skillCategories } = PORTFOLIO_DATA;
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const activeCategory = skillCategories[activeCategoryIndex];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Layout':
        return <Layout className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Server':
        return <Server className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Database':
        return <Database className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  return (
    <section id="skills" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="TECHNICAL EXPERTISE"
          title="Skills &amp; Technologies"
          subtitle="Core engineering stack across cloud native infrastructure, distributed backends & modern web"
        />

        {/* Category Pill Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10 sm:mb-14">
          {skillCategories.map((cat, idx) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategoryIndex(idx)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                activeCategoryIndex === idx
                  ? 'bg-gradient-cyan-pill text-cyber-950 shadow-cyan-glow scale-105'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {getIcon(cat.iconName)}
              <span>{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Clean, Simple Skill Tiles Grid (No Percentages) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {activeCategory.skills.map((skill, idx) => (
            <div
              key={skill.name}
              className="bg-slate-50 hover:bg-cyber-50/50 rounded-[28px] sm:rounded-[36px] p-5 sm:p-6 border border-slate-200/80 shadow-soft-elevation transition-transform duration-200 hover:-translate-y-1 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-cyber-950 group-hover:bg-gradient-cyan-pill group-hover:text-cyber-950 text-cyber-brightCyan flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-sm transition-colors">
                  0{idx + 1}
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold font-display text-slate-900 group-hover:text-cyber-600 transition-colors truncate">
                    {skill.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Experience: {skill.experience}
                  </p>
                </div>
              </div>

              {skill.badge && (
                <span className="px-3 py-1 rounded-full bg-cyber-100 text-cyber-800 font-mono text-[10px] sm:text-[11px] font-bold uppercase shrink-0">
                  {skill.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
