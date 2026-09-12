"use client";

import React from "react";
import { CheckCircle2, Sparkles, Layers } from "lucide-react";
import { SkillCategory } from "@/data/portfolio";

interface SkillsProps {
  data?: any;
  skills?: any[];
}

export default function Skills(props: SkillsProps = {}) {
  const rawSkillsCandidates = [
    props.skills,
    props.data?.skills,
    props.data?.skillCategories,
    props.data?.skillsList,
    props.data?.technicalSkills,
    props.data?.techStack,
    props.data?.profile?.skills,
    props.data?.personalInfo?.skills,
    props.data?.personal?.skills,
    props.data?.canonicalProfile?.skills,
    props.data?.canonicalProfile?.technicalSkills,
    props.data?.profile?.capabilities,
    props.data?.competencies,
    props.data?.expertise
  ];

  let rawSkills: any[] = [];
  for (const c of rawSkillsCandidates) {
    if (Array.isArray(c) && c.length > 0) {
      rawSkills = c;
      break;
    }
  }

  const isDemoSkill = (name: string) => {
    const s = String(name || '').toLowerCase();
    return s.includes('figma (auto-layout') || s.includes('adobe creative suite') || s.includes('prototyping & wireframing');
  };

  // Normalize categories locally if passed directly unnormalized
  let categories: SkillCategory[] = [];

  if (rawSkills.length > 0) {
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

      const hasRealSkills = categories.some(cat => cat.items.some(it => !isDemoSkill(it.name)));
      if (hasRealSkills) {
        categories = categories.map(cat => ({
          ...cat,
          items: cat.items.filter(it => !isDemoSkill(it.name))
        })).filter(cat => cat.items.length > 0);
      }
    } else {
      // Flat list
      const items: Array<{ name: string; percentage: number }> = rawSkills.map((sk: any) => {
        if (typeof sk === 'string') return { name: sk.trim(), percentage: 85 };
        return {
          name: (sk?.name || sk?.title || sk?.skill || String(sk)).trim(),
          percentage: typeof sk?.percentage === 'number' ? sk.percentage : (typeof sk?.level === 'number' ? sk.level : 85)
        };
      }).filter((it: any) => it.name.length > 0);

      const aiRegex = /\b(ai|artificial intelligence|ml|machine learning|data science|deep learning|nlp|natural language|computer vision|neural|neural network|pandas|numpy|scikit|sklearn|tensorflow|pytorch|keras|opencv|generative|llm|rag|analytics|statistics|data analysis|data analytics|matplotlib|seaborn|scipy|jupyter|hugging face|langchain|prompt engineering|transformers)\b/i;
      const frontendRegex = /\b(react|react\.js|reactjs|vue|vue\.js|angular|next|next\.js|nextjs|svelte|html|html5|css|css3|tailwind|tailwindcss|tailwind css|sass|scss|javascript|typescript|js|ts|ui|ux|ui\/ux|frontend|front-end|web|web development|responsive|bootstrap|figma|canvas|svg|three\.js|threejs|framer|framer motion|redux|zustand)\b/i;
      const backendRegex = /\b(node|node\.js|nodejs|express|express\.js|expressjs|nest|nestjs|python|django|flask|fastapi|java|spring|spring boot|go|golang|rust|c\+\+|cpp|c#|csharp|\.net|php|laravel|sql|mysql|postgres|postgresql|mongodb|redis|graphql|rest|rest api|rest apis|backend|back-end|server|database|databases|prisma|mongoose|nosql|dynamodb|firebase|supabase|sqlite)\b/i;
      const toolsRegex = /\b(git|github|gitlab|docker|kubernetes|k8s|aws|azure|gcp|google cloud|cloud|ci\/cd|cicd|linux|unix|webpack|vite|npm|yarn|pnpm|jira|agile|scrum|testing|jest|cypress|postman|nginx|bash|terminal|devops|vs code|vscode)\b/i;

      const aiGroup: Array<{ name: string; percentage: number }> = [];
      const frontendGroup: Array<{ name: string; percentage: number }> = [];
      const backendGroup: Array<{ name: string; percentage: number }> = [];
      const toolsGroup: Array<{ name: string; percentage: number }> = [];
      const otherGroup: Array<{ name: string; percentage: number }> = [];

      items.forEach(skill => {
        const name = skill.name.trim();
        if (!name) return;

        if (aiRegex.test(name)) {
          aiGroup.push(skill);
        } else if (frontendRegex.test(name)) {
          frontendGroup.push(skill);
        } else if (backendRegex.test(name)) {
          backendGroup.push(skill);
        } else if (toolsRegex.test(name)) {
          toolsGroup.push(skill);
        } else {
          otherGroup.push(skill);
        }
      });

      if (aiGroup.length > 0) {
        categories.push({ category: 'AI, Data Science & Machine Learning', items: aiGroup });
      }
      if (frontendGroup.length > 0) {
        categories.push({ category: 'Frontend & UI Engineering', items: frontendGroup });
      }
      if (backendGroup.length > 0) {
        categories.push({ category: 'Backend, Database & APIs', items: backendGroup });
      }
      if (toolsGroup.length > 0) {
        categories.push({ category: 'Tools, DevOps & Cloud', items: toolsGroup });
      }

      if (otherGroup.length > 0) {
        if (categories.length === 0) {
          categories.push({ category: 'Core Skills & Competencies', items: otherGroup });
        } else if (categories.length < 4) {
          categories.push({ category: 'Core Technologies & Tools', items: otherGroup });
        } else {
          let minCat = categories[0];
          for (const c of categories) {
            if (c.items.length < minCat.items.length) minCat = c;
          }
          minCat.items.push(...otherGroup);
        }
      }
    }
  }

  // If no skills exist, return null
  if (categories.length === 0) {
    return null;
  }

  const totalSkillCount = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const gridColsClass =
    categories.length === 1
      ? 'grid-cols-1 max-w-2xl mx-auto'
      : categories.length === 2
      ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
      : categories.length === 4
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

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

