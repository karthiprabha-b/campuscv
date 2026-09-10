import React from 'react';
import { Building2, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function Experience(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.experience || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawExp = Array.isArray(incoming) ? incoming : (Array.isArray(data?.experience) ? data.experience : null);
  const experience = rawExp && rawExp.length > 0 ? rawExp : [
    {
      id: "exp1",
      role: "Senior Partner & Practice Chair",
      company: "Vance & Sterling LLP",
      type: "Executive Partnership",
      duration: "2021 - Present",
      location: "New York & London",
      achievements: [
        "Head of the Global Tech M&A & Private Equity Practice leading 25+ senior associates and partners.",
        "Advised on $6.2B aggregate deal volume across cross-border tech mergers, SaaS carve-outs, and venture financings.",
        "Represented premier enterprise technology firms before federal appellate courts and international commercial arbitration tribunals."
      ],
      technologies: ["Tech M&A", "Cross-Border Tax", "Corporate Governance", "Boardroom Advisory", "Private Equity"]
    },
    {
      id: "exp2",
      role: "Senior Legal Counsel",
      company: "Apex Global Technologies",
      type: "In-House Executive",
      duration: "2018 - 2021",
      location: "San Francisco, CA",
      achievements: [
        "Oversaw all corporate legal operations, multi-jurisdiction regulatory compliance, and patent IP portfolios during Series C through IPO readiness.",
        "Structured enterprise licensing agreements valued at over $300M with Fortune 50 clients.",
        "Instituted automated contract lifecycle management (CLM) decreasing contract cycle turnaround times by 45%."
      ],
      technologies: ["Commercial Contracts", "IP Licensing", "SEC Compliance", "Data Privacy", "Venture Capital"]
    }
  ];

  return (
    <section id="experience" className="py-24 bg-[#FAF8F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#A67D28] uppercase font-sans">
              CAREER JOURNEY
            </span>
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Professional Experience
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] my-4 rounded-full" />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Track record of corporate leadership, high-impact deliverables, and strategic execution across top companies.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experience.map((exp, index) => (
            <div
              key={exp?.id || index}
              className="bg-white p-8 border border-[#C89B3C]/30 hover:border-[#C89B3C] shadow-luxury transition-all duration-300 relative group"
            >
              {/* Left Luxury Gold Edge Accent Bar */}
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-[#A67D28] via-[#C89B3C] to-[#D5B350] group-hover:w-2 transition-all" />

              <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-[#C89B3C]/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#C89B3C]/10 text-[#A67D28] border border-[#C89B3C]/30 font-sans">
                      {exp?.type}
                    </span>
                    <span className="text-xs text-gray-400 font-sans flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp?.location}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                    {exp?.role}
                  </h3>

                  <p className="text-sm font-semibold text-[#A67D28] font-sans flex items-center gap-1.5 mt-1">
                    <Building2 className="w-4 h-4" />
                    <span>{exp?.company}</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F4] border border-[#C89B3C]/30 text-xs font-mono font-bold text-[#A67D28]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp?.duration}</span>
                </div>
              </div>

              {/* Achievements Bullet List */}
              <div className="mb-6 space-y-2.5">
                {(exp?.achievements || []).map((ach, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#6B7280] font-sans font-light leading-relaxed">
                      {ach}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tech Stack / Skill Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#C89B3C]/20 font-sans">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 font-sans mr-2">
                  Skills:
                </span>
                {(exp?.technologies || []).map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#FAF8F4] border border-[#C89B3C]/30 text-xs font-medium text-[#1A1A1A]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
