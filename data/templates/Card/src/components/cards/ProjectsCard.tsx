'use client';

import React, { useState, useMemo } from 'react';
import { useTheme } from '../ThemeContext';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Search,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "NovaCloud — Edge Computing Engine",
    subtitle: "Global serverless execution platform with sub-15ms edge compute",
    description: "A distributed runtime engine enabling edge developers to deploy stateless micro-functions with zero cold starts, automatic regional replication, and real-time telemetry streaming.",
    fullDescription: "NovaCloud was developed to solve edge compute tail latency. It combines WebAssembly execution sandboxes with Anycast routing and distributed KV stores to guarantee deterministic sub-15ms execution worldwide. Built using Next.js 14, Rust (Wasm core), and Node.js.",
    category: "Cloud & Distributed",
    featured: true,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tags: ["Next.js", "TypeScript", "Rust", "WebAssembly", "Docker", "Tailwind CSS"],
    liveUrl: "https://example.com/novacloud",
    githubUrl: "https://github.com/example/novacloud",
    metrics: [
      { label: "P99 Latency", value: "<15ms" },
      { label: "Edge Nodes", value: "240+" },
      { label: "Throughput", value: "1.2M req/s" }
    ],
    architecture: ["Wasm Sandboxes", "Anycast BGP Routing", "Distributed Raft Consensus"],
    year: "2024"
  },
  {
    id: "proj-2",
    title: "Synthetix AI — Multi-Agent Studio",
    subtitle: "Autonomous LLM workflow orchestrator and visual canvas",
    description: "An intuitive infinite canvas for designing, testing, and deploying recursive multi-agent AI pipelines with real-time memory streaming, tool calling, and human-in-the-loop approvals.",
    fullDescription: "Synthetix AI powers autonomous enterprise workflows. Featuring a WebGL node graph, custom vector memory retrieval, and native Python sandbox execution.",
    category: "AI & Machine Learning",
    featured: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "TypeScript", "Python", "LangChain", "FastAPI", "Pinecone", "Tailwind CSS"],
    liveUrl: "https://example.com/synthetix",
    githubUrl: "https://github.com/example/synthetix",
    metrics: [
      { label: "Agents Run", value: "4.8M" },
      { label: "Avg Execution", value: "1.4s" },
      { label: "User Rating", value: "4.9/5" }
    ],
    architecture: ["Dynamic DAG Execution", "Hybrid Vector & Keyword Indexing", "Streaming Token Engine"],
    year: "2023"
  },
  {
    id: "proj-3",
    title: "HyperFlow — Real-Time Data Pipeline",
    subtitle: "High-throughput stream processing with instant analytics dashboards",
    description: "Event-driven data processing pipeline consuming Kafka topics and streaming real-time aggregated metrics directly to 60fps WebSockets client dashboards.",
    fullDescription: "HyperFlow processes up to 800,000 events per second with zero data loss, offering interactive charting, dynamic metric alerts, and automated database sharding.",
    category: "Full-Stack",
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["TypeScript", "Apache Kafka", "ClickHouse", "Go", "Next.js", "Redis"],
    liveUrl: "https://example.com/hyperflow",
    githubUrl: "https://github.com/example/hyperflow",
    metrics: [
      { label: "Event Volume", value: "800k/s" },
      { label: "Query Time", value: "18ms" }
    ],
    architecture: ["Columnar Storage Engine", "WebSocket Multiplexing"],
    year: "2023"
  }
];

interface ProjectsCardProps {
  data?: any;
  onSelectProject: (project: any) => void;
}

