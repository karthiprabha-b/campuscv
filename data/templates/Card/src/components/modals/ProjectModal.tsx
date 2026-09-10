'use client';

import React, { useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  BarChart3
} from 'lucide-react';

interface ProjectModalProps {
  project: any | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = React.memo(({ project, onClose }) => {
  const { accentClass } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const metrics = Array.isArray(project.metrics) ? project.metrics : [];
  const features = Array.isArray(project.features)
    ? project.features
    : (Array.isArray(project.architecture) ? project.architecture : []);
  const tags = Array.isArray(project.tags)
    ? project.tags
    : (Array.isArray(project.technologies) ? project.technologies : []);
  const image = project.image || project.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";
  const tagline = project.tagline || project.subtitle || project.shortDescription || "";
  const longDescription = project.fullDescription || project.longDescription || project.description || "";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950/95 border border-white/20 shadow-2xl shadow-black p-6 sm:p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all hover:rotate-90 duration-200 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase ${accentClass.badge}`}>
                {project.category}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 font-mono">
                <Calendar className="w-3 h-3" />
                {project.year}
              </span>
            )}
            {project.featured && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                <Sparkles className="w-3 h-3" /> Featured Project
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {project.title}
          </h2>
          {tagline && (
            <p className="text-sm sm:text-base text-zinc-400 mt-1">
              {tagline}
            </p>
          )}
        </div>

        {/* Project Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 aspect-video max-h-72">
          <img
            src={image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Key Metrics grid */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {metrics.map((metric: any, i: number) => {
              const label = typeof metric === 'object' && metric !== null ? metric.label : '';
              const value = typeof metric === 'object' && metric !== null ? (metric.value || metric.title || '') : String(metric);

              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10"
                >
                  <div className={`p-2 rounded-xl ${accentClass.bg}/15 ${accentClass.text}`}>
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    {label && <span className="text-[10px] uppercase font-mono text-zinc-400">{label}</span>}
                    <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Deep Dive Description */}
        {longDescription && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              System Architecture & Impact
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {longDescription}
            </p>
          </div>
        )}

        {/* Key Features list */}
        {features.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-base font-semibold text-white">
              Core Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((feat: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{typeof feat === 'string' ? feat : (feat?.title || feat?.name || String(feat))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack tags */}
        {tags.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-2">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any, tIdx: number) => (
                <span
                  key={tIdx}
                  className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono"
                >
                  {typeof tag === 'string' ? tag : (tag.name || String(tag))}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 mt-2">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r ${accentClass.gradient} shadow-lg hover:opacity-95 transition-all`}
              >
                <span>Live Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-zinc-200 bg-white/10 hover:bg-white/20 border border-white/15 transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
});

ProjectModal.displayName = 'ProjectModal';
