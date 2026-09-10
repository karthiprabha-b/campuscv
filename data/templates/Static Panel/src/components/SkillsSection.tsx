"use client";

import React from "react";
import { Cpu, Terminal, Code2, Layers, Cloud, Database } from "lucide-react";

const DEFAULT_CATEGORIES = [
  {
    title: "Core Languages & Systems",
    items: [
      { name: "TypeScript", tag: "Expert" },
      { name: "Go / Golang", tag: "Advanced" },
      { name: "Python", tag: "Advanced" },
      { name: "C / C++", tag: "Proficient" },
      { name: "SQL", tag: "Advanced" }
    ]
  },
  {
    title: "Full-Stack Web & Frontend",
    items: [
      { name: "React 19", tag: "Expert" },
      { name: "Next.js (App Router)", tag: "Expert" },
      { name: "Tailwind CSS", tag: "Expert" },
      { name: "Node.js / Express", tag: "Advanced" },
      { name: "GraphQL & REST", tag: "Proficient" }
    ]
  },
  {
    title: "Cloud, AI & Infrastructure",
    items: [
      { name: "AWS (ECS, Lambda, S3)", tag: "Certified" },
      { name: "Docker & Containers", tag: "Advanced" },
      { name: "PyTorch & Transformers", tag: "Proficient" },
      { name: "Kafka & Redis", tag: "Advanced" },
      { name: "PostgreSQL & Qdrant", tag: "Proficient" }
    ]
  }
];

const DEFAULT_TOOLS = [
  "Git & GitHub Actions", "VS Code", "Postman", "Terraform", "Linux (Ubuntu)", "Figma", "Grafana", "Vercel", "Turborepo"
];

