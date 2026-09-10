import React from 'react';
import { Sparkles, CheckCircle2, Shield, Briefcase, Wrench } from 'lucide-react';

const CATEGORY_ICONS = {
  'Legal & Regulatory': Shield,
  'Consulting & Strategy': Briefcase,
  'Tools & Governance': Wrench,
};

export default function Skills(props = {}) {
  const incoming = props?.data || props?.portfolio || props?.skills || props || {};
  const data = (incoming && typeof incoming === 'object') ? incoming : {};
  const rawSkills = Array.isArray(incoming) ? incoming : (Array.isArray(data?.skills) ? data.skills : null);
  const skillCategories = rawSkills && rawSkills.length > 0 ? rawSkills : [
    {
      category: "Legal & Regulatory",
      skills: [
        { name: "Corporate Jurisprudence", level: 95 },
        { name: "M&A Structuring", level: 92 },
        { name: "Commercial Contracts", level: 98 },
        { name: "IP & Antitrust Law", level: 88 },
      ],
    },
    {
      category: "Consulting & Strategy",
      skills: [
        { name: "Enterprise Risk Advisory", level: 94 },
        { name: "Regulatory Compliance", level: 96 },
        { name: "Boardroom Negotiations", level: 90 },
        { name: "Cross-Border Arbitration", level: 86 },
      ],
    },
    {
      category: "Tools & Governance",
      skills: [
        { name: "LexisNexis & Westlaw", level: 95 },
        { name: "Ironclad CLM", level: 90 },
        { name: "DocuSign eSignature", level: 98 },
        { name: "Compliance AI", level: 85 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 bg-[#FAF8F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#A67D28] uppercase font-sans">
              SKILLS & EXPERTISE
            </span>
            <span className="h-[1px] w-8 bg-[#C89B3C]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Technical & Strategic Mastery
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-[#A67D28] via-[#C89B3C] to-[#D5B350] my-4 rounded-full" />
          <p className="max-w-2xl text-base md:text-lg text-[#6B7280] font-sans font-light leading-relaxed">
            Proven proficiency across legal methodologies, advanced toolchains, and executive leadership standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((cat, catIdx) => {
            const CatIcon = CATEGORY_ICONS[cat?.category] || Sparkles;
            return (
              <div
                key={cat?.category || catIdx}
                className="bg-white p-8 border border-[#C89B3C]/30 shadow-luxury hover:border-[#C89B3C] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#C89B3C]/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#C89B3C]/10 text-[#A67D28] border border-[#C89B3C]/20">
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                        {cat?.category}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67D28] font-sans">
                      {cat?.skills?.length || 0} Skills
                    </span>
                  </div>

                  {/* Skills List (Normal clean layout - no volume/progress bars) */}
                  <div className="space-y-3">
                    {(cat?.skills || []).map((skill, skillIdx) => (
                      <div
                        key={skill?.name || skillIdx}
                        className="group flex items-center justify-between p-3.5 bg-[#FAF8F4] border border-[#C89B3C]/20 hover:border-[#C89B3C] hover:bg-[#C89B3C]/5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#C89B3C] shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-semibold tracking-wider text-[#1A1A1A] uppercase font-sans">
                            {skill?.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
