import React, { useState } from 'react';
import { Github, ExternalLink, Cpu, X, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { normalizeEngineeringData } from '../utils/normalizeData';
import SectionHeader from './SectionHeader';

export default function Projects({ data = {} }) {
  const norm = data?.profile ? data : normalizeEngineeringData(data);
  const { projects } = norm;
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Full Stack', 'Cloud & Distributed', 'AI & ML', 'Systems / DevOps'];

  const safeProjects = Array.isArray(projects) ? projects : [];
  const filteredProjects = activeCategory === 'All'
    ? safeProjects
    : safeProjects.filter((p) => p.category === activeCategory || p.tags?.includes(activeCategory));

  return (
    <section
      id="projects"
      data-node-id="section:projects:root:section:0"
      data-node-type="section"
      className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-cyber-lightBg wave-top-curve wave-bottom-curve relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyber-neonCyan/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <SectionHeader
          eyebrow="PORTFOLIO & OPEN SOURCE"
          title="Featured Architecture Projects"
          subtitle="Distributed telemetry daemons, resilient event brokers & AI infrastructure systems"
        />

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-cyan-pill text-cyber-950 shadow-cyan-glow scale-105'
                  : 'bg-white text-slate-700 hover:bg-cyber-50 hover:text-cyber-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stadium Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              data-node-id={`container:projects:card:${idx}`}
              data-node-type="container"
              data-cv={`projects.items[${idx}]`}
              className={`bg-white rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 shadow-soft-elevation border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-deep-float ${
                idx % 3 === 1 ? 'lg:translate-y-3' : ''
              }`}
            >
              <div>
                {/* Top Pill Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    data-node-id={`text:projects:category:${idx}:0`}
                    data-node-type="text"
                    className="px-3.5 py-1 rounded-full bg-cyber-100 text-cyber-800 text-[10px] sm:text-[11px] font-mono font-bold uppercase"
                  >
                    {project.category}
                  </span>

                  {project.featured && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyber-950 bg-cyber-brightCyan/30 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-cyber-600" /> Featured
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3
                  data-node-id={`text:projects:title:${idx}:0`}
                  data-node-type="text"
                  data-cv={`projects.items[${idx}].title`}
                  className="text-lg sm:text-2xl font-black font-display text-slate-950 leading-snug mb-2"
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  data-node-id={`text:projects:desc:${idx}:0`}
                  data-node-type="text"
                  data-cv={`projects.items[${idx}].description`}
                  className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4"
                >
                  {project.description}
                </p>

                {/* Production Metrics Pill */}
                {project.metrics && (
                  <div className="p-3 rounded-2xl bg-cyber-950 text-white font-mono text-[10px] sm:text-[11px] mb-4 flex items-center gap-2 shadow-inner">
                    <Cpu className="w-4 h-4 text-cyber-brightCyan shrink-0" />
                    <span
                      data-node-id={`text:projects:metrics:${idx}:0`}
                      data-node-type="text"
                      className="truncate"
                    >
                      {Array.isArray(project.metrics)
                        ? project.metrics.map(m => typeof m === 'object' ? `${m.label || ''}: ${m.value || ''}` : String(m)).join(' • ')
                        : (typeof project.metrics === 'object' ? Object.entries(project.metrics).map(([k, v]) => `${k}: ${v}`).join(' • ') : String(project.metrics))}
                    </span>
                  </div>
                )}

                {/* Tags */}
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] sm:text-[11px] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="px-3.5 sm:px-4 py-2 rounded-full bg-cyber-50 hover:bg-cyber-100 text-cyber-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Architecture Specs
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-colors"
                      title="View Source on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 bg-gradient-cyan-pill text-cyber-950 rounded-full shadow-cyan-glow hover:scale-105 transition-transform"
                      title="Live Deployment"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specs / Architecture Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[40px] max-w-2xl w-full p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyber-100 text-cyber-800 text-xs font-mono font-bold uppercase">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-950 mt-2">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Architecture Overview:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {selectedProject.longDescription}
                </p>
              </div>

              {Array.isArray(selectedProject.architecturePoints) && selectedProject.architecturePoints.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                    Core Technical Decisions:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {selectedProject.architecturePoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-cyber-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider"
              >
                Close Specs
              </button>
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-gradient-cyan-pill text-cyber-950 text-xs font-bold uppercase tracking-wider shadow-cyan-glow flex items-center gap-2"
                >
                  <span>View Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
