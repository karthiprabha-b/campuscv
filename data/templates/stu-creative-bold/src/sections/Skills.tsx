"use client";

import React from "react";
import { CheckCircle2, Sparkles, Layers } from "lucide-react";
import { SkillCategory } from "@/data/portfolio";

interface SkillsProps {
  data?: any;
  skills?: any[];
}

export default function Skills(props: SkillsProps = {}) {
  const rawSkills = props.skills || props.data?.skills || props.data?.skillCategories || props.data?.skillsList || props.data?.techStack || [];

  // Normalize categories locally if passed directly unnormalized
  let categories: SkillCategory[] = [];

  if (Array.isArray(rawSkills) && rawSkills.length > 0) {
    const isCategorized = rawSkills.some(
      (item: any) =>
        item &&
        typeof item === 'object' &&
        ('items' in item || 'skills' in item || 'data' in item || 'list' in item) &&
        Array.isArray(item.items || item.skills || item.data || item.list)
    );

    if (isCategorized) {
      categories = rawSkills.map((cat: any, idx: number) => {
        const catName = cat.category || cat.title || cat.name || `Skill Group ${idx + 1}`;
        const rawItems = cat.items || cat.skills || cat.data || cat.list || [];
        const items = rawItems.map((it: any) => {
          if (typeof it === 'string') {
            return { name: it.trim(), percentage: 85 };
          }
          return {
            name: (it.name || it.title || it.skill || '').trim(),
            percentage: typeof it.percentage === 'number' ? it.percentage : (typeof it.level === 'number' ? it.level : 85)
          };
        }).filter((it: any) => it.name.length > 0);

        return {
          category: catName,
          items
        };
      }).filter((c: any) => c.items.length > 0);
    } else {
      // Flat list
      const items = rawSkills.map((sk: any) => {
        if (typeof sk === 'string') return { name: sk.trim(), percentage: 85 };
        return {
          name: (sk?.name || sk?.title || sk?.skill || String(sk)).trim(),
          percentage: typeof sk?.percentage === 'number' ? sk.percentage : (typeof sk?.level === 'number' ? sk.level : 85)
        };
      }).filter((it: any) => it.name.length > 0);

      if (items.length <= 8) {
        categories = [{ category: 'Technical Competencies', items }];
      } else if (items.length <= 14) {
        const mid = Math.ceil(items.length / 2);
        categories = [
          { category: 'Core Technologies & Frameworks', items: items.slice(0, mid) },
          { category: 'Tools, Platforms & Libraries', items: items.slice(mid) }
        ];
      } else {
        const chunk = Math.ceil(items.length / 3);
        categories = [
          { category: 'Frontend & Web Development', items: items.slice(0, chunk) },
          { category: 'Backend & Systems', items: items.slice(chunk, chunk * 2) },
          { category: 'Tools, DevOps & Cloud', items: items.slice(chunk * 2) }
        ];
      }
    }
  }

  const totalSkillCount = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const gridColsClass = categories.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : (categories.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3');

  return (
    <section
      id="skills"
      data-section="skills"
      data-node-id="section:skills:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div className="flex flex-col space-y-3">
            <span
              data-field="skills.subtitle"
              className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
            >
              Expertise
            </span>
            <h2
              data-field="skills.title"
              data-node-id="text:skills:root:h2:0"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
            >
              SKILLS & PROFICIENCY
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
          </div>

          {totalSkillCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/5 border border-[#111111]/10 text-xs font-bold text-[#111111] select-none">
              <Layers className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>{totalSkillCount} Skills Listed</span>
            </div>
          )}
        </div>

        <div className={`grid ${gridColsClass} gap-6 sm:gap-8`}>
          {categories.map((category: SkillCategory, idx: number) => (
            <div
              key={category.category || idx}
              data-node-id={`container:skills:category:${idx}`}
              className="p-6 sm:p-7 bg-white border-2 border-[#111111]/10 rounded-md shadow-xs space-y-5 hover:border-[#FFC107] transition-colors duration-150 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-[#111111]/10 pb-4">
                <div className="flex items-center gap-2">
                  <h3
                    data-field={`skills[${idx}].category`}
                    data-node-id={`text:skills:category:${idx}:name`}
                    className="text-base sm:text-lg font-black tracking-tight text-[#111111]"
                  >
                    {category.category}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFC107]/20 text-[#111111]">
                    {category.items?.length || 0}
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-[#FFC107]" />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(category.items || []).map((skill: any, sIdx: number) => {
                  const skillName = typeof skill === "string" ? skill : skill.name;
                  if (!skillName) return null;

                  return (
                    <div
                      key={skillName || sIdx}
                      data-field={`skills[${idx}].items[${sIdx}].name`}
                      data-node-id={`text:skills:items:${idx}:${sIdx}:name`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#FFC107]/20 border border-[#111111]/10 hover:border-[#FFC107] text-[#111111] rounded-sm text-xs font-bold tracking-wide transition-colors duration-150 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#FFC107] shrink-0 stroke-[2.5]" />
                      <span>{skillName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

