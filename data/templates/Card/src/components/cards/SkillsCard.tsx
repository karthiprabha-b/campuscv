'use client';

import React, { useState, useMemo } from 'react';
import { useTheme } from '../ThemeContext';
import {
  Cpu,
  Layout,
  Server,
  Cloud,
  Sparkles,
  CheckCircle2,
  Code2,
  Zap,
  Terminal,
  Layers
} from 'lucide-react';

const DEFAULT_SKILL_CATEGORIES = [
  {
    title: "Frontend Engineering",
    icon: "Layout",
    skills: [
      { name: "React / React Native", level: 98, experience: "6+ yrs", isPrimary: true },
      { name: "Next.js (App Router, RSC)", level: 96, experience: "5+ yrs", isPrimary: true },
      { name: "TypeScript", level: 95, experience: "6+ yrs", isPrimary: true },
      { name: "Tailwind CSS & Design Systems", level: 98, experience: "5+ yrs", isPrimary: true },
      { name: "State Architecture (Zustand, Redux)", level: 92, experience: "5+ yrs" },
      { name: "Framer Motion & Web Animations", level: 90, experience: "4+ yrs" }
    ]
  },
  {
    title: "Backend & Distributed Systems",
    icon: "Server",
    skills: [
      { name: "Node.js & Express", level: 94, experience: "6+ yrs", isPrimary: true },
      { name: "PostgreSQL & Prisma / Drizzle", level: 92, experience: "5+ yrs", isPrimary: true },
      { name: "Redis (Caching, Pub/Sub, Queues)", level: 90, experience: "4+ yrs", isPrimary: true },
      { name: "GraphQL & REST APIs", level: 92, experience: "5+ yrs" },
      { name: "Python / FastAPI", level: 88, experience: "3+ yrs" },
      { name: "Go (Microservices)", level: 82, experience: "2+ yrs" }
    ]
  },
  {
    title: "Cloud, DevOps & Infrastructure",
    icon: "Cloud",
    skills: [
      { name: "AWS (Lambda, S3, ECS, RDS)", level: 92, experience: "5+ yrs", isPrimary: true },
      { name: "Docker & Containerization", level: 90, experience: "5+ yrs", isPrimary: true },
      { name: "CI/CD (GitHub Actions, Vercel)", level: 95, experience: "5+ yrs", isPrimary: true },
      { name: "Terraform (IaC)", level: 84, experience: "3+ yrs" },
      { name: "Kubernetes & Cloudflare Workers", level: 82, experience: "2+ yrs" }
    ]
  },
  {
    title: "AI, Tools & Architecture",
    icon: "Cpu",
    skills: [
      { name: "LLM Orchestration & Prompt Eng.", level: 92, experience: "2+ yrs", isPrimary: true },
      { name: "Vector Databases (Pinecone, pgvector)", level: 88, experience: "2+ yrs", isPrimary: true },
      { name: "Git, Vite, TurboRepo & Monorepos", level: 94, experience: "6+ yrs" },
      { name: "System Design & Micro-frontends", level: 90, experience: "4+ yrs" }
    ]
  }
];

interface SkillsCardProps {
  data?: any;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Frontend Engineering': Layout,
  'Frontend': Layout,
  'Backend & Distributed Systems': Server,
  'Backend': Server,
  'Cloud, DevOps & Infrastructure': Cloud,
  'Cloud': Cloud,
  'DevOps': Cloud,
  'AI, Tools & Architecture': Cpu,
  'AI & Machine Learning': Cpu,
  'Tools': Cpu,
};

