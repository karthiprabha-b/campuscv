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
  
  let skillCategories = [];
  if (rawSkills && rawSkills.length > 0) {
    if (rawSkills[0]?.category && Array.isArray(rawSkills[0]?.skills)) {
      skillCategories = rawSkills;
    } else {
      const groupedMap = new Map();
      const unassigned = [];
      rawSkills.forEach((sk) => {
        if (!sk) return;
        const name = typeof sk === 'string' ? sk : (sk.name || sk.skill || sk.title || '');
        const category = typeof sk === 'object' && (sk.category || sk.group) ? (sk.category || sk.group) : null;
        if (!name.trim()) return;
        const skillObj = {
          name: name.trim(),
          level: typeof sk === 'object' && sk.level ? sk.level : 90
        };
        if (category && category.trim()) {
          const catKey = category.trim();
          if (!groupedMap.has(catKey)) groupedMap.set(catKey, []);
          groupedMap.get(catKey).push(skillObj);
        } else {
          unassigned.push(skillObj);
        }
      });

      if (groupedMap.size > 0) {
        skillCategories = Array.from(groupedMap.entries()).map(([category, skills]) => ({
          category,
          skills
        }));
        if (unassigned.length > 0) {
          if (skillCategories.length > 0) {
            skillCategories[0].skills.push(...unassigned);
          } else {
            skillCategories.push({ category: "Core Competencies", skills: unassigned });
          }
        }
      } else if (unassigned.length > 0) {
        const numCats = unassigned.length >= 3 ? 3 : (unassigned.length === 2 ? 2 : 1);
        const catNames = ["Core Competencies", "Specialized Practice", "Tools & Methodologies"];
        const cats = Array.from({ length: numCats }, (_, i) => ({
          category: catNames[i] || `Expertise Area ${i + 1}`,
          skills: []
        }));
        unassigned.forEach((skill, idx) => {
          cats[idx % numCats].skills.push(skill);
        });
        skillCategories = cats;
      }
    }
  }

  if (!skillCategories || skillCategories.length === 0) {
    skillCategories = [
      {
        category: "Strategic Advisory",
        skills: [
          { name: "Executive Leadership", level: 95 },
          { name: "Commercial Operations", level: 92 },
          { name: "Governance & Risk", level: 98 },
          { name: "Cross-Domain Alignment", level: 88 },
        ],
      },
      {
        category: "Technical Competencies",
        skills: [
          { name: "Enterprise Architecture", level: 94 },
          { name: "Quality & Compliance", level: 96 },
          { name: "High-Impact Negotiations", level: 90 },
          { name: "Workflow Optimization", level: 86 },
        ],
      },
      {
        category: "Tools & Methodologies",
        skills: [
          { name: "Modern Toolchains", level: 95 },
          { name: "Analytics & Metrics", level: 90 },
          { name: "Process Automation", level: 98 },
          { name: "AI & Modern Systems", level: 85 },
        ],
      },
    ];
  }

  return (
    <section id="skills" data-cv-section="skills" className="py-24 bg-[#FAF8F4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
            <span 
              className="text-xs font-bold tracking-[0.2em] uppercase font-sans"
              style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
            >
              SKILLS & EXPERTISE
            </span>
            <span className="h-[1px] w-8" style={{ backgroundColor: 'var(--campuscv-accent, #C89B3C)' }} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            Technical & Strategic Mastery
          </h2>
          <div 
            className="h-1 w-20 my-4 rounded-full"
            style={{
              backgroundColor: 'var(--campuscv-accent, #C89B3C)'
            }}
          />
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
                className="bg-white p-8 border border-stone-200/80 shadow-luxury transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div 
                    className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 border border-stone-200 bg-stone-50"
                        style={{
                          color: 'var(--campuscv-accent, #C89B3C)'
                        }}
                      >
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                        {cat?.category}
                      </h3>
                    </div>
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-sans"
                    >
                      {cat?.skills?.length || 0} Skills
                    </span>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-3">
                    {(cat?.skills || []).map((skill, skillIdx) => (
                      <div
                        key={skill?.name || skillIdx}
                        className="group flex items-center justify-between p-3.5 bg-[#FAF8F4] border border-stone-200 hover:border-stone-400 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 
                            className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform"
                            style={{ color: 'var(--campuscv-accent, #C89B3C)' }}
                          />
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
