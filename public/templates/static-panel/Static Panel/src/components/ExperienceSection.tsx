"use client";

import React from "react";
import { Briefcase, Calendar, MapPin, ArrowUpRight, CheckCircle2, Sparkles, Code2 } from "lucide-react";

const DEFAULT_EXPERIENCE = [
  {
    id: "exp-1",
    role: "Software Engineering Intern",
    company: "Stripe",
    location: "San Francisco, CA",
    period: "May 2025 – Aug 2025",
    highlights: [
      "Engineered real-time settlement telemetry pipelines reducing dispute processing lag by 34%.",
      "Designed fault-tolerant event ingestion services handling 45k+ requests/sec using Go and Kafka.",
      "Shipped developer tooling in TypeScript that automated end-to-end integration test suites across 12 microservices."
    ],
    skills: ["Go", "Kafka", "TypeScript", "Distributed Systems", "AWS"],
    projectLink: "https://stripe.com"
  },
  {
    id: "exp-2",
    role: "Undergraduate AI Researcher",
    company: "Berkeley AI Research (BAIR)",
    location: "Berkeley, CA",
    period: "Aug 2024 – May 2025",
    highlights: [
      "Benchmarked speculative decoding paradigms across 7B–70B open-weight LLMs with PyTorch.",
      "Co-authored research artifact improving multi-token inference latency by 1.8x on consumer GPUs.",
      "Maintained public reproducible evaluation harness with 1.2k+ GitHub stars."
    ],
    skills: ["Python", "PyTorch", "CUDA", "LLM Inference", "HuggingFace"],
    projectLink: "https://bair.berkeley.edu"
  }
];

interface ExperienceSectionProps {
  data?: any;
}