export const ProjectsCard: React.FC<ProjectsCardProps> = React.memo(({ data, onSelectProject }) => {
  const contentOverrides = data?.contentOverrides || {};
  const styleOverrides = data?.styleOverrides || {};
  const rawProjects = data?.projects || data?.portfolioProjects;
  const projectList = Array.isArray(rawProjects) && rawProjects.length > 0 ? rawProjects : DEFAULT_PROJECTS;
  const { accentClass } = useTheme();

  const title =
    contentOverrides['text:portfolio:root:div:title']?.value ||
    contentOverrides['text:projects:root:div:title']?.value ||
    data?.projectsTitle ||
    'Featured Projects';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    projectList.forEach((p: any) => {
      if (p?.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projectList]);

  const filteredProjects = useMemo(() => {
    return projectList.filter((proj: any) => {
      const matchesCategory = activeCategory === 'All' || proj?.category === activeCategory;
      const tags = Array.isArray(proj?.tags) ? proj.tags : (Array.isArray(proj?.technologies) ? proj.technologies : []);
      const title = proj?.title || '';
      const desc = proj?.description || proj?.tagline || '';
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tags.some((t: any) => (typeof t === 'string' ? t : (t?.name || '')).toLowerCase().includes(searchQuery.toLowerCase())) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [projectList, activeCategory, searchQuery]);

  return (
    <div 
      data-section="projects" 
      data-cv-section="projects" 
      className="relative w-full h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden"
      style={styleOverrides['section:projects:root:section:0']}
    >
      {/* Background Accent Glow */}
      <div 
        className={`absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${accentClass.glow} pointer-events-none`}
        style={{ transform: 'translate3d(0,0,0)', contain: 'paint' }}
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-2xl bg-white/[0.05] border border-white/10 ${accentClass.text}`}>
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Card 05 / 08</div>
            <h2 
              data-node-id="text:portfolio:root:div:title"
              data-node-type="text"
              data-cv="projects.title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight"
            >
              {title}
            </h2>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5 mb-4 max-w-full overflow-x-auto no-scrollbar">
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
              activeCategory === cat
                ? `bg-white/20 text-white border border-white/25 shadow-sm`
                : `bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.07] border border-transparent`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto" data-cv-section="projects" data-cv-collection="projects.items">
        {filteredProjects.slice(0, 4).map((proj: any, idx: number) => {
          const tags = Array.isArray(proj.tags) ? proj.tags : (Array.isArray((proj as any).technologies) ? (proj as any).technologies : []);
          const image = proj.image || (proj as any).thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
          const projTitle = proj.title || 'Project Name';
          const projDesc = proj.tagline || proj.description || 'Project description';

          return (
            <div
              key={proj.id || idx}
              data-cv={`projects.items[${idx}]`}
              data-cv-item="project"
              data-cv-index={idx}
              className="group relative rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-zinc-900">
                <img
                  src={image}
                  alt={projTitle}
                  data-node-id={`image:portfolio:items:${idx}:image`}
                  data-node-type="image"
                  data-cv={`projects.items[${idx}].image`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {proj.category && (
                    <span 
                      data-node-id={`text:portfolio:items:${idx}:category`}
                      data-node-type="text"
                      data-cv={`projects.items[${idx}].category`}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold uppercase ${accentClass.badge}`}
                    >
                      {proj.category}
                    </span>
                  )}
                  {proj.featured && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-medium">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white transition-colors flex items-center justify-between">
                    <span 
                      data-node-id={`text:portfolio:items:${idx}:title`}
                      data-node-type="text"
                      data-cv={`projects.items[${idx}].title`}
                      className="cursor-text"
                    >
                      {projTitle}
                    </span>
                    {proj.year && (
                      <span 
                        data-node-id={`text:portfolio:items:${idx}:year`}
                        data-node-type="text"
                        data-cv={`projects.items[${idx}].year`}
                        className="text-xs font-mono text-zinc-500"
                      >
                        {proj.year}
                      </span>
                    )}
                  </h3>
                  <p 
                    data-node-id={`text:portfolio:items:${idx}:desc`}
                    data-node-type="text"
                    data-cv={`projects.items[${idx}].description`}
                    className="text-xs text-zinc-400 line-clamp-1 mt-0.5 cursor-text"
                  >
                    {projDesc}
                  </p>
                </div>

                {/* Tech Stack Pills */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag: any, tIdx: number) => (
                      <span
                        key={tIdx}
                        data-node-id={`text:portfolio:items:${idx}:tech:${tIdx}`}
                        data-node-type="text"
                        data-cv={`projects.items[${idx}].technologies[${tIdx}]`}
                        className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-[10px] font-mono text-zinc-300"
                      >
                        {typeof tag === 'string' ? tag : (tag.name || String(tag))}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    onClick={() => onSelectProject(proj)}
                    data-node-id={`button:projects:items:${idx}:details`}
                    data-node-type="button"
                    className="text-xs font-semibold text-white flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3 h-3 pointer-events-none" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-node-id={`button:projects:items:${idx}:github`}
                        data-node-type="button"
                        data-cv={`projects.items[${idx}].githubUrl`}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5 pointer-events-none" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-node-id={`button:projects:items:${idx}:live`}
                        data-node-type="button"
                        data-cv={`projects.items[${idx}].liveUrl`}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5 pointer-events-none" />
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
  );
});

ProjectsCard.displayName = 'ProjectsCard';