const LANGUAGE_KEYWORDS = ["python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "golang", "rust", "ruby", "php", "dart", "kotlin", "swift", "sql", "html", "html5", "css", "css3", "r", "scala", "bash", "shell"];
const FRONTEND_KEYWORDS = ["react", "next.js", "nextjs", "vue", "vue.js", "angular", "svelte", "tailwind", "tailwind css", "bootstrap", "vite", "flutter", "react native", "redux", "sass", "scss", "ui/ux", "figma", "material ui", "chakra", "jquery", "web", "frontend"];
const BACKEND_KEYWORDS = ["node.js", "nodejs", "express", "express.js", "flask", "django", "fastapi", "spring", "spring boot", "rest apis", "rest", "restful", "graphql", "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "aws", "docker", "kubernetes", "gcp", "azure", "firebase", "supabase", "kafka", "microservices", "backend", "cloud"];

function categorizeFlatSkills(skillItems: Array<{ name: string; tag?: string }>) {
  if (skillItems.length <= 5) {
    return [{ title: "Core Skills & Technologies", items: skillItems }];
  }

  const langGroup: Array<{ name: string; tag?: string }> = [];
  const frontGroup: Array<{ name: string; tag?: string }> = [];
  const backGroup: Array<{ name: string; tag?: string }> = [];
  const remaining: Array<{ name: string; tag?: string }> = [];

  skillItems.forEach(item => {
    const lower = item.name.toLowerCase().trim();
    if (LANGUAGE_KEYWORDS.some(k => lower === k || lower.startsWith(k + " ") || lower.endsWith(" " + k))) {
      langGroup.push(item);
    } else if (FRONTEND_KEYWORDS.some(k => lower === k || lower.startsWith(k + " ") || lower.endsWith(" " + k))) {
      frontGroup.push(item);
    } else if (BACKEND_KEYWORDS.some(k => lower === k || lower.startsWith(k + " ") || lower.endsWith(" " + k))) {
      backGroup.push(item);
    } else {
      remaining.push(item);
    }
  });

  // Distribute unclassified skills evenly
  remaining.forEach((item, idx) => {
    const minLen = Math.min(langGroup.length, frontGroup.length, backGroup.length);
    if (langGroup.length === minLen) langGroup.push(item);
    else if (frontGroup.length === minLen) frontGroup.push(item);
    else backGroup.push(item);
  });

  const categories: Array<{ title: string; items: Array<{ name: string; tag?: string }> }> = [];
  if (langGroup.length > 0) {
    categories.push({ title: "Languages & Core Systems", items: langGroup });
  }
  if (frontGroup.length > 0) {
    categories.push({ title: "Frontend & UI Engineering", items: frontGroup });
  }
  if (backGroup.length > 0) {
    categories.push({ title: "Backend, Cloud & Databases", items: backGroup });
  }

  // If still single group or unbalanced chunks, divide into 3 even slices
  if (categories.length === 1 && skillItems.length > 6) {
    const third = Math.ceil(skillItems.length / 3);
    return [
      { title: "Languages & Frameworks", items: skillItems.slice(0, third) },
      { title: "Web & UI Technologies", items: skillItems.slice(third, third * 2) },
      { title: "Backend, Tools & Cloud", items: skillItems.slice(third * 2) }
    ].filter(c => c.items.length > 0);
  }

  return categories.length > 0 ? categories : [{ title: "Technical Skills", items: skillItems }];
}

interface SkillsSectionProps {
  data?: any;
}

export default function SkillsSection({ data = {} }: SkillsSectionProps) {
  // If user explicitly provided an empty array, return null
  if (Array.isArray(data?.skills) && data.skills.length === 0 && (!data?.tools || data.tools.length === 0)) {
    return null;
  }

  const getCategoryIcon = (idx: number) => {
    switch (idx % 4) {
      case 0:
        return <Code2 className="w-5 h-5 text-brand-600" />;
      case 1:
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 2:
        return <Database className="w-5 h-5 text-emerald-600" />;
      default:
        return <Cloud className="w-5 h-5 text-purple-600" />;
    }
  };

  // Normalize categories and skills
  let categories: Array<{ title: string; items: Array<{ name: string; tag?: string }> }> = [];

  if (data?.skills?.categories && Array.isArray(data.skills.categories) && data.skills.categories.length > 1) {
    categories = data.skills.categories;
  } else if (Array.isArray(data?.skillCategories) && data.skillCategories.length > 1) {
    categories = data.skillCategories.map((sc: any) => ({
      title: sc.title || sc.name || sc.category || "Skill Group",
      items: (Array.isArray(sc.items) ? sc.items : (Array.isArray(sc.skills) ? sc.skills : [])).map((item: any) => {
        if (typeof item === "string") return { name: item };
        return { name: item.name || item.title || item.skill || "", tag: item.tag || item.level };
      })
    }));
  } else if (Array.isArray(data?.skills) && data.skills.length > 0) {
    if (typeof data.skills[0] === 'object' && (data.skills[0].title || data.skills[0].category) && (data.skills[0].items || data.skills[0].skills) && data.skills.length > 1) {
      categories = data.skills.map((sc: any) => ({
        title: sc.title || sc.category || sc.name || "Technical Skills",
        items: (Array.isArray(sc.items) ? sc.items : (Array.isArray(sc.skills) ? sc.skills : [])).map((item: any) => {
          if (typeof item === "string") return { name: item };
          return { name: item.name || item.title || item.skill || "", tag: item.tag || item.level };
        })
      }));
    } else {
      // Flatten skills and categorize smartly into balanced 3 columns
      const flatItems = data.skills.flatMap((s: any) => {
        if (typeof s === 'string') return [{ name: s }];
        if (typeof s === 'object' && s !== null) {
          if (Array.isArray(s.items)) return s.items.map((i: any) => typeof i === 'string' ? { name: i } : { name: i.name || i.title || "", tag: i.tag || i.level });
          if (Array.isArray(s.skills)) return s.skills.map((i: any) => typeof i === 'string' ? { name: i } : { name: i.name || i.title || "", tag: i.tag || i.level });
          return [{ name: s.name || s.title || s.skill || "", tag: s.level || s.category }];
        }
        return [];
      }).filter((s: any) => s.name);

      categories = categorizeFlatSkills(flatItems);
    }
  } else if (data?.skills && typeof data.skills === 'object' && !Array.isArray(data.skills)) {
    const entries = Object.entries(data.skills);
    if (entries.length > 1) {
      categories = entries.map(([key, val]) => ({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        items: Array.isArray(val)
          ? val.map((item: any) => (typeof item === 'string' ? { name: item } : { name: item.name || "", tag: item.level }))
          : [{ name: String(val) }]
      }));
    } else if (entries.length === 1) {
      const val = entries[0][1];
      const flatItems = Array.isArray(val)
        ? val.map((item: any) => (typeof item === 'string' ? { name: item } : { name: item.name || "", tag: item.level }))
        : [{ name: String(val) }];
      categories = categorizeFlatSkills(flatItems);
    }
  }

  if (categories.length === 0 && (!data?.tools || data.tools.length === 0)) {
    categories = DEFAULT_CATEGORIES;
  }

  // Developer tools / toolchain
  let tools: string[] = [];
  if (Array.isArray(data?.tools) && data.tools.length > 0) {
    tools = data.tools.map((t: any) => typeof t === 'string' ? t : t.name || t.title);
  } else if (Array.isArray(data?.developerTools) && data.developerTools.length > 0) {
    tools = data.developerTools.map((t: any) => typeof t === 'string' ? t : t.name || t.title);
  } else if (Array.isArray(data?.skills?.tools) && data.skills.tools.length > 0) {
    tools = data.skills.tools;
  } else if (categories === DEFAULT_CATEGORIES) {
    tools = DEFAULT_TOOLS;
  }

  if (categories.length === 0 && tools.length === 0) {
    return null;
  }

  return (
    <section 
      id="skills" 
      data-cv-section="skills" 
      data-node-id="section:skills:root:section:0"
      className="py-12 sm:py-16 border-b border-gray-200 scroll-mt-8"
    >
      <div className="mb-8">
        <h2 
          className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2" 
          data-cv="skills.eyebrow"
          data-node-id="text:skills:eyebrow:0"
        >
          Technical Skills & Stack
        </h2>
        <p 
          className="text-base text-gray-600" 
          data-cv="skills.description"
          data-node-id="text:skills:description:0"
        >
          Languages, frameworks, cloud infrastructure, and core engineering toolchains.
        </p>
      </div>

      {/* Skills Categories Grid */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8" data-cv-collection="skills">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              data-cv-item={`skills[${idx}]`}
              className="p-6 sm:p-7 rounded-2xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-md transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center flex-shrink-0">
                    {getCategoryIcon(idx)}
                  </div>
                  <h3 
                    className="font-extrabold text-gray-900 text-base" 
                    data-cv={`skills.${idx}.category`}
                    data-node-id={`text:skills:${idx}:category:0`}
                  >
                    {cat.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {cat.items.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50/90 hover:bg-brand-50/70 border border-gray-200/80 hover:border-brand-300 text-xs sm:text-sm font-semibold text-gray-800 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                      <span>{skill.name}</span>
                      {skill.tag && (
                        <span className="text-[11px] font-semibold text-gray-400">
                          • {skill.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Developer Toolchain Ecosystem */}
      {tools && tools.length > 0 && (
        <div className="p-6 sm:p-7 rounded-2xl border border-gray-200 bg-gray-50/80">
          <div className="flex items-center gap-2.5 mb-4">
            <Terminal className="w-5 h-5 text-gray-600" />
            <h4 
              className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider"
              data-cv="skills.toolsHeading"
              data-node-id="text:skills:tools:0"
            >
              Developer Toolchain & Ecosystem
            </h4>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {tools.map((tool, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 shadow-2xs hover:border-gray-300 transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
