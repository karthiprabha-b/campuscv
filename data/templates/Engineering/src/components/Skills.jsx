import React, { useState } from 'react';
import { Code2, Layout, Server, Cloud, Database, Cpu, Layers, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';
import SectionHeader from './SectionHeader';

export default function Skills({ data = {} }) {
  const norm = (data?.profile && Array.isArray(data?.skillCategories) && data.skillCategories.length > 0) ? data : normalizeEngineeringData(data);
  const skillCategories = Array.isArray(norm?.skillCategories) 
    ? norm.skillCategories 
    : (Array.isArray(norm?.skills) ? norm.skills : []);
  
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const getIcon = (iconName) => {
    switch (String(iconName || 'Code2')) {
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
      case 'Cpu':
        return <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Layers':
        return <Layers className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const safeCats = (skillCategories || []).filter(c => c && (Array.isArray(c.skills) ? c.skills.length > 0 : true));
  const activeCategory = safeCats[activeCategoryIndex] || safeCats[0] || { category: 'Technologies', title: 'Technologies', skills: [] };
  const currentSkills = Array.isArray(activeCategory.skills) ? activeCategory.skills : [];

  return (
    <section
      id="skills"
      data-node-id="section:skills:root:section:0"
      data-node-type="section"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          eyebrow="TECHNICAL EXPERTISE"
          title="Skills &amp; Technologies"
          subtitle="Core engineering stack across modern languages, distributed infrastructure & high-velocity frameworks"
        />

        {/* Category Pill Selector */}
        {safeCats.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
            {(safeCats || []).map((cat, idx) => {
              const isActive = activeCategoryIndex === idx;
              const catTitle = cat?.category || cat?.title || `Area ${idx + 1}`;
              return (
                <button
                  key={`cat-btn-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveCategoryIndex(idx);
                  }}
                  className={`flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-gradient-cyan-pill text-cyber-950 shadow-cyan-glow scale-105 ring-2 ring-cyan-400/50'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/90 hover:text-slate-950 border border-slate-200'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, var(--campuscv-accent-light, var(--campuscv-accent)) 0%, var(--campuscv-accent) 100%)',
                    color: 'var(--primary-foreground, #030712)',
                    boxShadow: '0 0 15px -2px rgba(var(--campuscv-accent-rgb), 0.5)'
                  } : {}}
                >
                  {getIcon(cat?.icon || (idx === 0 ? 'Code2' : (idx === 1 ? 'Server' : 'Layers')))}
                  <span>{catTitle}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-slate-900/20 text-slate-950' : 'bg-slate-200/70 text-slate-600'}`}>
                    {cat?.skills?.length || 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Stable Skill Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {(currentSkills || []).map((skill, idx) => {
            const skillName = typeof skill === 'string' ? skill : (skill.name || skill.title || skill.skill || `Skill ${idx + 1}`);
            const skillLevel = typeof skill === 'object' ? (skill.level || skill.proficiency || 90) : 90;
            const skillTag = typeof skill === 'object' ? (skill.tag || skill.badge || (skillLevel >= 90 ? 'Expert' : 'Advanced')) : 'Verified';

            return (
              <div
                key={`skill-${activeCategoryIndex}-${idx}-${skillName}`}
                data-node-id={`container:skills:card:${activeCategoryIndex}:${idx}`}
                data-node-type="container"
                data-cv={`skills[${idx}]`}
                className="bg-slate-50 hover:bg-cyber-50/50 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-slate-200/80 shadow-soft-elevation transition-transform duration-200 hover:-translate-y-1 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-cyber-950 group-hover:bg-gradient-cyan-pill group-hover:text-cyber-950 text-cyber-brightCyan flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-sm transition-colors">
                    {idx < 9 ? `0${idx + 1}` : `${idx + 1}`}
                  </div>

                  <div className="min-w-0">
                    <h4
                      data-node-id={`text:skills:name:${idx}:0`}
                      data-node-type="text"
                      data-cv={`skills[${idx}].name`}
                      className="text-sm sm:text-base font-bold font-display text-slate-900 group-hover:text-cyber-600 transition-colors truncate"
                    >
                      {skillName}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                      <span>Proficiency:</span>
                      <span className="text-slate-700 font-semibold">{skillLevel}%</span>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-cyber-100 text-cyber-800 font-mono text-[10px] sm:text-[11px] font-bold uppercase shrink-0">
                  {skillTag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
