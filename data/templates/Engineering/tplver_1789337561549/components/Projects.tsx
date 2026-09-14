'use client';

import React, { useState } from 'react';
import { Github, ExternalLink, Cpu, X, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '@/data/portfolioData';
import SectionHeader from './SectionHeader';

export default function Projects() {
  const { projects } = PORTFOLIO_DATA;
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Full Stack', 'Cloud & Distributed', 'AI & ML', 'Systems / DevOps'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-cyber-lightBg wave-top-curve wave-bottom-curve relative overflow-hidden">
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
              key={project.id}
              className={`bg-white rounded-[40px] sm:rounded-[56px] lg:rounded-[64px] p-6 sm:p-8 shadow-soft-elevation border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-deep-float ${
                idx % 3 === 1 ? 'lg:translate-y-3' : ''
              }`}
            >
              <div>
                {/* Top Pill Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-cyber-100 text-cyber-800 text-[10px] sm:text-[11px] font-mono font-bold uppercase">
                    {project.category}
                  </span>

                  {project.featured && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyber-950 bg-cyber-brightCyan/30 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-cyber-600" /> Featured
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="text-lg sm:text-2xl font-black font-display text-slate-950 leading-snug mb-2">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Production Metrics Pill */}
                <div className="p-3 rounded-2xl bg-cyber-950 text-white font-mono text-[10px] sm:text-[11px] mb-4 flex items-center gap-2 shadow-inner">
                  <Cpu className="w-4 h-4 text-cyber-brightCyan shrink-0" />
                  <span className="truncate">{project.metrics}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] sm:text-[11px] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-colors"
                    title="View Source on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 bg-gradient-cyan-pill text-cyber-950 rounded-full shadow-cyan-glow hover:scale-105 transition-all"
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

        {/* Architecture Specs Modal Drawer */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/80 backdrop-blur-md">
            <div className="bg-white rounded-[36px] sm:rounded-[48px] max-w-2xl w-full p-6 sm:p-8 border border-white/20 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="px-3.5 py-1 bg-cyber-100 text-cyber-800 rounded-full text-xs font-mono font-bold uppercase">
                {selectedProject.category}
              </span>
              <h3 className="text-xl sm:text-3xl font-black font-display text-slate-950 mt-2">
                {selectedProject.title}
              </h3>
              <p className="text-xs font-mono text-cyber-600 mt-1 font-bold">{selectedProject.metrics}</p>

              <div className="mt-5 sm:mt-6 space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
                <p>{selectedProject.longDescription}</p>

                <div className="p-4 sm:p-5 bg-cyber-950 text-white rounded-3xl border border-cyber-800">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-brightCyan font-bold mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Architectural Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.architecturePoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-mono text-cyber-100">
                        <CheckCircle2 className="w-4 h-4 text-cyber-brightCyan shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-6 py-2.5 bg-cyber-950 text-white text-xs font-bold uppercase rounded-full flex items-center gap-2 shadow-md hover:bg-cyber-900"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 sm:px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold uppercase rounded-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
