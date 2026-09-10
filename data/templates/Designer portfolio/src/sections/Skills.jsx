import React from 'react';
import { Sparkles, PenTool } from 'lucide-react';

export default function Skills({ data = {} }) {
  const userSkills = Array.isArray(data.skills)
    ? data.skills
    : (Array.isArray(data.skills?.items)
      ? data.skills.items
      : (Array.isArray(data.data?.skills)
        ? data.data.skills
        : (Array.isArray(data.content?.skills)
          ? data.content.skills
          : (Array.isArray(data.resume?.skills) ? data.resume.skills : []))));

  const userTools = Array.isArray(data.tools)
    ? data.tools
    : (Array.isArray(data.tools?.items) ? data.tools.items : []);

  const rawSkillsList = userSkills.filter(Boolean);
  const rawToolsList = userTools.filter(Boolean);

  if (rawSkillsList.length === 0 && rawToolsList.length === 0) {
    return null;
  }

  const getItemLabel = (item) => {
    if (typeof item === 'string') return item.trim() || 'New Skill';
    return (item?.name || item?.label || item?.title || item?.skill || 'New Skill').trim();
  };

  // If tools array is not separately provided, intelligently distribute skills
  let disciplinesList = rawSkillsList;
  let toolsList = rawToolsList;

  if (toolsList.length === 0 && disciplinesList.length > 1) {
    const mid = Math.ceil(disciplinesList.length / 2);
    disciplinesList = rawSkillsList.slice(0, mid);
    toolsList = rawSkillsList.slice(mid);
  }

  const eyebrow = data.skillsEyebrow || data.skills?.eyebrow || "05 / Expertise";
  const sectionTitle = data.skillsTitle || data.skills?.title || "Skills & Core Stack";
  const sectionDesc = data.skillsDescription || data.skills?.description || "Combining strategic design thinking with tactical execution using industry standard design tools.";

  return (
    <section id="skills" data-cv-section="skills" data-node-id="section:skills:root:section:0" className="py-16 sm:py-24 md:py-32 border-b border-[#E5E0D8]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span
            className="text-xs font-extrabold uppercase tracking-widest text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] block mb-2"
            data-cv="skills.eyebrow"
            data-node-id="text:skills:root:eyebrow:0"
          >
            {eyebrow}
          </span>
          <h2
            className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#111111] tracking-tight break-normal whitespace-normal hyphens-none max-w-full"
            data-cv="skills.title"
            data-node-id="text:skills:root:h2:0"
          >
            {sectionTitle}
          </h2>
          {sectionDesc && (
            <p
              className="text-sm sm:text-base text-[#666666] mt-3 sm:mt-4 font-medium leading-relaxed break-normal whitespace-normal hyphens-none"
              data-cv="skills.description"
              data-node-id="text:skills:root:p:0"
            >
              {sectionDesc}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${toolsList.length > 0 ? 'md:grid-cols-2' : ''} gap-10 md:gap-12`}>
          
          {/* Design Capabilities */}
          <div className="space-y-6">
            <h3 data-node-id="text:skills:root:h3:0" className="font-heading text-xl font-bold text-[#111111] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]" />
              <span>Design Disciplines & Core Skills</span>
            </h3>

            <div className="flex flex-wrap gap-3" data-cv-collection="skills.items">
              {disciplinesList.map((skill, idx) => (
                <div
                  key={idx}
                  data-cv={`skills.items[${idx}].name`}
                  data-node-id={`container:skills:card:${idx}:pill:0`}
                  className="card skill-item px-5 py-3.5 rounded-2xl bg-white border border-[#E5E0D8] text-sm font-bold text-[#111111] hover:border-[var(--campuscv-accent,var(--cv-accent,#FF4500))] hover:text-[var(--campuscv-accent,var(--cv-accent,#FF4500))] transition-all shadow-xs cursor-pointer inline-flex items-center justify-center"
                >
                  <span data-node-id={`text:skills:card:${idx}:span:0`}>
                    {getItemLabel(skill)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Software */}
          {toolsList.length > 0 && (
            <div className="space-y-6">
              <h3 data-node-id="text:skills:root:h3:1" className="font-heading text-xl font-bold text-[#111111] flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[var(--campuscv-accent,var(--cv-accent,#FF4500))]" />
                <span>Tools & Technologies</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" data-cv-collection="tools.items">
                {toolsList.map((tool, idx) => {
                  const globalIdx = rawToolsList.length > 0 ? idx : (disciplinesList.length + idx);
                  return (
                    <div
                      key={idx}
                      data-cv={`skills.items[${globalIdx}].name`}
                      data-node-id={`container:tools:card:${idx}:pill:0`}
                      className="card tool-item p-4 rounded-2xl bg-white border border-[#E5E0D8] text-center font-bold text-sm text-[#111111] hover:border-[#111111] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <div data-node-id={`container:tools:card:${idx}:dot:0`} className="w-2 h-2 rounded-full bg-[var(--campuscv-accent,var(--cv-accent,#FF4500))] shrink-0"></div>
                      <span data-node-id={`text:tools:card:${idx}:span:0`}>{getItemLabel(tool)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
