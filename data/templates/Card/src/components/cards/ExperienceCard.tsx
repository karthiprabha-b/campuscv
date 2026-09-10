'use client';

import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';

const DEFAULT_EXPERIENCE = [
  {
    id: "exp-1",
    role: "Staff Infrastructure & Full-Stack Architect",
    company: "Veloce Cloud Systems",
    location: "San Francisco, CA (Hybrid)",
    period: "2022 — Present",
    type: "Full-Time",
    highlights: [
      "Architected multi-tenant edge rendering pipeline cutting P99 latency by 44% across 8M daily sessions.",
      "Spearheaded company-wide migration to Next.js 14 App Router, RSC, and Tailwind-based design systems.",
      "Engineered real-time state synchronization engine using WebSockets and Redis Pub/Sub handling 120k concurrent users."
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "Redis", "AWS Lambda", "Terraform", "PostgreSQL", "Tailwind CSS"],
    impact: "44% Faster P99 Latency"
  },
  {
    id: "exp-2",
    role: "Senior Frontend & Cloud Engineer",
    company: "Nexus AI Platforms",
    location: "San Francisco, CA",
    period: "2020 — 2022",
    type: "Full-Time",
    highlights: [
      "Built interactive prompt-engineering canvas and visual node pipeline with 60fps WebGL/Canvas rendering.",
      "Optimized client-side bundle size by 62% via aggressive dynamic imports, tree shaking, and streaming SSR.",
      "Mentored junior and mid-level engineers, establishing standard code review and CI/CD testing workflows."
    ],
    stack: ["React", "TypeScript", "GraphQL", "Python", "Docker", "GCP", "Kubernetes", "Framer Motion"],
    impact: "62% Smaller Bundle Size"
  },
  {
    id: "exp-3",
    role: "Full-Stack Software Engineer",
    company: "Aether Labs & Studio",
    location: "Berkeley, CA",
    period: "2018 — 2020",
    type: "Full-Time",
    highlights: [
      "Engineered bespoke headless e-commerce and fintech platforms for high-growth enterprise clients.",
      "Integrated secure Stripe & Crypto payment processors processing over $14M in annual transaction volume."
    ],
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Stripe API", "AWS", "Docker", "Jest"],
    impact: "$14M+ Volume Processed"
  }
];

interface ExperienceCardProps {
  data?: any;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = React.memo(({ data }) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const rawExp = data?.experience || data?.timeline;
  const experienceList = Array.isArray(rawExp) && rawExp.length > 0 ? rawExp : DEFAULT_EXPERIENCE;
  const { accentClass } = useTheme();

  const title =
    contentOverrides['text:experience:root:div:title']?.value ||
    data?.experienceTitle ||
    'Work Experience';

  const [expandedId, setExpandedId] = useState<string>(experienceList[0]?.id || '0');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? '' : id));
  };

  return (
    <div 
      data-section="experience" 
      data-cv-section="experience" 
      className="relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:experience:root:section:0']}
    >
      {/* Background Glow */}
      <div 
        className={`absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`}
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl bg-white/[0.05] border border-white/10 ${accentClass.text}`}>
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Card 04 / 08</div>
            <h2 
              data-node-id="text:experience:root:div:title"
              data-node-type="text"
              data-cv="experience.title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          {experienceList.length} Milestones
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-3 my-auto" data-cv-section="experience" data-cv-collection="experience.items">
        {experienceList.map((exp: any, idx: number) => {
          const expId = exp.id || String(idx);
          const isExpanded = expandedId === expId;
          const highlights = Array.isArray(exp.highlights) ? exp.highlights : [];
          const technologies = Array.isArray(exp.technologies) 
            ? exp.technologies 
            : (Array.isArray(exp.stack) ? exp.stack : (Array.isArray(exp.skills) ? exp.skills : []));
          const roleName = exp.role || exp.title || 'Software Engineer';
          const companyName = exp.company || 'Tech Company';
          const periodText = exp.period || exp.year || exp.date || 'Present';

          return (
            <div
              key={expId}
              data-cv={`experience.items[${idx}]`}
              data-cv-item="experience"
              data-cv-index={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'bg-white/[0.04] border-white/20 shadow-lg'
                  : 'bg-white/[0.02] hover:bg-white/[0.035] border-white/10'
              }`}
            >
              {/* Header Row */}
              <div className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      data-node-id={`text:experience:period:${idx}`}
                      data-node-type="text"
                      data-cv={`experience.items[${idx}].period`}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${accentClass.badge}`}
                    >
                      {periodText}
                    </span>
                    {exp.type && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/5 text-[10px] text-zinc-400 font-mono">
                        {exp.type}
                      </span>
                    )}
                  </div>

                  <div className="text-base sm:text-lg font-bold text-white">
                    <span 
                      data-node-id={`text:experience:role:${idx}`}
                      data-node-type="text"
                      data-cv={`experience.items[${idx}].role`}
                    >
                      {roleName}
                    </span>{' '}
                    <span className="text-zinc-500 font-normal">at</span>{' '}
                    <span 
                      data-node-id={`text:experience:company:${idx}`}
                      data-node-type="text"
                      data-cv={`experience.items[${idx}].company`}
                      className={`${accentClass.text}`}
                    >
                      {companyName}
                    </span>
                  </div>

                  {exp.location && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        <span 
                          data-node-id={`text:experience:location:${idx}`}
                          data-node-type="text"
                          data-cv={`experience.items[${idx}].location`}
                        >
                          {exp.location}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(expId)}
                  className={`p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-400 hover:text-white transition-transform duration-300 cursor-pointer ${
                    isExpanded ? 'rotate-180 text-white bg-white/15' : ''
                  }`}
                  aria-label="Toggle details"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/10 space-y-3">
                  {exp.description && (
                    <p 
                      data-node-id={`text:experience:items:${idx}:desc`}
                      data-node-type="text"
                      data-cv={`experience.items[${idx}].description`}
                      className="text-xs sm:text-sm text-zinc-300 leading-relaxed"
                    >
                      {exp.description}
                    </p>
                  )}

                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Key Achievements</span>
                      </div>
                      <div className="space-y-1">
                        {highlights.map((item: any, hIdx: number) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span 
                              data-node-id={`text:experience:highlight:${idx}:${hIdx}`}
                              data-node-type="text"
                              data-cv={`experience.items[${idx}].highlights[${hIdx}]`}
                            >
                              {typeof item === 'string' ? item : (item?.text || item?.title || item?.name || String(item))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  {technologies.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {technologies.map((tech: any, tIdx: number) => (
                          <span
                            key={tIdx}
                            data-node-id={`text:experience:tech:${idx}:${tIdx}`}
                            data-node-type="text"
                            data-cv={`experience.items[${idx}].technologies[${tIdx}]`}
                            className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-[10px] text-zinc-300 font-mono"
                          >
                            {typeof tech === 'string' ? tech : (tech?.name || tech?.title || String(tech))}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';
