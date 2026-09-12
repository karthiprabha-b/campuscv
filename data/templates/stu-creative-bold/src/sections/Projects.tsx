"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpRight, Github, Globe, FolderGit2 } from "lucide-react";
import { ProjectItem } from "@/data/portfolio";

interface ProjectsProps {
  data?: any;
  projects?: ProjectItem[];
}

export default function Projects(props: ProjectsProps = {}) {
  const projectsList: ProjectItem[] = Array.isArray(props.projects) && props.projects.length > 0
    ? props.projects
    : (Array.isArray(props.data?.projects) && props.data.projects.length > 0
      ? props.data.projects
      : (Array.isArray(props.data?.portfolio) && props.data.portfolio.length > 0
        ? props.data.portfolio
        : []));

  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = useMemo<string[]>(() => {
    const rawCategories = projectsList.map((p: ProjectItem) => p.category).filter(Boolean);
    const unique = Array.from(new Set(rawCategories));
    if (unique.length <= 1) {
      return ["All", "Web", "Full Stack", "Mobile"];
    }
    return ["All", ...unique];
  }, [projectsList]);

  const filteredProjects = projectsList.filter((project: ProjectItem) => {
    if (activeFilter === "All") return true;
    return (project.category || "").toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <section
      id="projects"
      data-section="projects"
      data-node-id="section:projects:root:section:0"
      className="py-24 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-[#111111]/10 relative z-10 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex flex-col space-y-3">
            <span
              data-field="projects.subtitle"
              className="text-xs font-black tracking-widest text-[#FFC107] uppercase"
            >
              Portfolio
            </span>
            <h2
              data-field="projects.title"
              data-node-id="text:projects:root:h2:0"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wide leading-tight text-[#111111]"
            >
              FEATURED WORK
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mt-2" style={{ backgroundColor: "#FFC107" }} />
          </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project: ProjectItem, idx: number) => {
            const hasImage = Boolean(project.image && project.image.trim() !== '');

            return (
              <div
                key={project.title || idx}
                data-node-id={`container:projects:card:${idx}`}
                className="bg-white border-2 border-[#111111]/10 rounded-md overflow-hidden shadow-xs hover:border-[#FFC107] transition-colors duration-150 flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-800 border-b border-[#111111]/10 flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      data-field={`projects[${idx}].image`}
                      data-node-id={`image:projects:card:${idx}:image`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
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
                      data-field={`projects[${idx}].category`}
                      data-node-id={`text:projects:card:${idx}:category`}
                      className="absolute top-4 left-4 bg-[#111111] text-[#FAF9F6] text-[10px] font-black tracking-wider uppercase px-3 py-1.5 shadow-md rounded-sm"
                    >
                      {project.category}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      data-field={`projects[${idx}].title`}
                      data-node-id={`text:projects:card:${idx}:title`}
                      className="text-xl sm:text-2xl font-black tracking-tight text-[#111111]"
                    >
                      {project.title}
                    </h3>

                    <p
                      data-field={`projects[${idx}].description`}
                      data-node-id={`text:projects:card:${idx}:description`}
                      className="text-xs sm:text-sm text-[#666666] leading-relaxed mt-2 mb-6"
                    >
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#111111]/10">
                    <div className="flex flex-wrap gap-2">
                      {(project.techStack || (project as any).tags || []).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-[#111111]/5 text-[#111111] text-[11px] font-bold tracking-wide rounded-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-node-id={`button:projects:card:${idx}:github`}
                          data-node-type="button"
                          className="p-2 border border-[#111111]/20 hover:border-[#FFC107] hover:bg-[#FFC107] hover:text-[#111111] text-[#111111] rounded-full transition-colors cursor-pointer select-none"
                          aria-label="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          data-field={`projects[${idx}].liveUrl`}
                          data-node-id={`button:projects:card:${idx}:live`}
                          data-node-type="button"
                          className="inline-flex items-center px-3.5 py-1.5 bg-[#111111] text-[#FAF9F6] text-xs font-black tracking-wider uppercase hover:bg-[#FFC107] hover:text-[#111111] transition-colors rounded-xs shadow-xs cursor-pointer select-none"
                        >
                          <span>Explore</span>
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1 stroke-[3]" />
                        </a>
                      )}
                    </div>
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

