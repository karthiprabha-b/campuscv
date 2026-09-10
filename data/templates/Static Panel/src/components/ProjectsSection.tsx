"use client";

import React, { useState } from "react";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "AuraDB Distributed Engine",
    category: "systems",
    categoryLabel: "Systems & Cloud",
    shortDesc: "High-throughput distributed key-value storage engine featuring Raft consensus and LSM-tree persistence.",
    fullDesc: "Designed and implemented a distributed key-value storage engine in Go and Rust from scratch. Employs a custom Raft consensus algorithm for active replication, monotonic read consistency, and sub-millisecond tail latency under heavy node churn.",
    highlights: [
      "Custom Raft consensus with log compaction and dynamic peer rebalancing",
      "Memory-mapped LSM-tree storage engine with bloom filter query acceleration",
      "Achieved 140,000 writes/sec benchmark throughput on a 5-node cluster"
    ],
    techStack: ["Go", "Rust", "gRPC", "Raft", "Docker", "Prometheus"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: "proj-2",
    title: "OmniSearch Multi-Modal RAG",
    category: "ai",
    categoryLabel: "AI & Machine Learning",
    shortDesc: "Generative AI workspace intelligence engine with hybrid vector-lexical search and cross-document reasoning.",
    fullDesc: "Production-grade multi-modal retrieval system built with Next.js, FastAPI, and Qdrant vector database. Ingests PDFs, engineering docs, and video transcripts into localized embeddings with re-ranking pipelines.",
    highlights: [
      "Hybrid vector + sparse BM25 retrieval with Cohere neural reranking",
      "Streaming token responses with citation linking down to exact bounding boxes",
      "Serving 5,000+ monthly active queries with sub-300ms time-to-first-token"
    ],
    techStack: ["Python", "FastAPI", "Next.js", "TypeScript", "Qdrant", "OpenAI"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  }
];

interface ProjectsSectionProps {
  data?: any;
  onSelectProject: (project: any) => void;
}

export default function ProjectsSection({ data = {}, onSelectProject }: ProjectsSectionProps) {
  // If user explicitly provided an empty array, return null
  if (Array.isArray(data?.projects) && data.projects.length === 0) {
    return null;
  }

  const rawProjects = (Array.isArray(data?.projects) && data.projects.length > 0)
    ? data.projects
    : ((Array.isArray(data?.portfolioProjects) && data.portfolioProjects.length > 0)
        ? data.portfolioProjects
        : ((Array.isArray(data?.works) && data.works.length > 0)
            ? data.works
            : DEFAULT_PROJECTS));

  const projects = rawProjects.map((p: any, idx: number) => {
    const title = p.title || p.name || p.projectTitle || `Project ${idx + 1}`;
    const shortDesc = p.shortDesc || p.shortDescription || p.description || p.desc || p.summary || "";
    const fullDesc = p.fullDesc || p.longDescription || p.details || p.description || shortDesc;
    
    // Category normalization
    let category = (p.category || p.tag || "general").toLowerCase();
    let categoryLabel = p.categoryLabel || p.categoryName;
    if (!categoryLabel) {
      if (category.includes("ai") || category.includes("ml") || category.includes("data")) {
        category = "ai";
        categoryLabel = "AI & Machine Learning";
      } else if (category.includes("web") || category.includes("full") || category.includes("stack") || category.includes("app")) {
        category = "fullstack";
        categoryLabel = "Full-Stack Web";
      } else if (category.includes("cloud") || category.includes("sys") || category.includes("devops") || category.includes("arch")) {
        category = "systems";
        categoryLabel = "Systems & Cloud";
      } else {
        categoryLabel = p.category || "Engineering";
      }
    }

    const techStack = Array.isArray(p.techStack) && p.techStack.length > 0
      ? p.techStack
      : (Array.isArray(p.technologies) && p.technologies.length > 0
          ? p.technologies
          : (Array.isArray(p.tags) && p.tags.length > 0
              ? p.tags
              : (Array.isArray(p.skills) && p.skills.length > 0 ? p.skills : [])));

    const highlights = Array.isArray(p.highlights) && p.highlights.length > 0
      ? p.highlights
      : (Array.isArray(p.bullets) && p.bullets.length > 0
          ? p.bullets
          : (Array.isArray(p.features) && p.features.length > 0
              ? p.features
              : (shortDesc ? [shortDesc] : [])));

    const rawImageOverride = data?.imageOverrides?.[`projects.${idx}.image`] ||
      data?.contentOverrides?.[`image:project:${idx}:img:0`]?.src ||
      (typeof data?.contentOverrides?.[`image:project:${idx}:img:0`] === 'string' ? data?.contentOverrides?.[`image:project:${idx}:img:0`] : null);

    const image = rawImageOverride ||
      p.image ||
      p.imageUrl ||
      p.thumbnail ||
      p.coverImage ||
      p.photo ||
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";

    const githubUrl = p.githubUrl || p.github || p.sourceUrl || p.codeUrl || p.repo || "";
    const liveUrl = p.liveUrl || p.live || p.demoUrl || p.url || p.link || "";

    return {
      id: p.id || `proj-${idx}`,
      idx,
      title,
      category,
      categoryLabel,
      shortDesc,
      fullDesc,
      highlights,
      techStack,
      image,
      githubUrl,
      liveUrl
    };
  });

  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Dynamic filter tabs
  const availableCategories = Array.from(new Set(projects.map((p: any) => p.category)));
  const filterTabs = [
    { id: "all", label: "All Projects" },
    ...availableCategories.map((catId: any) => {
      const match = projects.find((p: any) => p.category === catId);
      return {
        id: catId,
        label: match?.categoryLabel || (String(catId).charAt(0).toUpperCase() + String(catId).slice(1))
      };
    })
  ];

  const filteredProjects = projects.filter((project: any) => {
    return activeFilter === "all" || project.category === activeFilter;
  });

  if (projects.length === 0) return null;

  return (
    <section id="projects" data-cv-section="projects" data-node-id="section:projects:root:section:0" className="py-12 sm:py-16 border-b border-gray-200 scroll-mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2" data-cv="projects.eyebrow">
            Featured Projects
          </h2>
          <p className="text-base text-gray-600" data-cv="projects.description">
            Production platforms, system architectures, and engineering builds.
          </p>
        </div>

        {/* Filter Pills if multiple categories */}
        {filterTabs.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-gray-100 rounded-xl self-start">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-cv-collection="projects">
        {filteredProjects.map((project: any) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            data-cv-item={`projects[${project.idx}]`}
            className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-52 sm:h-56 w-full bg-gray-100 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-cv={`projects.${project.idx}.image`}
                  data-node-id={`image:project:${project.idx}:img:0`}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-gray-800 border border-gray-200/80 shadow-xs">
                  {project.categoryLabel}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h3 
                    className="font-extrabold text-gray-900 text-lg group-hover:text-brand-600 transition-colors"
                    data-cv={`projects.${project.idx}.title`}
                  >
                    {project.title}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors flex-shrink-0" />
                </div>
                <p 
                  className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-5"
                  data-cv={`projects.${project.idx}.description`}
                >
                  {project.shortDesc}
                </p>

                {/* Tech chips */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="text-xs font-semibold px-3 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-gray-500">Click to view details</span>
              <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