// Map proficiency levels to clean modern tier labels
const getTierBadge = (level: number) => {
  if (level >= 94) return { label: 'Mastery', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  if (level >= 88) return { label: 'Advanced', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
  if (level >= 80) return { label: 'Proficient', color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' };
  return { label: 'Core', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
};

interface SkillsCardProps {
  data?: any;
  cardNumber?: number;
  totalCards?: number;
}

export const SkillsCard: React.FC<SkillsCardProps> = React.memo(({
  data,
  cardNumber = 6,
  totalCards = 8
}) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const { accentClass } = useTheme();
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);

  const title =
    contentOverrides['text:skills:root:div:title']?.value ||
    data?.skillsTitle ||
    'Skills & Technical Stack';

  // Normalize skill categories from various possible data formats
  const categories = useMemo(() => {
    const rawCategories = data?.skillCategories || data?.skillsCategories;
    if (Array.isArray(rawCategories) && rawCategories.length > 0) {
      return rawCategories;
    }

    const rawSkills = data?.skills || data?.tools;
    if (Array.isArray(rawSkills) && rawSkills.length > 0) {
      if (typeof rawSkills[0] === 'object' && Array.isArray((rawSkills[0] as any).skills)) {
        return rawSkills;
      }

      // Check if items have category field
      const byCategory: Record<string, any[]> = {};
      const unclassified: any[] = [];

      rawSkills.forEach((s: any, idx: number) => {
        const name = typeof s === 'string' ? s.trim() : (s.name || s.title || String(s)).trim();
        if (!name) return;
        const category = typeof s === 'object' && s.category ? s.category : null;
        const skillObj = {
          name,
          level: typeof s === 'object' && typeof s.level === 'number' ? s.level : (95 - (idx % 5) * 4),
          experience: typeof s === 'object' && s.experience ? s.experience : '3+ yrs',
          isPrimary: typeof s === 'object' && !!s.isPrimary || idx < 5,
        };
        if (category) {
          if (!byCategory[category]) byCategory[category] = [];
          byCategory[category].push(skillObj);
        } else {
          unclassified.push(skillObj);
        }
      });

      if (Object.keys(byCategory).length > 0) {
        const catList = Object.entries(byCategory).map(([catTitle, skills]) => ({
          title: catTitle,
          icon: 'Code2',
          skills
        }));
        if (unclassified.length > 0) {
          catList.push({ title: 'Other Skills', icon: 'Cpu', skills: unclassified });
        }
        return catList;
      }

      // If flat list with > 12 skills, cluster into clean tabs
      if (rawSkills.length > 12) {
        const clusters: Record<string, any[]> = {
          'Languages & Core': [],
          'Frontend & Web': [],
          'Backend & Data': [],
          'Cloud & DevOps': [],
          'Tools & AI': []
        };

        rawSkills.forEach((s: any, idx: number) => {
          const name = typeof s === 'string' ? s.trim() : (s.name || s.title || String(s)).trim();
          if (!name) return;
          const lower = name.toLowerCase();
          const skillObj = {
            name,
            level: typeof s === 'object' && typeof s.level === 'number' ? s.level : (95 - (idx % 5) * 4),
            experience: typeof s === 'object' && s.experience ? s.experience : '3+ yrs',
            isPrimary: idx < 6,
          };

          if (lower.match(/python|javascript|typescript|java|c\+\+|c#|golang|go|rust|ruby|php|kotlin|swift|scala|r|dart/)) {
            clusters['Languages & Core'].push(skillObj);
          } else if (lower.match(/react|next|vue|angular|svelte|html|css|tailwind|redux|ui|ux|styled|sass|bootstrap/)) {
            clusters['Frontend & Web'].push(skillObj);
          } else if (lower.match(/node|express|nest|django|flask|spring|sql|postgres|mysql|mongo|graphql|rest|prisma|redis|kafka|backend|database/)) {
            clusters['Backend & Data'].push(skillObj);
          } else if (lower.match(/aws|azure|gcp|docker|kubernetes|ci\/cd|linux|git|terraform|nginx|cloud|devops/)) {
            clusters['Cloud & DevOps'].push(skillObj);
          } else {
            clusters['Tools & AI'].push(skillObj);
          }
        });

        const activeClusters = Object.entries(clusters)
          .filter(([_, list]) => list.length > 0)
          .map(([clusterTitle, skills]) => ({
            title: clusterTitle,
            icon: clusterTitle.includes('Frontend') ? 'Layout' : (clusterTitle.includes('Backend') ? 'Server' : (clusterTitle.includes('Cloud') ? 'Cloud' : 'Cpu')),
            skills
          }));

        if (activeClusters.length > 1) {
          return activeClusters;
        }
      }

      return [{
        title: "Technical Stack",
        icon: "Cpu",
        skills: unclassified.length > 0 ? unclassified : rawSkills.map((s: any, idx: number) => ({
          name: typeof s === 'string' ? s : (s.name || s.title || String(s)),
          level: 90 - (idx % 4) * 5,
          experience: "3+ yrs",
          isPrimary: idx < 4
        }))
      }];
    }

    return DEFAULT_SKILL_CATEGORIES;
  }, [data]);

  const activeCategory = categories[selectedCatIndex] || categories[0] || DEFAULT_SKILL_CATEGORIES[0];
  const IconComponent = CATEGORY_ICONS[activeCategory?.title] || Cpu;
  const skillsList = Array.isArray(activeCategory?.skills) ? activeCategory.skills : [];

  return (
    <div 
      data-section="skills" 
      data-cv-section="skills" 
      className="relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:skills:root:section:0']}
    >
      {/* Background Accent Glow */}
      <div 
        className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`}
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl bg-white/[0.05] border border-white/10 ${accentClass.text}`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Card 0{cardNumber} / 0{totalCards}</div>
            <h2 
              data-node-id="text:skills:root:div:title"
              data-node-type="text"
              data-cv="skills.title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Tech Matrix</span>
        </div>
      </div>

      {/* Category Tab Pills */}
      {categories.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {categories.map((cat, idx) => {
            const CatIcon = CATEGORY_ICONS[cat.title] || Cpu;
            const isSelected = selectedCatIndex === idx;
            const catSkills = Array.isArray(cat.skills) ? cat.skills : [];

            return (
              <button
                key={cat.title || idx}
                onClick={() => setSelectedCatIndex(idx)}
                className={`p-3 rounded-2xl text-left transition-all duration-150 flex flex-col gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white/15 border border-white/30 text-white shadow-md'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CatIcon className={`w-3.5 h-3.5 ${isSelected ? accentClass.text : 'text-zinc-500'}`} />
                <div 
                  data-node-id={`text:skills:cat_tab:${idx}`}
                  data-node-type="text"
                  data-cv="skill.category"
                  className="text-xs font-semibold leading-tight line-clamp-1"
                >
                  {cat.title}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  {catSkills.length} competencies
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modern Bento Tech Chips Grid */}
      <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3.5 my-auto" data-cv-section="skills" data-cv-collection="skills.items">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent className={`w-4 h-4 ${accentClass.text}`} />
            <h3 
              data-node-id={`text:skills:category_heading:${selectedCatIndex}`}
              data-node-type="text"
              data-cv="skills.title"
              className="text-sm font-bold text-white"
            >
              {activeCategory.title}
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {skillsList.length} Technologies
          </span>
        </div>

        {/* Bento Capsule Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {skillsList.map((skill: any, sIdx: number) => {
            const skillName = typeof skill === 'string' ? skill : (skill.name || skill.title || 'Tech');
            const level = typeof skill.level === 'number' ? skill.level : 85;
            const expText = skill.experience || "3+ yrs";
            const tier = getTierBadge(level);

            return (
              <div
                key={skillName || sIdx}
                data-cv={`skills.items[${sIdx}]`}
                data-cv-item="skill"
                data-cv-index={sIdx}
                className="group relative p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/20 transition-all duration-200 flex flex-col justify-between gap-2.5 shadow-sm hover:scale-[1.02]"
              >
                {/* Top Row: Tech Icon/Sparkle & Tier Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-white">
                    {skill.isPrimary ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 pointer-events-none" />
                    ) : (
                      <Code2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 group-hover:text-cyan-400 pointer-events-none" />
                    )}
                    <span 
                      data-node-id={`text:skills:items:${sIdx}:name`}
                      data-node-type="text"
                      data-cv={`skills.items[${sIdx}].name`}
                      className="truncate cursor-text"
                    >
                      {skillName}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Tier Tag & Experience Period */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                  <span 
                    data-node-id={`text:skills:items:${sIdx}:tier`}
                    data-node-type="text"
                    data-cv={`skills.items[${sIdx}].tier`}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${tier.color} cursor-text`}
                  >
                    {tier.label}
                  </span>

                  <span 
                    data-node-id={`text:skills:items:${sIdx}:exp`}
                    data-node-type="text"
                    data-cv={`skills.items[${sIdx}].experience`}
                    className="text-[10px] text-zinc-400 font-mono cursor-text"
                  >
                    {expText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

SkillsCard.displayName = 'SkillsCard';