export default function ExperienceSection({ data = {} }: ExperienceSectionProps) {
  // If user explicitly provided an empty array, return null
  if (Array.isArray(data?.experience) && data.experience.length === 0) {
    return null;
  }

  const rawExp = (Array.isArray(data?.experience) && data.experience.length > 0)
    ? data.experience
    : (Array.isArray(data?.workExperience) && data.workExperience.length > 0
        ? data.workExperience
        : (Array.isArray(data?.work) && data.work.length > 0
            ? data.work
            : (Array.isArray(data?.timeline) && data.timeline.length > 0
                ? data.timeline
                : DEFAULT_EXPERIENCE)));

  const experienceList = rawExp.map((exp: any, idx: number) => {
    const role = exp.role || exp.title || exp.position || exp.designation || "Software Engineer";
    const company = exp.company || exp.organization || exp.employer || exp.institution || "Company";
    const location = exp.location || exp.city || "";

    const start = String(exp.startDate || exp.startYear || exp.start || exp.from || '').trim();
    const end = String(exp.endDate || exp.endYear || exp.end || exp.to || (exp.current ? 'Present' : '')).trim();
    let period = String(exp.period || exp.duration || exp.year || '').trim();
    if (!period && start && end && start !== end) {
      period = `${start} – ${end}`;
    } else if (!period && start) {
      period = exp.current ? `${start} – Present` : start;
    } else if (!period && end) {
      period = end;
    }

    const description = exp.description || exp.desc || exp.summary || exp.details || "";
    
    // Normalize raw highlights/bullets/responsibilities
    let rawHighlights: any[] = [];
    if (Array.isArray(exp.highlights) && exp.highlights.length > 0) {
      rawHighlights = exp.highlights;
    } else if (Array.isArray(exp.bullets) && exp.bullets.length > 0) {
      rawHighlights = exp.bullets;
    } else if (Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0) {
      rawHighlights = exp.responsibilities;
    } else if (Array.isArray(exp.roles) && exp.roles.length > 0) {
      rawHighlights = exp.roles;
    } else if (description) {
      rawHighlights = typeof description === 'string' ? description.split(/\n+/).map(s => s.trim()).filter(Boolean) : [description];
    }

    const formattedHighlights = rawHighlights.map((item: any) => {
      if (typeof item === 'string') {
        return { text: item, title: '' };
      }
      if (typeof item === 'object' && item !== null) {
        const title = item.title || item.role || item.position || item.label || item.heading || '';
        const text = item.description || item.desc || item.summary || item.text || item.details || item.value || '';
        return { title, text: text || (typeof item === 'string' ? item : '') };
      }
      return { text: String(item), title: '' };
    }).filter(h => h.text || h.title);

    const skills = Array.isArray(exp.skills) && exp.skills.length > 0
      ? exp.skills
      : (Array.isArray(exp.technologies) && exp.technologies.length > 0 ? exp.technologies : []);

    const projectLink = exp.projectLink || exp.link || exp.url || "";

    return {
      id: exp.id || `exp-${idx}`,
      role,
      company,
      location,
      period,
      highlights: formattedHighlights,
      skills,
      projectLink
    };
  });

  if (experienceList.length === 0) return null;

  return (
    <section 
      id="experience" 
      data-cv-section="experience" 
      data-node-id="section:experience:root:section:0"
      className="py-12 sm:py-16 border-b border-gray-200/80 scroll-mt-8"
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2 border border-brand-200/50">
          <Briefcase className="w-3.5 h-3.5" />
          <span data-cv="experience.eyebrow" data-node-id="text:experience:eyebrow:0">Work Experience</span>
        </div>
        <h2 
          className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1"
        >
          Professional Experience
        </h2>
        <p 
          className="text-sm sm:text-base text-gray-600 mt-1.5 max-w-2xl" 
          data-cv="experience.description"
          data-node-id="text:experience:description:0"
        >
          Engineering roles, high-impact projects, and leadership milestones.
        </p>
      </div>

      {/* Experience Cards Stack */}
      <div className="flex flex-col gap-6" data-cv-collection="experience">
        {experienceList.map((exp: any, idx: number) => (
          <div
            key={exp.id}
            data-cv-item={`experience[${idx}]`}
            className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white hover:border-brand-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_-6px_rgba(0,0,0,0.07)] transition-all duration-300 overflow-hidden"
          >
            {/* Subtle top-right decorative accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-brand-50/70 to-transparent rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header: Icon, Role, Company, Location & Duration */}
            <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/70 border border-brand-200/60 flex items-center justify-center text-brand-600 flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 
                      className="font-extrabold text-gray-900 text-lg sm:text-xl leading-snug group-hover:text-brand-700 transition-colors" 
                      data-cv={`experience.${idx}.role`}
                      data-node-id={`text:experience:${idx}:role:0`}
                    >
                      {exp.role}
                    </h3>
                    {exp.projectLink && (
                      <a
                        href={exp.projectLink.startsWith('http') ? exp.projectLink : `https://${exp.projectLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100/80 px-2.5 py-1 rounded-md transition-colors"
                        title="Visit Company"
                      >
                        <span>Link</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <p 
                      className="text-sm sm:text-base font-bold text-gray-800" 
                      data-cv={`experience.${idx}.company`}
                      data-node-id={`text:experience:${idx}:company:0`}
                    >
                      {exp.company}
                    </p>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200/60">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side: Period Badge */}
              {exp.period && (
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 shadow-2xs self-start sm:self-auto" data-cv={`experience.${idx}.duration`}>
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span data-node-id={`text:experience:${idx}:duration:0`}>{exp.period}</span>
                </div>
              )}
            </div>

            {/* Highlights List */}
            {exp.highlights && exp.highlights.length > 0 && (
              <div className="relative mb-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>Key Responsibilities & Impact</span>
                </div>
                {exp.highlights.map((item: any, bIdx: number) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      {item.title && (
                        <span className="font-bold text-gray-900 mr-1.5">
                          {item.title}:
                        </span>
                      )}
                      <span>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills / Tech Stack Chips */}
            {exp.skills && exp.skills.length > 0 && (
              <div className="relative pt-5 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  <Code2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Technologies & Tools</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill: string, sIdx: number) => (
                    <span
                      key={sIdx}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-white text-gray-700 border border-gray-200 hover:border-brand-300 hover:text-brand-700 transition-all duration-150 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
