"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpRight, Github, Globe, FolderGit2 } from "lucide-react";
import { ProjectItem } from "@/data/portfolio";

interface ProjectsProps {
  data?: any;
  projects?: any[];
}

export default function Projects(props: ProjectsProps = {}) {
  const candidateList = useMemo(() => {
    const rawList = (Array.isArray(props.projects) && props.projects.length > 0)
      ? props.projects
      : (Array.isArray(props.data?.projects) && props.data.projects.length > 0)
        ? props.data.projects
        : (Array.isArray(props.data?.canonicalProfile?.projects) && props.data.canonicalProfile.projects.length > 0)
          ? props.data.canonicalProfile.projects
          : (Array.isArray(props.data?.portfolioProjects) && props.data.portfolioProjects.length > 0)
            ? props.data.portfolioProjects
            : (Array.isArray(props.data?.portfolio) && props.data.portfolio.length > 0)
              ? props.data.portfolio
              : (Array.isArray(props.data?.works) && props.data.works.length > 0)
                ? props.data.works
                : (Array.isArray(props.data?.resume?.projects) && props.data.resume.projects.length > 0)
                  ? props.data.resume.projects
                  : [];

    if (!Array.isArray(rawList) || rawList.length === 0) return [];
    const isDemoProj = (p: any) => {
      const t = (p.title || p.name || '').toLowerCase();
      return t.includes('fintech dashboard ui') || t.includes('travel landing page') || t.includes('ai saas analytics platform') || t.includes('minimalist e-commerce');
    };
    const hasReal = rawList.some((p: any) => !isDemoProj(p));
    return hasReal ? rawList.filter((p: any) => !isDemoProj(p)) : rawList;
  }, [props.projects, props.data]);

  const projectsList: ProjectItem[] = useMemo(() => {
    return candidateList.map((p: any) => {
      const tags = Array.isArray(p.techStack) ? p.techStack : (Array.isArray(p.technologies) ? p.technologies : (Array.isArray(p.tags) ? p.tags : []));
      return {
        title: p.title || p.name || "Featured Project",
        category: p.category || p.subtitle || p.type || "Design & Development",
        description: p.description || p.summary || p.shortDesc || "",
        image: p.image || p.imageUrl || p.thumbnail || p.cover || "",
        techStack: tags,
        liveUrl: p.liveUrl || p.link || p.live || p.demo || p.url || "",
        githubUrl: p.githubUrl || p.github || p.repo || ""
      };
    });
  }, [candidateList]);

  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = useMemo<string[]>(() => {
    const rawCategories = projectsList.map((p: ProjectItem) => p.category).filter(Boolean);
    const unique = Array.from(new Set(rawCategories));
    if (unique.length <= 1) {
      return ["All"];
    }
    return ["All", ...unique];
  }, [projectsList]);

  const filteredProjects = useMemo(() => {
    return projectsList.filter((project: ProjectItem) => {
      if (activeFilter === "All") return true;
      return (project.category || "").toLowerCase().includes(activeFilter.toLowerCase());
    });
  }, [projectsList, activeFilter]);

  if (!projectsList || projectsList.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      data-section="projects"
      data-cv-section="projects"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex flex-col space-y-3">
            <span className="text-xs font-black tracking-widest text-[#FFC107] uppercase">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]">
              FEATURED WORK
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
          </div>

          {filters.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter: string) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-xs sm:text-sm font-black tracking-wider uppercase border-2 rounded-sm cursor-pointer transition-colors duration-200 ${
                    activeFilter === filter
                      ? "bg-[#FFC107] text-[#111111] border-[#FFC107] shadow-sm"
                      : "border-[#111111]/20 hover:border-[#FFC107] text-[#111111] bg-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project: ProjectItem, idx: number) => {
            const hasImage = Boolean(project.image && project.image.trim() !== "");

            return (
              <div
                key={project.title || idx}
                data-cv={`projects[${idx}]`}
                data-cv-item
                data-cv-index={idx}
                className="bg-white border-2 border-[#111111]/10 rounded-md overflow-hidden shadow-sm hover:shadow-xl hover:border-[#FFC107] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-800 border-b border-[#111111]/10 flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 space-y-2 p-6 text-center">
                      <FolderGit2 className="w-12 h-12 text-[#FFC107]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{project.title}</span>
                    </div>
                  )}
                  
                  {project.category && (
                    <span
                      className="absolute top-4 left-4 bg-[#111111] text-[#FAF9F6] text-[10px] font-black tracking-wider uppercase px-3 py-1.5 shadow-md rounded-sm"
                    >
                      {project.category}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-[#111111]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-[#FFC107] text-[#111111] rounded-full hover:scale-110 transition-transform shadow-lg"
                        aria-label="Live Demo"
                      >
                        <Globe className="w-5 h-5 stroke-[2.5]" />
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white text-[#111111] rounded-full hover:scale-110 transition-transform shadow-lg"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-5 h-5 stroke-[2.5]" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#111111]">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mt-2 mb-6">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#111111]/10">
                    <div className="flex flex-wrap gap-2">
                      {(project.techStack || []).map((tag: string, tIdx: number) => (
                        <span
                          key={tag || tIdx}
                          className="px-2.5 py-1 bg-[#111111]/5 text-[#111111] text-[11px] font-bold tracking-wide rounded-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-black tracking-wider uppercase text-[#111111] hover:text-[#FFC107] transition-colors"
                      >
                        <span>Explore</span>
                        <ArrowUpRight className="w-4 h-4 ml-1 stroke-[3]" />
                      </a>
                    )}
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
