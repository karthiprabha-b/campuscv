"use client";

import React from "react";
import { CheckCircle2, Sparkles, Layers } from "lucide-react";
import { SkillCategory, skillCategories as defaultSkills } from "@/data/portfolio";

interface SkillsProps {
  data?: any;
  skills?: any[];
}

export default function Skills(props: SkillsProps = {}) {
  const rawSkills = (Array.isArray(props.skills) && props.skills.length > 0)
    ? props.skills
    : ((Array.isArray(props.data?.skills) && props.data.skills.length > 0)
      ? props.data.skills
      : ((Array.isArray(props.data?.canonicalProfile?.skills) && props.data.canonicalProfile.skills.length > 0)
        ? props.data.canonicalProfile.skills
        : ((Array.isArray(props.data?.skillCategories) && props.data.skillCategories.length > 0)
          ? props.data.skillCategories
          : ((Array.isArray(props.data?.tools) && props.data.tools.length > 0)
            ? props.data.tools
            : ((Array.isArray(props.data?.techStack) && props.data.techStack.length > 0)
              ? props.data.techStack
              : defaultSkills)))));

  // Extract all individual skill names cleanly
  const allSkillsList: { name: string; percentage: number }[] = [];
  let preCategorized: SkillCategory[] = [];

  // Check if rawSkills is already categorized with distinct groups (e.g. [{ category: "Frontend", items: [...] }])
  if (
    Array.isArray(rawSkills) &&
    rawSkills.length > 0 &&
    typeof rawSkills[0] === "object" &&
    rawSkills[0] !== null &&
    ("category" in rawSkills[0] || "title" in rawSkills[0]) &&
    Array.isArray(rawSkills[0].items || rawSkills[0].skills) &&
    (rawSkills[0].items?.length > 1 || rawSkills[0].skills?.length > 1 || rawSkills.length <= 3)
  ) {
    preCategorized = rawSkills.map((cat: any) => ({
      category: cat.category || cat.title || "Skills",
      items: (cat.items || cat.skills || []).map((it: any) => ({
        name: typeof it === "string" ? it : (it.name || it.title || it.skill || ""),
        percentage: typeof it === "object" && typeof it.percentage === "number" ? it.percentage : 85
      })).filter((s: any) => s.name && s.name.trim())
    })).filter((c: any) => c.items.length > 0);
  }

  let categories: SkillCategory[] = [];

  if (preCategorized.length > 0 && preCategorized.some(c => c.items.length > 1)) {
    categories = preCategorized;
  } else {
    // Flatten all skills into a clean single list
    rawSkills.forEach((sk: any) => {
      if (typeof sk === "string" && sk.trim()) {
        allSkillsList.push({ name: sk.trim(), percentage: 85 });
      } else if (typeof sk === "object" && sk !== null) {
        if (Array.isArray(sk.items) && sk.items.length > 0) {
          sk.items.forEach((it: any) => {
            const n = typeof it === "string" ? it : (it.name || it.title || it.skill || "");
            if (n && n.trim()) allSkillsList.push({ name: n.trim(), percentage: it.percentage || 85 });
          });
        } else if (Array.isArray(sk.skills) && sk.skills.length > 0) {
          sk.skills.forEach((it: any) => {
            const n = typeof it === "string" ? it : (it.name || it.title || it.skill || "");
            if (n && n.trim()) allSkillsList.push({ name: n.trim(), percentage: it.percentage || 85 });
          });
        } else {
          const n = sk.name || sk.title || sk.skill || (typeof sk.category === "string" && !sk.name ? sk.category : "");
          if (n && n.trim()) {
            allSkillsList.push({
              name: n.trim(),
              percentage: typeof sk.percentage === "number" ? sk.percentage : (typeof sk.level === "number" ? sk.level : 85)
            });
          }
        }
      }
    });

    // Remove duplicates
    const seen = new Set<string>();
    const uniqueSkills = allSkillsList.filter((s) => {
      const lower = s.name.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

    if (uniqueSkills.length === 0) {
      return null;
    }

    if (uniqueSkills.length <= 6) {
      categories = [
        { category: "Core Expertise & Technical Skills", items: uniqueSkills }
      ];
    } else if (uniqueSkills.length <= 12) {
      const half = Math.ceil(uniqueSkills.length / 2);
      categories = [
        { category: "Core Languages & Frameworks", items: uniqueSkills.slice(0, half) },
        { category: "Tools, Libraries & Technologies", items: uniqueSkills.slice(half) }
      ];
    } else {
      const third = Math.ceil(uniqueSkills.length / 3);
      categories = [
        { category: "Languages & Frameworks", items: uniqueSkills.slice(0, third) },
        { category: "Tools & Libraries", items: uniqueSkills.slice(third, third * 2) },
        { category: "Competencies & Architecture", items: uniqueSkills.slice(third * 2) }
      ];
    }
  }

  if (categories.length === 0) {
    return null;
  }

  const totalSkillCount = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);

  return (
    <section
      id="skills"
      data-section="skills"
      data-cv-section="skills"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
          <div className="flex flex-col space-y-3">
            <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
              Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]">
              SKILLS & PROFICIENCY
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
          </div>

          {totalSkillCount > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/5 border border-[#111111]/10 text-xs font-bold text-[#111111]">
              <Layers className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>{totalSkillCount} Skills Listed</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category: SkillCategory, idx: number) => (
            <div
              key={category.category || idx}
              data-cv={`skills[${idx}]`}
              data-cv-item
              data-cv-index={idx}
              className="p-6 sm:p-7 bg-white border-2 border-[#111111]/10 rounded-md shadow-sm space-y-5 hover:border-[#FFC107] transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-[#111111]/10 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-[#111111]">
                    {category.category}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFC107]/20 text-[#111111]">
                    {category.items?.length || 0}
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-[#FFC107] group-hover:scale-110 transition-transform" />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(category.items || []).map((skill: any, sIdx: number) => {
                  const skillName = typeof skill === "string" ? skill : skill.name;
                  if (!skillName) return null;

                  return (
                    <div
                      key={skillName || sIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#FFC107]/20 border border-[#111111]/10 hover:border-[#FFC107] text-[#111111] rounded-sm text-xs font-bold tracking-wide transition-all duration-200"
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
